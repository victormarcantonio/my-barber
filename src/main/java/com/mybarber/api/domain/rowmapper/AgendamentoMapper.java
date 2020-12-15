package com.mybarber.api.domain.rowmapper;

import com.mybarber.api.domain.entity.Agendamento;
import com.mybarber.api.domain.entity.Cliente;
import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.enumfactory.StatusAgendamento;
import com.mybarber.api.domain.util.SituacaoAgendamento;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;



public class AgendamentoMapper implements RowMapper<Agendamento> {

	@Override
	public Agendamento mapRow(ResultSet rs, int rowNum) throws SQLException {
		
       StatusAgendamento status = StatusAgendamento.valueOf(rs.getString("status"));
		
		Agendamento agendamentoStatus = status.obterStatus();
		
		agendamentoStatus.setId(rs.getInt("id_agendamento"));
		agendamentoStatus.setDataHorarioInicio(rs.getTimestamp("datahorainicio").toLocalDateTime());
		agendamentoStatus.setDataHorarioFim(rs.getTimestamp("datahoratermino").toLocalDateTime());
		agendamentoStatus.setObservacao(rs.getString("observacao"));
		agendamentoStatus.setStatus(SituacaoAgendamento.valueOf(rs.getString("status")));
		agendamentoStatus.setValor(rs.getDouble("valor"));
		agendamentoStatus.setCliente(new Cliente(rs.getInt("id_cliente"), rs.getString("nome_cliente")));
		agendamentoStatus.setFuncionario(new Funcionario(rs.getInt("id_barbeiro")));
		return agendamentoStatus;
	}

	
}
