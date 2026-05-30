package br.com.inovatech.modules.aluno;

import br.com.inovatech.infra.pdf.PdfService;
import br.com.inovatech.modules.avaliacao.*;
import br.com.inovatech.modules.frequencia.*;
import br.com.inovatech.modules.matricula.*;
import br.com.inovatech.modules.notificacao.*;
import br.com.inovatech.modules.pedido.*;
import br.com.inovatech.modules.turma.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import br.com.inovatech.infra.exception.BusinessException;
import java.util.*;

@RestController
@RequestMapping("/api/aluno")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoRepository alunoRepo;
    private final MatriculaRepository matriculaRepo;
    private final TurmaRepository turmaRepo;
    private final NotaRepository notaRepo;
    private final PresencaRepository presencaRepo;
    private final NotificacaoRepository notificacaoRepo;
    private final PedidoRepository pedidoRepo;
    private final PdfService pdfService;

    private Aluno getAluno(UserDetails principal) {
        return alunoRepo.findByUsuarioEmail(principal.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Perfil de aluno não encontrado"));
    }

    @GetMapping("/perfil")
    public ResponseEntity<AlunoDto> perfil(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(AlunoDto.from(getAluno(principal)));
    }

    @GetMapping("/matriculas")
    public ResponseEntity<List<MatriculaDto>> matriculas(@AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        return ResponseEntity.ok(
            matriculaRepo.findAtivasByAlunoId(aluno.getId()).stream()
                .map(MatriculaDto::from).toList()
        );
    }

    @GetMapping("/notas")
    public ResponseEntity<List<NotaDto>> notas(@AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        return ResponseEntity.ok(
            notaRepo.findByAlunoId(aluno.getId()).stream().map(NotaDto::from).toList()
        );
    }

    @GetMapping("/frequencia")
    public ResponseEntity<List<PresencaDetalheDto>> frequenciaGeral(@AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        List<Presenca> presencas = presencaRepo.findAllByAlunoId(aluno.getId());
        List<PresencaDetalheDto> result = presencas.stream().map(p ->
            new PresencaDetalheDto(
                p.getAula().getTurma().getDisciplina().getNome(),
                p.getAula().getData().toString(),
                p.isPresente()
            )
        ).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/frequencia/{turmaId}")
    public ResponseEntity<FrequenciaResumoDto> frequencia(
            @PathVariable Long turmaId,
            @AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        List<Presenca> presencas = presencaRepo.findByAlunoIdAndTurmaId(aluno.getId(), turmaId);
        long total = presencas.size();
        long presentes = presencas.stream().filter(Presenca::isPresente).count();
        double pct = total == 0 ? 0 : (presentes * 100.0 / total);
        return ResponseEntity.ok(new FrequenciaResumoDto(total, presentes, pct));
    }

    @GetMapping("/notificacoes")
    public ResponseEntity<Page<NotificacaoDto>> notificacoes(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Aluno aluno = getAluno(principal);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
            notificacaoRepo.findByUsuarioIdOrBroadcast(aluno.getUsuario().getId(), pageable)
                .map(NotificacaoDto::from)
        );
    }

    @GetMapping("/pedidos")
    public ResponseEntity<Page<PedidoResumoDto>> pedidos(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Aluno aluno = getAluno(principal);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(
            pedidoRepo.findByUsuarioId(aluno.getUsuario().getId(), pageable).map(PedidoResumoDto::from)
        );
    }

    // ── Auto-matrícula ─────────────────────────────────────────────────────

    @GetMapping("/turmas/disponiveis")
    public ResponseEntity<List<TurmaDto>> turmasDisponiveis(@AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        return ResponseEntity.ok(
            turmaRepo.findDisponiveisParaAluno(aluno.getId()).stream().map(TurmaDto::from).toList()
        );
    }

    @PostMapping("/turmas/{turmaId}/matricular")
    public ResponseEntity<MatriculaDto> matricular(@PathVariable Long turmaId,
                                                    @AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        Turma turma = turmaRepo.findById(turmaId)
                .orElseThrow(() -> new EntityNotFoundException("Turma " + turmaId));
        if (matriculaRepo.existsByAlunoIdAndTurmaId(aluno.getId(), turmaId)) {
            throw new BusinessException("Você já está matriculado neste horário.");
        }
        // Verificar conflito de horário
        if (turma.getDiaSemana() != null && turma.getHoraInicio() != null && turma.getHoraFim() != null) {
            for (Matricula existente : matriculaRepo.findAtivasByAlunoId(aluno.getId())) {
                Turma t = existente.getTurma();
                if (t.getDiaSemana() == turma.getDiaSemana()
                        && t.getHoraInicio() != null && t.getHoraFim() != null
                        && t.getHoraInicio().compareTo(turma.getHoraFim()) < 0
                        && turma.getHoraInicio().compareTo(t.getHoraFim()) < 0) {
                    throw new BusinessException(
                        "Conflito de horário com \"" + t.getDisciplina().getNome() + "\""
                        + " (" + t.getDiaSemana() + " " + t.getHoraInicio() + "–" + t.getHoraFim() + ")"
                    );
                }
            }
        }
        Matricula m = Matricula.builder()
                .aluno(aluno)
                .turma(turma)
                .status(StatusMatricula.ATIVA)
                .build();
        return ResponseEntity.ok(MatriculaDto.from(matriculaRepo.save(m)));
    }

    @DeleteMapping("/matriculas/{matriculaId}/cancelar")
    public ResponseEntity<Void> cancelarMatricula(@PathVariable Long matriculaId,
                                                   @AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        Matricula m = matriculaRepo.findById(matriculaId)
                .filter(mat -> mat.getAluno().getId().equals(aluno.getId()))
                .orElseThrow(() -> new EntityNotFoundException("Matrícula não encontrada"));
        m.setStatus(StatusMatricula.CANCELADA);
        matriculaRepo.save(m);
        return ResponseEntity.noContent().build();
    }

    // DTOs
    record FrequenciaResumoDto(long totalAulas, long aulaPresente, double percentualPresenca) {}
    record PresencaDetalheDto(String disciplina, String data, boolean presente) {}

    @GetMapping("/documentos/declaracao-matricula")
    public ResponseEntity<byte[]> declaracaoMatricula(@AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        byte[] pdf = pdfService.gerarDeclaracaoMatricula(aluno);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"declaracao-matricula.pdf\"")
                .body(pdf);
    }

    @GetMapping("/documentos/historico")
    public ResponseEntity<byte[]> historico(@AuthenticationPrincipal UserDetails principal) {
        Aluno aluno = getAluno(principal);
        byte[] pdf = pdfService.gerarHistorico(aluno);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"historico.pdf\"")
                .body(pdf);
    }
}
