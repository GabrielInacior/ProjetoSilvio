package br.com.inovatech.modules.avaliacao;

import br.com.inovatech.modules.matricula.Matricula;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "nota")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Nota {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "matricula_id", nullable = false)
    private Matricula matricula;

    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(columnDefinition = "tipo_nota", nullable = false)
    private TipoNota tipo;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal peso = BigDecimal.ONE;

    @Column(length = 100)
    private String descricao;

    @Column(name = "data_avaliacao")
    private LocalDate dataAvaliacao;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
