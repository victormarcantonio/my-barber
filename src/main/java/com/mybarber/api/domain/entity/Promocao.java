package com.mybarber.api.domain.entity;

import java.time.LocalDate;

import org.springframework.stereotype.Component;

/**
 * @author Victor
 *
 */
@Component
public class Promocao {

	private int id;
	private LocalDate dataInicio;
	private LocalDate dataFim;
	private String descricao;
	private boolean status;
	private float valor;
	private Servico servico;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public LocalDate getDataInicio() {
		return dataInicio;
	}
	public void setDataInicio(LocalDate dataInicio) {
		this.dataInicio = dataInicio;
	}
	public LocalDate getDataFim() {
		return dataFim;
	}
	public void setDataFim(LocalDate dataFim) {
		this.dataFim = dataFim;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public Servico getServico() {
		return servico;
	}
	public void setServico(Servico servico) {
		this.servico = servico;
	}
	
	
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
	
	public float getValor() {
		return valor;
	}
	public void setValor(float valor) {
		this.valor = valor;
	}
	public Promocao(int id, LocalDate dataInicio, LocalDate dataFim, String descricao, boolean status, float valor, Servico servico) {
		this.id = id;
		this.dataInicio = dataInicio;
		this.dataFim = dataFim;
		this.descricao = descricao;
		this.status = status;
		this.valor = valor;
		this.servico = servico;
	}
	
	
	
	
	public Promocao(LocalDate dataInicio, LocalDate dataFim, String descricao, boolean status,float valor,  Servico servico) {
		this.dataInicio = dataInicio;
		this.dataFim = dataFim;
		this.descricao = descricao;
		this.status = status;
		this.valor=valor;
		this.servico = servico;
	}
	public Promocao(boolean status) {
		this.status = status;
	}
	
	public Promocao(LocalDate dataFim, boolean status) {
		this.dataFim = dataFim;
		this.status = status;
	}
	
	
	public Promocao(int id,LocalDate dataInicio, LocalDate dataFim, String descricao,float valor, boolean status ) {
		this.id = id;
		this.dataInicio = dataInicio;
		this.dataFim = dataFim;
		this.descricao = descricao;
		this.valor = valor;
		this.status = status;
	}
	
	
	public Promocao(int id, LocalDate dataInicio, LocalDate dataFim, String descricao, boolean status, float valor) {
		this.id = id;
		this.dataInicio = dataInicio;
		this.dataFim = dataFim;
		this.descricao = descricao;
		this.status = status;
		this.valor = valor;
	}
	public Promocao() {
	}
	
	
	

	
	
}