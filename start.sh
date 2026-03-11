#!/bin/bash
# FoldForge — Quick Start Script
set -e

echo "=== FoldForge Startup ==="

# Check for .env
if [ ! -f .env ]; then
  echo "No .env found — copying .env.example to .env"
  cp .env.example .env
  echo "⚠️  Please edit .env and set JWT_SECRET before running in production!"
fi

# Install dependencies if needed
if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  pnpm install
fi

# Create data directory
mkdir -p data logs

# Start server
echo "Starting FoldForge..."
NODE_ENV=production node_modules/.bin/tsx server/_core/index.ts
