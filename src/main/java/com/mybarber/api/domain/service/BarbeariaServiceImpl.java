package com.mybarber.api.domain.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.repository.BarbeariaDAO;
import com.mybarber.api.domain.repository.EnderecoDAO;


@Service
@Transactional
public class BarbeariaServiceImpl implements BarbeariaService {

    @Autowired
    EnderecoDAO daoEndereco;

    @Autowired
    BarbeariaDAO dao;

    @Override
    public void alterar(Barbearia barbearia) {

        var barbeariaAtual = buscarPorId(barbearia.getId());

        barbearia.setQtdCliente(barbeariaAtual.getQtdCliente());
        barbearia.setQtdFuncionario(barbeariaAtual.getQtdFuncionario());
        barbearia.setQtdServico(barbeariaAtual.getQtdServico());
        var endereco = barbearia.getEndereco();
        endereco.setId(barbeariaAtual.getEndereco().getId());
        daoEndereco.alterar(endereco);
        dao.alterar(barbearia);

    }

    @Override
    public Barbearia buscarPorId(int id) {
        // TODO Auto-generated method stub
        return dao.buscarPorId(id);
    }

}
