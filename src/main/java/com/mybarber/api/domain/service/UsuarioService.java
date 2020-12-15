package com.mybarber.api.domain.service;


import com.mybarber.api.domain.entity.Pessoa;
import com.mybarber.api.domain.entity.TokenDeVerificacao;
import com.mybarber.api.domain.entity.Usuario;

public interface UsuarioService {

    void alterarSenha(Usuario usuario);

    boolean verificarUsuario(String usuario);

    boolean verificarEmail(String email);

    void esqueceuSenha(String email);

    Object buscarUsuarioLogado(String tipo);

    TokenDeVerificacao buscarToken(String token);
    
    void editarPessoa(Pessoa pessoa);
}
