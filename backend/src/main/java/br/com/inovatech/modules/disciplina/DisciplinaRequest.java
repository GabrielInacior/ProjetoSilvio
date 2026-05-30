package br.com.inovatech.modules.disciplina;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DisciplinaRequest(
    @NotBlank String nome,
    @NotBlank String codigo,
    @NotNull Integer cargaHoraria,
    String ementa,
    Integer semestreSugerido
) {}
