# Estudo 3 — Validação de dados com SQL

> Estudo técnico pessoal. Banco SQLite em memória e dados 100% sintéticos.

## Objetivo
Detectar inconsistências que um banco **sem constraints** (cenário típico de base legada ou migração) não impede.

## Arquitetura
- `sql/schema.sql` — esquema propositalmente permissivo (clientes, produtos, pedidos, itens).
- `sql/seed-clean.sql` — dados consistentes: nenhuma verificação pode retornar linhas.
- `sql/seed-dirty.sql` — dados com **defeitos plantados**, cada um comentado com a verificação que deve detectá-lo.
- `sql/checks/NN-*.sql` — uma consulta por regra, cada uma com a regra no comentário inicial.
- `tests/checks.test.js` — `node:test` + `node:sqlite`: cada verificação roda nos dois conjuntos.

## Verificações e resultado esperado no conjunto com defeitos

| # | Regra | Retorno esperado |
|---|---|---|
| 01 | E-mail de cliente duplicado | clientes 1 e 3 |
| 02 | Nome/e-mail obrigatório (nulo ou em branco) | clientes 4, 5, 6 |
| 03 | Pedido sem cliente existente | pedido 102 |
| 04 | Item sem pedido ou sem produto existente | itens 7 e 8 |
| 05 | `orders.total` ≠ soma dos itens | pedido 103 (declarado 999, calculado 250) |
| 06 | Quantidade ≤ 0 | itens 9 e 10 |
| 07 | Status fora do domínio | pedido 104 |
| 08 | Pedido sem itens (exceto cancelado) | pedido 105 |

A verificação 05 ignora itens com quantidade inválida para não gerar falso positivo de outro defeito (já coberto pela 06).

## Executar
```bash
npm install
npm run test:sql
```
Para rodar uma consulta isoladamente, carregue `schema.sql` + um seed em qualquer cliente SQLite e execute o arquivo de `sql/checks/`.

## Resultado esperado
18 testes passando. Em 16/10/2026 a execução local passou 18/18.
