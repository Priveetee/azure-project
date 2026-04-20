# Security and Scanning

This repository includes a simple CI security pipeline and basic observability deployment.

CI:
- `Trivy` scans the built image in `.github/workflows/security-scans.yml`.
- `OWASP ZAP` runs a baseline scan against a locally started instance (docker-compose).

Observability:
- Prometheus + Grafana are deployed via Terraform Helm release in `terraform/monitoring.tf`.

Local testing:

1. Run Trivy locally (requires docker & trivy):
   ```bash
   docker build -f Docker -t local-image:latest .
   trivy image local-image:latest
   ```

2. Run OWASP ZAP baseline locally (requires docker):
   ```bash
   docker-compose up -d
   docker run --rm -v $(pwd):/zap/wrk/:rw -t owasp/zap2docker-weekly zap-baseline.py -t http://localhost:3000 -r zap_report.html
   ```

Accessing monitoring:
- The Terraform Helm release deploys the `kube-prometheus-stack` into the `monitoring` namespace. Configure your `kubectl` context and run `terraform apply` from `terraform/`.

Reporting security issues: open an issue or contact the repo maintainers.
