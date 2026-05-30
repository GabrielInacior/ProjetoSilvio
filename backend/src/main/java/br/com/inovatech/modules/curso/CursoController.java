package br.com.inovatech.modules.curso;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoRepository cursoRepo;

    @GetMapping
    public ResponseEntity<List<CursoDto>> listar() {
        return ResponseEntity.ok(cursoRepo.findByAtivoTrue().stream().map(CursoDto::from).toList());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<CursoDto> buscar(@PathVariable String slug) {
        Curso c = cursoRepo.findBySlug(slug)
                .orElseThrow(() -> new EntityNotFoundException("Curso não encontrado: " + slug));
        return ResponseEntity.ok(CursoDto.from(c));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CursoDto> criar(@RequestBody Curso curso) {
        return ResponseEntity.ok(CursoDto.from(cursoRepo.save(curso)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CursoDto> atualizar(@PathVariable Long id, @RequestBody Curso body) {
        Curso c = cursoRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Curso " + id));
        c.setNome(body.getNome());
        c.setDescricao(body.getDescricao());
        c.setDuracaoSemestres(body.getDuracaoSemestres());
        c.setImagemUrl(body.getImagemUrl());
        c.setAtivo(body.isAtivo());
        return ResponseEntity.ok(CursoDto.from(cursoRepo.save(c)));
    }
}
