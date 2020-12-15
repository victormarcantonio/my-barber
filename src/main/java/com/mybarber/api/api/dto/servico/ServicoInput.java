package com.mybarber.api.api.dto.servico;

import java.time.LocalTime;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.mybarber.api.api.util.FlexibleFloatDeserializer;

public class ServicoInput {

	 private int id;
	 
		@NotBlank
		@Size(min = 3,max = 60)
		private String descricao;
		
		@NotNull
	    @JsonDeserialize(using = FlexibleFloatDeserializer.class)
		@JsonProperty("valor")
		private float valor;
	    
	    @NotNull
	    private Long idBarbearia;
		@NotNull
		private LocalTime tempo;

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getDescricao() {
			return descricao;
		}

		public void setDescricao(String descricao) {
			this.descricao = descricao;
		}

		public float getValor() {
			return valor;
		}

		public void setValor(float valor) {
			this.valor = valor;
		}

		public LocalTime getTempo() {
			return tempo;
		}

		public void setTempo(LocalTime tempo) {
			this.tempo = tempo;
		}

		public Long getIdBarbearia() {
			return idBarbearia;
		}

		public void setIdBarbearia(Long idBarbearia) {
			this.idBarbearia = idBarbearia;
		}
		
		
		
}
