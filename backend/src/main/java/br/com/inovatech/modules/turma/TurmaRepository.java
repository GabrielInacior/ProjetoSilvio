package br.com.inovatech.modules.turma;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TurmaRepository extends JpaRepository<Turma, Long> {

    @Query("""
        SELECT DISTINCT t FROM Turma t
        JOIN FETCH t.disciplina
        JOIN FETCH t.professor p
        JOIN FETCH p.usuario
        WHERE t.professor.id = :professorId
    """)
    List<Turma> findByProfessorId(Long professorId);

    @Query("""
        SELECT t FROM Turma t
        JOIN FETCH t.disciplina
        WHERE t.ano = :ano AND t.semestre = :semestre AND t.status = 'ATIVA'
    """)
    List<Turma> findAtivasByAnoAndSemestre(Integer ano, SemestreEnum semestre);
}
