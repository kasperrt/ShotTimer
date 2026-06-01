#!/usr/bin/env bash
set -euo pipefail
IMAGE="ghcr.io/${GITHUB_REPOSITORY,,}:${GITHUB_SHA}"
DOCKERFILE="${DOCKERFILE:-Dockerfile}"
CONTEXT="${CONTEXT:-.}"
VITE_HOST="${VITE_HOST:-https://shot.etys.no}"
VITE_CORS="${VITE_CORS:-https://shot.etys.no}"
docker build \
  --build-arg "VITE_HOST=${VITE_HOST}" \
  --build-arg "VITE_CORS=${VITE_CORS}" \
  -f "$DOCKERFILE" \
  -t "$IMAGE" \
  "$CONTEXT"
echo "IMAGE=$IMAGE" >> "$GITHUB_ENV"
