# Phase 5: Kubernetes Helm Enhancement

This phase enhances the existing Helm chart with Horizontal Pod Autoscaling (HPA), Ingress configuration, and optional monitoring capabilities.

## Features Added

1. **Horizontal Pod Autoscaler (HPA)**: Automatically scales the Next.js application based on CPU usage
   - Target CPU utilization: 70%
   - Minimum replicas: 1
   - Maximum replicas: 5

2. **Ingress Configuration**: Exposes the application via the domain `todo-chatbot.local`
   - Requires Minikube ingress addon to be enabled

3. **Optional Monitoring**: Basic Prometheus + Grafana setup (disabled by default)

## Prerequisites

- Kubernetes cluster (tested with Minikube)
- Helm 3+
- kubectl

## Setup Instructions

### 1. Enable Minikube Ingress Addon

```bash
minikube addons enable ingress
```

### 2. Update /etc/hosts

Add the following entry to your hosts file to map the domain to Minikube's IP:

```bash
# On Linux/Mac: sudo nano /etc/hosts
# On Windows: Edit C:\Windows\System32\Drivers\etc\hosts as Administrator
$(minikube ip) todo-chatbot.local
```

### 3. Install the Helm Chart

```bash
# Navigate to the phase5-k8s directory
cd phase5-k8s

# Install the chart
helm install todo-chatbot ./
```

### 4. Enable Monitoring (Optional)

To enable Prometheus and Grafana monitoring, update the values.yaml file:

```yaml
monitoring:
  prometheus:
    enabled: true
  grafana:
    enabled: true
```

Or use the --set flag during installation:

```bash
helm install todo-chatbot ./ --set monitoring.prometheus.enabled=true --set monitoring.grafana.enabled=true
```

## Verifying the Installation

### Check HPA Status

```bash
kubectl get hpa
kubectl describe hpa todo-chatbot-nextjs-app
```

### Check Ingress

```bash
kubectl get ingress
kubectl describe ingress todo-chatbot-ingress
```

### Access the Application

Open your browser and navigate to: http://todo-chatbot.local

## Scaling Testing

To test the HPA functionality, you can create a load generator:

```bash
# Create a temporary pod to generate CPU load
kubectl run load-generator --image=busybox --rm -it --restart=Never -- stress --cpu 1

# Or use curl to repeatedly hit the application
while true; do curl http://todo-chatbot.local; sleep 0.1; done
```

Monitor the pods to see them scale up:

```bash
kubectl get pods -w
```

## Uninstall

```bash
helm uninstall todo-chatbot
```

## Values Configuration

The following table lists the configurable parameters of the Helm chart and their default values:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `nextjsApp.replicaCount` | Number of Next.js app replicas | `1` |
| `nextjsApp.image.repository` | Next.js app image repository | `"todo-chatbot"` |
| `nextjsApp.image.pullPolicy` | Image pull policy | `"IfNotPresent"` |
| `nextjsApp.image.tag` | Image tag | `"latest"` |
| `hpa.enabled` | Enable HPA for nextjsApp | `true` |
| `hpa.minReplicas` | Minimum number of replicas | `1` |
| `hpa.maxReplicas` | Maximum number of replicas | `5` |
| `hpa.targetCPUUtilizationPercentage` | Target CPU utilization percentage | `70` |
| `ingress.enabled` | Enable ingress controller | `true` |
| `ingress.hosts[0].host` | Hostname for the ingress | `"todo-chatbot.local"` |
| `localai.enabled` | Enable LocalAI service | `true` |
| `monitoring.prometheus.enabled` | Enable Prometheus monitoring | `false` |
| `monitoring.grafana.enabled` | Enable Grafana dashboard | `false` |

## Troubleshooting

### Ingress not working
- Ensure the Minikube ingress addon is enabled
- Verify the hosts file entry is correct
- Check that the ingress controller is running: `kubectl get pods -n ingress-nginx`

### HPA not scaling
- Verify metrics server is running: `kubectl top nodes`
- Check HPA configuration: `kubectl describe hpa todo-chatbot-nextjs-app`
- Ensure sufficient CPU load is applied to trigger scaling

### Application not responding
- Check pod status: `kubectl get pods`
- Check service configuration: `kubectl describe svc todo-chatbot-nextjs-app-service`
- Check application logs: `kubectl logs deployment/todo-chatbot-nextjs-app`