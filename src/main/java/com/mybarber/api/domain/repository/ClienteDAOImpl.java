package com.mybarber.api.domain.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Cliente;
import com.mybarber.api.domain.entity.Endereco;
import com.mybarber.api.domain.entity.Usuario;

@Repository
public class ClienteDAOImpl implements ClienteDAO {

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	
	@Override
	public void cadastrar(Cliente cliente,int idBarbearia) {
		
		String salvar = "INSERT INTO cliente(nome, telefone, data_nascimento) VALUES (?, ?, ?)";
		
		try {
			KeyHolder keyHolder = new GeneratedKeyHolder();
			
			jdbcTemplate.update(new PreparedStatementCreator() {
				
				@Override
				public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
					PreparedStatement ps = con.prepareStatement(salvar, new String[] { "id" });
					ps.setString(1, cliente.getNome());
					ps.setString(2, cliente.getTelefone());
					ps.setObject(3, cliente.getDataNascimento());
					
					return ps;
				}
			}, keyHolder);
			
			int idCliente = keyHolder.getKey().intValue();
			cliente.setId(idCliente);
			
			if(idBarbearia!=0) {
				
				String salvarClientaBarbearia = "insert into cliente_barbearia values (?,?)";
				jdbcTemplate.update(salvarClientaBarbearia,cliente.getId(),idBarbearia);
			}
			
           var salvarGerenciarUsuario = "insert into gerenciar_usuario(id_usuario, id_cliente) values (?,?)";
			
			jdbcTemplate.update(salvarGerenciarUsuario,cliente.getUsuario().getId(),cliente.getId());
			
		}catch (Exception e) {
			throw e ;
		}
		
	}

	@Override
	public Cliente buscarPorid(int id) {
		
		String buscarPorid = """
				select c.* , u.email, u.id id_usuario
				from cliente c 
				inner join cliente_barbearia cb on cb.id_cliente = c.id 
				inner join gerenciar_usuario gu on gu.id_cliente = c.id
				inner join usuario u on u.id = gu.id_usuario
                where c.id = ?
				""";
		
		return jdbcTemplate.queryForObject(buscarPorid, new Object[] { id }, (rs, rowNum) ->
		new Cliente(rs.getInt("id"),rs.getString("nome"),rs.getString("telefone"),rs.getDate("data_nascimento").toLocalDate() ,
				new Endereco(),
				new Usuario(rs.getInt("id_usuario"),rs.getString("email"))
				));
	}

	@Override
	public void editar(Cliente cliente) {
		
		String editar = """
				UPDATE cliente SET nome=?, telefone=?, data_nascimento=? WHERE id = ?
				""";
		
		
		jdbcTemplate.update(editar, cliente.getNome(), cliente.getTelefone(), cliente.getDataNascimento(),cliente.getId());	
		
	}

	@Override
	public void excluir(int id) {
		
		String excluirClienteBarbearia = "delete from CLIENTE_BARBEARIA WHERE ID_CLIENTE  = ? ";
		jdbcTemplate.update(excluirClienteBarbearia, id);	

		//só poder excluir quando for ele mesmo, mudar isso depois 
		//String excluir = "delete from cliente where id = ?";
		//jdbcTemplate.update(excluir, id);	
		
	}

	@Override
	public List<Cliente> listar(int idBarbearia) {
		
		String listar = """
				select c.* , u.email
				from cliente c 
				inner join cliente_barbearia cb on cb.id_cliente = c.id 
				inner join gerenciar_usuario gu on gu.id_cliente = c.id
				inner join usuario u on u.id = gu.id_usuario
                where cb.id_barbearia = ?""";
		
		
 
		return jdbcTemplate.query(listar,  new Object[] { idBarbearia },
				(rs, rowNum) -> 
		
		new Cliente(rs.getInt("id"), 
				rs.getString("nome"), 
				rs.getString("telefone"),
				rs.getDate("data_nascimento").toLocalDate(),
				new Endereco(),
				new Usuario(rs.getString("email"))
				)  ) ;
	}

	@Override
	public int countPorBarbearia(int idBarbearia) {
		
		String countPorBarbearia = """
				select count(*) from cliente_barbearia where id_barbearia = ?""";
		
		return jdbcTemplate.queryForObject(countPorBarbearia,new Object[] { idBarbearia },int.class);
		
	}

	@Override
	public List<Cliente> autoCompleteNome(String nome) {
		
		String autoCompleteNome = """
				select c.* , u.email
				from cliente c 
				inner join cliente_barbearia cb on cb.id_cliente = c.id 
				inner join gerenciar_usuario gu on gu.id_cliente = c.id
				inner join usuario u on u.id = gu.id_usuario
                where c.nome LIKE ? 
                limit 10""";

 
		return jdbcTemplate.query(autoCompleteNome,  new Object[] {"%" + nome +"%"},
				(rs, rowNum) -> 
		
		new Cliente(rs.getInt("id"), 
				rs.getString("nome")
				) ) ;
	}

}
