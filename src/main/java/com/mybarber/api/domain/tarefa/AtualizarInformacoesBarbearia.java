package com.mybarber.api.domain.tarefa;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.repository.BarbeariaDAO;
import com.mybarber.api.domain.repository.ClienteDAO;
import com.mybarber.api.domain.repository.FuncionarioDAO;
import com.mybarber.api.domain.repository.ServicoDAO;

@Component
public class AtualizarInformacoesBarbearia {
	
	@Autowired
	BarbeariaDAO barbeariaDAO;
	
	@Autowired
	ServicoDAO servicoDAO;
	
	@Autowired
	ClienteDAO clienteDAO;
	
	@Autowired
	FuncionarioDAO funcionarioDAO;
	
	private static final String TIME_ZONE = "America/Sao_Paulo";
	
	
	//segundos , minutos, hora, dia , mes, ano // * = qualquer um // /x (valor numérico) ex : */1 indica que se qualquer valor do campo segundo mudar será acionado
	//link = https://www.alura.com.br/artigos/agendando-tarefas-com-scheduled-do-spring
	//todos os dias, 06 horas da manha, execute a rotina
	@Scheduled(cron = "0 13 21 * * *",zone = TIME_ZONE)
	@Transactional
	private void atualizarInformacoes() {
		
		var barbearias = barbeariaDAO.listar();
		
		barbearias.forEach(barbearia -> {
			
			var idBarbearia = barbearia.getId();
			
			 barbearia.setQtdServico(servicoDAO.listarAtivos(idBarbearia).size());
			 barbearia.setQtdCliente(clienteDAO.countPorBarbearia(idBarbearia));
			 barbearia.setQtdFuncionario(funcionarioDAO.listar(idBarbearia).size());
			 
			 barbeariaDAO.alterar(barbearia);
			 
			 
		});
	}

}
