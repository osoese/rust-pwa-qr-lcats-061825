#!/bin/bash

# Management script for both apps on Vultr server

echo "🎛️  Server App Management"
echo "=========================="

SERVER_IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')

echo "🌐 Current running apps:"
echo "   Main app:     http://$SERVER_IP (port 80)"
echo "   QR PWA app:   http://$SERVER_IP:3030"
echo ""

echo "📊 Container Status:"
echo "Main app (rust-pwa):"
docker ps --filter "name=rust-pwa" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "   Not running"

echo "QR PWA app (qr-pwa-app):"
docker ps --filter "name=qr-pwa-app" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "   Not running"

echo ""
echo "🔧 Available commands:"
echo ""
echo "Main App:"
echo "   cd ~/apps/rust-pwa-app && ./update-app.sh      - Full update"
echo "   cd ~/apps/rust-pwa-app && ./update-static.sh   - Frontend only"
echo "   docker logs rust-pwa                           - View logs"
echo "   docker restart rust-pwa                        - Restart"
echo ""
echo "QR PWA App:"
echo "   cd ~/apps/qr-pwa-app && ./update-qr-app.sh     - Full update"
echo "   cd ~/apps/qr-pwa-app && ./update-qr-static.sh  - Frontend only"
echo "   docker logs qr-pwa-app                         - View logs"
echo "   docker restart qr-pwa-app                      - Restart"
echo ""
echo "Both Apps:"
echo "   docker ps                                       - List all containers"
echo "   docker stats                                    - Resource usage"
echo "   df -h                                          - Disk usage"
echo ""

# Interactive menu
while true; do
    echo "Choose an action:"
    echo "1) View main app logs"
    echo "2) View QR PWA logs"
    echo "3) Restart main app"
    echo "4) Restart QR PWA"
    echo "5) Update main app"
    echo "6) Update QR PWA"
    echo "7) Show resource usage"
    echo "8) Exit"
    
    read -p "Enter choice (1-8): " choice
    
    case $choice in
        1)
            echo "📋 Main app logs (last 50 lines):"
            docker logs --tail 50 rust-pwa 2>/dev/null || echo "Container not found"
            ;;
        2)
            echo "📋 QR PWA logs (last 50 lines):"
            docker logs --tail 50 qr-pwa-app 2>/dev/null || echo "Container not found"
            ;;
        3)
            echo "🔄 Restarting main app..."
            docker restart rust-pwa 2>/dev/null && echo "✅ Restarted" || echo "❌ Failed"
            ;;
        4)
            echo "🔄 Restarting QR PWA..."
            docker restart qr-pwa-app 2>/dev/null && echo "✅ Restarted" || echo "❌ Failed"
            ;;
        5)
            echo "🔄 Updating main app..."
            cd ~/apps/rust-pwa-app && ./update-app.sh
            ;;
        6)
            echo "🔄 Updating QR PWA..."
            cd ~/apps/qr-pwa-app && ./update-qr-app.sh
            ;;
        7)
            echo "📊 Resource usage:"
            docker stats --no-stream
            ;;
        8)
            echo "👋 Goodbye!"
            break
            ;;
        *)
            echo "❌ Invalid choice"
            ;;
    esac
    echo ""
done
