#!/bin/bash

# Script to start the academia-dl app locally
# Usage: ./start.sh

echo "Starting local academia-dl app..."

mkdir -p log
nohup bundle exec ruby app.rb > log/app.log 2>&1 &

echo "App started in background. PID: $!"