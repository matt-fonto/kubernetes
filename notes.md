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

#### 2.1.1 Minikube

- Allows us to test Kubernetes locally
- Both the master and worker processes run on one node
- Docker is pre-installed
- Used to start up/deleting the cluster

#### 2.1.2 kubectl

- Command line tool for K8s cluster
- Allows us to interact with K8s cluster> environment
- Kubectl is the most powerful of all clients (UI, API, CLI -- kubectl --)
- Used to configure the minikube cluster

```bash
# Install kubectl CLI
brew install kubectl # we wouldn't even need a separate installation. kubectl comes with minikube.
# So, we can skip this step

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

### 2.2 Deployment and Service Files

- Each configuration files has 3 parts:

  1. metadata
  2. specification

     - specification will be specific to the kind of config you're writing (`deployment` or `service`)

  3. status: automatically generated and added by Kubernetes
     - Kubernetes compares the actual vs. the desired state of the application
     - Part of the `self-healing` feature of Kubernetes
     - `etcd` holds the current status of any K8s component

### 2.3 Format of Kubenertes Config

- YAML: "human friendly" data serialization standard for all programming languages
  - It has strict indentation rules
  - Store config file together with the code

## 3. Demo Project Steps

### 3.1. Setup minikube

```bash
minikube start --driver=docker
kubectl get nodes
```

### 3.2. Create DB (PostgreSQL for this example)

1. Create `postgres.yml`

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  ports:
    - port: 5432
  selector:
    app: postgres
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15
          env:
            - name: POSTGRES_USER
              value: myuser
            - name: POSTGRES_PASSWORD
              value: mypassword
            - name: POSTGRES_DB
              value: mydb
          ports:
            - containerPort: 5432
          volumeMounts:
            - mountPath: /var/lib/postgresql/data
              name: postgres-storage
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
```

2. Apply PostgresSQL Config

```bash
kubectl apply -f postgres.yml

# check if Postgres is running
kubectl get pods
kubectl get services
```

### 3.3. Setup backend (Node.js + Express)

1. Create `backend/server.js`

- Also init the package.json with `npm init -y`

```js
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: "myuser",
  host: "postgres-service",
  database: "mydb",
  password: "mypassword",
  port: 5432,
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({ message: "Hello from express", time: result.rows[0] });
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
```

2. Create `Dockerfile` for backend (inside `backend/`)

```dockerfile
# backend/Dockerfile
FROM node:latest

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

3. Create `backend.yml` (at the root)

```yml
# /backend.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: backend-image
          ports:
            - containerPort: 3000
          env:
            - name: PORT
              value: "3000"
            - name: DATABASE_URL
              value: "postgres://myuser:mypassword@postgres-service:5432/mydb"
---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: NodePort
```

4. Build and push docker image

   - Inside `backend`, run:

   ```bash
   docker build -t backend-image
   minikube image load backend-image
   ```

5. Deploy backend

```
kubectl apply -f backend.yml
kubectl get pods
kubectl get services
```

### 3.4. Setup frontend

1. Install vite

```bash
mkdir frontend && cd frontend
npm create vite@latest .
npm install
```

2. Create `frontend/Dockerfile`

```Dockerfile
FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

# server -s: serve the static files in the dist folder
# -l: listen on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
```

3. Create `/frontend.yml` at the root

```yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: frontend-image
          imagePullPolicy: Never # needed to add this
          ports:
            - containerPort: 5173
---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 5173
      targetPort: 5173
  type: NodePort
```

4. Build & deploy frontend

- inside `/frontend`, run:

```bash
# /frontend
docker build -t frontend-image .
minikube image load frontend-image

# / root
cd .. # go back to root
kubectl apply -f frontend.yml
kubectl get pods
kubectl get services

# debug pod
kubectl describe pod <pod-name> # check for errors
kubectl logs <pod-name> # log errors

# I needed to
eval $(minikube docker-env) # 1. docker commands use Minikube's internal daemon
docker build -t frontend-image . # 2. rebuild the image

cd ..
minikube image load front-end # 3. reload the image
kubectl delete deployment frontend # 4. delete previous deployment
kubectl apply -f frontend.yml # 5. apply the config once again
# then it worked
```

5. Access the application

```bash
minikube service frontend-service --url
```
