package com.mybarber.api.domain.service;


import com.mybarber.api.domain.entity.Pessoa;
import com.mybarber.api.domain.entity.TokenDeVerificacao;

public interface TokenDeVerificacaoService {

	 TokenDeVerificacao criarToken(Pessoa pessoa);
	 TokenDeVerificacao validarToken(String token);
}
