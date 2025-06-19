#!/bin/bash

# Deploy QR PWA as second app on existing Vultr server
# This assumes Docker and Node.js are already installed from first app

set -e

echo "🚀 Deploying QR PWA as second app on existing server..."

# Create separate directory for QR app
echo "📁 Creating QR app directory..."
mkdir -p ~/apps/qr-pwa-app
cd ~/apps/qr-pwa-app

# Configure firewall for new port
echo "🔒 Opening port 3003 for QR app (HTTPS)..."
sudo ufw allow 3003/tcp

echo "📥 Setting up repository access for QR PWA..."
read -p "GitHub Username: " GITHUB_USER
read -p "Repository Name (QR PWA): " REPO_NAME
read -s -p "GitHub Token: " GITHUB_TOKEN
echo

if [ -z "$GITHUB_USER" ] || [ -z "$REPO_NAME" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ All fields are required. Exiting."
    exit 1
fi

REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "🔄 Cloning QR PWA repository..."
git clone "$REPO_URL" .

echo "🔐 Setting up SSL certificates for Rust app..."
mkdir -p ssl
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

# Generate self-signed SSL certificate for Rust app
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/key.pem \
    -out ssl/cert.pem \
    -subj "/C=US/ST=State/L=City/O=Organization/CN=$SERVER_IP"

echo "✅ SSL certificates generated for Rust app"

echo "🏗️  Building QR PWA frontend..."
chmod +x build-frontend.sh
./build-frontend.sh

echo "🏗️  Building QR PWA Docker image..."
docker build -t qr-pwa-app .

echo "🛑 Stopping any existing QR PWA containers..."
docker stop qr-pwa-app 2>/dev/null || true
docker rm qr-pwa-app 2>/dev/null || true

echo "🚀 Starting QR PWA application with HTTPS on port 3003..."
docker run -d \
    -p 3003:3003 \
    -v "$(pwd)/static:/app/static" \
    -v "$(pwd)/ssl:/app/ssl" \
    --name qr-pwa-app \
    --restart unless-stopped \
    qr-pwa-app

SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "✅ QR PWA deployment completed!"
echo ""
echo "🌐 Your apps are now running at:"
echo "   Main app:     http://$SERVER_IP"
echo "   QR PWA app:   https://$SERVER_IP:3003 (HTTPS for camera access)"
echo ""
echo "🔐 SSL Certificate Info:"
echo "   Self-signed certificate generated for IP: $SERVER_IP"
echo "   Browsers will show a security warning - click 'Advanced' and 'Proceed'"
echo "   This is normal for self-signed certificates and required for camera access"
echo ""
echo "🔥 QR PWA development workflow:"
echo "   Local dev: cd frontend && npm run dev"
echo "   Build: ./build-frontend.sh"
echo "   Deploy: git push && ./update-qr-app.sh"
echo ""
echo "🔧 QR PWA management commands:"
echo "   Frontend only: ./update-qr-static.sh"
echo "   Full rebuild: ./update-qr-app.sh"
echo "   Check logs: docker logs qr-pwa-app"
echo ""
echo "📱 Camera Access Notes:"
echo "   - App now runs with native Rust HTTPS support"
echo "   - No nginx required - Rust handles SSL directly"
echo "   - Self-signed certificates show browser warnings (safe to proceed)"
echo "   - Mobile browsers enforce HTTPS for camera access"
echo ""

echo ""
echo "� Setup complete! QR PWA app is running with native Rust HTTPS."
