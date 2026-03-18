# Deploying to Kubernetes (K8s)

This guide helps you deploy the AI Course application (Frontend + Backend) to a Kubernetes cluster.

## Prerequisites

1. **Kubernetes Cluster**: Ensure you have a cluster running (e.g., GKE, EKS, AKS, or local `minikube` / Docker Desktop).
2. **kubectl**: Installed and configured to talk to your cluster.
3. **Docker Registry**: A place to store your container images (e.g., Docker Hub, GCR, ECR).

## Step 1: Build and Push Docker Images

You need to build Docker images for both services and push them to a registry.

### Backend

```bash
cd backend
docker build -t your-docker-username/ai-course-backend:latest .
docker push your-docker-username/ai-course-backend:latest
cd ..
```

### Frontend

```bash
cd frontend
docker build -t your-docker-username/ai-course-frontend:latest .
docker push your-docker-username/ai-course-frontend:latest
cd ..
```

*Replace `your-docker-username` with your actual registry username or URL.*

## Step 2: Configure Secrets

1. Open `k8s/secrets.yaml`.
2. Replace the placeholder values with your actual credentials:
    * `DATABASE_URL`: Your Supabase connection string (`postgresql+asyncpg://...`)
    * `SUPABASE_URL`: Your Supabase project URL (`https://...`)
    * `SUPABASE_ANON_KEY`: eyJhb... (use your actual full key)
    * `GEMINI_API_KEY`: Your Google Gemini API Key.
    * **Important**: In production, you should base64 encode these values or use a secret management tool (like Vault or Sealed Secrets). For simple `kubectl apply`, passing them as plain stringData (as configured) works but check your cluster's RBAC.

## Step 3: Update Manifests

1. Open `k8s/backend-deployment.yaml`.
    * Update `image: your-docker-registry/ai-course-backend:latest` to match the image you pushed.
2. Open `k8s/frontend-deployment.yaml`.
    * Update `image: your-docker-registry/ai-course-frontend:latest` to match the frontend image.

## Step 4: Apply to Cluster

Run the following commands to deploy:

```bash
# 1. Apply Secrets
kubectl apply -f k8s/secrets.yaml

# 2. Deploy Backend
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

# 3. Deploy Frontend
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

## Step 5: Verify Deployment

Check the status of your pods and services:

```bash
kubectl get pods
kubectl get services
```

* **Backend Service**: If using `LoadBalancer`, wait for an `EXTERNAL-IP`.
* **Frontend Service**: If using `LoadBalancer`, wait for an `EXTERNAL-IP`.

Access your application via the Frontend's External IP.

## Troubleshooting

* **CrashLoopBackOff**: Check logs with `kubectl logs <pod-name>`.
* **Database Connection Issues**: Verify the `DATABASE_URL` in `secrets.yaml` is correct and accessible from the cluster.
