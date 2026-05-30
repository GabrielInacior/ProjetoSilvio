package br.com.inovatech.infra.pdf;

import br.com.inovatech.modules.aluno.Aluno;
import br.com.inovatech.modules.avaliacao.Nota;
import br.com.inovatech.modules.avaliacao.NotaRepository;
import br.com.inovatech.modules.matricula.Matricula;
import br.com.inovatech.modules.matricula.MatriculaRepository;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final TemplateEngine templateEngine;
    private final MatriculaRepository matriculaRepo;
    private final NotaRepository notaRepo;

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] gerarDeclaracaoMatricula(Aluno aluno) {
        Context ctx = new Context();
        ctx.setVariable("aluno", Map.of(
            "nome", aluno.getUsuario().getNome(),
            "ra", aluno.getRa(),
            "curso", aluno.getCurso().getNome(),
            "semestreIngresso", aluno.getSemestreIngresso(),
            "status", aluno.getStatus().name()
        ));
        ctx.setVariable("dataEmissao", LocalDate.now().format(DATE_FMT));
        return render("pdf/declaracao-matricula", ctx);
    }

    public byte[] gerarHistorico(Aluno aluno) {
        List<Matricula> matriculas = matriculaRepo.findAtivasByAlunoId(aluno.getId());
        List<Map<String, Object>> historico = matriculas.stream().map(m -> {
            List<Nota> notas = notaRepo.findByMatriculaId(m.getId());
            double media = notas.stream()
                    .mapToDouble(n -> n.getValor().doubleValue())
                    .average().orElse(0.0);
            return Map.<String, Object>of(
                "disciplina", m.getTurma().getDisciplina().getNome(),
                "semestre", m.getTurma().getAno() + "/" + m.getTurma().getSemestre().name(),
                "cargaHoraria", m.getTurma().getDisciplina().getCargaHoraria(),
                "media", BigDecimal.valueOf(media)
            );
        }).collect(Collectors.toList());

        Context ctx = new Context();
        ctx.setVariable("aluno", Map.of(
            "nome", aluno.getUsuario().getNome(),
            "ra", aluno.getRa(),
            "curso", aluno.getCurso().getNome()
        ));
        ctx.setVariable("historico", historico);
        ctx.setVariable("dataEmissao", LocalDate.now().format(DATE_FMT));
        return render("pdf/historico", ctx);
    }

    private byte[] render(String templateName, Context ctx) {
        String html = templateEngine.process(templateName, ctx);
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, null);
            builder.toStream(baos);
            builder.run();
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
    }
}
