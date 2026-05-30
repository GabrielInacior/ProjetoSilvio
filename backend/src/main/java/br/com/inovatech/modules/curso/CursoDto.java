package br.com.inovatech.modules.curso;

public record CursoDto(
    Long id,
    String nome,
    String slug,
    String codigo,
    Integer duracaoSemestres,
    String descricao,
    String imagemUrl,
    boolean ativo
) {
    public static CursoDto from(Curso c) {
        return new CursoDto(c.getId(), c.getNome(), c.getSlug(), c.getCodigo(),
                c.getDuracaoSemestres(), c.getDescricao(), c.getImagemUrl(), c.isAtivo());
    }
}
