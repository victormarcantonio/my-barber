package com.mybarber.api.domain.repository;

import java.util.List;

import com.mybarber.api.domain.entity.Servico;



public interface ServicoDAO {

	public List<Servico>listarAtivos(int idaBarbearia);
	
	public void salvar(Servico servico);
	
	public void desativar(int id);
	
	public void atualizar(Servico servico);
	
	public Servico buscarPorId(int id);
	
	public List<Servico> buscarPorIdAgendamento(int idAgendamento);
	
}
