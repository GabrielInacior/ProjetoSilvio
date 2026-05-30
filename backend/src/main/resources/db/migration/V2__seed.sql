-- V2: Seed de dados iniciais do Inovatech
-- Senha padrão: Inovatech@2026 (BCrypt strength 12)
-- Hash gerado externamente e inserido aqui diretamente.
-- $2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K = "Inovatech@2026"

-- -------------------------------------------------------
-- USUÁRIOS BASE
-- -------------------------------------------------------
INSERT INTO usuario (nome, email, senha_hash, tipo, ativo, senha_provisoria) VALUES
('Administrador Inovatech', 'admin@inovatech.edu',      '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'ADMIN',    TRUE, FALSE),
('Prof. Carlos Andrade',   'carlos@inovatech.edu',     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'PROFESSOR', TRUE, FALSE),
('Prof. Ana Lima',         'ana@inovatech.edu',        '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'PROFESSOR', TRUE, FALSE),
('Prof. Ricardo Souza',   'ricardo@inovatech.edu',    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'PROFESSOR', TRUE, FALSE),
('João Silva',            'joao@aluno.inovatech.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'ALUNO',    TRUE, FALSE),
('Maria Oliveira',        'maria@aluno.inovatech.edu','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'ALUNO',    TRUE, FALSE),
('Pedro Costa',           'pedro@aluno.inovatech.edu','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'ALUNO',    TRUE, FALSE),
('Fernanda Rocha',        'fernanda@aluno.inovatech.edu','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'ALUNO', TRUE, FALSE),
('Lucas Martins',         'lucas@aluno.inovatech.edu','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj1o1jbzSU4K', 'ALUNO',    TRUE, FALSE);

-- -------------------------------------------------------
-- PROFESSORES
-- -------------------------------------------------------
INSERT INTO professor (usuario_id, siape, cpf, titulacao, telefone) VALUES
((SELECT id FROM usuario WHERE email = 'carlos@inovatech.edu'),   'SIAPE001', '111.222.333-01', 'MESTRADO',    '(17) 99999-0001'),
((SELECT id FROM usuario WHERE email = 'ana@inovatech.edu'),      'SIAPE002', '111.222.333-02', 'DOUTORADO',   '(17) 99999-0002'),
((SELECT id FROM usuario WHERE email = 'ricardo@inovatech.edu'),  'SIAPE003', '111.222.333-03', 'ESPECIALIZACAO', '(17) 99999-0003');

-- -------------------------------------------------------
-- CURSOS
-- -------------------------------------------------------
INSERT INTO curso (nome, slug, codigo, duracao_semestres, descricao, coordenador_id) VALUES
('Análise e Desenvolvimento de Sistemas', 'analise-e-desenvolvimento-de-sistemas', 'TADS', 6,
 'Curso tecnológico focado no desenvolvimento de software, abrangendo programação, banco de dados, engenharia de software e gestão de projetos.',
 (SELECT id FROM professor WHERE siape = 'SIAPE001')),
('Gestão Empresarial', 'gestao-empresarial', 'GE', 6,
 'Curso tecnológico voltado à formação de profissionais aptos a gerir e empreender em organizações públicas e privadas.',
 (SELECT id FROM professor WHERE siape = 'SIAPE002')),
('Sistemas para Internet', 'sistemas-para-internet', 'SI', 6,
 'Curso focado em desenvolvimento web, mobile e sistemas distribuídos para a internet.',
 (SELECT id FROM professor WHERE siape = 'SIAPE003'));

-- -------------------------------------------------------
-- DISCIPLINAS
-- -------------------------------------------------------
INSERT INTO disciplina (nome, codigo, carga_horaria, ementa, semestre_sugerido) VALUES
('Algoritmos e Programação',           'ALG001', 80, 'Lógica de programação, estruturas de controle, funções e introdução a linguagens de programação.', 1),
('Banco de Dados I',                   'BD001',  80, 'Modelagem de dados relacional, SQL básico, normalização.', 2),
('Engenharia de Software',             'ES001',  60, 'Ciclo de vida de software, metodologias ágeis, UML.', 3),
('Programação Orientada a Objetos',    'POO001', 80, 'Paradigma OO, classes, herança, polimorfismo, interfaces.', 2),
('Desenvolvimento Web Front-End',      'WEB001', 60, 'HTML5, CSS3, JavaScript, frameworks modernos.', 3),
('Desenvolvimento Web Back-End',       'WEB002', 60, 'APIs REST, servidores web, integração com banco de dados.', 4),
('Estrutura de Dados',                 'ED001',  60, 'Listas, filas, pilhas, árvores, grafos e algoritmos.', 3),
('Banco de Dados II',                  'BD002',  60, 'Banco de dados NoSQL, transações, otimização de queries.', 4),
('Gestão de Projetos',                 'GP001',  60, 'Planejamento, controle e entrega de projetos de software.', 5),
('Segurança da Informação',            'SEG001', 60, 'Criptografia, autenticação, boas práticas de segurança.', 5),
('Cálculo',                            'CAL001', 80, 'Limites, derivadas, integrais e aplicações.', 1),
('Matemática Discreta',                'MD001',  60, 'Lógica proposicional, teoria dos conjuntos, grafos.', 2),
('Administração Geral',                'ADM001', 60, 'Princípios de administração, planejamento estratégico.', 1),
('Marketing Digital',                  'MKT001', 60, 'Estratégias de marketing digital, SEO, redes sociais.', 3),
('Direito Empresarial',                'DIR001', 60, 'Legislação empresarial, contratos, propriedade intelectual.', 4);

-- -------------------------------------------------------
-- VÍNCULOS CURSO × DISCIPLINA
-- -------------------------------------------------------
-- TADS
INSERT INTO curso_disciplina (curso_id, disciplina_id, obrigatoria) VALUES
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='ALG001'), TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='BD001'),  TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='ES001'),  TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='POO001'), TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='WEB001'), TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='WEB002'), TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='ED001'),  TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='BD002'),  TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='GP001'),  TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='SEG001'), TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='CAL001'), TRUE),
((SELECT id FROM curso WHERE codigo='TADS'), (SELECT id FROM disciplina WHERE codigo='MD001'),  TRUE);

-- GE
INSERT INTO curso_disciplina (curso_id, disciplina_id, obrigatoria) VALUES
((SELECT id FROM curso WHERE codigo='GE'), (SELECT id FROM disciplina WHERE codigo='ADM001'), TRUE),
((SELECT id FROM curso WHERE codigo='GE'), (SELECT id FROM disciplina WHERE codigo='MKT001'), TRUE),
((SELECT id FROM curso WHERE codigo='GE'), (SELECT id FROM disciplina WHERE codigo='DIR001'), TRUE),
((SELECT id FROM curso WHERE codigo='GE'), (SELECT id FROM disciplina WHERE codigo='GP001'),  TRUE);

-- SI
INSERT INTO curso_disciplina (curso_id, disciplina_id, obrigatoria) VALUES
((SELECT id FROM curso WHERE codigo='SI'), (SELECT id FROM disciplina WHERE codigo='ALG001'), TRUE),
((SELECT id FROM curso WHERE codigo='SI'), (SELECT id FROM disciplina WHERE codigo='WEB001'), TRUE),
((SELECT id FROM curso WHERE codigo='SI'), (SELECT id FROM disciplina WHERE codigo='WEB002'), TRUE),
((SELECT id FROM curso WHERE codigo='SI'), (SELECT id FROM disciplina WHERE codigo='BD001'),  TRUE),
((SELECT id FROM curso WHERE codigo='SI'), (SELECT id FROM disciplina WHERE codigo='SEG001'), TRUE);

-- -------------------------------------------------------
-- ALUNOS
-- -------------------------------------------------------
INSERT INTO aluno (usuario_id, ra, cpf, data_nascimento, telefone, curso_id, semestre_ingresso, status) VALUES
((SELECT id FROM usuario WHERE email='joao@aluno.inovatech.edu'),     '2024001', '222.333.444-01', '2002-05-15', '(17) 99001-0001',
 (SELECT id FROM curso WHERE codigo='TADS'), '2024.1', 'ATIVO'),
((SELECT id FROM usuario WHERE email='maria@aluno.inovatech.edu'),    '2024002', '222.333.444-02', '2003-08-22', '(17) 99001-0002',
 (SELECT id FROM curso WHERE codigo='TADS'), '2024.1', 'ATIVO'),
((SELECT id FROM usuario WHERE email='pedro@aluno.inovatech.edu'),    '2024003', '222.333.444-03', '2001-11-10', '(17) 99001-0003',
 (SELECT id FROM curso WHERE codigo='GE'),   '2024.1', 'ATIVO'),
((SELECT id FROM usuario WHERE email='fernanda@aluno.inovatech.edu'), '2025001', '222.333.444-04', '2004-01-30', '(17) 99001-0004',
 (SELECT id FROM curso WHERE codigo='SI'),   '2025.1', 'ATIVO'),
((SELECT id FROM usuario WHERE email='lucas@aluno.inovatech.edu'),    '2025002', '222.333.444-05', '2003-07-19', '(17) 99001-0005',
 (SELECT id FROM curso WHERE codigo='TADS'), '2025.1', 'ATIVO');

-- -------------------------------------------------------
-- TURMAS (semestre 2026.1)
-- -------------------------------------------------------
INSERT INTO turma (disciplina_id, professor_id, ano, semestre, sala, vagas, dia_semana, hora_inicio, hora_fim, data_inicio, data_fim, status) VALUES
((SELECT id FROM disciplina WHERE codigo='ALG001'), (SELECT id FROM professor WHERE siape='SIAPE001'), 2026, 'PRIMEIRO', 'Lab 01', 40, 'SEG', '19:00', '22:30', '2026-02-10', '2026-06-30', 'ATIVA'),
((SELECT id FROM disciplina WHERE codigo='POO001'), (SELECT id FROM professor WHERE siape='SIAPE001'), 2026, 'PRIMEIRO', 'Lab 02', 40, 'QUA', '19:00', '22:30', '2026-02-10', '2026-06-30', 'ATIVA'),
((SELECT id FROM disciplina WHERE codigo='WEB001'), (SELECT id FROM professor WHERE siape='SIAPE002'), 2026, 'PRIMEIRO', 'Lab 03', 35, 'TER', '19:00', '22:30', '2026-02-10', '2026-06-30', 'ATIVA'),
((SELECT id FROM disciplina WHERE codigo='BD001'),  (SELECT id FROM professor WHERE siape='SIAPE003'), 2026, 'PRIMEIRO', 'Lab 04', 40, 'QUI', '19:00', '22:30', '2026-02-10', '2026-06-30', 'ATIVA'),
((SELECT id FROM disciplina WHERE codigo='ADM001'), (SELECT id FROM professor WHERE siape='SIAPE002'), 2026, 'PRIMEIRO', 'Sala 10', 40, 'SEG', '19:00', '22:30', '2026-02-10', '2026-06-30', 'ATIVA'),
((SELECT id FROM disciplina WHERE codigo='MKT001'), (SELECT id FROM professor WHERE siape='SIAPE002'), 2026, 'PRIMEIRO', 'Sala 11', 35, 'QUA', '19:00', '22:30', '2026-02-10', '2026-06-30', 'ATIVA');

-- -------------------------------------------------------
-- MATRÍCULAS DEMO
-- -------------------------------------------------------
INSERT INTO matricula (aluno_id, turma_id, status) VALUES
((SELECT id FROM aluno WHERE ra='2024001'), (SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='ALG001') AND ano=2026), 'ATIVA'),
((SELECT id FROM aluno WHERE ra='2024001'), (SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='POO001') AND ano=2026), 'ATIVA'),
((SELECT id FROM aluno WHERE ra='2024002'), (SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='ALG001') AND ano=2026), 'ATIVA'),
((SELECT id FROM aluno WHERE ra='2024002'), (SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='WEB001') AND ano=2026), 'ATIVA'),
((SELECT id FROM aluno WHERE ra='2024003'), (SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='ADM001') AND ano=2026), 'ATIVA'),
((SELECT id FROM aluno WHERE ra='2025002'), (SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='ALG001') AND ano=2026), 'ATIVA');

-- -------------------------------------------------------
-- AULAS DEMO
-- -------------------------------------------------------
INSERT INTO aula (turma_id, data, hora_inicio, hora_fim, tema, status) VALUES
((SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='ALG001') AND ano=2026), '2026-06-02', '19:00', '22:30', 'Introdução a Algoritmos', 'AGENDADA'),
((SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='ALG001') AND ano=2026), '2026-06-09', '19:00', '22:30', 'Estruturas de Decisão', 'AGENDADA'),
((SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='POO001') AND ano=2026), '2026-06-03', '19:00', '22:30', 'Classes e Objetos em Java', 'AGENDADA'),
((SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='WEB001') AND ano=2026), '2026-06-04', '19:00', '22:30', 'Introdução ao React', 'AGENDADA'),
((SELECT id FROM turma WHERE disciplina_id=(SELECT id FROM disciplina WHERE codigo='BD001') AND ano=2026),  '2026-06-05', '19:00', '22:30', 'SQL: SELECT e JOIN', 'AGENDADA');

-- -------------------------------------------------------
-- NOTAS DEMO
-- -------------------------------------------------------
INSERT INTO nota (matricula_id, tipo, valor, peso, descricao, data_avaliacao) VALUES
((SELECT m.id FROM matricula m JOIN aluno a ON m.aluno_id=a.id JOIN turma t ON m.turma_id=t.id JOIN disciplina d ON t.disciplina_id=d.id WHERE a.ra='2024001' AND d.codigo='ALG001'), 'P1', 8.50, 1.00, 'Prova 1 - Lógica', '2026-04-15'),
((SELECT m.id FROM matricula m JOIN aluno a ON m.aluno_id=a.id JOIN turma t ON m.turma_id=t.id JOIN disciplina d ON t.disciplina_id=d.id WHERE a.ra='2024001' AND d.codigo='POO001'), 'P1', 7.00, 1.00, 'Prova 1 - OOP', '2026-04-16');

-- -------------------------------------------------------
-- POSTS (BLOG)
-- -------------------------------------------------------
INSERT INTO post (titulo, slug, resumo, conteudo_md, imagem_capa, autor, publicado_em, tags) VALUES
('Inovatech promove Feira de Inovação e Tecnologia 2026',
 'inovatech-promove-feira-de-inovacao-e-tecnologia-2026',
 'A Faculdade Inovatech realizou sua 5ª edição da Feira de Inovação, reunindo mais de 200 projetos de alunos dos cursos de TADS, Gestão Empresarial e Sistemas para Internet.',
 E'# Inovatech promove Feira de Inovação e Tecnologia 2026\n\nA 5ª edição da Feira de Inovação e Tecnologia da Faculdade Inovatech foi um sucesso!\n\nMais de **200 projetos** foram apresentados por alunos dos três cursos oferecidos pela instituição.\n\n## Destaques\n\n- Projeto de sistema de monitoramento agrícola com IoT\n- Plataforma de ensino personalizado com IA\n- Sistema de gestão para pequenas empresas\n\nParabéns a todos os alunos e professores envolvidos!\n\n> "A inovação é o motor do progresso" — Prof. Carlos Andrade\n\n## Próxima Edição\n\nA próxima edição está confirmada para **Novembro de 2026**. Fique atento!',
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
 'Equipe Inovatech', NOW() - INTERVAL '2 days', ARRAY['eventos', 'inovação', 'tecnologia']),

('Novos laboratórios de informática são inaugurados',
 'novos-laboratorios-de-informatica-inaugurados',
 'A Inovatech inaugurou dois novos laboratórios equipados com computadores de última geração para atender melhor os alunos dos cursos de tecnologia.',
 E'# Novos Laboratórios de Informática Inaugurados\n\nA Faculdade Inovatech investiu em infraestrutura e inaugurou **dois novos laboratórios** de informática!\n\n## Equipamentos\n\n- 40 computadores com processadores Intel Core i7 de 13ª geração\n- 16GB de RAM por máquina\n- SSDs de 512GB\n- Monitores Full HD 24"\n\n## Softwares Disponíveis\n\nTodos os computadores vêm com:\n- Sistema operacional Windows 11 e Ubuntu 22.04\n- Ferramentas de desenvolvimento (VS Code, IntelliJ, MySQL Workbench)\n- Suite de escritório\n\nOs laboratórios estão disponíveis para uso pelos alunos de segunda a sábado, das 7h às 22h.',
 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
 'Direção Acadêmica', NOW() - INTERVAL '5 days', ARRAY['infraestrutura', 'laboratório']),

('Alunos de TADS vencem hackathon regional',
 'alunos-tads-vencem-hackathon-regional-2026',
 'Equipe formada por alunos do 4º semestre de TADS conquistou o primeiro lugar no Hackathon Regional de Tecnologia com solução inovadora para saúde pública.',
 E'# Alunos de TADS Vencem Hackathon Regional!\n\nParabéns à equipe **CodeStorm** formada por alunos do curso de Análise e Desenvolvimento de Sistemas!\n\n## O Projeto\n\nO grupo desenvolveu uma solução de **triagem inteligente** para postos de saúde, utilizando:\n\n- Machine Learning para priorização de atendimentos\n- App mobile para agendamentos\n- Dashboard em tempo real para gestores\n\n## Premiação\n\nA equipe recebeu um prêmio de R$ 5.000,00 e convite para apresentar o projeto em São Paulo.\n\n## Membros da Equipe\n\n- João Silva (4º semestre)\n- Maria Oliveira (4º semestre)\n- Lucas Martins (3º semestre)\n\nEssa conquista mostra a qualidade do ensino da Inovatech! 🏆',
 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
 'Coordenação de TADS', NOW() - INTERVAL '10 days', ARRAY['destaque', 'TADS', 'hackathon', 'premiação']),

('Período de matrículas 2026.2 começa em julho',
 'periodo-matriculas-2026-2',
 'A Faculdade Inovatech abre as matrículas para o segundo semestre de 2026 a partir do dia 1º de julho. Confira as instruções e os prazos.',
 E'# Matrículas 2026.2\n\nAtenção, alunos! O período de matrículas para o **segundo semestre de 2026** está se aproximando.\n\n## Datas Importantes\n\n| Evento | Data |\n|--------|------|\n| Abertura das matrículas | 01/07/2026 |\n| Prazo para renovação | 15/07/2026 |\n| Início das aulas | 28/07/2026 |\n| Trancamento sem ônus | até 15/08/2026 |\n\n## Como Se Matricular\n\n1. Acesse o **Sistema Acadêmico** com seu login\n2. Clique em "Matrícula" no menu lateral\n3. Selecione as disciplinas desejadas\n4. Confirme e aguarde a mensagem de sucesso\n\n## Dúvidas?\n\nEntre em contato com a secretaria: secretaria@inovatech.edu',
 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800',
 'Secretaria Acadêmica', NOW() - INTERVAL '15 days', ARRAY['matrícula', 'calendário', 'avisos']),

('Semana de Palestras com profissionais do mercado',
 'semana-palestras-profissionais-mercado-2026',
 'Durante a primeira semana de junho, a Inovatech recebe profissionais de empresas como Google, Nubank e Embrapa para palestras abertas à comunidade.',
 E'# Semana de Palestras 2026\n\nA Faculdade Inovatech realizará sua tradicional **Semana de Palestras** com convidados de destaque do mercado!\n\n## Programação\n\n### Segunda-feira, 01/06\n**"Carreira em Cloud Computing"** — Eng. Rafael Torres (Google)\n🕡 19h00 | Auditório Principal\n\n### Terça-feira, 02/06\n**"Startups e Inovação Financeira"** — Dra. Camila Reis (Nubank)\n🕡 19h30 | Auditório Principal\n\n### Quinta-feira, 04/06\n**"Tecnologia no Agronegócio"** — Dr. Marcos Alves (Embrapa)\n🕡 19h00 | Auditório Principal\n\n## Inscrições\n\nAs palestras são **gratuitas** e abertas ao público. Inscreva-se pelo link no portal!\n\n**Vagas limitadas!**',
 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
 'Coordenação de Extensão', NOW() - INTERVAL '3 days', ARRAY['palestras', 'eventos', 'mercado']),

('Projeto de extensão leva tecnologia a escolas públicas',
 'projeto-extensao-tecnologia-escolas-publicas',
 'Alunos e professores da Inovatech desenvolvem ações de inclusão digital em 5 escolas da rede pública de Jales e região.',
 E'# Tecnologia nas Escolas Públicas\n\nO projeto de extensão **"Inovatech na Escola"** chegou à sua segunda edição com grande impacto na comunidade.\n\n## Sobre o Projeto\n\nAlunos e professores voluntários da Inovatech visitam escolas públicas para:\n\n- Oficinas de programação para iniciantes\n- Introdução ao pensamento computacional\n- Cursos de informática básica para professores\n- Desenvolvimento de sites institucionais\n\n## Impacto\n\n- **5 escolas** atendidas\n- **320 alunos** do ensino médio beneficiados\n- **18 professores** participantes da Inovatech\n\n## Como Participar\n\nAlunos interessados em ser voluntários podem se inscrever pelo sistema acadêmico na aba "Extensão".',
 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
 'Coordenação de Extensão', NOW() - INTERVAL '20 days', ARRAY['extensão', 'comunidade', 'inclusão digital']);

-- -------------------------------------------------------
-- PRODUTOS DA LOJA
-- -------------------------------------------------------
INSERT INTO produto (nome, slug, descricao, preco, estoque, imagem_url, categoria, ativo) VALUES
('Camiseta Inovatech',          'camiseta-inovatech',        'Camiseta 100% algodão com logo bordado da Inovatech. Disponível em branco e azul.',              49.90, 50, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'VESTUARIO',  TRUE),
('Moletom Inovatech',           'moletom-inovatech',         'Moletom fechado com capuz, bordado com logo Inovatech. Qualidade premium.',                        129.90, 30, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'VESTUARIO',  TRUE),
('Caneca Inovatech 400ml',      'caneca-inovatech',          'Caneca de cerâmica com estampa exclusiva Inovatech. Ideal para o café entre aulas.',                34.90, 80, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', 'ACESSORIOS', TRUE),
('Boné Inovatech',              'bone-inovatech',            'Boné trucker com logo Inovatech bordado. Regulagem traseira.',                                       39.90, 40, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', 'VESTUARIO',  TRUE),
('Mochila Inovatech',           'mochila-inovatech',         'Mochila resistente com bolso para notebook 15", logo Inovatech. Compartimento para garrafa.',      149.90, 25, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'ACESSORIOS', TRUE),
('Caderno Universitário 10x1',  'caderno-universitario',     'Caderno universitário 10 matérias, 200 folhas, capa Inovatech.',                                     29.90, 100, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 'MATERIAL',   TRUE),
('Caneta Esferográfica Kit 3x', 'caneta-esferografica-kit',  'Kit com 3 canetas esferográficas Inovatech (azul, preto, vermelho).',                                 9.90, 150, 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400', 'MATERIAL',   TRUE),
('Jaqueta Inovatech Tech',      'jaqueta-inovatech-tech',    'Jaqueta corta-vento impermeável com logo Inovatech. Ideal para os dias frios.',                    199.90, 20, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', 'VESTUARIO',  TRUE),
('Squeeze Inovatech 700ml',     'squeeze-inovatech',         'Squeeze de alumínio com logotipo Inovatech. Mantém a bebida gelada por 12h.',                        44.90, 60, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 'ACESSORIOS', TRUE),
('Agenda 2026 Inovatech',       'agenda-2026-inovatech',     'Agenda datada 2026 com capa dura, layout semanal, marca-páginas e bolso interno.',                  39.90, 45, 'https://images.unsplash.com/photo-1574952494350-9e6b94b43b81?w=400', 'MATERIAL',   TRUE),
('Mouse Pad Inovatech XL',      'mouse-pad-inovatech-xl',    'Mouse pad extra grande 80x40cm com design exclusivo Inovatech. Base antiderrapante.',               49.90, 35, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', 'ACESSORIOS', TRUE),
('Livro: Clean Code (PT-BR)',   'livro-clean-code-ptbr',     'O clássico Clean Code de Robert C. Martin, edição em português. Essencial para programadores.',    89.90, 15, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'LIVROS',     TRUE);

-- -------------------------------------------------------
-- EVENTOS INSTITUCIONAIS
-- -------------------------------------------------------
INSERT INTO evento_institucional (titulo, descricao, data_inicio, data_fim, local, publico, criado_por) VALUES
('Semana de Palestras 2026',    'Palestras com profissionais de empresas de tecnologia e negócios.', '2026-06-01 19:00', '2026-06-05 22:00', 'Auditório Principal', TRUE, (SELECT id FROM usuario WHERE email='admin@inovatech.edu')),
('Colação de Grau - TADS 2026.1', 'Cerimônia de formatura dos alunos concluintes do 1º semestre de 2026.', '2026-07-15 19:00', '2026-07-15 22:00', 'Ginásio Poliesportivo', TRUE, (SELECT id FROM usuario WHERE email='admin@inovatech.edu')),
('Hackathon Inovatech 2026',    '48 horas de desenvolvimento e inovação. Inscrições abertas!', '2026-08-22 08:00', '2026-08-24 18:00', 'Laboratórios de Informática', TRUE, (SELECT id FROM usuario WHERE email='admin@inovatech.edu')),
('Avaliações P2 - 2026.1',      'Período de aplicação das segundas provas do semestre.', '2026-06-16 19:00', '2026-06-27 22:00', 'Salas de Aula', FALSE, (SELECT id FROM usuario WHERE email='admin@inovatech.edu'));
