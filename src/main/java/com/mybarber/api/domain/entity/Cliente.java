package com.mybarber.api.domain.entity;

import java.time.LocalDate;

public class Cliente extends Pessoa {

	public Cliente() {
	}

	public Cliente(int id, String nome, String telefone, LocalDate dataNascimento, Endereco endereco,
			Usuario usuario) {
		super(id, nome, telefone,dataNascimento, endereco, usuario);
		
	}

	public Cliente(int id, String nome) {
		super(id, nome);
	}
	
	
	
}
