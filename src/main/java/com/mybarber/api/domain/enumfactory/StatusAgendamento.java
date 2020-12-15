package com.mybarber.api.domain.enumfactory;


import com.mybarber.api.domain.entity.Agendamento;
import com.mybarber.api.domain.util.SituacaoAgendamento;

public enum StatusAgendamento {
	
	AGENDADO {
		
		@Override
		public Agendamento obterStatus() {
			 return new AgendamentoAgendado(SituacaoAgendamento.AGENDADO);
		}
	},
	CANCELADO {
		
		@Override
		public Agendamento obterStatus(){
			return new AgendamentoCancelado(SituacaoAgendamento.CANCELADO);
		}
	},
	CONCLUIDO {
		
		@Override
		public Agendamento obterStatus() {
			return new AgendamentoConcluido(SituacaoAgendamento.CONCLUIDO);
		}
	};
	
	public abstract Agendamento obterStatus();
}
