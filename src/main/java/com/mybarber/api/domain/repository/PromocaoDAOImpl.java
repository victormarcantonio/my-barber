package com.mybarber.api.domain.repository;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.mybarber.api.domain.entity.Promocao;
import com.mybarber.api.domain.entity.Servico;

@Repository
public class PromocaoDAOImpl implements PromocaoDAO {
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	private String save = "insert into promocao (dataInicio, dataFim, descricao,status,valor, id_servico) values (?, ?, ?,?,?,?) ";
	//private String delete = "delete from promocao where id = ?";
	
    private String status = "select status from promocao where id_servico=?";
  
    
	@Override
	public void salvar(Promocao promocao) {

		jdbcTemplate.update(save,promocao.getDataInicio(), promocao.getDataFim(),promocao.getDescricao(),promocao.isStatus(),promocao.getValor(), promocao.getServico().getId());
	}

	@Override
	public void editar(Promocao promocao) {
		
		String update = "update promocao  set dataInicio = ?, dataFim = ?, descricao= ?, valor=?, status = ? where id =?";
		
		jdbcTemplate.update(update,promocao.getDataInicio(), promocao.getDataFim(), promocao.getDescricao(),
				promocao.getValor(),promocao.isStatus(),promocao.getId());
	}

	@Override
	public Promocao status(int idServico) {
	
	   return jdbcTemplate.queryForObject(status, new Object[] {idServico}, (rs, rowNum) -> new Promocao(rs.getBoolean("status")));	
	}

	@Override
	public Promocao buscar(int id) {
		String buscarPorId = "select * from promocao where id = ?";
		return jdbcTemplate.queryForObject(buscarPorId, new Object[] {id}, 
				(rs, rowNum) -> new Promocao(rs.getInt("id"),rs.getDate("dataInicio").toLocalDate(),
						rs.getDate("dataFim").toLocalDate(),rs.getString("descricao"),rs.getBoolean("status"),
						rs.getFloat("valor"), new Servico(rs.getInt("id_servico"))));
	}

	@Override
	public void alterarStatus(Promocao promocao) {
		 String inativarPromocao = "update promocao set status =? where id = ?";
		jdbcTemplate.update(inativarPromocao, promocao.isStatus(), promocao.getId());
	}

	@Override
	public List <Promocao> listar() {
		 String promocoes = "select * from promocao";
		return jdbcTemplate.query(promocoes,
				(rs, rowNum) -> new Promocao(rs.getInt("id"),rs.getDate("dataInicio").toLocalDate(), rs.getDate("dataFim").toLocalDate(),rs.getString("descricao"),rs.getBoolean("status"),rs.getFloat("valor")));
	}

	

}
