package br.com.inovatech.modules.aluno;

public record AlunoDto(
    Long id,
    String ra,
    String nome,
    String email,
    String cpf,
    String telefone,
    String endereco,
    String curso,
    String semestreIngresso,
    StatusAluno status,
    String fotoUrl
) {
    public static AlunoDto from(Aluno a) {
        return new AlunoDto(
            a.getId(), a.getRa(),
            a.getUsuario().getNome(), a.getUsuario().getEmail(),
            a.getCpf(), a.getTelefone(), a.getEndereco(),
            a.getCurso() != null ? a.getCurso().getNome() : null,
            a.getSemestreIngresso(), a.getStatus(), a.getFotoUrl()
        );
    }
}
