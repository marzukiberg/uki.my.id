#!/bin/bash

# Deployment script for ukay.dev

set -e

# Configuration
SERVER_HOST="stb-local"
SERVER_PATH="/mnt/sdcard/stb/apps/ukay.dev"
ARCHIVE_NAME="ukay.dev-deploy.tar.xz"

echo "🚀 Starting deployment..."

# Build locally
echo "📦 Building..."
pnpm build

# Clean old archive if exists
echo "🧹 Cleaning old archive..."
rm -f "$ARCHIVE_NAME"

# Create archive
echo "📦 Creating archive..."
tar --exclude='node_modules' --exclude='.git' -cJf "$ARCHIVE_NAME" \
    .next public package.json next.config.js ecosystem.config.js \
    pages components lib styles hooks utils middleware.js scripts

# Transfer archive to server
echo "📤 Transferring archive..."
scp "$ARCHIVE_NAME" "$SERVER_HOST:$SERVER_PATH/"

# Deploy on server
echo "🚀 Deploying..."
ssh "$SERVER_HOST" << ENDSSH
    cd $SERVER_PATH
    
    # Stop PM2 service
    pm2 delete ukay.dev 2>/dev/null || true
    pm2 save
    
    # Clean directory except archive
    find . -mindepth 1 ! -name '$ARCHIVE_NAME' -delete
    
    # Extract archive
    tar -xJf $ARCHIVE_NAME
    rm $ARCHIVE_NAME
    
    # Install dependencies
    pnpm install --prod
    
    # Start service
    pm2 start ecosystem.config.js
    pm2 save
    
    echo ""
    echo "✅ Deployment complete!"
    pm2 logs ukay.dev --lines 10 --nostream
ENDSSH

# Clean local archive
rm -f "$ARCHIVE_NAME"

echo ""
echo "🎉 Done! https://ukay.dev"