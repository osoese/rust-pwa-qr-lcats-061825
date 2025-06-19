#!/bin/bash

# Volume-based deployment script for hot-swapping static files
# Run this script on your Vultr VPS for the initial setup

set -e

echo "🚀 Setting up volume-based Rust PWA deployment..."

# Same initial setup as before...
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

echo "🔧 Installing essential packages..."
sudo apt install -y git curl wget ufw

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
echo "✅ Volume-based deployment completed!"
echo ""
echo "🌐 Your app is running at: http://$SERVER_IP"
echo ""
echo "🔥 Hot-swap workflow for static file changes:"
echo "   1. cd ~/apps/rust-pwa-app"
echo "   2. git pull"
echo "   3. docker restart rust-pwa"
echo ""
echo "🔧 For Rust code changes, use: ./update-app.sh"
