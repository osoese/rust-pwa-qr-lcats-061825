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
echo "🔒 Opening port 3003 in firewall..."
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

echo "🏗️  Building QR PWA frontend..."
chmod +x build-frontend.sh
./build-frontend.sh

echo "🏗️  Building QR PWA Docker image..."
docker build -t qr-pwa-app .

echo "🛑 Stopping any existing QR PWA containers..."
docker stop qr-pwa-app 2>/dev/null || true
docker rm qr-pwa-app 2>/dev/null || true

echo "🚀 Starting QR PWA application on port 3003..."
docker run -d \
    -p 3003:3003 \
    -v "$(pwd)/static:/app/static" \
    --name qr-pwa-app \
    --restart unless-stopped \
    qr-pwa-app

SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo ""
echo "✅ QR PWA deployment completed!"
echo ""
echo "🌐 Your apps are now running at:"
echo "   Main app:     http://$SERVER_IP"
echo "   QR PWA app:   http://$SERVER_IP:3003"
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

# Offer to set up nginx reverse proxy
read -p "Set up nginx reverse proxy for cleaner URLs? (y/n): " SETUP_NGINX

if [[ $SETUP_NGINX =~ ^[Yy]$ ]]; then
    echo "🌐 Setting up nginx reverse proxy..."
    
    # Install nginx if not already installed
    if ! command -v nginx &> /dev/null; then
        echo "Installing nginx..."
        sudo apt update
        sudo apt install -y nginx
        sudo systemctl enable nginx
        sudo systemctl start nginx
    fi
    
    read -p "Enter path for QR app (e.g., '/qr' for yourdomain.com/qr): " QR_PATH
    
    # Create nginx config for QR app
    NGINX_CONF="/etc/nginx/sites-available/default"
    
    # Backup original config
    sudo cp $NGINX_CONF "${NGINX_CONF}.backup" 2>/dev/null || true
    
    # Add location block for QR app
    sudo tee -a $NGINX_CONF > /dev/null <<EOF

    # QR PWA App
    location $QR_PATH {
        proxy_pass http://localhost:3003;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Handle trailing slashes
        rewrite ^$QR_PATH/?(.*) /\$1 break;
    }
EOF
    
    # Test and reload nginx
    if sudo nginx -t; then
        sudo systemctl reload nginx
        echo "✅ Nginx configuration updated!"
        echo "   Access QR PWA via: http://$SERVER_IP$QR_PATH"
    else
        echo "❌ Nginx configuration error. Check manually."
        sudo cp "${NGINX_CONF}.backup" $NGINX_CONF 2>/dev/null || true
    fi
fi

echo ""
echo "🎉 Setup complete! Both apps are running on the same server."
