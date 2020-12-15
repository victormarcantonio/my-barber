package com.mybarber.api.domain.repository;



import java.util.List;

import com.mybarber.api.domain.entity.HorarioAtendimento;

public interface HorarioAtendimentoDAO {

	public void salvar(List<HorarioAtendimento> horarioAtendimento);
	public List<HorarioAtendimento> buscarPorFuncionario(int idFuncionario);
	public void editar(List<HorarioAtendimento> horarios);
	public void excluir(int idFuncionario);
}
