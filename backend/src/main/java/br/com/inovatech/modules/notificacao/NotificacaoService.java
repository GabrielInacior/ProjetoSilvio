package br.com.inovatech.modules.notificacao;

import br.com.inovatech.modules.usuario.Usuario;
import br.com.inovatech.modules.usuario.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepo;
    private final UsuarioRepository usuarioRepo;
    private final SimpMessagingTemplate messagingTemplate;

    /** Envia notificação individual para um usuário e persiste. */
    @Async
    @Transactional
    public void notificar(Long usuarioId, String titulo, String mensagem, TipoNotificacao tipo) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new EntityNotFoundException("Usuário " + usuarioId));

        Notificacao n = Notificacao.builder()
                .usuario(usuario)
                .titulo(titulo)
                .mensagem(mensagem)
                .tipo(tipo)
                .build();
        notificacaoRepo.save(n);

        NotificacaoDto dto = NotificacaoDto.from(n);
        messagingTemplate.convertAndSendToUser(usuario.getEmail(), "/queue/notificacoes", dto);
    }

    /** Envia aviso geral (broadcast) e persiste sem vínculo de usuário. */
    @Async
    @Transactional
    public void broadcast(String titulo, String mensagem) {
        Notificacao n = Notificacao.builder()
                .titulo(titulo)
                .mensagem(mensagem)
                .tipo(TipoNotificacao.AVISO_GERAL)
                .build();
        notificacaoRepo.save(n);

        NotificacaoDto dto = NotificacaoDto.from(n);
        messagingTemplate.convertAndSend("/topic/avisos-gerais", dto);
    }

    @Transactional(readOnly = true)
    public Page<NotificacaoDto> listar(Long usuarioId, Pageable pageable) {
        return notificacaoRepo.findByUsuarioIdOrBroadcast(usuarioId, pageable)
                .map(NotificacaoDto::from);
    }

    @Transactional(readOnly = true)
    public long countNaoLidas(Long usuarioId) {
        return notificacaoRepo.countByUsuarioIdAndLidaFalse(usuarioId);
    }

    @Transactional
    public void marcarLida(Long notificacaoId, Long usuarioId) {
        Notificacao n = notificacaoRepo.findById(notificacaoId)
                .orElseThrow(() -> new EntityNotFoundException("Notificação " + notificacaoId));
        if (n.getUsuario() != null && !n.getUsuario().getId().equals(usuarioId)) {
            throw new SecurityException("Acesso negado");
        }
        n.marcarLida();
    }

    @Transactional
    public int marcarTodasLidas(Long usuarioId) {
        return notificacaoRepo.marcarTodasComoLidas(usuarioId);
    }
}
