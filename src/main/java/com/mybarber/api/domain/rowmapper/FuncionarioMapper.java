package com.mybarber.api.domain.rowmapper;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.springframework.jdbc.core.RowMapper;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Endereco;
import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.entity.Perfil;
import com.mybarber.api.domain.entity.Usuario;
import com.mybarber.api.domain.util.Cargo;



public class FuncionarioMapper implements RowMapper<Funcionario> {

	@Override
	public Funcionario mapRow(ResultSet rs, int rowNum) throws SQLException {
		if(rs.getDate("data_nascimento")!=null) {
		return new Funcionario(rs.getInt("id_funcionario"),rs.getString("nome"),rs.getString("sobrenome"),rs.getString("telefone"),rs.getDate("data_nascimento").toLocalDate() ,
				new Endereco(rs.getInt("id_endereco"),rs.getString("logradouro"),rs.getString("bairro"),rs.getInt("numero"),rs.getString("cep"),rs.getString("cidade"),rs.getString("uf")),
				new Usuario(rs.getInt("id_usuario"),rs.getString("login"),rs.getBoolean("ativo"),new Perfil(rs.getInt("id_perfil"),rs.getString("descricao_perfil")),rs.getString("email")),
				Cargo.valueOf(rs.getString("cargo")),
				new Barbearia(rs.getInt("id_barbearia")));
		}else {
			return new Funcionario(rs.getInt("id_funcionario"),rs.getString("nome"),rs.getString("sobrenome"),rs.getString("telefone"),
					new Endereco(rs.getInt("id_endereco"),rs.getString("logradouro"),rs.getString("bairro"),rs.getInt("numero"),rs.getString("cep"),rs.getString("cidade"),rs.getString("uf")),
					new Usuario(rs.getInt("id_usuario"),rs.getString("login"),rs.getBoolean("ativo"),new Perfil(rs.getInt("id_perfil"),rs.getString("descricao_perfil")),rs.getString("email")),
					Cargo.valueOf(rs.getString("cargo")),
					new Barbearia(rs.getInt("id_barbearia")));
		}
	}
}
