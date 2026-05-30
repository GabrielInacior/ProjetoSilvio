package br.com.inovatech.modules.evento;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@RequiredArgsConstructor
public class EventoController {

    private final EventoInstitucionalRepository eventoRepo;

    @GetMapping
    public ResponseEntity<List<EventoDto>> listar() {
        return ResponseEntity.ok(
            eventoRepo.findProximosEventos(LocalDateTime.now()).stream()
                .map(EventoDto::from).toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventoDto> buscar(@PathVariable Long id) {
        return eventoRepo.findById(id)
                .map(EventoDto::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventoDto> criar(@RequestBody EventoInstitucional evento) {
        return ResponseEntity.ok(EventoDto.from(eventoRepo.save(evento)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventoDto> atualizar(@PathVariable Long id, @RequestBody EventoInstitucional body) {
        EventoInstitucional e = eventoRepo.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Evento " + id));
        e.setTitulo(body.getTitulo());
        e.setDescricao(body.getDescricao());
        e.setDataInicio(body.getDataInicio());
        e.setDataFim(body.getDataFim());
        e.setLocal(body.getLocal());
        e.setImagemUrl(body.getImagemUrl());
        e.setPublico(body.isPublico());
        return ResponseEntity.ok(EventoDto.from(eventoRepo.save(e)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        eventoRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
