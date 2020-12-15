package com.mybarber.api.domain.repository;

import java.util.List;

import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.util.Cargo;

public interface FuncionarioDAO {


	public void salvar(Funcionario funcionario);
	public List<Funcionario> listar(int id);
	public Funcionario buscar(int id);
	public void alterar(Funcionario funcionario);
	public void excluir(Funcionario funcionario);
	public List<Funcionario> listarPorCargo(Cargo cargo, int id_barbearia);
	public Funcionario buscarPorIdUsuario(int idUsuario);
}
