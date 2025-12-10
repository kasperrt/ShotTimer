import { join } from '@/network/join';
import { useParams } from '@/router';
import { getRandomColor } from '@/utils/color';
import { draw } from '@/utils/draw';
import { Show, createSignal, onCleanup, onMount } from 'solid-js';

export default function Id() {
  const { id } = useParams('/:id');
  const [name, setName] = createSignal<string>('');
  const [submitted, setSubmitted] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);
  const [showHint, setShowHint] = createSignal(true);
  const clickX: number[] = [];
  const clickY: number[] = [];
  const clickDrag: boolean[] = [];
  const color = getRandomColor();
  let canvas: HTMLCanvasElement | undefined;
  let canvasContainer: HTMLDivElement | undefined;
  let painting = false;

  const onResize = () => {
    if (!canvas || !canvasContainer) {
      return;
    }

    const { height, width } = canvasContainer.getBoundingClientRect();
    canvas.height = height;
    canvas.width = width;

    draw({ canvas, x: clickX, y: clickY, drag: clickDrag, color, full: true });
  };

  const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setName(target.value);
  };

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    if (!name()) {
      return alert('You need to define a name');
    }

    if (!canvas) {
      return alert('Something went wrong, please reload the page and try again');
    }

    if (submitting()) {
      return;
    }

    setSubmitting(true);
    const submitted = await join(id, name(), {
      x: clickX,
      y: clickY,
      drag: clickDrag,
      color,
      height: canvas.height,
      width: canvas.width,
    });
    setSubmitted(submitted);
    setSubmitting(false);
    if (!submitted) {
      window.alert('Something went wrong, please try again');
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    painting = true;
    const target = e.target as HTMLCanvasElement;
    updatePositions(e.touches[0].pageX - target.offsetLeft, e.touches[0].pageY - target.offsetTop, false);
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!painting) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    updatePositions(e.touches[0].pageX - target.offsetLeft, e.touches[0].pageY - target.offsetTop, true);
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    painting = true;
    const target = e.target as HTMLCanvasElement;
    updatePositions(e.pageX - target.offsetLeft, e.pageY - target.offsetTop, false);
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!painting) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    updatePositions(e.pageX - target.offsetLeft, e.pageY - target.offsetTop, true);
  };

  const onTouchEnd = (e: Event) => {
    e.preventDefault();
    painting = false;
  };

  const updatePositions = (x: number, y: number, drag: boolean) => {
    setShowHint(false);
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(drag);
    draw({ canvas, x: clickX, y: clickY, drag: clickDrag, color });
  };

  onMount(() => {
    if (!canvas || !canvasContainer) {
      return;
    }
    const { height, width } = canvasContainer.getBoundingClientRect();
    canvas.height = height;
    canvas.width = width;

    window.addEventListener('resize', onResize, { passive: true });
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown, { passive: false });
    canvas.addEventListener('mousemove', onMouseMove, { passive: false });
    canvas.addEventListener('mouseup', onTouchEnd, { passive: false });
  });

  onCleanup(() => {
    window.addEventListener('resize', onResize);
    canvas?.removeEventListener('touchstart', onTouchStart);
    canvas?.removeEventListener('touchmove', onTouchMove);
    canvas?.removeEventListener('touchend', onTouchEnd);
    canvas?.removeEventListener('mousedown', onMouseDown);
    canvas?.removeEventListener('mousemove', onMouseMove);
    canvas?.removeEventListener('mouseup', onTouchEnd);
  });

  return (
    <div class="flex h-screen w-full flex-1 flex-col justify-center gap-y-2 p-2">
      <Show when={submitted()}>
        <h1 class="text-center text-4xl">Submitted!</h1>
        <p class="text-center">You can now close this tab</p>
      </Show>
      <Show when={!submitted()}>
        <Show when={showHint()}>
          <h1 class="pointer-events-none absolute bottom-0 left-0 right-0 top-0 m-auto h-fit text-center text-4xl text-black/20">
            Draw a picture!
          </h1>
        </Show>
        <form onSubmit={onSubmit} class="flex flex-1 flex-col gap-y-2">
          <div class="flex w-full flex-row gap-x-4">
            <input
              type="text"
              name="name"
              value={name()}
              onKeyDown={(e) => onChange(e)}
              placeholder="Your name"
              class="w-full border-b border-b-black/20 pb-2 text-xl outline-hidden hover:border-b-black/50 focus:border-b-black/50"
            />
            <button type="submit" disabled={submitting()}>
              Submit
            </button>
          </div>
          <div class="h-full w-full" ref={canvasContainer}>
            <canvas ref={canvas} class="h-full w-full border" />
          </div>
        </form>
      </Show>
    </div>
  );
}
