package br.com.inovatech.modules.pedido;

import br.com.inovatech.infra.exception.BusinessException;
import br.com.inovatech.modules.produto.Produto;
import br.com.inovatech.modules.produto.ProdutoRepository;
import br.com.inovatech.modules.usuario.Usuario;
import br.com.inovatech.modules.usuario.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoRepository pedidoRepo;
    private final ProdutoRepository produtoRepo;
    private final UsuarioRepository usuarioRepo;

    @GetMapping
    public ResponseEntity<Page<PedidoResumoDto>> meusPedidos(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Usuario usuario = getUsuario(principal);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(pedidoRepo.findByUsuarioId(usuario.getId(), pageable).map(PedidoResumoDto::from));
    }

    @PostMapping("/checkout")
    public ResponseEntity<PedidoResumoDto> checkout(
            @AuthenticationPrincipal UserDetails principal,
            @Valid @RequestBody CheckoutRequest req) {
        Usuario usuario = getUsuario(principal);

        List<PedidoItem> itens = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CheckoutRequest.ItemRequest itemReq : req.itens()) {
            Produto produto = produtoRepo.findById(itemReq.produtoId())
                    .orElseThrow(() -> new EntityNotFoundException("Produto " + itemReq.produtoId()));
            if (!produto.isAtivo()) throw new BusinessException("Produto inativo: " + produto.getNome());
            if (produto.getEstoque() < itemReq.quantidade()) {
                throw new BusinessException("Estoque insuficiente para: " + produto.getNome());
            }
            produto.setEstoque(produto.getEstoque() - itemReq.quantidade());
            produtoRepo.save(produto);

            PedidoItem item = PedidoItem.builder()
                    .produto(produto)
                    .quantidade(itemReq.quantidade())
                    .precoUnitario(produto.getPreco())
                    .build();
            itens.add(item);
            total = total.add(item.getSubtotal());
        }

        Pedido pedido = Pedido.builder()
                .usuario(usuario)
                .status(StatusPedido.CONFIRMADO)
                .valorTotal(total)
                .enderecoEntrega(req.enderecoEntrega())
                .observacoes(req.observacoes())
                .build();
        itens.forEach(i -> { i.setPedido(pedido); pedido.getItens().add(i); });

        return ResponseEntity.ok(PedidoResumoDto.from(pedidoRepo.save(pedido)));
    }

    private Usuario getUsuario(UserDetails principal) {
        return usuarioRepo.findByEmail(principal.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));
    }
}
