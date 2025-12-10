import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { joinHandler } from './handlers/join';
import { sseHandler } from './handlers/sse';

dotenv.config({ quiet: true });

const CORS = (process.env.VITE_CORS ?? '').split(',');
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

serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  },
);
