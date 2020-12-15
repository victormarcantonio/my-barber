package com.mybarber.api.domain.enumfactory;

import com.mybarber.api.domain.entity.Agendamento;
import com.mybarber.api.domain.entity.Cliente;
import com.mybarber.api.domain.util.SituacaoAgendamento;

import java.time.LocalDateTime;


public class AgendamentoConcluido extends Agendamento {

	@Override
	public String gerarColor() {
		
		return "#2874A6";
	}

	public AgendamentoConcluido(SituacaoAgendamento status) {
		super(status);
	}

	public AgendamentoConcluido() {
		super();
	}

	public AgendamentoConcluido(int id, LocalDateTime dataHorarioInicio, LocalDateTime dataHorarioFim,
			String observacao, SituacaoAgendamento status, Double valor, Cliente cliente) {
		super(id, dataHorarioInicio, dataHorarioFim, observacao, status, valor, cliente);
	}
}
