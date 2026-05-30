package br.com.inovatech.modules.professor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByUsuarioId(Long usuarioId);
    Optional<Professor> findBySiape(String siape);
    boolean existsBySiape(String siape);
    boolean existsByCpf(String cpf);
}
