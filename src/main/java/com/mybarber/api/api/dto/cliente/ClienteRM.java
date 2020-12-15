package com.mybarber.api.api.dto.cliente;

import javax.validation.constraints.NotNull;

public class ClienteRM {

	private int id;
	
	@NotNull
	private String nome;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	
}
