# =============================================================================
# Kubernetes/K3s Connection Variables
# =============================================================================

variable "kubeconfig_path" {
  description = "Path to the kubeconfig file for K3s cluster"
  type        = string
  default     = "~/.kube/config"
}

variable "kubeconfig_context" {
  description = "Kubernetes context to use from kubeconfig"
  type        = string
  default     = ""  # TODO: Set your K3s context name
}

# Uncomment these if connecting directly to K3s without kubeconfig
# variable "k3s_host" {
#   description = "K3s API server endpoint"
#   type        = string
#   default     = ""  # e.g., https://<azure-vm-ip>:6443
# }
#
# variable "k3s_client_certificate" {
#   description = "Base64 encoded client certificate for K3s"
#   type        = string
#   sensitive   = true
#   default     = ""
# }
#
# variable "k3s_client_key" {
#   description = "Base64 encoded client key for K3s"
#   type        = string
#   sensitive   = true
#   default     = ""
# }
#
# variable "k3s_cluster_ca_certificate" {
#   description = "Base64 encoded cluster CA certificate for K3s"
#   type        = string
#   sensitive   = true
#   default     = ""
# }

# =============================================================================
# Azure Container Registry Variables
# =============================================================================

variable "acr_login_server" {
  description = "Azure Container Registry login server URL"
  type        = string
  default     = ""  # TODO: e.g., myregistry.azurecr.io
}

variable "acr_username" {
  description = "Azure Container Registry username"
  type        = string
  default     = ""  # TODO: ACR admin username or service principal ID
}

variable "acr_password" {
  description = "Azure Container Registry password"
  type        = string
  sensitive   = true
  default     = ""  # TODO: Set via TF_VAR_acr_password or terraform.tfvars
}

# =============================================================================
# Application Variables
# =============================================================================

variable "app_name" {
  description = "Name of the application"
  type        = string
  default     = "azure-project"
}

variable "app_namespace" {
  description = "Kubernetes namespace for the application"
  type        = string
  default     = "default"
}

variable "image_tag" {
  description = "Docker image tag to deploy"
  type        = string
  default     = "latest"
}

variable "replicas" {
  description = "Number of pod replicas"
  type        = number
  default     = 2
}

variable "node_env" {
  description = "Node environment (production, staging, development)"
  type        = string
  default     = "production"
}
