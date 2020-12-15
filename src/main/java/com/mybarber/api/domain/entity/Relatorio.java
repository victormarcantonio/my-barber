package com.mybarber.api.domain.entity;

public class Relatorio {

	private double valor;
	private Integer mes;

	public double getValor() {
		return valor;
	}

	public void setValor(double valor) {
		this.valor = valor;
	}

	public Integer getMes() {
		return mes;
	}

	public void setMes(Integer mes) {
		this.mes = mes;
	}

	public Relatorio(double valor, Integer mes) {
		this.valor = valor;
		this.mes = mes;
	}

	public Relatorio() {
	}

}
