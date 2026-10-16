-- Integridade referencial: todo item deve apontar para um pedido E um produto existentes.
SELECT i.id AS item_id, i.order_id, i.product_id
FROM order_items i
LEFT JOIN orders   o ON o.id = i.order_id
LEFT JOIN products p ON p.id = i.product_id
WHERE o.id IS NULL OR p.id IS NULL
ORDER BY i.id;
