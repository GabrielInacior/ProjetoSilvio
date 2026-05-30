-- Tornar campos opcionais que foram criados como NOT NULL desnecessariamente

-- aluno.data_nascimento: não obrigatório no cadastro inicial
ALTER TABLE aluno ALTER COLUMN data_nascimento DROP NOT NULL;
