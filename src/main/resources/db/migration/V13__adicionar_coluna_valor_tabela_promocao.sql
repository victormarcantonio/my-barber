DO $$ 
    BEGIN
        BEGIN
        ALTER TABLE promocao ADD valor numeric(10,2);
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
        END;
    END;
$$




