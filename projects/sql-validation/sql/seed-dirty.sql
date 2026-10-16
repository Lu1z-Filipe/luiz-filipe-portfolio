-- Conjunto sintético com defeitos PLANTADOS. Cada defeito é esperado por uma verificação específica
-- (ver tests/checks.test.js e o README, que mapeia defeito → consulta → resultado esperado).
INSERT INTO customers VALUES
  (1, 'Ana Lima',    'ana@example.com'),
  (2, 'Bruno Alves', 'bruno@example.com'),
  (3, 'Ana L.',      'ana@example.com'),   -- e-mail duplicado de #1            -> 01
  (4, NULL,          'sem-nome@example.com'), -- nome ausente                   -> 02
  (5, '   ',         'branco@example.com'),   -- nome em branco                 -> 02
  (6, 'Carla Dias',  NULL);                   -- e-mail ausente                 -> 02

INSERT INTO products VALUES (1, 'KB-001', 250), (2, 'MS-001', 80);

INSERT INTO orders VALUES
  (100, 1,  'PAID',      410),  -- consistente
  (101, 2,  'CREATED',    80),  -- consistente
  (102, 99, 'PAID',      160),  -- cliente 99 não existe                         -> 03
  (103, 1,  'PAID',      999),  -- total diverge da soma dos itens (esperado 250) -> 05
  (104, 2,  'ENVIADO',    80),  -- status fora do domínio                         -> 07
  (105, 1,  'CREATED',     0);  -- pedido sem itens                              -> 08

INSERT INTO order_items VALUES
  (1,  100, 1, 1, 250),
  (2,  100, 2, 2, 80),
  (3,  101, 2, 1, 80),
  (4,  102, 2, 2, 80),
  (5,  103, 1, 1, 250),
  (6,  104, 2, 1, 80),
  (7,  777, 1, 1, 250),  -- pedido 777 não existe                                -> 04
  (8,  100, 55, 1, 0),   -- produto 55 não existe (preço 0 p/ não afetar o total) -> 04
  (9,  101, 2, 0, 80),   -- quantidade zero                                     -> 06
  (10, 101, 2, -3, 80);  -- quantidade negativa                                 -> 06
