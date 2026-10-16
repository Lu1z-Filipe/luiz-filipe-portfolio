-- Regra: nome e e-mail são obrigatórios (nulos e textos em branco são violações).
SELECT id AS customer_id
FROM customers
WHERE name IS NULL OR TRIM(name) = ''
   OR email IS NULL OR TRIM(email) = ''
ORDER BY id;
