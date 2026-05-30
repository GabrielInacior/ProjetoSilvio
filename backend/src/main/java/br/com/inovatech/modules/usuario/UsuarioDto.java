package br.com.inovatech.modules.usuario;

import br.com.inovatech.modules.usuario.TipoUsuario;

public record UsuarioDto(
    Long id,
    String nome,
    String email,
    TipoUsuario tipo,
    String avatarUrl,
    boolean senhaProvisoria
) {
    public static UsuarioDto from(Usuario u) {
        return new UsuarioDto(u.getId(), u.getNome(), u.getEmail(), u.getTipo(), u.getAvatarUrl(), u.isSenhaProvisoria());
    }
}
