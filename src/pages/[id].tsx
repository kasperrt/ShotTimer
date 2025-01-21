import { useParams } from '@/router';
import { getRandomColor } from '@/utils/color';
import { Show, createSignal, onMount } from 'solid-js';

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

    if (submitting()) {
      return;
    }

    setSubmitting(true);

    fetch(`${window.location.protocol}//ws.${window.location.hostname}${import.meta.env.VITE_CLIENT_PORT}/join/${id}`, {
      method: 'POST',
      body: JSON.stringify({
        name: name(),
        drawing: { x: clickX, y: clickY, drag: clickDrag, color },
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
    painting = true;
    const target = e.target as HTMLCanvasElement;
    updatePositions(e.touches[0].pageX - target.offsetLeft, e.touches[0].pageY - target.offsetTop, false);
    draw();
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!painting) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    updatePositions(e.touches[0].pageX - target.offsetLeft, e.touches[0].pageY - target.offsetTop, true);
    draw();
  };

  const onMouseDown = (e: MouseEvent) => {
    painting = true;
    const target = e.target as HTMLCanvasElement;
    updatePositions(e.pageX - target.offsetLeft, e.pageY - target.offsetTop, false);
    draw();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!painting) {
      return;
    }

    const target = e.target as HTMLCanvasElement;
    updatePositions(e.pageX - target.offsetLeft, e.pageY - target.offsetTop, true);
    draw();
  };

  const onTouchEnd = () => {
    painting = false;
  };

  const updatePositions = (x: number, y: number, drag: boolean) => {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(drag);
  };

  const draw = () => {
    if (!canvas) {
      return;
    }
    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    context.strokeStyle = color;
    context.lineJoin = 'round';
    context.lineWidth = 5;

    context.beginPath();
    if (clickDrag[clickDrag.length - 1]) {
      context.moveTo(clickX[clickDrag.length - 2], clickY[clickDrag.length - 2]);
    } else {
      context.moveTo(clickX[clickDrag.length - 1] - 1, clickY[clickDrag.length - 1]);
    }
    context.lineTo(clickX[clickDrag.length - 1], clickY[clickDrag.length - 1]);
    context.closePath();
    context.stroke();
  };

  onMount(() => {
    if (!canvas) {
      return;
    }
    const { height, width } = canvas.getBoundingClientRect();
    canvas.height = height;
    canvas.width = width;
  });

  return (
    <div class="flex h-full w-full flex-col justify-center gap-y-2 p-2">
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
          <canvas
            ref={canvas}
            class="w-full flex-1 border"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseLeave={onTouchEnd}
            onMouseUp={onTouchEnd}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          />

          <button type="submit" disabled={submitting()}>
            Submit
          </button>
        </form>
      </Show>
    </div>
  );
}
