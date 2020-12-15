package com.mybarber.api.domain.entity;

import java.time.LocalDate;

public abstract class Pessoa {

	
   private int id;
	
	protected String nome;
	
	protected String sobrenome;
	
	protected String telefone;

	protected LocalDate dataNascimento;
	
	protected Endereco endereco;
	
	protected Usuario usuario;

	public Pessoa(int id, String nome, String telefone, LocalDate dataNascimento, Endereco endereco, Usuario usuario) {

		this.id = id;
		this.nome = nome;
		this.telefone = telefone;
		this.dataNascimento = dataNascimento;
		this.endereco = endereco;
		this.usuario = usuario;

	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
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

	public String getTelefone() {
		return telefone;
	}

	public void setTelefone(String telefone) {
		this.telefone = telefone;
	}


	public LocalDate getDataNascimento() {
		return dataNascimento;
	}

	public void setDataNascimento(LocalDate dataNascimento) {
		this.dataNascimento = dataNascimento;
	}

	
	public Endereco getEndereco() {
		return endereco;
	}

	public void setEndereco(Endereco endereco) {
		this.endereco = endereco;
	}
	
	public String getSobrenome() {
		return sobrenome;
	}

	public void setSobrenome(String sobrenome) {
		this.sobrenome = sobrenome;
	}
	
	
	

	public Pessoa(int id, String nome,String sobrenome, String telefone, LocalDate dataNascimento,
			Endereco endereco, Usuario usuario) {
		this.id = id;
		this.nome = nome;
		this.sobrenome = sobrenome;
		this.telefone = telefone;
		this.dataNascimento = dataNascimento;
		this.endereco = endereco;
		this.usuario = usuario;
	}

	public Pessoa() {
	}

	public Pessoa(int id) {
		this.id = id;
	}

	

	public Pessoa(int id, String nome,String sobrenome, String telefone,Endereco endereco, Usuario usuario) {
		this.id = id;
		this.nome = nome;
		this.sobrenome = sobrenome;
		this.telefone = telefone;
		this.endereco = endereco;
		this.usuario = usuario;
	}

	public Pessoa(int id, String nome) {
		this.id = id;
		this.nome = nome;
	}
	
}
