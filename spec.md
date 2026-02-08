# Feature Specification: K8s Helm Enhancement

**Feature Branch**: `5-k8s-helm-enhancement`
**Created**: 2026-02-08
**Status**: Draft
**Input**: User description: "You are my dedicated Kubernetes + Helm expert for this entire project. Project root: /mnt/c/Users/Zohaib/Desktop/todo-app Previous phase was phase4-k8s (Helm chart with Next.js todo-chatbot and LocalAI). Now start phase 5. First action — BEFORE doing anything else: Create a new folder called phase5-k8s inside the project root: mkdir -p /mnt/c/Users/Zohaib/Desktop/todo-app/phase5-k8s From now on, ALL work, files, changes, templates, values.yaml, README, etc. must happen INSIDE /mnt/c/Users/Zohaib/Desktop/todo-app/phase5-k8s ONLY. Do NOT touch or modify phase4-k8s anymore. Phase 5 goals: - Add Horizontal Pod Autoscaler (HPA) for nextjs-app (CPU 70% target, min 1, max 5 replicas) - Enable Minikube ingress addon and create Ingress resource to expose the app on todo-chatbot.local - (Optional) Basic Prometheus + Grafana monitoring setup - Update README.md with new features, exact commands, and screenshots - Submit by 11 PM PKT today Current working values.yaml from phase4 (copy this as starting point): ```yaml # Default values for phase4-k8s Helm chart (Next.js Todo App + LocalAI) # Next.js Application Configuration nextjsApp: replicaCount: 1 image: repository: todo-chatbot pullPolicy: IfNotPresent tag: "latest" service: type: NodePort port: 3000 resources: requests: memory: "256Mi" cpu: "100m" limits: memory: "512Mi" cpu: "200m" livenessProbe: httpGet: path: / port: 3000 initialDelaySeconds: 30 periodSeconds: 10 readinessProbe: httpGet: path: / port: 3000 initialDelaySeconds: 5 periodSeconds: 5 # LocalAI Configuration localai: enabled: true replicaCount: 1 image: repository: quay.io/go-skynet/local-ai pullPolicy: IfNotPresent tag: "v1.5.0" service: type: ClusterIP port: 8080 resources: requests: memory: "1Gi" cpu: "500m" limits: memory: "2Gi" cpu: "1000m" livenessProbe: httpGet: path: /healthz port: 8080 initialDelaySeconds: 60 periodSeconds: 10 readinessProbe: httpGet: path: /readyz port: 8080 initialDelaySeconds: 5 periodSeconds: 5 # Persistence Configuration persistence: enabled: true storageClass: "" accessModes: - ReadWriteOnce size: 1Gi # Node configuration nodeSelector: {} tolerations: [] affinity: {}`"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto-scale Application (Priority: P1)

As a system administrator, I want the Next.js application to automatically scale based on CPU usage so that it can handle varying traffic loads efficiently without manual intervention.

**Why this priority**: This ensures the application remains responsive during traffic spikes while optimizing resource usage during low-traffic periods.

**Independent Test**: The system can be tested by simulating increased CPU load on the Next.js application and verifying that additional pods are automatically created up to the maximum of 5 replicas when CPU exceeds 70%.

**Acceptance Scenarios**:

1. **Given** the application is running with 1 pod, **When** CPU usage reaches 70%, **Then** additional pods are created up to a maximum of 5 replicas
2. **Given** the application is running with 5 pods, **When** CPU usage drops below 70%, **Then** pods are gradually scaled down to minimum 1 replica

---

### User Story 2 - Access Application via Domain (Priority: P1)

As an end user, I want to access the application using a domain name (todo-chatbot.local) instead of IP addresses or ports so that I can easily access the service.

**Why this priority**: This provides a user-friendly way to access the application and enables proper routing in production-like environments.

**Independent Test**: The system can be tested by enabling the Minikube ingress addon and accessing the application via the todo-chatbot.local domain.

**Acceptance Scenarios**:

1. **Given** Minikube ingress addon is enabled, **When** user navigates to todo-chatbot.local, **Then** the Next.js todo-chatbot application loads successfully
2. **Given** Ingress resource is configured, **When** user accesses the domain, **Then** traffic is properly routed to the Next.js application

---

### User Story 3 - Monitor Application Performance (Priority: P2)

As a system administrator, I want to monitor the application's performance metrics through a dashboard so that I can identify performance issues and optimize resource allocation.

**Why this priority**: Monitoring is essential for maintaining application health and identifying potential issues before they affect users.

**Independent Test**: The system can be tested by deploying Prometheus and Grafana and verifying that application metrics are collected and displayed in the dashboard.

**Acceptance Scenarios**:

1. **Given** Prometheus and Grafana are deployed, **When** application is running, **Then** metrics are collected and visible in the dashboard
2. **Given** monitoring stack is active, **When** performance issues occur, **Then** administrators can identify and address them through the dashboard

---

### User Story 4 - Updated Documentation (Priority: P1)

As a developer, I want comprehensive documentation that explains the new features, commands, and configurations so that I can effectively deploy and manage the enhanced application.

**Why this priority**: Proper documentation is essential for team collaboration and ongoing maintenance of the system.

**Independent Test**: The documentation can be tested by following the instructions to reproduce the deployment and verifying that all features work as described.

**Acceptance Scenarios**:

1. **Given** updated README.md exists, **When** developer follows deployment instructions, **Then** all features are successfully deployed
2. **Given** documentation includes screenshots, **When** developer refers to documentation, **Then** visual aids help clarify complex steps

---

### Edge Cases

- What happens when the cluster runs out of resources to scale up?
- How does the system handle ingress conflicts if multiple applications try to use the same host?
- What occurs if Prometheus fails to collect metrics from the application?
- How does the system behave when the LocalAI service is temporarily unavailable?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST implement Horizontal Pod Autoscaler for the nextjs-app with CPU target of 70%
- **FR-002**: System MUST configure HPA with minimum 1 replica and maximum 5 replicas for the nextjs-app
- **FR-003**: System MUST enable Minikube ingress addon to allow external access to the application
- **FR-004**: System MUST create Ingress resource that routes traffic to the application on todo-chatbot.local
- **FR-005**: System MUST update the README.md with instructions for the new features and exact commands
- **FR-006**: System MUST include screenshots in the documentation showing the new features working
- **FR-007**: System SHOULD implement basic Prometheus monitoring for the application
- **FR-008**: System SHOULD implement Grafana dashboard for visualizing application metrics
- **FR-009**: System MUST preserve all existing functionality from phase4-k8s
- **FR-010**: System MUST ensure the LocalAI service continues to function with the new enhancements

### Key Entities

- **Horizontal Pod Autoscaler**: Resource that automatically scales the number of pods based on CPU utilization
- **Ingress Controller**: Component that manages external access to services in a Kubernetes cluster
- **Prometheus**: Monitoring system that collects and stores metrics as time series data
- **Grafana**: Visualization tool that displays metrics collected by Prometheus

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The application automatically scales from 1 to up to 5 replicas based on CPU usage reaching 70%
- **SC-002**: Users can successfully access the application at todo-chatbot.local domain
- **SC-003**: The updated documentation includes all new features with clear commands and supporting screenshots
- **SC-004**: At least 80% of the system metrics are successfully collected and displayed in the monitoring dashboard when Prometheus and Grafana are deployed
- **SC-005**: The deployment process completes successfully without breaking existing functionality from phase4-k8s
- **SC-006**: The system responds to simulated load tests by scaling appropriately within 5 minutes