package br.com.inovatech.modules.produto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findBySlugAndAtivoTrue(String slug);
    Page<Produto> findByAtivoTrue(Pageable pageable);
    Page<Produto> findByAtivoTrueAndCategoria(CategoriaProduto categoria, Pageable pageable);

    @Query("""
        SELECT p FROM Produto p
        WHERE p.ativo = true
        AND (:busca IS NULL OR LOWER(p.nome) LIKE LOWER(CONCAT('%', :busca, '%'))
                           OR LOWER(p.descricao) LIKE LOWER(CONCAT('%', :busca, '%')))
        AND (:categoria IS NULL OR p.categoria = :categoria)
    """)
    Page<Produto> buscar(String busca, CategoriaProduto categoria, Pageable pageable);
}
