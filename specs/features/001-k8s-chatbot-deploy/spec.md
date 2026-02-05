# Feature Specification: Phase IV: Local Kubernetes Deployment of Phase 3 Chatbot

**Feature Branch**: `001-k8s-chatbot-deploy`
**Created**: 2026-02-04
**Status**: Draft
**Input**: User description: "Create a detailed specification for Phase IV: Local Kubernetes Deployment of Phase 3 Chatbot. Goal: Deploy the existing phase3-chatbot Next.js app (located in ../phase3-chatbot) on local Minikube using Docker + Helm, without modifying the phase3-chatbot folder. Current directory: /mnt/c/Users/Zohaib/Desktop/todo-app/phase4-k8s (already created) Requirements: - Dockerfile: multi-stage build, COPY ../phase3-chatbot for source code, build Next.js app, expose port 3000 - Helm chart: full chart with Chart.yaml, values.yaml, templates/ - Separate deployments: nextjs-app (Phase 3 app) and localai (for AI model) - Service for nextjs-app (NodePort or LoadBalancer) - Service for localai (ClusterIP, accessible internally) - PersistentVolumeClaim for SQLite dev.db persistence - Resource requests/limits (especially memory for localai) - Liveness & readiness probes - Minikube setup instructions (start with Docker driver) - Helm install/upgrade commands - kubectl port-forward for local access (localhost:3000) - Bonus: kubectl-ai and kagent example commands in README - All 100% local, no cloud, no remote registry Out of Scope: Cloud providers, Dapr, Kafka Save as /specs/features/phase4-local-k8s.md and mark ready for /sp.plan."

## User Scenarios & Testing (mandatory)

### User Story 1 - Deploy Chatbot and LocalAI to Minikube (Priority: P1)

The user wants to deploy the `phase3-chatbot` Next.js application and a separate `localai` AI model server to a local Minikube Kubernetes cluster. This deployment should use Docker for containerization and Helm for packaging and orchestration.

**Why this priority**: This is the core objective of the entire phase – to get the chatbot application running in a local Kubernetes environment. Without this, the rest of the features are not relevant.

**Independent Test**: The successful deployment can be tested by verifying that both `nextjs-app` and `localai` pods are running in Minikube and the chatbot UI is accessible locally, able to interact with the AI model.

**Acceptance Scenarios**:

1.  **Given** Minikube is running with the Docker driver and Docker is configured, **When** the Helm chart for Phase 4 is installed, **Then** `nextjs-app` and `localai` pods are running and healthy within the Minikube cluster.
2.  **Given** the `nextjs-app` is successfully deployed and its service is exposed, **When** `kubectl port-forward` is executed to expose the service locally, **Then** the chatbot UI is accessible via `localhost:3000` in a web browser.
3.  **Given** the chatbot UI is accessible and `localai` is running, **When** a user sends a chat message through the UI, **Then** `localai` processes the request, and the chatbot returns an appropriate response.

---

### User Story 2 - Persistent Data for LocalAI (Priority: P2)

The user requires that the SQLite `dev.db` file used by the `localai` component persists across pod restarts or redeployments, ensuring that model data or configuration is not lost.

**Why this priority**: Data persistence is crucial for the AI model to maintain state and avoid data loss, improving the robustness of the local deployment. Without persistence, every restart would be a fresh start for the AI model.

**Independent Test**: This can be tested by deploying the `localai` pod, allowing it to write some data to its `dev.db`, then restarting the pod and verifying that the previously written data is still available.

**Acceptance Scenarios**:

1.  **Given** the `localai` component is deployed with a PersistentVolumeClaim (PVC) configured for its data directory, **When** data is generated or stored in the `dev.db` file by the `localai` application and the `localai` pod is subsequently restarted or deleted and recreated, **Then** the previously written data in `dev.db` remains intact and accessible to the new `localai` pod.

---

### User Story 3 - Comprehensive Local Deployment Instructions (Priority: P1)

The user needs clear, comprehensive instructions in a `README-phase4.md` file to set up Minikube, deploy the application using Helm, and access it locally, including bonus commands for `kubectl-ai` and `kagent`.

**Why this priority**: Easy and reliable setup is paramount for a local development and testing environment. Clear instructions reduce friction and ensure the user can quickly get the application running.

**Independent Test**: The instructions can be tested by a new user (or the user themselves) attempting to follow them from a clean state to a fully operational chatbot.

**Acceptance Scenarios**:

1.  **Given** a fresh system with Docker, Minikube, `kubectl`, and Helm installed, **When** the user follows the `minikube start` instructions in `README-phase4.md`, **Then** Minikube starts successfully with the Docker driver.
2.  **Given** Minikube is running, **When** the user follows the `helm install` or `helm upgrade` commands in `README-phase4.md`, **Then** the `nextjs-app` and `localai` are successfully deployed to the Minikube cluster.
3.  **Given** the application is deployed, **When** the user executes the `kubectl port-forward` command from `README-phase4.md`, **Then** the chatbot UI is made accessible on `localhost:3000`.
4.  **Given** `README-phase4.md` is reviewed, **When** the user looks for advanced interaction examples, **Then** example commands for `kubectl-ai` and `kagent` are present.

## Requirements (mandatory)

### Functional Requirements

-   **FR-001**: The system MUST provide a Dockerfile for the `phase3-chatbot` Next.js application.
    *   **Details**: The Dockerfile MUST implement a multi-stage build strategy. It MUST copy the source code from `../phase3-chatbot` (relative to `phase4-k8s`). It MUST build the Next.js application. It MUST expose port 3000.
-   **FR-002**: The system MUST provide a complete Helm chart structure within the `phase4-k8s/helm` directory.
    *   **Details**: The Helm chart MUST include `Chart.yaml`, `values.yaml`, and a `templates/` directory containing Kubernetes resource definitions.
-   **FR-003**: The Helm chart MUST define a Kubernetes Deployment for the `nextjs-app` (Phase 3 chatbot application).
-   **FR-004**: The Helm chart MUST define a separate Kubernetes Deployment for the `localai` pod, responsible for hosting the AI model.
-   **FR-005**: The Helm chart MUST include a PersistentVolumeClaim (PVC) configured for the `localai` deployment to ensure persistence of the `dev.db` SQLite file.
-   **FR-006**: The Helm chart MUST define a Kubernetes Service for the `nextjs-app`.
    *   **Details**: The service type MUST be configurable to either `NodePort` or `LoadBalancer` via `values.yaml` (defaulting to `NodePort` for local Minikube). It MUST expose port 3000.
-   **FR-007**: The Helm chart MUST define a Kubernetes Service for `localai`.
    *   **Details**: The service type MUST be `ClusterIP`, making it accessible internally within the Kubernetes cluster by the `nextjs-app`.
-   **FR-008**: The Helm chart MUST specify configurable resource requests and limits (CPU and memory) for both the `nextjs-app` and `localai` deployments, with sensible defaults for `localai`'s memory.
-   **FR-009**: The Helm chart MUST configure liveness and readiness probes for both the `nextjs-app` and `localai` pods to ensure application health.
-   **FR-010**: All generated files and directories for Phase 4 MUST be located strictly within the `C:\Users\Zohaib\Desktop	odo-app\phase4-k8s` directory.
-   **FR-011**: The entire deployment solution MUST operate 100% locally, without requiring access to cloud providers, remote container registries (except for base images), or other external services.
-   **FR-012**: The system MUST provide a `README-phase4.md` file within the `phase4-k8s` directory.
    *   **Details**: The README MUST include clear, step-by-step instructions for starting Minikube with the Docker driver. It MUST provide the exact Helm install/upgrade commands for deploying the chart. It MUST provide the exact `kubectl port-forward` command to access the chatbot UI locally on `localhost:3000`. It SHOULD include example commands for `kubectl-ai` and `kagent` as bonus content.

### Key Entities

-   **`nextjs-app`**: The Next.js AI chatbot application, running as a Kubernetes deployment.
-   **`localai`**: A containerized AI model server, running as a separate Kubernetes deployment, providing the AI capabilities to the `nextjs-app`.
-   **`PersistentVolumeClaim (PVC)`**: A request for storage by `localai` to ensure its `dev.db` file persists across pod lifecycle events.
-   **`Minikube`**: A tool for running a single-node Kubernetes cluster locally, used as the deployment target.
-   **`Docker`**: The containerization platform used to build images for `nextjs-app` and potentially `localai`.
-   **`Helm`**: A package manager for Kubernetes, used to define, install, and upgrade the application and AI model deployments.

## Success Criteria (mandatory)

### Measurable Outcomes

-   **SC-001**: Within 15 minutes, a user following the `README-phase4.md` instructions can successfully deploy and access the `phase3-chatbot` UI and interact with the `localai` model within their local Minikube environment.
-   **SC-002**: The `phase3-chatbot` application, when accessed via `localhost:3000` (after port-forwarding), can successfully send requests to and receive responses from the `localai` model running within Minikube.
-   **SC-003**: After a `localai` pod restart or redeployment, any data previously stored in its `dev.db` file is retained and accessible, verified by a simple test interaction.
-   **SC-004**: All required deployment artifacts (Dockerfile, Helm chart files, `README-phase4.md`) are correctly structured and present exclusively within the `C:\Users\Zohaib\Desktop	odo-app\phase4-k8s` directory.
-   **SC-005**: The `README-phase4.md` file contains all specified setup, deployment, and access commands, enabling a user to independently set up and verify the local Kubernetes deployment.
-   **SC-006**: The entire solution demonstrates 100% local operation, with no network calls or dependencies on external cloud resources or remote registries (beyond initial base image pulls).