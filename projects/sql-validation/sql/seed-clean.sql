-- Conjunto sintético CONSISTENTE: nenhuma verificação deve retornar linhas.
INSERT INTO customers VALUES (1, 'Ana Lima', 'ana@example.com'), (2, 'Bruno Alves', 'bruno@example.com');
INSERT INTO products VALUES (1, 'KB-001', 250), (2, 'MS-001', 80);
INSERT INTO orders VALUES (100, 1, 'PAID', 410), (101, 2, 'CREATED', 80);
INSERT INTO order_items VALUES
  (1, 100, 1, 1, 250),
  (2, 100, 2, 2, 80),
  (3, 101, 2, 1, 80);
