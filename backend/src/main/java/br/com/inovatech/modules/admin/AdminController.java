package br.com.inovatech.modules.admin;

import br.com.inovatech.modules.aluno.*;
import br.com.inovatech.modules.professor.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminController {

    private final AlunoRepository alunoRepo;
    private final ProfessorRepository professorRepo;

    @GetMapping("/alunos")
    public ResponseEntity<Page<AlunoDto>> listarAlunos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(required = false) String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("usuario.nome").ascending());
        Page<Aluno> result = (search != null && !search.isBlank())
                ? alunoRepo.searchAll(search, pageable)
                : alunoRepo.searchAll("", pageable);
        return ResponseEntity.ok(result.map(AlunoDto::from));
    }

    @GetMapping("/professores")
    public ResponseEntity<Page<ProfessorDto>> listarProfessores(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(professorRepo.findAll(pageable).map(ProfessorDto::from));
    }
}
