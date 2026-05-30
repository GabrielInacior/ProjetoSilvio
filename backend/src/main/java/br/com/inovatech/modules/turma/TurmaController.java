package br.com.inovatech.modules.turma;

import br.com.inovatech.modules.disciplina.Disciplina;
import br.com.inovatech.modules.disciplina.DisciplinaRepository;
import br.com.inovatech.modules.professor.Professor;
import br.com.inovatech.modules.professor.ProfessorRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final TurmaRepository turmaRepo;
    private final DisciplinaRepository disciplinaRepo;
    private final ProfessorRepository professorRepo;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','PROFESSOR')")
    public ResponseEntity<List<TurmaDto>> listar(
            @RequestParam(required = false) Integer ano,
            @RequestParam(required = false) SemestreEnum semestre) {
        List<Turma> turmas = (ano != null && semestre != null)
                ? turmaRepo.findAtivasByAnoAndSemestre(ano, semestre)
                : turmaRepo.findAll();
        return ResponseEntity.ok(turmas.stream().map(TurmaDto::from).toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','PROFESSOR')")
    public ResponseEntity<TurmaDto> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(TurmaDto.from(
            turmaRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Turma " + id))
        ));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TurmaDto> criar(@Valid @RequestBody TurmaRequest req) {
        Disciplina disc = disciplinaRepo.findById(req.disciplinaId())
                .orElseThrow(() -> new EntityNotFoundException("Disciplina " + req.disciplinaId()));
        Professor prof = professorRepo.findById(req.professorId())
                .orElseThrow(() -> new EntityNotFoundException("Professor " + req.professorId()));
        Turma t = Turma.builder()
                .disciplina(disc).professor(prof)
                .ano(req.ano()).semestre(req.semestre()).sala(req.sala())
                .vagas(req.vagas()).diaSemana(req.diaSemana())
                .horaInicio(req.horaInicio()).horaFim(req.horaFim())
                .dataInicio(req.dataInicio()).dataFim(req.dataFim())
                .status(StatusTurma.ATIVA)
                .build();
        return ResponseEntity.ok(TurmaDto.from(turmaRepo.save(t)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TurmaDto> atualizar(@PathVariable Long id,
                                               @Valid @RequestBody TurmaRequest req) {
        Turma t = turmaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Turma " + id));
        t.setSala(req.sala());
        t.setVagas(req.vagas());
        t.setDiaSemana(req.diaSemana());
        t.setHoraInicio(req.horaInicio());
        t.setHoraFim(req.horaFim());
        t.setDataInicio(req.dataInicio());
        t.setDataFim(req.dataFim());
        t.setStatus(req.status() != null ? req.status() : t.getStatus());
        return ResponseEntity.ok(TurmaDto.from(turmaRepo.save(t)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {
        Turma t = turmaRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Turma " + id));
        t.setStatus(StatusTurma.CANCELADA);
        turmaRepo.save(t);
        return ResponseEntity.noContent().build();
    }

    record TurmaRequest(
        @NotNull Long disciplinaId,
        @NotNull Long professorId,
        @NotNull Integer ano,
        @NotNull SemestreEnum semestre,
        String sala,
        Integer vagas,
        DiaSemana diaSemana,
        String horaInicio,
        String horaFim,
        LocalDate dataInicio,
        LocalDate dataFim,
        StatusTurma status
    ) {}
}
