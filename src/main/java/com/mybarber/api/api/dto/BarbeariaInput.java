package com.mybarber.api.api.dto;

import javax.validation.constraints.NotBlank;

import com.mybarber.api.domain.entity.Endereco;
import com.sun.istack.NotNull;

public class BarbeariaInput {

	private int id ;
    @NotBlank
	private String nome;

	private String descricao;
    
    @NotNull
	private Endereco endereco;

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}



	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
    
    
}
