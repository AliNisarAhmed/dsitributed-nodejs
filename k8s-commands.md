Run the following commands to start web-api-service

- `minikube start` - to start minikube
- `eval $(minikube -p minikube docker-env)` - this switches docker daemon to minikube
- `minikube addons enable ingress`
- `docker build -t web-api:v<version> .`
- `kubectl apply -f web-api-deployment.yml`
- `kubectl apply -f web-api-network.yml`
- `kubectl get ingress web-api-ingress` - this gets the IP address of the ingress
- `curl -H "Host: example.org" http://<ip_from_above_step>`


Run the following commands for recipe-api

- `eval $(minikube -p minikube docker-env)` - ensure Minikube docker
- `docker build -t recipe-api:v<version> .`
- `kubectl apply -f recipe-api-deployment.yml`
- `kubectl apply -f recipe-api-network.yml`
