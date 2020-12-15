package com.mybarber.api.domain.util;

public enum SituacaoAgendamento {

	AGENDADO("AGENDADO"),
	CONFIRMADO("CONFIRMADO"),
	CANCELADO("CANCELADO"),
	CONCLUIDO("CONCLUIDO");
	
	private String descricao;

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	private SituacaoAgendamento(String descricao) {
		this.descricao = descricao;
	}
	
}
