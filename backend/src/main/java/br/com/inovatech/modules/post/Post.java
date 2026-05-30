package br.com.inovatech.modules.post;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "post")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Post {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(nullable = false, unique = true, length = 250)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String resumo;

    @Column(name = "conteudo_md", columnDefinition = "TEXT", nullable = false)
    private String conteudoMd;

    @Column(name = "imagem_capa")
    private String imagemCapa;

    @Column(length = 100)
    private String autor;

    @Column(nullable = false)
    private boolean publicado = true;

    @Column(name = "publicado_em")
    private LocalDateTime publicadoEm;

    @Column(columnDefinition = "TEXT[]")
    private String[] tags;

    @Version
    private Long version;

    @CreationTimestamp
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @UpdateTimestamp
    @Column(name = "atualizado_em", nullable = false)
    private LocalDateTime atualizadoEm;
}
