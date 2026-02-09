#!/bin/bash

# Clean up all Kubernetes resources
echo "Cleaning up Kubernetes resources..."
kubectl delete svc,deployments,pods,pvc,configmaps,secrets --all --force --grace-period=0 2>/dev/null || true

# Wait a moment for cleanup to complete
sleep 5

# Uninstall any existing releases
echo "Uninstalling any existing Helm releases..."
helm list
helm uninstall todo-chatbot 2>/dev/null || true

# Validate the Helm chart
echo "Validating Helm chart..."
helm lint ./helm

if [ $? -eq 0 ]; then
    echo "Helm chart validation passed. Installing..."
    # Install the Helm chart
    helm install todo-chatbot ./helm
else
    echo "Helm chart validation failed. Please fix the errors above."
    exit 1
fi

# Show the status of the deployment
echo "Checking deployment status..."
kubectl get pods
kubectl get svc