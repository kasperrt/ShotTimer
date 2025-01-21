import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { joinHandler } from './handlers/join';
import { attachServer } from './handlers/socket';

const app = new Hono();

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
