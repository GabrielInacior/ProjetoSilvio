package br.com.inovatech.modules.pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResumoDto(
    Long id,
    StatusPedido status,
    BigDecimal valorTotal,
    int quantidadeItens,
    LocalDateTime criadoEm
) {
    public static PedidoResumoDto from(Pedido p) {
        return new PedidoResumoDto(p.getId(), p.getStatus(), p.getValorTotal(),
                p.getItens().size(), p.getCriadoEm());
    }
}
