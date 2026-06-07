# syntax=docker/dockerfile:1

ARG NODE_VERSION=26.0.0

FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
RUN npm install -g corepack@latest --force \
  && npm install -g pnpm@latest --force
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ARG VITE_HOST
ARG VITE_CORS
ENV VITE_HOST=${VITE_HOST}
ENV VITE_CORS=${VITE_CORS}
RUN pnpm build
RUN pnpm tsc --project tsconfig.server.json --outDir distServer
RUN pnpm prune --prod

FROM node:${NODE_VERSION}-bookworm-slim AS runner
WORKDIR /app
ARG VITE_HOST
ARG VITE_CORS
ENV NODE_ENV=production
ENV PORT=8080
ENV VITE_HOST=${VITE_HOST}
ENV VITE_CORS=${VITE_CORS}
RUN npm install -g corepack@latest --force \
  && npm install -g pnpm@latest --force
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/distServer ./distServer
EXPOSE 8080
USER node
CMD ["node", "distServer/server/index.js"]
