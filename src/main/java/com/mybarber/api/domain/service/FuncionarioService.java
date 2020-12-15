package com.mybarber.api.domain.service;


import java.util.List;
import java.util.Map;

import com.mybarber.api.domain.entity.Barbearia;

import com.mybarber.api.domain.entity.Funcionario;
import com.mybarber.api.domain.entity.HorarioAtendimento;

public interface FuncionarioService {

    void salvar(Map<String, Object> map);

    List<Funcionario> listar(int idBarbearia);

    Funcionario buscar(int id);

    void alterar(Funcionario funcionario);

    void excluir(int id);

    List<Funcionario> listarPorCargo(Map<String, Object> map);

    Funcionario buscarPorIdUsuario(int idUsuario);

    void salvarHorarioAtendimento (List<HorarioAtendimento> horarioAtendimento);

    List<HorarioAtendimento> buscarHorarioAtendimentoPorFuncionario(int idFuncionario);

}
