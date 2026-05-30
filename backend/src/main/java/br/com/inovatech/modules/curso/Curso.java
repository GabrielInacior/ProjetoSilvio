package br.com.inovatech.modules.curso;

import br.com.inovatech.modules.professor.Professor;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "curso")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Curso {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nome;

    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    @Column(nullable = false, unique = true, length = 20)
    private String codigo;

    @Column(name = "duracao_semestres", nullable = false)
    private Integer duracaoSemestres = 6;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(name = "imagem_url")
    private String imagemUrl;

    @Column(nullable = false)
    private boolean ativo = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordenador_id")
    private Professor coordenador;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
