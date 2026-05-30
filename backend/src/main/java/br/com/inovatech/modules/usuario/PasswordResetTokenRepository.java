package br.com.inovatech.modules.usuario;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.usuario.id = :usuarioId")
    void deleteByUsuarioId(Long usuarioId);

    @Modifying
    @Query("DELETE FROM PasswordResetToken p WHERE p.expiraEm < :now")
    int deleteExpiredTokens(LocalDateTime now);
}
