import type { Game } from '@/stores/game';
import { settings } from '@/stores/settings';
import type { Timeout } from '@/types/types';
import { Show, createEffect, createSignal, on, onCleanup } from 'solid-js';

interface Props {
  winner: Game['winner'];
}

export function Blinker({ winner }: Props) {
  const { blinkingEnabled } = settings;
  const [blink, setBlink] = createSignal<boolean>(false);
  const [color, setColor] = createSignal<(typeof colors)[number] | 'white'>();
  const colors = ['red', 'blue', 'purple', 'yellow', 'green', 'red'] as const;
  let blinkTimeout: Timeout = null;

  const doBlink = (c = 0, l = 0) => {
    let current = c;
    let loop = l;
    if (loop > 5) {
      setColor('white');
      setBlink(false);
      return;
    }

    if (current > colors.length) {
      current = 0;
      loop++;
    }

    setBlink(true);
    setColor(colors[current]);
    blinkTimeout && clearTimeout(blinkTimeout);
    blinkTimeout = setTimeout(() => {
      doBlink(current + 1, loop);
    }, 100);
  };

  createEffect(
    on(winner, (winner) => {
      if (!winner) {
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
