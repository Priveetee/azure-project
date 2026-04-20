# Security & Observability

This document provides quick operational steps for the security scans and monitoring added to the repository.

CI Security:
- See `.github/workflows/security-scans.yml` — runs Trivy (image scan) and OWASP ZAP baseline on PRs and pushes to `main`.

Terraform monitoring:
- A `helm_release` for `kube-prometheus-stack` is available in `terraform/monitoring.tf`.
- After configuring `terraform.tfvars` and `kubeconfig`, run:

```bash
cd terraform
terraform init
terraform apply
```

Notes:
- Grafana initial admin password is set to `grafana` in the default values (change in `terraform/monitoring.tf`).
