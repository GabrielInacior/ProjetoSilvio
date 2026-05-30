package br.com.inovatech.modules.produto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
        AND (CAST(:busca AS string) IS NULL
             OR LOWER(p.nome) LIKE LOWER(CONCAT('%', CAST(:busca AS string), '%'))
             OR LOWER(p.descricao) LIKE LOWER(CONCAT('%', CAST(:busca AS string), '%')))
    """)
    Page<Produto> buscar(@Param("busca") String busca, Pageable pageable);

    @Query("""
        SELECT p FROM Produto p
        WHERE p.ativo = true
        AND (CAST(:busca AS string) IS NULL
             OR LOWER(p.nome) LIKE LOWER(CONCAT('%', CAST(:busca AS string), '%'))
             OR LOWER(p.descricao) LIKE LOWER(CONCAT('%', CAST(:busca AS string), '%')))
        AND p.categoria = :categoria
    """)
    Page<Produto> buscarComCategoria(@Param("busca") String busca,
                                     @Param("categoria") CategoriaProduto categoria,
                                     Pageable pageable);
}
