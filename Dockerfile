FROM node:18.19-slim AS base
ARG PNPM_VERSION=9.15.2
ENV PNPM_VERSION=$PNPM_VERSION
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apt-get update -y \
    && corepack enable \
    && pnpm i -g pnpm@${PNPM_VERSION}

COPY . /app

WORKDIR /app

RUN ls -all

RUN pnpm install

CMD ["pnpm", "start"]