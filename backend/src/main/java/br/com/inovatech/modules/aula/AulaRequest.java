package br.com.inovatech.modules.aula;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AulaRequest(
    @NotNull LocalDate data,
    @NotBlank String horaInicio,
    @NotBlank String horaFim,
    String tema,
    String conteudo
) {}
