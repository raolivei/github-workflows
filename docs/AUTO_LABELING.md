# Auto-Labeling Reusable Workflow

Automatically label GitHub issues and pull requests based on content and changed files.

## Usage in Your Repo

### 1. Create workflow file

`.github/workflows/auto-label.yml`:

```yaml
name: Auto Label Issues and PRs

on:
  issues:
    types: [opened, edited]
  pull_request:
    types: [opened, edited, synchronize, reopened]

permissions:
  contents: read
  issues: write
  pull-requests: write

jobs:
  auto-label:
    uses: raolivei/github-workflows/.github/workflows/auto-label.yml@main
    with:
      config_path: '.github/labeling/config.yml'  # optional, default shown
      enable_pr_file_labeling: true                # optional, default true
      enable_content_labeling: true                # optional, default true
```

### 2. Create configuration file

Copy templates from `github-workflows/.github/labeling/`:

```bash
mkdir -p .github/labeling
cp ../github-workflows/.github/labeling/config.example.yml .github/labeling/config.yml
cp ../github-workflows/.github/labeling/pr-labeler.example.yml .github/labeling/config.yml
```

Edit `.github/labeling/config.yml` to add your project-specific patterns.

### 3. Create labels in your repo

```bash
# Type labels
gh label create bug --description "Something isn't working" --color d73a4a || true
gh label create enhancement --description "New feature or request" --color a2eeef || true
gh label create documentation --description "Documentation changes" --color 0075ca || true
gh label create epic --description "Parent tracking issue" --color 8B5CF6 || true
gh label create chore --description "Maintenance work" --color FEF2C0 || true

# Priority labels
gh label create priority-P0 --description "Critical foundation" --color DC2626 || true
gh label create priority-P1 --description "Core features" --color EA580C || true
gh label create priority-P2 --description "Enhancements" --color EAB308 || true
gh label create priority-P3 --description "Nice-to-have" --color 84CC16 || true

# Area labels
gh label create backend --description "Backend code" --color 0E8A16 || true
gh label create frontend --description "Frontend code" --color 1D76DB || true
gh label create infrastructure --description "K8s/Docker/deployment" --color 5319E7 || true
gh label create database --description "Database/migrations" --color D93F0B || true
gh label create ci-cd --description "GitHub Actions/CI" --color 0052CC || true
gh label create testing --description "Tests" --color D4C5F9 || true
gh label create dependencies --description "Dependency updates" --color 0366D6 || true

# Other
gh label create wip --description "Work in progress" --color EDEDED || true
```

## How It Works

### Content-Based Labeling

**Type Detection** (from title prefix):
- `fix:` or `bug:` → `bug`
- `feat:` or `feature:` → `enhancement`
- `docs:` → `documentation`
- `[EPIC]` → `epic`
- `chore:` → `chore`

**Priority Detection** (from title/body):
- `P0`, `priority 0`, `critical` → `priority-P0`
- `P1`, `priority 1` → `priority-P1`
- `P2`, `priority 2` → `priority-P2`
- `P3`, `priority 3` → `priority-P3`

**Project/Area Detection**:
- Defined in `.github/labeling/config.yml`
- Matches keywords in title/body

### File-Based Labeling (PRs only)

Uses `actions/labeler` to label based on changed files:
- Changes to `backend/**` → `backend`
- Changes to `frontend/**` → `frontend`
- Changes to `k8s/**` → `infrastructure`
- etc.

Defined in `.github/labeling/config.yml` (same file, different format).

## Customization

### Add Project-Specific Labels

Edit `.github/labeling/config.yml`:

```yaml
project_patterns:
  my-feature:
    - keyword1
    - keyword2
  another-label:
    - phrase to match
```

### Disable File-Based Labeling

```yaml
jobs:
  auto-label:
    uses: raolivei/github-workflows/.github/workflows/auto-label.yml@main
    with:
      enable_pr_file_labeling: false
```

### Disable Content-Based Labeling

```yaml
jobs:
  auto-label:
    uses: raolivei/github-workflows/.github/workflows/auto-label.yml@main
    with:
      enable_content_labeling: false
```

## Examples

### Issue Title: "bug: Database migration fails on startup"
**Labels Applied:** `bug`, `database`, `backend`

### Issue Title: "[EPIC] Monarch Money Parity - P1"
**Labels Applied:** `epic`, `priority-P1`, `monarch-parity` (if configured)

### PR: Changes to `backend/api/accounts.py`
**Labels Applied:** `backend`, `api`

### PR Title: "feat: Add budget visualization (P1)"
**Labels Applied:** `enhancement`, `priority-P1`

## Manual Override

The workflow never removes labels. If auto-labeling is wrong:
1. Remove incorrect labels manually
2. Add correct labels manually
3. Update `.github/labeling/config.yml` to improve patterns

## Troubleshooting

### Labels not being applied

1. Check workflow run in Actions tab
2. Verify `.github/labeling/config.yml` exists
3. Ensure labels exist in repository (`gh label list`)
4. Check workflow has correct permissions

### Wrong labels being applied

1. Review `.github/labeling/config.yml` patterns
2. Test patterns locally:
   ```bash
   node .github/scripts/label-classifier.js \
     .github/labeling/config.yml \
     "Your issue title" \
     "Your issue body"
   ```

### Disable temporarily

Add `if: false` to job:

```yaml
jobs:
  auto-label:
    if: false  # Temporarily disabled
    uses: raolivei/github-workflows/.github/workflows/auto-label.yml@main
```

## Repos Using This Workflow

- `canopy` — Full content + file labeling
- `pi-fleet` — Content labeling only
- `ollie` — Full content + file labeling
- (Add yours here)
