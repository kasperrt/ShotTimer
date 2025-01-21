import type { ServerType } from '@hono/node-server';
import dotenv from 'dotenv';
import { customAlphabet } from 'nanoid';
import { Server } from 'socket.io';

dotenv.config();

const CORS = (process.env.VITE_CORS ?? '').split(',');
const nanoid = customAlphabet('1234567890abcdef', 10);
const ids: string[] = [];
let io: Server;

function attachServer(server: ServerType) {
  if (!server) {
    throw new Error('error server not initialized yet');
  }
  io = new Server(server, {
    cors: {
      origin: CORS,
    },
    path: '/rtd',
  });

  io.on('connection', (socket) => {
    socket.on('server', () => {
      const id = nanoid(5);
      ids.push(id);

      socket.join(id);
      socket.emit('id', id);
    });
  });
}

function getSocket() {
  if (!io) {
    throw new Error('error socket.io not initialized yet');
  }

  return io;
}

export { getSocket, attachServer };
