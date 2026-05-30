package br.com.inovatech.modules.aula;

import java.time.LocalDate;

public record AulaDto(
    Long id,
    Long turmaId,
    LocalDate data,
    String horaInicio,
    String horaFim,
    String tema,
    String conteudo,
    StatusAula status
) {
    public static AulaDto from(Aula a) {
        return new AulaDto(a.getId(), a.getTurma().getId(), a.getData(),
                a.getHoraInicio(), a.getHoraFim(), a.getTema(), a.getConteudo(), a.getStatus());
    }
}
