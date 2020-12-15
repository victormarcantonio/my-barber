create table endereco (
    id serial primary key not null,
    logradouro varchar(200),
    bairro varchar(100),
    numero integer, 
    cep varchar(100),
    cidade varchar(100),
    uf varchar(2)
);


create table usuario(
    id serial primary key not null, 
    login varchar(100) unique,
    senha varchar(300),
    ativo boolean not null
 );

create table permissao(
    id serial primary key not null, 
    descricao varchar(100) not null
);

create table perfil(
    id serial primary key not null, 
    descricao varchar(100) not null
);

create table perfil_permissao(
    id_perfil integer references perfil(id) not null,
    id_permissao integer references permissao(id) not null
);

create table usuario_perfil(
    id_usuario integer references usuario(id),
    id_perfil integer references perfil(id)
);

create table barbearia(
    id serial primary key not null,
	nome varchar(100) not null,
	descricao varchar(100),
	id_endereco integer references endereco(id) not null
);

create table funcionario(
    id serial primary key not null,  
    nome varchar(100),
    sobrenome varchar(100),
    telefone varchar(100),
    email varchar(100) unique,
    data_nascimento date,
    id_endereco integer references endereco(id),
    cargo varchar(100) not null,
    id_barbearia integer references barbearia(id) not null,
    id_usuario integer references usuario(id) not null
);

create table password_token(
    id serial primary key,
    token varchar(50),
    id_usuario integer references usuario(id)

);

create table cliente(
    id serial primary key not null,  
    nome varchar(100),
    sobrenome varchar(100),
    telefone varchar(100),
    email varchar(100) unique,
    data_nascimento date,
    id_endereco integer references endereco(id),
    id_usuario integer references usuario(id)
);

create table cliente_barbearia(
    id_cliente integer references cliente(id) not null,
    id_barbearia integer references barbearia(id) not null
);

create table servico(
    id serial primary key not null, 
    descricao varchar(100) not null,
    valor decimal(10,2) not null,
    tempo time not null,
    id_barbearia integer references barbearia(id) not null
);

create table agendamento(
    id serial primary key not null,
    dataHoraInicio timestamp not null ,
    dataHoraTermino timestamp not null,
    observacao varchar(200) ,
    status varchar(100) not null,
    valor decimal(10,2) not null,
    id_cliente integer references cliente(id),
    id_barbeiro integer references funcionario(id) not null,
    nome_cliente varchar(100) not null
);

create table agendamento_servico(
    id_agendamento integer references agendamento(id) not null,
    id_servico integer references servico(id) not null
);

create table horario_atendimento(
		id serial primary key not null, 
		dia integer not null,
		aberto boolean not null,
		inicio time not null,
		final time not null,
		id_funcionario integer references funcionario(id)
);
	  




