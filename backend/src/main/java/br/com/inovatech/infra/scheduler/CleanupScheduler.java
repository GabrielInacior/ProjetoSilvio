package br.com.inovatech.infra.scheduler;

import br.com.inovatech.modules.usuario.PasswordResetTokenRepository;
import br.com.inovatech.modules.usuario.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class CleanupScheduler {

    private final SessionRepository sessionRepo;
    private final PasswordResetTokenRepository passwordResetTokenRepo;

    /**
     * Runs every day at 02:00 AM.
     * Deletes expired sessions (expiraEm < now OR revogado = true older than 7 days).
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void cleanExpiredSessions() {
        int deleted = sessionRepo.deleteExpiredSessions(LocalDateTime.now());
        log.info("CleanupScheduler: removed {} expired sessions", deleted);
    }

    /**
     * Runs every hour.
     * Deletes expired password reset tokens.
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void cleanExpiredPasswordResetTokens() {
        int deleted = passwordResetTokenRepo.deleteExpiredTokens(LocalDateTime.now());
        log.info("CleanupScheduler: removed {} expired password reset tokens", deleted);
    }
}
