package br.com.inovatech.modules.turma;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

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

    @Query("""
        SELECT t FROM Turma t
        JOIN FETCH t.disciplina
        WHERE t.professor IS NULL AND t.status = 'ATIVA'
    """)
    List<Turma> findAtivasComProfessorNulo();

    @Query("""
        SELECT t FROM Turma t
        JOIN FETCH t.disciplina
        LEFT JOIN FETCH t.professor p
        LEFT JOIN FETCH p.usuario
        WHERE t.status = 'ATIVA'
        AND t.id NOT IN (
            SELECT m.turma.id FROM Matricula m
            WHERE m.aluno.id = :alunoId AND m.status = 'ATIVA'
        )
        AND NOT EXISTS (
            SELECT m2 FROM Matricula m2
            WHERE m2.aluno.id = :alunoId
            AND m2.status = 'ATIVA'
            AND m2.turma.diaSemana = t.diaSemana
            AND m2.turma.horaInicio < t.horaFim
            AND t.horaInicio < m2.turma.horaFim
        )
    """)
    List<Turma> findDisponiveisParaAluno(Long alunoId);
}
