package br.com.inovatech.modules.notificacao;

import java.time.LocalDateTime;

public record NotificacaoDto(
    Long id,
    String titulo,
    String mensagem,
    TipoNotificacao tipo,
    boolean lida,
    LocalDateTime criadoEm
) {
    public static NotificacaoDto from(Notificacao n) {
        return new NotificacaoDto(n.getId(), n.getTitulo(), n.getMensagem(), n.getTipo(), n.isLida(), n.getCriadoEm());
    }
}
