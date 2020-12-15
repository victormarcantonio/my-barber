ALTER TABLE gerenciar_usuario   
    DROP CONSTRAINT gerenciar_usuario_id_usuario_fkey,   
    ADD CONSTRAINT gerenciar_usuario_id_usuario_fkey FOREIGN KEY (id_usuario)
          REFERENCES usuario (id) ON DELETE CASCADE;