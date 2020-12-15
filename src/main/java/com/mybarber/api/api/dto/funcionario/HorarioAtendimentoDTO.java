package com.mybarber.api.api.dto.funcionario;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public class HorarioAtendimentoDTO {

	private boolean aberto;
	private int dia;
	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime entrada;
	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime saida;
	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime entradaAlmoco;
	@JsonFormat(pattern = "HH:mm:ss")
	private LocalTime saidaAlmoco;
	private boolean almoco;
	
	public boolean isAberto() {
		return aberto;
	}
	public void setAberto(boolean aberto) {
		this.aberto = aberto;
	}
	public int getDia() {
		return dia;
	}
	public void setDia(int dia) {
		this.dia = dia;
	}
	public LocalTime getEntrada() {
		return entrada;
	}
	public void setEntrada(LocalTime entrada) {
		this.entrada = entrada;
	}
	public LocalTime getSaida() {
		return saida;
	}
	public void setSaida(LocalTime saida) {
		this.saida = saida;
	}
	public LocalTime getEntradaAlmoco() {
		return entradaAlmoco;
	}
	public void setEntradaAlmoco(LocalTime entradaAlmoco) {
		this.entradaAlmoco = entradaAlmoco;
	}
	public LocalTime getSaidaAlmoco() {
		return saidaAlmoco;
	}
	public void setSaidaAlmoco(LocalTime saidaAlmoco) {
		this.saidaAlmoco = saidaAlmoco;
	}
	public boolean isAlmoco() {
		return almoco;
	}
	public void setAlmoco(boolean almoco) {
		this.almoco = almoco;
	}
	
}
