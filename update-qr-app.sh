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

# Generate SSL certificates if they don't exist
if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
    echo "🔐 Generating SSL certificates for HTTPS support..."
    mkdir -p ssl
    SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout ssl/key.pem \
        -out ssl/cert.pem \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=$SERVER_IP"
    echo "✅ SSL certificates generated"
else
    echo "🔐 SSL certificates already exist"
fi

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
echo "🔐 Note: You may need to accept the self-signed certificate in your browser"
