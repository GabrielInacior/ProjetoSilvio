package br.com.inovatech.modules.produto;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoRepository produtoRepo;

    @GetMapping
    public ResponseEntity<Page<ProdutoDto>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String busca,
            @RequestParam(defaultValue = "nome") String sort,
            @RequestParam(defaultValue = "asc") String dir) {
        Sort.Direction direction = "desc".equalsIgnoreCase(dir) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String sortField = switch (sort) {
            case "preco" -> "preco";
            case "estoque" -> "estoque";
            default -> "nome";
        };
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
        CategoriaProduto cat = null;
        if (categoria != null && !categoria.isBlank()) {
            try { cat = CategoriaProduto.valueOf(categoria.toUpperCase()); } catch (IllegalArgumentException ignored) {}
        }
        String buscaTrim = (busca != null && !busca.isBlank()) ? busca.trim() : null;
        return ResponseEntity.ok(produtoRepo.buscar(buscaTrim, cat, pageable).map(ProdutoDto::from));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ProdutoDto> buscar(@PathVariable String slug) {
        Produto p = produtoRepo.findBySlugAndAtivoTrue(slug)
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado: " + slug));
        return ResponseEntity.ok(ProdutoDto.from(p));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoDto> criar(@RequestBody Produto produto) {
        return ResponseEntity.ok(ProdutoDto.from(produtoRepo.save(produto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProdutoDto> atualizar(@PathVariable Long id, @RequestBody Produto body) {
        Produto p = produtoRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Produto " + id));
        p.setNome(body.getNome());
        p.setDescricao(body.getDescricao());
        p.setPreco(body.getPreco());
        p.setEstoque(body.getEstoque());
        p.setImagemUrl(body.getImagemUrl());
        p.setCategoria(body.getCategoria());
        p.setAtivo(body.isAtivo());
        return ResponseEntity.ok(ProdutoDto.from(produtoRepo.save(p)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Produto p = produtoRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Produto " + id));
        p.setAtivo(false);
        produtoRepo.save(p);
        return ResponseEntity.noContent().build();
    }
}
