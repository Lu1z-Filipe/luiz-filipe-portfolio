-- Regra: status pertence ao domínio {CREATED, PAID, SHIPPED, CANCELLED}.
SELECT id AS order_id, status
FROM orders
WHERE status IS NULL OR status NOT IN ('CREATED', 'PAID', 'SHIPPED', 'CANCELLED')
ORDER BY id;
