#!/bin/bash

# Script to port-forward the service for local access

echo "Forwarding port 3000 to nextjs-app-service..."
kubectl port-forward svc/nextjs-app-service 3000:3000

echo "Port forwarding stopped."