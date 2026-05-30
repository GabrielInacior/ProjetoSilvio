package br.com.inovatech.modules.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findBySlugAndPublicadoTrue(String slug);
    Page<Post> findByPublicadoTrueOrderByPublicadoEmDesc(Pageable pageable);
    Page<Post> findByPublicadoTrueAndTituloContainingIgnoreCase(String titulo, Pageable pageable);
}
