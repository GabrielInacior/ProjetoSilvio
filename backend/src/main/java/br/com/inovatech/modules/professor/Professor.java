package br.com.inovatech.modules.professor;

import br.com.inovatech.modules.usuario.Usuario;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "professor")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Professor {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(nullable = false, unique = true, length = 20)
    private String siape;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "titulacao", nullable = false)
    private Titulacao titulacao;

    @Column(length = 20)
    private String telefone;

    @Column(length = 100)
    private String lattes;

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
