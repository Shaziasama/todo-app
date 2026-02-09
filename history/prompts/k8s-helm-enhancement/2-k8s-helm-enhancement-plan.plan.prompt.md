---
id: 2
title: k8s-helm-enhancement-plan
stage: plan
date_iso: 2026-02-08
surface: agent
model: Qwen
feature: k8s-helm-enhancement
branch: 5-k8s-helm-enhancement
user: Zohaib
command: sp.plan
labels: ["k8s", "helm", "hpa", "ingress", "plan"]
links:
  spec: C:\\Users\\Zohaib\\Desktop\\todo-app\\phase5-k8s\\spec.md
  ticket: null
  adr: null
  pr: null
files_yaml:
  - C:\\Users\\Zohaib\\Desktop\\todo-app\\phase5-k8s\\plan.md
tests_yaml: []
prompt_text: "$ARGUMENTS"
response_text: "Created a comprehensive implementation plan for the Phase 5 Kubernetes Helm enhancement project. The plan includes 15 detailed steps covering all requirements: HPA implementation, Ingress configuration, optional monitoring setup, and documentation updates. Each step includes specific commands, expected outputs, and success conditions."
outcome: "Successfully created a detailed implementation plan with all necessary components for the Kubernetes Helm enhancement."
evaluation: "The plan comprehensively covers all requirements from the feature specification with detailed, actionable steps."
---

# Implementation Plan: K8s Helm Enhancement

**Feature**: K8s Helm Enhancement  
**Branch**: 5-k8s-helm-enhancement  
**Created**: 2026-02-08  
**Status**: Draft  

## Technical Context

This plan outlines the implementation of Phase 5, which enhances the existing Helm chart with Horizontal Pod Autoscaling (HPA), Ingress configuration, and optional monitoring capabilities. The work will be done exclusively within the `phase5-k8s` directory.

**Technologies Used**:
- Kubernetes
- Helm 3
- Horizontal Pod Autoscaler (HPA)
- Ingress Controller
- Prometheus (optional)
- Grafana (optional)

**Dependencies**:
- Minikube or Kubernetes cluster
- Helm 3+
- kubectl

**Integrations**:
- Existing Next.js application
- LocalAI service
- Kubernetes Ingress controller

**Unknowns**:
- None - all requirements are clearly specified in the feature specification

## Constitution Check

This implementation follows the project's architectural principles:
- [X] Minimal, testable changes
- [X] Clear separation of concerns
- [X] Infrastructure as code
- [X] Documentation included
- [X] Backwards compatibility maintained

## Gates

- [X] Feature specification complete and reviewed
- [X] All requirements clearly defined
- [X] Dependencies identified
- [X] Architecture aligns with project principles

## Phase 0: Outline & Research

### 0.1 Research Summary

All requirements are clearly defined in the feature specification. No additional research needed as all technical decisions have been made:
- HPA configuration: CPU target 70%, min 1, max 5 replicas
- Ingress host: todo-chatbot.local
- Monitoring: Optional Prometheus + Grafana (disabled by default)

## Phase 1: Design & Contracts

### 1.1 Data Model

The Helm chart will extend the existing data model with:

**HPA Configuration:**
- targetCPUUtilizationPercentage: 70
- minReplicas: 1
- maxReplicas: 5

**Ingress Configuration:**
- host: todo-chatbot.local
- path: /

**Monitoring Configuration:**
- prometheus.enabled: false (default)
- grafana.enabled: false (default)

### 1.2 API Contracts

No new APIs are being created. The implementation will enhance existing Kubernetes resources.

## Phase 2: Implementation Plan

### Step 1: Verify Environment
**Action**: Check that required tools are available
```bash
kubectl version --client
helm version
minikube version
```
**Expected Output**: Client versions for kubectl and Helm, minikube version
**Success Condition**: All tools are installed and accessible

### Step 2: Navigate to Phase Directory
**Action**: Change to the phase5-k8s directory
```bash
cd /mnt/c/Users/Zohaib/Desktop/todo-app/phase5-k8s
```
**Expected Output**: No output, directory changed
**Success Condition**: Successfully entered the phase5-k8s directory

### Step 3: Initialize Helm Chart Structure
**Action**: Create the basic Helm chart structure if not already present
```bash
mkdir -p templates
```
**Expected Output**: No output
**Success Condition**: Templates directory exists

### Step 4: Create Chart.yaml
**Action**: Create the Chart.yaml file with basic information
```bash
cat > Chart.yaml << EOF
apiVersion: v2
name: phase5-k8s
description: A Helm chart for Kubernetes enhancement with HPA, Ingress, and optional monitoring

type: application
version: 0.1.0
appVersion: "1.0.0"
EOF
```
**Expected Output**: Chart.yaml file created
**Success Condition**: Chart.yaml exists with correct content

### Step 5: Update values.yaml with HPA and Ingress
**Action**: Modify values.yaml to include HPA and Ingress configurations
```bash
cat > values.yaml << EOF
# Default values for phase5-k8s Helm chart (Next.js Todo App + LocalAI with HPA and Ingress)
# This extends the phase4-k8s configuration with additional features

# Next.js Application Configuration
nextjsApp:
  replicaCount: 1
  image:
    repository: todo-chatbot
    pullPolicy: IfNotPresent
    tag: "latest"
  service:
    type: NodePort
    port: 3000
  resources:
    requests:
      memory: "256Mi"
      cpu: "100m"
    limits:
      memory: "512Mi"
      cpu: "200m"
  livenessProbe:
    httpGet:
      path: /
      port: 3000
    initialDelaySeconds: 30
    periodSeconds: 10
  readinessProbe:
    httpGet:
      path: /
      port: 3000
    initialDelaySeconds: 5
    periodSeconds: 5

# Horizontal Pod Autoscaler Configuration for nextjsApp
hpa:
  enabled: true
  minReplicas: 1
  maxReplicas: 5
  targetCPUUtilizationPercentage: 70
  # targetMemoryUtilizationPercentage: 70  # Optional - uncomment if memory-based scaling is needed

# Ingress Configuration
ingress:
  enabled: true
  className: ""
  annotations:
    kubernetes.io/ingress.class: nginx
    # cert-manager.io/cluster-issuer: letsencrypt-prod  # Uncomment for SSL
  hosts:
    - host: todo-chatbot.local
      paths:
        - path: /
          pathType: Prefix
  tls: []
  # - secretName: todo-chatbot-tls
  #   hosts:
  #     - todo-chatbot.local

# LocalAI Configuration
localai:
  enabled: true
  replicaCount: 1
  image:
    repository: quay.io/go-skynet/local-ai
    pullPolicy: IfNotPresent
    tag: "v1.5.0"
  service:
    type: ClusterIP
    port: 8080
  resources:
    requests:
      memory: "1Gi"
      cpu: "500m"
    limits:
      memory: "2Gi"
      cpu: "1000m"
  livenessProbe:
    httpGet:
      path: /healthz
      port: 8080
    initialDelaySeconds: 60
    periodSeconds: 10
  readinessProbe:
    httpGet:
      path: /readyz
      port: 8080
    initialDelaySeconds: 5
    periodSeconds: 5

# Persistence Configuration
persistence:
  enabled: true
  storageClass: ""
  accessModes:
    - ReadWriteOnce
  size: 1Gi

# Monitoring Configuration (Optional)
monitoring:
  prometheus:
    enabled: false  # Set to true to enable Prometheus
    # Additional Prometheus configuration can go here
  grafana:
    enabled: false  # Set to true to enable Grafana
    # Additional Grafana configuration can go here

# Node configuration
nodeSelector: {}
tolerations: []
affinity: {}
EOF
```
**Expected Output**: values.yaml file created with HPA and Ingress configurations
**Success Condition**: values.yaml exists with correct content

### Step 6: Create HPA Template
**Action**: Create the Horizontal Pod Autoscaler template
```bash
cat > templates/hpa.yaml << EOF
{{- if .Values.hpa.enabled }}
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ include "phase5-k8s.nextjsApp.fullname" . }}
  labels:
    {{- include "phase5-k8s.labels" . | nindent 4 }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ include "phase5-k8s.nextjsApp.fullname" . }}
  minReplicas: {{ .Values.hpa.minReplicas }}
  maxReplicas: {{ .Values.hpa.maxReplicas }}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: {{ .Values.hpa.targetCPUUtilizationPercentage }}
{{- end }}
EOF
```
**Expected Output**: hpa.yaml file created in templates directory
**Success Condition**: hpa.yaml exists with correct HPA configuration

### Step 7: Create Ingress Template
**Action**: Create the Ingress resource template
```bash
cat > templates/ingress.yaml << EOF
{{- if .Values.ingress.enabled -}}
{{- $fullName := include "phase5-k8s.nextjsApp.fullname" . -}}
{{- $svcPort := .Values.nextjsApp.service.port -}}
{{- if and .Values.ingress.className (not (semverCompare ">=1.18-0" .Capabilities.KubeVersion.GitVersion)) }}
  {{- if not (hasKey .Values.ingress.annotations "kubernetes.io/ingress.class") }}
  {{- $_ := set .Values.ingress.annotations "kubernetes.io/ingress.class" .Values.ingress.className}}
  {{- end }}
{{- end }}
{{- if semverCompare ">=1.19-0" .Capabilities.KubeVersion.GitVersion -}}
apiVersion: networking.k8s.io/v1
{{- else if semverCompare ">=1.14-0" .Capabilities.KubeVersion.GitVersion -}}
apiVersion: networking.k8s.io/v1beta1
{{- else -}}
apiVersion: extensions/v1beta1
{{- end }}
kind: Ingress
metadata:
  name: {{ $fullName }}-ingress
  labels:
    {{- include "phase5-k8s.labels" . | nindent 4 }}
  {{- with .Values.ingress.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
spec:
  {{- if and .Values.ingress.className (semverCompare ">=1.18-0" .Capabilities.KubeVersion.GitVersion) }}
  ingressClassName: {{ .Values.ingress.className }}
  {{- end }}
  {{- if .Values.ingress.tls }}
  tls:
    {{- range .Values.ingress.tls }}
    - hosts:
        {{- range .hosts }}
        - {{ . | quote }}
        {{- end }}
      secretName: {{ .secretName }}
    {{- end }}
  {{- end }}
  rules:
    {{- range .Values.ingress.hosts }}
    - host: {{ .host | quote }}
      http:
        paths:
          {{- range .paths }}
          - path: {{ .path }}
            {{- if and .pathType (semverCompare ">=1.18-0" .Capabilities.KubeVersion.GitVersion) }}
            pathType: {{ .pathType }}
            {{- end }}
            backend:
              {{- if semverCompare ">=1.19-0" \$.Capabilities.KubeVersion.GitVersion }}
              service:
                name: {{ $fullName }}-service
                port:
                  number: {{ $svcPort }}
              {{- else }}
              serviceName: {{ $fullName }}-service
              servicePort: {{ $svcPort }}
              {{- end }}
          {{- end }}
    {{- end }}
{{- end }}
EOF
```
**Expected Output**: ingress.yaml file created in templates directory
**Success Condition**: ingress.yaml exists with correct Ingress configuration

### Step 8: Create Monitoring Templates
**Action**: Create optional Prometheus and Grafana templates
```bash
cat > templates/prometheus.yaml << EOF
{{- if .Values.monitoring.prometheus.enabled }}
apiVersion: v1
kind: ConfigMap
metadata:
  name: {{ include "phase5-k8s.fullname" . }}-prometheus-config
  labels:
    {{- include "phase5-k8s.labels" . | nindent 4 }}
data:
  prometheus.yml: |-
    global:
      scrape_interval: 15s
    scrape_configs:
    - job_name: 'kubernetes-apiservers'
      kubernetes_sd_configs:
      - role: endpoints
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https
    - job_name: 'kubernetes-nodes'
      kubernetes_sd_configs:
      - role: node
      scheme: https
      tls_config:
        ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
      bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
      relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)
      - target_label: __address__
        replacement: kubernetes.default.svc:443
      - source_labels: [__meta_kubernetes_node_name]
        regex: (.+)
        target_label: __metrics_path__
        replacement: /api/v1/nodes/\${1}/proxy/metrics
    - job_name: 'kubernetes-pods'
      kubernetes_sd_configs:
      - role: pod
      relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: \$1:\$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "phase5-k8s.fullname" . }}-prometheus
  labels:
    {{- include "phase5-k8s.labels" . | nindent 4 }}
spec:
  replicas: 1
  selector:
    matchLabels:
      {{- include "phase5-k8s.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/component: prometheus
  template:
    metadata:
      labels:
        {{- include "phase5-k8s.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/component: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:v2.37.0
        args:
          - '--config.file=/etc/prometheus/prometheus.yml'
          - '--storage.tsdb.path=/prometheus/'
          - '--web.console.libraries=/etc/prometheus/console_libraries'
          - '--web.console.templates=/etc/prometheus/consoles'
          - '--storage.tsdb.retention.time=200h'
          - '--web.enable-lifecycle'
        ports:
        - containerPort: 9090
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        volumeMounts:
        - name: config-volume
          mountPath: /etc/prometheus/
        - name: prometheus-storage-volume
          mountPath: /prometheus/
      volumes:
      - name: config-volume
        configMap:
          name: {{ include "phase5-k8s.fullname" . }}-prometheus-config
      - name: prometheus-storage-volume
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: {{ include "phase5-k8s.fullname" . }}-prometheus-svc
  labels:
    {{- include "phase5-k8s.labels" . | nindent 4 }}
spec:
  type: NodePort
  ports:
  - port: 9090
    targetPort: 9090
    nodePort: 30900
  selector:
    {{- include "phase5-k8s.selectorLabels" . | nindent 4 }}
    app.kubernetes.io/component: prometheus
{{- end }}
EOF

cat > templates/grafana.yaml << EOF
{{- if .Values.monitoring.grafana.enabled }}
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "phase5-k8s.fullname" . }}-grafana
  labels:
    {{- include "phase5-k8s.labels" . | nindent 4 }}
spec:
  replicas: 1
  selector:
    matchLabels:
      {{- include "phase5-k8s.selectorLabels" . | nindent 6 }}
      app.kubernetes.io/component: grafana
  template:
    metadata:
      labels:
        {{- include "phase5-k8s.selectorLabels" . | nindent 8 }}
        app.kubernetes.io/component: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana-enterprise
        ports:
        - containerPort: 3000
          name: http-grafana
          protocol: TCP
        env:
        - name: GF_SECURITY_ADMIN_USER
          value: admin
        - name: GF_SECURITY_ADMIN_PASSWORD
          value: admin
        resources:
          requests:
            cpu: 100m
            memory: 128Mi
          limits:
            cpu: 500m
            memory: 512Mi
        volumeMounts:
        - mountPath: /var/lib/grafana
          name: grafana-persistent-storage
      volumes:
      - name: grafana-persistent-storage
        emptyDir: {}
---
apiVersion: v1
kind: Service
metadata:
  name: {{ include "phase5-k8s.fullname" . }}-grafana-svc
  labels:
    {{- include "phase5-k8s.labels" . | nindent 4 }}
spec:
  type: NodePort
  ports:
  - port: 3000
    targetPort: 3000
    nodePort: 30300
  selector:
    {{- include "phase5-k8s.selectorLabels" . | nindent 4 }}
    app.kubernetes.io/component: grafana
{{- end }}
EOF
```
**Expected Output**: prometheus.yaml and grafana.yaml files created in templates directory
**Success Condition**: Both files exist with correct monitoring configurations

### Step 9: Create Helper Templates
**Action**: Create the _helpers.tpl file with template helpers
```bash
cat > templates/_helpers.tpl << EOF
{{/*
Expand the name of the chart.
*/}}
{{- define "phase5-k8s.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "phase5-k8s.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "phase5-k8s.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "phase5-k8s.labels" -}}
helm.sh/chart: {{ include "phase5-k8s.chart" . }}
{{ include "phase5-k8s.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "phase5-k8s.selectorLabels" -}}
app.kubernetes.io/name: {{ include "phase5-k8s.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "phase5-k8s.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "phase5-k8s.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Next.js App Fullname
*/}}
{{- define "phase5-k8s.nextjsApp.fullname" -}}
{{- printf "%s-nextjs-app" (include "phase5-k8s.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
LocalAI Fullname
*/}}
{{- define "phase5-k8s.localai.fullname" -}}
{{- printf "%s-localai" (include "phase5-k8s.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
LocalAI Selector Labels
*/}}
{{- define "phase5-k8s.localai.selectorLabels" -}}
{{- include "phase5-k8s.selectorLabels" . }}
app.kubernetes.io/component: localai
{{- end -}}
EOF
```
**Expected Output**: _helpers.tpl file created in templates directory
**Success Condition**: _helpers.tpl exists with correct helper functions

### Step 10: Create README Documentation
**Action**: Create comprehensive README with setup instructions
```bash
cat > README.md << EOF
# Phase 5: Kubernetes Helm Enhancement

This phase enhances the existing Helm chart with Horizontal Pod Autoscaling (HPA), Ingress configuration, and optional monitoring capabilities.

## Features Added

1. **Horizontal Pod Autoscaler (HPA)**: Automatically scales the Next.js application based on CPU usage
   - Target CPU utilization: 70%
   - Minimum replicas: 1
   - Maximum replicas: 5

2. **Ingress Configuration**: Exposes the application via the domain \`todo-chatbot.local\`
   - Requires Minikube ingress addon to be enabled

3. **Optional Monitoring**: Basic Prometheus + Grafana setup (disabled by default)

## Prerequisites

- Kubernetes cluster (tested with Minikube)
- Helm 3+
- kubectl

## Setup Instructions

### 1. Enable Minikube Ingress Addon

\`\`\`bash
minikube addons enable ingress
\`\`\`

### 2. Update /etc/hosts

Add the following entry to your hosts file to map the domain to Minikube's IP:

\`\`\`
# On Linux/Mac: sudo nano /etc/hosts
# On Windows: Edit C:\\Windows\\System32\\Drivers\\etc\\hosts as Administrator
\$(minikube ip) todo-chatbot.local
\`\`\`

### 3. Install the Helm Chart

\`\`\`bash
# Navigate to the phase5-k8s directory
cd phase5-k8s

# Install the chart
helm install todo-chatbot ./
\`\`\`

### 4. Enable Monitoring (Optional)

To enable Prometheus and Grafana monitoring, update the values.yaml file:

\`\`\`yaml
monitoring:
  prometheus:
    enabled: true
  grafana:
    enabled: true
\`\`\`

Or use the --set flag during installation:

\`\`\`bash
helm install todo-chatbot ./ --set monitoring.prometheus.enabled=true --set monitoring.grafana.enabled=true
\`\`\`

## Verifying the Installation

### Check HPA Status

\`\`\`bash
kubectl get hpa
kubectl describe hpa todo-chatbot-nextjs-app
\`\`\`

### Check Ingress

\`\`\`bash
kubectl get ingress
kubectl describe ingress todo-chatbot-ingress
\`\`\`

### Access the Application

Open your browser and navigate to: http://todo-chatbot.local

## Scaling Testing

To test the HPA functionality, you can create a load generator:

\`\`\`bash
# Create a temporary pod to generate CPU load
kubectl run load-generator --image=busybox --rm -it --restart=Never -- stress --cpu 1

# Or use curl to repeatedly hit the application
while true; do curl http://todo-chatbot.local; sleep 0.1; done
\`\`\`

Monitor the pods to see them scale up:

\`\`\`bash
kubectl get pods -w
\`\`\`

## Uninstall

\`\`\`bash
helm uninstall todo-chatbot
\`\`\`

## Values Configuration

The following table lists the configurable parameters of the Helm chart and their default values:

| Parameter | Description | Default |
|-----------|-------------|---------|
| \`nextjsApp.replicaCount\` | Number of Next.js app replicas | \`1\` |
| \`nextjsApp.image.repository\` | Next.js app image repository | \`"todo-chatbot"\` |
| \`nextjsApp.image.pullPolicy\` | Image pull policy | \`"IfNotPresent"\` |
| \`nextjsApp.image.tag\` | Image tag | \`"latest"\` |
| \`hpa.enabled\` | Enable HPA for nextjsApp | \`true\` |
| \`hpa.minReplicas\` | Minimum number of replicas | \`1\` |
| \`hpa.maxReplicas\` | Maximum number of replicas | \`5\` |
| \`hpa.targetCPUUtilizationPercentage\` | Target CPU utilization percentage | \`70\` |
| \`ingress.enabled\` | Enable ingress controller | \`true\` |
| \`ingress.hosts[0].host\` | Hostname for the ingress | \`"todo-chatbot.local"\` |
| \`localai.enabled\` | Enable LocalAI service | \`true\` |
| \`monitoring.prometheus.enabled\` | Enable Prometheus monitoring | \`false\` |
| \`monitoring.grafana.enabled\` | Enable Grafana dashboard | \`false\` |

## Troubleshooting

### Ingress not working
- Ensure the Minikube ingress addon is enabled
- Verify the hosts file entry is correct
- Check that the ingress controller is running: \`kubectl get pods -n ingress-nginx\`

### HPA not scaling
- Verify metrics server is running: \`kubectl top nodes\`
- Check HPA configuration: \`kubectl describe hpa todo-chatbot-nextjs-app\`
- Ensure sufficient CPU load is applied to trigger scaling

### Application not responding
- Check pod status: \`kubectl get pods\`
- Check service configuration: \`kubectl describe svc todo-chatbot-nextjs-app-service\`
- Check application logs: \`kubectl logs deployment/todo-chatbot-nextjs-app\`
EOF
```
**Expected Output**: README.md file created with comprehensive documentation
**Success Condition**: README.md exists with complete setup and usage instructions

### Step 11: Create NOTES.txt for Helm
**Action**: Create NOTES.txt for Helm release information
```bash
cat > templates/notes.txt << EOF
Thank you for installing {{ .Chart.Name }}.

Your release is named {{ .Release.Name }}.

To learn more about the release, try:

  \$ helm status {{ .Release.Name }}
  \$ helm get all {{ .Release.Name }}

{{- if .Values.ingress.enabled }}
APPLICATION ACCESS:
  The application is accessible via the following URL:
    http://todo-chatbot.local

  Note: Make sure you have added the entry to your hosts file:
    \$(minikube ip) todo-chatbot.local
{{- else }}
APPLICATION ACCESS:
  The application is NOT exposed via ingress. You can access it using port forwarding:
    kubectl port-forward svc/{{ include "phase5-k8s.nextjsApp.fullname" . }}-service {{ .Values.nextjsApp.service.port }}:{{ .Values.nextjsApp.service.port }}
{{- end }}

{{- if .Values.hpa.enabled }}
AUTOSCALING:
  Horizontal Pod Autoscaler is enabled for the Next.js application.
  - Minimum replicas: {{ .Values.hpa.minReplicas }}
  - Maximum replicas: {{ .Values.hpa.maxReplicas }}
  - Target CPU utilization: {{ .Values.hpa.targetCPUUtilizationPercentage }}%
{{- else }}
AUTOSCALING:
  Horizontal Pod Autoscaler is disabled.
{{- end }}

MONITORING:
{{- if or .Values.monitoring.prometheus.enabled .Values.monitoring.grafana.enabled }}
  Monitoring is enabled.
{{- if .Values.monitoring.prometheus.enabled }}
  - Prometheus is enabled
{{- end }}
{{- if .Values.monitoring.grafana.enabled }}
  - Grafana is enabled
{{- end }}
{{- else }}
  Monitoring is disabled. To enable, set monitoring.prometheus.enabled=true and/or monitoring.grafana.enabled=true
{{- end }}
EOF
```
**Expected Output**: notes.txt file created in templates directory
**Success Condition**: notes.txt exists with Helm release notes

### Step 12: Validate Helm Chart
**Action**: Run Helm lint to validate the chart syntax
```bash
helm lint .
```
**Expected Output**: No errors, possibly some warnings
**Success Condition**: Helm reports no errors in the chart

### Step 13: Template the Chart Locally
**Action**: Generate Kubernetes manifests locally to verify templates
```bash
helm template test-release ./
```
**Expected Output**: Complete set of Kubernetes manifests printed to stdout
**Success Condition**: Valid Kubernetes YAML manifests are generated without errors

### Step 14: Create Quick Test Script
**Action**: Create a simple test script to verify functionality
```bash
cat > test.sh << EOF
#!/bin/bash

echo "Testing Helm chart functionality..."

# Validate the chart
echo "Validating chart..."
helm lint . || { echo "Chart validation failed"; exit 1; }

# Generate manifests locally
echo "Generating manifests..."
helm template test-release ./ > /tmp/test-manifests.yaml || { echo "Failed to generate manifests"; exit 1; }

# Check if critical resources exist
echo "Checking for required resources..."
grep -q "HorizontalPodAutoscaler" /tmp/test-manifests.yaml && echo "✓ HPA template found"
grep -q "Ingress" /tmp/test-manifests.yaml && echo "✓ Ingress template found"
grep -q "Deployment" /tmp/test-manifests.yaml && echo "✓ Deployment templates found"

echo "Test completed successfully!"
EOF

chmod +x test.sh
```
**Expected Output**: test.sh file created and made executable
**Success Condition**: Test script exists and is executable

### Step 15: Run Final Test
**Action**: Execute the test script to verify everything works
```bash
./test.sh
```
**Expected Output**: Test results showing all required resources are present
**Success Condition**: Test script completes successfully with all checks passing