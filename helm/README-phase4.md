\# Phase 4: Local Kubernetes Deployment



\## Setup

1\. Start Minikube

minikube start --driver=docker



2\. Build Docker image (optional, if not using Helm image)

docker build -t your-nextjs-image:latest .



3\. Install Helm chart

helm install todo-chatbot ./helm



4\. Access the app

kubectl port-forward svc/nextjs-service 3000:3000



Open http://localhost:3000



\## kubectl-ai Examples

kubectl-ai "scale nextjs-app to 3"

kubectl-ai "check pod health"

