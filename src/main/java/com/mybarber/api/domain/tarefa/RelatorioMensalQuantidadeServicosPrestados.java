package com.mybarber.api.domain.tarefa;

import com.mybarber.api.domain.repository.BarbeariaDAO;
import com.mybarber.api.domain.repository.FuncionarioDAO;
import com.mybarber.api.domain.service.AgendamentoService;
import com.mybarber.api.domain.util.Cargo;
import com.mybarber.api.domain.util.EnviarEmail;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class RelatorioMensalQuantidadeServicosPrestados {

    @Autowired
    BarbeariaDAO barbeariaDAO;

    @Autowired
    FuncionarioDAO funcionarioDAO;


    @Autowired
    AgendamentoService agendamentoService;

    @Autowired
    private EnviarEmail enviarEmail;

    private static final String TIME_ZONE = "America/Sao_Paulo";


    @Scheduled(fixedDelay = 50000)
    private void gerarRelatorio(){

        var barbearias = barbeariaDAO.listar();


        barbearias.forEach(barbearia -> {
            var funcionarios = funcionarioDAO.listarPorCargo(Cargo.BARBEIRO,barbearia.getId());
            //agendamentoService.relatorioServicosMes(barbearia.getId());
            funcionarios.forEach(funcionario-> {

                 if(funcionario.getCargo()== Cargo.BARBEIRO) {
                     enviarEmail.enviarRelatorioMensalQuantidadeServicoPrestado(funcionario, barbearia.getId());
                     System.out.println( "Enviado para o email "+funcionario.getUsuario().getEmail());
                 }
            });



        });

    }
}
