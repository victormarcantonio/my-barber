package com.mybarber.api.domain.entity;

import org.springframework.stereotype.Component;

@Component
public class Endereco {

    private int id;
    
    private String logradouro;
    
    private String bairro;
    
	private int numero;

	private String cep;
	
	private String cidade;
	
	private String uf;
	

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getCep() {
		return cep;
	}

	public String getLogradouro() {
		return logradouro;
	}

	public void setRua(String logradouro) {
		this.logradouro = logradouro;
	}

	public void setCep(String cep) {
		this.cep = cep;
	}

	public int getNumero() {
		return numero;
	}

	public void setNumero(int numero) {
		this.numero = numero;
	}	
	

	public String getBairro() {
		return bairro;
	}

	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	public String getCidade() {
		return cidade;
	}

	public void setCidade(String cidade) {
		this.cidade = cidade;
	}

	public String getUf() {
		return uf;
	}

	public void setUf(String uf) {
		this.uf = uf;
	}

	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}


	public Endereco(int id, String logradouro, String bairro, int numero, String cep, String cidade, String uf) {
		this.id = id;
		this.logradouro = logradouro;
		this.bairro = bairro;
		this.numero = numero;
		this.cep = cep;
		this.cidade = cidade;
		this.uf = uf;
	}

	public Endereco() {
	}
	
	
	

}
