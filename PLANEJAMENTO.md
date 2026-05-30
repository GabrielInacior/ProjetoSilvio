# Inovatech — Planejamento Detalhado (v2)

Sistema institucional completo de gestão acadêmica inspirado na FATEC Jales + portal público + mini e-commerce de produtos da faculdade.
Foco em **encontrabilidade**, **fluxos UX bem definidos** e **responsividade total** (mobile-first).

> Substitui a v1. Esta versão detalha jornadas, telas, componentes, estados de UI, calendário, notificações e regras de negócio.

---

## Índice

1. [Visão e princípios](#1-visão-e-princípios)
2. [Stack tecnológica](#2-stack-tecnológica)
3. [Estrutura do monorepo](#3-estrutura-do-monorepo)
4. [Variáveis de ambiente](#4-variáveis-de-ambiente)
5. [Modelo de dados](#5-modelo-de-dados)
6. [Perfis, permissões e onboarding](#6-perfis-permissões-e-onboarding)
7. [Endpoints REST](#7-endpoints-rest)
8. [Segurança](#8-segurança)
9. [Sistema de PDFs](#9-sistema-de-pdfs)
10. [Sistema de e-mail (SMTP)](#10-sistema-de-e-mail-smtp)
11. [Calendário acadêmico](#11-calendário-acadêmico)
12. [Notificações in-app](#12-notificações-in-app)
13. [Frontend: design system e responsividade](#13-frontend-design-system-e-responsividade)
14. [Mapa de telas e rotas](#14-mapa-de-telas-e-rotas)
15. [Jornadas UX detalhadas](#15-jornadas-ux-detalhadas)
16. [Componentes-chave do front](#16-componentes-chave-do-front)
17. [Encontrabilidade (SEO + busca interna)](#17-encontrabilidade-seo--busca-interna)
18. [Loja: fluxo completo](#18-loja-fluxo-completo)
19. [Estados de UI (loading, vazio, erro)](#19-estados-de-ui-loading-vazio-erro)
20. [Validações e regras de negócio](#20-validações-e-regras-de-negócio)
21. [Seeds e dados iniciais](#21-seeds-e-dados-iniciais)
22. [Fases de implementação](#22-fases-de-implementação)
23. [Comandos e como rodar](#23-comandos-e-como-rodar)

---

## 1. Visão e princípios

- **Nome:** Inovatech
- **Inspiração:** Sistema acadêmico da FATEC Jales (SIGA-like) + portal institucional
- **Princípios de produto:**
  - **Encontrabilidade primeiro** — toda informação acessível em ≤ 3 cliques, com busca global (Cmd+K)
  - **Mobile-first** — projetado para smartphone, escala até desktop 1440px+
  - **Feedback imediato** — todo botão tem estado de loading, sucesso ou erro
  - **Consistência visual** — design system único (shadcn + tokens Tailwind)
  - **Acessibilidade WCAG AA** — contraste, navegação por teclado, aria-labels, foco visível
  - **Resiliente offline-friendly** — cache TanStack Query, skeletons, retry automático
  - **Sem nuvem** — tudo on-premise: Postgres em Docker, SMTP via Gmail (já fornecido pelo usuário)

---

## 2. Stack tecnológica

### Backend
| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 3.3.x |
| Web | Spring Web (REST), springdoc-openapi (Swagger) |
| Segurança | Spring Security + JWT (jjwt 0.12.x) + BCrypt |
| Persistência | Spring Data JPA + Hibernate + PostgreSQL 16 |
| Migrations | Flyway |
| Mapeamento | MapStruct + Lombok |
| Validação | Jakarta Bean Validation |
| E-mail | Spring Mail (Gmail SMTP) + templates Thymeleaf |
| PDF | OpenHTMLtoPDF + templates Thymeleaf |
| WebSocket | Spring WebSocket + STOMP + SockJS (notificações em tempo real) |
| Agendamentos | Spring `@Scheduled` (lembretes, expiração de tokens) |
| Rate limit | Bucket4j (em memória) |
| Testes | JUnit 5, Spring Boot Test |
| Build | Maven |

### Frontend
| Camada | Tecnologia |
|---|---|
| Base | React 18 + Vite + TypeScript |
| Estilo | TailwindCSS 3 + shadcn/ui (Radix) + lucide-react |
| Rotas | React Router v6 (data routers) |
| Data | TanStack Query v5 + Axios |
| Estado | Zustand (auth, carrinho, ui) |
| Forms | React Hook Form + Zod |
| Tabelas | TanStack Table |
| Datas/calendário | `date-fns` + `react-day-picker` (shadcn) + `FullCalendar` (mês/semana/dia/agenda) |
| Markdown (blog) | `react-markdown` + `remark-gfm` |
| WebSocket | `@stomp/stompjs` + `sockjs-client` (cliente STOMP) |
| Charts (dashboards) | `recharts` |
| Toasts | `sonner` |
| SEO | `react-helmet-async` |
| PDF preview | `<iframe>` apontando para endpoint backend |

### Infra local
- **Docker Compose**: PostgreSQL 16 (+ pgAdmin opcional)
- `.env` na raiz
- Uploads salvos em `backend/uploads/` e servidos como estáticos

---

## 3. Estrutura do monorepo

```
ProjetoSilvio/
├── backend/
│   ├── src/main/java/br/com/inovatech/
│   │   ├── InovatechApplication.java
│   │   ├── config/             # Security, CORS, OpenAPI, Mail, Async, Scheduling
│   │   ├── shared/             # Erros, paginação, utils
│   │   ├── modules/
│   │   │   ├── auth/           # login, register, refresh, reset senha
│   │   │   ├── usuario/
│   │   │   ├── aluno/
│   │   │   ├── professor/
│   │   │   ├── curso/
│   │   │   ├── disciplina/
│   │   │   ├── turma/
│   │   │   ├── matricula/
│   │   │   ├── aula/           # base do calendário
│   │   │   ├── avaliacao/      # notas
│   │   │   ├── frequencia/     # presença
│   │   │   ├── documento/      # PDFs
│   │   │   ├── notificacao/
│   │   │   ├── post/           # blog
│   │   │   ├── produto/
│   │   │   ├── carrinho/
│   │   │   ├── pedido/
│   │   │   └── busca/          # search global
│   │   └── infra/
│   │       ├── security/       # JwtService, filtros, UserDetailsService
│   │       ├── mail/
│   │       ├── pdf/
│   │       └── storage/        # upload local de imagens
│   ├── src/main/resources/
│   │   ├── application.yml
│   │   ├── db/migration/       # V1__init.sql, V2__seed.sql ...
│   │   ├── templates/pdf/
│   │   └── templates/mail/
│   ├── uploads/                # arquivos enviados (gitignored)
│   ├── pom.xml
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── main.tsx
│   │   ├── app/                # router + providers
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   ├── auth/
│   │   │   ├── aluno/
│   │   │   ├── professor/
│   │   │   ├── admin/
│   │   │   └── loja/
│   │   ├── features/           # queries, mutations, schemas por domínio
│   │   ├── components/
│   │   │   ├── ui/             # shadcn
│   │   │   ├── layout/
│   │   │   ├── blog/
│   │   │   ├── shop/
│   │   │   ├── calendario/
│   │   │   └── data-table/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── lib/                # api, axios, queryClient, formatters
│   │   ├── types/
│   │   └── styles/
│   ├── public/                 # logo, favicon, robots.txt
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── components.json
│   └── package.json
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## 4. Variáveis de ambiente

`.env` (raiz, gitignored):

```env
# --- Banco ---
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inovatech
DB_USER=inovatech
DB_PASS=inovatech

# --- JWT ---
JWT_SECRET=troque-esta-chave-com-no-minimo-32-bytes-aleatorios
JWT_ACCESS_EXPIRATION=3600          # 1h
JWT_REFRESH_EXPIRATION=604800       # 7d

# --- SMTP (fornecido) ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=gabrielinaciodev47@gmail.com
SMTP_PASS=lldh cjzw yodk mqmt
SMTP_FROM="Inovatech <gabrielinaciodev47@gmail.com>"

# --- URLs ---
APP_FRONT_URL=http://localhost:5173
APP_BACK_URL=http://localhost:8080

# --- Upload ---
UPLOAD_DIR=./uploads
UPLOAD_MAX_MB=10
```

---

## 5. Modelo de dados

### 5.1 Diagrama lógico (texto)

```
usuario 1─1 aluno         aluno N─1 curso
usuario 1─1 professor     curso N─N disciplina (curso_disciplina)
usuario 1─N session       disciplina 1─N turma
usuario 1─N notificacao   turma N─1 professor
                          turma 1─N matricula  ─  N─1 aluno
                          turma 1─N aula
                          aula  1─N presenca   ─  N─1 matricula
                          matricula 1─N nota
                          aluno 1─N pedido 1─N pedido_item N─1 produto
post (standalone)
evento_institucional (standalone, exibido no calendário)
password_reset_token (usuario)
```

### 5.2 Tabelas (campos principais)

**`usuario`** — id, nome, email UNIQUE, senha_hash, tipo `ENUM(ALUNO, PROFESSOR, ADMIN)`, ativo, avatar_url, senha_provisoria BOOLEAN, criado_em, atualizado_em
**`session`** — id, usuario_id, access_token_hash, refresh_token_hash, user_agent, ip, expira_em, revogado, criado_em
**`password_reset_token`** — id, usuario_id, token_hash, expira_em, usado_em
**`notificacao`** — id, usuario_id, titulo, mensagem, tipo `ENUM(INFO, AVISO, NOTA, MATRICULA, AULA, PEDIDO)`, link, lida, criado_em

**`curso`** — id, nome, slug UNIQUE, codigo UNIQUE, duracao_semestres, descricao, coordenador_id (professor)
**`disciplina`** — id, nome, codigo UNIQUE, carga_horaria, ementa, semestre_sugerido
**`curso_disciplina`** — curso_id, disciplina_id, obrigatoria BOOLEAN
**`aluno`** — id, usuario_id UNIQUE, ra UNIQUE, cpf UNIQUE, data_nascimento, telefone, endereco, curso_id, semestre_ingresso (ex: `2024.1`), status `ENUM(PENDENTE, ATIVO, TRANCADO, FORMADO)`
**`professor`** — id, usuario_id UNIQUE, siape UNIQUE, cpf UNIQUE, titulacao `ENUM(GRADUACAO, ESPECIALIZACAO, MESTRADO, DOUTORADO)`, telefone

**`turma`** — id, disciplina_id, professor_id, ano, semestre `ENUM(PRIMEIRO, SEGUNDO)`, sala, vagas, dia_semana `ENUM(SEG..SAB)`, hora_inicio TIME, hora_fim TIME, data_inicio DATE, data_fim DATE, status `ENUM(PLANEJADA, ATIVA, ENCERRADA)`, version INT
**`matricula`** — id, aluno_id, turma_id, status `ENUM(ATIVA, TRANCADA, APROVADO, REPROVADO, REPROVADO_FALTA)`, data_matricula, media_final DECIMAL(4,2), frequencia_pct DECIMAL(5,2)
**`aula`** — id, turma_id, data DATE, hora_inicio TIME, hora_fim TIME, tema, conteudo, status `ENUM(AGENDADA, REALIZADA, CANCELADA)`
**`presenca`** — id, aula_id, matricula_id, presente BOOLEAN, justificativa
**`nota`** — id, matricula_id, tipo `ENUM(P1, P2, P3, TRABALHO, SEMINARIO, FINAL)`, valor DECIMAL(4,2), peso DECIMAL(3,2), descricao, data_avaliacao DATE, lancada_em

**`evento_institucional`** — id, titulo, descricao, data_inicio TIMESTAMP, data_fim TIMESTAMP, local, publico BOOLEAN, criado_por

**`post`** — id, titulo, slug UNIQUE, resumo, conteudo_md, imagem_capa, autor, publicado_em, tags TEXT[]
**`produto`** — id, nome, slug UNIQUE, descricao, preco DECIMAL(10,2), estoque INT, imagem_url, categoria `ENUM(VESTUARIO, ACESSORIOS, MATERIAL, LIVROS)`, ativo, version INT
**`pedido`** — id, aluno_id, total DECIMAL(10,2), status `ENUM(CARRINHO, CONFIRMADO, CANCELADO, ENTREGUE)`, observacao, criado_em, atualizado_em
**`pedido_item`** — id, pedido_id, produto_id, quantidade, preco_unitario

Índices em FKs, em `slug`, `email`, `ra`, `siape`, `cpf` e `(turma_id, aluno_id)` da matrícula (UNIQUE).

---

## 6. Perfis, permissões e onboarding

### Perfis
- **VISITANTE** — sem login. Acessa portal, blog, cursos, loja (browse).
- **ALUNO** — área `/app/*`, matrícula, calendário, notas, documentos, perfil, loja com checkout.
- **PROFESSOR** — área `/prof/*`, suas turmas, lançar notas/presença, criar aulas.
- **ADMIN** — área `/admin/*`, todos os CRUDs, gestão de posts, produtos, eventos.

### Onboarding
- **Visitante → Aluno (pendente):** registro público em `/registrar` cria `usuario` ALUNO em status `PENDENTE` (sem RA). Admin valida e gera RA, vincula a um curso. (Admin também pode criar direto.)
- **Professor:** sempre criado pelo admin (sem auto-registro).
- **Senha provisória:** se criado pelo admin, primeiro login redireciona para `/trocar-senha`.

---

## 7. Endpoints REST

> Prefixo: `/api`. Paginação `?page=0&size=20&sort=campo,asc`. Erros padronizados `{ timestamp, status, error, message, path, fields[] }`.

### Auth
- `POST /auth/register` (público, aluno pendente)
- `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`
- `POST /auth/forgot-password`, `POST /auth/reset-password`, `POST /auth/change-password`
- `GET  /auth/me`
- `GET  /auth/sessions`, `DELETE /auth/sessions/{id}`

### Usuário / perfil
- `GET /me/perfil`, `PUT /me/perfil`, `POST /me/avatar`

### Alunos (ADMIN)
- CRUD `/alunos` + `POST /alunos/{id}/ativar` + `POST /alunos/{id}/desativar`

### Professores (ADMIN)
- CRUD `/professores`

### Cursos & Disciplinas (ADMIN)
- CRUD `/cursos`, CRUD `/disciplinas`
- `POST /cursos/{id}/disciplinas` (vincular)
- `GET /cursos/{id}/grade` (matriz por semestre)

### Turmas
- CRUD `/turmas` (ADMIN)
- `GET /turmas/disponiveis?cursoId=&semestre=` (ALUNO)
- `GET /turmas/{id}/alunos` (PROFESSOR/ADMIN)
- `GET /turmas/{id}/calendario`

### Matrícula (ALUNO)
- `GET /matriculas/minhas`
- `POST /matriculas` `{ turmaId }`
- `DELETE /matriculas/{id}` (trancar)
- `GET /matriculas/grade-curricular`

### Aulas (PROFESSOR)
- `GET /aulas?turmaId=&from=&to=`
- `POST /aulas`, `PUT /aulas/{id}`, `DELETE /aulas/{id}` (cancela)
- `POST /aulas/{id}/chamada` `[{ matriculaId, presente, justificativa }]`

### Notas (PROFESSOR)
- `GET /notas?turmaId=`
- `POST /notas` (lote), `PUT /notas/{id}`, `DELETE /notas/{id}`

### Aluno: visões
- `GET /aluno/boletim`, `GET /aluno/frequencia`
- `GET /aluno/calendario?from=&to=`, `GET /aluno/calendario.ics`
- `GET /aluno/dashboard`

### Professor: visões
- `GET /professor/dashboard`
- `GET /professor/calendario?from=&to=`

### Documentos (ALUNO)
- `GET /documentos/declaracao-matricula.pdf`
- `GET /documentos/historico.pdf`
- `GET /documentos/declaracao-vinculo.pdf`
- `GET /documentos/boletim.pdf`

### Notificações
- `GET /notificacoes?lida=`
- `POST /notificacoes/{id}/ler`, `POST /notificacoes/ler-todas`

### Blog (público + ADMIN para escrita)
- `GET /posts?tag=&q=&page=`, `GET /posts/{slug}`
- CRUD `/posts` (ADMIN)

### Eventos institucionais
- `GET /eventos?from=&to=` (público quando `publico=true`)
- CRUD `/eventos` (ADMIN)

### Loja
- `GET /produtos?categoria=&q=&page=`, `GET /produtos/{slug}`
- `GET /carrinho` (ALUNO)
- `POST /carrinho/itens`, `PUT /carrinho/itens/{id}`, `DELETE /carrinho/itens/{id}`
- `POST /pedidos/finalizar`
- `GET /pedidos/meus`, `GET /pedidos/{id}`
- CRUD `/produtos`, `GET /admin/pedidos` (ADMIN)

### Busca global
- `GET /search?q=` → `{ posts, cursos, disciplinas, produtos }`

### SEO
- `GET /sitemap.xml`

### Upload
- `POST /uploads` (multipart, ADMIN/PROFESSOR) → URL `/uploads/uuid.ext`

---

## 8. Segurança

- **JWT HS256**, `JWT_SECRET` ≥ 32 bytes; claims `sub`, `tipo`, `iat`, `exp`, `jti`
- **Access 1h** + **refresh 7d** (hash SHA-256 na `session`, comparação por hash; revogação real)
- **BCrypt strength 12**
- **Stateless**, CSRF off, CORS apenas `APP_FRONT_URL`
- **`@PreAuthorize`** por método (`hasRole('ALUNO|PROFESSOR|ADMIN')`)
- **Rate limit Bucket4j**: `/auth/login` 5/min/IP, `/auth/forgot-password` 3/h/IP, `/auth/register` 3/h/IP
- **Reset de senha:** token 32 bytes Base64Url, hash SHA-256 no banco, 30 min, single-use
- **Sanitização:** Markdown via `react-markdown` (sem `dangerouslySetInnerHTML`)
- **Headers HTTP:** `X-Content-Type-Options`, `X-Frame-Options DENY`, `Referrer-Policy strict-origin-when-cross-origin`, CSP mínima
- **Auditoria:** logs estruturados de login, logout, reset, pedidos
- **Upload:** mime whitelist (jpg, png, webp, pdf), tamanho máx, renomeia para UUID

---

## 9. Sistema de PDFs

- **Lib:** `com.openhtmltopdf:openhtmltopdf-pdfbox` + Thymeleaf
- **`PdfService.render(template, model) → byte[]`**
- **Layout padrão:** cabeçalho com logo institucional, rodapé com data/hora de emissão + código de autenticidade `SHA-256(tipo+aluno+timestamp).substring(0,12)`
- **Templates:**
  1. **Declaração de matrícula** — aluno, curso, semestre, disciplinas ativas (tabela), texto formal
  2. **Histórico escolar** — todas as matrículas concluídas (disciplina, CH, média, frequência, status, semestre)
  3. **Declaração de vínculo** — texto institucional curto
  4. **Boletim semestral** — turmas do semestre corrente com notas detalhadas
- **CSS:** fonte serifada embutida (DejaVu Serif), papel A4, margens 2cm, tabelas zebra

---

## 10. Sistema de e-mail (SMTP)

- **Spring Mail** com credenciais do `.env`
- **Templates Thymeleaf HTML responsivos** em `templates/mail/`
- **Tipos:**
  1. **Boas-vindas** (registro)
  2. **Recuperar senha** (link `${APP_FRONT_URL}/redefinir-senha?token=...`)
  3. **Confirmação de matrícula** (lista de disciplinas)
  4. **Nota lançada** (opcional)
  5. **Pedido confirmado**
  6. **Lembrete de prova** (24h antes)
- **Envio assíncrono** `@Async`, retry x3 com backoff, log de falha

---

## 11. Calendário acadêmico

Componente central da UX para aluno e professor.

### Backend
- **Geração automática de aulas** ao criar uma turma: dado `dia_semana`, `hora_inicio/fim`, `data_inicio/fim`, o serviço cria registros em `aula` com status `AGENDADA`. Professor pode editar/cancelar individualmente.
- **`GET /aluno/calendario?from=&to=`** retorna eventos unificados:
  - `AULA` (disciplina, sala, tema, professor)
  - `PROVA` (notas com `data_avaliacao` no intervalo)
  - `EVENTO_INSTITUCIONAL`
  - `ENTREGA_TRABALHO`
- Cores por tipo + por disciplina (hash do código → paleta fixa)
- **Export ICS** `GET /aluno/calendario.ics` para Google/Outlook

### Frontend
- **`/app/calendario`** com **FullCalendar**, visões: **mês, semana, dia, agenda (lista)**
- **Mobile:** padrão **agenda**; **desktop** padrão **semana**
- **Filtros:** por disciplina, por tipo
- **Clique no evento** → drawer lateral com detalhes + atalhos (ver turma, anotações)
- **Hoje** destacado, navegação por setas e datepicker
- **Professor**: `/prof/calendario` com botão **Fazer chamada** direto do card da aula do dia

---

## 12. Notificações in-app (tempo real via WebSocket)

- **Sino** no header com badge de não lidas, atualização instantânea
- **Popover** com últimas 5 + “ver todas” → `/app/notificacoes`
- **Transporte:** **Spring WebSocket + STOMP** sobre **SockJS** (fallback para HTTP long-polling em redes que bloqueiam WS)
  - Endpoint handshake: `ws://localhost:8080/ws` (com fallback SockJS `/ws`)
  - Broker simples em memória: `enableSimpleBroker("/topic", "/queue")`, prefixo de app `/app`
  - Autenticação no handshake: token JWT enviado via header `Authorization` (parâmetro do `connectHeaders` no cliente STOMP); `ChannelInterceptor` valida e popula o `Principal`
  - Canal por usuário: `/user/queue/notificacoes` (Spring resolve `/user/{username}/...` automaticamente)
  - Canal broadcast institucional opcional: `/topic/avisos-gerais` (ex.: aviso da reitoria)
- **Backend** publica via `SimpMessagingTemplate.convertAndSendToUser(email, "/queue/notificacoes", dto)` no mesmo serviço que grava a notificação no banco — entrega garantida + histórico persistido
- **Disparadores:**
  - Matrícula confirmada
  - Nova nota lançada
  - Aula cancelada/remarcada
  - Lembrete de prova (24h antes via `@Scheduled` diário)
  - Pedido confirmado / pedido marcado como entregue
  - Aviso institucional (admin envia para `/topic/avisos-gerais`)
- **Frontend:**
  - Hook `useNotificationsSocket()` abre a conexão STOMP no login, assina `/user/queue/notificacoes` e `/topic/avisos-gerais`
  - Ao receber mensagem: invalida `queryKey: ['notificacoes']` do TanStack Query, incrementa badge, dispara **toast** (`sonner`) com link clicável e som curto opcional (respeitando `prefers-reduced-motion` e config do usuário)
  - **Reconexão automática** com backoff exponencial (1s, 2s, 4s, 8s, máx 30s)
  - **Fallback graceful:** se WS não conectar após 3 tentativas, ativa polling de 60s como rede de segurança
  - Conexão fechada no logout e na troca de aba inativa por > 5min (reabre ao voltar)
- **Histórico:** lista paginada vem do REST (`GET /notificacoes`); WebSocket entrega só os eventos novos. Cada notificação tem `link` clicável.
- **Marcar como lida:** continua via REST (`POST /notificacoes/{id}/ler`, `POST /notificacoes/ler-todas`) — operação idempotente, sem necessidade de WS.

---

## 13. Frontend: design system e responsividade

### Tokens (Tailwind)
- **Cores:**
  - `primary` — azul institucional `#0B5FFF` (50–900)
  - `secondary` — verde `#16A34A`
  - `accent` — laranja `#F97316`
  - `muted`, `destructive`, `success`, `warning` (CSS vars do shadcn)
- **Tipografia:** `Inter` (UI), `Source Serif` (títulos de blog)
- **Raio:** `--radius: 0.75rem`
- **Sombras:** suaves, 3 níveis
- **Tema:** claro + escuro (toggle no header, preferência em localStorage)

### Breakpoints (Tailwind padrão)
| Nome | Min |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl`| 1536px |

### Regras de responsividade
- **Mobile-first**, escala com `md:`/`lg:`
- **Sidebar** vira **drawer** (`Sheet`) em < `lg`
- **Tabelas** viram **cards empilhados** em < `md` (componente `<DataTable mobileVariant="cards">`)
- **Formulários** em 1 coluna mobile, 2 colunas ≥ `md`
- **Calendário:** mês desktop, agenda mobile (chaveado automaticamente)
- **Imagens** com `aspect-ratio` e lazy
- **Bottom navigation** em mobile para área do aluno (Home, Calendário, Notas, Documentos, Perfil)
- **Toques ≥ 44×44px**, **inputs ≥ 16px** (evita zoom iOS)

### Acessibilidade
- Foco visível (`ring`)
- `aria-label` em ícones-botão
- `prefers-reduced-motion` respeitado
- Skip-link “Pular para conteúdo”

---

## 14. Mapa de telas e rotas

### Públicas (`PublicLayout`: header + footer + search global)
| Rota | Tela |
|---|---|
| `/` | Home portal (hero, destaques, últimos posts, cursos, eventos, CTA loja) |
| `/sobre` | Institucional |
| `/cursos` | Lista de cursos (cards) |
| `/cursos/:slug` | Detalhe do curso (grade sugerida, perfil do egresso) |
| `/blog` | Listagem paginada, filtro por tag |
| `/blog/:slug` | Post com capa, autor, data, tags, related |
| `/loja` | Vitrine, filtros por categoria, busca |
| `/loja/:slug` | Detalhe + adicionar ao carrinho |
| `/carrinho` | Carrinho |
| `/contato` | Form simples (envia e-mail) |
| `/login`, `/registrar`, `/esqueci-senha`, `/redefinir-senha`, `/trocar-senha` | Autenticação |
| `*` | 404 institucional |

### Aluno (`AppLayout`: sidebar lg / drawer mobile + topbar com sino + busca + avatar; bottom-nav mobile)
| Rota | Tela |
|---|---|
| `/app` | Dashboard (próximas aulas, próximas provas, médias, frequência, pendências, atalhos) |
| `/app/calendario` | Calendário acadêmico |
| `/app/matricula` | Período aberto: turmas disponíveis (filtros) + minhas matrículas |
| `/app/grade-curricular` | Matriz visual do curso (semestre × disciplina, status colorido) |
| `/app/notas` | Boletim por turma (acordeão) |
| `/app/frequencia` | Tabela de presença por disciplina + % |
| `/app/documentos` | Lista de documentos para gerar (preview + download) |
| `/app/notificacoes` | Lista completa |
| `/app/pedidos` | Histórico de pedidos da loja |
| `/app/perfil` | Dados, foto, trocar senha, sessões ativas |

### Professor
| Rota | Tela |
|---|---|
| `/prof` | Dashboard (turmas ativas, próximas aulas, notas pendentes) |
| `/prof/calendario` | Calendário das aulas |
| `/prof/turmas` | Lista de turmas (cards) |
| `/prof/turmas/:id` | Visão da turma: tabs (Alunos, Aulas, Notas, Frequência, Conteúdo) |
| `/prof/turmas/:id/aulas/:aulaId/chamada` | Chamada (lista + toggles) |
| `/prof/perfil` | |

### Admin
| Rota | Tela |
|---|---|
| `/admin` | Dashboard institucional (gráficos) |
| `/admin/alunos` | DataTable + form modal |
| `/admin/professores` | idem |
| `/admin/cursos` | idem + sub-aba “grade do curso” |
| `/admin/disciplinas` | idem |
| `/admin/turmas` | idem (gera aulas automaticamente) |
| `/admin/eventos` | CRUD eventos institucionais |
| `/admin/posts` | CRUD com editor markdown |
| `/admin/produtos` | CRUD |
| `/admin/pedidos` | Lista, marca entregue |
| `/admin/usuarios` | Gerenciar acesso (reset, desativar) |

---

## 15. Jornadas UX detalhadas

### 15.1 Aluno se registra e faz login
1. Visitante clica em **Entrar** no header → `/login`
2. Sem conta? **Criar conta** → `/registrar` (nome, email, senha, confirmação, aceite termos)
3. Submit → toast “Conta criada! Verifique seu e-mail” + e-mail boas-vindas SMTP
4. Login → dashboard `/app`
5. Se admin ainda não vinculou RA/curso → banner amarelo “Sua matrícula está pendente. Aguarde a aprovação institucional.” (algumas funções bloqueadas)

### 15.2 Recuperação de senha
1. `/esqueci-senha` → digita e-mail → toast “Se existir, enviaremos instruções” (não revela existência)
2. E-mail com link `/redefinir-senha?token=...` (30 min)
3. Form: nova senha + confirmação (≥ 8, 1 maiúscula, 1 número)
4. Sucesso → redireciona para login + toast

### 15.3 Matrícula em turmas
1. `/app/matricula` mostra duas colunas (mobile = duas tabs): **Turmas disponíveis** | **Minhas matrículas**
2. Filtros: disciplina, professor, dia da semana, horário
3. Card da turma: disciplina, professor, vagas (X/Y), horário, sala, botão **Matricular**
4. Confirma em dialog → POST → toast + atualiza vagas
5. **Regras impeditivas** (botão desabilitado com tooltip):
   - Conflito de horário com outra matrícula ativa
   - Sem vagas
   - Status do aluno = PENDENTE
6. **Trancar** em “Minhas matrículas” pede confirmação dupla.

### 15.4 Aluno acompanha aulas (calendário)
1. `/app/calendario` carrega mês atual
2. Eventos clicáveis → drawer com disciplina, tema, professor, sala, status
3. Botão **Exportar para meu calendário (.ics)**

### 15.5 Aluno consulta notas
1. `/app/notas` mostra cards por disciplina (turma atual + histórico em tab)
2. Cada card: avaliações (tipo, valor/10, peso), **Média parcial**, **Situação prevista** (verde/amarelo/vermelho)
3. Empty state se sem notas: ilustração + “Seu professor ainda não lançou notas”

### 15.6 Aluno gera documentos
1. `/app/documentos` lista 4 cards (declaração matrícula, histórico, declaração vínculo, boletim)
2. Clique → drawer com **preview em iframe** + **Baixar** e **Imprimir**
3. PDF gerado on-demand (sem armazenar)

### 15.7 Professor lança chamada
1. `/prof/turmas/:id` → tab **Aulas** → próxima aula tem botão **Fazer chamada**
2. Lista de alunos com toggle Presente/Ausente + justificativa
3. Botão **Salvar** sticky no bottom (mobile)
4. Após salvar: marca aula como `REALIZADA`, dispara notificação opcional aos faltantes

### 15.8 Professor lança notas
1. Tab **Notas** da turma → tabela alunos × avaliações
2. Botão **Nova avaliação** abre modal (tipo, peso, descrição, data)
3. Edição inline célula a célula com debounce + auto-save (toast discreto)
4. Botão **Fechar semestre** calcula médias e atualiza `status` da matrícula

### 15.9 Admin cria turma (gera calendário)
1. `/admin/turmas/nova` form: disciplina, professor, ano, semestre, sala, vagas, dia, hora, data início/fim
2. Preview lateral mostra **N aulas serão geradas**
3. Submit → backend cria turma + popula `aula` agendada

### 15.10 Compra na loja
1. `/loja` cards de produto. Filtro lateral por categoria + busca.
2. `/loja/:slug` galeria, descrição, seletor de quantidade, **Adicionar ao carrinho** (badge incrementa)
3. `/carrinho`: itens, subtotal, **Finalizar pedido**
4. Visitante → modal “Faça login para finalizar” → após login, retorna ao carrinho (merge)
5. Finalizar → `/loja/pedido-confirmado/:id` com resumo + nº pedido + “retirar no campus”
6. E-mail de confirmação enviado

---

## 16. Componentes-chave do front

| Componente | Descrição |
|---|---|
| `<AppShell>` | Sidebar/drawer + topbar + main + bottom-nav mobile |
| `<DataTable>` | TanStack Table + paginação + busca + ordenação + variante mobile cards |
| `<FormField>` | Wrapper RHF + Zod + erro acessível |
| `<PageHeader>` | Título, breadcrumbs, ações |
| `<EmptyState>` | Ilustração + título + descrição + CTA |
| `<StatusBadge>` | Mapeia enums para cor (matricula, turma, pedido) |
| `<CalendarView>` | FullCalendar wrap responsivo (mês/semana/agenda) |
| `<ChamadaTable>` | Tabela otimizada para chamada |
| `<NotaCell>` | Célula editável com validação 0–10 |
| `<PdfPreview>` | iframe + toolbar baixar/imprimir |
| `<CartSheet>` | Drawer do carrinho acessível de qualquer página |
| `<NotificationBell>` | Popover + lista |
| `<SearchCommand>` | Cmd+K busca global (shadcn Command) |
| `<MarkdownView>` | Renderiza post com tipografia |
| `<ImageUploader>` | Drag-and-drop + preview |
| `<ProtectedRoute>` | Verifica auth + role |
| `<ThemeToggle>` | Claro/escuro |

---

## 17. Encontrabilidade (SEO + busca interna)

### SEO técnico
- `react-helmet-async` por página: `<title>`, `<meta description>`, `<meta og:*>`, `<meta twitter:*>`
- `JSON-LD`: `Organization` (Home), `Article` (post), `Product` (produto), `Course` (curso), `BreadcrumbList`
- `sitemap.xml` dinâmico no backend (`/`, `/blog/*`, `/cursos/*`, `/loja/*`)
- `robots.txt`: libera público, bloqueia `/app`, `/prof`, `/admin`
- URLs **kebab-case com slug** (`/blog/colacao-de-grau-2026-1`)
- Headings hierárquicos, `alt` em imagens, `lang="pt-BR"`
- Performance: code splitting por rota, prefetch, imagens otimizadas

### Busca interna
- **Global (Cmd+K)** em `GET /search?q=` — debounce 300ms, resultados agrupados por tipo
- **Por seção**: blog, loja, cursos, alunos (admin), turmas — input + filtros + chips

### UX de descoberta
- Breadcrumbs em todas as páginas internas
- “Veja também” em posts e produtos
- Tags clicáveis em posts
- “Você também pode se interessar” no dashboard do aluno

---

## 18. Loja: fluxo completo

- **Vitrine** com filtros (categoria, faixa de preço, ordenação)
- **Card**: imagem, nome, preço, badge “Esgotado” se `estoque=0`
- **Detalhe**: galeria, descrição, quantidade respeitando estoque, “Adicionar ao carrinho”
- **Carrinho** persistido em Zustand + localStorage (visitante) e no servidor (logado, merge no login)
- **Checkout simples** (sem pagamento): confirma identidade + observação (ex: “retirar quinta”)
- **Estoque** decrementado ao confirmar (transação JPA, `@Version` para lock otimista)
- **Histórico** em `/app/pedidos`
- **Admin** vê todos pedidos, marca como `ENTREGUE`

---

## 19. Estados de UI (loading, vazio, erro)

Toda lista/tela cobre os 4 estados:
| Estado | Padrão |
|---|---|
| **Loading** | Skeleton (não spinner) seguindo layout final |
| **Vazio** | `<EmptyState>` com ilustração + CTA |
| **Erro** | Card com ícone, mensagem amigável, botão **Tentar novamente** |
| **Sucesso** | Conteúdo + toast quando ação concluída |

Formulários: erro de campo inline (vermelho + ícone + texto), erro de submit em banner topo.

---

## 20. Validações e regras de negócio

- **Email** único; **CPF** validado por algoritmo; **RA** gerado pelo sistema (`AAAA` + sequência); **SIAPE** único
- **Senha:** ≥ 8 chars, 1 maiúscula, 1 número
- **Matrícula:** sem conflito de horário (mesma faixa em dias iguais com outra `ATIVA`)
- **Vagas:** decremento atômico (`@Version` na turma)
- **Notas:** 0.00–10.00, peso > 0
- **Frequência:** aluno com < 75% reprovado por falta ao fechar semestre
- **Média final:** `(Σ nota×peso) / Σ peso`; aprovado ≥ 6.0
- **Carrinho:** quantidade ≤ estoque; se excede no checkout → erro 409 amigável
- **Posts/Produtos:** slug gerado por slugify, unicidade com sufixo `-2`, `-3`

---

## 21. Seeds e dados iniciais

`V2__seed.sql` (idempotente onde possível):
- 1 ADMIN: `admin@inovatech.edu / Inovatech@2026`
- 3 professores, 2 cursos (TADS + Eventos), ~12 disciplinas, ~6 turmas para `2026.1`
- 5 alunos demo
- ~6 posts de blog com imagens em `/public/blog/`
- ~12 produtos (camiseta, caneca, moletom, caderno, livro, jaqueta, boné, mochila…)
- ~4 eventos institucionais

---

## 22. Fases de implementação

| # | Fase | Saída |
|---|------|------|
| 0 | **Scaffolding** | Monorepo, docker-compose Postgres, `.env.example`, README inicial |
| 1 | **Backend base + Auth** | Spring Boot, Flyway V1, login/register/refresh/logout/me, sessions, BCrypt, JWT, OpenAPI |
| 2 | **Mail + reset de senha** | SMTP Gmail funcional, templates HTML, fluxo completo |
| 3 | **Frontend base** | Vite+TS+Tailwind+shadcn, layouts público e app, axios+interceptors, ProtectedRoute, login, registro, esqueci senha, tema claro/escuro |
| 4 | **Portal público** | Home, Cursos, Sobre, Blog (lista+detalhe), Contato, 404, SEO base |
| 5 | **CRUDs administrativos** | Alunos, professores, cursos, disciplinas, vínculo curso×disciplina, turmas (com geração de aulas) |
| 6 | **Matrícula do aluno** | Tela de matrícula, regras de conflito, minhas matrículas, grade curricular visual |
| 7 | **Professor: aulas e chamada** | Tela de turma, criar/editar aulas, chamada |
| 8 | **Professor: notas + Aluno: boletim e frequência** | Lançamento em lote, edição inline, cálculo de médias |
| 9 | **Calendário acadêmico** | Backend agregador + FullCalendar responsivo + export ICS |
| 10 | **Documentos PDF** | Templates Thymeleaf, OpenHTMLtoPDF, 4 documentos, preview no front |
| 11 | **Notificações em tempo real** | Entidade + endpoints REST + WebSocket STOMP/SockJS, autenticação JWT no handshake, sino com badge live, toasts, reconexão automática, jobs `@Scheduled` |
| 12 | **Loja** | Produtos, carrinho persistente, checkout sem pagamento, histórico, admin |
| 13 | **Busca global + Encontrabilidade** | `/search`, sitemap, JSON-LD, metatags por página, robots |
| 14 | **Polimento UX + Responsividade final** | Estados vazios/erro, skeletons, dark mode, a11y, ajustes mobile |
| 15 | **Testes + README final** | Testes principais (auth, matrícula, nota), guia de execução |

---

## 23. Comandos e como rodar

```bash
# 1. Subir Postgres
docker compose up -d

# 2. Backend
cd backend
./mvnw spring-boot:run         # mvnw.cmd no Windows

# 3. Frontend
cd frontend
npm install
npm run dev                    # http://localhost:5173

# Swagger
# http://localhost:8080/swagger-ui.html
```

Credenciais demo após seed: `admin@inovatech.edu / Inovatech@2026`.

---

## Próximo passo

Iniciar **Fase 0 + Fase 1**: scaffold do monorepo (Spring Boot + Vite + docker-compose + `.env`) e implementar autenticação JWT completa com Flyway V1 e tabelas `usuario` e `session`.
