package com.mybarber.api.domain.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class TokenDeVerificacao {
	
	private Long id;

	private String token;
	
	private LocalDateTime dataHoraExpiracao;
	
	private LocalDateTime dataHoraEmissao;
	

	private Usuario usuario;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Usuario getUsuario() {
		return usuario;
	}

	public void setUsuario(Usuario usuario) {
		this.usuario = usuario;
	}

	//quando cria o token j� atribue esses valores
	public TokenDeVerificacao() {
		
		this.token = UUID.randomUUID().toString();
		this.dataHoraEmissao = LocalDateTime.now();
		this.dataHoraExpiracao = this.dataHoraEmissao.plusDays(1);
	}

	public TokenDeVerificacao(Long id, String token, LocalDateTime dataHoraExpiracao,
			LocalDateTime dataHoraEmissao,Usuario usuario) {
		
		this.id = id;
		this.token = token;
		this.dataHoraExpiracao = dataHoraExpiracao;
		this.dataHoraEmissao = dataHoraEmissao;
		this.usuario = usuario;
	}
	

	public LocalDateTime getDataHoraExpiracao() {
		return dataHoraExpiracao;
	}

	public void setDataHoraExpiracao(LocalDateTime dataHoraExpiracao) {
		this.dataHoraExpiracao = dataHoraExpiracao;
	}

	public LocalDateTime getDataHoraEmissao() {
		return dataHoraEmissao;
	}

	public void setDataHoraEmissao(LocalDateTime dataHoraEmissao) {
		this.dataHoraEmissao = dataHoraEmissao;
	}

	
}
