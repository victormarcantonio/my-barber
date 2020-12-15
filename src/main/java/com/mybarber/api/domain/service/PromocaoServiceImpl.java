package com.mybarber.api.domain.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.entity.Promocao;
import com.mybarber.api.domain.exception.NegocioException;
import com.mybarber.api.domain.repository.PromocaoDAO;

@Service@Transactional
public class PromocaoServiceImpl implements PromocaoService {
	
	@Autowired
	PromocaoDAO dao;

	@Override
	public void salvar(Promocao promocao) {

		validarDatasPromocao(promocao);

		if(promocao.getDataInicio().isAfter(LocalDate.now())) {
			promocao.setStatus(false);
		}else {
			promocao.setStatus(true);
		}
		dao.salvar(promocao);
	  
	}
	

	@Override
	public void editar(Promocao promocao) {

		validarDatasPromocao(promocao);

		if(promocao.getDataInicio().isAfter(LocalDate.now())) {
			promocao.setStatus(false);
		}else {
			promocao.setStatus(true);
		}

		dao.editar(promocao);
	}

	private void validarDatasPromocao(Promocao promocao){
		
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
		
		var dataInicio = promocao.getDataInicio();
		var dataFim = promocao.getDataFim();
		var agora = LocalDate.now();

		if (!dataInicio.isBefore(dataFim))
			throw new NegocioException("Data inicio "+dataInicio.format(formatter)+" da promoção não pode ser após ou igual a data final "+dataFim.format(formatter));

		if (dataInicio.isBefore(agora))
			throw new NegocioException("Data inicio promoção "+dataInicio.format(formatter) +" não pode ser antes que a data atual "+agora.format(formatter));

	}


	@Override
	public Promocao buscarPromocao(int id) {

		return dao.buscar(id);
	}


	@Override
	public void alterarStatus(Promocao promocao) {
		dao.alterarStatus(promocao);
	}
	


}
