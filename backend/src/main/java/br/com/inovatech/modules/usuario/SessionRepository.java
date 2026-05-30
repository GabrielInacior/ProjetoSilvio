package br.com.inovatech.modules.usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    Optional<Session> findByRefreshTokenHashAndRevogadoFalse(String refreshTokenHash);

    List<Session> findByUsuarioIdAndRevogadoFalse(Long usuarioId);

    @Modifying
    @Query("UPDATE Session s SET s.revogado = true WHERE s.usuario.id = :usuarioId")
    void revogarTodasSessoes(Long usuarioId);

    Optional<Session> findByAccessTokenHashAndRevogadoFalse(String accessTokenHash);

    @Modifying
    @Query("DELETE FROM Session s WHERE s.expiraEm < :now OR (s.revogado = true AND s.criadoEm < :now)")
    int deleteExpiredSessions(LocalDateTime now);
}
