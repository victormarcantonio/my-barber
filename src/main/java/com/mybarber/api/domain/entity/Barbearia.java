package com.mybarber.api.domain.entity;


import org.springframework.stereotype.Component;

@Component
public class Barbearia {

    private int id;
		
   
	private String nome;

 
	private String descricao;
	
  
	private Endereco endereco;
	
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

	
	
	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	public Barbearia() {
	}

	public Barbearia(int id) {
		this.id = id;
	}

	public Barbearia(int id, String nome, String descricao, Endereco endereco,Integer qtdCliente, Integer qtdFuncionario, Integer qtdServico) {
		super();
		this.id = id;
		this.nome = nome;
		this.descricao = descricao;
		this.endereco = endereco;
		this.qtdCliente = qtdCliente;
		this.qtdFuncionario = qtdFuncionario;
		this.qtdServico = qtdServico;
	}

	public Barbearia(String nome, Endereco endereco) {
		this.nome = nome;
		this.endereco = endereco;
	}

}
