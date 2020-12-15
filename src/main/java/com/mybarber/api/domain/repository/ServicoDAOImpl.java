package com.mybarber.api.domain.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.Servico;
import com.mybarber.api.domain.rowmapper.ServicoMapper;


@Repository
public class ServicoDAOImpl implements ServicoDAO {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	
	
	String save = "insert into servico(descricao,valor,tempo,id_barbearia) values(?,?,?,?)";
	String update = "update servico set descricao = ?, valor =?,tempo=? where id = ?";

	@Override
	public List<Servico> listarAtivos(int idBarbearia) {
		
		String selectall = "select s.*,  p.id id_promocao, p.valor valor_promocao, p.descricao descricao_promocao,p.datainicio, p.datafim, p.status from\r\n" + 
				"servico s left join promocao p on s.id = p.id_servico where id_barbearia =? and ativo = true";
		return jdbcTemplate.query(selectall, new Object[] { idBarbearia }, new ServicoMapper());

	}

	@Override
	public void salvar(Servico servico) {
		this.jdbcTemplate.update(save, servico.getDescricao(), servico.getValor(),
				java.sql.Time.valueOf(servico.getTempo()),servico.getBarbearia().getId());
	}

	@Override
	public void desativar(int id) {
		
		String delete = "update servico set ativo = false  where id=?";
		
		this.jdbcTemplate.update(delete, id);
	}

	@Override
	public void atualizar(Servico servico) {
		this.jdbcTemplate.update(update, servico.getDescricao(), servico.getValor(),
				java.sql.Time.valueOf(servico.getTempo()), servico.getId());

	}

	@Override
	public Servico buscarPorId(int id) {
		
		
		String select = """
				select s.*,b.id id_barbearia,
				p.id id_promocao, p.valor valor_promocao, p.descricao descricao_promocao,p.datainicio, p.datafim, p.status
				from servico s 
				left join promocao p on s.id = p.id_servico 
				inner join barbearia b on s.id_barbearia = b.id
				where s.id = ?
				""";
		
		return this.jdbcTemplate.queryForObject(select, new Object[] { id }, new ServicoMapper());

	}

	@Override
	public List<Servico> buscarPorIdAgendamento(int idAgendamento) {
		
        String buscarPorIdAgendamento = "select s.* from agendamento_servico  inner join servico s on agendamento_servico.id_servico = s.id where agendamento_servico.id_agendamento = ?";

		
		return jdbcTemplate.query(buscarPorIdAgendamento,new Object[] {idAgendamento},(rs,rowNum) -> new Servico(rs.getInt("id"),
				rs.getString("descricao"), rs.getFloat("valor"), rs.getTime("tempo").toLocalTime()));
	}

}
