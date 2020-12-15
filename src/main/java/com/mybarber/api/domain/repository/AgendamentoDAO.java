package com.mybarber.api.domain.repository;

import com.mybarber.api.domain.entity.Agendamento;
import com.mybarber.api.domain.entity.Relatorio;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;


public interface AgendamentoDAO {

	 void salvar(Agendamento agendamento);

	 List<Agendamento> listarPorBarbeiro(int idBarbeiro);

	 Agendamento buscarPorId(int idAgendamento);

	 void editar(Agendamento agendamento);

	 void alterarStatus(Agendamento agendamento);

	 List<Agendamento> buscarPorData(LocalDate data,int idBarbeiro);

	 List<Agendamento> buscarNaoNotificadosDiaAtual();

	 List<Relatorio> somaValorMensal(int idBarbearia, LocalDate data);
	
	 void alterarNotificado(int idAgendamento);
	
	 Map<String, Integer> countStatusAgendamentoMes(int idBarbearia,String MM);

	 List<Map<String, String>> relatorioServicosMes(int idBarbearia);
	
}
