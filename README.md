# GitHub Reusable Workflows

Centralized reusable GitHub Actions workflows for personal projects.

## Available Workflows

| Workflow | Description |
|----------|-------------|
| `docker-build.yml` | Build and push arm64 Docker images to GHCR |
| `python-ci.yml` | Ruff (check + optional format check), mypy, pytest (Poetry or pip) |
| `node-ci.yml` | npm ci, lint, type check, tests for npm projects |
| `static-site-pages.yml` | Build and deploy static sites to GitHub Pages (VitePress, etc.) |
| `version-check.yml` | Enforce VERSION file bump on pull requests |

> **Note:** Removed workflows (`terraform-pr.yml`, `docker-matrix.yml`, etc.) are not in this repo. Use a caller job matrix instead of `docker-matrix.yml`.
>
> **CI on this repo:** `validate.yml` runs `actionlint` on push/PR. Reusable workflows (`workflow_call`) are executed only when another repository calls them.

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

### python-ci.yml

Ruff, optional `ruff format --check`, mypy and pytest with Poetry or pip. The pip path installs `requirements-dev.txt` when present (otherwise `requirements.txt` plus ruff/mypy/pytest).

**Inputs:** `python-version` (default `3.11`), `working-directory`, `package-manager` (`poetry` | `pip`), `run-ruff`, `run-ruff-format` (default `false`), `run-mypy`, `mypy-paths`, `run-pytest`, `pytest-args`, `poetry-groups`, `runs-on`

### node-ci.yml

`npm ci`, then lint, type check and tests. Each step can be switched off and its command overridden.

**Inputs:** `node-version` (default `24`), `working-directory`, `install-args` (e.g. `--legacy-peer-deps`), `run-lint` / `lint-command` (default `npm run lint -- --max-warnings=0`), `run-typecheck` / `typecheck-command` (default `npx tsc --noEmit`), `run-test` / `test-command` (default `npm test -- --ci`), `runs-on`

**Example (Next.js app in `frontend/`):**

```yaml
uses: raolivei/github-workflows/.github/workflows/node-ci.yml@main
with:
  node-version: "20"
  working-directory: frontend
  install-args: --legacy-peer-deps
  runs-on: ubuntu-latest
```

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
| canopy | docker-build, version-check, python-ci, node-ci |
| canopy, swimTO, elder, journey, … | docker-build |
| ollie (PR) | version-check |

## Contributing

1. Create a feature branch
2. Change workflow files
3. Point a consumer repo at `@your-branch` and verify
4. Merge to `main`, then update consumers
