import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const sqlDir = join(fileURLToPath(new URL('..', import.meta.url)), 'sql');
const read = (...p) => readFileSync(join(sqlDir, ...p), 'utf8');

function buildDb(seedFile) {
  const db = new DatabaseSync(':memory:');
  db.exec(read('schema.sql'));
  db.exec(read(seedFile));
  return db;
}
const runCheck = (db, file) => db.prepare(read('checks', file)).all();

// verificação -> valores esperados da coluna-chave no dataset com defeitos
const expectedOnDirty = {
  '01-duplicate-customer-emails.sql': { key: 'customer_id', ids: [1, 3] },
  '02-customers-missing-required.sql': { key: 'customer_id', ids: [4, 5, 6] },
  '03-orders-without-customer.sql': { key: 'order_id', ids: [102] },
  '04-orphan-order-items.sql': { key: 'item_id', ids: [7, 8] },
  '05-order-total-mismatch.sql': { key: 'order_id', ids: [103] },
  '06-invalid-item-quantity.sql': { key: 'item_id', ids: [9, 10] },
  '07-invalid-order-status.sql': { key: 'order_id', ids: [104] },
  '08-orders-without-items.sql': { key: 'order_id', ids: [105] },
};

const checkFiles = readdirSync(join(sqlDir, 'checks')).filter((f) => f.endsWith('.sql')).sort();

test('todas as verificações têm resultado esperado declarado', () => {
  assert.deepEqual(checkFiles, Object.keys(expectedOnDirty).sort());
});

for (const file of checkFiles) {
  test(`${file}: dataset limpo não retorna violações`, () => {
    assert.deepEqual(runCheck(buildDb('seed-clean.sql'), file), []);
  });

  test(`${file}: dataset com defeitos retorna exatamente os registros plantados`, () => {
    const { key, ids } = expectedOnDirty[file];
    const rows = runCheck(buildDb('seed-dirty.sql'), file);
    assert.deepEqual(rows.map((r) => r[key]), ids);
  });
}

test('verificação 05 expõe o total declarado e o total calculado do pedido divergente', () => {
  const [row] = runCheck(buildDb('seed-dirty.sql'), '05-order-total-mismatch.sql');
  assert.equal(row.declared_total, 999);
  assert.equal(row.items_total, 250);
});
