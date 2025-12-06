#!/bin/bash

# Rsync script to sync academia-dl project to aws-uki server and restart the app on server
# Usage: ./sync.sh

SOURCE_DIR="$(pwd)"
DEST="aws-uki:academia-dl/"

echo "Syncing $SOURCE_DIR to $DEST"
rsync -avz --delete --exclude 'vendor/bundle' "$SOURCE_DIR/" "$DEST"

if [ $? -eq 0 ]; then
    echo "Sync completed successfully."
    echo "Restarting the app on aws-uki..."
    ssh aws-uki << 'EOF'
cd academia-dl
bundle config set path 'vendor/bundle'
bundle install
pm2 restart academia-dl || pm2 start "bundle exec ruby app.rb" --name academia-dl
EOF
else
    echo "Sync failed."
    exit 1
fi