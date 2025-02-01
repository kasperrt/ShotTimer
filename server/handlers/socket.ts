import type { ServerType } from '@hono/node-server';
import dotenv from 'dotenv';
import { createMiddleware } from 'hono/factory';
import { customAlphabet } from 'nanoid';
import { Server } from 'socket.io';

dotenv.config();

const CORS = (process.env.VITE_CORS ?? '').split(',');
const nanoid = customAlphabet('1234567890abcdef', 10);
const ids: string[] = [];

function getId() {
  const id = nanoid(6);
  if (ids.includes(id)) {
    return getId();
  }

  ids.push(id);
  return id;
}

export interface SocketHandlerMiddleware {
  Variables: {
    io: Server;
  };
}

export function createSocketMiddleware(server: ServerType) {
  if (!server) {
    throw new Error('error server not initialized yet');
  }
  const io = new Server(server, {
    cors: {
      origin: CORS.length === 1 ? CORS[0] : CORS,
    },
    serveClient: false,
    path: '/rtd',
  });

  io.on('connection', (socket) => {
    socket.on('server', () => {
      const id = getId();

      socket.join(id);
      socket.emit('id', id);
    });
  });

  return createMiddleware<SocketHandlerMiddleware>(async (c, next) => {
    c.set('io', io);
    await next();
  });
}
