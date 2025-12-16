terraform {
  required_version = ">= 1.0.0"

  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }

  # Optional: Configure remote backend for state management
  # backend "azurerm" {
  #   resource_group_name  = ""
  #   storage_account_name = ""
  #   container_name       = "tfstate"
  #   key                  = "azure-project.tfstate"
  # }
}

# Configure the Kubernetes provider
provider "kubernetes" {
  # Option 1: Use kubeconfig file (for local development)
  config_path    = var.kubeconfig_path
  config_context = var.kubeconfig_context

  # Option 2: Direct connection to K3s (uncomment if needed)
  # host                   = var.k3s_host
  # client_certificate     = base64decode(var.k3s_client_certificate)
  # client_key             = base64decode(var.k3s_client_key)
  # cluster_ca_certificate = base64decode(var.k3s_cluster_ca_certificate)
}

# Configure the Helm provider
provider "helm" {
  kubernetes {
    config_path    = var.kubeconfig_path
    config_context = var.kubeconfig_context
  }
}
