package br.com.inovatech.modules.aula;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {

    List<Aula> findByTurmaIdOrderByDataAsc(Long turmaId);

    @Query("""
        SELECT a FROM Aula a
        WHERE a.turma.professor.id = :professorId
          AND a.data BETWEEN :inicio AND :fim
        ORDER BY a.data, a.horaInicio
    """)
    List<Aula> findByProfessorIdAndPeriodo(Long professorId, LocalDate inicio, LocalDate fim);

    @Query("""
        SELECT DISTINCT a FROM Aula a
        JOIN a.turma t
        JOIN t.matricula m
        WHERE m.aluno.id = :alunoId
          AND a.data BETWEEN :inicio AND :fim
        ORDER BY a.data
    """)
    List<Aula> findByAlunoIdAndPeriodo(Long alunoId, LocalDate inicio, LocalDate fim);
}
