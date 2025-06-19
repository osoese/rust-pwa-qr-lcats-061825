#!/bin/bash

# Quick update script for QR PWA frontend changes with build process
# Use this when you only changed frontend files

echo "🔄 Updating QR PWA frontend with build process..."

cd ~/apps/qr-pwa-app

echo "📥 Pulling latest changes..."
git pull

echo "🏗️  Building QR PWA frontend..."
./build-frontend.sh

echo "🔄 Restarting container to pick up changes..."
docker restart qr-pwa-app

echo "✅ QR PWA frontend updated and built!"
echo "🌐 QR PWA is running at: http://$(curl -s ifconfig.me):3003"
