package com.mybarber.api.domain.tarefa;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.repository.PromocaoDAO;

@Component
public class VerificarStatusPromocao {
	
	@Autowired
	PromocaoDAO promocaoDAO;
	
	 LocalDate dataFim;
	
	
	private static final String TIME_ZONE = "America/Sao_Paulo";

	
	@Scheduled(cron = "0 00 00 * * *",zone = TIME_ZONE)
	//@Scheduled(fixedDelay = 1000)
	@Transactional
	private void verificarStatusPromocoes() {
	   var promocoes = promocaoDAO.listar();
	   
	   
	   promocoes.forEach(promocao -> {
		   
		   if(promocao.getDataFim().isBefore(LocalDate.now())) {
		   promocao.setStatus(false);
		   System.out.println("promocao desativada");
		   }else if(!promocao.getDataInicio().isAfter(LocalDate.now()) && !promocao.isStatus()) {
			   promocao.setStatus(true);
			   System.out.println("promocao ativa");
		   }else {
			   System.out.println("Manter promoçãõ");
		   }
		   promocaoDAO.alterarStatus(promocao);

	   });
	 
	}

	
}
