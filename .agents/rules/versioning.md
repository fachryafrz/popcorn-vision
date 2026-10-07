---
trigger: always_on
---

# Git Branching & Project Versioning (SemVer `MAJOR.MINOR.PATCH`)

## 1. Branch Strategy

- **`master`:** Main production branch. Always contains stable, production-ready code.
- **`develop`:** Primary integration branch for new features and active development.
- **Do not create permanent branches for individual versions** (e.g., `version/1.2.0` or `v1.2.0`). Use **Git Tags** to mark released versions.

## 2. Branch Naming Conventions (Kebab-case)

All supporting branches are short-lived and use lowercase kebab-case naming:
- `feature/<feature-name>`: New features branching from `develop` (e.g., `feature/tmdb-batch-import`, `feature/chat-attachments`).
- `fix/<bug-name>`: Non-urgent bug fixes branching from `develop` (e.g., `fix/carousel-autoplay-lag`).
- `hotfix/<issue-name>`: Urgent production fixes branching from `master` (e.g., `hotfix/tmdb-auth-key-error`).
- `release/<version>`: Temporary stabilization branch only if separate QA/release stabilization is needed before release (e.g., `release/2.6.0`).

## 3. Merge Strategies

- **`feature/*` / `fix/*` → `develop`:** Use **Squash and Merge** or **Rebase** to keep a clean, linear commit history per feature.
- **`develop` → `master`:** Use **Merge Commit (`--no-ff`)** to clearly preserve release milestones on the git history.

## 4. Versioning Scheme (SemVer `MAJOR.MINOR.PATCH`)

- **`PATCH` (`1.2.0` → `1.2.1`):** Backward-compatible bug fixes or minor corrections.
- **`MINOR` (`1.2.0` → `1.3.0`):** New backward-compatible features.
- **`MAJOR` (`1.3.0` → `2.0.0`):** Breaking changes.

## 5. Release Flow & Tagging

### A. Normal Release
1. Complete feature development and merge into `develop`.
2. Update the version in `package.json` and update `CHANGELOG.md` directly on `develop`.
3. Merge `develop` into `master` using `--no-ff`.
4. Create a Git Tag on `master` with the format `vMAJOR.MINOR.PATCH` (e.g., `v2.5.2`).
5. `develop` continues as the development branch for the next version.

```
feature/* ──> develop ──(bump version)──> master ──> Tag vX.Y.Z
```

### B. Hotfix Release
1. Create `hotfix/<issue-name>` from `master`.
2. Apply the fix and bump the PATCH version in `package.json` and `CHANGELOG.md`.
3. Merge `hotfix/*` into `master` and create Tag `vX.Y.Z`.
4. Merge or cherry-pick the hotfix commit back into `develop`.

```
hotfix/* ──> master ──> Tag vX.Y.Z ──> develop (sync back)
```

## 6. AI Automation & Review Workflow

- **End-to-End AI Automation:** The AI assistant is responsible for proactively structuring and automating the workflow:
  - Creating a detailed **Implementation Plan** prior to code modifications.
  - Proposing and configuring appropriate git branches (`feature/*`, `fix/*`, `hotfix/*`).
  - Writing modular, scalable code adhering to technical standards (Zero `any`, DRY, typed schemas).
  - Crafting clear, conventional commit messages.
  - Automating version bumps (`package.json`, `CHANGELOG.md`) upon release, alongside merge (`--no-ff`) and Git tagging commands.
- **Transparency & Human Review:** All plans, code diffs, version updates, and git actions must be presented clearly for user review and approval before proceeding to next stages.

