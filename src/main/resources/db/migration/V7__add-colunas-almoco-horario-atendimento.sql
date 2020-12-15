ALTER TABLE horario_atendimento
  RENAME COLUMN inicio TO entrada ;

ALTER TABLE horario_atendimento
  RENAME COLUMN final TO saida;

ALTER TABLE horario_atendimento
ADD saida_almoco time;

ALTER TABLE horario_atendimento
ADD entrada_almoco time;