package br.com.inovatech.modules.professor;

import br.com.inovatech.modules.aula.*;
import br.com.inovatech.modules.avaliacao.*;
import br.com.inovatech.modules.frequencia.*;
import br.com.inovatech.modules.matricula.*;
import br.com.inovatech.modules.turma.*;
import br.com.inovatech.modules.aluno.Aluno;
import br.com.inovatech.modules.aluno.AlunoRepository;
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
    private final AlunoRepository alunoRepo;

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

    @GetMapping("/turmas/disponiveis")
    public ResponseEntity<List<TurmaDto>> turmasDisponiveis() {
        return ResponseEntity.ok(
            turmaRepo.findAtivasComProfessorNulo().stream().map(TurmaDto::from).toList()
        );
    }

    @PostMapping("/turmas/{turmaId}/assumir")
    public ResponseEntity<TurmaDto> assumirTurma(@PathVariable Long turmaId,
                                                  @AuthenticationPrincipal UserDetails principal) {
        Professor prof = getProfessor(principal);
        Turma turma = turmaRepo.findById(turmaId)
                .orElseThrow(() -> new EntityNotFoundException("Turma " + turmaId));
        if (turma.getProfessor() != null) {
            throw new IllegalStateException("Esta turma já possui professor atribuído");
        }
        turma.setProfessor(prof);
        return ResponseEntity.ok(TurmaDto.from(turmaRepo.save(turma)));
    }

    @GetMapping("/turmas/{turmaId}/alunos")
    public ResponseEntity<List<AlunoNaTurmaDto>> alunosDaTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(
            matriculaRepo.findAtivasByTurmaId(turmaId).stream().map(AlunoNaTurmaDto::from).toList()
        );
    }

    @PostMapping("/turmas/{turmaId}/matricular")
    public ResponseEntity<AlunoNaTurmaDto> matricularAluno(@PathVariable Long turmaId,
                                                            @RequestBody MatricularRequest req) {
        if (matriculaRepo.existsByAlunoIdAndTurmaId(req.alunoId(), turmaId)) {
            throw new IllegalStateException("Aluno já matriculado nesta turma");
        }
        Turma turma = turmaRepo.findById(turmaId)
                .orElseThrow(() -> new EntityNotFoundException("Turma " + turmaId));
        Aluno aluno = alunoRepo.getReferenceById(req.alunoId());
        Matricula m = Matricula.builder().aluno(aluno).turma(turma).status(StatusMatricula.ATIVA).build();
        matriculaRepo.save(m);
        // reload with fetch
        Matricula saved = matriculaRepo.findAtivasByTurmaId(turmaId).stream()
                .filter(x -> x.getAluno().getId().equals(req.alunoId())).findFirst()
                .orElseThrow();
        return ResponseEntity.ok(AlunoNaTurmaDto.from(saved));
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
                        Aluno aluno = alunoRepo.getReferenceById(item.alunoId());
                        return Presenca.builder().aula(aula).aluno(aluno).build();
                    });
            presenca.setPresente(item.presente());
            presencaRepo.save(presenca);
        }
        aula.setStatus(StatusAula.REALIZADA);
        aulaRepo.save(aula);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/aulas/{aulaId}/chamada")
    public ResponseEntity<List<ChamadaItem>> buscarChamada(@PathVariable Long aulaId) {
        return ResponseEntity.ok(
            presencaRepo.findByAulaId(aulaId).stream()
                .map(p -> new ChamadaItem(p.getAluno().getId(), p.isPresente()))
                .toList()
        );
    }

    @GetMapping("/aulas/{aulaId}")
    public ResponseEntity<AulaDto> buscarAula(@PathVariable Long aulaId) {
        Aula aula = aulaRepo.findById(aulaId).orElseThrow(() -> new EntityNotFoundException("Aula " + aulaId));
        return ResponseEntity.ok(AulaDto.from(aula));
    }

    @GetMapping("/turmas/{turmaId}/frequencia")
    public ResponseEntity<List<FrequenciaTurmaDto>> frequenciaDaTurma(@PathVariable Long turmaId) {
        long totalAulas = aulaRepo.findByTurmaIdOrderByDataAsc(turmaId).stream()
                .filter(a -> a.getStatus() == StatusAula.REALIZADA).count();
        List<FrequenciaTurmaDto> result = matriculaRepo.findAtivasByTurmaId(turmaId).stream().map(m -> {
            long presentes = presencaRepo.countPresencasByAlunoIdAndTurmaId(m.getAluno().getId(), turmaId);
            double pct = totalAulas == 0 ? 0 : presentes * 100.0 / totalAulas;
            return new FrequenciaTurmaDto(
                m.getAluno().getId(),
                m.getAluno().getUsuario().getNome(),
                totalAulas, presentes, Math.round(pct * 10) / 10.0
            );
        }).toList();
        return ResponseEntity.ok(result);
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
    record MatricularRequest(Long alunoId) {}
    record FrequenciaTurmaDto(Long alunoId, String nome, long totalAulas, long presentes, double percentual) {}
}
