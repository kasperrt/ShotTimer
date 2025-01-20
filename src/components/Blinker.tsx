import { game } from '@/stores/game';
import { settings } from '@/stores/settings';
import type { Timeout } from '@/types/types';
import { Show, createEffect, createSignal, on, onCleanup } from 'solid-js';

export function Blinker() {
  const { drinker } = game;
  const { blinkingEnabled } = settings;
  const [blink, setBlink] = createSignal<boolean>(false);
  const [color, setColor] = createSignal<(typeof colors)[number]>();
  const colors = [
    'red',
    'blue',
    'purple',
    'yellow',
    'green',
    'red',
    'blue',
    'purple',
    'yellow',
    'green',
    'red',
    'blue',
    'purple',
    'yellow',
    'green',
    'red',
    'blue',
    'purple',
    'yellow',
    'green',
    'red',
    'blue',
    'purple',
    'yellow',
    'green',
    'red',
    'blue',
    'purple',
    'yellow',
    'green',
    'red',
    'blue',
    'purple',
    'yellow',
    'green',
    'white',
  ] as const;
  let blinkTimeout: Timeout = null;

  const doBlink = (current = 0) => {
    if (current > colors.length) {
      setColor('white');
      setBlink(false);
      return;
    }

    setBlink(true);
    setColor(colors[current]);
    blinkTimeout && clearTimeout(blinkTimeout);
    blinkTimeout = setTimeout(() => {
      doBlink(current + 1);
    }, 100);
  };

  createEffect(
    on(drinker, (drinker) => {
      if (!drinker) {
        setBlink(false);
        return;
      }

      if (blink()) {
        return;
      }

      doBlink();
    }),
  );

  onCleanup(() => {
    blinkTimeout && clearTimeout(blinkTimeout);
  });

  return (
    <Show when={blink() && blinkingEnabled()}>
      <div class="pointer-events-none absolute inset-0 z-0 h-full w-full" style={{ 'background-color': color() }} />
    </Show>
  );
}
