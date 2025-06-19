#!/bin/bash

# Deploy QR PWA app on the same server as existing app
# This script assumes Docker is already installed and configured

set -e  # Exit on any error

echo "🚀 Deploying QR PWA app on existing server..."

# Create app directory for this new app
echo "📁 Creating application directory..."
mkdir -p ~/apps/qr-pwa-app
cd ~/apps/qr-pwa-app

# Prompt for repository details (for private repo)
echo "📥 Setting up repository access..."
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
if [ -d ".git" ]; then
    echo "Repository already exists, pulling latest changes..."
    git pull origin main
else
    git clone "$REPO_URL" .
fi

# Build Docker image with a unique name
echo "🏗️  Building Docker image..."
docker build -t qr-pwa-app .

# Stop existing container if it exists
echo "🛑 Stopping any existing QR PWA containers..."
docker stop qr-pwa-app 2>/dev/null || true
docker rm qr-pwa-app 2>/dev/null || true

# Run the application on port 3030
echo "🚀 Starting the QR PWA application..."
docker run -d \
    -p 3030:3030 \
    --name qr-pwa-app \
    --restart unless-stopped \
    qr-pwa-app

# Get server IP
SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "✅ QR PWA app deployment completed successfully!"
echo ""
echo "🌐 Your QR PWA app is now running at:"
echo "   http://$SERVER_IP:3030"
echo ""
echo "🔧 Useful commands for QR PWA app:"
echo "   Check logs:    docker logs qr-pwa-app"
echo "   Stop app:      docker stop qr-pwa-app"
echo "   Start app:     docker start qr-pwa-app"
echo "   Restart app:   docker restart qr-pwa-app"
echo ""
echo "📋 Both apps summary:"
echo "   Main app:      http://$SERVER_IP"
echo "   QR PWA app:    http://$SERVER_IP:3030"
echo ""

# Optional: Set up nginx reverse proxy
read -p "Do you want to set up a subdomain/path for this app using nginx? (y/n): " SETUP_NGINX

if [[ $SETUP_NGINX =~ ^[Yy]$ ]]; then
    echo "🌐 Setting up nginx reverse proxy..."
    
    # Install nginx if not already installed
    if ! command -v nginx &> /dev/null; then
        echo "Installing nginx..."
        sudo apt update
        sudo apt install -y nginx
    fi
    
    read -p "Enter subdomain or path (e.g., 'qr' for qr.yourdomain.com or '/qr' for yourdomain.com/qr): " NGINX_CONFIG
    
    if [[ $NGINX_CONFIG == /* ]]; then
        # Path-based routing
        NGINX_CONF="/etc/nginx/sites-available/default"
        echo "Adding location block to existing nginx config..."
        sudo tee -a $NGINX_CONF > /dev/null <<EOF

    location $NGINX_CONFIG {
        proxy_pass http://localhost:3030;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
EOF
    else
        # Subdomain routing
        NGINX_CONF="/etc/nginx/sites-available/$NGINX_CONFIG"
        sudo tee $NGINX_CONF > /dev/null <<EOF
server {
    listen 80;
    server_name $NGINX_CONFIG.yourdomain.com;

    location / {
        proxy_pass http://localhost:3030;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
        sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
    fi
    
    # Test and reload nginx
    sudo nginx -t && sudo systemctl reload nginx
    
    echo "✅ Nginx configuration updated!"
    if [[ $NGINX_CONFIG == /* ]]; then
        echo "   Access via: http://$SERVER_IP$NGINX_CONFIG"
    else
        echo "   Access via: http://$NGINX_CONFIG.yourdomain.com"
        echo "   Note: Make sure DNS points to your server IP"
    fi
fi
