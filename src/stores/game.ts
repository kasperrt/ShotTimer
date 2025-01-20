import type { Interval, Player } from '@/types/types';
import { drawPlayer } from '@/utils/drawPlayer';
import { createEffect, createRoot, createSignal, on, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { settings } from './settings';

function createGame() {
  const { intervals, gameType } = settings;
  const [players, setPlayers] = createStore<Player[]>([]);
  const [countdown, setCountdown] = createSignal<Date | null>(null);
  const [drinker, setDrinker] = createSignal<Player | null>(null, {
    equals: false,
  });
  // Do socket-io connection here
  let counter: Interval = null;

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
    drinker,
    countdown,
    addPlayer,
    removePlayer,
  };
}

export const game = createRoot(createGame);
