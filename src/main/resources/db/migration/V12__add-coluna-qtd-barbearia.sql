DO $$ 
    BEGIN
        BEGIN
            ALTER TABLE barbearia
ADD qtdFuncionario integer;

ALTER TABLE barbearia
ADD qtdCliente integer;

ALTER TABLE barbearia
ADD qtdServico integer;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
        END;
    END;
$$





