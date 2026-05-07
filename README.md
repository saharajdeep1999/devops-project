# DevOps Assignment — Containerization, Kubernetes & Observability

## Team
| Name | Student ID |
|------|-----------|
| Rajdeep Saha | 100005470 |
| Yash Gadher | 100007325 |
| Nishchitha Seege Mallesha | 100007030 |

## Repository Structure
## Deliverable 1 — Run with Docker Compose

```bash
docker compose up --build
```

Test:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/items
```

## Deliverable 2 — Deploy to Minikube

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

```bash
k6 run tests/load-test.js
```

## Deliverable 4 — Self-healing Demo

```bash
kubectl exec -it <pod-name> -- kill 1
kubectl get pods -w
```
