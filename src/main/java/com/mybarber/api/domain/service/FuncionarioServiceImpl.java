package com.mybarber.api.domain.service;


import java.util.List;
import java.util.Map;


import com.mybarber.api.domain.exception.NegocioException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.entity.HorarioAtendimento;
import com.mybarber.api.domain.entity.Usuario;
import com.mybarber.api.domain.repository.BarbeariaDAO;
import com.mybarber.api.domain.repository.EnderecoDAO;
import com.mybarber.api.domain.repository.FuncionarioDAO;
import com.mybarber.api.domain.repository.HorarioAtendimentoDAO;
import com.mybarber.api.domain.repository.PerfilDAO;
import com.mybarber.api.domain.repository.UsuarioDAO;
import com.mybarber.api.domain.util.Cargo;
import com.mybarber.api.domain.util.EnviarEmail;

@Service
@Transactional
public class FuncionarioServiceImpl implements FuncionarioService {

    @Autowired
    EnderecoDAO daoEndereco;

    @Autowired
    FuncionarioDAO daoFuncionario;

    @Autowired
    UsuarioDAO daoUsuario;


    @Autowired
    BarbeariaDAO daoBarbearia;

    @Autowired
    PerfilDAO daoPerfil;

    @Autowired
    HorarioAtendimentoDAO horarioAtendimentoDAO;

    @Autowired
    TokenDeVerificacaoService tokenService;


    @Autowired
    private EnviarEmail enviarEmail;

    @Override
    @Transactional
    public void salvar(Map<String, Object> map) {


        var funcionario = (Funcionario) map.get("funcionario");
        var primeiroFuncionario = (Boolean) map.get("primeiroFuncionario");

        if (!daoUsuario.verificarLogin(funcionario.getUsuario().getLogin())) {

            if (!daoUsuario.verificarEmail(funcionario.getUsuario().getEmail())) {

                if (funcionario.getEndereco() != null) {
                    funcionario.setEndereco(daoEndereco.salvar(funcionario.getEndereco()));
                }

                if (primeiroFuncionario) {
                    //salvar barbearia
                    var barbearia = funcionario.getBarbearia();
                    barbearia.setEndereco(funcionario.getEndereco());

                    barbearia = daoBarbearia.salvar(funcionario.getBarbearia());

                    funcionario.setBarbearia(barbearia);
                    //dados do usuario
                    funcionario.getUsuario().getPerfil().setDescricao("ADMINISTRADOR");
                    funcionario.setCargo(Cargo.BARBEIRO);
                }

                var barbearia = daoBarbearia.buscarPorId(funcionario.getBarbearia().getId());

                barbearia.setQtdFuncionario(barbearia.getQtdFuncionario() + 1);

                daoBarbearia.alterar(barbearia);
                daoUsuario.salvar(funcionario.getUsuario());
                daoFuncionario.salvar(funcionario);


                var token = tokenService.criarToken(funcionario);

                enviarEmail.ativarConta(funcionario, token);

            } else {
                throw new NegocioException("Email já existente.");
            }

        } else {
            throw new NegocioException("Login já existente.");
        }
    }

    @Override
    public void alterar(Funcionario funcionario) {


        if (funcionario.getId() != 0) {

            if (funcionario.getUsuario().getId() != 0) {

                verificarUsuarioEdicao(funcionario.getUsuario());

                if (funcionario.getEndereco() != null) {
                    daoEndereco.alterar(funcionario.getEndereco());
                }
                
                daoFuncionario.alterar(funcionario);

                var usuario = funcionario.getUsuario();
                
                daoUsuario.alterar(usuario);
                
                if(usuario.getSenha() != null ) daoUsuario.alterarSenha(usuario);

            } else {
                throw new NegocioException("Usuário sem id");
            }

        } else {
            throw new NegocioException("Funcionário sem id");
        }
    }


    @Override
    public List<Funcionario> listar(int idBarbearia) {

        return daoFuncionario.listar(idBarbearia);
    }

    public void verificarUsuarioEdicao(Usuario usuario) {

        var usuarioEdicao = usuario;

        var usuarioAntigoLogin = daoUsuario.buscarPorLogin(usuarioEdicao.getLogin());

        if (usuarioAntigoLogin != null &&  usuarioAntigoLogin.getId() != usuarioEdicao.getId())
            throw new NegocioException("Já existe um usuário com login : " + usuarioEdicao.getLogin());

        var usuarioAntigoEmail = daoUsuario.buscarPorEmail(usuarioEdicao.getEmail());

        if (usuarioAntigoEmail != null && usuarioAntigoEmail.getId() != usuarioEdicao.getId())
            throw new NegocioException("Já existe um usuário com email : " + usuarioEdicao.getEmail());
    }


    @Override
    public Funcionario buscar(int id) {


        var funcionario = daoFuncionario.buscar(id);

        return funcionario;
    }


    @Override
    public void excluir(int id) {


        //verificar se o funcionario não tem cadastro como cliente, se tiver manter usuario e excluir da tabela funcionario

        var funcionario = buscar(id);

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String login = principal.toString();

        var usuario = daoUsuario.buscarPorLogin(login);

        var funcionarioLogado = buscarPorIdUsuario(usuario.getId());

        if (funcionarioLogado.getId() != funcionario.getId()) {

            horarioAtendimentoDAO.excluir(funcionario.getId());
            daoFuncionario.excluir(funcionario);
            daoUsuario.excluir(funcionario.getUsuario());
            daoEndereco.excluir(funcionario.getEndereco());

            var barbearia = daoBarbearia.buscarPorId(funcionario.getBarbearia().getId());

            barbearia.setQtdFuncionario(barbearia.getQtdFuncionario() - 1);

            daoBarbearia.alterar(barbearia);

        } else {
            throw new NegocioException("Voce não pode se excluir");
        }
    }


    @Override
    public List<Funcionario> listarPorCargo(Map<String, Object> map) {

        var cargo = (String) map.get("cargo");
        var idBarbearia = (int) map.get("idBarbearia");

        if (checkCargo(cargo)) {
            return daoFuncionario.listarPorCargo(Cargo.valueOf(cargo), idBarbearia);
        } else {
            throw new NegocioException("Nome cargo : " + cargo + " inválido");
        }
    }

    public boolean checkCargo(String cargo) {

        for (Cargo c : Cargo.values()) {
            if (c.name().equals(cargo)) {
                return true;
            }
        }

        return false;
    }

    @Override
    public Funcionario buscarPorIdUsuario(int idUsuario) {

        return daoFuncionario.buscarPorIdUsuario(idUsuario);
    }

    @Override
    public void salvarHorarioAtendimento(List<HorarioAtendimento> horarioAtendimento) {

        /*List<HorarioAtendimento> horarios = horarioAtendimentoDAO
                .buscarPorFuncionario(horarioAtendimento.get(0).getFuncionario().getId());*/

        horarioAtendimentoDAO.excluir(horarioAtendimento.get(0).getFuncionario().getId());
        horarioAtendimentoDAO.salvar(horarioAtendimento);

        //depois alterar para editar
        /*
        if (horarios.size() > 0) {

            horarioAtendimentoDAO.editar(horarioAtendimento);

        } else {
            horarioAtendimentoDAO.salvar(horarioAtendimento);
        }*/

    }

    @Override
    public List<HorarioAtendimento> buscarHorarioAtendimentoPorFuncionario(int idFuncionario) {

        var show = horarioAtendimentoDAO.buscarPorFuncionario(idFuncionario);
        return show;

    }

}
