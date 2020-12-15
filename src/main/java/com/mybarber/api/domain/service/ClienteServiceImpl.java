package com.mybarber.api.domain.service;

import java.util.List;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Cliente;
import com.mybarber.api.domain.exception.NegocioException;
import com.mybarber.api.domain.repository.BarbeariaDAO;
import com.mybarber.api.domain.repository.ClienteDAO;
import com.mybarber.api.domain.repository.UsuarioDAO;

@Service
@Transactional
public class ClienteServiceImpl implements ClienteService {

    @Autowired
    ClienteDAO clienteDAO;

    @Autowired
    UsuarioDAO usuarioDAO;

    @Autowired
    BarbeariaDAO barbeariaDAO;


    @Override
    public void cadastrar(Cliente cliente, int idBarbearia) {

        //cadastrar sem barbearia quando for a parte de cliente
        cliente.getUsuario().getPerfil().setId(2);
        usuarioDAO.salvar(cliente.getUsuario());
        clienteDAO.cadastrar(cliente, idBarbearia);

        var barbearia = barbeariaDAO.buscarPorId(idBarbearia);

        barbearia.setQtdCliente(barbearia.getQtdCliente() + 1);

        barbeariaDAO.alterar(barbearia);

        //enviar email para o cliente se cadastrar


    }

    @Override
    public Cliente buscarPorid(int id) {

        return clienteDAO.buscarPorid(id);
    }

    @Override
    public void editar(Cliente cliente) {

        if (cliente.getId() != 0) {

            if (cliente.getUsuario().getId() != 0) {

                var usuarioEdicao = cliente.getUsuario();

                var usuarioAntigoLogin = usuarioDAO.buscarPorLogin(usuarioEdicao.getLogin());

                if (usuarioAntigoLogin == null || usuarioAntigoLogin.getId() == usuarioEdicao.getId()) {

                    var usuarioAntigoEmail = usuarioDAO.buscarPorEmail(usuarioEdicao.getEmail());

                    if (usuarioAntigoEmail == null || usuarioAntigoEmail.getId() == usuarioEdicao.getId()) {
                        cliente.getUsuario().getPerfil().setId(2);
                        usuarioDAO.alterar(cliente.getUsuario());
                        clienteDAO.editar(cliente);


                    } else {
                        throw new NegocioException("Já existe um usuário com email : " + usuarioEdicao.getEmail());
                    }

                } else {
                    throw new NegocioException("Já existe um usuário com login : " + usuarioEdicao.getLogin());
                }

            } else {

                throw new NegocioException("Usuário sem id");
            }


        } else {
            throw new NegocioException("Cliente sem id");
        }


        //clienteDAO.editar(cliente);

    }

    @Override
    public void excluir(int id, int idBarbearia) {

        if (idBarbearia != 0) {

            var barbearia = barbeariaDAO.buscarPorId(idBarbearia);

            barbearia.setQtdCliente(barbearia.getQtdCliente() - 1);

            barbeariaDAO.alterar(barbearia);
        }

        clienteDAO.excluir(id);

    }

    @Override
    public List<Cliente> listar(int idBarbearia) {

        return clienteDAO.listar(idBarbearia);
    }

    @Override
    public List<Cliente> autoCompleteNome(String nome) {

        return clienteDAO.autoCompleteNome(nome);
    }

}
