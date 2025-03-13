# Kubernetes

- Kurbernetes (K8s) is an open-source container orchestration system
- Automates deployment, scaling, and management of containerized applications

### What problems K8s solve?

- Trend from Monolith to Microservices (small, independent applications)
- Demand for a proper, practical way to manage hundreds of containers

### What features does K8s (orchestration tool) offer?

- High availability or no downtime
- Scalability or high performance
- Disaster recovery (backup and restore)

## Main Concepts

### 1. K8s Architecture

- Cluster: Set of machines (nodes) running K8s
- Node: A single machine (physical/virtual) in the cluster, running workloads
- Master node (Control plane): Manages the cluster, scheduling workloads, and maintaining the desired state
- Worker node: Runs applications (containers) assigned by the master

### 2. Key Kubernetes Components

- Pod: Smallest deployable unit, containing one or more containers
- Deployment: Manages pod creation and updates, ensuring the correct number of replicas
- Service: Exposes a set of pods under a stable IP for communication
- Ingress: Routes external traffic into the cluster based on rules
- ConfigMap & Secret: Stores configuration data and sensitive information separately from application code
- PersistenVolument (PV) & PersistentVolumeClaim (PVC): Handles persistent storage for containers

### 3. Networking & Communication

- ClusterIP: Default service type, internal to the cluster
- NodePort: Exposes a service on a static port of each node
- LoadBalancer: Uses cloud providers' load balancer for external access
- DNS: K8s automatically assigns a DNS name to services

### 4. Scaling & Self-healing

- Horizontal Pod Autoscaler (HPA): Adjusts the number of pods based on CPU/memory usage
- Vertical Pod Autoscaler (VPA): Adjusts resource requests/limits dynamically
- ReplicaSet: Ensures a specified number of pod replicas are running
- Liveness & Readiness Probes: Monitors container health and restarts failing ones
