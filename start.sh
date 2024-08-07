#!/bin/sh

set -e

# Wait for the database to be ready
until pg_isready -h db -U postgres; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - executing command"

# Run Prisma commands
cd packages/db
npx prisma generate
npx prisma migrate deploy

# Install dependencies
cd /app
pnpm install

echo "Starting build process..."

# Build the application
cd apps/docs
pnpm run build

echo "Build process completed. Checking for .next directory..."
ls -la

# Start the application
pnpm start