import type { Game } from '@/stores/game';
import { draw } from '@/utils/draw';
import { Show, createEffect, on } from 'solid-js';

interface Props {
  winner: Game['winner'];
}

export function Drawing({ winner }: Props) {
  let canvas: HTMLCanvasElement | undefined;

  createEffect(
    on(winner, (winner) => {
      if (!winner || !canvas) {
        return;
      }
      const drawing = winner.drawing;
      if (!drawing) {
        return;
      }

      canvas.height = drawing.height;
      canvas.width = drawing.width;

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      draw({
        canvas,
        x: drawing.x,
        y: drawing.y,
        drag: drawing.drag,
        color: drawing.color,
        full: true,
      });
    }),
  );

  return (
    <Show when={winner() && !!winner()?.drawing}>
      <div class="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-10 h-full opacity-50">
        <canvas ref={canvas} class="m-auto h-full" />
      </div>
    </Show>
  );
}
