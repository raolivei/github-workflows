# Changelog

## [Unreleased]

### Fixed

- **`docker-build.yml`** — `runs-on` default `ubuntu-latest` no longer passed through `fromJSON()` (fixes caller workflows that omit the input).

### Added

- **`python-ci.yml`** — restored reusable Poetry/pip CI (ruff, mypy, pytest); required by `ollie` and other callers that still reference it.
- **`docker-build.yml`** — optional `job-timeout-minutes` input (default 90) for QEMU/arm64 builds; caller jobs cannot set `timeout-minutes` when using `workflow_call`.
- **`validate.yml`** — runs `actionlint` on push/PR to `main` (reusable workflows only run in caller repos).

### Changed

- **README** — document only active workflows (`docker-build`, `static-site-pages`, `version-check`); note removed terraform/matrix workflows and merge-order for new inputs.
- Reusable workflows: bump `actions/checkout` to v6, `actions/setup-node` to v6, Pages actions to v5.
- `static-site-pages.yml`: default Node.js for site builds is **24** (was 20).
- **`static-site-pages.yml`:** optional `pre-build-command` input (used by blog/docs cluster-status sync).
- All reusable workflows set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` for GitHub’s Node 20 → 24 runner migration.
