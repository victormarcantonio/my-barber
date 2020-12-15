DO $$ 
    BEGIN
        BEGIN
        ALTER TABLE horario_atendimento ADD COLUMN almoco boolean;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
        END;
    END;
$$