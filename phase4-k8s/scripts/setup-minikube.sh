#!/bin/bash

# Script to setup Minikube for the Phase 4 deployment

echo "Starting Minikube with Docker driver..."
minikube start --driver=docker

echo "Setting Docker environment to Minikube..."
eval $(minikube docker-env)

echo "Minikube setup complete!"