package com.mybarber.api.api.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mybarber.api.domain.entity.Perfil;
import com.mybarber.api.domain.repository.PerfilDAO;

@RestController
@RequestMapping("api/perfis")
public class PerfilController {

	@Autowired
	PerfilDAO perfilDAO;
	
	@GetMapping("listar")
	public ResponseEntity<List<Perfil>> listar(Principal principal) {

		return new ResponseEntity<List<Perfil>>(perfilDAO.listar(),HttpStatus.OK);
	}
	
}
