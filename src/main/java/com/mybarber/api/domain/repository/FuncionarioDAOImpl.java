package com.mybarber.api.domain.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

import org.springframework.asm.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.rowmapper.FuncionarioMapper;
import com.mybarber.api.domain.util.Cargo;

@Repository
public class FuncionarioDAOImpl implements FuncionarioDAO{

	@Autowired
	private JdbcTemplate jdbcTemplate;



	


	

	@Override
	public void salvar(Funcionario funcionario) {

	
			String salvar = """
					INSERT INTO funcionario( nome, sobrenome, telefone, data_nascimento, id_endereco, cargo, id_barbearia)
		            VALUES (?, ?, ?, ?, ?, ?, ?)""";
			
			KeyHolder keyHolder = new GeneratedKeyHolder();
			jdbcTemplate.update(new PreparedStatementCreator() {

				@Override
				public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
					PreparedStatement ps = con.prepareStatement(salvar, new String[] { "id" });
					
					
					ps.setString(1, funcionario.getNome());
					if(funcionario.getSobrenome()!= null) {
						ps.setString(2, funcionario.getSobrenome());
					}else {
						ps.setNull(2,java.sql.Types.VARCHAR);
					}
					
					if(funcionario.getTelefone()!= null) {
						ps.setString(3, funcionario.getTelefone());
					}else {
						ps.setNull(3,java.sql.Types.VARCHAR);
					}
					
					if(funcionario.getDataNascimento()!= null) {
						ps.setObject(4, funcionario.getDataNascimento());
					}else {
						ps.setNull(4,java.sql.Types.DATE);
					}
					
					if(funcionario.getEndereco()!= null) {
						ps.setNull(5, funcionario.getEndereco().getId());
					}else {
						ps.setNull(5,Type.INT);
					}
					
					ps.setString(6, funcionario.getCargo().getDescricao());
					ps.setInt(7, funcionario.getBarbearia().getId());
					return ps;
				}
			}, keyHolder);

			int ifFuncionario = keyHolder.getKey().intValue();
			funcionario.setId(ifFuncionario);
			
			
            var salvarGerenciarUsuario = "insert into gerenciar_usuario(id_usuario, id_funcionario) values (?,?)";
			
			jdbcTemplate.update(salvarGerenciarUsuario,funcionario.getUsuario().getId(),funcionario.getId());
			
			/*jdbcTemplate.update(salvar,funcionario.getNome(),
					funcionario.getSobrenome()!=null?funcionario.getSobrenome() : null,
					funcionario.getTelefone()!=null?funcionario.getTelefone() : null ,
					funcionario.getDataNascimento() !=null?funcionario.getDataNascimento(): null,
					funcionario.getEndereco()!=null?funcionario.getEndereco().getId(): null,
					funcionario.getCargo().getDescricao(),funcionario.getBarbearia().getId(),funcionario.getUsuario().getId());*/
			
			
			

	}

	@Override
	public List<Funcionario> listar(int id) {
		
		String listar = """
				select f.id id_funcionario,f.cargo, f.nome nome,f.sobrenome sobrenome, f.telefone, f.data_nascimento,
				 e.id id_endereco,e.logradouro,e.bairro,e.numero,e.cep, e.cidade, e.uf,
				 u.id id_usuario, u.login, u.ativo,u.email, per.id id_perfil, per.descricao descricao_perfil,
				 b.id id_barbearia
				 from funcionario f 
				 left join endereco e on f.id_endereco = e.id
				 inner join gerenciar_usuario gu on gu.id_funcionario = f.id 
				 inner join usuario u on gu.id_usuario = u.id
		         inner join usuario_perfil up on up.id_usuario = u.id
		         inner join perfil per on per.id = up.id_perfil
		         inner join barbearia b on f.id_barbearia = b.id
		         where b.id = ?
				""";

			return jdbcTemplate.query(listar, new Object[] { id },new FuncionarioMapper()) ;

	}


	@Override
	public Funcionario buscar(int id) {
		
		String buscar ="""
				select f.id id_funcionario,f.cargo, f.nome nome,f.sobrenome sobrenome, f.telefone, f.data_nascimento,
				 e.id id_endereco,e.logradouro,e.bairro,e.numero,e.cep, e.cidade, e.uf,
				 u.id id_usuario, u.login, u.ativo,u.email, per.id id_perfil, per.descricao descricao_perfil,
				 b.id id_barbearia
				 from funcionario f 
				 left join endereco e on f.id_endereco = e.id 
				 inner join gerenciar_usuario gu on gu.id_funcionario = f.id 
				 inner join usuario u on gu.id_usuario = u.id
		         inner join usuario_perfil up on up.id_usuario = u.id
		         inner join perfil per on per.id = up.id_perfil
		         inner join barbearia b on f.id_barbearia = b.id
		         where f.id = ?
				""";


		try {
			
			

		return jdbcTemplate.queryForObject(buscar, new Object[] { id },new FuncionarioMapper());
		}catch(Exception ex) {
			return null;
		}
	}

	@Override
	public void alterar(Funcionario funcionario) {

		String alterar = """
				UPDATE funcionario SET nome=?, sobrenome=?, telefone=?, data_nascimento=?, id_endereco=?, cargo=?
				WHERE id = ?;
				""";

		jdbcTemplate.update(alterar,funcionario.getNome(),
				funcionario.getSobrenome()!=null?funcionario.getSobrenome() : null,
				funcionario.getTelefone()!=null?funcionario.getTelefone() : null ,
				funcionario.getDataNascimento() !=null?funcionario.getDataNascimento(): null,
				funcionario.getEndereco()!=null?funcionario.getEndereco().getId(): null,
				funcionario.getCargo().getDescricao(),
				funcionario.getId());

	}

	@Override
	public void excluir(Funcionario funcionario) {
		
		var excluirGerenciarUsuario = "delete from gerenciar_usuario where id_funcionario = ?";
		
		jdbcTemplate.update(excluirGerenciarUsuario,funcionario.getId());

		var desativarFKAgendamento = "ALTER TABLE funcionario DISABLE TRIGGER ALL";
		jdbcTemplate.execute(desativarFKAgendamento);
		
		String excluir = "delete from funcionario where id = ?";
		jdbcTemplate.update(excluir, funcionario.getId());
		
		var ativarFKAgendamento = "ALTER TABLE funcionario ENABLE TRIGGER ALL";
		jdbcTemplate.execute(ativarFKAgendamento);
	}

	@Override
	public List<Funcionario> listarPorCargo(Cargo cargo, int id_barbearia) {


		String listarPorCargo = """
			select f.id id_funcionario,f.cargo, f.nome nome,f.sobrenome sobrenome, f.telefone, f.data_nascimento,
			 e.id id_endereco,e.logradouro,e.bairro,e.numero,e.cep, e.cidade, e.uf,
			 u.id id_usuario, u.login, u.ativo,u.email, per.id id_perfil, per.descricao descricao_perfil,
			 b.id id_barbearia
			 from funcionario f 
			 left join endereco e on f.id_endereco = e.id 
			 inner join gerenciar_usuario gu on gu.id_funcionario = f.id 
			 inner join usuario u on gu.id_usuario = u.id
	         inner join usuario_perfil up on up.id_usuario = u.id
	         inner join perfil per on per.id = up.id_perfil
	         left join barbearia b on f.id_barbearia = b.id
	         where f.cargo = ? and f.id_barbearia = ? 
			""";

		return jdbcTemplate.query(listarPorCargo,new Object[] { cargo.getDescricao(),id_barbearia }, new FuncionarioMapper()) ;

	}

	@Override
	public Funcionario buscarPorIdUsuario(int idUsuario) {
			
		String buscarPorIdUsuario = """
				select f.id id_funcionario,f.cargo, f.nome nome,f.sobrenome sobrenome, f.telefone, f.data_nascimento,
				 e.id id_endereco,e.logradouro,e.bairro,e.numero,e.cep, e.cidade, e.uf,
				 u.id id_usuario, u.login, u.ativo,u.email, per.id id_perfil, per.descricao descricao_perfil,
				 b.id id_barbearia
				 from funcionario f 
				 left join endereco e on f.id_endereco = e.id 
				 inner join gerenciar_usuario gu on gu.id_funcionario = f.id 
				 inner join usuario u on gu.id_usuario = u.id
		         inner join usuario_perfil up on up.id_usuario = u.id
		         inner join perfil per on per.id = up.id_perfil
		         left join barbearia b on f.id_barbearia = b.id
		         where gu.id_usuario= ? 
				""";

		return jdbcTemplate.queryForObject(buscarPorIdUsuario,new Object[] { idUsuario }, new FuncionarioMapper()) ;
	}

}
