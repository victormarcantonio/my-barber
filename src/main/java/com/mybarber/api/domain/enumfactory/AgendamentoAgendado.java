package com.mybarber.api.domain.enumfactory;

import com.mybarber.api.domain.entity.Agendamento;
import com.mybarber.api.domain.entity.Cliente;
import com.mybarber.api.domain.util.SituacaoAgendamento;

import java.time.LocalDateTime;



public class AgendamentoAgendado extends Agendamento {


	public AgendamentoAgendado() {
	}

	public AgendamentoAgendado(int id, LocalDateTime dataHorarioInicio, LocalDateTime dataHorarioFim, String observacao,
							   SituacaoAgendamento status, Double valor, Cliente cliente) {
		super(id, dataHorarioInicio, dataHorarioFim, observacao, status, valor, cliente);
		
	}
	
	
	public AgendamentoAgendado(SituacaoAgendamento status) {
		super(status);
	}

	@Override
	public String gerarColor() {
		
		return "#F1C40F";
	}
	
	
	
	
}
