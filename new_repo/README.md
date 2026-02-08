# Todo App with Chatbot and LocalAI

This repository contains a comprehensive todo application with chatbot functionality powered by LocalAI, deployed using 
       Kubernetes and Helm.

## Project Phases

This project has been developed in multiple phases:

### Phase 5: Kubernetes Helm Enhancement (Latest)
Enhanced the existing Helm chart with:
- Horizontal Pod Autoscaling (HPA) for automatic scaling based on CPU usage
- Ingress configuration for domain-based access
- Optional monitoring with Prometheus and Grafana
- Comprehensive documentation and testing

For detailed information about Phase 5, see the [Phase 5 documentation](phase5-k8s/README.md).

### Previous Phases
- Phase 4: Initial Helm chart with Next.js todo-chatbot and LocalAI
- Earlier phases: Basic application development and containerization

## Quick Start

To run the application with the latest enhancements:

1. Ensure you have Kubernetes (tested with Minikube) and Helm 3+ installed
2. Navigate to the phase5-k8s directory: `cd phase5-k8s`
3. Follow the setup instructions in the [Phase 5 README](phase5-k8s/README.md)

## Architecture
## Architecture

The application consists of:
- Next.js frontend with chatbot interface
- LocalAI backend for AI processing
- Kubernetes for orchestration
- Helm for package management
- Optional monitoring stack (Prometheus + Grafana)

## Contributing

See the documentation in each phase directory for details on contributing to specific components.

## License

MIT License
