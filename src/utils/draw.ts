interface Props {
  canvas?: HTMLCanvasElement;
  x: number[];
  y: number[];
  drag: boolean[];
  color: string;
  full?: boolean;
}

export function draw({ canvas, x, y, drag, color, full }: Props) {
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

  if (full) {
    for (let i = 0; i < x.length; i++) {
      context.beginPath();
      if (drag[i] && i) {
        context.moveTo(x[i - 1], y[i - 1]);
      } else {
        context.moveTo(x[i] - 1, y[i]);
      }
      context.lineTo(x[i], y[i]);
      context.closePath();
      context.stroke();
    }

    return;
  }

  context.beginPath();
  if (drag[drag.length - 1]) {
    context.moveTo(x[drag.length - 2], y[drag.length - 2]);
  } else {
    context.moveTo(x[drag.length - 1] - 1, y[drag.length - 1]);
  }
  context.lineTo(x[drag.length - 1], y[drag.length - 1]);
  context.closePath();
  context.stroke();
}
