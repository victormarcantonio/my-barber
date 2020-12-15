DO $$ 
    BEGIN
        BEGIN
        ALTER TABLE servico ADD COLUMN ativo boolean DEFAULT true;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
        END;
    END;
$$