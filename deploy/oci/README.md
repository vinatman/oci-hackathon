# Sports Connect OCI Deployment

This folder contains a simple OCI CLI deployment path for the Sports Connect MVP.

## Prerequisites

- OCI CLI installed and configured with a profile that can manage Container Registry, Container Instances, networking, and Load Balancer resources.
- Docker installed locally.
- A PostgreSQL database reachable from the OCI container instance.
- An OCIR auth token.
- Optional: a domain and OCI certificate OCID for HTTPS.
- Optional: existing VCN, subnet, or security list OCIDs if you want to reuse tenant-managed networking.

## Usage

```bash
cp deploy/oci/env.example deploy/oci/.env
set -a
source deploy/oci/.env
set +a
./deploy/oci/deploy.sh
```

The script validates required environment variables, builds backend and frontend images, tags them for OCI Container Registry, pushes them to OCIR, creates or reuses network resources where practical, deploys an OCI Container Instance, configures app environment variables, and prints the final application URL.

If `APP_DOMAIN` and `TLS_CERTIFICATE_OCID` are supplied, the script creates an OCI Load Balancer with an HTTPS listener, prints the load balancer public IP, and prints `https://$APP_DOMAIN` as the application URL.

Manual HTTPS step: create or update your DNS record so `APP_DOMAIN` points at the printed load balancer IP. OCI can create the load balancer listener only after a certificate OCID exists; DNS ownership and certificate issuance are outside this MVP script.

If no domain and certificate are supplied, the script prints the public HTTP endpoint and clearly notes that full HTTPS requires `APP_DOMAIN`, `TLS_CERTIFICATE_OCID`, and DNS pointed at the OCI load balancer.

No OCIDs are hardcoded. Do not put real secrets in this repository.

## Networking Notes

If `OCI_SUBNET_OCID` is supplied, the script reuses that subnet and assumes its route table/security rules are already correct. Ensure inbound HTTP port `80` is allowed, and inbound HTTPS port `443` is allowed when using the load balancer path.

If no subnet is supplied, the script creates a public subnet. If no `OCI_SECURITY_LIST_OCID` is supplied, it also creates a minimal web security list for ports `80` and `443`.

The backend listens on port `4000` inside the container instance. The frontend Nginx container proxies `/api` to the backend over the container instance local network, so the public app entrypoint is the frontend on port `80` or the HTTPS load balancer on port `443`.

## Cleanup

```bash
set -a
source deploy/oci/.env
set +a
./deploy/oci/cleanup.sh
```

The cleanup script removes the container instance and load balancer by display name. Review networking resources manually before deleting shared VCNs, subnets, route tables, internet gateways, or security lists.
