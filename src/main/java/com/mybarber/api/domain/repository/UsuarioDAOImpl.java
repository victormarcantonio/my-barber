package com.mybarber.api.domain.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.Perfil;
import com.mybarber.api.domain.entity.Pessoa;
import com.mybarber.api.domain.entity.Usuario;

@Repository
public class UsuarioDAOImpl implements UsuarioDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	

	
	String buscarportoken = "SELECT * FROM usuario WHERE reset_token = ?";
	String alterarsenha = "update usuario set senha =?, ativo=? where id =?";

	@Override
	public void salvar(Usuario usuario) {
		
		String salvar = "insert into usuario(login,senha,ativo,email) values(?,?,?,?)";

		KeyHolder keyHolder = new GeneratedKeyHolder();
		jdbcTemplate.update(new PreparedStatementCreator() {

			@Override
			public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
				PreparedStatement ps = con.prepareStatement(salvar, new String[] { "id" });
				if(usuario.getLogin()!=null) {
					ps.setString(1, usuario.getLogin());
				}else {
					ps.setNull(1, java.sql.Types.VARCHAR);
				}
				
				if(usuario.getSenha()!=null) {
					ps.setString(2, usuario.getSenha());
				}else{
					ps.setNull(2, java.sql.Types.VARCHAR);
				}
				
				ps.setBoolean(3, false);
				ps.setString(4, usuario.getEmail());
				return ps;
			}
		}, keyHolder);

		int idUsuario = keyHolder.getKey().intValue();
		usuario.setId(idUsuario);
		
		String salvarUsuarioPerfil = "insert into usuario_perfil values (?,?)";
		
		jdbcTemplate.update(salvarUsuarioPerfil,usuario.getId(),usuario.getPerfil().getId());
		
	}

	@Override
	public Usuario buscar(int id) {
		
		String buscar = """
				select * from usuario u inner join usuario_perfil up on up.id_usuario = u.id
				         inner join perfil p on up.id_perfil = p.id
				         where u.id = ?
				""";
		
		return jdbcTemplate.queryForObject(buscar, new Object[] { id },
				(rs, rowNum) -> new Usuario(rs.getInt("id"), rs.getString("login"),
						rs.getBoolean("ativo"), new Perfil(rs.getInt("id_perfil"), rs.getString("descricao")),rs.getString("email")));
	}

	@Override
	public void alterar(Usuario usuario) {
		

		String alterar = "update usuario set login = ?, email = ? where id =?";

		jdbcTemplate.update(alterar, usuario.getLogin(),usuario.getEmail(),usuario.getId());
		
		String alterarUsuarioPerfil = "update usuario_perfil set id_perfil = ? where id_usuario= ?";
		jdbcTemplate.update(alterarUsuarioPerfil, usuario.getPerfil().getId(),usuario.getId());
		
	}

	@Override
	public void excluir(Usuario usuario) {
		// trazer id
		
		
		
		String excluirUsuarioPerfil = "delete from usuario_perfil where id_usuario =?";
		jdbcTemplate.update(excluirUsuarioPerfil, usuario.getId());
		
		String excluir = "delete from usuario where id =?";
		jdbcTemplate.update(excluir, usuario.getId());
		
	}

	@Override
	public void alterarSenha(Usuario usuario) {

		jdbcTemplate.update(alterarsenha, usuario.getSenha(), true, usuario.getId());
	}

	@Override
	public Usuario buscarPorLogin(String login) {

		String buscarPorLogin = "select u.id, u.login,u.ativo" + " from usuario u" + " where u.login = ?";

		try {
			return jdbcTemplate.queryForObject(buscarPorLogin, new Object[] { login },
					(rs, rowNum) -> new Usuario(rs.getInt("id"), rs.getString("login"), rs.getBoolean("ativo")));

		} catch (Exception e) {
			return null;
		}

	}

	@Override
	public boolean verificarLogin(String login) {

		var verificarLogin = "SELECT EXISTS(SELECT FROM usuario WHERE login = ?)";

		return jdbcTemplate.queryForObject(verificarLogin, new Object[] { login }, Boolean.class);
	}

	@Override
	public boolean verificarEmail(String email) {

		var verificarEmail = "SELECT EXISTS(SELECT FROM usuario WHERE email = ?)";

		return jdbcTemplate.queryForObject(verificarEmail, new Object[] { email }, Boolean.class);
		
	}

	@Override
	public Usuario buscarPorEmail(String email) {
		
		String buscarPorEmail = "select * from usuario u where u.email = ?";

		try {
			return jdbcTemplate.queryForObject(buscarPorEmail, new Object[] { email },
					(rs, rowNum) -> new Usuario(rs.getInt("id"), rs.getString("login"), rs.getBoolean("ativo")));

		} catch (Exception e) {
			return null;
		}
	}

	@Override
	public Map<String, Integer> buscarGerenciarUsuario(Usuario usuario) {
		
		var buscarGerenciarUsuario = """
				select * from gerenciar_usuario where id_usuario = ?           
                """;
		
		return jdbcTemplate.queryForObject(buscarGerenciarUsuario, new Object[]{usuario.getId()},
                (rs, rowNum) -> {
                    Map<String, Integer> results = new HashMap<>();
                    
                    results.put("id_funcionario", (Integer)  rs.getObject("id_funcionario"));
                    results.put("id_cliente", (Integer) rs.getObject("id_cliente"));
                    
                    return results;
                }
        );
		
	}



}
