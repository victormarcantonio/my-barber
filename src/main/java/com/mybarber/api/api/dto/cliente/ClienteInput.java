package com.mybarber.api.api.dto.cliente;

import java.time.LocalDate;

import javax.validation.constraints.NotBlank;

import com.mybarber.api.api.dto.usuario.UsuarioDTO;

public class ClienteInput {

	private int id;
	@NotBlank
	private String nome;
	private String telefone;
	private LocalDate dataNascimento;
	private int idBarbearia;
	private UsuarioDTO usuario;
	
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
	public UsuarioDTO getUsuario() {
		return usuario;
	}
	public void setUsuario(UsuarioDTO usuario) {
		this.usuario = usuario;
	}
}
