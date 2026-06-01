# GitHub Reusable Workflows

Centralized reusable GitHub Actions workflows for personal projects.

## Available Workflows

| Workflow | Description |
|----------|-------------|
| `docker-build.yml` | Build and push arm64 Docker images to GHCR |
| `static-site-pages.yml` | Build and deploy static sites to GitHub Pages (VitePress, etc.) |
| `version-check.yml` | Enforce VERSION file bump on pull requests |

> **Note:** Older workflow names (`terraform-pr.yml`, `docker-matrix.yml`, `python-ci.yml`, etc.) were removed from this repo. Past Action runs may still appear as failed in the UI; only the workflows above are active.

## Usage

Reference workflows from your repository:

```yaml
name: Build and Push

on:
  push:
    branches: [main]

jobs:
  build:
    uses: raolivei/github-workflows/.github/workflows/docker-build.yml@main
    with:
      image-name: my-app
    secrets:
      REGISTRY_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Multiple Docker images

Use a job matrix in the **caller** repo (there is no `docker-matrix.yml`):

```yaml
jobs:
  build:
    strategy:
      matrix:
        service: [api, frontend]
    uses: raolivei/github-workflows/.github/workflows/docker-build.yml@main
    with:
      image-name: my-app-${{ matrix.service }}
      dockerfile: docker/${{ matrix.service }}.Dockerfile
    secrets:
      REGISTRY_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Versioning

- `@main` — latest (typical for personal repos)
- Pin to a commit SHA when you need a frozen reusable workflow definition

**Merge order:** When adding a new input to a reusable workflow, merge **github-workflows** first, then update caller repos. Otherwise deploy workflows fail at startup with “Invalid input”.

## Workflow Details

### docker-build.yml

Build and push a single Docker image to GHCR.

**Inputs:** `image-name` (required), `context`, `dockerfile`, `platforms`, `registry`, `push`, `skip-if-already-built`, `create-git-tag`

**Secrets:** `REGISTRY_TOKEN` (required)

### static-site-pages.yml

Build and deploy static sites to GitHub Pages.

**Inputs:** `node-version` (default `24`), `build-command`, `output-directory`, `working-directory`, `pre-build-command` (optional shell step before `npm ci`)

**Example (cluster status sync):**

```yaml
uses: raolivei/github-workflows/.github/workflows/static-site-pages.yml@main
with:
  node-version: "24"
  pre-build-command: bash scripts/sync-cluster-status.sh
  build-command: npm run build
  output-directory: .vitepress/dist
```

### version-check.yml

Fails the PR if `VERSION` was not bumped. Used by ollie and similar repos.

## Repositories Using These Workflows

| Repository | Workflows |
|------------|-----------|
| pi-fleet-blog | static-site-pages |
| eldertree-docs | static-site-pages, docker-build |
| ollie | docker-build (matrix caller) |
| canopy, swimTO, elder, journey, … | docker-build |
| ollie (PR) | version-check |

## Contributing

1. Create a feature branch
2. Change workflow files
3. Point a consumer repo at `@your-branch` and verify
4. Merge to `main`, then update consumers
