package com.mybarber.api.domain.repository;


import com.mybarber.api.domain.entity.TokenDeVerificacao;

public interface TokenDeVerificacaoDAO {

    TokenDeVerificacao buscarPorToken(String token);

    TokenDeVerificacao buscarPorIdUsuario(int id);

    void excluirPorIdUsuario(int id);

    void salvar(TokenDeVerificacao token);

}
