# =============================================================================
# Kubernetes Namespace
# =============================================================================

resource "kubernetes_namespace" "app" {
  count = var.app_namespace != "default" ? 1 : 0

  metadata {
    name = var.app_namespace
    labels = {
      app        = var.app_name
      managed-by = "terraform"
    }
  }
}

# =============================================================================
# Docker Registry Secret (for pulling from ACR)
# =============================================================================

resource "kubernetes_secret" "acr_registry" {
  metadata {
    name      = "${var.app_name}-acr-secret"
    namespace = var.app_namespace
  }

  type = "kubernetes.io/dockerconfigjson"

  data = {
    ".dockerconfigjson" = jsonencode({
      auths = {
        (var.acr_login_server) = {
          username = var.acr_username
          password = var.acr_password
          auth     = base64encode("${var.acr_username}:${var.acr_password}")
        }
      }
    })
  }

  depends_on = [kubernetes_namespace.app]
}

# =============================================================================
# Kubernetes Deployment
# =============================================================================

resource "kubernetes_deployment" "app" {
  metadata {
    name      = var.app_name
    namespace = var.app_namespace
    labels = {
      app        = var.app_name
      managed-by = "terraform"
    }
  }

  spec {
    replicas = var.replicas

    selector {
      match_labels = {
        app = var.app_name
      }
    }

    template {
      metadata {
        labels = {
          app = var.app_name
        }
      }

      spec {
        image_pull_secrets {
          name = kubernetes_secret.acr_registry.metadata[0].name
        }

        container {
          name  = var.app_name
          image = "${var.acr_login_server}/${var.app_name}:${var.image_tag}"

          port {
            name           = "http"
            container_port = 80
            protocol       = "TCP"
          }

          port {
            name           = "app"
            container_port = 3000
            protocol       = "TCP"
          }

          env {
            name  = "NODE_ENV"
            value = var.node_env
          }

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "512Mi"
            }
          }

          liveness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 30
            period_seconds        = 10
            timeout_seconds       = 5
            failure_threshold     = 3
          }

          readiness_probe {
            http_get {
              path = "/"
              port = 3000
            }
            initial_delay_seconds = 5
            period_seconds        = 5
            timeout_seconds       = 3
            failure_threshold     = 3
          }
        }
      }
    }
  }

  depends_on = [kubernetes_namespace.app]
}

# =============================================================================
# Kubernetes Service
# =============================================================================

resource "kubernetes_service" "app" {
  metadata {
    name      = var.app_name
    namespace = var.app_namespace
    labels = {
      app        = var.app_name
      managed-by = "terraform"
    }
  }

  spec {
    type = "ClusterIP"

    selector = {
      app = var.app_name
    }

    port {
      name        = "http"
      port        = 80
      target_port = 80
      protocol    = "TCP"
    }

    port {
      name        = "app"
      port        = 3000
      target_port = 3000
      protocol    = "TCP"
    }
  }

  depends_on = [kubernetes_deployment.app]
}

# =============================================================================
# Kubernetes Ingress (using K3s Traefik)
# =============================================================================

resource "kubernetes_ingress_v1" "app" {
  metadata {
    name      = var.app_name
    namespace = var.app_namespace
    labels = {
      app        = var.app_name
      managed-by = "terraform"
    }
    annotations = {
      "kubernetes.io/ingress.class"                = "traefik"
      "traefik.ingress.kubernetes.io/router.entrypoints" = "web,websecure"
    }
  }

  spec {
    rule {
      # TODO: Set your domain name here, or remove 'host' for catch-all
      # host = "your-domain.com"

      http {
        path {
          path      = "/"
          path_type = "Prefix"

          backend {
            service {
              name = kubernetes_service.app.metadata[0].name
              port {
                number = 80
              }
            }
          }
        }
      }
    }
  }

  depends_on = [kubernetes_service.app]
}
