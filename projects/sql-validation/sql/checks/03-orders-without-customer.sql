-- Integridade referencial: todo pedido deve apontar para um cliente existente.
SELECT o.id AS order_id, o.customer_id
FROM orders o
LEFT JOIN customers c ON c.id = o.customer_id
WHERE c.id IS NULL
ORDER BY o.id;
