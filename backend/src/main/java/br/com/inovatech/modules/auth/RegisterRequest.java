package br.com.inovatech.modules.auth;

import jakarta.validation.constraints.*;

public record RegisterRequest(

    /** Tipo do usuário: "ALUNO" ou "PROFESSOR" */
    @NotBlank String tipo,

    // -- Dados comuns --
    @NotBlank @Size(min = 3, max = 150) String nome,

    @NotBlank @Email String email,

    @NotBlank @Size(min = 8, message = "Senha deve ter no mínimo 8 caracteres") String senha,

    @NotBlank @Pattern(regexp = "\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}", message = "CPF inválido") String cpf,

    @NotBlank String telefone,

    // -- Aluno --
    Long cursoId,

    // -- Professor --
    String siape,
    String titulacao
) {}
