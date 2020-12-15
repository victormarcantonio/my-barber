package com.mybarber.api.domain.entity;

import java.time.LocalDateTime;
import java.util.List;


import com.mybarber.api.domain.util.SituacaoAgendamento;



public abstract class Agendamento {

	
	
	private int id;
	private LocalDateTime dataHorarioInicio;
	private LocalDateTime dataHorarioFim;
	private String observacao;
	private Double valor;
	protected SituacaoAgendamento status;
	private Cliente cliente;
	private Funcionario funcionario;
	private List<Servico> servicos;
	
	
	
	public LocalDateTime getDataHorarioInicio() {
		return dataHorarioInicio;
	}
	public void setDataHorarioInicio(LocalDateTime dataHorarioInicio) {
		this.dataHorarioInicio = dataHorarioInicio;
	}
	public LocalDateTime getDataHorarioFim() {
		return dataHorarioFim;
	}
	public void setDataHorarioFim(LocalDateTime dataHorarioFim) {
		this.dataHorarioFim = dataHorarioFim;
	}
	public String getObservacao() {
		return observacao;
	}
	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}
	
	public Double getValor() {
		return valor;
	}
	public void setValor(Double valor) {
		this.valor = valor;
	}
	
	public List<Servico> getServicos() {
		return servicos;
	}
	public void setServicos(List<Servico> servicos) {
		this.servicos = servicos;
	}
	public Cliente getCliente() {
		return cliente;
	}
	public void setCliente(Cliente cliente) {
		this.cliente = cliente;
	}
	
	public Funcionario getFuncionario() {
		return funcionario;
	}
	public void setFuncionario(Funcionario funcionario) {
		this.funcionario = funcionario;
	}

	public Agendamento() {
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	
	
	public SituacaoAgendamento getStatus() {
		return status;
	}
	public void setStatus(SituacaoAgendamento status) {
		this.status = status;
	}
	public Agendamento(int id, LocalDateTime dataHorarioInicio, LocalDateTime dataHorarioFim, String observacao,SituacaoAgendamento status, Double valor, Cliente cliente) {
		
		this.id = id;
		this.dataHorarioInicio = dataHorarioInicio;
		this.dataHorarioFim = dataHorarioFim;
		this.observacao = observacao;
		this.valor = valor;
		this.cliente = cliente;
		this.status = status;
	}
	
	
	
	public Agendamento(LocalDateTime dataHorarioInicio, Double valor) {
		this.dataHorarioInicio = dataHorarioInicio;
		this.valor = valor;
	}
	public Agendamento(SituacaoAgendamento status) {
		this.status = status;
	}
	//criar algum metodo que os enum factory vai fazer coisas diferentes 
	public abstract String gerarColor();
	
	
}
