# Todo Chatbot Application

A comprehensive full-stack todo application with AI-powered chat capabilities, deployed on Kubernetes.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Phases](#phases)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project is a multi-phase development effort to create a sophisticated todo application with AI capabilities. It begins with a simple CLI application and evolves into a full-stack web application with AI integration, deployed on Kubernetes.

## Features

- **CLI Interface**: Command-line interface for managing todos (Phase 1)
- **Full-Stack Web App**: Complete web interface with authentication and real-time updates (Phase 2)
- **AI-Powered Chatbot**: Natural language processing for todo management (Phase 3)
- **Kubernetes Deployment**: Scalable cloud-native deployment with Helm (Phase 4)
- **Persistent Storage**: SQLite database with PVC for data persistence
- **AI Integration**: LocalAI for offline AI processing
- **Microservices Architecture**: Separate services for web app and AI processing

## Architecture

The application follows a microservices architecture with the following components:

- **Frontend**: Next.js web application
- **Backend**: Node.js API server
- **AI Service**: LocalAI for natural language processing
- **Database**: SQLite with persistent storage
- **Orchestration**: Kubernetes with Helm charts
- **Container Runtime**: Docker

## Phases

### Phase 1: CLI Todo Application
- Implemented a command-line interface for todo management
- Features include adding, listing, marking as complete, and deleting todos
- Used Rust for performance and memory safety
- Implemented proper error handling and user input validation

### Phase 2: Full-Stack Web Application
- Developed a complete web interface using Next.js
- Integrated with backend API for todo management
- Implemented user authentication and authorization
- Added real-time updates using web sockets
- Created responsive UI with modern design principles

### Phase 3: AI-Powered Chatbot
- Integrated AI capabilities for natural language todo management
- Implemented chat interface for conversational todo management
- Connected to AI services for intelligent task processing
- Added context awareness for better user interactions
- Created middleware for handling AI requests

### Phase 4: Kubernetes Deployment
- Containerized the application using Docker
- Created Helm charts for easy deployment
- Implemented persistent storage for data preservation
- Set up LocalAI service for offline AI processing
- Configured services and networking for inter-service communication
- Added health checks and resource management

## Technologies Used

### Backend & Frontend
- **Next.js**: React framework for web application
- **Node.js**: JavaScript runtime for backend services
- **TypeScript**: Type-safe JavaScript development
- **Prisma**: Database toolkit and ORM

### Database
- **SQLite**: Lightweight database for local development
- **Persistent Volumes**: Kubernetes storage for data persistence

### AI & Machine Learning
- **LocalAI**: Self-hosted AI service compatible with OpenAI API
- **Hugging Face Models**: Pre-trained models for natural language processing

### Containerization & Orchestration
- **Docker**: Container runtime for application packaging
- **Kubernetes**: Container orchestration platform
- **Helm**: Package manager for Kubernetes applications
- **Minikube**: Local Kubernetes cluster for development

### Infrastructure & DevOps
- **GitHub Actions**: CI/CD pipeline automation
- **Git**: Version control system
- **Shell Scripts**: Automation and deployment scripts

## Getting Started

### Prerequisites
- Docker
- Minikube or Kubernetes cluster
- Helm
- Node.js (for local development)

### Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/Shaziasama/todo-app.git
   cd todo-app
   ```

2. For Phase 1 (CLI):
   ```bash
   cd phase1-cli-todo
   cargo run
   ```

3. For Phase 2 (Web App):
   ```bash
   cd phase2-fullstack-web
   npm install
   npm run dev
   ```

4. For Phase 3 (Chatbot):
   ```bash
   cd phase3-chatbot
   npm install
   npm run dev
   ```

## Deployment

### Kubernetes Deployment (Phase 4)

1. Start Minikube:
   ```bash
   minikube start --driver=docker
   ```

2. Build the Docker image:
   ```bash
   cd phase4-k8s
   eval $(minikube docker-env)
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

5. Visit `http://localhost:3000` in your browser

### Using Deployment Scripts

The project includes helper scripts for common operations:

- `scripts/setup-minikube.sh`: Sets up Minikube environment
- `scripts/deploy.sh`: Builds and deploys the application
- `scripts/port-forward.sh`: Sets up port forwarding for local access

## Useful kubectl Commands

- Check pod status: `kubectl get pods`
- Check service status: `kubectl get services`
- View logs: `kubectl logs deployment/nextjs-app-deployment`
- Scale deployment: `kubectl scale deployment/nextjs-app-deployment --replicas=3`
- Check all resources: `kubectl get all -l app=nextjs-app`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- The project demonstrates a progressive evolution from CLI to cloud-native application
- Inspired by modern software development practices and cloud-native architectures
- Built with open-source tools and technologies