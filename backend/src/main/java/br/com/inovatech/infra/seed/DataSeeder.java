package br.com.inovatech.infra.seed;

import br.com.inovatech.modules.aluno.*;
import br.com.inovatech.modules.curso.Curso;
import br.com.inovatech.modules.curso.CursoRepository;
import br.com.inovatech.modules.disciplina.Disciplina;
import br.com.inovatech.modules.disciplina.DisciplinaRepository;
import br.com.inovatech.modules.matricula.*;
import br.com.inovatech.modules.notificacao.*;
import br.com.inovatech.modules.professor.*;
import br.com.inovatech.modules.turma.*;
import br.com.inovatech.modules.usuario.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

/**
 * Cria dados de demonstração na primeira inicialização.
 * Executado automaticamente após as migrações Flyway.
 *
 * Credenciais criadas:
 *   admin@inovatech.com         / Admin@123   (ADMIN)
 *   carlos.mendes@inovatech.com / Senha@123   (PROFESSOR)
 *   ana.paula@inovatech.com     / Senha@123   (PROFESSOR)
 *   joao.silva@aluno.com        / Senha@123   (ALUNO)
 *   maria.santos@aluno.com      / Senha@123   (ALUNO)
 *   pedro.oliveira@aluno.com    / Senha@123   (ALUNO)
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UsuarioRepository    usuarioRepo;
    private final AlunoRepository      alunoRepo;
    private final ProfessorRepository  professorRepo;
    private final CursoRepository      cursoRepo;
    private final DisciplinaRepository disciplinaRepo;
    private final TurmaRepository      turmaRepo;
    private final MatriculaRepository  matriculaRepo;
    private final NotificacaoRepository notificacaoRepo;
    private final PasswordEncoder      passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (usuarioRepo.existsByEmail("admin@inovatech.com")) {
            log.info("[DataSeeder] Dados de seed já existem. Pulando.");
            return;
        }

        log.info("[DataSeeder] Iniciando criação dos dados de demonstração...");

        // ── ADMIN ──────────────────────────────────────────────────────────
        Usuario admin = criarUsuario("Administrador Inovatech",
                "admin@inovatech.com", "Admin@123", TipoUsuario.ADMIN);

        // ── PROFESSORES ────────────────────────────────────────────────────
        Usuario uProf1 = criarUsuario("Carlos Mendes",
                "carlos.mendes@inovatech.com", "Senha@123", TipoUsuario.PROFESSOR);
        Professor prof1 = criarProfessor(uProf1, "DEMO001", "111.222.333-44",
                Titulacao.DOUTORADO, "(11) 91111-2222");

        Usuario uProf2 = criarUsuario("Ana Paula Ferreira",
                "ana.paula@inovatech.com", "Senha@123", TipoUsuario.PROFESSOR);
        Professor prof2 = criarProfessor(uProf2, "DEMO002", "222.333.444-55",
                Titulacao.MESTRADO, "(11) 92222-3333");

        // ── VINCULAR COORDENADORES AOS CURSOS ─────────────────────────────
        cursoRepo.findBySlug("engenharia-de-software")
                .ifPresent(c -> { c.setCoordenador(prof1); cursoRepo.save(c); });
        cursoRepo.findBySlug("sistemas-de-informacao")
                .ifPresent(c -> { c.setCoordenador(prof2); cursoRepo.save(c); });

        // ── ALUNOS ─────────────────────────────────────────────────────────
        Curso esw = cursoRepo.findBySlug("engenharia-de-software").orElse(null);
        Curso si  = cursoRepo.findBySlug("sistemas-de-informacao").orElse(null);

        Usuario uAluno1 = criarUsuario("João Silva",
                "joao.silva@aluno.com", "Senha@123", TipoUsuario.ALUNO);
        Aluno aluno1 = criarAluno(uAluno1, "333.444.555-66",
                LocalDate.of(2002, 3, 15), "(11) 93333-4444", esw);

        Usuario uAluno2 = criarUsuario("Maria Santos",
                "maria.santos@aluno.com", "Senha@123", TipoUsuario.ALUNO);
        Aluno aluno2 = criarAluno(uAluno2, "444.555.666-77",
                LocalDate.of(2003, 7, 22), "(11) 94444-5555", esw);

        Usuario uAluno3 = criarUsuario("Pedro Oliveira",
                "pedro.oliveira@aluno.com", "Senha@123", TipoUsuario.ALUNO);
        Aluno aluno3 = criarAluno(uAluno3, "555.666.777-88",
                LocalDate.of(2001, 11, 5), "(11) 95555-6666", si);

        // ── TURMAS ─────────────────────────────────────────────────────────
        disciplinaRepo.findByCodigo("POO001").ifPresent(disc -> {
            Turma turma = criarTurma(disc, prof1, SemestreEnum.PRIMEIRO,
                    DiaSemana.TER, "08:00", "10:00", "Sala 101");
            matricularAluno(aluno1, turma);
            matricularAluno(aluno2, turma);
        });

        disciplinaRepo.findByCodigo("BDI001").ifPresent(disc -> {
            Turma turma = criarTurma(disc, prof1, SemestreEnum.PRIMEIRO,
                    DiaSemana.QUI, "10:00", "12:00", "Lab 201");
            matricularAluno(aluno1, turma);
            matricularAluno(aluno3, turma);
        });

        disciplinaRepo.findByCodigo("ESW001").ifPresent(disc -> {
            Turma turma = criarTurma(disc, prof2, SemestreEnum.PRIMEIRO,
                    DiaSemana.SEG, "14:00", "16:00", "Sala 305");
            matricularAluno(aluno2, turma);
            matricularAluno(aluno3, turma);
        });

        // ── NOTIFICAÇÕES DE BOAS-VINDAS ────────────────────────────────────
        List.of(uAluno1, uAluno2, uAluno3).forEach(u ->
            notificar(u, "Bem-vindo ao Inovatech!",
                    "Sua conta foi criada com sucesso. Acesse seu boletim e grade de aulas no menu lateral.",
                    TipoNotificacao.INFO)
        );
        notificar(null, "Portal Inovatech disponível",
                "O novo portal acadêmico está no ar. Acesse e explore todas as funcionalidades!",
                TipoNotificacao.AVISO_GERAL);

        log.info("[DataSeeder] Seed concluído com sucesso.");
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private Usuario criarUsuario(String nome, String email, String senha, TipoUsuario tipo) {
        Usuario u = new Usuario();
        u.setNome(nome);
        u.setEmail(email);
        u.setSenhaHash(passwordEncoder.encode(senha));
        u.setTipo(tipo);
        u.setAtivo(true);
        u.setSenhaProvisoria(false);
        return usuarioRepo.save(u);
    }

    private Professor criarProfessor(Usuario usuario, String siape, String cpf,
                                     Titulacao titulacao, String telefone) {
        Professor p = new Professor();
        p.setUsuario(usuario);
        p.setSiape(siape);
        p.setCpf(cpf);
        p.setTitulacao(titulacao);
        p.setTelefone(telefone);
        return professorRepo.save(p);
    }

    private Aluno criarAluno(Usuario usuario, String cpf, LocalDate dataNascimento,
                             String telefone, Curso curso) {
        long seq = alunoRepo.count() + 1;
        String ra = String.format("%d%03d", Year.now().getValue(), seq);

        Aluno a = new Aluno();
        a.setUsuario(usuario);
        a.setRa(ra);
        a.setCpf(cpf);
        a.setDataNascimento(dataNascimento);
        a.setTelefone(telefone);
        a.setCurso(curso);
        a.setSemestreIngresso(Year.now().getValue() + ".1");
        a.setStatus(StatusAluno.ATIVO);
        return alunoRepo.save(a);
    }

    private Turma criarTurma(Disciplina disciplina, Professor professor,
                             SemestreEnum semestre, DiaSemana dia,
                             String horaInicio, String horaFim, String sala) {
        Turma t = new Turma();
        t.setDisciplina(disciplina);
        t.setProfessor(professor);
        t.setAno(Year.now().getValue());
        t.setSemestre(semestre);
        t.setSala(sala);
        t.setVagas(40);
        t.setDiaSemana(dia);
        t.setHoraInicio(horaInicio);
        t.setHoraFim(horaFim);
        t.setDataInicio(LocalDate.of(Year.now().getValue(), 2, 1));
        t.setDataFim(LocalDate.of(Year.now().getValue(), 7, 31));
        t.setStatus(StatusTurma.ATIVA);
        t.setCriadoEm(LocalDateTime.now());
        return turmaRepo.save(t);
    }

    private void matricularAluno(Aluno aluno, Turma turma) {
        Matricula m = new Matricula();
        m.setAluno(aluno);
        m.setTurma(turma);
        m.setStatus(StatusMatricula.ATIVA);
        m.setCriadoEm(LocalDateTime.now());
        matriculaRepo.save(m);
    }

    private void notificar(Usuario usuario, String titulo, String mensagem, TipoNotificacao tipo) {
        Notificacao n = new Notificacao();
        n.setUsuario(usuario);
        n.setTitulo(titulo);
        n.setMensagem(mensagem);
        n.setTipo(tipo);
        n.setLida(false);
        n.setCriadoEm(LocalDateTime.now());
        notificacaoRepo.save(n);
    }
}
