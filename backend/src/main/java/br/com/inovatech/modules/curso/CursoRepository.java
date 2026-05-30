package br.com.inovatech.modules.curso;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    Optional<Curso> findBySlug(String slug);
    Optional<Curso> findByCodigo(String codigo);
    List<Curso> findByAtivoTrue();
}
