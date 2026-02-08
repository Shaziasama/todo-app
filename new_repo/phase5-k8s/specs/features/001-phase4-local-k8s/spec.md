# Feature Specification: Local Kubernetes Deployment

**Version**: 1.0
**Status**: DRAFT
**Author(s)**: Gemini
**Last Updated**: 2024-02-04
**Feature Number**: 001
**Feature Name**: phase4-local-k8s

## 1. Overview

This document outlines the requirements for deploying the existing `phase3-chatbot` Next.js application to a local Minikube cluster using Docker and Helm. The primary goal is to create a self-contained, local development and testing environment that mirrors a production Kubernetes deployment without any cloud dependencies.

## 2. User Scenarios & Experience

As a developer, I want to:
- Easily build and deploy the `phase3-chatbot` application to a local Kubernetes cluster.
- Have a persistent database for the application to store data between deployments.
- Access the deployed application from my local machine as if it were running locally.
- Have a separate, dedicated AI service running in the cluster that the chatbot can communicate with.
- Be able to tear down and bring up the entire environment with simple commands.

## 3. Functional Requirements

### 3.1. Containerization

- A `Dockerfile` must be created in the `phase4-k8s` directory.
- The `Dockerfile` must use a multi-stage build to create a production-ready Next.js application.
- The `Dockerfile` must copy the source code from the `../phase3-chatbot` directory.
- The final Docker image must expose port 3000.

### 3.2. Helm Chart

- A Helm chart must be created in the `phase4-k8s` directory named `nextjs-app`.
- The Helm chart must contain the following templates:
    - `deployment.yaml`
    - `service.yaml`
    - `pvc.yaml`
    - `localai.yaml`
- The Helm chart must have a `Chart.yaml` file with the chart name, version, and description.
- The Helm chart must have a `values.yaml` file with configurable parameters for the deployment.

### 3.3. Kubernetes Resources

- **Next.js Application Deployment:**
    - A Kubernetes Deployment must be created for the `phase3-chatbot` application.
    - The Deployment must use the Docker image built from the `Dockerfile`.
    - The Deployment must have a configurable number of replicas.
    - The Deployment must have liveness and readiness probes configured.
    - The Deployment must mount a PersistentVolumeClaim for the SQLite database.
- **Next.js Application Service:**
    - A Kubernetes Service must be created to expose the Next.js application.
    - The Service must be of type `NodePort` or `LoadBalancer` to be accessible from outside the cluster.
- **LocalAI Deployment:**
    - A separate Kubernetes Pod must be created for the LocalAI service.
    - The Pod must use a publicly available LocalAI Docker image.
    - The Pod must have resource requests and limits configured, especially for memory.
- **LocalAI Service:**
    - A Kubernetes Service must be created to expose the LocalAI service.
    - The Service must be of type `ClusterIP` to be accessible only from within the cluster.
- **Persistence:**
    - A Kubernetes PersistentVolumeClaim (PVC) must be created for the SQLite database (`dev.db`).
    - The PVC must be mounted by the Next.js application deployment.

### 3.4. Local Development Environment

- The `README.md` file in the `phase4-k8s` directory must contain instructions on how to:
    - Start Minikube with the Docker driver.
    - Build the Docker image.
    - Install and upgrade the Helm chart.
    - Access the deployed application using `kubectl port-forward`.
- The `README.md` file should also contain bonus example commands for `kubectl-ai` and `kagent`.

## 4. Non-Functional Requirements

- **Locality:** The entire deployment must be 100% local, with no reliance on cloud providers or remote container registries.
- **Isolation:** The `phase3-chatbot` application source code must not be modified.
- **Ease of Use:** The deployment process should be simple and well-documented.

## 5. Out of Scope

- Deployment to any cloud provider (AWS, GCP, Azure, etc.).
- Integration with Dapr or Kafka.
- CI/CD pipelines for automated builds and deployments.
- Production-grade security and hardening.
- High availability and disaster recovery.

## 6. Assumptions

- The user has Docker, Minikube, `kubectl`, and Helm installed and configured on their local machine.
- The user is familiar with basic Kubernetes concepts.
- The `phase3-chatbot` application is located in the `../phase3-chatbot` directory relative to the `phase4-k8s` directory.

## 7. Success Criteria

- The `phase3-chatbot` application is successfully deployed to a local Minikube cluster.
- The application is accessible from the user's local machine via `localhost:3000`.
- The application can communicate with the LocalAI service.
- Data entered into the application persists across pod restarts.
- The entire deployment can be created and destroyed with a few simple commands.
- The `README.md` file provides clear and concise instructions for setting up and running the environment.
