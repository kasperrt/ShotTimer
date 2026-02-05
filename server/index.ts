import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { joinHandler } from './handlers/join.js';
import { sseHandler } from './handlers/sse.js';

dotenv.config({ quiet: true });

const CORS = (process.env.CORS ?? process.env.VITE_CORS ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const app = new Hono();

app.use(
  '/join/*',
  cors({
    origin: CORS,
  }),
);

app.use(
  '/rtd',
  cors({
    origin: CORS,
  }),
);

app.post('/join/:id', joinHandler);
app.get('/rtd', sseHandler);

const distDir = join(process.cwd(), 'dist');
const distIndex = join(distDir, 'index.html');
const hasDist = existsSync(distIndex);

if (hasDist) {
  app.use('/*', serveStatic({ root: 'dist' }));
  app.get('/*', serveStatic({ path: 'dist/index.html' }));
}

const parsedPort = Number.parseInt(process.env.PORT ?? '', 10);
const port = Number.isFinite(parsedPort) ? parsedPort : 8080;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  },
);
