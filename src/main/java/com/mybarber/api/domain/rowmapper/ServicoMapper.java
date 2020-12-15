package com.mybarber.api.domain.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Promocao;
import com.mybarber.api.domain.entity.Servico;

public class ServicoMapper implements RowMapper<Servico>{

	@Override
	public Servico mapRow(ResultSet rs, int rowNum) throws SQLException {
		
		
		if(rs.getObject("id_promocao") != null) {
		
		return  new Servico(rs.getInt("id"), rs.getString("descricao"),
				rs.getFloat("valor"), rs.getTime("tempo").toLocalTime(), 
				new Promocao(rs.getInt("id_promocao"),rs.getDate("dataInicio").toLocalDate(), 
						rs.getDate("dataFim").toLocalDate(),rs.getString("descricao"),
						rs.getBoolean("status"), rs.getFloat("valor_promocao")),
				new Barbearia(rs.getInt("id_barbearia")));
	}else {
		return  new Servico(rs.getInt("id"), rs.getString("descricao"),
				rs.getFloat("valor"), rs.getTime("tempo").toLocalTime(), null,new Barbearia(rs.getInt("id_barbearia")));
	}
		
	}

}
