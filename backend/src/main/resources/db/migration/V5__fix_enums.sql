-- V5: Sincronizar tipos ENUM do PostgreSQL com os enums Java
-- Adiciona valores ausentes sem remover existentes (ALTER TYPE ... ADD VALUE é seguro)

-- titulacao: Java tem POS_DOUTORADO, DB não tinha
ALTER TYPE titulacao ADD VALUE IF NOT EXISTS 'POS_DOUTORADO';

-- status_turma: Java tinha ATIVA/ENCERRADA/CANCELADA, DB tinha PLANEJADA/ATIVA/ENCERRADA
ALTER TYPE status_turma ADD VALUE IF NOT EXISTS 'CANCELADA';
-- PLANEJADA já existe no DB, mas foi adicionada ao Java enum acima

-- status_matricula: DB tinha APROVADO/REPROVADO/REPROVADO_FALTA, Java não tinha
ALTER TYPE status_matricula ADD VALUE IF NOT EXISTS 'CANCELADA';
ALTER TYPE status_matricula ADD VALUE IF NOT EXISTS 'CONCLUIDA';
-- APROVADO, REPROVADO, REPROVADO_FALTA já existem no DB, adicionados ao Java enum

-- tipo_nota: Java tinha PROJETO/RECUPERACAO, DB tinha SEMINARIO
ALTER TYPE tipo_nota ADD VALUE IF NOT EXISTS 'PROJETO';
ALTER TYPE tipo_nota ADD VALUE IF NOT EXISTS 'RECUPERACAO';
-- SEMINARIO já existe no DB, adicionado ao Java enum

-- tipo_notificacao: Java tinha FREQUENCIA/EVENTO/AVISO_GERAL/SISTEMA, DB tinha INFO/AVISO/PEDIDO
ALTER TYPE tipo_notificacao ADD VALUE IF NOT EXISTS 'FREQUENCIA';
ALTER TYPE tipo_notificacao ADD VALUE IF NOT EXISTS 'EVENTO';
ALTER TYPE tipo_notificacao ADD VALUE IF NOT EXISTS 'AVISO_GERAL';
ALTER TYPE tipo_notificacao ADD VALUE IF NOT EXISTS 'SISTEMA';
-- INFO, AVISO, PEDIDO já existem no DB, adicionados ao Java enum

-- categoria_produto: Java tem OUTROS, DB não tinha
ALTER TYPE categoria_produto ADD VALUE IF NOT EXISTS 'OUTROS';
