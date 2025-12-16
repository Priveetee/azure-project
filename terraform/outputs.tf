# =============================================================================
# Outputs
# =============================================================================

output "app_namespace" {
  description = "Kubernetes namespace where the app is deployed"
  value       = var.app_namespace
}

output "deployment_name" {
  description = "Name of the Kubernetes deployment"
  value       = kubernetes_deployment.app.metadata[0].name
}

output "service_name" {
  description = "Name of the Kubernetes service"
  value       = kubernetes_service.app.metadata[0].name
}

output "service_cluster_ip" {
  description = "Cluster IP of the service"
  value       = kubernetes_service.app.spec[0].cluster_ip
}

output "ingress_name" {
  description = "Name of the Kubernetes ingress"
  value       = kubernetes_ingress_v1.app.metadata[0].name
}

output "image_deployed" {
  description = "Full image path that was deployed"
  value       = "${var.acr_login_server}/${var.app_name}:${var.image_tag}"
}
