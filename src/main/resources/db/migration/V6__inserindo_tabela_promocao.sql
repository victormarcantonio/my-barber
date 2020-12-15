create table promocao(
   id serial primary key not null,
   dataInicio date not null,
   dataFim date not null,
   descricao varchar(50),
   id_servico integer not null references servico(id) ON DELETE CASCADE

);



alter table agendamento alter id_cliente drop not null;

