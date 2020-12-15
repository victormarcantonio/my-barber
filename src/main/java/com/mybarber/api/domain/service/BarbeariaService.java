package com.mybarber.api.domain.service;

import java.util.List;


import com.mybarber.api.domain.entity.Barbearia;


public interface BarbeariaService {

    Barbearia buscarPorId(int id);

    void alterar(Barbearia barbearia);

}
