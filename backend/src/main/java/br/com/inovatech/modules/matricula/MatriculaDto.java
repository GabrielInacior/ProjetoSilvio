package br.com.inovatech.modules.matricula;

public record MatriculaDto(
    Long id,
    String disciplina,
    String professor,
    String sala,
    String horario,
    StatusMatricula status
) {
    public static MatriculaDto from(Matricula m) {
        var t = m.getTurma();
        String horario = t.getDiaSemana() + " " + t.getHoraInicio() + "-" + t.getHoraFim();
        String professor = t.getProfessor().getUsuario().getNome();
        return new MatriculaDto(m.getId(), t.getDisciplina().getNome(), professor,
                t.getSala(), horario, m.getStatus());
    }
}
