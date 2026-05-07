# DevOps Assignment — Containerization, Kubernetes & Observability

## Team
| Name | Student ID |
|------|-----------|
| Rajdeep Saha | 100005470 |
| Yash Gadher | 100007325 |
| Nishchitha Seege Mallesha | 100007030 |

## Repository Structure
## Deliverable 1 — Run with Docker Compose
Docker Compose explains the --build flag (forces fresh image rebuild vs using cache) and the two test endpoints: /health as a liveness check and /items as a full-stack data validation.

```bash
docker compose up --build
```

Test:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/items
```

## Deliverable 2 — Deploy to Minikube
Minikube covers the most variables. The critical concept is minikube docker-env | Invoke-Expression — this redirects your local Docker CLI into Minikube's internal daemon so the image you build is visible to Kubernetes. Without this step, pods fail with ImagePullBackOff. Variables include the image tag (crud-app:latest), build context path (./app), and both K8s manifests.
```bash
minikube start
minikube docker-env | Invoke-Expression
docker build -t crud-app:latest ./app
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl get pods
minikube service crud-app-service --url
```

## Deliverable 3 — Load Test
k6 Load Test documents the key k6 concepts: VUs (virtual users), stages for ramping load, thresholds for pass/fail criteria, and the built-in http_req_duration metric for latency percentiles.

```bash
k6 run tests/load-test.js
```

## Deliverable 4 — Self-healing Demo
Self-healing explains <pod-name> as a runtime placeholder you fill from kubectl get pods, why kill 1 crashes the container (PID 1 = init process), the -w watch flag for real-time streaming, and restartPolicy: Always as the Deployment setting that enables automatic recovery.

```bash
kubectl exec -it <pod-name> -- kill 1
kubectl get pods -w
```
