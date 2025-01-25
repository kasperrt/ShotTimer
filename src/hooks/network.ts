import { playerSchema } from '@/types/types';
import { io } from 'socket.io-client';
import { onCleanup } from 'solid-js';
import { game } from '../stores/game';

export function network() {
  const { setGameId, addPlayer } = game;

  const socket = io(`${window.location.protocol}//${window.location.hostname}${import.meta.env.VITE_CLIENT_PORT}`, {
    path: '/rtd',
  });

  socket.on('connect', () => socket.emit('server'));
  socket.on('id', (id) => setGameId(id));

  socket.on('join', (data) => {
    const { data: player, success, error } = playerSchema.safeParse(JSON.parse(data));
    if (!success || error) {
      console.error("error couldn't parse: ", error);
      return;
    }

    addPlayer(player);
  });

  onCleanup(() => {
    socket.disconnect();
  });
}
