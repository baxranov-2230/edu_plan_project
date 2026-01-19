#!/bin/bash

# Deploy script for EduPlan Project

echo "🚀 Starting deployment..."

# Check if docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ Docker could not be found. Please install Docker first."
    exit 1
fi

# Check for environment files
if [ ! -f backend/.env ]; then
    echo "⚠️  backend/.env not found! Creating from .env.example..."
    cp backend/.env.example backend/.env
fi

if [ ! -f frontend/.env ]; then
    echo "⚠️  frontend/.env not found! Creating from .env.example..."
    cp frontend/.env.example frontend/.env
fi

echo "🏗️  Building and starting containers..."
docker compose down
docker compose up -d --build

echo "✅ Deployment complete!"

# Attempt to get public IP, fallback to localhost
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
    SERVER_IP="localhost"
fi

echo "----------------------------------------"
echo "🌐 Access your application at:"
echo "Frontend:      http://$SERVER_IP"
echo "Backend API:   http://$SERVER_IP/rest/api/v1"
echo "Swagger Docs:  http://$SERVER_IP/rest/docs"
echo "----------------------------------------"
