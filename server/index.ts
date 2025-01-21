import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { joinHandler } from './handlers/join';
import { attachServer } from './handlers/socket';

dotenv.config();

const CORS = (process.env.VITE_CORS ?? '').split(',');
const app = new Hono();

app.use(
  '/join/*',
  cors({
    origin: CORS,
  }),
);
app.post('/join/:id', joinHandler);

const server = serve(
  {
    fetch: app.fetch,
    port: 8080,
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  },
);

attachServer(server);

console.log('started');
