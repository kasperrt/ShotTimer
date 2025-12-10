import { io } from 'socket.io-client';
import { onCleanup } from 'solid-js';
import type { Game } from '@/stores/game';
import { playerSchema } from '@/types/types';

interface Props {
  addPlayer: Game['addPlayer'];
  setGameId: Game['setGameId'];
}

export function socket({ addPlayer, setGameId }: Props) {
  const socket = io(`${import.meta.env.VITE_HOST ?? ''}`, {
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
