package com.mybarber.api.domain.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.mybarber.api.domain.entity.Agendamento;
import com.mybarber.api.domain.entity.Barbearia;
import com.mybarber.api.domain.entity.Relatorio;
import com.mybarber.api.domain.util.SituacaoAgendamento;


public interface AgendamentoService {

    void salvar(Agendamento agendamento);

    List<Agendamento> listarPorBarbeiro(int idBarbeiro);

    Agendamento buscarPorId(int idAgendamento);

    void editar(Agendamento agendamento);

    void alterarStatus(int idAgendamento, SituacaoAgendamento status);

    List<Agendamento> buscarPorData(LocalDate data, int idBarbeiro);

    List<Relatorio> somaValorMensal(int idBbarbearia, LocalDate data);

    Map<String, Integer> countStatusAgendamentoMes(int idBarbearia);

    List<Map<String, String>> relatorioServicosMes(int idBarbearia);
}
