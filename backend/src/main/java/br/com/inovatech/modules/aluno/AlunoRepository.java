package br.com.inovatech.modules.aluno;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Optional<Aluno> findByUsuarioId(Long usuarioId);
    Optional<Aluno> findByRa(String ra);
    boolean existsByRa(String ra);
    boolean existsByCpf(String cpf);

    @Query("SELECT a FROM Aluno a JOIN FETCH a.usuario WHERE a.usuario.id = :usuarioId")
    Optional<Aluno> findByUsuarioIdWithUsuario(Long usuarioId);

    @Query("SELECT a FROM Aluno a JOIN FETCH a.usuario WHERE a.usuario.email = :email")
    Optional<Aluno> findByUsuarioEmail(String email);
}
