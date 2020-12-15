package com.mybarber.api.domain.tarefa;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.mybarber.api.domain.repository.AgendamentoDAO;
import com.mybarber.api.domain.repository.ClienteDAO;
import com.mybarber.api.domain.util.EnviarEmail;

@Component
public class NotificarAgendamento {
	
	@Autowired
    private AgendamentoDAO agendamentoDAO;
    
	@Autowired
    private ClienteDAO clienteDAO;
	
	@Autowired
    private EnviarEmail enviarEmail;
    
    @Scheduled(fixedDelay = 1000)
    @Transactional
    public void notificarClientes() {
    	
    	var agendamentos = agendamentoDAO.buscarNaoNotificadosDiaAtual();
    	
    	agendamentos.forEach(agendamento -> {
    		
    		var agora = LocalDateTime.now();
    		
    		
    		var minutos = agora.until(agendamento.getDataHorarioInicio(), ChronoUnit.MINUTES);
    		
    		if(minutos>0 && minutos<=60) {
    			
    			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    			agendamento.setCliente(clienteDAO.buscarPorid(agendamento.getCliente().getId()));
        		enviarEmail.notificarAgendamento(agendamento);
    			agendamentoDAO.alterarNotificado(agendamento.getId());
    			System.out.println("Cliente "+agendamento.getCliente().getNome()+" notificado ás "+LocalDateTime.now().format(formatter));
    		}
    	});
    }

}
