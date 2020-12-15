package com.mybarber.api.api.dto.agendamento;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.mybarber.api.api.dto.cliente.ClienteRM;
import com.mybarber.api.api.dto.servico.ServicoDTO;
import com.mybarber.api.domain.util.SituacaoAgendamento;


public class AgendamentoDTO {

	private int id;
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime dataHorarioInicio;
	 @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime dataHorarioFim;
	private String observacao;
	private SituacaoAgendamento status;
	private Double valor;
	private ClienteRM cliente;
	private List<ServicoDTO> servicos;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public String getObservacao() {
		return observacao;
	}
	public void setObservacao(String observacao) {
		this.observacao = observacao;
	}
	public SituacaoAgendamento getStatus() {
		return status;
	}
	public void setStatus(SituacaoAgendamento status) {
		this.status = status;
	}
	public Double getValor() {
		return valor;
	}
	public void setValor(Double valor) {
		this.valor = valor;
	}
	public ClienteRM getCliente() {
		return cliente;
	}
	public void setCliente(ClienteRM cliente) {
		this.cliente = cliente;
	}
	public List<ServicoDTO> getServicos() {
		return servicos;
	}
	public void setServicos(List<ServicoDTO> servicos) {
		this.servicos = servicos;
	}
	
}
