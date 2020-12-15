package com.mybarber.api.api.dto.agendamento;



import java.time.LocalDateTime;
import java.util.List;

import javax.validation.constraints.NotNull;



import com.fasterxml.jackson.annotation.JsonFormat;

import com.mybarber.api.api.dto.cliente.ClienteRM;
import com.mybarber.api.domain.entity.Servico;

public class AgendamentoDTOInput {

	private int id;
	
	@NotNull
	private ClienteRM cliente;

	@NotNull
	private int idFuncionario;
	
	private List<Servico> servicos;

	private int idBarbearia;

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm")
	@NotNull
	private LocalDateTime dataHorarioInicio;
	
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm")
	@NotNull
	private LocalDateTime dataHorarioFim;
	
	@NotNull
	private Double valor;
	
	private String observacao;
	
	public ClienteRM getCliente() {
		return cliente;
	}

	public void setCliente(ClienteRM cliente) {
		this.cliente = cliente;
	}

	public int getIdFuncionario() {
		return idFuncionario;
	}

	public void setIdFuncionario(int idFuncionario) {
		this.idFuncionario = idFuncionario;
	}

	public List<Servico> getServicos() {
		return servicos;
	}

	public void setServicos(List<Servico> servicos) {
		this.servicos = servicos;
	}

	public String getObservacao() {
		return observacao;
	}

	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}

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

	public Double getValor() {
		return valor;
	}

	public void setValor(Double valor) {
		this.valor = valor;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}


	public int getIdBarbearia() {
		return idBarbearia;
	}

	public void setIdBarbearia(int idBarbearia) {
		this.idBarbearia = idBarbearia;
	}
}
