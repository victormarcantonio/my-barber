package com.mybarber.api.domain.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Servico;


import com.mybarber.api.domain.repository.PromocaoDAO;

import com.mybarber.api.domain.repository.BarbeariaDAO;


import com.mybarber.api.domain.repository.ServicoDAO;


@Service @Transactional
public class ServicoServiceImpl implements ServicoService{

	@Autowired
	ServicoDAO dao;
	
	@Autowired
	PromocaoDAO promocaoDAO;

	@Autowired
    BarbeariaDAO daoBarbearia;
	
	@Override
	public List<Servico> listarAtivos(int idBarbearia) {
		
		return dao.listarAtivos(idBarbearia);
		
	}

	@Override
	public void salvar(Servico servico) {
		
		dao.salvar(servico);
		
		var barbearia = daoBarbearia.buscarPorId(servico.getBarbearia().getId());
		
		barbearia.setQtdServico(barbearia.getQtdServico()+1);
		
		daoBarbearia.alterar(barbearia);
		
		
	}

	@Override
	public void desativar(int id) {
		
		var servico = dao.buscarPorId(id);
		
		var barbearia = daoBarbearia.buscarPorId(servico.getBarbearia().getId());
		
		barbearia.setQtdServico(barbearia.getQtdServico()-1);
		
		daoBarbearia.alterar(barbearia);
		
		dao.desativar(id);
		
	}

	@Override
	public void atualizar(Servico servico) {
		dao.atualizar(servico);
		
	}

}
