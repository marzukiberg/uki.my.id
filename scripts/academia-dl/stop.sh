#!/bin/bash

# Script to stop the academia-dl app locally
# Usage: ./stop.sh

echo "Stopping local academia-dl app..."

# Kill process on port 4567
lsof -ti:4567 | xargs kill -9 2>/dev/null || echo "No process on port 4567"

# Kill ruby app.rb processes
pgrep -f 'ruby .*app.rb' | xargs kill -9 2>/dev/null || echo "No ruby app.rb running"

echo "App stopped locally."