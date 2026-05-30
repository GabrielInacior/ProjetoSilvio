package br.com.inovatech.modules.post;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostRepository postRepo;

    @GetMapping
    public ResponseEntity<Page<PostSummaryDto>> listar(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "9") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publicadoEm").descending());
        return ResponseEntity.ok(postRepo.findByPublicadoTrueOrderByPublicadoEmDesc(pageable)
                .map(PostSummaryDto::from));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<PostDto> buscar(@PathVariable String slug) {
        Post post = postRepo.findBySlugAndPublicadoTrue(slug)
                .orElseThrow(() -> new EntityNotFoundException("Post não encontrado: " + slug));
        return ResponseEntity.ok(PostDto.from(post));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostDto> criar(@RequestBody Post post) {
        post.setPublicadoEm(java.time.LocalDateTime.now());
        return ResponseEntity.ok(PostDto.from(postRepo.save(post)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PostDto> atualizar(@PathVariable Long id, @RequestBody Post body) {
        Post post = postRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Post " + id));
        post.setTitulo(body.getTitulo());
        post.setResumo(body.getResumo());
        post.setConteudoMd(body.getConteudoMd());
        post.setImagemCapa(body.getImagemCapa());
        post.setTags(body.getTags());
        post.setPublicado(body.isPublicado());
        return ResponseEntity.ok(PostDto.from(postRepo.save(post)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        postRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
