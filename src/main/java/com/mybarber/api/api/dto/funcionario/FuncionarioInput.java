package com.mybarber.api.api.dto.funcionario;

import com.mybarber.api.api.dto.barbearia.BarbeariaDTO;
import com.mybarber.api.api.dto.endereco.EnderecoDTO;
import com.mybarber.api.api.dto.usuario.UsuarioDTO;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;


public class FuncionarioInput {

    private int id;
    @NotBlank
    private String nome;
    private String sobrenome;
    private String telefone;
    
    private LocalDate dataNascimento;
    private EnderecoDTO endereco;
    @NotBlank
    private String cargo;
    private UsuarioDTO usuario;
    @NotNull
    private BarbeariaDTO barbearia;

    @NotNull
    private Boolean primeiroFuncionario;

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

    public EnderecoDTO getEndereco() {
        return endereco;
    }

    public void setEndereco(EnderecoDTO endereco) {
        this.endereco = endereco;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
    }

    public String getSobrenome() {
        return sobrenome;
    }

    public void setSobrenome(String sobrenome) {
        this.sobrenome = sobrenome;
    }

   
    public BarbeariaDTO getBarbearia() {
		return barbearia;
	}

	public void setBarbearia(BarbeariaDTO barbearia) {
		this.barbearia = barbearia;
	}

	public Boolean getPrimeiroFuncionario() {
		return primeiroFuncionario;
	}

	public void setPrimeiroFuncionario(Boolean primeiroFuncionario) {
        this.primeiroFuncionario = primeiroFuncionario;
    }
}
