package br.com.inovatech.modules.disciplina;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "disciplina")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Disciplina {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(name = "carga_horaria", nullable = false)
    private Integer cargaHoraria;

    @Column(columnDefinition = "TEXT")
    private String ementa;

    @Column(name = "semestre_sugerido")
    private Integer semestreSugerido;

    @Column(nullable = false)
    private boolean ativo = true;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
