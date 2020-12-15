package com.mybarber.api.domain.util;

public enum DiaDaSemana {
	
	SEGUNDA(1),
	TERCA(2),
	QUARTA(3),
	QUINTA(4),
	SEXTA(5),
	SABADO(6),
	DOMINGO(7);
	
	private int numeroSemana;

	public int getNumeroSemana() {
		return numeroSemana;
	}

	public void setNumeroSemana(int numeroSemana) {
		this.numeroSemana = numeroSemana;
	}

	private DiaDaSemana(int numeroSemana) {
		this.numeroSemana = numeroSemana;
	}
	

}
