package com.mybarber.api.domain.entity;

import java.time.LocalTime;

import org.springframework.stereotype.Component;

@Component
public class Servico {

	private int id;

	private String descricao;

	private float valor;

	private LocalTime tempo;

	private Barbearia barbearia;
	
	private Promocao promocao;

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

	public float getValor() {
		return valor;
	}

	public void setValor(float valor) {
		this.valor = valor;
	}

	public LocalTime getTempo() {
		return tempo;
	}

	public void setTempo(LocalTime tempo) {
		this.tempo = tempo;
	}

	public Barbearia getBarbearia() {
		return barbearia;
	}

	public void setBarbearia(Barbearia barbearia) {
		this.barbearia = barbearia;
	}
	
	

	public Promocao getPromocao() {
		return promocao;
	}

	public void setPromocao(Promocao promocao) {
		this.promocao = promocao;
	}

	public Servico(int id, String descricao, float valor, LocalTime tempo, Promocao promocao,Barbearia barbearia) {
		this.id = id;
		this.descricao = descricao;
		this.valor = valor;
		this.tempo = tempo;
		this.promocao = promocao;

		this.barbearia = barbearia;
	}
	
	
	public Servico(int id, String descricao, float valor, LocalTime tempo) {
		this.id = id;
		this.descricao = descricao;
		this.valor = valor;
		this.tempo = tempo;
	}

	public Servico(int id) {
		this.id = id;
	}

	public Servico() {
	}

	
	

}
