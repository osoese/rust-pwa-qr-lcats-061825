#!/bin/bash

# Build script for frontend
echo "🏗️  Building frontend..."

cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build for production
echo "📦 Building for production..."
npm run build

echo "✅ Frontend build complete!"
echo "📁 Files built to static/ directory"

# Copy additional PWA files
echo "📋 Copying PWA manifest and service worker..."
cp ../static/manifest.json ../static/service-worker.js ../static/ 2>/dev/null || echo "⚠️  PWA files not found, using defaults"

cd ..
