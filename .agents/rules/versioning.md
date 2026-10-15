# Git Branching, Versioning, PR & Vercel Deployment Rules

## 1. Branch Strategy
- **`master`:** Main production branch. Always contains stable, production-ready code.
- **`develop`:** Primary integration branch for new features and active development.
- **Do not create permanent branches for versions** (e.g., `version/1.2.0` or `v1.2.0`). Use Git Tags (`vMAJOR.MINOR.PATCH`) strictly for mobile releases.

## 2. Branch Naming Conventions (Kebab-case)
All supporting branches are short-lived and use lowercase kebab-case naming:
- `feature/<feature-name>`: New features branching from `develop`.
- `fix/<bug-name>`: Bug fixes branching from `develop`.
- `hotfix/<issue-name>`: Urgent production fixes branching from `master`.
- `release/<version>`: Temporary stabilization branch only if separate QA/release stabilization is required.

## 3. Conventional Commit Messages
- Use Conventional Commits format (`feat:`, `fix:`, `perf:`, `refactor:`, `docs:`, `chore:`).
- **AI Rule for Commit Messages:** When the user asks for a commit message, **strictly output ONLY the commit message inside a single codeblock** without git shell command wrappers or surrounding conversational text.

## 4. Pull Request & Merge Strategies (Always Use GitHub CLI)
- **`feature/*` / `fix/*` ➔ `develop`:** Always use a **GitHub Pull Request** with **Squash and Merge** (`gh pr merge --squash --delete-branch`) to maintain a clean, linear commit history per feature.
- **`develop` ➔ `master`:** Always use a **GitHub Pull Request** with a **Merge Commit (`--no-ff`)** (`gh pr merge --merge`) to clearly mark release points on git history. Never merge directly without a PR.

## 5. Semantic Versioning (SemVer `MAJOR.MINOR.PATCH`)
- **`PATCH` (`1.2.0` → `1.2.1`):** Backward-compatible bug fixes or minor patches.
- **`MINOR` (`1.2.0` → `1.3.0`):** New backward-compatible features.
- **`MAJOR` (`1.3.0` → `2.0.0`):** Breaking changes.
- **Release-Only Version Updates:** Only update project/package versions in `develop` when preparing for a release/publish, then merge into `master` via PR.
- **Monorepo Versioning:** Each package/application maintains an independent version. Update `package.json` (and `app.json` for mobile) of the affected package according to the level of change.

## 6. Release Flow & Tagging Policy

> **IMPORTANT — Release Tag Policy:**
> - **Web Apps (`apps/web` or web-only repos):** **NOT REQUIRED** to create release tags. The web release flow completes upon merging the release PR into `master` and deploying to production.
> - **Mobile Apps (`apps/mobile` / React Native / Expo):** Create Git Tags on `master` following `vMAJOR.MINOR.PATCH` (e.g., `v1.12.0`) to tag binary/store release snapshots.

### A. Normal Release
1. Complete feature development and merge PR into `develop` (`gh pr merge --squash`).
2. Update package versions (`package.json`, `app.json`) and changelogs (`CHANGELOG.md`, in-app changelog data) on `develop`.
3. Create a Release PR from `develop` into `master`:
   ```bash
   gh pr create --base master --head develop --title "chore(release): vX.Y.Z"
   gh pr merge --merge
   ```
4. **Web:** No release tag needed, proceed to production deployment (`vercel --prod`).  
   **Mobile:** Create a Git Tag on `master` following `vMAJOR.MINOR.PATCH`.
5. `develop` continues as the development branch for the next version.

```
Web:    feature/* ──(PR squash)──> develop ──(bump version)──(PR merge)──> master (deploy prod, no tag)
Mobile: feature/* ──(PR squash)──> develop ──(bump version)──(PR merge)──> master ──> Tag vX.Y.Z
```

### B. Hotfix Release
1. Create `hotfix/<issue-name>` from `master`.
2. Apply the fix and bump the PATCH version in `package.json` and `CHANGELOG.md`.
3. Merge `hotfix/*` into `master` via PR (Web: no tag; Mobile: create Tag `vX.Y.Z`).
4. Merge or cherry-pick the hotfix commit back into `develop`.

```
Web:    hotfix/* ──(PR)──> master (deploy prod, no tag) ──> develop (sync back)
Mobile: hotfix/* ──(PR)──> master ──> Tag vX.Y.Z ──> develop (sync back)
```

## 7. Vercel Deployment Standards
- **Controlled Deployments:** Maintain root `vercel.json` with `"git": { "deploymentEnabled": false }` to prevent rogue builds on development branches.
- **Production Deployment:** Trigger production deployments via Vercel CLI (`vercel --prod`) after merging into `master`.
- **Upload Hygiene (`.vercelignore`):** Maintain a `.vercelignore` file at root excluding native mobile caches (`android/`, `ios/`), `.agents/`, `.turbo/`, and build artifacts to keep deployments fast and lightweight.

## 8. AI Automation & Human Review
- The AI assistant automates the end-to-end workflow (Implementation Plan, `feature/`/`fix/`/`hotfix/` branching, code execution, commit messages [outputting strictly codeblocks when requested], release version bumps, PRs to `develop` and `master`, and Git tagging).
- All plans, diffs, and git actions must be presented clearly for user review and approval before proceeding to next stages.
