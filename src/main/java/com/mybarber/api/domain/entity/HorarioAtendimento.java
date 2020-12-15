package com.mybarber.api.domain.entity;

import java.time.LocalTime;

import com.mybarber.api.api.dto.funcionario.HorarioAtendimentoDTO;
import com.mybarber.api.domain.util.DiaDaSemana;

public class HorarioAtendimento {

	private int id;
	private boolean aberto;
	private DiaDaSemana dia;
	private LocalTime entrada;
	private LocalTime saida;
	private LocalTime entradaAlmoco;
	private LocalTime saidaAlmoco;
	private boolean almoco;
	private Funcionario funcionario;
	
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

	
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public boolean isAberto() {
		return aberto;
	}
	public void setAberto(boolean aberto) {
		this.aberto = aberto;
	}
	public DiaDaSemana getDia() {
		return dia;
	}
	public void setDia(DiaDaSemana dia) {
		this.dia = dia;
	}
	public Funcionario getFuncionario() {
		return funcionario;
	}
	public void setFuncionario(Funcionario funcionario) {
		this.funcionario = funcionario;
	}
	
	public HorarioAtendimento() {
	}
	
	
	
	public HorarioAtendimento(int id, boolean aberto, DiaDaSemana dia, LocalTime entrada, LocalTime saida,
			LocalTime entradaAlmoco, LocalTime saidaAlmoco,boolean almoco) {
		this.id = id;
		this.aberto = aberto;
		this.dia = dia;
		this.entrada = entrada;
		this.saida = saida;
		this.entradaAlmoco = entradaAlmoco;
		this.saidaAlmoco = saidaAlmoco;
		this.almoco = almoco;
	}
	
	public HorarioAtendimentoDTO toDTO() {
		
		var horarioAtendimentoDTO = new HorarioAtendimentoDTO();
		horarioAtendimentoDTO.setAberto(this.aberto);
		horarioAtendimentoDTO.setDia(this.getDia().getNumeroSemana());
		horarioAtendimentoDTO.setSaida(this.saida);
		horarioAtendimentoDTO.setEntrada(this.entrada);
		horarioAtendimentoDTO.setEntradaAlmoco(this.entradaAlmoco);
		horarioAtendimentoDTO.setSaidaAlmoco(this.saidaAlmoco);
		horarioAtendimentoDTO.setAlmoco(this.almoco);
		
		return horarioAtendimentoDTO;
	}
	

	public boolean isAlmoco() {
		return almoco;
	}
	public void setAlmoco(boolean almoco) {
		this.almoco = almoco;
	}
	
}


