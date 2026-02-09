# Helm Lint Test

This directory contains a simple test to verify that the Helm chart is properly structured and can be installed.

## Test Commands

```bash
# Validate the chart syntax
helm lint .

# Template the chart locally to verify manifests
helm template test-release ./

# Install the chart to a test namespace
helm install test-release ./ --namespace=test --create-namespace

# Check the status of the release
helm status test-release --namespace=test

# Uninstall the test release
helm uninstall test-release --namespace=test
```

## Expected Resources

When the chart is installed with default values, the following resources should be created:

1. Next.js App Deployment
2. Next.js App Service
3. LocalAI Deployment (if enabled)
4. LocalAI Service (if enabled)
5. Horizontal Pod Autoscaler (if enabled)
6. Ingress resource (if enabled)
7. Prometheus resources (if monitoring enabled)
8. Grafana resources (if monitoring enabled)