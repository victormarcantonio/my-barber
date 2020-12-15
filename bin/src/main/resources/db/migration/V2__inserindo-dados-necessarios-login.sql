insert into perfil(id,descricao) values (nextval('perfil_id_seq'),'ADMINISTRADOR');

insert into permissao(id,descricao) values (nextval('permissao_id_seq'),'CADASTRAR_SERVICO');
insert into permissao(id,descricao) values (nextval('permissao_id_seq'),'LISTAR_SERVICO');
insert into permissao(id,descricao) values (nextval('permissao_id_seq'),'EXCLUIR_SERVICO');
insert into permissao(id,descricao) values (nextval('permissao_id_seq'),'EDITAR_SERVICO');

insert into perfil_permissao(id_perfil,id_permissao) values (1,1),(1,2),(1,3),(1,4);


insert into endereco(id,logradouro,bairro,numero,cep,cidade,uf)values(nextval('endereco_id_seq'),'rua 10','souza',145,'0000','itaqua','SP');
insert into barbearia(id,nome,descricao,id_endereco) values(nextval('barbearia_id_seq'),'barber','show',1);
insert into usuario(id,login,ativo) values(nextval('usuario_id_seq'),'teste',true);
insert into funcionario(id,nome,telefone,email,data_nascimento,id_endereco,cargo,id_barbearia,id_usuario)values(nextval('funcionario_id_seq'),'Julio','4644','julioosilva97@gmail.com','1997-07-11',1,'BARBEIRO',1,1);
insert into usuario_perfil(id_usuario, id_perfil) values (1,1);