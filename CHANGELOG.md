# Changelog

## [Unreleased]

### Changed

- Reusable workflows: bump `actions/checkout` to v6, `actions/setup-node` to v6, Pages actions to v5.
- `static-site-pages.yml`: default Node.js for site builds is **24** (was 20).
- All reusable workflows set `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` for GitHub’s Node 20 → 24 runner migration.
