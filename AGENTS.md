# Repository Guidelines

## Project purpose

This project is a web-based calendar comparison tool.
Users can import one or more calendars (ICS files or calendar URLs)
and visualize events in order to detect scheduling conflicts
(e.g. overlapping matches, trainings, or events).

The main goal is to help users identify:

- overlapping events
- multiple events on the same day
- potential scheduling risks

The project is NOT intended to:

- act as a full calendar replacement
- handle booking or invitations

## Project Structure & Module Organization

- `src/` holds the React+TypeScript application: `hooks/` contain reusable state + data helpers, `components/` contains UI widgets, `utils/` holds shared converters/helpers, and `App.tsx` wires everything together.
- `public/` and `ics-examples/` provide static assets and sample calendars for manual testing.
- Configuration files for Vite, Vitest, ESLint, and tsconfig live at the project root.
- Tests mirror the source directories under `src/**/tests` and `src/utils/*.test.ts`.

## Build, Test, and Development Commands

- `npm run dev` – start the Vite dev server with hot reload.
- `npm run build` – run `tsc -b` and `vite build`; use before releasing to ensure type-check + production bundle.
- `npm run lint` – execute ESLint (`@eslint/js`, React rules) against the workspace.
- `npm run test` – run Vitest for unit/component tests (`vitest.config.ts`).
- `npm run preview` – serve the production build locally.

## Coding Style & Naming Conventions

- TypeScript + React; prefer function components, hooks, and typed props.
- Use 2-space (soft) indentation and double quotes for JSX/TSX strings unless JSX requires single quotes (per ESLint config).
- Keep hook names `use...`, components in `PascalCase`, utility files in `camelCase`.
- `setX` is preferred setter naming for state; event data uses `CalendarEventType` and `DisplayEvent` models.
- Run ESLint before pushing and follow its autofix suggestions when applicable.

## Documentation Guidelines

- Keep Markdown files updated when behavior or user flows change.
- Lint Markdown changes with `npm run lint:md` (uses `markdownlint-cli`).

## Testing Guidelines

- Vitest is the test runner (`vitest.config.ts`). Tests live adjacent to the units they cover.
- File names end with `.test.ts`/`.test.tsx`; describe states clearly (e.g., `hook.test.ts` for hook behavior).
- Run `npm run test` locally; include only the relevant test files in changes.
- For new features or behavior changes, add or update unit tests alongside the code changes.
- PR test checklist:
  - Add or update unit tests for new behavior.
  - Run `npm run test` for the touched areas.
  - Note any manual testing steps in the PR description.
- Lint and fix code changes before PRs (run `npm run lint` and apply autofixes when available).
- After any code or documentation change, re-run both `npm run lint` and `npm run test`.
- Use a TDD flow for new features: write a failing test first that captures the intended behavior, then implement the code to make it pass.
- Prefer tests that start at the user-interaction level (component/integration) before adding smaller unit tests.
- Follow SOLID principles when designing new code (single responsibility, open/closed, Liskov, interface segregation, dependency inversion).

## Commit & Pull Request Guidelines

- Prefer concise, imperative commits (e.g., “Add ICS URL history hook”).
- PRs should summarize the change, note linked issues/requirements, and mention any manual steps taken (e.g., “tested with sample `.ics` files”).
- Document UI behavior changes or data migrations in PR descriptions; attach screenshots only when UI is affected.
