import { useParams } from '@/router';
import { getRandomColor } from '@/utils/color';
import { draw } from '@/utils/draw';
import { Show, createSignal, onCleanup, onMount } from 'solid-js';

export default function Id() {
  const { id } = useParams('/:id');
  const [name, setName] = createSignal<string>('');
  const [submitted, setSubmitted] = createSignal(false);
  const [submitting, setSubmitting] = createSignal(false);
  const clickX: number[] = [];
  const clickY: number[] = [];
  const clickDrag: boolean[] = [];
  const color = getRandomColor();
  let canvas: HTMLCanvasElement | undefined;
  let painting = false;

  const onChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setName(target.value);
  };

  const onSubmit = (e: Event) => {
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

    fetch(`${window.location.protocol}//ws.${window.location.hostname}${import.meta.env.VITE_CLIENT_PORT}/join/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        name: name(),
        drawing: { x: clickX, y: clickY, drag: clickDrag, color, height: canvas.height, width: canvas.width },
      }),
    })
      .then((res) => {
        if (!res.ok || res.status !== 204) {
          throw new Error('Not ok');
        }
        setSubmitted(true);
      })
      .catch(() => alert('Something went wrong, please try again'))
      .finally(() => setSubmitting(false));
  };

  const onTouchStart = (e: TouchEvent) => {
    e.preventDefault();
    painting = true;
    const target = e.target as HTMLCanvasElement;
    updatePositions(e.touches[0].pageX - target.offsetLeft, e.touches[0].pageY - target.offsetTop, false);
    draw({ canvas, x: clickX, y: clickY, drag: clickDrag, color });
  };

  const onTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!painting) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    updatePositions(e.touches[0].pageX - target.offsetLeft, e.touches[0].pageY - target.offsetTop, true);
    draw({ canvas, x: clickX, y: clickY, drag: clickDrag, color });
  };

  const onMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    painting = true;
    const target = e.target as HTMLCanvasElement;
    updatePositions(e.pageX - target.offsetLeft, e.pageY - target.offsetTop, false);
    draw({ canvas, x: clickX, y: clickY, drag: clickDrag, color });
  };

  const onMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    if (!painting) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    updatePositions(e.pageX - target.offsetLeft, e.pageY - target.offsetTop, true);
    draw({ canvas, x: clickX, y: clickY, drag: clickDrag, color });
  };

  const onTouchEnd = (e: Event) => {
    e.preventDefault();
    painting = false;
  };

  const updatePositions = (x: number, y: number, drag: boolean) => {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(drag);
  };

  onMount(() => {
    if (!canvas) {
      return;
    }
    const { height, width } = canvas.getBoundingClientRect();
    canvas.height = height;
    canvas.width = width;

    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('mousedown', onMouseDown, { passive: false });
    canvas.addEventListener('mousemove', onMouseMove, { passive: false });
    canvas.addEventListener('mouseup', onTouchEnd, { passive: false });
  });

  onCleanup(() => {
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
      </Show>
      <Show when={!submitted()}>
        <h1 class="text-center text-4xl">Draw a picture!</h1>
        <form onSubmit={onSubmit} class="flex flex-1 flex-col gap-y-2">
          <input
            type="text"
            name="name"
            value={name()}
            onKeyDown={(e) => onChange(e)}
            placeholder="Your name"
            class="w-full border-b border-b-black/20 pb-2 text-center text-xl outline-none hover:border-b-black/50 focus:border-b-black/50"
          />
          <canvas ref={canvas} class="h-5/6 w-full border" />

          <button type="submit" disabled={submitting()}>
            Submit
          </button>
        </form>
      </Show>
    </div>
  );
}
