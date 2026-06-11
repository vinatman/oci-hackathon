#!/usr/bin/env bash
set -euo pipefail

APP_NAME="sports-connect"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

required_vars=(
  OCI_REGION
  OCI_COMPARTMENT_OCID
  OCI_AVAILABILITY_DOMAIN
  OCI_IMAGE_NAME
  OCI_REGISTRY_NAMESPACE
  OCI_REGISTRY_REPO
  OCI_AUTH_TOKEN
  DATABASE_URL
)

for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing required environment variable: ${var}" >&2
    exit 1
  fi
done

command -v oci >/dev/null 2>&1 || { echo "OCI CLI is not installed or not on PATH." >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "Docker is not installed or not on PATH." >&2; exit 1; }

OCIR_HOST="${OCI_REGION}.ocir.io"
OCIR_USERNAME="${OCI_USERNAME:-$OCI_REGISTRY_NAMESPACE}"
LOCAL_BACKEND_IMAGE="${OCI_IMAGE_NAME}-backend:latest"
LOCAL_FRONTEND_IMAGE="${OCI_IMAGE_NAME}-frontend:latest"
BACKEND_IMAGE="${OCIR_HOST}/${OCI_REGISTRY_NAMESPACE}/${OCI_REGISTRY_REPO}/${OCI_IMAGE_NAME}-backend:latest"
FRONTEND_IMAGE="${OCIR_HOST}/${OCI_REGISTRY_NAMESPACE}/${OCI_REGISTRY_REPO}/${OCI_IMAGE_NAME}-frontend:latest"

echo "Logging in to ${OCIR_HOST}"
printf '%s' "$OCI_AUTH_TOKEN" | docker login "$OCIR_HOST" --username "$OCIR_USERNAME" --password-stdin

echo "Building Docker images"
docker build -f "$ROOT_DIR/backend/Dockerfile" -t "$LOCAL_BACKEND_IMAGE" "$ROOT_DIR"
docker build -f "$ROOT_DIR/frontend/Dockerfile" -t "$LOCAL_FRONTEND_IMAGE" --build-arg VITE_API_BASE_URL=/api "$ROOT_DIR"

echo "Tagging images for OCI Container Registry"
docker tag "$LOCAL_BACKEND_IMAGE" "$BACKEND_IMAGE"
docker tag "$LOCAL_FRONTEND_IMAGE" "$FRONTEND_IMAGE"

echo "Pushing images to OCI Container Registry"
docker push "$BACKEND_IMAGE"
docker push "$FRONTEND_IMAGE"

VCN_OCID="${OCI_VCN_OCID:-}"
SUBNET_OCID="${OCI_SUBNET_OCID:-}"
SECURITY_LIST_OCID="${OCI_SECURITY_LIST_OCID:-}"

if [[ -z "$VCN_OCID" ]]; then
  echo "Creating VCN"
  VCN_OCID="$(oci network vcn create \
    --region "$OCI_REGION" \
    --compartment-id "$OCI_COMPARTMENT_OCID" \
    --display-name "${APP_NAME}-vcn" \
    --cidr-block "10.42.0.0/16" \
    --query 'data.id' \
    --raw-output)"

  IG_OCID="$(oci network internet-gateway create \
    --region "$OCI_REGION" \
    --compartment-id "$OCI_COMPARTMENT_OCID" \
    --vcn-id "$VCN_OCID" \
    --is-enabled true \
    --display-name "${APP_NAME}-igw" \
    --query 'data.id' \
    --raw-output)"

  RT_OCID="$(oci network route-table list \
    --region "$OCI_REGION" \
    --compartment-id "$OCI_COMPARTMENT_OCID" \
    --vcn-id "$VCN_OCID" \
    --query 'data[0].id' \
    --raw-output)"

  oci network route-table update \
    --region "$OCI_REGION" \
    --rt-id "$RT_OCID" \
    --route-rules "[{\"cidrBlock\":\"0.0.0.0/0\",\"networkEntityId\":\"${IG_OCID}\"}]" \
    --force >/dev/null

fi

if [[ -z "$SUBNET_OCID" && -z "$SECURITY_LIST_OCID" ]]; then
  echo "Creating public web security list"
  SECURITY_LIST_OCID="$(oci network security-list create \
    --region "$OCI_REGION" \
    --compartment-id "$OCI_COMPARTMENT_OCID" \
    --vcn-id "$VCN_OCID" \
    --display-name "${APP_NAME}-web-security-list" \
    --egress-security-rules '[{"destination":"0.0.0.0/0","protocol":"all"}]' \
    --ingress-security-rules '[{"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":80,"max":80}}},{"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":443,"max":443}}}]' \
    --query 'data.id' \
    --raw-output)"
fi

if [[ -z "$SUBNET_OCID" ]]; then
  echo "Creating public subnet"
  subnet_args=(
    --region "$OCI_REGION"
    --compartment-id "$OCI_COMPARTMENT_OCID"
    --vcn-id "$VCN_OCID"
    --display-name "${APP_NAME}-public-subnet"
    --cidr-block "10.42.1.0/24"
    --prohibit-public-ip-on-vnic false
    --query 'data.id'
    --raw-output
  )

  if [[ -n "$SECURITY_LIST_OCID" ]]; then
    subnet_args+=(--security-list-ids "[\"${SECURITY_LIST_OCID}\"]")
  fi

  SUBNET_OCID="$(oci network subnet create \
    "${subnet_args[@]}")"
else
  echo "Using existing subnet ${SUBNET_OCID}; ensure its security rules allow inbound HTTP on port 80 and HTTPS on port 443 if using a load balancer."
fi

CONTAINER_NAME="${APP_NAME}-container"
EXISTING_CONTAINER_ID="$(oci container-instances container-instance list \
  --region "$OCI_REGION" \
  --compartment-id "$OCI_COMPARTMENT_OCID" \
  --display-name "$CONTAINER_NAME" \
  --lifecycle-state ACTIVE \
  --query 'data.items[0].id' \
  --raw-output 2>/dev/null || true)"

if [[ -n "$EXISTING_CONTAINER_ID" && "$EXISTING_CONTAINER_ID" != "null" ]]; then
  echo "Deleting existing container instance ${EXISTING_CONTAINER_ID}"
  oci container-instances container-instance delete \
    --region "$OCI_REGION" \
    --container-instance-id "$EXISTING_CONTAINER_ID" \
    --force
fi

echo "Creating container instance"
CONTAINER_ID="$(oci container-instances container-instance create \
  --region "$OCI_REGION" \
  --compartment-id "$OCI_COMPARTMENT_OCID" \
  --availability-domain "$OCI_AVAILABILITY_DOMAIN" \
  --display-name "$CONTAINER_NAME" \
  --shape "CI.Standard.E4.Flex" \
  --shape-config '{"ocpus":1,"memoryInGBs":6}' \
  --vnics "[{\"subnetId\":\"${SUBNET_OCID}\",\"isPublicIpAssigned\":true}]" \
  --containers "[{\"displayName\":\"backend\",\"imageUrl\":\"${BACKEND_IMAGE}\",\"environmentVariables\":{\"DATABASE_URL\":\"${DATABASE_URL}\",\"PORT\":\"4000\",\"ENABLE_WEB_SEARCH_PROVIDER\":\"false\",\"ENABLE_TICKETS_WIDGET\":\"true\",\"ENABLE_BETTING_WIDGET\":\"false\",\"ENABLE_AD_WIDGET\":\"true\",\"ENABLE_PARTNER_PROMOTIONS\":\"true\"},\"ports\":[{\"port\":4000,\"protocol\":\"TCP\"}]},{\"displayName\":\"frontend\",\"imageUrl\":\"${FRONTEND_IMAGE}\",\"environmentVariables\":{\"BACKEND_UPSTREAM\":\"http://127.0.0.1:4000\"},\"ports\":[{\"port\":80,\"protocol\":\"TCP\"}]}]" \
  --query 'data.id' \
  --raw-output)"

echo "Waiting for container instance to become ACTIVE"
oci container-instances container-instance get \
  --region "$OCI_REGION" \
  --container-instance-id "$CONTAINER_ID" \
  --wait-for-state ACTIVE >/dev/null

PUBLIC_IP="$(oci container-instances container-instance get \
  --region "$OCI_REGION" \
  --container-instance-id "$CONTAINER_ID" \
  --query 'data.vnics[0]."public-ip"' \
  --raw-output)"

FINAL_URL="http://${PUBLIC_IP}"

if [[ -n "${APP_DOMAIN:-}" && -n "${TLS_CERTIFICATE_OCID:-}" ]]; then
  echo "APP_DOMAIN and TLS_CERTIFICATE_OCID supplied. Creating HTTPS load balancer path."
  LB_ID="$(oci lb load-balancer create \
    --region "$OCI_REGION" \
    --compartment-id "$OCI_COMPARTMENT_OCID" \
    --display-name "${APP_NAME}-lb" \
    --shape-name flexible \
    --shape-details '{"minimumBandwidthInMbps":10,"maximumBandwidthInMbps":10}' \
    --subnet-ids "[\"${SUBNET_OCID}\"]" \
    --is-private false \
    --query 'data.id' \
    --raw-output)"

  oci lb load-balancer get --region "$OCI_REGION" --load-balancer-id "$LB_ID" --wait-for-state SUCCEEDED >/dev/null
  LB_PUBLIC_IP="$(oci lb load-balancer get \
    --region "$OCI_REGION" \
    --load-balancer-id "$LB_ID" \
    --query 'data."ip-addresses"[0]."ip-address"' \
    --raw-output)"

  oci lb backend-set create \
    --region "$OCI_REGION" \
    --load-balancer-id "$LB_ID" \
    --name "${APP_NAME}-frontend" \
    --policy ROUND_ROBIN \
    --health-checker-protocol HTTP \
    --health-checker-url-path /health \
    --health-checker-port 80 >/dev/null

  oci lb backend create \
    --region "$OCI_REGION" \
    --load-balancer-id "$LB_ID" \
    --backend-set-name "${APP_NAME}-frontend" \
    --ip-address "$PUBLIC_IP" \
    --port 80 >/dev/null

  echo "Create or update DNS for ${APP_DOMAIN} to point at load balancer IP ${LB_PUBLIC_IP} before using the HTTPS URL."
  oci lb listener create \
    --region "$OCI_REGION" \
    --load-balancer-id "$LB_ID" \
    --name "${APP_NAME}-https" \
    --default-backend-set-name "${APP_NAME}-frontend" \
    --port 443 \
    --protocol HTTP \
    --ssl-configuration "{\"certificateIds\":[\"${TLS_CERTIFICATE_OCID}\"],\"verifyPeerCertificate\":false}" >/dev/null

  FINAL_URL="https://${APP_DOMAIN}"
else
  echo "No APP_DOMAIN and TLS_CERTIFICATE_OCID supplied."
  echo "Full HTTPS requires providing APP_DOMAIN and TLS_CERTIFICATE_OCID, then pointing DNS at the OCI load balancer public IP."
fi

echo "Sports Connect deployed."
echo "Container instance OCID: ${CONTAINER_ID}"
if [[ -n "${LB_PUBLIC_IP:-}" ]]; then
  echo "Load balancer IP for DNS: ${LB_PUBLIC_IP}"
fi
echo "Application URL: ${FINAL_URL}"
