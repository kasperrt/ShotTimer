import type { Context } from 'hono';
import { type SSEStreamingApi, streamSSE } from 'hono/streaming';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('1234567890abcdef', 10);
const connections = new Map<string, SSEStreamingApi>();

async function sendPlayerEvent(gameId: string, data: string) {
  const stream = connections.get(gameId);
  if (!stream) {
    return false;
  }

  try {
    await stream.writeSSE({ data });
    return true;
  } catch (error) {
    console.error('error sending SSE event', error);
    connections.delete(gameId);
    return false;
  }
}

const sseHandler = (ctx: Context) =>
  streamSSE(ctx, async (stream) => {
    const gameId = nanoid(5);
    connections.set(gameId, stream);

    await stream.writeSSE({
      data: JSON.stringify({
        type: 'join',
        id: gameId,
      }),
    });

    const keepAlive = setInterval(() => {
      stream.writeSSE({ event: 'ping', data: 'keepalive' });
    }, 30_000);

    await new Promise<void>((resolve) => {
      stream.onAbort(() => {
        clearInterval(keepAlive);
        connections.delete(gameId);
        resolve();
      });
    });
  });

export { sendPlayerEvent, sseHandler };
