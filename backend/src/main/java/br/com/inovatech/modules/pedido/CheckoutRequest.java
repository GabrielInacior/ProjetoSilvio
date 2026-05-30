package br.com.inovatech.modules.pedido;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CheckoutRequest(
    @NotEmpty List<ItemRequest> itens,
    String enderecoEntrega,
    String observacoes
) {
    public record ItemRequest(
        @NotNull Long produtoId,
        @NotNull @Min(1) Integer quantidade
    ) {}
}
