-- Regra de consistência: orders.total deve ser igual à soma de quantidade x preço unitário dos itens.
-- Itens com quantidade inválida (<= 0) são tratados na verificação 06 e ignorados aqui,
-- para que um defeito não gere falso positivo em outra verificação.
SELECT o.id AS order_id, o.total AS declared_total, SUM(i.quantity * i.unit_price) AS items_total
FROM orders o
JOIN order_items i ON i.order_id = o.id AND i.quantity > 0
GROUP BY o.id, o.total
HAVING ROUND(o.total, 2) <> ROUND(SUM(i.quantity * i.unit_price), 2)
ORDER BY o.id;
