package br.com.inovatech.modules.auth;

import br.com.inovatech.modules.usuario.UsuarioDto;

public record AuthResponse(
    String accessToken,
    String refreshToken,
    UsuarioDto usuario
) {}
