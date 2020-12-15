package com.mybarber.api.domain.repository;

import com.mybarber.api.domain.entity.Endereco;

public interface EnderecoDAO {

	
	public Endereco salvar(Endereco endereco);
    public Endereco buscar(int id);
	public void alterar(Endereco endereco);
	public void excluir(Endereco endereco);

}
