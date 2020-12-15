package com.mybarber.api.domain.service;


import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.entity.Pessoa;
import com.mybarber.api.domain.entity.TokenDeVerificacao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.entity.Usuario;
import com.mybarber.api.domain.exception.NegocioException;
import com.mybarber.api.domain.repository.ClienteDAO;
import com.mybarber.api.domain.repository.EnderecoDAO;
import com.mybarber.api.domain.repository.FuncionarioDAO;
import com.mybarber.api.domain.repository.TokenDeVerificacaoDAO;
import com.mybarber.api.domain.repository.UsuarioDAO;
import com.mybarber.api.domain.util.EnviarEmail;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

	@Autowired
	private UsuarioDAO usuarioDAO;
	
	@Autowired
	private EnviarEmail enviarEmail;

	@Autowired
	private ClienteDAO clienteDAO;

	@Autowired
	private FuncionarioDAO funcionarioDAO;
	
	@Autowired
	TokenDeVerificacaoService tokenService;
	
	@Autowired
	TokenDeVerificacaoDAO tokenDAO;
	
	 @Autowired
	 EnderecoDAO daoEndereco;
	 
	 @Autowired
	 FuncionarioDAO daoFuncionario;


	public Usuario buscarPorLogin(String login) {
		return usuarioDAO.buscarPorLogin(login);
	}

	@Override
	public void alterarSenha(Usuario usuario) {
		
		if(tokenDAO.buscarPorIdUsuario(usuario.getId())!=null) {
			
			usuarioDAO.alterarSenha(usuario);
		}else {
			new Exception("Sem token");
		}

	}

	@Override
	public boolean verificarUsuario(String usuario) {

		return usuarioDAO.verificarLogin(usuario);
	}

	@Override
	public void esqueceuSenha(String email) {

		if(verificarEmail(email)) {
	
			try {
				var funcionario = funcionarioDAO.buscarPorIdUsuario(usuarioDAO.buscarPorEmail(email).getId());
				var token = tokenService.criarToken(funcionario);
				
				enviarEmail.resetarSenha(funcionario,token);
			}catch (Exception e) {
				throw new NegocioException("Funcionário não encontrado, e-mail utilizado por um cliente");
			}
			
			
		}else {
			throw new NegocioException("Email "+email+" não cadastrado");
		}
	}

	@Override
	public boolean verificarEmail(String email) {
		
		return usuarioDAO.verificarEmail(email);


	}

	@Override
	public Object buscarUsuarioLogado(String tipo) {
		
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String login = principal.toString();
		
		var usuario = buscarPorLogin(login);
		
		var gerenciarUsuario = usuarioDAO.buscarGerenciarUsuario(usuario);

		if(tipo.equals("cliente")) {
			
			var idCliente = gerenciarUsuario.get("id_cliente");
			if(idCliente!=null) {
				return clienteDAO.buscarPorid(idCliente);
			}else {
				throw new NegocioException("Não existe cliente com o usuario logado");
			}
			
		} else if(tipo.equals("funcionario")) {
			
			var idFuncionario = gerenciarUsuario.get("id_funcionario");
			if(idFuncionario!=null) {
				return funcionarioDAO.buscar(idFuncionario);
			}else {
				throw new NegocioException("Não existe funcionario com o usuario logado");
			}
			
		}else {
			throw new NegocioException("Tipo : "+tipo+" inválido");
		}
	
	}

	@Override
	public TokenDeVerificacao buscarToken(String token) {
		return  tokenService.validarToken(token);
	}

	@Transactional
	@Override
	public void editarPessoa(Pessoa pessoa) {
		
		Funcionario funcionarioLogado = (Funcionario) buscarUsuarioLogado("funcionario");



		if (pessoa.getEndereco() != null) {
			var endereco = pessoa.getEndereco();
			if(funcionarioLogado.getEndereco().getId()!=0){
				endereco.setId(funcionarioLogado.getEndereco().getId());
				daoEndereco.alterar(endereco);
			}else {
				pessoa.setEndereco(daoEndereco.salvar(endereco));
			}
        }
		
		Funcionario funcionario = (Funcionario) pessoa; 
		
		funcionario.setCargo(funcionarioLogado.getCargo());

		funcionario.setId(funcionarioLogado.getId());
		
		daoFuncionario.alterar(funcionario);
		
		
		var usuario = funcionario.getUsuario();

		usuario.setId(funcionarioLogado.getUsuario().getId());
		usuario.setPerfil(funcionarioLogado.getUsuario().getPerfil());
		usuario.setAtivo(funcionarioLogado.getUsuario().isAtivo());
		verificarUsuarioEdicao(pessoa.getUsuario());
		usuarioDAO.alterar(usuario);
		
		if(usuario.getSenha() != null ) usuarioDAO.alterarSenha(usuario);
		
		
	}
	
	public void verificarUsuarioEdicao(Usuario usuario) {

        var usuarioEdicao = usuario;

        var usuarioAntigoLogin = usuarioDAO.buscarPorLogin(usuarioEdicao.getLogin());

        if (usuarioAntigoLogin != null &&  usuarioAntigoLogin.getId() != usuarioEdicao.getId())
            throw new NegocioException("Já existe um usuário com login : " + usuarioEdicao.getLogin());

        var usuarioAntigoEmail = usuarioDAO.buscarPorEmail(usuarioEdicao.getEmail());

        if (usuarioAntigoEmail != null && usuarioAntigoEmail.getId() != usuarioEdicao.getId())
            throw new NegocioException("Já existe um usuário com email : " + usuarioEdicao.getEmail());
    }

}
