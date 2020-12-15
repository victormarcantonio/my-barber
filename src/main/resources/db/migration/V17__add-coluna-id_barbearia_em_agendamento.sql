DO $$ 
    BEGIN
        BEGIN
        ALTER TABLE agendamento ADD COLUMN id_barbearia INTEGER REFERENCES barbearia (id) default 1;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
        END;
    END;
$$