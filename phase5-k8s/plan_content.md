I am still encountering the "Shell executable 'powershell.exe' not found" error, which prevents me from using `setup-plan.sh` or performing any file system operations (creating files or directories). Therefore, I will generate the content for the implementation plan directly. You will need to manually create the file `C:\Users\Zohaib\Desktop	odo-app\specs\features\001-k8s-chatbot-deploy\plan.md` and paste the following content into it.

---
# Implementation Plan: Phase IV: Local Kubernetes Deployment of Phase 3 Chatbot

**Feature Branch**: `001-k8s-chatbot-deploy`
**Created**: 2026-02-04
**Spec**: `specs/features/001-k8s-chatbot-deploy/spec.md`

## 1. Technical Context

This plan outlines the deployment of the `phase3-chatbot` Next.js application and a `localai` AI model server onto a local Minikube Kubernetes cluster. The `phase3-chatbot` is an existing application and will not be modified directly. All new deployment artifacts (Dockerfile, Helm chart, README) will be created within the `C:\Users\Zohaib\Desktop	odo-app\phase4-k8s` directory. Docker will be used for containerization of the Next.js app, and Helm will manage the Kubernetes deployments, services, and persistent storage. The entire solution will operate locally, with no dependencies on external cloud services or remote registries beyond base image pulls.

**Application Components:**
*   **`nextjs-app` (Phase 3 Chatbot):** A Next.js application serving both frontend and backend logic.
*   **`localai`:** An AI model server providing the intelligence for the chatbot.

**Deployment Environment:**
*   **Minikube:** Local Kubernetes cluster.
*   **Docker:** Container runtime for building and running images.
*   **Helm:** Package manager for Kubernetes applications.
*   **Operating System:** WSL (Windows Subsystem for Linux) is the user's environment, but the deployment itself targets Minikube.

**Dependencies:**
*   Existing `phase3-chatbot` application source code located at `../phase3-chatbot`.
*   Minikube, Docker, `kubectl`, and Helm installed and configured in the user's environment.

## 2. Constitution Check

This plan adheres to the following principles:

*   **Modularity & Separation of Concerns:** The `nextjs-app` and `localai` components are deployed as separate entities, allowing independent scaling and management. The `phase3-chatbot` source remains untouched, maintaining its integrity.
*   **Reusability:** A Helm chart will be created, enabling easy re-deployment or updates of the application.
*   **Efficiency:** A multi-stage Dockerfile will be used to create optimized, smaller images for the Next.js application. Resource requests and limits will be defined to ensure efficient resource utilization within Minikube.
*   **Testability:** Each component will have liveness and readiness probes, allowing Kubernetes to manage their health and ensuring testability of their operational status.
*   **Security (Local Context):** `localai` will be exposed via `ClusterIP`, limiting its network exposure to within the cluster, and resource limits will prevent abuse. The entire system is designed for local operation, minimizing external attack surface.
*   **Reproducibility:** The `README-phase4.md` will provide clear, step-by-step instructions to ensure consistent deployment results.

## 3. Deployment Architecture

### Folder Structure

The `phase4-k8s` directory will contain all new deployment-related files:

```
phase4-k8s/
├── Dockerfile                  # For building the nextjs-app image
├── helm/                       # Helm chart directory
│   ├── Chart.yaml              # Helm chart metadata
│   ├── values.yaml             # Default configuration values
│   └── templates/              # Kubernetes resource definitions
│       ├── _helpers.tpl        # Helm templates for common labels, names etc.
│       ├── nextjs-app-deployment.yaml # Deployment for the Next.js app
│       ├── nextjs-app-service.yaml    # Service for the Next.js app
│       ├── localai-deployment.yaml    # Deployment for the LocalAI model
│       ├── localai-service.yaml       # Service for the LocalAI model
│       └── localai-pvc.yaml           # PersistentVolumeClaim for LocalAI data
├── README-phase4.md            # Instructions for setup, deploy, and access
└── .dockerignore               # Files to ignore when building Docker image
```

### Dockerfile for `nextjs-app`

The `Dockerfile` (located at `phase4-k8s/Dockerfile`) will perform a multi-stage build:

1.  **Builder Stage:**
    *   Use a Node.js base image (e.g., `node:20-alpine`).
    *   Set working directory.
    *   Copy `package.json` and `package-lock.json` from `../phase3-chatbot`.
    *   Install dependencies.
    *   Copy the entire `../phase3-chatbot` source code.
    *   Build the Next.js application for production.
2.  **Runner Stage:**
    *   Use a minimal base image (e.g., `node:20-alpine` or `gcr.io/distroless/nodejs20`).
    *   Set working directory.
    *   Copy built application from the builder stage.
    *   Copy `node_modules` (only production dependencies).
    *   Expose port 3000.
    *   Define `CMD` to start the Next.js server.
    *   Include a `.dockerignore` file to prevent unnecessary files from `phase3-chatbot` being copied (e.g., `.git`, `node_modules`).

### Helm Chart Design (`phase4-k8s/helm/`)

*   **`Chart.yaml`**: Defines chart metadata (name, version, description, appVersion).
*   **`values.yaml`**: Central configuration for the deployment.
    *   `nextjs-app`:
        *   `replicaCount`: Number of pod replicas (default 1).
        *   `image`: Docker image name and tag for the Next.js app.
        *   `service`:
            *   `type`: `NodePort` (default) or `LoadBalancer`.
            *   `port`: External service port (3000).
            *   `targetPort`: Container port (3000).
        *   `resources`: CPU/Memory requests/limits.
        *   `livenessProbe`, `readinessProbe`: HTTP GET path and port.
        *   `env`: Environment variables (e.g., `LOCALAI_HOST` pointing to `localai` service).
    *   `localai`:
        *   `replicaCount`: Number of pod replicas (default 1).
        *   `image`: Docker image name and tag for LocalAI (e.g., `quay.io/go-skynet/local-ai:latest`).
        *   `service`:
            *   `type`: `ClusterIP`.
            *   `port`: Service port (e.g., 8080 or LocalAI's default API port).
        *   `resources`: CPU/Memory requests/limits (with higher memory for AI model).
        *   `livenessProbe`, `readinessProbe`: HTTP GET path and port.
        *   `persistence`:
            *   `enabled`: `true` (default).
            *   `storageClassName`: `standard` (or other Minikube default).
            *   `accessModes`: `ReadWriteOnce`.
            *   `size`: `5Gi` (example size for `dev.db`).
            *   `mountPath`: Path inside the container where `dev.db` is stored.

*   **`templates/`**:
    *   `_helpers.tpl`: Define reusable templates for naming conventions, labels, etc.
    *   `nextjs-app-deployment.yaml`: Defines the Kubernetes Deployment for the `nextjs-app`.
        *   Uses image from `values.yaml`.
        *   Mounts environment variables.
        *   Configures liveness/readiness probes.
        *   Sets resource requests/limits.
    *   `nextjs-app-service.yaml`: Defines the Kubernetes Service for `nextjs-app`.
        *   Uses type and ports from `values.yaml`.
    *   `localai-deployment.yaml`: Defines the Kubernetes Deployment for `localai`.
        *   Uses image from `values.yaml`.
        *   Mounts the PVC for `dev.db`.
        *   Configures liveness/readiness probes.
        *   Sets resource requests/limits.
        *   May need to configure `LOCALAI_MODELS_PATH` or similar environment variables if models need to be downloaded or persisted.
    *   `localai-service.yaml`: Defines the Kubernetes Service for `localai`.
        *   Uses `ClusterIP` type and port from `values.yaml`.
    *   `localai-pvc.yaml`: Defines the PersistentVolumeClaim for `localai`.
        *   Uses storage class, access modes, and size from `values.yaml`.

### Minikube + Helm Deploy Flow

1.  **Minikube Start:**
    *   `minikube start --driver=docker` (Ensure Docker driver is used for consistency).
    *   `eval $(minikube docker-env)` (or equivalent for Windows/WSL) to point Docker daemon to Minikube's internal Docker for local image builds.
2.  **Build Docker Image:**
    *   Navigate to `phase4-k8s/`.
    *   `docker build -t nextjs-chatbot-app:latest .`
3.  **Helm Install/Upgrade:**
    *   Navigate to `phase4-k8s/`.
    *   `helm upgrade --install phase4-chatbot ./helm -f ./helm/values.yaml` (or specify custom values).

### Port-forward and Access Instructions

*   Identify the `nextjs-app` service: `kubectl get services`
*   `kubectl port-forward service/phase4-chatbot-nextjs-app 3000:3000`
*   Access the chatbot in browser at `http://localhost:3000`.

### `kubectl-ai` / `kagent` Examples in README

The `README-phase4.md` will include a dedicated section for "Bonus: AI-powered kubectl interactions". This section will demonstrate conceptual usage of `kubectl-ai` or `kagent` for interacting with the deployed `localai` model or querying the Kubernetes cluster about AI-related deployments.

*   **Example 1 (Conceptual `kubectl-ai`):**
    ```bash
    kubectl ai "Summarize the logs of the localai pod."
    kubectl ai "Is the localai model healthy?"
    ```
*   **Example 2 (Conceptual `kagent`):**
    ```bash
    kagent "Show me the status of my chatbot deployment."
    kagent "What resources is the localai pod consuming?"
    ```

## 4. Risks and Mitigation

*   **Risk**: Docker daemon not accessible by Minikube in WSL environment.
    *   **Mitigation**: Explicitly include `eval $(minikube docker-env)` or equivalent Windows instructions in README.
*   **Risk**: `localai` image pulling issues or model download failures.
    *   **Mitigation**: Provide clear instructions on pre-pulling images or models if necessary, or ensure `localai`'s default configuration handles this gracefully. Document resource requirements clearly.
*   **Risk**: `dev.db` persistence not working as expected due to incorrect PVC/PV configuration.
    *   **Mitigation**: Thorough testing of the PVC. Ensure correct `mountPath` and permissions in the `localai` deployment.
*   **Risk**: Performance issues with `localai` due to insufficient resources in Minikube.
    *   **Mitigation**: Provide guidance on increasing Minikube's resources (`minikube config set cpus X`, `minikube config set memory Y`) and sensible default resource limits in `values.yaml`.

---
The plan is ready. Please proceed by creating the file `C:\Users\Zohaib\Desktop	odo-app\specs\features\001-k8s-chatbot-deploy\plan.md` and pasting the content above. After that, you can run the `/sp.tasks` command.