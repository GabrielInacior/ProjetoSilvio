package br.com.inovatech.modules.professor;

import br.com.inovatech.modules.aula.*;
import br.com.inovatech.modules.avaliacao.*;
import br.com.inovatech.modules.frequencia.*;
import br.com.inovatech.modules.matricula.*;
import br.com.inovatech.modules.turma.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/professor")
@PreAuthorize("hasAnyRole('PROFESSOR','ADMIN')")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorRepository professorRepo;
    private final TurmaRepository turmaRepo;
    private final AulaRepository aulaRepo;
    private final MatriculaRepository matriculaRepo;
    private final NotaRepository notaRepo;
    private final PresencaRepository presencaRepo;

    private Professor getProfessor(UserDetails principal) {
        return professorRepo.findAll().stream()
                .filter(p -> p.getUsuario().getEmail().equals(principal.getUsername()))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Perfil de professor não encontrado"));
    }

    @GetMapping("/perfil")
    public ResponseEntity<ProfessorDto> perfil(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(ProfessorDto.from(getProfessor(principal)));
    }

    @GetMapping("/turmas")
    public ResponseEntity<List<TurmaDto>> turmas(@AuthenticationPrincipal UserDetails principal) {
        Professor prof = getProfessor(principal);
        return ResponseEntity.ok(
            turmaRepo.findByProfessorId(prof.getId()).stream().map(TurmaDto::from).toList()
        );
    }

    @GetMapping("/turmas/{turmaId}/alunos")
    public ResponseEntity<List<MatriculaDto>> alunosDaTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(
            matriculaRepo.findAtivasByTurmaId(turmaId).stream().map(MatriculaDto::from).toList()
        );
    }

    @GetMapping("/turmas/{turmaId}/aulas")
    public ResponseEntity<List<AulaDto>> aulasDaTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(
            aulaRepo.findByTurmaIdOrderByDataAsc(turmaId).stream().map(AulaDto::from).toList()
        );
    }

    @PostMapping("/turmas/{turmaId}/aulas")
    public ResponseEntity<AulaDto> criarAula(@PathVariable Long turmaId,
                                              @Valid @RequestBody AulaRequest req) {
        Turma turma = turmaRepo.findById(turmaId).orElseThrow(() -> new EntityNotFoundException("Turma " + turmaId));
        Aula aula = Aula.builder()
                .turma(turma)
                .data(req.data())
                .horaInicio(req.horaInicio())
                .horaFim(req.horaFim())
                .tema(req.tema())
                .conteudo(req.conteudo())
                .status(StatusAula.AGENDADA)
                .build();
        return ResponseEntity.ok(AulaDto.from(aulaRepo.save(aula)));
    }

    @PostMapping("/aulas/{aulaId}/chamada")
    public ResponseEntity<Void> registrarChamada(
            @PathVariable Long aulaId,
            @RequestBody List<ChamadaItem> chamada) {
        Aula aula = aulaRepo.findById(aulaId).orElseThrow(() -> new EntityNotFoundException("Aula " + aulaId));
        for (ChamadaItem item : chamada) {
            Presenca presenca = presencaRepo.findByAulaIdAndAlunoId(aulaId, item.alunoId())
                    .orElseGet(() -> {
                        br.com.inovatech.modules.aluno.Aluno aluno = new br.com.inovatech.modules.aluno.Aluno();
                        aluno.setId(item.alunoId());
                        return Presenca.builder().aula(aula).aluno(aluno).build();
                    });
            presenca.setPresente(item.presente());
            presencaRepo.save(presenca);
        }
        aula.setStatus(StatusAula.REALIZADA);
        aulaRepo.save(aula);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/turmas/{turmaId}/notas")
    public ResponseEntity<List<NotaDto>> notasDaTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(
            notaRepo.findByTurmaId(turmaId).stream().map(NotaDto::from).toList()
        );
    }

    @PostMapping("/turmas/{turmaId}/notas")
    public ResponseEntity<NotaDto> lancarNota(@PathVariable Long turmaId,
                                               @Valid @RequestBody NotaRequest req) {
        Matricula matricula = matriculaRepo.findByAlunoIdAndTurmaId(req.alunoId(), turmaId)
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada"));
        Nota nota = Nota.builder()
                .matricula(matricula)
                .tipo(req.tipo())
                .valor(req.valor())
                .peso(req.peso())
                .descricao(req.descricao())
                .dataAvaliacao(req.dataAvaliacao())
                .build();
        return ResponseEntity.ok(NotaDto.from(notaRepo.save(nota)));
    }

    // inner request/dto records
    record ChamadaItem(Long alunoId, boolean presente) {}
}
