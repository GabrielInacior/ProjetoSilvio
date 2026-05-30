package br.com.inovatech.modules.avaliacao;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NotaRequest(
    @NotNull Long alunoId,
    @NotNull TipoNota tipo,
    @NotNull @DecimalMin("0.0") @DecimalMax("10.0") BigDecimal valor,
    BigDecimal peso,
    String descricao,
    LocalDate dataAvaliacao
) {}
