# ShotTimer

<img width="1680" alt="Screenshot 2025-01-22 at 00 24 42" src="https://github.com/user-attachments/assets/1552be49-465e-455a-abb3-9467992dabd7" />

Simple, dumb drinking game, based on randomly selecting a player to drink at a random interval, with annoying blinking, sounds, and dumb text-to-speech.

Previously horribly written in plain JS (+ a drizzle of jQuery), now (still horribly written as I don't know it yet) solid-js!

Invite your friends, have them type in their name and see who comes out alive.


## Get started

### Requirements

- node 18.19.1
- pnpm 9.15.4

### Setup

```
$ pnpm install && cp .sample.env .env && pnpm build
```


### Development

```
$ pnpm install && pnpm dev
```

And open `http://localhost:3000`.


### Deployment

The client-code transpiles to a client-side-rendered SolidJS app, so you'll need hosting for that as the hono-server is just for socket-connetions and external joins.