package com.mybarber.api.api.controller;



import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mybarber.api.api.dto.promocao.PromocaoDTO;
import com.mybarber.api.api.util.ConverterDTO;
import com.mybarber.api.domain.entity.Promocao;
import com.mybarber.api.domain.entity.Servico;
import com.mybarber.api.domain.service.PromocaoService;

@RestController
@RequestMapping("api/promocao")
public class PromocaoController {

	
	@Autowired
	private PromocaoService service;
	
	@PostMapping
	public ResponseEntity<Void> salvar(@Valid @RequestBody PromocaoDTO promocaoDTO) {
		
		Promocao promocao = (Promocao) ConverterDTO.toDoMain(promocaoDTO, Promocao.class);
		
		service.salvar(promocao);
		
		return new ResponseEntity<Void>(HttpStatus.CREATED);
	}
	
	@GetMapping("{id}")
	public ResponseEntity<PromocaoDTO> buscarPromocao(@PathVariable("id") int id){

		var promocao = service.buscarPromocao(id);

		var promocaoDTO = (PromocaoDTO) ConverterDTO.toDTO(promocao, PromocaoDTO.class);

		return new ResponseEntity<PromocaoDTO>(promocaoDTO, HttpStatus.OK);

	}
	
	@PutMapping
	public ResponseEntity<Void>editar(@Valid @RequestBody PromocaoDTO promocaoDTO) {
		
		var promocao = (Promocao) ConverterDTO.toDoMain(promocaoDTO, Promocao.class);
		
		service.editar(promocao);
		
		return new ResponseEntity<Void>(HttpStatus.OK);
	}
	
	@PutMapping("/alterar-status/{idPromocao}/{status}")
	public ResponseEntity<Void>alterarStatus(@PathVariable boolean status, @PathVariable("idPromocao") int idPromocao) {
		
		var promocao = new Promocao();
		
		promocao.setStatus(status);
		promocao.setId(idPromocao);
		
		service.alterarStatus(promocao);
		
		return new ResponseEntity<Void>(HttpStatus.OK);
	}
}
