+++
title = 'Deploying with Kubernetes: A Practical Guide'
date = 2023-01-15T09:00:00-07:00
draft = false
tags = ['kubernetes', 'devops']
description = 'A hands-on walkthrough of deploying a containerized service to Kubernetes, from Dockerfile to rollout.'
author = 'Nimbus Team'
+++

Getting a service running reliably on Kubernetes comes down to a handful of
building blocks: a container image, a Deployment, and a Service to expose it.
This walkthrough covers the essentials.

{{< note type="tip" title="Before you start" >}}
You'll need `kubectl` configured against a cluster (Minikube, kind, or a
managed cluster all work fine for this walkthrough).
{{< /note >}}

## 1. Build and tag the image

```bash
docker build -t registry.example.com/api:1.4.0 .
docker push registry.example.com/api:1.4.0
```

## 2. Define the Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: api
          image: registry.example.com/api:1.4.0
          ports:
            - containerPort: 8080
          readinessProbe:
            httpGet:
              path: /healthz
              port: 8080
```

## 3. Roll it out

{{< terminal command="bash" user="dev" host="k8s-master" path="~/api" >}}
kubectl apply -f deployment.yaml
deployment.apps/api created
kubectl rollout status deployment/api
deployment "api" successfully rolled out
{{< /terminal >}}

{{< note type="warning" title="Watch your readiness probes" >}}
A missing or too-strict readiness probe is the most common cause of a rollout
that "succeeds" but serves traffic to pods that aren't actually ready.
{{< /note >}}

## Architecture

{{< mermaid title="Request flow" >}}
graph LR
    A[Client] --> B[Ingress]
    B --> C[Service]
    C --> D[Pod 1]
    C --> E[Pod 2]
    C --> F[Pod 3]
{{< /mermaid >}}

That's the core loop: build, define, apply, verify. From here you'd typically
add a HorizontalPodAutoscaler and wire this into CI so every merge to `main`
triggers a new rollout automatically.
