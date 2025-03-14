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

## 1. Main Concepts

### 1.1. K8s Architecture

- Cluster: Set of machines (nodes) running K8s
- Node: A single machine (physical/virtual) in the cluster, running workloads
- Master node (Control plane): Manages the cluster, scheduling workloads, and maintaining the desired state
- Worker node: Runs applications (containers) assigned by the master

#### 1.1.1 Master Node

It has different services running on it, such as:

- API Server: The entrypoint to K8s cluster. Ican be interacted through UI, API, or CLI
- Controller Manager: Keeps track of what is happening in the cluster
- Scheduler: Ensures Pod placement. It decides on which Node new Pod should be scheduled
- etcd: K8s backing store. It holds the current state of the cluster

It's important to have at least 2 master nodes in production

- If one master is down, the other can take its place

#### 1.1.2 Virtual network

- Allows the different nodes to connect to the cluster and the control plane.
- It creastes one unified machine

#### 1.1.3 Worker node

Compared with the `Master Node`,:

- It deals with higher workload
- It's much bigger and has more resources

![virtual network](image.png)

### 1.2. Key Kubernetes Components

- Pod: Smallest deployable unit, containing one or more containers
- Deployment: Manages pod creation and updates, ensuring the correct number of replicas
- Service: Exposes a set of pods under a stable IP for communication
- Ingress: Routes external traffic into the cluster based on rules
- ConfigMap & Secret: Stores configuration data and sensitive information separately from application code
- PersistenVolument (PV) & PersistentVolumeClaim (PVC): Handles persistent storage for containers

#### 1.2.1 Node and Pod (Abstraction of container)

- Node: Virtual or physical machine
- Pod: smallest unit in Kubernetes
  - Layer of abstraction over containers
  - It's an abstraction over a container
  - It adds a layer of abstraction over the container in case you'd like to change Docker to any other container application
  - Through this layer, you don't need to work directly with the container, you have the Pod interface
  - Usually **1 application** per Pod
  - Each Pod gets its **own IP address**
  - Pods are ephemeral

#### 1.2.2 Service (Allows communication) and Ingress (Route traffic into the cluster)

- Service:

  - It has a permanent IP address
  - Its lifecycle isn't connected with the Pod's, meaning if the Pod dies, the service and its IP address will stay

- Ingress:
  - An external request, before getting to the service, goes through the Ingress and the ingress directs it to the service
    ![ingress](image-1.png)

#### 1.2.3 ConfigMap & Secret

- ConfigMap: Contains configuration that are external to the application (e.g., urls of databases)
  - Used for **non-confidential** data!
- Secret: Similar to ConfigMap, but to store confidential information (e.g., passwords, admin users, certificates)

#### 1.2.4 Volume (data persistence)

- Used for data persistence
- References some data storage unit, either remove or local
- The cluster `connects` with the storage. Think of it as an external hard-drive plugged into our cluster

#### 1.2.5 Deployment & StatefulSet

- Deployment: It's a `blueprint` for `my-app` Pods. For stateLESS apps

  - In K8s, we don't work with Pods directly, but with Deployments
  - It allows the scale up/down of pods based on config
  - It's a layer of abstraction on pods, which by themselves are a layer of abstraction over containers

- Statefulset: Similar to what deployment is for `Pods`, but for `stateful` applications (e.g., dbs). For stateFUL apps
  - MySQL, MongoDB, etc, shoud be created with `Statefulset`, not deployments
  - It allows different dbs to connect to a service and orchestrates the order of which is reading and which is writing
  - Guarantees data security
  - Setting up a `Statefulset` is rather cumbersome, so it's quite common to **host DBs outside K8s cluster**

![volume](image-2.png)

### 1.3. Networking & Communication

- ClusterIP: Default service type, internal to the cluster
- NodePort: Exposes a service on a static port of each node
- LoadBalancer: Uses cloud providers' load balancer for external access
- DNS: K8s automatically assigns a DNS name to services

### 1.4. Scaling & Self-healing

- Horizontal Pod Autoscaler (HPA): Adjusts the number of pods based on CPU/memory usage
- Vertical Pod Autoscaler (VPA): Adjusts resource requests/limits dynamically
- ReplicaSet: Ensures a specified number of pod replicas are running
- Liveness & Readiness Probes: Monitors container health and restarts failing ones

## 2. Kubernetes Configuration

- API Server is the only entry point to interact with the cluster
  - UI, API, CLI go through it
  - Can be accessed through YAML or JSON file

### 2.1 First Steps

1. Prepare Kubernetes environment

```bash
# Install kubectl CLI
brew install kubectl

# Install Minikube
brew install minikube

# Start a kubernetes cluster
minikube start --driver=docker

# Verify installation
minikiube status

# Check Kubernetes cluster
kubectl cluster-info
kubectl get nodes

# Enable Kubernetes Dashboard (optional)
minikube dashboard
```

2. Create a `Deployment` file

```yml
apiVersion: apps/v1 # specifies Kubernetes API version
kind: Deployment # declares a deployment resource
metadata:
  name: my-app # name of deployment
spec:
  replicas: 2 # numbers of pod replicas (scaling)
  selector: # defines how to find pods related to this deployment
    matchLabels:
      app: my-app
  template: # pod template (what each pod should look like)
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: nginx:latest # container image to use
          ports:
            - containerPort: 80 # port the container listens on
```

3. Apply deployment file

```bash
kubectl apply -f deployment.yaml

# check if deployment was created
kubectl get deployments
kubectl get pods
```

4. Expose application wtih `service.yml`

```yml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service # name of the service
spec:
  selector: # connects to the deployment using labels
    app: my-app
  ports:
    - protocol: TCP # specifies the communication protocol
      port: 80 # external port (what users access)
      targetPort: 80 # internal pod port (matches deployment)
  type: NodePort # exposes service on a node-wide port
```

5. Apply service

```bash
kubectl apply -f service.yml

# get service url
minikube service my-app-service --url

# verify service
kubectl get services
```
