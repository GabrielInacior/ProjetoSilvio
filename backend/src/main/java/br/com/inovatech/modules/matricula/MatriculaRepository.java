package br.com.inovatech.modules.matricula;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatriculaRepository extends JpaRepository<Matricula, Long> {

    @Query("""
        SELECT m FROM Matricula m
        JOIN FETCH m.turma t
        JOIN FETCH t.disciplina
        JOIN FETCH t.professor p
        JOIN FETCH p.usuario
        WHERE m.aluno.id = :alunoId AND m.status = 'ATIVA'
    """)
    List<Matricula> findAtivasByAlunoId(Long alunoId);

    @Query("""
        SELECT m FROM Matricula m
        JOIN FETCH m.aluno a
        JOIN FETCH a.usuario
        WHERE m.turma.id = :turmaId AND m.status = 'ATIVA'
    """)
    List<Matricula> findAtivasByTurmaId(Long turmaId);

    Optional<Matricula> findByAlunoIdAndTurmaId(Long alunoId, Long turmaId);

    boolean existsByAlunoIdAndTurmaId(Long alunoId, Long turmaId);
}
