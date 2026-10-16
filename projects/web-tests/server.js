// Servidor estático mínimo para a aplicação de demonstração (sem dependências).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), 'app');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };
const port = Number(process.env.PORT ?? 3200);

http
  .createServer(async (req, res) => {
    const { pathname } = new URL(req.url, 'http://localhost');
    const rel = normalize(pathname === '/' ? '/index.html' : pathname);
    if (rel.includes('..')) return res.writeHead(400).end();
    try {
      const data = await readFile(join(root, rel));
      res.writeHead(200, { 'Content-Type': types[extname(rel)] ?? 'application/octet-stream' }).end(data);
    } catch {
      res.writeHead(404).end('Not found');
    }
  })
  .listen(port, () => console.log(`Loja Demo (web) em http://localhost:${port}`));
