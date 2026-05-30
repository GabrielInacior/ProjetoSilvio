-- V6: Dados iniciais (seed) — Cursos, Disciplinas, Produtos, Posts
-- ATENÇÃO: Usuários (admin, professor, aluno) são criados pelo DataSeeder (Java)
--          para que senhas sejam hasheadas corretamente pelo BCrypt do Spring.

-- =========================================================
-- CURSOS
-- =========================================================
INSERT INTO curso (nome, slug, codigo, duracao_semestres, descricao, ativo, criado_em, atualizado_em)
VALUES
  (
    'Engenharia de Software',
    'engenharia-de-software',
    'ESW',
    8,
    'Forma profissionais capazes de projetar, desenvolver e gerenciar sistemas de software de alta qualidade, com ênfase em métodos ágeis, arquitetura e qualidade de software.',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Sistemas de Informação',
    'sistemas-de-informacao',
    'SINFO',
    8,
    'Integra conhecimentos de gestão e tecnologia para desenvolver soluções que apoiem os processos organizacionais, com foco em banco de dados, redes e gestão de TI.',
    TRUE,
    NOW(),
    NOW()
  ),
  (
    'Ciência da Computação',
    'ciencia-da-computacao',
    'CC',
    8,
    'Oferece uma base sólida em fundamentos teóricos e práticos da computação, abrangendo algoritmos, inteligência artificial, sistemas e teoria da computação.',
    TRUE,
    NOW(),
    NOW()
  )
ON CONFLICT DO NOTHING;

-- =========================================================
-- DISCIPLINAS
-- =========================================================
INSERT INTO disciplina (nome, codigo, carga_horaria, ementa, semestre_sugerido, ativo, criado_em, atualizado_em)
VALUES
  ('Algoritmos e Programação',         'ALP001', 80,
   'Introdução à lógica de programação. Variáveis, estruturas de controle, funções e recursão. Implementação em linguagem estruturada.',
   1, TRUE, NOW(), NOW()),

  ('Programação Orientada a Objetos',  'POO001', 80,
   'Conceitos de classes, objetos, herança, polimorfismo e encapsulamento. Padrões de projeto introdutórios. Prática em Java.',
   2, TRUE, NOW(), NOW()),

  ('Estrutura de Dados',               'ESD001', 60,
   'Listas, pilhas, filas, árvores e grafos. Algoritmos de busca e ordenação. Análise de complexidade.',
   3, TRUE, NOW(), NOW()),

  ('Banco de Dados I',                 'BDI001', 60,
   'Modelo relacional, modelagem ER, SQL (DDL, DML, DQL). Normalização até 3FN. PostgreSQL como SGBD de referência.',
   3, TRUE, NOW(), NOW()),

  ('Banco de Dados II',                'BDII001', 60,
   'Transações, controle de concorrência, índices, otimização de consultas. Introdução a bancos NoSQL.',
   4, TRUE, NOW(), NOW()),

  ('Engenharia de Software I',         'ESW001', 80,
   'Ciclo de vida do software. Metodologias ágeis (Scrum, Kanban). Levantamento e análise de requisitos. UML básico.',
   4, TRUE, NOW(), NOW()),

  ('Engenharia de Software II',        'ESWII001', 80,
   'Arquitetura de software, padrões de projeto GoF. Testes (unitário, integração, E2E). DevOps e CI/CD.',
   5, TRUE, NOW(), NOW()),

  ('Redes de Computadores',            'RED001', 60,
   'Modelo OSI/TCP-IP. Protocolos de comunicação. Endereçamento IP, roteamento, DNS, HTTP/HTTPS.',
   4, TRUE, NOW(), NOW()),

  ('Sistemas Operacionais',            'SOA001', 60,
   'Processos e threads, gerenciamento de memória, sistemas de arquivos, escalonamento e sincronização.',
   5, TRUE, NOW(), NOW()),

  ('Cálculo Diferencial e Integral',   'CAL001', 80,
   'Funções, limites, derivadas e integrais. Aplicações em problemas de engenharia e computação.',
   1, TRUE, NOW(), NOW()),

  ('Álgebra Linear e Discreta',        'ALG001', 60,
   'Matrizes, sistemas lineares, espaços vetoriais, grafos, lógica proposicional e teoria dos conjuntos.',
   2, TRUE, NOW(), NOW()),

  ('Inteligência Artificial',          'IAR001', 80,
   'Agentes inteligentes, busca heurística, aprendizado de máquina supervisionado e não supervisionado, redes neurais.',
   6, TRUE, NOW(), NOW()),

  ('Desenvolvimento Web Full Stack',   'WEB001', 80,
   'HTML5, CSS3, JavaScript moderno (ES2024). Frameworks React e Node.js. APIs RESTful e autenticação JWT.',
   5, TRUE, NOW(), NOW()),

  ('Segurança da Informação',          'SEG001', 60,
   'Criptografia simétrica e assimétrica. OWASP Top 10. Autenticação, autorização e hardening de sistemas.',
   6, TRUE, NOW(), NOW())
ON CONFLICT (codigo) DO NOTHING;

-- =========================================================
-- CURSO-DISCIPLINA (vínculo)
-- =========================================================
-- Engenharia de Software (id=1) recebe todas as disciplinas
INSERT INTO curso_disciplina (curso_id, disciplina_id, obrigatoria)
SELECT c.id, d.id, TRUE
FROM   curso c, disciplina d
WHERE  c.slug = 'engenharia-de-software'
  AND  d.codigo IN ('ALP001','POO001','ESD001','BDI001','BDII001','ESW001','ESWII001',
                    'RED001','SOA001','CAL001','ALG001','IAR001','WEB001','SEG001')
ON CONFLICT DO NOTHING;

-- Sistemas de Informação (id=2)
INSERT INTO curso_disciplina (curso_id, disciplina_id, obrigatoria)
SELECT c.id, d.id, TRUE
FROM   curso c, disciplina d
WHERE  c.slug = 'sistemas-de-informacao'
  AND  d.codigo IN ('ALP001','POO001','ESD001','BDI001','BDII001','ESW001',
                    'RED001','SOA001','CAL001','ALG001','WEB001','SEG001')
ON CONFLICT DO NOTHING;

-- Ciência da Computação (id=3)
INSERT INTO curso_disciplina (curso_id, disciplina_id, obrigatoria)
SELECT c.id, d.id, TRUE
FROM   curso c, disciplina d
WHERE  c.slug = 'ciencia-da-computacao'
  AND  d.codigo IN ('ALP001','POO001','ESD001','BDI001','ESW001','ESWII001',
                    'RED001','SOA001','CAL001','ALG001','IAR001','SEG001')
ON CONFLICT DO NOTHING;

-- =========================================================
-- PRODUTOS (Loja)
-- =========================================================
INSERT INTO produto (nome, slug, descricao, preco, estoque, categoria, ativo, criado_em, atualizado_em)
VALUES
  ('Camiseta Inovatech Preta',
   'camiseta-inovatech-preta',
   'Camiseta 100% algodão fio 30.1, silk screen frente e costas. Disponível nos tamanhos P, M, G e GG.',
   79.90, 50, 'VESTUARIO', TRUE, NOW(), NOW()),

  ('Moletom Inovatech',
   'moletom-inovatech',
   'Moletom com capuz, tecido moletinho 100% algodão. Estampa bordada no peito. Tamanhos M ao GG.',
   149.90, 30, 'VESTUARIO', TRUE, NOW(), NOW()),

  ('Camiseta Polo Inovatech',
   'camiseta-polo-inovatech',
   'Camiseta polo piquê com logo bordado. Ideal para apresentações e eventos acadêmicos.',
   99.90, 40, 'VESTUARIO', TRUE, NOW(), NOW()),

  ('Caneca Inovatech 400ml',
   'caneca-inovatech-400ml',
   'Caneca de porcelana 400ml com logo Inovatech. Perfeita para aquelas sessões de código + café.',
   39.90, 100, 'ACESSORIOS', TRUE, NOW(), NOW()),

  ('Mochila Inovatech',
   'mochila-inovatech',
   'Mochila resistente à água com compartimento para notebook 15", porta USB e alças acolchoadas.',
   119.90, 25, 'ACESSORIOS', TRUE, NOW(), NOW()),

  ('Squeeze Inovatech 500ml',
   'squeeze-inovatech-500ml',
   'Squeeze de alumínio 500ml. Mantém bebidas geladas por até 12h.',
   49.90, 60, 'ACESSORIOS', TRUE, NOW(), NOW()),

  ('Livro: Algoritmos e Estruturas de Dados',
   'livro-algoritmos-e-estruturas-de-dados',
   'Guia completo de algoritmos clássicos com implementações em Java e Python. Ideal para quem está iniciando.',
   119.90, 20, 'LIVROS', TRUE, NOW(), NOW()),

  ('Livro: Engenharia de Software Moderna',
   'livro-engenharia-de-software-moderna',
   'Abordagem prática de métodos ágeis, arquitetura de microsserviços e DevOps para times modernos.',
   139.90, 15, 'LIVROS', TRUE, NOW(), NOW()),

  ('Kit Estudo Inovatech',
   'kit-estudo-inovatech',
   'Contém: 1 caderno universitário 200 folhas, 1 caneta azul Inovatech, 1 marca-texto amarelo e 1 régua 30cm.',
   49.90, 80, 'MATERIAL', TRUE, NOW(), NOW()),

  ('Mousepad Inovatech XL',
   'mousepad-inovatech-xl',
   'Mousepad extra grande (80x40cm) com base antiderrapante. Estampa com circuito integrado.',
   59.90, 35, 'ACESSORIOS', TRUE, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- POSTS (Blog Institucional)
-- =========================================================
INSERT INTO post (titulo, slug, resumo, conteudo_md, autor, publicado, publicado_em, tags, criado_em, atualizado_em)
VALUES
  (
    'Bem-vindo ao Portal Inovatech!',
    'bem-vindo-ao-portal-inovatech',
    'Conheça as funcionalidades do novo portal acadêmico e descubra como ele vai transformar sua experiência na faculdade.',
    E'# Bem-vindo ao Portal Inovatech!\n\nÉ com grande satisfação que apresentamos o **novo portal acadêmico Inovatech**.\n\n## O que você encontra aqui?\n\n- 📚 **Boletim online** — visualize suas notas e frequência em tempo real\n- 📅 **Grade de aulas** — horários e salas atualizados pelo professor\n- 🛒 **Loja Inovatech** — canecas, camisetas e muito mais\n- 🔔 **Notificações** — fique por dentro de tudo que acontece na faculdade\n\n## Primeiros passos\n\n1. Acesse **Meu Perfil** e complete seus dados\n2. Verifique sua **Grade de Disciplinas**\n3. Ative as notificações para não perder nenhum aviso\n\nQualquer dúvida, acione o suporte pelo e-mail **suporte@inovatech.edu.br**.\n\nBom semestre! 🎓',
    'Equipe Inovatech',
    TRUE,
    NOW() - INTERVAL '10 days',
    ARRAY['portal','novidades','acadêmico'],
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days'
  ),
  (
    'Dicas de Estudo para o Primeiro Semestre',
    'dicas-de-estudo-primeiro-semestre',
    'Chegou a faculdade? Confira dicas práticas para organizar sua rotina de estudos e aproveitar ao máximo cada disciplina.',
    E'# Dicas de Estudo para o Primeiro Semestre\n\nEntrar na faculdade é uma grande conquista — e também um novo desafio de organização. Confira nossas dicas:\n\n## 1. Planeje sua semana\n\nUse um planejador (físico ou digital) para distribuir os estudos de cada disciplina ao longo da semana. Reserve ao menos **1h por dia** para revisar o conteúdo visto em aula.\n\n## 2. Participe ativamente das aulas\n\nFaça perguntas, anote dúvidas e interaja com os colegas. A participação ativa melhora a retenção do conteúdo em até 60%.\n\n## 3. Forme grupos de estudo\n\nEstudar em grupo ajuda a identificar pontos cegos e a consolidar o aprendizado. Combine sessões semanais com 3 a 5 colegas.\n\n## 4. Use a biblioteca e os recursos digitais\n\nA biblioteca do campus conta com títulos físicos e digitais. Use plataformas como **Google Scholar**, **Scielo** e o acervo da **CAPES** para pesquisas.\n\n## 5. Cuide da saúde mental\n\nEstudar muito sem descanso é contraproducente. Durma bem, pratique exercícios e reserve tempo para o lazer.\n\n> "Educação não é a aprendizagem de fatos, mas o treinamento da mente para pensar." — Albert Einstein',
    'Prof. Carlos Mendes',
    TRUE,
    NOW() - INTERVAL '5 days',
    ARRAY['estudos','dicas','primeiro-semestre','universitário'],
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days'
  ),
  (
    'Feira de Ciências Inovatech 2026 — Inscrições Abertas',
    'feira-de-ciencias-inovatech-2026',
    'Apresente seu projeto e concorra a prêmios! A Feira de Ciências 2026 acontecerá nos dias 15 e 16 de agosto no Campus Central.',
    E'# Feira de Ciências Inovatech 2026\n\n## Datas e Local\n\n📅 **15 e 16 de agosto de 2026**\n📍 **Campus Central — Pavilhão de Eventos**\n\n## Como participar?\n\nTodos os alunos regularmente matriculados podem inscrever projetos **individualmente ou em grupos de até 4 pessoas**.\n\n### Categorias\n\n| Categoria | Público |  \n|-----------|---------|  \n| Software & Apps | Todos os cursos |  \n| Hardware & Robótica | Eng. de Software, CC |  \n| Dados & IA | Todos os cursos |  \n| Inovação Social | Todos os cursos |  \n\n## Premiação\n\n- 🥇 1º lugar: R$ 2.000 + troféu + certificado\n- 🥈 2º lugar: R$ 1.000 + troféu + certificado\n- 🥉 3º lugar: R$ 500 + troféu + certificado\n\n## Inscrições\n\nAs inscrições ficam abertas até **31 de julho de 2026** pelo formulário disponível no portal.\n\nDúvidas? Entre em contato com a comissão organizadora: **feiradeciencias@inovatech.edu.br**',
    'Comissão Organizadora',
    TRUE,
    NOW() - INTERVAL '2 days',
    ARRAY['evento','feira-de-ciencias','2026','competição'],
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days'
  ),
  (
    'Guia Completo: Como Usar o Portal Inovatech',
    'guia-completo-portal-inovatech',
    'Passo a passo completo para aproveitar todas as funcionalidades do portal: matrícula, boletim, loja, notificações e mais.',
    E'# Guia Completo: Portal Inovatech\n\n## Acesso e Login\n\n1. Acesse [portal.inovatech.edu.br](http://localhost:5173)\n2. Use o **e-mail institucional** e a senha cadastrada\n3. Na primeira vez, altere a senha provisória enviada ao seu e-mail\n\n## Seção do Aluno\n\n### Boletim\nAcompanhe notas por disciplina, tipo de avaliação (P1, P2, Trabalho) e média final calculada automaticamente.\n\n### Frequência\nVisualize as aulas realizadas e sua presença em cada uma. Atenção: falta acima de 25% repova por frequência!\n\n### Matrícula\nVisualize suas turmas ativas e histórico de disciplinas cursadas.\n\n## Seção do Professor\n\n- **Lançamento de notas** — insira as notas por aluno diretamente no portal\n- **Registro de presença** — marque presença aula a aula\n- **Gerenciamento de turmas** — visualize lista de alunos e dados da turma\n\n## Loja Inovatech\n\nAcesse **Loja** no menu lateral para ver os produtos disponíveis. O pagamento é processado de forma segura e o pedido pode ser retirado na secretaria.\n\n## Notificações\n\nAtive as notificações do navegador para receber alertas de novas notas, avisos de aula e novidades institucionais em tempo real.',
    'Equipe Inovatech',
    TRUE,
    NOW() - INTERVAL '1 day',
    ARRAY['guia','tutorial','portal','como-usar'],
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (slug) DO NOTHING;

-- =========================================================
-- EVENTOS INSTITUCIONAIS
-- =========================================================
INSERT INTO evento_institucional (titulo, descricao, data_inicio, data_fim, local, publico, criado_em, atualizado_em)
VALUES
  (
    'Semana de Tecnologia e Inovação 2026',
    'Palestras, workshops e hackathon com especialistas do mercado. Programação completa no site do evento.',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '32 days',
    'Campus Central — Auditório Principal',
    TRUE, NOW(), NOW()
  ),
  (
    'Feira de Ciências Inovatech 2026',
    'Apresentação de projetos dos alunos em diversas categorias. Premiação para os 3 primeiros colocados.',
    '2026-08-15 08:00:00',
    '2026-08-16 18:00:00',
    'Campus Central — Pavilhão de Eventos',
    TRUE, NOW(), NOW()
  ),
  (
    'Cerimônia de Colação de Grau — 1º Semestre 2026',
    'Cerimônia de formatura dos alunos concluintes do primeiro semestre de 2026.',
    '2026-07-05 19:00:00',
    '2026-07-05 22:00:00',
    'Teatro Municipal — Rua das Acácias, 123',
    TRUE, NOW(), NOW()
  )
;
