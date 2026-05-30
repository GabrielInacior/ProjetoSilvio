package br.com.inovatech.infra.security;

import br.com.inovatech.modules.usuario.Usuario;
import br.com.inovatech.modules.usuario.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        return new org.springframework.security.core.userdetails.User(
                usuario.getEmail(),
                usuario.getSenhaHash(),
                usuario.isAtivo(),
                true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getTipo().name()))
        );
    }
}
