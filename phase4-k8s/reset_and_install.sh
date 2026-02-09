#!/bin/bash

# List all Helm releases
echo "Listing all Helm releases:"
helm list -a

# Force delete any remaining Helm releases
echo "Force deleting any remaining Helm releases..."
helm uninstall todo-chatbot --no-hooks || true

# If that doesn't work, try to purge using Helm's storage
helm list --short | grep todo-chatbot | xargs -r helm uninstall --no-hooks

# Clean up all Kubernetes resources
echo "Cleaning up Kubernetes resources..."
kubectl delete svc,deployments,pods,pvc,configmaps,secrets --all --force --grace-period=0 2>/dev/null || true

# Wait for cleanup
sleep 5

# Try to install again
echo "Installing Helm chart..."
helm install todo-chatbot ./helm

# Check the status
echo "Checking deployment status..."
kubectl get pods
kubectl get svc