package com.mybarber.api.api.controller;


import javax.validation.Valid;

import com.mybarber.api.api.util.ConverterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mybarber.api.api.dto.BarbeariaInput;
import com.mybarber.api.api.dto.barbearia.BarbeariaDTO;
import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.service.BarbeariaService;



@RestController
@RequestMapping("api/barbearia")
public class BarbeariaController {

	@Autowired
	private BarbeariaService service;
	
	@PatchMapping("{id}")
	public ResponseEntity<BarbeariaDTO>iniciarEdicao(@PathVariable("id") int id) {
		
		var barbearia = service.buscarPorId(id);
		var barbeariaDTO = (BarbeariaDTO) ConverterDTO.toDTO(barbearia, BarbeariaDTO.class);
		return new ResponseEntity<BarbeariaDTO> (barbeariaDTO, HttpStatus.OK);
	}
	
	
	@PutMapping
	public ResponseEntity<Void> editar(@Valid @RequestBody BarbeariaInput barbeariaDTO) {
		var barbearia = (Barbearia)ConverterDTO.toDoMain(barbeariaDTO, Barbearia.class);
		service.alterar(barbearia);
		return new ResponseEntity<Void>(HttpStatus.CREATED);
		
	}
	
}
