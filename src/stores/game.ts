import { type Interval, type Player, playerSchema } from '@/types/types';
import { drawPlayer } from '@/utils/drawPlayer';
import { io } from 'socket.io-client';
import { createEffect, createRoot, createSignal, on, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { settings } from './settings';

function createGame() {
  const { intervals, gameType } = settings;
  const [gameId, setGameId] = createSignal<string | null>(null);
  const [players, setPlayers] = createStore<Player[]>([]);
  const [countdown, setCountdown] = createSignal<Date | null>(null);
  const socket = io(`${window.location.protocol}//ws.${window.location.hostname}:${import.meta.env.VITE_CLIENT_PORT}`, {
    path: '/',
  });
  const [drinker, setDrinker] = createSignal<Player | null>(null, {
    equals: false,
  });
  let counter: Interval = null;

  socket.on('id', (id) => {
    setGameId(id);
  });

  socket.on('join', (data) => {
    const { data: player, success, error } = playerSchema.safeParse(data);
    if (!success || error) {
      console.error("error couldn't parse: ", error);
      return;
    }

    addPlayer(player);
  });

  socket.on('connect', () => {
    socket.emit('server');
  });

  const addPlayer = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
  };

  const removePlayer = (id: string) => setPlayers((prev) => prev.filter((player) => player.id !== id));

  const incrementScore = (id: string) =>
    setPlayers(
      (prev) => prev.id === id,
      produce((prev) => prev.score++),
    );

  const startTimer = () => {
    counter && clearInterval(counter);
    counter = setInterval(() => {
      const c = countdown();
      if (!c) {
        return counter && clearInterval(counter);
      }
      const passed = c.getTime() < new Date().getTime();
      if (!passed) {
        return;
      }

      counter && clearInterval(counter);
      setDrinker(drawPlayer(players, gameType()));
    }, 10);
  };

  createEffect(
    on(drinker, (drinker) => {
      if (!drinker) {
        return;
      }

      // Play sound here
      incrementScore(drinker.id);
      setCountdown(null);
    }),
  );

  createEffect(() => {
    if (players.length === 0) {
      setCountdown(null);
      return;
    }
    if (players.length === 0 || countdown()) {
      return;
    }

    const interval = intervals() ?? Math.floor(Math.random() * 6) + 1;
    setCountdown(new Date(new Date().getTime() + interval * 60000));
    startTimer();
  });

  onCleanup(() => counter && clearInterval(counter));

  return {
    players,
    gameId,
    drinker,
    countdown,
    addPlayer,
    removePlayer,
  };
}

export const game = createRoot(createGame);
