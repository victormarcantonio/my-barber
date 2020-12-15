package com.mybarber.api.domain.entity;



import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Component;

import com.mybarber.api.domain.util.Cargo;

@Component
public class Funcionario extends Pessoa {

	private Cargo cargo;
	
	private Barbearia barbearia;
	
	private List<HorarioAtendimento> horariosAtendimento;
	

	public Cargo getCargo() {
		return cargo;
	}


	public void setCargo(Cargo cargo) {
		this.cargo = cargo;
	}


	public Barbearia getBarbearia() {
		return barbearia;
	}


	public void setBarbearia(Barbearia barbearia) {
		this.barbearia = barbearia;
	}


	public Funcionario() {
	}

	public Funcionario(int id, String nome, String sobrenome, String telefone,LocalDate dataNascimento, Endereco endereco,
			Usuario usuario, Cargo cargo, Barbearia barbearia) {
		super(id, nome,sobrenome, telefone, dataNascimento, endereco, usuario);
		this.cargo = cargo;
		this.barbearia = barbearia;
	}

	public Funcionario(int id, String nome,String sobrenome, String telefone, Endereco endereco, Usuario usuario,
			Cargo cargo, Barbearia barbearia) {
		super(id, nome,sobrenome,telefone, endereco, usuario);
		this.cargo = cargo;
		this.barbearia = barbearia;
	}

	public Funcionario(int id, String nome,String sobrenome, String telefone, Endereco endereco, Cargo cargo,
			Usuario usuario, Barbearia barbearia) {
		super(id, nome,sobrenome, telefone, endereco, usuario);
		this.cargo = cargo;
		this.barbearia = barbearia;
	}

	public Funcionario(int id) {
		super(id);
	}


	public List<HorarioAtendimento> getHorariosAtendimento() {
		return horariosAtendimento;
	}


	public void setHorariosAtendimento(List<HorarioAtendimento> horariosAtendimento) {
		this.horariosAtendimento = horariosAtendimento;
	}

}
