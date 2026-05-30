package br.com.inovatech.modules.notificacao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacaoRepository extends JpaRepository<Notificacao, Long> {

    @Query("SELECT n FROM Notificacao n WHERE n.usuario.id = :usuarioId OR n.usuario IS NULL ORDER BY n.criadoEm DESC")
    Page<Notificacao> findByUsuarioIdOrBroadcast(Long usuarioId, Pageable pageable);

    long countByUsuarioIdAndLidaFalse(Long usuarioId);

    @Modifying
    @Query("UPDATE Notificacao n SET n.lida = true, n.lidaEm = CURRENT_TIMESTAMP WHERE n.usuario.id = :usuarioId AND n.lida = false")
    int marcarTodasComoLidas(Long usuarioId);
}
