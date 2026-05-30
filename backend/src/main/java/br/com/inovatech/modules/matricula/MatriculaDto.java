package br.com.inovatech.modules.matricula;

import br.com.inovatech.modules.turma.DiaSemana;
import br.com.inovatech.modules.turma.SemestreEnum;

public record MatriculaDto(
    Long id,
    String disciplina,
    String professor,
    String sala,
    String horario,
    DiaSemana diaSemana,
    String horaInicio,
    String horaFim,
    Integer ano,
    SemestreEnum semestre,
    StatusMatricula status
) {
    public static MatriculaDto from(Matricula m) {
        var t = m.getTurma();
        String horario = t.getDiaSemana() + " " + t.getHoraInicio() + "-" + t.getHoraFim();
        String professor = t.getProfessor() != null ? t.getProfessor().getUsuario().getNome() : null;
        return new MatriculaDto(m.getId(), t.getDisciplina().getNome(), professor,
                t.getSala(), horario, t.getDiaSemana(), t.getHoraInicio(), t.getHoraFim(),
                t.getAno(), t.getSemestre(), m.getStatus());
    }
}
