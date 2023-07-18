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

## Scaling app instances

`$ kubectl scale deployment.apps/recipe-api --replicas=10`

To scale down or reset to the original number, we can also just apply config file again

`$ kubectl apply -f ./recipe-api/recipe-api-deployment.yml`


## History of deployments

`kubectl rollout history deployment.v1.apps/web-api`

## Rollback deployment to previous release number

`kubectl rollout undo deployment.v1.apps/web-api --to-revision=<release_number>`

## delete all k8s objects created

$ kubectl delete services recipe-api-service
$ kubectl delete services web-api-service
$ kubectl delete deployment recipe-api
$ kubectl delete deployment web-api
$ kubectl delete ingress web-api-ingress
$ minikube stop
$ minikube delete

