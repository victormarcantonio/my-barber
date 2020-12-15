package com.mybarber.api.api.dto.barbearia;

import com.mybarber.api.api.dto.endereco.EnderecoDTO;

public class BarbeariaDTO {

	private int id;  
	private String nome;
	private String descricao;
	private EnderecoDTO endereco;
    private Integer qtdFuncionario;
	private Integer qtdCliente;
	private Integer qtdServico;
	
	public Integer getQtdFuncionario() {
		return qtdFuncionario;
	}
	public void setQtdFuncionario(Integer qtdFuncionario) {
		this.qtdFuncionario = qtdFuncionario;
	}
	public Integer getQtdCliente() {
		return qtdCliente;
	}
	public void setQtdCliente(Integer qtdCliente) {
		this.qtdCliente = qtdCliente;
	}
	public Integer getQtdServico() {
		return qtdServico;
	}
	public void setQtdServico(Integer qtdServico) {
		this.qtdServico = qtdServico;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getDescricao() {
		return descricao;
	}
	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}
	public EnderecoDTO getEndereco() {
		return endereco;
	}
	public void setEndereco(EnderecoDTO endereco) {
		this.endereco = endereco;
	}
	
	
	
}
