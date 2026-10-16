-- Regra: o e-mail identifica o cliente e não pode se repetir (comparação sem diferenciar maiúsculas).
-- Retorna: um registro por cliente envolvido em duplicidade.
SELECT c.id AS customer_id, c.email
FROM customers c
WHERE c.email IS NOT NULL
  AND LOWER(TRIM(c.email)) IN (
    SELECT LOWER(TRIM(email))
    FROM customers
    WHERE email IS NOT NULL
    GROUP BY LOWER(TRIM(email))
    HAVING COUNT(*) > 1
  )
ORDER BY c.id;
