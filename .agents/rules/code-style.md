# Code Style & TypeScript Standards

## 1. Strict TypeScript (Zero `any`)
- **NEVER use the `any` type** under any circumstances in any TypeScript (`.ts`, `.tsx`) file.
- Define explicit interfaces, type aliases, and generic utilities for all data models, API payloads, Convex schemas, and component props.
- If handling untrusted or truly dynamic input, use `unknown` with strict runtime validation (e.g. Zod or type narrowing guards).

## 2. DRY (Don't Repeat Yourself)
- Every piece of business logic, component, utility function, and type must be reusable and modular.
- Avoid duplicate code, cloned component variations, or redundant API/Convex queries.
- Centralize shared types in dedicated type files or domain-specific modules.

## 3. Component Architecture & Splitting
- Always check for existing components in the codebase before creating new ones.
- If a component or file grows too large or handles multiple concerns, **split it into focused sub-components**.
- Feature components belong under `components/` or modular feature directories.
- Shared selectors, dialogs, and form inputs belong in `components/shared/` or `components/ui/`.

## 4. No Hardcoded Fallback Anti-Pattern (`||`)
- **DO NOT hardcode values using `||` for fallbacks** (e.g. `val || "default"`).
- Always ensure the required data is present at the data source or explicitly validate it.
- Use optional chaining (`?.`) and nullish coalescing (`??`) only when `null` or `undefined` is an expected, valid domain state, never to mask missing or unhandled data.

## 5. UI Design & Aesthetics
- Prioritize polished, modern aesthetics: clean typography, balanced contrast, subtle transitions, and responsive mobile-first layouts.
- **DO NOT overuse sparkle icons (`Sparkles`) for everything.** Use contextually accurate and meaningful icons.
- Ensure all interactive elements have accessible labels and responsive tap targets.

## 6. Implementation Planning
- **ALWAYS create an implementation plan** before executing complex features, multi-file edits, or architectural modifications.
- Document affected files, logic modifications, and verification steps.