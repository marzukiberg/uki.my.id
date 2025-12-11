#!/bin/bash

# Deployment script for ukay.dev

set -e

# Configuration
SERVER_HOST="stb-local"
SERVER_PATH="/mnt/sdcard/stb/apps/ukay.dev"

echo "🚀 Starting deployment..."

# Build locally
echo "📦 Building..."
pnpm build

# Sync files to server using rsync
echo "📤 Syncing files to server..."
rsync -avz --exclude='node_modules' --exclude='.git' \
    .next public package.json next.config.js ecosystem.config.js \
    pages components lib styles hooks utils middleware.js scripts \
    "$SERVER_HOST:$SERVER_PATH/"

# Deploy on server
echo "🚀 Deploying..."
ssh "$SERVER_HOST" << ENDSSH
    cd $SERVER_PATH
    
    # Check and install Chromium if needed (ARM64 support)
    if ! command -v chromium-browser &> /dev/null && ! command -v chromium &> /dev/null; then
        echo "📥 Installing Chromium for ARM64..."
        sudo apt-get update
        sudo apt-get install -y chromium-browser
    fi
    
    # Stop PM2 service
    pm2 delete ukay.dev 2>/dev/null || true
    pm2 save
    
    # Install dependencies
    pnpm install --prod
    
    # Start service
    pm2 start ecosystem.config.js
    pm2 save
    
    echo ""
    echo "✅ Deployment complete!"
    pm2 logs ukay.dev --lines 10 --nostream
ENDSSH

echo ""
echo "🎉 Done! https://ukay.dev"