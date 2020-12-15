package com.mybarber.api.domain.enumfactory;


import com.mybarber.api.domain.entity.Agendamento;
import com.mybarber.api.domain.util.SituacaoAgendamento;

public class AgendamentoCancelado extends Agendamento {

	@Override
	public String gerarColor() {
		
		return "#EC7063";
	}

	public AgendamentoCancelado() {
		super();
		// TODO Auto-generated constructor stub
	}

	public AgendamentoCancelado(SituacaoAgendamento status) {
		super(status);
		// TODO Auto-generated constructor stub
	}

	
	
}
