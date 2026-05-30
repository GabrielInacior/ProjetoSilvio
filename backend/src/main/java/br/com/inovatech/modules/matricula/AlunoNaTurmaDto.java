package br.com.inovatech.modules.matricula;

public record AlunoNaTurmaDto(
    Long id,
    String ra,
    String nome,
    String email,
    StatusMatricula status
) {
    public static AlunoNaTurmaDto from(Matricula m) {
        var a = m.getAluno();
        return new AlunoNaTurmaDto(
            a.getId(), a.getRa(),
            a.getUsuario().getNome(), a.getUsuario().getEmail(),
            m.getStatus()
        );
    }
}
