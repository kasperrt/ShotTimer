import { game } from '@/stores/game';
import { draw } from '@/utils/draw';
import { Show, createEffect, on } from 'solid-js';

export function Drawing() {
  const { drinker } = game;
  let canvas: HTMLCanvasElement | undefined;

  createEffect(
    on(drinker, (drinker) => {
      if (!drinker || !canvas) {
        return;
      }
      const drawing = drinker.drawing;
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
    <Show when={drinker() && !!drinker()?.drawing}>
      <div class="pointer-events-none absolute bottom-0 left-0 right-0 top-0 z-10 h-full opacity-50">
        <canvas ref={canvas} class="m-auto h-full" />
      </div>
    </Show>
  );
}
