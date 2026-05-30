package br.com.inovatech.modules.post;

import java.time.LocalDateTime;

public record PostDto(
    Long id,
    String titulo,
    String slug,
    String resumo,
    String conteudoMd,
    String imagemCapa,
    String autor,
    boolean publicado,
    LocalDateTime publicadoEm,
    String[] tags
) {
    public static PostDto from(Post p) {
        return new PostDto(p.getId(), p.getTitulo(), p.getSlug(), p.getResumo(),
                p.getConteudoMd(), p.getImagemCapa(), p.getAutor(), p.isPublicado(),
                p.getPublicadoEm(), p.getTags());
    }
}
