#!/bin/bash

# Rust PWA Deployment Script for Ubuntu 24.04 LTS
# Run this script on your fresh Vultr VPS

set -e  # Exit on any error

echo "🚀 Starting Rust PWA deployment on Ubuntu 24.04..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y git curl wget ufw

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Add current user to docker group
echo "👤 Adding user to docker group..."
sudo usermod -aG docker $USER

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable

# Create app directory
echo "📁 Creating application directory..."
mkdir -p ~/apps
cd ~/apps

# Prompt for repository details (for private repo)
echo "📥 Setting up private repository access..."
read -p "GitHub Username: " GITHUB_USER
read -p "Repository Name: " REPO_NAME
read -s -p "GitHub Token: " GITHUB_TOKEN
echo

if [ -z "$GITHUB_USER" ] || [ -z "$REPO_NAME" ] || [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ All fields are required. Exiting."
    exit 1
fi

REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

# Clone repository
echo "🔄 Cloning repository..."
git clone "$REPO_URL" rust-pwa-app
cd rust-pwa-app

# Build Docker image
echo "🏗️  Building Docker image..."
docker build -t rust-pwa-app .

# Stop existing container if it exists
echo "🛑 Stopping any existing containers..."
docker stop rust-pwa 2>/dev/null || true
docker rm rust-pwa 2>/dev/null || true

# Run the application
echo "🚀 Starting the application..."
docker run -d \
    -p 80:8080 \
    --name rust-pwa \
    --restart unless-stopped \
    rust-pwa-app

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "✅ Deployment completed successfully!"
echo ""
echo "🌐 Your app is now running at:"
echo "   http://$SERVER_IP"
echo ""
echo "🔧 Useful commands:"
echo "   Check logs:    docker logs rust-pwa"
echo "   Stop app:      docker stop rust-pwa"
echo "   Start app:     docker start rust-pwa"
echo "   Restart app:   docker restart rust-pwa"
echo ""
echo "📝 Note: You may need to log out and back in for Docker permissions to take effect."
echo "   If you get permission errors, run: newgrp docker"
