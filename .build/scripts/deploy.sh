#!/usr/bin/env bash
set -euo pipefail

: "${IMAGE:?IMAGE is required}"
: "${DEPLOYMENT:?DEPLOYMENT is required}"
: "${NAMESPACE:?NAMESPACE is required}"

KUBECTL="${KUBECTL:-kubectl}"
if [ -n "${KUBECONFIG:-}" ]; then
  KUBECTL="kubectl --kubeconfig ${KUBECONFIG}"
elif [ -f /home/deployer/.kube/config ]; then
  KUBECTL="kubectl --kubeconfig /home/deployer/.kube/config"
fi

$KUBECTL apply -f .build/k8s/01-namespace.yaml
$KUBECTL apply -f .build/k8s/02-service.yaml
$KUBECTL apply -f .build/k8s/03-ingress.yaml
sed "s|IMAGE_PLACEHOLDER|${IMAGE}|g" .build/k8s/prod/deploy.yaml | $KUBECTL apply -f -
$KUBECTL rollout status "deployment/${DEPLOYMENT}" -n "${NAMESPACE}" --timeout=300s
