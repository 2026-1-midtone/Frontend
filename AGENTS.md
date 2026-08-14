# Repository Guidelines

## Project Structure & Module Organization

ShiftMate is a React 19 single-page application built with Vite. Application code lives in `src/`: route-level screens are grouped under `src/pages/<PageName>/` with matching JSX and SCSS files, shared layouts live in `src/layouts/`, and route constants and configuration live in `src/routes/`. Import bundled images from `src/assets/`; reserve `public/` for files served unchanged. Global Sass tokens, mixins, reset rules, and base styles are in `src/styles/`. The `@` alias resolves to `src`.

## Build, Test, and Development Commands

- `npm ci` installs the exact dependency versions from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run lint` checks React and JavaScript rules with Oxlint.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production build for local verification.

Run lint and build before opening a pull request.

## Coding Style & Naming Conventions

Follow the existing JavaScript style: two-space indentation, single quotes, no semicolons, trailing commas in multiline structures, and ES modules. Use PascalCase for React components and their directories (`Onboarding/Onboarding.jsx`), camelCase for functions and variables, and lowercase descriptive route constants. Keep page-specific styles beside their component. Write SCSS selectors using BEM (`.onboarding__login`) and reuse variables and mixins from `src/styles`; Vite injects `_core.scss`, so do not add duplicate token imports. Prefer the `@/` alias over long relative imports when it improves readability.

## Testing Guidelines

No automated test framework or coverage threshold is configured yet. For every change, run `npm run lint` and `npm run build`, then manually verify affected routes at mobile width (the primary frame is 393px) and a desktop viewport. If introducing tests, use `*.test.jsx` beside the tested component and add the runner and `npm test` script in the same pull request.

## Commit & Pull Request Guidelines

Use `type: description` commits, matching history and `CONTRIBUTING.md`; common types are `feat`, `fix`, `docs`, `style`, `refactor`, `test`, and `chore`. Name work branches `type/#issue` (for example, `feat/#22`). PR titles should follow `[Type] concise summary`. Include a clear change summary, linked issue, verification results, and screenshots for UI changes. Target the integration branch specified for the task, avoid direct pushes to protected branches, and obtain at least one approval before merging.
