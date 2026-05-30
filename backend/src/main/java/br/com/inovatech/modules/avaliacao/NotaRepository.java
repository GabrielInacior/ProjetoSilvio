package br.com.inovatech.modules.avaliacao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {

    List<Nota> findByMatriculaId(Long matriculaId);

    @Query("""
        SELECT n FROM Nota n
        JOIN FETCH n.matricula m
        JOIN FETCH m.turma t
        JOIN FETCH t.disciplina
        JOIN FETCH m.aluno a
        JOIN FETCH a.usuario
        WHERE m.aluno.id = :alunoId
        ORDER BY n.dataAvaliacao DESC
    """)
    List<Nota> findByAlunoId(Long alunoId);

    @Query("""
        SELECT n FROM Nota n
        JOIN FETCH n.matricula m
        JOIN FETCH m.turma t
        JOIN FETCH t.disciplina
        JOIN FETCH m.aluno a
        JOIN FETCH a.usuario
        WHERE m.turma.id = :turmaId
        ORDER BY a.ra, n.tipo
    """)
    List<Nota> findByTurmaId(Long turmaId);
}
