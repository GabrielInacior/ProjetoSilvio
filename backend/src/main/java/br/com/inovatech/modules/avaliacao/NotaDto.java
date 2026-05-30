package br.com.inovatech.modules.avaliacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NotaDto(
    Long id,
    Long matriculaId,
    String disciplina,
    TipoNota tipo,
    BigDecimal valor,
    BigDecimal peso,
    String descricao,
    LocalDate dataAvaliacao
) {
    public static NotaDto from(Nota n) {
        String disc = n.getMatricula().getTurma().getDisciplina().getNome();
        return new NotaDto(n.getId(), n.getMatricula().getId(), disc,
                n.getTipo(), n.getValor(), n.getPeso(), n.getDescricao(), n.getDataAvaliacao());
    }
}
