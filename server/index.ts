import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import client from 'prom-client';
import { joinHandler } from './handlers/join.js';
import { sseHandler } from './handlers/sse.js';

dotenv.config({ quiet: true });

const CORS = (process.env.CORS ?? process.env.VITE_CORS ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const app = new Hono();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const buckets = [
  0.005,
  0.01,
  0.025,
  0.05,
  0.075,
  0.1,
  0.25,
  0.5,
  0.75,
  1,
  2.5,
  5,
  7.5,
  10,
];
const requestStatus = new client.Counter({
  name: 'http_request_status_code',
  help: 'Status codes returned by the app.',
  labelNames: ['status_code', 'operation_name'],
  registers: [register],
});
const requestDuration = new client.Histogram({
  name: 'http_request_duration',
  help: 'Time spent processing requests.',
  labelNames: ['operation_name'],
  buckets,
  registers: [register],
});

function operationName(method: string, path: string): string {
  if (path === '/metrics') return 'Metrics';
  if (path.startsWith('/join/')) return `${method} /join/:id`;
  if (path === '/rtd') return `${method} /rtd`;
  if (path.includes('.')) return 'Static';
  return `${method} /*`;
}

app.use('*', async (c, next) => {
  const start = process.hrtime.bigint();
  await next();
  const duration = Number(process.hrtime.bigint() - start) / 1e9;
  const operation = operationName(c.req.method, new URL(c.req.url).pathname);
  requestStatus.inc({
    status_code: String(c.res.status),
    operation_name: operation,
  });
  requestDuration.observe({ operation_name: operation }, duration);
});

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
const parsedMetricsPort = Number.parseInt(process.env.METRICS_PORT ?? '', 10);
const metricsPort = Number.isFinite(parsedMetricsPort) ? parsedMetricsPort : 9090;

createServer(async (req, res) => {
  if (req.url !== '/metrics') {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }
  const body = await register.metrics();
  res.writeHead(200, { 'Content-Type': register.contentType });
  res.end(body);
}).listen(metricsPort, () => {
  console.log(`Metrics server is running: http://0.0.0.0:${metricsPort}/metrics`);
});

serve(
  {
    fetch: async (request: Request) => {
      if (new URL(request.url).pathname === '/metrics') {
        return new Response('Not Found', { status: 404 });
      }
      return app.fetch(request);
    },
    port,
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  },
);
