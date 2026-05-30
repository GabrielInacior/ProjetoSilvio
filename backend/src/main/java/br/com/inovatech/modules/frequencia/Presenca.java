package br.com.inovatech.modules.frequencia;

import br.com.inovatech.modules.aluno.Aluno;
import br.com.inovatech.modules.aula.Aula;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "presenca",
    uniqueConstraints = @UniqueConstraint(columnNames = {"aula_id", "aluno_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Presenca {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_id", nullable = false)
    private Aula aula;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @Column(nullable = false)
    private boolean presente = false;

    @Column(name = "registrado_em", nullable = false, updatable = false)
    private LocalDateTime registradoEm = LocalDateTime.now();
}
