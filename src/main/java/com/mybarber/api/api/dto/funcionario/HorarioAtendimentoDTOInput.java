package com.mybarber.api.api.dto.funcionario;

import java.time.LocalTime;

import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.entity.HorarioAtendimento;
import com.mybarber.api.domain.util.DiaDaSemana;

public class HorarioAtendimentoDTOInput {

	
	private boolean aberto;
	private boolean almoco;
	private String dia;
	private LocalTime entrada;
	private LocalTime saida;
	private LocalTime saidaAlmoco;
	private LocalTime entradaAlmoco;
	private int idFuncionario;
	
	public boolean isAberto() {
		return aberto;
	}
	public void setAberto(boolean aberto) {
		this.aberto = aberto;
	}
	public boolean isAlmoco() {
		return almoco;
	}
	public void setAlmoco(boolean almoco) {
		this.almoco = almoco;
	}
	public String getDia() {
		return dia;
	}
	public void setDia(String dia) {
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
	public LocalTime getSaidaAlmoco() {
		return saidaAlmoco;
	}
	public void setSaidaAlmoco(LocalTime saidaAlmoco) {
		this.saidaAlmoco = saidaAlmoco;
	}
	public LocalTime getEntradaAlmoco() {
		return entradaAlmoco;
	}
	public void setEntradaAlmoco(LocalTime entradaAlmoco) {
		this.entradaAlmoco = entradaAlmoco;
	}
	public int getIdFuncionario() {
		return idFuncionario;
	}
	public void setIdFuncionario(int idFuncionario) {
		this.idFuncionario = idFuncionario;
	}
	
	
   public HorarioAtendimento toDoMain(HorarioAtendimentoDTOInput horarioDTO) {
		
		var horarioAtendimento = new HorarioAtendimento();
		
		
		horarioAtendimento.setAberto(horarioDTO.isAberto());
		horarioAtendimento.setEntrada(horarioDTO.getEntrada());
		horarioAtendimento.setSaida(horarioDTO.getSaida());
		horarioAtendimento.setAlmoco(horarioDTO.isAlmoco());
		horarioAtendimento.setSaidaAlmoco(horarioDTO.getSaidaAlmoco());
		horarioAtendimento.setEntradaAlmoco(horarioDTO.getEntradaAlmoco());
		horarioAtendimento.setFuncionario(new Funcionario(horarioDTO.getIdFuncionario()));
		horarioAtendimento.setDia(DiaDaSemana.valueOf(horarioDTO.getDia()));
		
		return horarioAtendimento;
		
	}
	
	
	
}
