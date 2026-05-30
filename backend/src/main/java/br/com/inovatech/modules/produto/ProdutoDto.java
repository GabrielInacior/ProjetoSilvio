package br.com.inovatech.modules.produto;

import java.math.BigDecimal;

public record ProdutoDto(
    Long id,
    String nome,
    String slug,
    String descricao,
    BigDecimal preco,
    Integer estoque,
    String imagemUrl,
    CategoriaProduto categoria,
    boolean ativo
) {
    public static ProdutoDto from(Produto p) {
        return new ProdutoDto(p.getId(), p.getNome(), p.getSlug(), p.getDescricao(),
                p.getPreco(), p.getEstoque(), p.getImagemUrl(), p.getCategoria(), p.isAtivo());
    }
}
