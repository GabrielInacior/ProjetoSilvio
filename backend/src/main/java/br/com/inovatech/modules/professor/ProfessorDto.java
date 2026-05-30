package br.com.inovatech.modules.professor;

public record ProfessorDto(
    Long id,
    String nome,
    String email,
    String siape,
    String cpf,
    Titulacao titulacao,
    String telefone,
    String lattes,
    String fotoUrl
) {
    public static ProfessorDto from(Professor p) {
        return new ProfessorDto(p.getId(), p.getUsuario().getNome(), p.getUsuario().getEmail(),
                p.getSiape(), p.getCpf(), p.getTitulacao(), p.getTelefone(), p.getLattes(), p.getFotoUrl());
    }
}
