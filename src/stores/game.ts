import type { DrawnPlayer, Interval, Player, Timeout } from '@/types/types';
import { drawPlayer } from '@/utils/drawPlayer';
import { createEffect, createSignal, on, onCleanup } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { settings } from './settings';

export function useGame() {
  const { intervals, gameType, soundEnabled } = settings;
  const [gameId, setGameId] = createSignal<string | null>(null);
  const [players, setPlayers] = createStore<Player[]>([]);
  const [countdown, setCountdown] = createSignal<Date | null>(null);
  const [winner, setWinner] = createSignal<DrawnPlayer | null>(null, {
    equals: false,
  });
  const bell = new Audio('/assets/sound/bell.mp3');
  const sanic = new Audio('/assets/sound/sanic.mp3');
  const synth = window.speechSynthesis;

  // This is loud as fuck
  sanic.volume = 0.2;
  let counter: Interval = null;
  let soundTimeout: Timeout = null;

  const addPlayer = (player: Player) => setPlayers((prev) => [...prev, player]);
  const removePlayer = (id: string) => setPlayers((prev) => prev.filter((player) => player.id !== id));
  const incrementScore = (id: string) =>
    setPlayers(
      (prev) => prev.id === id,
      produce((prev) => prev.score++),
    );

  const playCommand = () => {
    if (!soundEnabled()) {
      return;
    }

    const drinkCommand = new SpeechSynthesisUtterance(`Your turn to drink ${winner.name}`);
    drinkCommand.onend = () => {
      const playSanic = Math.floor(Math.random() * 1000 + 1) === 137;
      const sound = playSanic ? sanic : bell;
      sound.play();

      soundTimeout && clearTimeout(soundTimeout);
      soundTimeout = setTimeout(() => {
        stopSound();
      }, 10000);
    };
    drinkCommand.onerror = drinkCommand.onend;

    synth.speak(drinkCommand);
  };

  const stopSound = () => {
    synth.cancel();
    sanic.pause();
    bell.pause();
    sanic.currentTime = 0;
    bell.currentTime = 0;
  };

  const count = () => {
    const c = countdown();
    if (!c) {
      return counter && clearInterval(counter);
    }
    const passed = c.getTime() < new Date().getTime();
    if (!passed) {
      return;
    }

    counter && clearInterval(counter);
    setWinner(drawPlayer(players, gameType()));
  };

  const startTimer = () => {
    counter && clearInterval(counter);
    counter = setInterval(count, 10);
  };

  createEffect(
    on(winner, (winner) => {
      if (!winner) {
        return;
      }

      playCommand();
      incrementScore(winner.id);
      setCountdown(null);
    }),
  );

  createEffect(() => {
    if (players.length === 0) {
      setCountdown(null);
      return;
    }
    if (countdown()) {
      return;
    }

    const interval = intervals() ?? Math.floor(Math.random() * 6) + 1;
    setCountdown(new Date(new Date().getTime() + interval * 60000));
    startTimer();
  });

  createEffect(() => soundEnabled() && stopSound());

  onCleanup(() => counter && clearInterval(counter));

  return {
    players,
    gameId,
    setGameId,
    winner,
    countdown,
    addPlayer,
    removePlayer,
  };
}

export type Game = ReturnType<typeof useGame>;
