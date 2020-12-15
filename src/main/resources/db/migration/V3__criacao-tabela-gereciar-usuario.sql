create table IF NOT EXISTS gerenciar_usuario(
	id_usuario integer references usuario(id) unique,
	id_cliente integer references cliente(id) unique,
	id_funcionario integer references funcionario(id) unique
);


ALTER TABLE cliente DROP IF EXISTS email;
ALTER TABLE funcionario DROP IF EXISTS  email;
ALTER TABLE usuario
ADD IF NOT EXISTS email varchar(100) unique;

insert into gerenciar_usuario (id_usuario, id_funcionario) values (1,1);
