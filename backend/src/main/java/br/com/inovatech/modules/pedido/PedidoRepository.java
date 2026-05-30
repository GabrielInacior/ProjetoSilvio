package br.com.inovatech.modules.pedido;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query(value = "SELECT p FROM Pedido p WHERE p.usuario.id = :usuarioId ORDER BY p.criadoEm DESC",
           countQuery = "SELECT COUNT(p) FROM Pedido p WHERE p.usuario.id = :usuarioId")
    Page<Pedido> findByUsuarioId(Long usuarioId, Pageable pageable);
}
