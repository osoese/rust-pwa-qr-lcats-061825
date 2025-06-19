#!/bin/bash

# Quick script to pull latest changes and update QR PWA app
echo "🔄 Pulling latest QR PWA changes and updating..."

# Go to QR PWA directory
cd ~/apps/qr-pwa-app || {
    echo "❌ QR PWA app directory not found at ~/apps/qr-pwa-app"
    echo "💡 Run the deployment script first: ./deploy-qr-vultr.sh"
    exit 1
}

# Pull latest changes
echo "📥 Pulling latest changes from repository..."
git pull

# Make sure all scripts are executable
echo "🔧 Making scripts executable..."
chmod +x *.sh

# Update the running app
echo "🚀 Updating running application..."
./update-qr-app.sh

echo "✅ QR PWA update completed!"

# Show status
echo ""
echo "📊 Current status:"
docker ps | grep qr-pwa-app || echo "❌ QR PWA container not running"

# Show access URL
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
echo "🌐 Access your QR PWA at: http://$SERVER_IP:3003"
