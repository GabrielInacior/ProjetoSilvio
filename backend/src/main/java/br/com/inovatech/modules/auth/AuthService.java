package br.com.inovatech.modules.auth;

import br.com.inovatech.infra.exception.BusinessException;
import br.com.inovatech.infra.mail.MailService;
import br.com.inovatech.infra.security.JwtService;
import br.com.inovatech.modules.aluno.Aluno;
import br.com.inovatech.modules.aluno.AlunoRepository;
import br.com.inovatech.modules.curso.CursoRepository;
import br.com.inovatech.modules.professor.Professor;
import br.com.inovatech.modules.professor.ProfessorRepository;
import br.com.inovatech.modules.professor.Titulacao;
import br.com.inovatech.modules.usuario.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepo;
    private final SessionRepository sessionRepo;
    private final PasswordResetTokenRepository resetTokenRepo;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final AlunoRepository alunoRepo;
    private final ProfessorRepository professorRepo;
    private final CursoRepository cursoRepo;

    @Value("${app.front-url}")
    private String frontUrl;

    @Transactional
    public AuthResponse login(LoginRequest req, HttpServletRequest httpRequest) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.senha()));

        Usuario usuario = usuarioRepo.findByEmail(req.email())
                .orElseThrow(() -> new BadCredentialsException("User not found"));

        String accessToken  = jwtService.generateAccessToken(usuario.getEmail(), usuario.getTipo().name());
        String refreshToken = jwtService.generateRefreshToken(usuario.getEmail());

        Session session = Session.builder()
                .usuario(usuario)
                .accessTokenHash(jwtService.hashToken(accessToken))
                .refreshTokenHash(jwtService.hashToken(refreshToken))
                .userAgent(httpRequest.getHeader("User-Agent"))
                .ip(httpRequest.getRemoteAddr())
                .expiraEm(LocalDateTime.now().plusSeconds(jwtService.getRefreshExpiration()))
                .build();
        sessionRepo.save(session);

        return new AuthResponse(accessToken, refreshToken, UsuarioDto.from(usuario));
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        if (!jwtService.isValid(refreshToken)) {
            throw new BusinessException("Refresh token inválido ou expirado");
        }
        String hash = jwtService.hashToken(refreshToken);
        Session session = sessionRepo.findByRefreshTokenHashAndRevogadoFalse(hash)
                .orElseThrow(() -> new BusinessException("Sessão não encontrada ou revogada"));

        if (session.getExpiraEm().isBefore(LocalDateTime.now())) {
            session.setRevogado(true);
            throw new BusinessException("Sessão expirada");
        }

        String email   = jwtService.extractEmail(refreshToken);
        Usuario usuario = usuarioRepo.findByEmail(email).orElseThrow();

        String newAccess  = jwtService.generateAccessToken(email, usuario.getTipo().name());
        String newRefresh = jwtService.generateRefreshToken(email);

        session.setAccessTokenHash(jwtService.hashToken(newAccess));
        session.setRefreshTokenHash(jwtService.hashToken(newRefresh));
        session.setExpiraEm(LocalDateTime.now().plusSeconds(jwtService.getRefreshExpiration()));

        return new AuthResponse(newAccess, newRefresh, UsuarioDto.from(usuario));
    }

    @Transactional
    public void logout(String accessToken) {
        String hash = jwtService.hashToken(accessToken);
        sessionRepo.findByAccessTokenHashAndRevogadoFalse(hash).ifPresent(s -> s.setRevogado(true));
    }

    @Transactional
    public AuthResponse register(RegisterRequest req, HttpServletRequest httpRequest) {
        if (usuarioRepo.existsByEmail(req.email())) {
            throw new BusinessException("E-mail já cadastrado.");
        }

        TipoUsuario tipo = switch (req.tipo().toUpperCase()) {
            case "PROFESSOR" -> TipoUsuario.PROFESSOR;
            default          -> TipoUsuario.ALUNO;
        };

        Usuario usuario = Usuario.builder()
                .nome(req.nome().trim())
                .email(req.email().toLowerCase().trim())
                .senhaHash(passwordEncoder.encode(req.senha()))
                .tipo(tipo)
                .ativo(true)
                .senhaProvisoria(false)
                .build();
        usuarioRepo.save(usuario);

        if (tipo == TipoUsuario.ALUNO) {
            if (alunoRepo.existsByCpf(req.cpf())) {
                throw new BusinessException("CPF já cadastrado.");
            }
            var curso = req.cursoId() != null
                    ? cursoRepo.findById(req.cursoId()).orElse(null)
                    : null;

            String ra = gerarRa();
            Aluno aluno = Aluno.builder()
                    .usuario(usuario)
                    .ra(ra)
                    .cpf(req.cpf())
                    .telefone(req.telefone())
                    .curso(curso)
                    .semestreIngresso(Year.now() + ".1")
                    .build();
            alunoRepo.save(aluno);

        } else {
            if (professorRepo.existsByCpf(req.cpf())) {
                throw new BusinessException("CPF já cadastrado.");
            }
            String siape = (req.siape() != null && !req.siape().isBlank())
                    ? req.siape().trim()
                    : "SIAPE" + System.currentTimeMillis() % 100000;

            Titulacao titulacao = req.titulacao() != null
                    ? Titulacao.valueOf(req.titulacao().toUpperCase())
                    : Titulacao.GRADUACAO;

            Professor prof = Professor.builder()
                    .usuario(usuario)
                    .siape(siape)
                    .cpf(req.cpf())
                    .titulacao(titulacao)
                    .telefone(req.telefone())
                    .build();
            professorRepo.save(prof);
        }

        // Auto-login após cadastro
        String accessToken  = jwtService.generateAccessToken(usuario.getEmail(), usuario.getTipo().name());
        String refreshToken = jwtService.generateRefreshToken(usuario.getEmail());

        Session session = Session.builder()
                .usuario(usuario)
                .accessTokenHash(jwtService.hashToken(accessToken))
                .refreshTokenHash(jwtService.hashToken(refreshToken))
                .userAgent(httpRequest.getHeader("User-Agent"))
                .ip(httpRequest.getRemoteAddr())
                .expiraEm(LocalDateTime.now().plusSeconds(jwtService.getRefreshExpiration()))
                .build();
        sessionRepo.save(session);

        return new AuthResponse(accessToken, refreshToken, UsuarioDto.from(usuario));
    }

    private String gerarRa() {
        int ano = Year.now().getValue();
        long seq = (alunoRepo.count() + 1);
        return String.format("%d%03d", ano, seq);
    }

    @Transactional
    public void forgotPassword(String email) {
        usuarioRepo.findByEmail(email).ifPresent(usuario -> {
            resetTokenRepo.deleteByUsuarioId(usuario.getId());

            byte[] tokenBytes = new byte[32];
            new SecureRandom().nextBytes(tokenBytes);
            String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(tokenBytes);
            String tokenHash = jwtService.hashToken(rawToken);

            PasswordResetToken prt = PasswordResetToken.builder()
                    .usuario(usuario)
                    .tokenHash(tokenHash)
                    .expiraEm(LocalDateTime.now().plusHours(1))
                    .build();
            resetTokenRepo.save(prt);

            String link = frontUrl + "/redefinir-senha?token=" + rawToken;
            mailService.sendPasswordReset(usuario.getEmail(), usuario.getNome(), link);
        });
    }

    @Transactional
    public void resetPassword(String rawToken, String novaSenha) {
        String hash = jwtService.hashToken(rawToken);
        PasswordResetToken prt = resetTokenRepo.findByTokenHash(hash)
                .orElseThrow(() -> new BusinessException("Token inválido"));

        if (prt.isUsado())     throw new BusinessException("Token já utilizado");
        if (prt.isExpirado())  throw new BusinessException("Token expirado");

        prt.getUsuario().setSenhaHash(passwordEncoder.encode(novaSenha));
        prt.setUsadoEm(LocalDateTime.now());
        sessionRepo.revogarTodasSessoes(prt.getUsuario().getId());
    }
}
