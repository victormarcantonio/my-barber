package com.mybarber.api.domain.service;

import java.util.List;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Servico;

public interface ServicoService {

    List<Servico> listarAtivos(int idBarbearia);

    void salvar(Servico servico);

    void desativar(int id);

    void atualizar(Servico servico);


}
