package com.mybarber.api.domain.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.mybarber.api.domain.entity.TokenDeVerificacao;
import com.mybarber.api.domain.entity.Usuario;

public class TokenDeVerficacaoMapper implements RowMapper<TokenDeVerificacao> {

	@Override
	public TokenDeVerificacao mapRow(ResultSet rs, int rowNum) throws SQLException {
		
		return new TokenDeVerificacao(rs.getLong("id"),rs.getString("token"),rs.getTimestamp("data_hora_expiracao").toLocalDateTime(),
				rs.getTimestamp("data_hora_emissao").toLocalDateTime(),new Usuario(rs.getInt("id_usuario"),rs.getString("login"),rs.getBoolean("ativo")));
	}

	
}
