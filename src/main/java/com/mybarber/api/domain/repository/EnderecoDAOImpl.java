package com.mybarber.api.domain.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.Endereco;

@Repository
public class EnderecoDAOImpl implements EnderecoDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	Endereco endereco;

	String salvar = "insert into endereco(logradouro,bairro,numero,cep,cidade,uf) values(?,?,?,?,?,?)";
	
	//arrumar isso 
	String buscar = "select e.id, e.logradouro, e.bairro, e.numero, e.cep, e.cidade, e.uf from endereco e , pessoa p\r\n" + 
			" where p.id_endereco = e.id" +
			" and p.id = ? "; //tirar isso aqui, se for buscar de uma barbearia ? 

	
	String deletar = "delete from endereco where id=? ";
	
	
	
	@Override
	public Endereco salvar(Endereco endereco) {

		
			KeyHolder holder = new GeneratedKeyHolder();

			jdbcTemplate.update(new PreparedStatementCreator() {

				@Override
				public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
					PreparedStatement ps = con.prepareStatement(salvar, new String[] { "id" });

					ps.setString(1, endereco.getLogradouro());
					ps.setString(2, endereco.getBairro());
					ps.setInt(3, endereco.getNumero());
					ps.setString(4, endereco.getCep());
					ps.setString(5, endereco.getCidade());
					ps.setString(6, endereco.getUf());
					return ps;
				}
			}, holder);

			int idEndereco = holder.getKey().intValue();
			endereco.setId(idEndereco);
			return endereco;
		
	}

	@Override
	public void alterar(Endereco endereco) {
		
		String atualizar = "update endereco set logradouro=?, bairro=?, numero = ?, cep = ?, cidade= ?, uf=? where id = ?";
		jdbcTemplate.update(atualizar, endereco.getLogradouro(),endereco.getBairro(),
				endereco.getNumero(), endereco.getCep(), endereco.getCidade(),endereco.getUf(), endereco.getId() );
	
	}

	@Override
	public Endereco buscar(int id) {
		
		return jdbcTemplate.queryForObject(buscar,  new Object[] { id }, (rs, rowNum) -> new Endereco(rs.getInt("id"),rs.getString("logradouro"),rs.getString("bairro"),rs.getInt("numero"),rs.getString("cep"),rs.getString("cidade"),rs.getString("uf")));
	}

	@Override
	public void excluir(Endereco endereco) {

		jdbcTemplate.update(deletar, endereco.getId());
		
	}

}
