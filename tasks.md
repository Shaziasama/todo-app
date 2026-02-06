# Tasks: Local Kubernetes Deployment

**Feature**: phase4-local-k8s  
**Version**: 1.0  
**Status**: TODO  
**Author(s)**: Qwen Code  
**Last Updated**: 2026-02-06  

## Dependencies

- User Story 1 (Next.js App Deployment) must be completed before User Story 2 (LocalAI Integration)
- Dockerfile creation (T002) must be completed before Helm chart creation (T003-T007)
- Minikube setup (T001) must be completed before any Kubernetes deployments

## Parallel Execution Opportunities

- T003-T007 (Helm chart components) can be developed in parallel after T002
- T008-T010 (Probes, resources, and documentation) can be developed in parallel after T003-T007

## Implementation Strategy

- MVP: Complete User Story 1 (Next.js app deployment) with minimal Helm chart
- Incremental delivery: Add LocalAI integration, then advanced features like probes and persistence

---

## Phase 1: Setup

### Goal
Initialize the project structure and ensure all prerequisites are met.

### Preconditions
- Docker is installed and running
- Minikube is installed
- kubectl is installed and configured
- Helm is installed

### Tasks

- [X] T001 Create phase4-k8s directory structure with subdirectories (helm/, scripts/, docs/)
- [X] T002 Install prerequisites: Docker, Minikuke, kubectl, Helm (verification task)

---

## Phase 2: Foundational

### Goal
Create foundational components that all user stories depend on.

### Preconditions
- Phase 1 tasks are completed
- Prerequisites are verified

### Tasks

- [X] T002 Create Dockerfile for multi-stage build of phase3-chatbot Next.js app
- [X] T003 Create Helm Chart.yaml with metadata for phase4-chatbot chart
- [X] T004 Create Helm values.yaml with default configurations for nextjs-app and localai
- [X] T005 [P] Create nextjs-app deployment template in helm/templates/
- [X] T006 [P] Create localai deployment template in helm/templates/
- [X] T007 [P] Create service templates for both nextjs-app and localai in helm/templates/
- [X] T008 [P] Add PersistentVolumeClaim template for SQLite persistence in helm/templates/
- [X] T009 [P] Add resource requests/limits and liveness/readiness probes to deployments
- [X] T010 Create README-phase4.md with setup and deployment instructions

---

## Phase 3: User Story 1 - Next.js Application Deployment

### Goal
Deploy the existing phase3-chatbot Next.js application to local Minikube cluster.

### Independent Test Criteria
- Next.js application is accessible via NodePort or port-forward at localhost:3000
- Application functions as expected (UI loads, chat works)
- Application can be deployed and undeployed with Helm commands

### Tasks

- [ ] T011 [US1] Build Docker image from phase4-k8s Dockerfile using phase3-chatbot source
- [ ] T012 [US1] Install Helm chart to deploy nextjs-app to Minikube
- [ ] T013 [US1] Verify nextjs-app deployment is running and healthy
- [ ] T014 [US1] Test application accessibility via kubectl port-forward
- [ ] T015 [US1] Document deployment verification steps in README-phase4.md

---

## Phase 4: User Story 2 - LocalAI Integration

### Goal
Deploy LocalAI service in the same cluster and integrate with the Next.js application.

### Independent Test Criteria
- LocalAI service is running in cluster and accessible internally
- Next.js application can communicate with LocalAI service
- AI-powered chat functionality works end-to-end

### Tasks

- [ ] T016 [US2] Update Helm chart to include LocalAI deployment
- [ ] T017 [US2] Configure LocalAI service to be accessible internally (ClusterIP)
- [ ] T018 [US2] Update nextjs-app to connect to LocalAI service
- [ ] T019 [US2] Test end-to-end chat functionality with AI responses
- [ ] T020 [US2] Document LocalAI integration in README-phase4.md

---

## Phase 5: User Story 3 - Persistence and Production Readiness

### Goal
Implement persistent storage for the application database and ensure production readiness.

### Independent Test Criteria
- SQLite database persists data across pod restarts
- Application maintains state after pod recreation
- Resource limits prevent excessive consumption
- Health checks ensure service reliability

### Tasks

- [ ] T021 [US3] Configure PersistentVolumeClaim for SQLite dev.db
- [ ] T022 [US3] Mount PVC to nextjs-app deployment for database persistence
- [ ] T023 [US3] Test data persistence by recreating pods and verifying data remains
- [ ] T024 [US3] Fine-tune resource requests/limits based on actual usage
- [ ] T025 [US3] Verify liveness and readiness probes are functioning correctly

---

## Phase 6: Polish & Cross-Cutting Concerns

### Goal
Complete documentation, testing, and finalize the implementation.

### Preconditions
- All user story phases are completed
- All functionality is working as expected

### Tasks

- [X] T026 Add NOTES.txt to Helm chart with post-installation instructions
- [X] T027 Create deployment scripts in phase4-k8s/scripts/ for common operations
- [X] T028 Add troubleshooting section to README-phase4.md
- [X] T029 Add bonus kubectl-ai and kagent example commands to README-phase4.md
- [ ] T030 Run complete end-to-end test of deployment and functionality
- [ ] T031 Verify all requirements from spec.md are satisfied
- [ ] T032 Update project documentation with lessons learned