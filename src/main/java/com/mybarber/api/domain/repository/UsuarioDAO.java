package com.mybarber.api.domain.repository;

import java.util.Map;

import com.mybarber.api.domain.entity.Pessoa;
import com.mybarber.api.domain.entity.Usuario;

public interface UsuarioDAO {


    void salvar(Usuario usuario);

    Usuario buscar(int id);

    void alterar(Usuario usuario);
    

    void excluir(Usuario usuario);

    void alterarSenha(Usuario usuario);

    Usuario buscarPorLogin(String login);

    Usuario buscarPorEmail(String email);

    boolean verificarLogin(String login);

    boolean verificarEmail(String email);

    Map<String, Integer> buscarGerenciarUsuario(Usuario usuario);
    /*public void alterarSenha(Usuario usuario);*/


}
