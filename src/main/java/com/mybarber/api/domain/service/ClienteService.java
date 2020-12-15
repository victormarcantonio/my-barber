package com.mybarber.api.domain.service;

import java.util.List;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Cliente;

public interface ClienteService {

    void cadastrar(Cliente cliente, int idBarbearia);

    Cliente buscarPorid(int id);

    void editar(Cliente cliente);

    void excluir(int id, int idBarbearia);

    List<Cliente> listar(int idBarbearia);

    List<Cliente> autoCompleteNome(String nome);

}
