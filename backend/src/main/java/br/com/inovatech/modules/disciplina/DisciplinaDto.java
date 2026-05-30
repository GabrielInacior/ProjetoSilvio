package br.com.inovatech.modules.disciplina;

public record DisciplinaDto(
    Long id,
    String nome,
    String codigo,
    Integer cargaHoraria,
    String ementa,
    Integer semestreSugerido,
    boolean ativo
) {
    public static DisciplinaDto from(Disciplina d) {
        return new DisciplinaDto(d.getId(), d.getNome(), d.getCodigo(),
                d.getCargaHoraria(), d.getEmenta(), d.getSemestreSugerido(), d.isAtivo());
    }
}
