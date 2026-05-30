package br.com.inovatech.modules.evento;

import java.time.LocalDateTime;

public record EventoDto(
    Long id,
    String titulo,
    String descricao,
    LocalDateTime dataInicio,
    LocalDateTime dataFim,
    String local,
    String imagemUrl,
    boolean publico
) {
    public static EventoDto from(EventoInstitucional e) {
        return new EventoDto(e.getId(), e.getTitulo(), e.getDescricao(),
                e.getDataInicio(), e.getDataFim(), e.getLocal(), e.getImagemUrl(), e.isPublico());
    }
}
