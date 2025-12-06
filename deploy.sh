#!/bin/bash

# Deployment script for ukay.dev
# This script builds the Next.js app locally, archives the build artifacts,
# copies them to the server, extracts them, and restarts the PM2 service.

set -e  # Exit on any error

# Configuration
APP_NAME="ukay.dev"
SERVER_HOST="stb-server"
SERVER_PATH="/mnt/sdcard/stb/docker/ukay.dev"
BUILD_DIR=".next"
PUBLIC_DIR="public"
PACKAGE_FILE="package.json"
NEXT_CONFIG_FILE="next.config.js"
ARCHIVE_NAME="build-artifacts.tar.xz"

echo "🚀 Starting deployment for $APP_NAME..."

# Step 1: Build locally
echo "📦 Building Next.js application..."
pnpm build

# Step 2: Create archive of build artifacts
echo "📦 Creating archive of build artifacts..."
tar -cJf "$ARCHIVE_NAME" \
    "$BUILD_DIR" \
    "$PUBLIC_DIR" \
    "$PACKAGE_FILE" \
    "$NEXT_CONFIG_FILE" \
    "scripts"

echo "✅ Archive created: $ARCHIVE_NAME"

# Step 3: Copy archive to server
echo "📤 Copying archive to server..."
scp "$ARCHIVE_NAME" "$SERVER_HOST:$SERVER_PATH/"

# Step 4: Extract archive on server and clean up
echo "📦 Extracting archive on server..."
ssh "$SERVER_HOST" "cd '$SERVER_PATH' && \
    echo 'Extracting $ARCHIVE_NAME...' && \
    tar -xJf '$ARCHIVE_NAME' && \
    echo 'Cleaning up archive...' && \
    rm '$ARCHIVE_NAME' && \
    echo '✅ Archive extracted and cleaned up'"

# Step 5: Restart PM2 service
echo "🔄 Restarting PM2 service..."
ssh "$SERVER_HOST" "pm2 restart $APP_NAME"

# Step 6: Clean up local archive
echo "🧹 Cleaning up local archive..."
rm "$ARCHIVE_NAME"

echo "🎉 Deployment completed successfully!"
echo "🌐 Your app should be live at: https://ukay.dev"
echo ""
echo "📊 To check logs: ssh $SERVER_HOST 'pm2 logs $APP_NAME --lines 10'"
echo "🔍 To check status: ssh $SERVER_HOST 'pm2 status'"