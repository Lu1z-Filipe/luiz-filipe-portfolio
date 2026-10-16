-- Regra: pedido sem nenhum item não deve existir (exceto CANCELLED).
SELECT o.id AS order_id, o.status
FROM orders o
WHERE o.status <> 'CANCELLED'
  AND NOT EXISTS (SELECT 1 FROM order_items i WHERE i.order_id = o.id)
ORDER BY o.id;
