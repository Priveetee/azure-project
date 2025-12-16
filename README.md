# Azure Project - TP Chat

A containerized application with CI/CD pipeline for Azure Container Registry (ACR) and Azure Container Apps deployment.

## 🏗️ Architecture

- **Runtime**: Node.js on Alpine Linux
- **Web Server**: Nginx
- **Build Tool**: Bun
- **Container Registry**: Azure Container Registry (ACR)
- **CI/CD**: GitHub Actions
- **Orchestration**: Azure Container Apps (Managed Kubernetes)
- **Infrastructure**: Azure CLI

---

## 🌐 Azure Infrastructure

| Resource | Name | Region |
|----------|------|--------|
| **Resource Group** | `rg-tp-chat` | `francecentral` |
| **Log Analytics Workspace** | `workspace-rgtpchatCfD0` | `francecentral` |
| **Container Apps Environment** | `env-tp-chat` | `francecentral` |
| **Container Registry (ACR)** | `tpchatimages.azurecr.io` | `francecentral` |
| **Container App (test)** | `tp-chat-test` | `francecentral` |

**Test App URL**: https://tp-chat-test.yellowsmoke-11c1ae9a.francecentral.azurecontainerapps.io/

---

## 🐳 Docker Commands

```bash
# Build the image
docker compose build

# Start the application
docker compose up -d

# Stop the application
docker compose down

# View logs
docker compose logs -f

# Rebuild and restart
docker compose up -d --build
```

### Push to ACR

```bash
# Login to ACR
az acr login --name tpchatimages

# Tag and push (local image is azure-project from docker-compose)
docker tag azure-project:latest tpchatimages.azurecr.io/tp-chat:latest
docker push tpchatimages.azurecr.io/tp-chat:latest
```

---

## 🏗️ Azure Container Apps Management

```bash
# View container app
az containerapp show --name tp-chat --resource-group rg-tp-chat

# View logs
az containerapp logs show --name tp-chat --resource-group rg-tp-chat --follow

# Scale the app
az containerapp update --name tp-chat --resource-group rg-tp-chat --min-replicas 2 --max-replicas 5

# Get app URL
az containerapp show -n tp-chat -g rg-tp-chat --query properties.configuration.ingress.fqdn -o tsv

# Update image
az containerapp update --name tp-chat --resource-group rg-tp-chat --image tpchatimages.azurecr.io/tp-chat:<tag>
```

---

## 📁 Project Structure

```
azure-project/
├── .github/workflows/
│   ├── ci.yml              # Continuous Integration
│   └── cd.yml              # Continuous Deployment
├── Docker                  # Dockerfile
├── docker-compose.yml      # Local development
└── README.md
```

---

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Login to Azure | `az login` |
| Login to ACR | `az acr login --name tpchatimages` |
| Build image | `docker compose build` |
| Start app | `docker compose up -d` |
| Push to ACR | `docker tag azure-project:latest tpchatimages.azurecr.io/tp-chat:latest && docker push tpchatimages.azurecr.io/tp-chat:latest` |
| View container logs | `az containerapp logs show --name tp-chat --resource-group rg-tp-chat --follow` |
| Update container app | `az containerapp update --name tp-chat --resource-group rg-tp-chat --image tpchatimages.azurecr.io/tp-chat:<tag>` |
