package br.com.inovatech.modules.disciplina;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
@RequiredArgsConstructor
public class DisciplinaController {

    private final DisciplinaRepository disciplinaRepo;

    @GetMapping
    public ResponseEntity<List<DisciplinaDto>> listar() {
        return ResponseEntity.ok(
            disciplinaRepo.findByAtivoTrue().stream().map(DisciplinaDto::from).toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaDto> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(DisciplinaDto.from(
            disciplinaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Disciplina " + id))
        ));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisciplinaDto> criar(@Valid @RequestBody DisciplinaRequest req) {
        Disciplina d = Disciplina.builder()
                .nome(req.nome())
                .codigo(req.codigo())
                .cargaHoraria(req.cargaHoraria())
                .ementa(req.ementa())
                .semestreSugerido(req.semestreSugerido())
                .ativo(true)
                .build();
        return ResponseEntity.ok(DisciplinaDto.from(disciplinaRepo.save(d)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DisciplinaDto> atualizar(@PathVariable Long id,
                                                    @Valid @RequestBody DisciplinaRequest req) {
        Disciplina d = disciplinaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Disciplina " + id));
        d.setNome(req.nome());
        d.setCodigo(req.codigo());
        d.setCargaHoraria(req.cargaHoraria());
        d.setEmenta(req.ementa());
        d.setSemestreSugerido(req.semestreSugerido());
        return ResponseEntity.ok(DisciplinaDto.from(disciplinaRepo.save(d)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        Disciplina d = disciplinaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Disciplina " + id));
        d.setAtivo(false);
        disciplinaRepo.save(d);
        return ResponseEntity.noContent().build();
    }
}
