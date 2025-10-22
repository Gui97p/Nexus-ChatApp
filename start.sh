#!/bin/sh
set -e

echo "Generating Prisma client..."
npx prisma generate

echo "Running migrations..."
if [ "$NODE_ENV" = "development" ]; then
  npx prisma migrate dev --name init --skip-seed
else
  npx prisma migrate deploy
fi

echo "Starting the server..."
if [ "$NODE_ENV" = "development" ]; then
  npx ts-node-dev --respawn --transpile-only src/index.ts
else
  node dist/index.js
fi
