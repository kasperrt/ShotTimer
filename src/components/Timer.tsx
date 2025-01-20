import { game } from '@/stores/game';
import { settings } from '@/stores/settings';
import type { Interval, Timeout } from '@/types/types';
import { getRemaining } from '@/utils/getRemaining';
import { Show, createEffect, createSignal, on, onCleanup } from 'solid-js';

export function Timer() {
  const { timerEnabled } = settings;
  const { countdown, drinker } = game;
  const [showDrinker, setShowDrinker] = createSignal<boolean>(false);
  const [remaining, setRemaining] = createSignal<ReturnType<typeof getRemaining>>({
    minutes: '00',
    seconds: '00',
    milliseconds: '000',
  });
  let counterInterval: Interval = null;
  let showcaseTimeout: Timeout = null;

  createEffect(() => {
    if (!countdown()) {
      setRemaining(getRemaining(null));
      return;
    }
    const c = countdown();
    if (!c) {
      return;
    }
    setRemaining(getRemaining(c.getTime() - new Date().getTime()));
    counterInterval && clearInterval(counterInterval);
    counterInterval = setInterval(() => {
      const c = countdown();
      if (!c) {
        counterInterval && clearInterval(counterInterval);
        return;
      }

      const r = c.getTime() - new Date().getTime();
      if (r <= 0) {
        counterInterval && clearInterval(counterInterval);
        setRemaining(getRemaining(null));
        return;
      }

      setRemaining(getRemaining(c.getTime() - new Date().getTime()));
    }, 10);
  });

  createEffect(
    on(drinker, (drinker) => {
      if (!drinker) {
        return;
      }

      showcaseTimeout && clearTimeout(showcaseTimeout);
      setShowDrinker(true);
      showcaseTimeout = setTimeout(() => {
        setShowDrinker(false);
      }, 2000);
    }),
  );

  onCleanup(() => {
    counterInterval && clearInterval(counterInterval);
    showcaseTimeout && clearTimeout(showcaseTimeout);
  });

  return (
    <h1 class="w-full text-center text-9xl font-light tabular-nums">
      <Show when={!countdown()}>ShotTimer</Show>
      <Show when={showDrinker()}>{drinker()?.name}</Show>
      <Show when={timerEnabled() && !showDrinker() && countdown()}>
        {remaining()?.minutes}:{remaining()?.seconds}.{remaining()?.milliseconds}
      </Show>
    </h1>
  );
}
