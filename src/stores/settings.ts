import { createRoot, createSignal } from 'solid-js';
import type { GameType } from '../types/types';

function createSettings() {
  const [soundEnabled, setSoundEnabled] = createSignal(true);
  const [scoreEnabled, setScoreEnabled] = createSignal(true);
  const [timerEnabled, setTimerEnabled] = createSignal(true);
  const [blinkingEnabled, setBlinkingEnabled] = createSignal(true);
  const [intervals, setIntervals] = createSignal<null | number>(null);
  const [gameType, setGameType] = createSignal<GameType>('ANARCHY');

  return {
    soundEnabled,
    scoreEnabled,
    timerEnabled,
    intervals,
    gameType,
    blinkingEnabled,
    setSoundEnabled,
    setScoreEnabled,
    setTimerEnabled,
    setIntervals,
    setGameType,
    setBlinkingEnabled,
  };
}

export const settings = createRoot(createSettings);
