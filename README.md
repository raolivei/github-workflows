# GitHub Reusable Workflows

Centralized reusable GitHub Actions workflows for personal projects.

## Available Workflows

| Workflow | Description |
|----------|-------------|
| `docker-build.yml` | Build and push arm64 Docker images to GHCR |
| `docker-matrix.yml` | Build multiple services in parallel (arm64) |
| `python-ci.yml` | Python CI with ruff, mypy, and pytest |
| `node-ci.yml` | Node.js CI with lint and test |
| `static-site-pages.yml` | Deploy static sites to GitHub Pages |
| `terraform-pr.yml` | Terraform plan on PR with comment |
| `terraform-apply.yml` | Terraform apply (manual trigger) |
| `gitops-image-update.yml` | Update K8s manifests with new image tags |

## Usage

Reference workflows from your repository:

```yaml
name: Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    uses: raolivei/github-workflows/.github/workflows/docker-build.yml@v1
    with:
      image-name: my-app
    secrets:
      REGISTRY_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Versioning

- `@v1` - Stable major version (recommended)
- `@v1.0.0` - Specific version
- `@main` - Latest development (use with caution)

## Workflows Details

### docker-build.yml

Build and push a single Docker image to GHCR.

**Inputs:**
- `image-name` (required) - Image name without registry prefix
- `context` (default: `.`) - Docker build context
- `dockerfile` (default: `Dockerfile`) - Path to Dockerfile
- `platforms` (default: `linux/arm64`) - Target platforms
- `registry` (default: `ghcr.io`) - Container registry
- `push` (default: `true`) - Push image after build

**Secrets:**
- `REGISTRY_TOKEN` (required) - Registry authentication token

### docker-matrix.yml

Build multiple services in parallel using a matrix strategy.

**Inputs:**
- `services` (required) - JSON array of service configs
- `platforms` (default: `linux/arm64`) - Target platforms

### python-ci.yml

Python testing and linting pipeline.

**Inputs:**
- `python-version` (default: `3.11`)
- `working-directory` (default: `.`)
- `package-manager` (default: `poetry`) - `poetry` or `pip`
- `run-ruff` (default: `true`)
- `run-mypy` (default: `true`)
- `run-pytest` (default: `true`)

### node-ci.yml

Node.js testing and linting pipeline.

**Inputs:**
- `node-version` (default: `20`)
- `working-directory` (default: `.`)
- `run-lint` (default: `true`)
- `run-test` (default: `true`)
- `run-build` (default: `false`)

### static-site-pages.yml

Build and deploy static sites to GitHub Pages.

**Inputs:**
- `build-command` (default: `npm run build`)
- `output-directory` (default: `dist`)
- `node-version` (default: `20`)

### terraform-pr.yml

Run Terraform plan on PRs and post results as comments.

**Inputs:**
- `working-directory` (default: `terraform/`)
- `terraform-version` (default: `1.5.0`)
- `post-plan-comment` (default: `true`)

**Secrets:**
- `TF_API_TOKEN` or cloud provider credentials

### terraform-apply.yml

Manually trigger Terraform apply.

**Inputs:**
- `working-directory` (default: `terraform/`)
- `terraform-version` (default: `1.5.0`)

**Secrets:**
- `TF_API_TOKEN` or cloud provider credentials

### gitops-image-update.yml

Update Kubernetes manifests with new image tags and create PRs.

**Inputs:**
- `manifest-path` (required) - Path to K8s manifest
- `image-tag` (required) - New image tag
- `auto-merge` (default: `false`) - Auto-merge the PR
