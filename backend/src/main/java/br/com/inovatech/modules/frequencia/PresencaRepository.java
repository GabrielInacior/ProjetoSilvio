package br.com.inovatech.modules.frequencia;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PresencaRepository extends JpaRepository<Presenca, Long> {

    List<Presenca> findByAulaId(Long aulaId);

    Optional<Presenca> findByAulaIdAndAlunoId(Long aulaId, Long alunoId);

    @Query("""
        SELECT p FROM Presenca p
        JOIN FETCH p.aula a
        WHERE p.aluno.id = :alunoId
          AND a.turma.id = :turmaId
        ORDER BY a.data
    """)
    List<Presenca> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    @Query("""
        SELECT COUNT(p) FROM Presenca p
        WHERE p.aluno.id = :alunoId
          AND p.aula.turma.id = :turmaId
          AND p.presente = true
    """)
    Long countPresencasByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    @Query("""
        SELECT p FROM Presenca p
        JOIN FETCH p.aula a
        JOIN FETCH a.turma t
        JOIN FETCH t.disciplina
        WHERE p.aluno.id = :alunoId
        ORDER BY a.data
    """)
    List<Presenca> findAllByAlunoId(Long alunoId);
}
