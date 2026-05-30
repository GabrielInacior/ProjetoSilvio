package br.com.inovatech.modules.produto;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findBySlugAndAtivoTrue(String slug);
    Page<Produto> findByAtivoTrue(Pageable pageable);
    Page<Produto> findByAtivoTrueAndCategoria(CategoriaProduto categoria, Pageable pageable);
}
