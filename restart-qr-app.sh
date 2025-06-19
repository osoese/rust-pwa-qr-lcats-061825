#!/bin/bash

# Simple restart script for QR PWA app
echo "🔄 Restarting QR PWA application..."

cd ~/apps/qr-pwa-app

# Stop and remove existing container
echo "🛑 Stopping existing container..."
docker stop qr-pwa-app 2>/dev/null || echo "No container running"
docker rm qr-pwa-app 2>/dev/null || echo "No container to remove"

# Start new container
echo "🚀 Starting QR PWA on port 3003..."
docker run -d \
    -p 3003:3003 \
    -v "$(pwd)/static:/app/static" \
    --name qr-pwa-app \
    --restart unless-stopped \
    qr-pwa-app

# Check status
echo "📊 Container status:"
docker ps | grep qr-pwa-app

echo "🌐 QR PWA should be available at: http://$(curl -s ifconfig.me):3003"

# Show recent logs
echo "📋 Recent logs:"
docker logs --tail 10 qr-pwa-app
