package com.mybarber.api.api.dto;

import java.time.LocalDate;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.mybarber.api.api.dto.barbearia.BarbeariaDTO;
import com.mybarber.api.api.dto.endereco.EnderecoDTO;
import com.mybarber.api.api.dto.usuario.UsuarioDTO;

public class PessoaDTO {
	
	    
	    private String nome;
	    private String sobrenome;
	    private String telefone;
	    private LocalDate dataNascimento;
	    private EnderecoDTO endereco;
	    private UsuarioDTO usuario;
		public String getNome() {
			return nome;
		}
		public void setNome(String nome) {
			this.nome = nome;
		}
		public String getSobrenome() {
			return sobrenome;
		}
		public void setSobrenome(String sobrenome) {
			this.sobrenome = sobrenome;
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
		public UsuarioDTO getUsuario() {
			return usuario;
		}
		public void setUsuario(UsuarioDTO usuario) {
			this.usuario = usuario;
		}

}
