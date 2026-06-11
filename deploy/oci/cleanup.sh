#!/usr/bin/env bash
set -euo pipefail

required_vars=(OCI_REGION OCI_COMPARTMENT_OCID)

for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing required environment variable: ${var}" >&2
    exit 1
  fi
done

command -v oci >/dev/null 2>&1 || { echo "OCI CLI is not installed or not on PATH." >&2; exit 1; }

APP_NAME="sports-connect"

CONTAINER_ID="$(oci container-instances container-instance list \
  --region "$OCI_REGION" \
  --compartment-id "$OCI_COMPARTMENT_OCID" \
  --display-name "${APP_NAME}-container" \
  --query 'data.items[0].id' \
  --raw-output 2>/dev/null || true)"

if [[ -n "$CONTAINER_ID" && "$CONTAINER_ID" != "null" ]]; then
  echo "Deleting container instance ${CONTAINER_ID}"
  oci container-instances container-instance delete \
    --region "$OCI_REGION" \
    --container-instance-id "$CONTAINER_ID" \
    --force
fi

LB_ID="$(oci lb load-balancer list \
  --region "$OCI_REGION" \
  --compartment-id "$OCI_COMPARTMENT_OCID" \
  --display-name "${APP_NAME}-lb" \
  --query 'data[0].id' \
  --raw-output 2>/dev/null || true)"

if [[ -n "$LB_ID" && "$LB_ID" != "null" ]]; then
  echo "Deleting load balancer ${LB_ID}"
  oci lb load-balancer delete \
    --region "$OCI_REGION" \
    --load-balancer-id "$LB_ID" \
    --force
fi

echo "Cleanup requested. Manually remove VCN/subnet resources if this script created them and you no longer need them."
