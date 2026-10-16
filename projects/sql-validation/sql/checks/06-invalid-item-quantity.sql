-- Regra: quantidade do item deve ser um inteiro positivo.
SELECT id AS item_id, order_id, quantity
FROM order_items
WHERE quantity IS NULL OR quantity <= 0
ORDER BY id;
