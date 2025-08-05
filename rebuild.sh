#!/bin/bash

echo "🧹 Cleaning up Docker containers and images..."
docker-compose down
docker system prune -f
docker-compose build --no-cache

echo "🚀 Starting services..."
docker-compose up

echo "✅ Done! The application should now be running without the ARM64 rollup issue."
