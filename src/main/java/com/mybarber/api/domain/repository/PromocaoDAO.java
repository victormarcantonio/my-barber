package com.mybarber.api.domain.repository;

import java.util.List;

import com.mybarber.api.domain.entity.Promocao;

public interface PromocaoDAO {

	
	public void salvar (Promocao promocao);
	
	public void editar (Promocao promocao);
	
	public Promocao status(int idServico);
	
	public Promocao buscar(int id);
	
	public void alterarStatus(Promocao promocao);
	
	public List <Promocao> listar();
}
