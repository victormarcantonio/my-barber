create table endereco (
    id serial not null primary key ,
    logradouro varchar(200),
    bairro varchar(100),
    numero integer, 
    cep varchar(100),
    cidade varchar(100),
    uf varchar(2)
);

create table usuario(
    id serial not null primary key , 
    login varchar(100) unique,
    senha varchar(300),
    ativo boolean not null
 );

create table permissao(
    id serial not null primary key , 
    descricao varchar(100) not null 
);

create table perfil(
    id serial not null primary key , 
    descricao varchar(100) not null
);

create table perfil_permissao(
    id_perfil integer not null references perfil(id)  ON DELETE CASCADE,
    id_permissao integer not null references permissao(id)  ON DELETE CASCADE
);

create table usuario_perfil(
    id_usuario integer references usuario(id) ON DELETE CASCADE,
    id_perfil integer references perfil(id) ON DELETE CASCADE
);

create table barbearia(
    id serial not null primary key ,
	nome varchar(100) not null,
	descricao varchar(100),
	id_endereco integer not null references endereco(id) 
);

create table funcionario(
    id serial not null primary key ,  
    nome varchar(100),
    sobrenome varchar(100),
    telefone varchar(100),
    email varchar(100) unique,
    data_nascimento date,
    id_endereco integer references endereco(id),
    cargo varchar(100) not null,
    id_barbearia integer not null references barbearia(id) ,
    id_usuario integer not null references usuario(id)
);

create table token_de_verificacao(
	id serial PRIMARY key,
	token varchar(100) not null,
	data_hora_emissao TIMESTAMP not null, 
	data_hora_expiracao TIMESTAMP not null,
	id_usuario integer not null references usuario(id) ON DELETE CASCADE
);

create table cliente(
    id serial not null primary key,  
    nome varchar(100),
    sobrenome varchar(100),
    telefone varchar(100),
    email varchar(100) unique,
    data_nascimento date,
    id_endereco integer references endereco(id),
    id_usuario integer references usuario(id)
);

create table cliente_barbearia(
    id_cliente integer not null references cliente(id) ON DELETE CASCADE,
    id_barbearia integer not null references barbearia(id) ON DELETE CASCADE
);

create table servico(
    id serial not null primary key , 
    descricao varchar(100) not null,
    valor decimal(10,2) not null,
    tempo time not null,
    id_barbearia integer not null references barbearia(id) ON DELETE CASCADE
);

create table agendamento(
    id serial primary key not null,
    dataHoraInicio timestamp not null ,
    dataHoraTermino timestamp not null,
    observacao varchar(200) ,
    status varchar(100) not null,
    valor decimal(10,2) not null,
    id_cliente integer not null references cliente(id),
    id_barbeiro integer not null references funcionario(id),
    nome_cliente varchar(100) not null
);

create table agendamento_servico(
    id_agendamento integer not null references agendamento(id) ON DELETE CASCADE,
    id_servico integer not null references servico(id)  ON DELETE CASCADE
);

create table horario_atendimento(
		id serial primary key not null, 
		dia integer not null,
		aberto boolean not null,
		inicio time not null,
		final time not null,
		id_funcionario integer not null references funcionario(id) ON DELETE CASCADE
);


