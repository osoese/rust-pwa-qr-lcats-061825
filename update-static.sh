#!/bin/bash

# Quick update script for frontend changes with build process
# Use this when you only changed frontend files

echo "🔄 Updating frontend with build process..."

cd ~/apps/rust-pwa-app

echo "📥 Pulling latest changes..."
git pull

echo "🏗️  Building frontend..."
./build-frontend.sh

echo "🔄 Restarting container to pick up changes..."
docker restart rust-pwa

echo "✅ Frontend updated and built!"
echo "🌐 App is running at: http://$(curl -s ifconfig.me)"
