#!/bin/bash

# Quick update script for QR PWA
# Run this when you want to deploy new QR PWA changes

set -e

echo "🔄 Updating QR PWA application..."

cd ~/apps/qr-pwa-app

# Pull latest changes and reset to remote state
echo "📥 Pulling latest changes from git and resetting to remote state..."
git fetch
git reset --hard origin/main

# Fix script permissions
echo "🔧 Fixing script permissions..."
chmod +x *.sh

# Rebuild frontend
echo "🏗️  Rebuilding frontend..."
./build-frontend.sh

# Rebuild Docker image
echo "🏗️  Rebuilding Docker image..."
docker build -t qr-pwa-app .

# Update running container
echo "🔄 Updating running container..."
docker stop qr-pwa-app 2>/dev/null || true
docker rm qr-pwa-app 2>/dev/null || true
docker run -d \
    -p 3003:3003 \
    -v "$(pwd)/static:/app/static" \
    -v "$(pwd)/ssl:/app/ssl" \
    --name qr-pwa-app \
    --restart unless-stopped \
    qr-pwa-app

echo "✅ QR PWA update completed!"
echo "🌐 QR PWA is running at: https://$(curl -s ifconfig.me):3003"
