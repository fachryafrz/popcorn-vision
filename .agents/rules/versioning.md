---
trigger: always_on
---

# Web Release, Versioning, Commit, & Deployment Lifecycle

## 1. Branch Strategy
- **`master`**: Main production branch. Always contains stable, production-ready code.
- **`develop`**: Primary integration branch for new features and active development.
- **Feature/Fix branches**: Short-lived branches (`feature/<name>`, `fix/<name>`) branching from and merging into `develop` via squash/rebase.

## 2. Versioning Scheme (SemVer `MAJOR.MINOR.PATCH`)
- **`PATCH`** (`1.2.0` → `1.2.1`): Backward-compatible bug fixes or minor corrections.
- **`MINOR`** (`1.2.0` → `1.3.0`): New backward-compatible features or optimizations.
- **`MAJOR`** (`1.3.0` → `2.0.0`): Breaking changes.
- **Release-Only Version Bumps**: Only bump version numbers in `package.json` when the project is ready to be published/released.
- **No Git Release Tags for Web**: Web applications/projects **do not use Git release tags** (`vX.Y.Z`). Releases are marked by merge commits (`--no-ff`) into `master`.

## 3. Conventional Commit Messages
- Use Conventional Commits (`feat:`, `fix:`, `perf:`, `chore(release):`, `docs:`).
- **Rule**: If the user asks for a commit message, output **only the commit message in a codeblock** (no commands or explanations surrounding it).

## 4. Changelog Invariants
- When releasing a new version, update both:
  1. [`CHANGELOG.md`](file:///f:/Projects/popcorn-vision/CHANGELOG.md): Following the *Keep a Changelog* standard.
  2. [`data/changelog.ts`](file:///f:/Projects/popcorn-vision/data/changelog.ts): In-app timeline data; mark the new milestone with `isLatest: true` and remove it from the previous milestone.
- Descriptions must be user-friendly and benefit-oriented.

## 5. GitHub CLI Pull Request Workflow
- Use GitHub CLI (`gh`) to manage release pull requests:
  - Create release PR from `develop` to `master`:
    ```powershell
    gh pr create --base master --head develop --title "chore(release): release v<VERSION>" --body "<SUMMARY>"
    ```
    *(For multi-line descriptions on Windows PowerShell, write the body to a temporary file and pass `--body-file` to prevent shell quote escaping errors).*
  - Merge the PR with a merge commit (`--no-ff`):
    ```powershell
    gh pr merge <PR_NUMBER> --merge
    ```

## 6. Vercel Production Deployment
- Once `develop` is merged into `master`:
  1. Pull the latest `master` locally:
     ```powershell
     git checkout master; git pull origin master
     ```
  2. Deploy directly to Vercel production from `master`:
     ```powershell
     vercel --prod --yes
     ```
  3. Immediately switch back to `develop` for ongoing development:
     ```powershell
     git checkout develop
     ```
