#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
cd ./client && npm install
cd ../server && npm install

# Setup environment variables
echo "Setting up environment variables..."
cp .env.example .env

# Build the frontend application
echo "Building the frontend application..."
cd ../client && npm run build

# Start the application
echo "Starting the application..."
cd .. && npm run dev