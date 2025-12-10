import { createEffect, createSignal, on, onCleanup, Show } from 'solid-js';
import type { Game } from '@/stores/game';
import { settings } from '@/stores/settings';
import type { Interval, Timeout } from '@/types/types';
import { getRemainingTimeReadable } from '@/utils/getRemainingTimeReadable';

interface Props {
  countdown: Game['countdown'];
  winner: Game['winner'];
}

export function Timer({ countdown, winner }: Props) {
  const { timerEnabled } = settings;
  const [showWinner, setShowWinner] = createSignal<boolean>(false);
  const [remainingTimeReadable, setRemainingTimeReadable] = createSignal<ReturnType<typeof getRemainingTimeReadable>>({
    minutes: '00',
    seconds: '00',
    milliseconds: '000',
  });
  let counterInterval: Interval = null;
  let showcaseTimeout: Timeout = null;

  const count = () => {
    const c = countdown();
    if (!c) {
      counterInterval && clearInterval(counterInterval);
      return;
    }

    const r = c.getTime() - Date.now();
    if (r <= 0) {
      counterInterval && clearInterval(counterInterval);
      setRemainingTimeReadable(getRemainingTimeReadable(null));
      return;
    }

    setRemainingTimeReadable(getRemainingTimeReadable(c.getTime() - Date.now()));
  };

  createEffect(() => {
    const c = countdown();
    if (!c) {
      setRemainingTimeReadable(getRemainingTimeReadable(null));
      return;
    }

    setRemainingTimeReadable(getRemainingTimeReadable(c.getTime() - Date.now()));
    counterInterval && clearInterval(counterInterval);
    counterInterval = setInterval(count, 10);
  });

  createEffect(
    on(winner, (winner) => {
      if (!winner) {
        return;
      }

      showcaseTimeout && clearTimeout(showcaseTimeout);
      setShowWinner(true);
      showcaseTimeout = setTimeout(() => {
        setShowWinner(false);
      }, 2000);
    }),
  );

  onCleanup(() => {
    counterInterval && clearInterval(counterInterval);
    showcaseTimeout && clearTimeout(showcaseTimeout);
  });

  return (
    <h1 class="w-full text-center text-6xl font-light tabular-nums lg:text-9xl">
      <Show when={!countdown()}>ShotTimer</Show>
      <Show when={showWinner() && winner()}>{winner()?.name}</Show>
      <Show when={timerEnabled() && !showWinner() && countdown()}>
        {remainingTimeReadable()?.minutes}:{remainingTimeReadable()?.seconds}.{remainingTimeReadable()?.milliseconds}
      </Show>
    </h1>
  );
}
