package br.com.inovatech.modules.professor;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    Optional<Professor> findByUsuarioId(Long usuarioId);
    Optional<Professor> findBySiape(String siape);
    boolean existsBySiape(String siape);
    boolean existsByCpf(String cpf);
}
