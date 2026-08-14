#!/bin/bash

# Deployment script for ukay.dev via tar.xz

set -e

# Configuration
SERVER_HOST="stb"
SERVER_PATH="/mnt/sdcard/stb/apps/ukay.dev"
ARCHIVE_NAME="ukay.dev-deploy.tar.xz"

echo "🚀 Starting deployment..."

# Build locally
echo "📦 Building project..."
pnpm build

# Create tar.xz archive
echo "🗜️ Creating $ARCHIVE_NAME archive..."
tar -cJf "$ARCHIVE_NAME" \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next/cache' \
    .next public package.json next.config.js ecosystem.config.js \
    pages components lib styles hooks utils data middleware.js scripts

# Transfer archive and env to server
echo "📤 Uploading $ARCHIVE_NAME and env to $SERVER_HOST:$SERVER_PATH/..."
ssh "$SERVER_HOST" "mkdir -p $SERVER_PATH"
rsync -avz --progress "$ARCHIVE_NAME" "$SERVER_HOST:$SERVER_PATH/"
[ -f .env ] && rsync -avz .env "$SERVER_HOST:$SERVER_PATH/"
[ -f .env.local ] && rsync -avz .env.local "$SERVER_HOST:$SERVER_PATH/"

# Extract and run on server
echo "🚀 Extracting archive and restarting service on server..."
ssh "$SERVER_HOST" << ENDSSH
    cd $SERVER_PATH
    
    # Extract archive
    echo "📦 Extracting $ARCHIVE_NAME..."
    tar -xf $ARCHIVE_NAME
    rm -f $ARCHIVE_NAME
    
    # Ensure server points to localhost LLM endpoint
    sed -i 's|http://100.121.65.10:20128|http://127.0.0.1:20128|g' .env .env.local 2>/dev/null || true
    
    # Stop PM2 service
    pm2 delete ukay.dev 2>/dev/null || true
    pm2 save
    
    # Install dependencies
    CI=true pnpm install --prod --no-frozen-lockfile
    
    # Start service
    pm2 start ecosystem.config.js
    pm2 save
    
    echo ""
    echo "✅ Deployment complete!"
    pm2 logs ukay.dev --lines 10 --nostream
ENDSSH

# Cleanup local archive
rm -f "$ARCHIVE_NAME"

echo ""
echo "🎉 Done! https://ukay.dev"