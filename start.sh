#!/bin/bash

# Docker start script for ukay.dev
# Usage: ./start.sh

echo "🚀 Starting ukay.dev Docker container on port 5111..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    echo "AUTH_SECRET_KEY=your_secret_key_here" > .env
    echo "Please edit .env file with your actual AUTH_SECRET_KEY"
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and start the container
echo "🔨 Building and starting container..."
docker-compose up --build -d

# Wait for container to be ready
echo "⏳ Waiting for container to start..."
sleep 5

# Check if container is running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Container started successfully!"
    echo "🌐 App is running at: http://localhost:5111"
    echo ""
    echo "📊 Container status:"
    docker-compose ps
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Failed to start container. Check logs:"
    docker-compose logs
    exit 1
fi