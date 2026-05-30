package br.com.inovatech.modules.aluno;

import br.com.inovatech.modules.curso.Curso;
import br.com.inovatech.modules.usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "aluno")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Aluno {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 20)
    private String ra;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 20)
    private String telefone;

    @Column(length = 200)
    private String endereco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "curso_id")
    private Curso curso;

    @Column(name = "semestre_ingresso", length = 10)
    private String semestreIngresso;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "status_aluno", nullable = false)
    private StatusAluno status = StatusAluno.ATIVO;

    @Column(name = "foto_url")
    private String fotoUrl;

    @Version
    private Long version;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
