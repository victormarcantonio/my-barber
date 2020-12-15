package com.mybarber.api.api.dto.promocao;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

public class PromocaoDTO {

	private int id;
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate dataInicio;
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate dataFim;
	private String descricao;
	private float valor;
	private boolean status;
	private Long idServico;
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
	public Long getIdServico() {
		return idServico;
	}
	public void setIdServico(Long idServico) {
		this.idServico = idServico;
	}
	
	public float getValor() {
		return valor;
	}
	public void setValor(float valor) {
		this.valor = valor;
	}
	public PromocaoDTO() {
	}
	public boolean isStatus() {
		return status;
	}
	public void setStatus(boolean status) {
		this.status = status;
	}
   
	
}
