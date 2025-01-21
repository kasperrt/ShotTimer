import type { Interval, Player, Timeout } from '@/types/types';
import { drawPlayer } from '@/utils/drawPlayer';
import { createEffect, createRoot, createSignal, on, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { settings } from './settings';

function createGame() {
  const { intervals, gameType, soundEnabled } = settings;
  const [gameId, setGameId] = createSignal<string | null>(null);
  const [players, setPlayers] = createStore<Player[]>([]);
  const [countdown, setCountdown] = createSignal<Date | null>(null);
  const [drinker, setDrinker] = createSignal<Player | null>(null, {
    equals: false,
  });
  const bell = new Audio('/assets/sound/bell.mp3');
  const sanic = new Audio('/assets/sound/sanic.mp3');

  // This is loud as fuck
  sanic.volume = 0.2;
  let counter: Interval = null;
  let soundTimeout: Timeout = null;

  const addPlayer = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
  };

  const removePlayer = (id: string) => setPlayers((prev) => prev.filter((player) => player.id !== id));

  const incrementScore = (id: string) =>
    setPlayers(
      (prev) => prev.id === id,
      produce((prev) => prev.score++),
    );

  const playSound = () => {
    if (!soundEnabled()) {
      return;
    }
    const playSanic = Math.floor(Math.random() * 1000 + 1) === 137;
    const sound = playSanic ? sanic : bell;
    sound.play();

    soundTimeout && clearTimeout(soundTimeout);
    soundTimeout = setTimeout(() => {
      stopSound();
    }, 10000);
  };

  const stopSound = () => {
    sanic.pause();
    bell.pause();
    sanic.currentTime = 0;
    bell.currentTime = 0;
  };

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

      playSound();
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

  createEffect(() => {
    if (soundEnabled()) {
      return;
    }

    stopSound();
  });

  onCleanup(() => counter && clearInterval(counter));

  return {
    players,
    gameId,
    setGameId,
    drinker,
    countdown,
    addPlayer,
    removePlayer,
  };
}

export const game = createRoot(createGame);
