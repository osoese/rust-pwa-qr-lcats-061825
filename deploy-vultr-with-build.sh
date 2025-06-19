#!/bin/bash

# Updated deployment script with Node.js for frontend building

set -e

echo "🚀 Starting Rust PWA deployment with frontend build process..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages including Node.js
echo "🔧 Installing essential packages..."
sudo apt install -y git curl wget ufw

# Install Node.js (latest LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

sudo usermod -aG docker $USER

echo "🔒 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

mkdir -p ~/apps
cd ~/apps

echo "📥 Setting up private repository access..."
read -p "GitHub Username: " GITHUB_USER
read -p "Repository Name: " REPO_NAME
read -s -p "GitHub Token: " GITHUB_TOKEN
echo

REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "🔄 Cloning repository..."
git clone "$REPO_URL" rust-pwa-app
cd rust-pwa-app

echo "🏗️  Building frontend..."
chmod +x build-frontend.sh
./build-frontend.sh

echo "🏗️  Building Docker image..."
docker build -t rust-pwa-app .

echo "🛑 Stopping any existing containers..."
docker stop rust-pwa 2>/dev/null || true
docker rm rust-pwa 2>/dev/null || true

echo "🚀 Starting application with volume mount..."
docker run -d \
    -p 80:8080 \
    -v "$(pwd)/static:/app/static" \
    --name rust-pwa \
    --restart unless-stopped \
    rust-pwa-app

SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "✅ Deployment with frontend build completed!"
echo ""
echo "🌐 Your app is running at: http://$SERVER_IP"
echo ""
echo "🔥 Development workflow:"
echo "   Local dev: cd frontend && npm run dev"
echo "   Build: ./build-frontend.sh"
echo "   Deploy: git push && ./update-app.sh"
echo ""
echo "🔧 Quick updates:"
echo "   Frontend only: ./update-static.sh"
echo "   Full rebuild: ./update-app.sh"
