import { useParams } from '@/router';

export default function Id() {
  const { id } = useParams('/:id');
  let canvas: HTMLCanvasElement | undefined;

  console.log('On page: ', id);

  const submit = () => {};

  return (
    <div>
      <h1>Draw a picture!</h1>
      <canvas ref={canvas} />
      <button type="submit" onClick={submit}>
        Submit
      </button>
    </div>
  );
}
