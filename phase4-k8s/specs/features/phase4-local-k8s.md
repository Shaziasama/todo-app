/sp.specify Create a detailed specification for Phase IV: Local Kubernetes Deployment of Phase 3 Chatbot. Goal: Deploy the existing phase3-chatbot Next.js app  

&nbsp; (located in ../phase3-chatbot) on local Minikube using Docker + Helm, without modifying the phase3-chatbot folder. Current directory:

&nbsp; /mnt/c/Users/Zohaib/Desktop/todo-app/phase4-k8s (already created) Requirements: - Dockerfile: multi-stage build, COPY ../phase3-chatbot for source code, build  

&nbsp; Next.js app, expose port 3000 - Helm chart: full chart with Chart.yaml, values.yaml, templates/ - Separate deployments: nextjs-app (Phase 3 app) and localai    

&nbsp; (for AI model) - Service for nextjs-app (NodePort or LoadBalancer) - Service for localai (ClusterIP, accessible internally) - PersistentVolumeClaim for SQLite  

&nbsp; dev.db persistence - Resource requests/limits (especially memory for localai) - Liveness \& readiness probes - Minikube setup instructions (start with Docker    

&nbsp; driver) - Helm install/upgrade commands - kubectl port-forward for local access (localhost:3000) - Bonus: kubectl-ai and kagent example commands in README - All

&nbsp; 100% local, no cloud, no remote registry Out of Scope: Cloud providers, Dapr, Kafka Save as /specs/features/phase4-local-k8s.md and mark ready for /sp.plan.    



&nbsp; Once you have run the /sp.specify command, you can use the following prompts:



&nbsp; /sp.plan Create a plan for the spec. I am building with Docker, Helm, and Minikube.



&nbsp; /sp.tasks Create testable tasks for the plan.



&nbsp; /sp.implement Implement the tasks.



