package com.mybarber.api.domain.util;

public enum Cargo {

	BARBEIRO("BARBEIRO"),
	RECEPCIONISTA("RECEPCIONISTA");
	
	private String descricao;

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	private Cargo(String descricao) {
		this.descricao = descricao;
	}

}
