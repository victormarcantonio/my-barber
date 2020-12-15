DO $$ 
    BEGIN
        BEGIN
        ALTER TABLE promocao ADD COLUMN status boolean;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
        END;
    END;
$$