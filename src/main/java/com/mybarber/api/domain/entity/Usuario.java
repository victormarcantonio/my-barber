package com.mybarber.api.domain.entity;


import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.mybarber.api.api.dto.usuario.UsuarioDTO;

@Component
public class Usuario {

    private int id;

    private String login;

    private String senha;

    private boolean ativo;

    private Perfil perfil;
    
    private String email;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getSenha() {

        return senha;
    }

    public void setSenha(String senha) {
        if (senha != null) {
            this.senha = new BCryptPasswordEncoder().encode(senha);
        } else {
            this.senha = senha;
        }

    }

    public boolean isAtivo() {
        return ativo;
    }

    public void setAtivo(boolean ativo) {
        this.ativo = ativo;
    }


    public Perfil getPerfil() {
        return perfil;
    }

    public void setPerfil(Perfil perfil) {
        this.perfil = perfil;
    }

    public Usuario() {
    }
    
    public Usuario(String email) {
		this.email = email;
	}
    
    public Usuario(int id, String email) {
    	this.id = id;
		this.email = email;
	}

	public Usuario(int id, String login, boolean ativo, Perfil perfil,String email) {
        this.id = id;
        this.login = login;
        this.ativo = ativo;
        this.perfil = perfil;
        this.email = email;
    }


    public Usuario(int id, String login,
                   String senha, boolean ativo) {
        this.id = id;
        this.login = login;
        this.senha = senha;
        this.ativo = ativo;
    }

    public Usuario(int id) {
        this.id = id;
    }

    public Usuario(int id, String login, boolean ativo) {
        this.id = id;
        this.login = login;
        this.ativo = ativo;
    }


    public UsuarioDTO toDTO() {

        var modelMapper = new ModelMapper();

        return modelMapper.map(this, UsuarioDTO.class);

    }

    public Usuario toDoMain(UsuarioDTO usuarioDTO) {

        var modelMapper = new ModelMapper();

        return modelMapper.map(usuarioDTO, Usuario.class);

    }

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
