import { useParams } from "@/router";

export default function Id() {
    const { id } = useParams('/:id')
    let canvas: HTMLCanvasElement | undefined;

    const submit = () => {

    }

    return (<div>
        <h1>Draw a picture!</h1>
        <canvas ref={canvas} />
        <button onClick={submit}>Submit</button>
    </div>)
}