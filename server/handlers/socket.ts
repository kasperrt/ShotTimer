import type { ServerType } from '@hono/node-server';
import { customAlphabet } from 'nanoid';
import { Server } from 'socket.io';

const nanoid = customAlphabet('1234567890abcdef', 10);
const ids: string[] = [];
let io: Server;

function attachServer(server: ServerType) {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000', 'https://etys.no', 'https://ws.etys.no'],
    },
    path: '/',
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
  return io;
}

export { getSocket, attachServer };
