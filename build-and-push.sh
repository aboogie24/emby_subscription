#!/bin/bash

# Build and push Docker images for Kubernetes deployment

set -e

# Configuration
DOCKER_REGISTRY="aboogie"  # Change this to your Docker registry
BACKEND_IMAGE="$DOCKER_REGISTRY/emby-backend"
FRONTEND_IMAGE="$DOCKER_REGISTRY/emby-frontend"
TAG="v0.0.1"  # Increment this version

echo "🏗️  Building backend Docker image..."
cd backend
docker build -t $BACKEND_IMAGE:$TAG .
docker build -t $BACKEND_IMAGE:latest .
cd ..

echo "🏗️  Building frontend Docker image..."
cd frontend
docker build -t $FRONTEND_IMAGE:$TAG .
docker build -t $FRONTEND_IMAGE:latest .
cd ..

echo "📤 Pushing images to registry..."
docker push $BACKEND_IMAGE:$TAG
docker push $BACKEND_IMAGE:latest
docker push $FRONTEND_IMAGE:$TAG
docker push $FRONTEND_IMAGE:latest

echo "✅ Images built and pushed successfully!"
echo "📝 Update your values.yaml with tag: $TAG"
echo "🚀 Then run: helm upgrade emby-subscription ./chart"
