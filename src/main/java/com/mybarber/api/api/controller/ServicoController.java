package com.mybarber.api.api.controller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import com.mybarber.api.api.util.ConverterDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Servico;
import com.mybarber.api.domain.service.ServicoService;
import com.mybarber.api.api.dto.servico.ServicoDTO;
import com.mybarber.api.api.dto.servico.ServicoInput;

@RestController
@RequestMapping("api/servicos")
public class ServicoController {

	@Autowired
	private ServicoService service;

	@PostMapping
	public ResponseEntity<Void> salvar(@Valid @RequestBody ServicoDTO servicoDTO) {

		var servico = (Servico) ConverterDTO.toDoMain(servicoDTO, Servico.class);
		
		service.salvar(servico);
		return new ResponseEntity<Void>(HttpStatus.CREATED);
	}

	@GetMapping("{idBarbearia}")
	public ResponseEntity<List<ServicoDTO>> listarAtivos(@PathVariable("idBarbearia") int idBarbearia) {

		
		var servicos = service.listarAtivos(idBarbearia);
		var servicosDTO = servicos.stream()
				           .map(doMain -> (ServicoDTO) ConverterDTO.toDTO(doMain, ServicoDTO.class))
				           .collect(Collectors.toList());
		
		return new ResponseEntity <List<ServicoDTO>>(servicosDTO, HttpStatus.OK);
	}

	@PutMapping
	public ResponseEntity<Void> editar(@Valid @RequestBody ServicoInput servicoDTO) {

		var servico = (Servico) ConverterDTO.toDoMain(servicoDTO, Servico.class);
		service.atualizar(servico);
		return new ResponseEntity<Void>(HttpStatus.OK);
	}

	@PutMapping("desativar/{id}")
	public ResponseEntity<Void> desativar(@PathVariable("id") int id) {

		service.desativar(id);
		return new ResponseEntity<Void>(HttpStatus.OK);
	}


}
