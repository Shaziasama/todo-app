#!/bin/bash

# Script to deploy the application using Helm

echo "Building Docker image..."
docker build -t phase4-chatbot:latest .

echo "Installing/upgrading Helm chart..."
helm upgrade --install todo-chatbot ./helm

echo "Deployment complete! Run 'kubectl get pods' to check status."