package com.mybarber.api.domain.repository;

import java.util.List;

import com.mybarber.api.domain.entity.Barbearia;


public interface BarbeariaDAO {

    Barbearia salvar(Barbearia barbearia);

    List<Barbearia> listar();

    Barbearia buscarPorId(int id);

    void alterar(Barbearia barbearia);

}
