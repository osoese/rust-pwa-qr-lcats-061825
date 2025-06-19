#!/bin/bash

# Quick update script for Rust PWA
# Run this when you want to deploy new changes

set -e

echo "🔄 Updating Rust PWA application..."

cd ~/apps/rust-pwa-app

# Pull latest changes
echo "📥 Pulling latest changes from git..."
git pull

# Rebuild image
echo "🏗️  Rebuilding Docker image..."
docker build -t rust-pwa-app .

# Update running container
echo "🔄 Updating running container..."
docker stop rust-pwa
docker rm rust-pwa
docker run -d \
    -p 80:8080 \
    --name rust-pwa \
    --restart unless-stopped \
    rust-pwa-app

echo "✅ Update completed!"
echo "🌐 App is running at: http://$(curl -s ifconfig.me)"
