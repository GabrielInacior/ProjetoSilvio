package br.com.inovatech.modules.turma;

import java.time.LocalDate;

public record TurmaDto(
    Long id,
    String disciplina,
    String professor,
    Integer ano,
    SemestreEnum semestre,
    String sala,
    Integer vagas,
    DiaSemana diaSemana,
    String horaInicio,
    String horaFim,
    LocalDate dataInicio,
    LocalDate dataFim,
    StatusTurma status
) {
    public static TurmaDto from(Turma t) {
        String profNome = t.getProfessor() != null ? t.getProfessor().getUsuario().getNome() : null;
        return new TurmaDto(t.getId(), t.getDisciplina().getNome(),
                profNome, t.getAno(), t.getSemestre(),
                t.getSala(), t.getVagas(), t.getDiaSemana(), t.getHoraInicio(), t.getHoraFim(),
                t.getDataInicio(), t.getDataFim(), t.getStatus());
    }
}
