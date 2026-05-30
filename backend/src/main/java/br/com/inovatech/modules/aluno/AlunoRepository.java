package br.com.inovatech.modules.aluno;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

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

    @Query(value = """
        SELECT a FROM Aluno a JOIN FETCH a.usuario u
        WHERE (:search = '' OR LOWER(u.nome) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.ra) LIKE LOWER(CONCAT('%', :search, '%')))
        """,
        countQuery = """
        SELECT COUNT(a) FROM Aluno a JOIN a.usuario u
        WHERE (:search = '' OR LOWER(u.nome) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.ra) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Aluno> searchAll(@Param("search") String search, Pageable pageable);
}
