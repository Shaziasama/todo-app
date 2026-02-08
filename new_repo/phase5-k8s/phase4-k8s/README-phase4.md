# Phase 4: Local Kubernetes Deployment

This document describes how to deploy the Phase 3 Chatbot application to a local Kubernetes cluster using Minikube and Helm.

## Prerequisites

- Docker
- Minikube
- kubectl
- Helm

## Setup Instructions

1. Start Minikube:
   ```bash
   minikube start --driver=docker
   ```

2. Build the Docker image for the Next.js application:
   ```bash
   # Make sure you're in the phase4-k8s directory
   cd phase4-k8s
   
   # Build the Docker image
   docker build -t phase4-chatbot:latest .
   ```

3. Install the Helm chart:
   ```bash
   helm install todo-chatbot ./helm
   ```

4. Access the application:
   ```bash
   kubectl port-forward svc/nextjs-app-service 3000:3000
   ```
   
   Then navigate to http://localhost:3000 in your browser.

## kubectl-ai Examples

Here are some useful kubectl commands for managing the deployment:

- Check the status of all pods:
  ```bash
  kubectl get pods
  ```

- Scale the nextjs-app deployment to 3 replicas:
  ```bash
  kubectl scale deployment/nextjs-app-deployment --replicas=3
  ```

- Check the health of all pods:
  ```bash
  kubectl get pods -l app=nextjs-app
  kubectl get pods -l app=localai
  ```

- View logs for the nextjs-app:
  ```bash
  kubectl logs deployment/nextjs-app-deployment
  ```

- View logs for LocalAI:
  ```bash
  kubectl logs deployment/localai-deployment
  ```

## Troubleshooting

- If you get an ImagePullBackOff error, make sure to build the Docker image in the Minikube environment:
  ```bash
  # Set Docker environment to Minikube
  eval $(minikube docker-env)
  
  # Build the image
  docker build -t phase4-chatbot:latest .
  ```

- If the application is not accessible, check the service status:
  ```bash
  kubectl get services
  ```

- Check all resources created by the Helm release:
  ```bash
  kubectl get all -l app=nextjs-app
  kubectl get all -l app=localai
  ```