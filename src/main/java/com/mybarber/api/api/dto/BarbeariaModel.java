package com.mybarber.api.api.dto;

import com.mybarber.api.domain.entity.Endereco;

public class BarbeariaModel {

	    private int id;
		
	   
		private String nome;

	 
	
		
	  
		private Endereco endereco;


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



		public Endereco getEndereco() {
			return endereco;
		}


		public void setEndereco(Endereco endereco) {
			this.endereco = endereco;
		}
		
		
}
