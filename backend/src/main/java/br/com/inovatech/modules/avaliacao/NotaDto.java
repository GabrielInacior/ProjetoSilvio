package br.com.inovatech.modules.avaliacao;

import java.math.BigDecimal;
import java.time.LocalDate;

public record NotaDto(
    Long id,
    Long matriculaId,
    String disciplina,
    String aluno,
    TipoNota tipo,
    BigDecimal valor,
    BigDecimal peso,
    String descricao,
    LocalDate dataAvaliacao
) {
    public static NotaDto from(Nota n) {
        var m = n.getMatricula();
        String disc = m.getTurma().getDisciplina().getNome();
        String alunoNome = m.getAluno() != null ? m.getAluno().getUsuario().getNome() : null;
        return new NotaDto(n.getId(), m.getId(), disc, alunoNome,
                n.getTipo(), n.getValor(), n.getPeso(), n.getDescricao(), n.getDataAvaliacao());
    }
}
