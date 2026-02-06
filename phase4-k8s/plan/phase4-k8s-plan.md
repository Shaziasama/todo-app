/sp.plan



Create a precise implementation plan for Phase IV based on the approved spec in specs/features/phase4-local-k8s.md.



Include:

\- Folder structure inside phase4-k8s (Dockerfile, helm/Chart.yaml, values.yaml, templates/)

\- Dockerfile: multi-stage build, COPY ../phase3-chatbot, build Next.js for production, expose port 3000

\- Helm chart design: Chart.yaml, values.yaml, separate deployments for nextjs-app and localai, services, PVC for dev.db, probes, resources

\- Minikube + Helm deployment flow

\- Port-forward and access instructions (localhost:3000)

\- kubectl-ai and kagent example commands in README



Output as plan/phase4-k8s-plan.md, ready for sp.tasks.

