#!/bin/bash

# Quick update script for QR PWA
# Run this when you want to deploy new QR PWA changes

set -e

echo "🔄 Updating QR PWA application..."

cd ~/apps/qr-pwa-app

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull

# Rebuild frontend
echo "🏗️  Rebuilding frontend..."
./build-frontend.sh

# Rebuild Docker image
echo "🏗️  Rebuilding Docker image..."
docker build -t qr-pwa-app .

# Update running container
echo "🔄 Updating running container..."
docker stop qr-pwa-app
docker rm qr-pwa-app
docker run -d \
    -p 3030:3030 \
    -v "$(pwd)/static:/app/static" \
    --name qr-pwa-app \
    --restart unless-stopped \
    qr-pwa-app

echo "✅ QR PWA update completed!"
echo "🌐 QR PWA is running at: http://$(curl -s ifconfig.me):3030"
