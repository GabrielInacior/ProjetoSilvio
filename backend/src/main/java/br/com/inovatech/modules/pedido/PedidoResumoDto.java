package br.com.inovatech.modules.pedido;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record PedidoResumoDto(
    Long id,
    StatusPedido status,
    BigDecimal valorTotal,
    int quantidadeItens,
    String enderecoEntrega,
    String observacoes,
    LocalDateTime criadoEm,
    List<ItemResumoDto> itens
) {
    public record ItemResumoDto(
        String nome,
        Integer quantidade,
        BigDecimal precoUnitario,
        BigDecimal subtotal
    ) {}

    public static PedidoResumoDto from(Pedido p) {
        List<ItemResumoDto> itensDto = p.getItens().stream()
                .map(i -> new ItemResumoDto(
                        i.getProduto().getNome(),
                        i.getQuantidade(),
                        i.getPrecoUnitario(),
                        i.getSubtotal()))
                .toList();
        return new PedidoResumoDto(
                p.getId(), p.getStatus(), p.getValorTotal(),
                p.getItens().size(), p.getEnderecoEntrega(), p.getObservacoes(),
                p.getCriadoEm(), itensDto);
    }
}
