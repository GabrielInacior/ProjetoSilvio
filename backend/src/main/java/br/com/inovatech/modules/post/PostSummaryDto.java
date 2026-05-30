package br.com.inovatech.modules.post;

import java.time.LocalDateTime;

public record PostSummaryDto(
    Long id,
    String titulo,
    String slug,
    String resumo,
    String imagemCapa,
    String autor,
    LocalDateTime publicadoEm,
    String[] tags
) {
    public static PostSummaryDto from(Post p) {
        return new PostSummaryDto(p.getId(), p.getTitulo(), p.getSlug(), p.getResumo(),
                p.getImagemCapa(), p.getAutor(), p.getPublicadoEm(), p.getTags());
    }
}
