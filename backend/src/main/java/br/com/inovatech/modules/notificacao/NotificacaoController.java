package br.com.inovatech.modules.notificacao;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;
    private final NotificacaoRepository notificacaoRepo;

    @GetMapping
    public ResponseEntity<Page<NotificacaoDto>> listar(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        // Resolve userId via email lookup — simplified
        Long usuarioId = resolveUsuarioId(principal);
        return ResponseEntity.ok(notificacaoService.listar(usuarioId, PageRequest.of(page, size)));
    }

    @GetMapping("/nao-lidas")
    public ResponseEntity<Long> naoLidas(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(notificacaoService.countNaoLidas(resolveUsuarioId(principal)));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<Void> marcarLida(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails principal) {
        notificacaoService.marcarLida(id, resolveUsuarioId(principal));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/lidas")
    public ResponseEntity<Void> marcarTodasLidas(@AuthenticationPrincipal UserDetails principal) {
        notificacaoService.marcarTodasLidas(resolveUsuarioId(principal));
        return ResponseEntity.noContent().build();
    }

    private Long resolveUsuarioId(UserDetails principal) {
        return notificacaoRepo.findAll().stream()
                .filter(n -> n.getUsuario() != null && n.getUsuario().getEmail().equals(principal.getUsername()))
                .map(n -> n.getUsuario().getId())
                .findFirst()
                .orElse(-1L);
    }
}
