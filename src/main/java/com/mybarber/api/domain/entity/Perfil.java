package com.mybarber.api.domain.entity;

public class Perfil {

	public int id;
	public String descricao;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public Perfil() {
		
	}
	public Perfil(int id, String descricao) {
		this.id = id;
		this.descricao = descricao;
	}
}
