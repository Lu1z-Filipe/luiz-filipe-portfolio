-- Esquema propositalmente permissivo: simula uma base legada/migrada em que as
-- regras de integridade NÃO são garantidas pelo banco. É exatamente por isso que
-- as consultas em sql/checks/ existem — elas detectam o que as constraints não impedem.

CREATE TABLE customers (
  id    INTEGER PRIMARY KEY,
  name  TEXT,
  email TEXT
);

CREATE TABLE products (
  id    INTEGER PRIMARY KEY,
  sku   TEXT,
  price REAL
);

CREATE TABLE orders (
  id          INTEGER PRIMARY KEY,
  customer_id INTEGER,
  status      TEXT,
  total       REAL
);

CREATE TABLE order_items (
  id         INTEGER PRIMARY KEY,
  order_id   INTEGER,
  product_id INTEGER,
  quantity   INTEGER,
  unit_price REAL
);
