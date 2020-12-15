package com.mybarber.api.domain.repository;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.TokenDeVerificacao;
import com.mybarber.api.domain.rowmapper.TokenDeVerficacaoMapper;

@Repository
public class TokenDeVerificacaoDAOImpl implements TokenDeVerificacaoDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Override
	public TokenDeVerificacao buscarPorToken(String token) {

		var buscarPorToken = """
				select * from token_de_verificacao t inner join usuario u on t.id_usuario = u.id where token = ?
				""";
		try {
			return jdbcTemplate.queryForObject(buscarPorToken, new Object[] { token }, new TokenDeVerficacaoMapper());
			
		}catch (Exception e) {
			System.out.println(e.getMessage());
			return null;
		}

	}

	@Override
	public TokenDeVerificacao buscarPorIdUsuario(int id) {

		var buscarPorIdUsuario = """
				select * from token_de_verificacao t inner join usuario u on u.id = t.id_usuario
				where u.id = ?
				""";

		return jdbcTemplate.queryForObject(buscarPorIdUsuario, new Object[] { id }, new TokenDeVerficacaoMapper());
	}

	@Override
	public void salvar(TokenDeVerificacao token) {
		 
		var salvar = """
				INSERT INTO token_de_verificacao(token, data_hora_emissao, data_hora_expiracao,id_usuario) VALUES  (?, ?, ?, ?)
				""";
		
		try {
			jdbcTemplate.update(salvar,token.getToken(),token.getDataHoraEmissao(),token.getDataHoraExpiracao(),token.getUsuario().getId());
			
		}catch (Exception e) {
			 throw e ;
			 
		}
		
		
	}

	@Override
	public void excluirPorIdUsuario(int id) {
		
		var excluirPorIdPessoa = """
				DELETE FROM token_de_verificacao WHERE id_usuario = ? 
				""";
		
		
			jdbcTemplate.update(excluirPorIdPessoa,id);
		
	}

}
