package com.mybarber.api.domain.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.Perfil;

@Repository
public class PerfilDAOImpl implements PerfilDAO{

	String listar = "select * from perfil";
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Override
	public List<Perfil> listar() {
		
		return jdbcTemplate.query(listar, (rs, rowNum) -> new Perfil(rs.getInt("id"), rs.getString("descricao")));
	}

}
