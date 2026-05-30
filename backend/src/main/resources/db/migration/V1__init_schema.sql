-- V1: Schema completo do Inovatech (sincronizado com entidades JPA)

-- ENUMs
CREATE TYPE tipo_usuario      AS ENUM ('ALUNO', 'PROFESSOR', 'ADMIN');
CREATE TYPE status_aluno      AS ENUM ('PENDENTE', 'ATIVO', 'TRANCADO', 'FORMADO');
CREATE TYPE titulacao         AS ENUM ('GRADUACAO', 'ESPECIALIZACAO', 'MESTRADO', 'DOUTORADO');
CREATE TYPE status_turma      AS ENUM ('PLANEJADA', 'ATIVA', 'ENCERRADA');
CREATE TYPE dia_semana        AS ENUM ('SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB');
CREATE TYPE semestre_enum     AS ENUM ('PRIMEIRO', 'SEGUNDO');
CREATE TYPE status_matricula  AS ENUM ('ATIVA', 'TRANCADA', 'APROVADO', 'REPROVADO', 'REPROVADO_FALTA');
CREATE TYPE status_aula       AS ENUM ('AGENDADA', 'REALIZADA', 'CANCELADA');
CREATE TYPE tipo_nota         AS ENUM ('P1', 'P2', 'P3', 'TRABALHO', 'SEMINARIO', 'FINAL');
CREATE TYPE tipo_notificacao  AS ENUM ('INFO', 'AVISO', 'NOTA', 'MATRICULA', 'AULA', 'PEDIDO');
CREATE TYPE categoria_produto AS ENUM ('VESTUARIO', 'ACESSORIOS', 'MATERIAL', 'LIVROS');
CREATE TYPE status_pedido     AS ENUM ('PENDENTE', 'CONFIRMADO', 'ENVIADO', 'ENTREGUE', 'CANCELADO');

-- -------------------------------------------------------
-- USUÁRIO E AUTENTICAÇÃO
-- -------------------------------------------------------
CREATE TABLE usuario (
    id              BIGSERIAL PRIMARY KEY,
    nome            VARCHAR(150) NOT NULL,
    email           VARCHAR(200) NOT NULL UNIQUE,
    senha_hash      VARCHAR(255) NOT NULL,
    tipo            tipo_usuario NOT NULL DEFAULT 'ALUNO',
    ativo           BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url      VARCHAR(500),
    senha_provisoria BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em       TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE session (
    id                  BIGSERIAL PRIMARY KEY,
    usuario_id          BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    access_token_hash   VARCHAR(512) NOT NULL,
    refresh_token_hash  VARCHAR(512) NOT NULL,
    user_agent          VARCHAR(300),
    ip                  VARCHAR(50),
    expira_em           TIMESTAMP NOT NULL,
    revogado            BOOLEAN NOT NULL DEFAULT FALSE,
    criado_em           TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_token (
    id          BIGSERIAL PRIMARY KEY,
    usuario_id  BIGINT NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    token_hash  VARCHAR(512) NOT NULL UNIQUE,
    expira_em   TIMESTAMP NOT NULL,
    usado_em    TIMESTAMP,
    criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- NOTIFICAÇÕES
-- -------------------------------------------------------
CREATE TABLE notificacao (
    id          BIGSERIAL        PRIMARY KEY,
    usuario_id  BIGINT           REFERENCES usuario(id) ON DELETE CASCADE,
    titulo      VARCHAR(200)     NOT NULL,
    mensagem    TEXT             NOT NULL,
    tipo        tipo_notificacao NOT NULL DEFAULT 'INFO',
    lida        BOOLEAN          NOT NULL DEFAULT FALSE,
    lida_em     TIMESTAMP,
    criado_em   TIMESTAMP        NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notificacao_usuario ON notificacao(usuario_id, lida, criado_em DESC);

-- -------------------------------------------------------
-- ACADÊMICO — CURSOS E DISCIPLINAS
-- -------------------------------------------------------
CREATE TABLE curso (
    id                BIGSERIAL    PRIMARY KEY,
    nome              VARCHAR(200) NOT NULL,
    slug              VARCHAR(200) NOT NULL UNIQUE,
    codigo            VARCHAR(20)  NOT NULL UNIQUE,
    duracao_semestres INT          NOT NULL DEFAULT 6,
    descricao         TEXT,
    imagem_url        VARCHAR(500),
    coordenador_id    BIGINT,
    ativo             BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em         TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE disciplina (
    id                BIGSERIAL    PRIMARY KEY,
    nome              VARCHAR(200) NOT NULL,
    codigo            VARCHAR(20)  NOT NULL UNIQUE,
    carga_horaria     INT          NOT NULL,
    ementa            TEXT,
    semestre_sugerido INT,
    ativo             BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_em         TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE curso_disciplina (
    curso_id        BIGINT NOT NULL REFERENCES curso(id) ON DELETE CASCADE,
    disciplina_id   BIGINT NOT NULL REFERENCES disciplina(id) ON DELETE CASCADE,
    obrigatoria     BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (curso_id, disciplina_id)
);

-- -------------------------------------------------------
-- ALUNOS E PROFESSORES
-- -------------------------------------------------------
CREATE TABLE professor (
    id            BIGSERIAL   PRIMARY KEY,
    usuario_id    BIGINT      NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
    siape         VARCHAR(20) NOT NULL UNIQUE,
    cpf           VARCHAR(14) NOT NULL UNIQUE,
    titulacao     titulacao   NOT NULL DEFAULT 'GRADUACAO',
    telefone      VARCHAR(20),
    lattes        VARCHAR(100),
    foto_url      VARCHAR(500),
    version       BIGINT      NOT NULL DEFAULT 0,
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Agora que professor existe, fk do coordenador
ALTER TABLE curso ADD CONSTRAINT fk_curso_coordenador
    FOREIGN KEY (coordenador_id) REFERENCES professor(id) ON DELETE SET NULL;

CREATE TABLE aluno (
    id                BIGSERIAL    PRIMARY KEY,
    usuario_id        BIGINT       NOT NULL UNIQUE REFERENCES usuario(id) ON DELETE CASCADE,
    ra                VARCHAR(20)  NOT NULL UNIQUE,
    cpf               VARCHAR(14)  NOT NULL UNIQUE,
    data_nascimento   DATE         NOT NULL,
    telefone          VARCHAR(20),
    endereco          VARCHAR(300),
    curso_id          BIGINT       REFERENCES curso(id) ON DELETE SET NULL,
    semestre_ingresso VARCHAR(10),
    status            status_aluno NOT NULL DEFAULT 'ATIVO',
    foto_url          VARCHAR(500),
    version           BIGINT       NOT NULL DEFAULT 0,
    criado_em         TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em     TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- TURMAS, MATRÍCULAS, AULAS
-- -------------------------------------------------------
CREATE TABLE turma (
    id            BIGSERIAL     PRIMARY KEY,
    disciplina_id BIGINT        NOT NULL REFERENCES disciplina(id),
    professor_id  BIGINT        NOT NULL REFERENCES professor(id),
    ano           INT           NOT NULL,
    semestre      semestre_enum NOT NULL,
    sala          VARCHAR(50),
    vagas         INT           NOT NULL DEFAULT 40,
    dia_semana    dia_semana    NOT NULL,
    hora_inicio   VARCHAR(5)    NOT NULL,
    hora_fim      VARCHAR(5)    NOT NULL,
    data_inicio   DATE          NOT NULL,
    data_fim      DATE          NOT NULL,
    status        status_turma  NOT NULL DEFAULT 'PLANEJADA',
    version       BIGINT        NOT NULL DEFAULT 0,
    criado_em     TIMESTAMP     NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP     NOT NULL DEFAULT NOW()
);

CREATE TABLE matricula (
    id             BIGSERIAL        PRIMARY KEY,
    aluno_id       BIGINT           NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
    turma_id       BIGINT           NOT NULL REFERENCES turma(id),
    status         status_matricula NOT NULL DEFAULT 'ATIVA',
    media_final    DECIMAL(4,2),
    frequencia_pct DECIMAL(5,2),
    version        BIGINT           NOT NULL DEFAULT 0,
    criado_em      TIMESTAMP        NOT NULL DEFAULT NOW(),
    atualizado_em  TIMESTAMP        NOT NULL DEFAULT NOW(),
    UNIQUE (aluno_id, turma_id)
);
CREATE INDEX idx_matricula_aluno ON matricula(aluno_id);
CREATE INDEX idx_matricula_turma ON matricula(turma_id);

CREATE TABLE aula (
    id            BIGSERIAL   PRIMARY KEY,
    turma_id      BIGINT      NOT NULL REFERENCES turma(id) ON DELETE CASCADE,
    data          DATE        NOT NULL,
    hora_inicio   VARCHAR(5)  NOT NULL,
    hora_fim      VARCHAR(5)  NOT NULL,
    tema          VARCHAR(200),
    conteudo      TEXT,
    status        status_aula NOT NULL DEFAULT 'AGENDADA',
    criado_em     TIMESTAMP   NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP   NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_aula_turma_data ON aula(turma_id, data);

CREATE TABLE presenca (
    id            BIGSERIAL PRIMARY KEY,
    aula_id       BIGINT    NOT NULL REFERENCES aula(id) ON DELETE CASCADE,
    aluno_id      BIGINT    NOT NULL REFERENCES aluno(id) ON DELETE CASCADE,
    presente      BOOLEAN   NOT NULL DEFAULT FALSE,
    registrado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (aula_id, aluno_id)
);

CREATE TABLE nota (
    id             BIGSERIAL    PRIMARY KEY,
    matricula_id   BIGINT       NOT NULL REFERENCES matricula(id) ON DELETE CASCADE,
    tipo           tipo_nota    NOT NULL,
    valor          DECIMAL(4,2) NOT NULL CHECK (valor >= 0 AND valor <= 10),
    peso           DECIMAL(3,2) NOT NULL DEFAULT 1.00 CHECK (peso > 0),
    descricao      VARCHAR(100),
    data_avaliacao DATE,
    criado_em      TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em  TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_nota_matricula ON nota(matricula_id);

-- -------------------------------------------------------
-- EVENTOS INSTITUCIONAIS
-- -------------------------------------------------------
CREATE TABLE evento_institucional (
    id            BIGSERIAL    PRIMARY KEY,
    titulo        VARCHAR(200) NOT NULL,
    descricao     TEXT,
    data_inicio   TIMESTAMP    NOT NULL,
    data_fim      TIMESTAMP,
    local         VARCHAR(200),
    imagem_url    VARCHAR(500),
    publico       BOOLEAN      NOT NULL DEFAULT TRUE,
    criado_por    BIGINT       REFERENCES usuario(id) ON DELETE SET NULL,
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- BLOG
-- -------------------------------------------------------
CREATE TABLE post (
    id            BIGSERIAL    PRIMARY KEY,
    titulo        VARCHAR(200) NOT NULL,
    slug          VARCHAR(250) NOT NULL UNIQUE,
    resumo        TEXT,
    conteudo_md   TEXT         NOT NULL,
    imagem_capa   VARCHAR(500),
    autor         VARCHAR(100),
    publicado     BOOLEAN      NOT NULL DEFAULT TRUE,
    publicado_em  TIMESTAMP,
    tags          TEXT[],
    version       BIGINT       NOT NULL DEFAULT 0,
    criado_em     TIMESTAMP    NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP    NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_post_slug ON post(slug);
CREATE INDEX idx_post_publicado ON post(publicado_em DESC NULLS LAST);

-- -------------------------------------------------------
-- LOJA
-- -------------------------------------------------------
CREATE TABLE produto (
    id            BIGSERIAL         PRIMARY KEY,
    nome          VARCHAR(150)      NOT NULL,
    slug          VARCHAR(200)      NOT NULL UNIQUE,
    descricao     TEXT,
    preco         DECIMAL(10,2)     NOT NULL CHECK (preco >= 0),
    estoque       INT               NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    imagem_url    VARCHAR(500),
    categoria     categoria_produto NOT NULL DEFAULT 'ACESSORIOS',
    ativo         BOOLEAN           NOT NULL DEFAULT TRUE,
    version       BIGINT            NOT NULL DEFAULT 0,
    criado_em     TIMESTAMP         NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP         NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_produto_slug ON produto(slug);

CREATE TABLE pedido (
    id               BIGSERIAL     PRIMARY KEY,
    usuario_id       BIGINT        NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    status           status_pedido NOT NULL DEFAULT 'PENDENTE',
    valor_total      DECIMAL(10,2) NOT NULL DEFAULT 0,
    endereco_entrega TEXT,
    observacoes      TEXT,
    version          BIGINT        NOT NULL DEFAULT 0,
    criado_em        TIMESTAMP     NOT NULL DEFAULT NOW(),
    atualizado_em    TIMESTAMP     NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_pedido_usuario ON pedido(usuario_id, status);

CREATE TABLE pedido_item (
    id              BIGSERIAL PRIMARY KEY,
    pedido_id       BIGINT NOT NULL REFERENCES pedido(id) ON DELETE CASCADE,
    produto_id      BIGINT NOT NULL REFERENCES produto(id),
    quantidade      INT NOT NULL DEFAULT 1 CHECK (quantidade > 0),
    preco_unitario  DECIMAL(10,2) NOT NULL
);

-- Índices adicionais
CREATE INDEX idx_session_usuario ON session(usuario_id, revogado);
CREATE INDEX idx_aluno_ra ON aluno(ra);
CREATE INDEX idx_turma_disciplina ON turma(disciplina_id, ano, semestre);
