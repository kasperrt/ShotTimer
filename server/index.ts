import { type ServerType, serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import dotenv from 'dotenv';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { joinHandler } from './handlers/join';
import { createSocketMiddleware } from './handlers/socket';

dotenv.config();

const port = Number.parseInt(process.env.PORT ?? '8080');
const CORS = (process.env.VITE_CORS ?? '').split(',');
const app = new Hono();

const server = serve(
  {
    ...app,
    port: !Number.isNaN(port) ? port : 8080,
  },
  (info) => {
    console.log(`Server is running: http://${info.address}:${info.port}`);
  },
);

const socketMiddleware = createSocketMiddleware(server);
app.use('*', cors({ origin: CORS }));
app.post('/join/:id', socketMiddleware, joinHandler);
app.use('*', socketMiddleware, serveStatic({ root: './dist' }));

process.once('SIGINT', close);
process.once('SIGTERM', close);

async function close(signal: NodeJS.Signals) {
  console.log(`*^!@4=> Received signal to terminate: ${signal}`);

  await closeGracefully(server);

  process.exit(0);
}

async function closeGracefully(serve: ServerType) {
  return new Promise<void>((resolve, reject) =>
    serve.close((err) => {
      if (err) {
        console.error(`error trying to close server: ${err}`);
        return reject();
      }
      console.log('closed server');
      return resolve();
    }),
  );
}

export default app;
