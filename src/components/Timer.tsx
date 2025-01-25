import type { Game } from '@/stores/game';
import { settings } from '@/stores/settings';
import type { Interval, Timeout } from '@/types/types';
import { getRemaining } from '@/utils/getRemaining';
import { Show, createEffect, createSignal, on, onCleanup } from 'solid-js';

interface Props {
  countdown: Game['countdown'];
  drinker: Game['drinker'];
}

export function Timer({ countdown, drinker }: Props) {
  const { timerEnabled } = settings;
  const [showDrinker, setShowDrinker] = createSignal<boolean>(false);
  const [remaining, setRemaining] = createSignal<ReturnType<typeof getRemaining>>({
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

    const r = c.getTime() - new Date().getTime();
    if (r <= 0) {
      counterInterval && clearInterval(counterInterval);
      setRemaining(getRemaining(null));
      return;
    }

    setRemaining(getRemaining(c.getTime() - new Date().getTime()));
  };

  createEffect(() => {
    const c = countdown();
    if (!c) {
      setRemaining(getRemaining(null));
      return;
    }

    setRemaining(getRemaining(c.getTime() - new Date().getTime()));
    counterInterval && clearInterval(counterInterval);
    counterInterval = setInterval(count, 10);
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
    <h1 class="w-full text-center text-6xl font-light tabular-nums lg:text-9xl">
      <Show when={!countdown()}>ShotTimer</Show>
      <Show when={showDrinker() && drinker()}>{drinker()?.name}</Show>
      <Show when={timerEnabled() && !showDrinker() && countdown()}>
        {remaining()?.minutes}:{remaining()?.seconds}.{remaining()?.milliseconds}
      </Show>
    </h1>
  );
}
