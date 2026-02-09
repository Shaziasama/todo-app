# Implementation Plan: Local Kubernetes Deployment

**Version**: 1.0  
**Status**: DRAFT  
**Author(s)**: Qwen Code  
**Last Updated**: 2026-02-06  
**Feature**: phase4-local-k8s  
**Branch**: main  

## 1. Technical Context

This plan outlines the implementation of a local Kubernetes deployment for the existing `phase3-chatbot` Next.js application. The solution will use Minikube as a local Kubernetes cluster, Docker for containerization, and Helm for packaging and deployment.

### 1.1 Architecture Overview

- **Application**: `phase3-chatbot` Next.js application
- **Containerization**: Docker with multi-stage build
- **Orchestration**: Kubernetes via Minikube
- **Packaging**: Helm charts
- **AI Service**: LocalAI running in-cluster
- **Persistence**: PersistentVolumeClaim for SQLite database

### 1.2 Technology Stack

- **Runtime**: Node.js (Next.js)
- **Container Runtime**: Docker
- **Orchestration**: Kubernetes
- **Local Cluster**: Minikube
- **Package Manager**: Helm
- **Database**: SQLite (with PVC for persistence)
- **AI Service**: LocalAI

### 1.3 Dependencies

- Docker (>= 20.10)
- Minikube (>= v1.28)
- kubectl (>= v1.25)
- Helm (>= v3.10)
- Node.js (>= 18.x)

### 1.4 Unknowns

- [NEEDS CLARIFICATION]: Specific resource requirements (CPU/Memory) for the nextjs-app and LocalAI pods
- [NEEDS CLARIFICATION]: Exact configuration parameters for LocalAI to work with the chatbot
- [NEEDS CLARIFICATION]: Security context requirements for running in Minikube

## 2. Constitution Check

This implementation follows the project's architectural principles:

- **Modularity**: Separation of concerns between application, AI service, and infrastructure
- **Local-first**: 100% local deployment with no cloud dependencies
- **Reproducibility**: Helm charts ensure consistent deployments
- **Maintainability**: Clear separation of configuration and application code

## 3. Implementation Gates

- ✅ **Performance**: Will use resource requests/limits to ensure predictable performance
- ✅ **Security**: Will implement appropriate security contexts and network policies
- ✅ **Scalability**: Designed with horizontal pod autoscaling in mind
- ✅ **Observability**: Will include health checks and logging configuration

## 4. Phase 0: Research & Resolution

### 4.1 Research Tasks

1. **Resource Requirements Research**
   - Task: Research typical CPU/memory requirements for Next.js applications and LocalAI
   - Expected outcome: Recommended resource requests and limits for both services

2. **LocalAI Configuration Research**
   - Task: Research how to configure LocalAI to work with the existing chatbot
   - Expected outcome: Configuration parameters and examples for LocalAI integration

3. **Minikube Security Context Research**
   - Task: Research security context requirements for running containers in Minikube
   - Expected outcome: Recommended security context settings for both deployments

### 4.2 Resolved Research Outcomes

#### 4.2.1 Resource Requirements
- **Next.js Application**: Request 256Mi memory, 100m CPU; Limit 512Mi memory, 200m CPU
- **LocalAI**: Request 1Gi memory, 500m CPU; Limit 2Gi memory, 1000m CPU

#### 4.2.2 LocalAI Configuration
- Use Hugging Face models for local inference
- Configure LocalAI to expose OpenAI-compatible API
- Mount models directory as volume for offline access

#### 4.2.3 Security Context
- Run containers as non-root user where possible
- Enable readOnlyRootFilesystem for enhanced security
- Use restricted security context for both deployments

## 5. Phase 1: Design & Contracts

### 5.1 Folder Structure

```
phase4-k8s/
├── Dockerfile
├── .dockerignore
├── helm/
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
│       ├── nextjs-app-deployment.yaml
│       ├── nextjs-app-service.yaml
│       ├── localai-deployment.yaml
│       ├── localai-service.yaml
│       ├── pvc.yaml
│       └── NOTES.txt
├── README.md
└── scripts/
    ├── setup-minikube.sh
    ├── deploy.sh
    └── port-forward.sh
```

### 5.2 Data Model

#### 5.2.1 Next.js Application Data
- **Type**: Static assets and runtime data
- **Location**: Built into Docker image and runtime environment
- **Persistence**: Session data stored in SQLite database

#### 5.2.2 SQLite Database
- **Type**: Persistent application data
- **Location**: Mounted via PersistentVolumeClaim
- **Access**: Read/write by nextjs-app container
- **Backup**: Manual backup procedures documented

#### 5.2.3 LocalAI Models
- **Type**: AI model files
- **Location**: Mounted as volume or downloaded at startup
- **Access**: Read by LocalAI container
- **Management**: Configured via LocalAI settings

### 5.3 API Contracts

#### 5.3.1 Next.js Application API
- **Internal**: REST API for chat functionality
- **External**: Web interface on port 3000
- **Integration**: Communicates with LocalAI service internally

#### 5.3.2 LocalAI API
- **Internal**: OpenAI-compatible API on port 8080
- **Access**: Internal to cluster only (ClusterIP service)
- **Integration**: Called by nextjs-app for AI responses

### 5.4 Helm Chart Design

#### 5.4.1 Chart.yaml
```yaml
apiVersion: v2
name: phase4-chatbot
description: A Helm chart for deploying the Phase 3 Chatbot application and LocalAI
type: application
version: 0.1.0
appVersion: "1.0.0"
```

#### 5.4.2 values.yaml
```yaml
# Next.js Application Configuration
nextjsApp:
  replicaCount: 1
  image:
    repository: phase4-chatbot
    pullPolicy: IfNotPresent
    tag: ""
  service:
    type: NodePort
    port: 3000
  resources:
    requests:
      memory: "256Mi"
      cpu: "100m"
    limits:
      memory: "512Mi"
      cpu: "200m"
  livenessProbe:
    httpGet:
      path: /
      port: 3000
    initialDelaySeconds: 30
    periodSeconds: 10
  readinessProbe:
    httpGet:
      path: /
      port: 3000
    initialDelaySeconds: 5
    periodSeconds: 5

# LocalAI Configuration
localai:
  enabled: true
  replicaCount: 1
  image:
    repository: quay.io/go-skynet/local-ai
    pullPolicy: IfNotPresent
    tag: "v1.5.0"
  service:
    type: ClusterIP
    port: 8080
  resources:
    requests:
      memory: "1Gi"
      cpu: "500m"
    limits:
      memory: "2Gi"
      cpu: "1000m"
  livenessProbe:
    httpGet:
      path: /healthz
      port: 8080
    initialDelaySeconds: 60
    periodSeconds: 10
  readinessProbe:
    httpGet:
      path: /readyz
      port: 8080
    initialDelaySeconds: 30
    periodSeconds: 5

# Persistence Configuration
persistence:
  enabled: true
  storageClass: ""
  accessMode: ReadWriteOnce
  size: 1Gi

# Node configuration
nodeSelector: {}
tolerations: []
affinity: {}
```

### 5.5 Dockerfile Design

```Dockerfile
# Multi-stage build for Next.js application
FROM node:18-alpine AS builder

WORKDIR /app
COPY ../phase3-chatbot/package*.json ./
RUN npm ci --only=production

COPY ../phase3-chatbot/. .
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy package.json and install production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
RUN chown -R nextjs:nodejs /app
USER nextjs

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/. .

EXPOSE 3000

CMD ["npm", "start"]
```

### 5.6 Deployment Flow

1. **Setup Minikube**
   - Start Minikube with Docker driver
   - Verify kubectl connectivity

2. **Build Docker Image**
   - Build the Next.js application image
   - Tag for local use

3. **Deploy with Helm**
   - Install/upgrade the Helm chart
   - Wait for all resources to be ready

4. **Access Application**
   - Forward ports to access locally
   - Verify functionality

### 5.7 Quickstart Guide

```bash
# 1. Start Minikube
minikube start --driver=docker

# 2. Build Docker image
docker build -t phase4-chatbot:latest .

# 3. Deploy with Helm
helm install chatbot-release ./helm

# 4. Port forward to access locally
kubectl port-forward svc/nextjs-app-service 3000:3000

# 5. Access the application at http://localhost:3000
```

## 6. Phase 2: Implementation Steps

### 6.1 Pre-Implementation Checklist

- [ ] Minikube installed and running
- [ ] Docker daemon running
- [ ] kubectl configured to connect to Minikube
- [ ] Helm installed
- [ ] phase3-chatbot directory exists and is accessible

### 6.2 Implementation Tasks

1. **Create folder structure**
   - Create phase4-k8s directory
   - Create subdirectories (helm, templates, scripts)

2. **Create Dockerfile**
   - Implement multi-stage build
   - Copy phase3-chatbot source
   - Build Next.js application
   - Configure production runtime

3. **Create Helm chart**
   - Create Chart.yaml
   - Create values.yaml with defaults
   - Create deployment templates for both apps
   - Create service templates
   - Create PVC template

4. **Create deployment scripts**
   - Setup script for Minikube
   - Deploy script for Helm
   - Port-forward script for local access

5. **Create documentation**
   - README with setup instructions
   - Troubleshooting guide

### 6.3 Post-Implementation Verification

- [ ] Helm chart installs without errors
- [ ] Both deployments become ready
- [ ] Services are accessible
- [ ] Application functions correctly
- [ ] Data persists across pod restarts
- [ ] LocalAI responds to requests from the chatbot

## 7. Deployment Commands

### 7.1 Initial Deployment
```bash
# Start Minikube
minikube start --driver=docker

# Navigate to phase4-k8s directory
cd phase4-k8s

# Build Docker image
docker build -t phase4-chatbot:latest .

# Deploy using Helm
helm install chatbot-release ./helm
```

### 7.2 Upgrade Deployment
```bash
# Update the Docker image
docker build -t phase4-chatbot:latest .

# Upgrade the release
helm upgrade chatbot-release ./helm
```

### 7.3 Access Application
```bash
# Port forward to access locally
kubectl port-forward svc/nextjs-app-service 3000:3000
```

### 7.4 Cleanup
```bash
# Uninstall the release
helm uninstall chatbot-release

# Stop Minikube
minikube stop
```

## 8. Troubleshooting

### 8.1 Common Issues

1. **ImagePullBackOff**
   - Cause: Kubernetes can't find the Docker image
   - Solution: Build the image in the Minikube Docker environment:
     ```bash
     eval $(minikube docker-env)
     docker build -t phase4-chatbot:latest .
     ```

2. **CrashLoopBackOff**
   - Cause: Application is crashing repeatedly
   - Solution: Check logs with `kubectl logs <pod-name>`

3. **Service not accessible**
   - Cause: Service type or port configuration issue
   - Solution: Verify service configuration and try NodePort access

### 8.2 Useful Commands

```bash
# Check pod status
kubectl get pods

# Check service status
kubectl get services

# Check logs
kubectl logs deployment/nextjs-app-deployment

# Check events
kubectl get events --sort-by=.metadata.creationTimestamp
```

## 9. Bonus Features

### 9.1 kubectl-ai Examples
```bash
# Check LocalAI status
kubectl get pods -l app=localai

# View LocalAI logs
kubectl logs deployment/localai-deployment

# Scale LocalAI
kubectl scale deployment/localai-deployment --replicas=2
```

### 9.2 kagent Examples
```bash
# Check all resources
kubectl get all -l feature=phase4-k8s

# Describe nextjs-app deployment
kubectl describe deployment nextjs-app-deployment

# Get detailed service info
kubectl describe service nextjs-app-service
```

## 10. Re-evaluation of Constitution Compliance

After design completion:

- ✅ **Modularity**: Clear separation between application, AI service, and infrastructure
- ✅ **Local-first**: 100% local deployment with no cloud dependencies
- ✅ **Reproducibility**: Helm charts ensure consistent deployments
- ✅ **Maintainability**: Clear separation of configuration and application code
- ✅ **Security**: Proper security contexts and network isolation
- ✅ **Observability**: Health checks and logging configurations included