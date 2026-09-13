import { execSync } from "node:child_process";

/**
 * Patterns of files and directories that do NOT require a Vercel build/deployment.
 * If ALL changed files in a commit match these patterns, the build is skipped.
 */
const IGNORED_PATTERNS = [
  /\.md$/i,                     // Markdown files (README.md, AGENTS.md, docs, etc.)
  /^docs\//,                    // Documentation directory
  /^\.agents\//,                // AI agent rules and configurations
  /^\.vscode\//,                // Visual Studio Code settings
  /^\.idea\//,                  // JetBrains IDE settings
  /^\.github\//,                // GitHub workflows and templates
  /^\.gitignore$/,              // Git ignore configuration
  /^\.prettierrc(\.[a-z]+)?$/,  // Prettier configuration
  /^\.prettierignore$/,         // Prettier ignore
  /^LICENSE$/i,                 // License file
  /^CODE_OF_CONDUCT\.md$/i,     // Code of Conduct
];

/**
 * Keywords in commit messages that explicitly request skipping the deployment.
 */
const SKIP_COMMIT_KEYWORDS = [
  /\[skip vercel\]/i,
  /\[vercel skip\]/i,
  /\[skip ci\]/i,
  /\[ci skip\]/i,
  /\[skip-vercel\]/i,
  /\[skip-ci\]/i,
];

/**
 * Retrieves the commit message from Vercel environment or Git.
 * @returns {string}
 */
function getCommitMessage() {
  if (process.env.VERCEL_GIT_COMMIT_MESSAGE) {
    return process.env.VERCEL_GIT_COMMIT_MESSAGE;
  }

  try {
    return execSync("git log -1 --pretty=%B", { encoding: "utf8" }).trim();
  } catch {
    return "";
  }
}

/**
 * Checks if the commit message contains an explicit skip flag.
 * @returns {boolean}
 */
function hasSkipFlagInCommit() {
  const message = getCommitMessage();
  if (!message) return false;

  const matched = SKIP_COMMIT_KEYWORDS.some((regex) => regex.test(message));
  if (matched) {
    console.log(`[vercel-ignore] Commit message contains skip flag: "${message.split("\n")[0]}"`);
  }
  return matched;
}

/**
 * Retrieves the list of changed files from Git diff.
 * @returns {string[] | null} Array of changed file paths, or null if diff cannot be computed.
 */
function getChangedFiles() {
  const prevSha = process.env.VERCEL_GIT_PREVIOUS_SHA;
  const currentSha = process.env.VERCEL_GIT_COMMIT_SHA;

  let command = "";
  if (prevSha && currentSha && prevSha !== currentSha) {
    command = `git diff --name-only ${prevSha} ${currentSha}`;
    console.log(`[vercel-ignore] Comparing commits: ${prevSha.slice(0, 7)}...${currentSha.slice(0, 7)}`);
  } else {
    command = "git diff --name-only HEAD^ HEAD";
    console.log("[vercel-ignore] Comparing HEAD^ to HEAD");
  }

  try {
    const output = execSync(command, { encoding: "utf8" });
    return output
      .split("\n")
      .map((filePath) => filePath.trim().replace(/\\/g, "/"))
      .filter(Boolean);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[vercel-ignore] Unable to compute git diff (${message}). Falling back to build.`);
    return null;
  }
}

/**
 * Checks if a specific file path is considered non-deployable/ignored.
 * @param {string} filePath
 * @returns {boolean}
 */
function isIgnoredFile(filePath) {
  return IGNORED_PATTERNS.some((pattern) => pattern.test(filePath));
}

/**
 * Determines whether Vercel should proceed with building the project.
 * @returns {boolean} true to build (exit 1), false to skip (exit 0).
 */
function shouldBuild() {
  if (hasSkipFlagInCommit()) {
    console.log("[vercel-ignore] Skip flag detected in commit message. Skipping build.");
    return false;
  }

  const changedFiles = getChangedFiles();

  // If git diff is unavailable (e.g. shallow clone or initial commit), proceed safely.
  if (changedFiles === null) {
    console.log("[vercel-ignore] Diff unavailable. Proceeding with build for safety.");
    return true;
  }

  if (changedFiles.length === 0) {
    console.log("[vercel-ignore] No files changed in the compared range. Skipping build.");
    return false;
  }

  console.log(`[vercel-ignore] Changed files (${changedFiles.length}):`);
  changedFiles.forEach((file) => console.log(`  - ${file}`));

  const deployableFiles = changedFiles.filter((file) => !isIgnoredFile(file));

  if (deployableFiles.length === 0) {
    console.log("[vercel-ignore] All changed files are non-build files (docs/agent rules/configs). Skipping build.");
    return false;
  }

  console.log(`[vercel-ignore] Build required due to ${deployableFiles.length} deployable file(s):`);
  deployableFiles.forEach((file) => console.log(`  * ${file}`));
  return true;
}

// Exit codes for Vercel Ignored Build Step:
// 1 = Proceed with build
// 0 = Cancel / Skip build
const proceed = shouldBuild();
process.exit(proceed ? 1 : 0);
