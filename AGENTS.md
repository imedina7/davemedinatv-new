# Agent Instructions

This repository is a Vue 3 + TypeScript + Vite web application for davemedinatv.

## Build / Lint / Test Commands

- Install dependencies: `yarn install` (lockfile is `yarn.lock`)
- Dev server: `yarn dev`
- Production build: `yarn build`
- Type-check only: `yarn type-check`
- Lint + auto-fix: `yarn lint`
- Unit tests: `yarn test:unit`
- Run a single test file: `yarn vitest run --environment jsdom --root src/ src/path/to/TestFile.spec.ts`
- Preview production build: `yarn preview`

> Note: CI (`.github/workflows/build.yml`) uses Node.js and `yarn install --frozen-lockfile`, `yarn test:unit`, and `yarn build`.

## Project Structure

- `src/components/` — Vue components. Reusable UI components go in `src/components/ui/`.
- `src/views/` — route-level page components.
- `src/router/` — Vue Router configuration.
- `src/store/` — Pinia stores.
- `src/hooks/` — Vue composition functions (composables).
- `src/services/` — API clients, GraphQL queries, and external service wrappers.
- `src/types/` — TypeScript type definitions.
- `src/utils/` — helper utilities.
- `src/directives/` — custom Vue directives.
- `src/assets/` — static assets such as styles and images.
- `api/` — serverless API routes for Vercel.
- Environment types are declared in `env.d.ts`.

## Code Style

- Vue Single File Components use `<script setup lang="ts">`.
- TypeScript with strict checking enabled via `vue-tsc`.
- Use `import type { Foo }` for type-only imports.
- Use the `@/` path alias to import from `src/`.
- ESLint config extends `plugin:vue/vue3-essential`, `eslint:recommended`, `@vue/eslint-config-typescript`, and `@vue/eslint-config-prettier`.
- Prettier config is empty (`.prettierrc.json`), so use Prettier defaults.
- Formatting: 2-space indentation, semicolons, double quotes, trailing commas.
- Tailwind CSS is used for styling. Custom fonts are `doppio` and `rajdhani`.
- Avoid deeply nested conditionals; flatten with early returns and guard clauses.
- Keep components focused and extract reusable logic into composables or helpers.

## Naming Conventions

- Vue components: PascalCase (`NavBar.vue`, `VideoItem.vue`).
- Composables: camelCase prefixed with `use` (`useMouseDirection.ts`).
- Pinia stores: `use<Name>` (`useVideos.ts`, `useUiStore.ts`).
- Types/Interfaces: PascalCase (`Video`, `StreamStatus`).
- Enums: PascalCase with UPPER_SNAKE members (`MouseEventType.MOVE`).
- Utility/helper files: camelCase under `src/utils/helpers/`.
- Vue directives: camelCase in their source file and kebab-case in templates (`focus.ts`, `v-focus`).

## Error Handling

- Prefer early returns and optional chaining (`?.`) over deeply nested checks.
- For async API calls, prefer explicit `try/catch` at the call site or `.catch()` handlers in stores/views.
- Avoid silent failures; log or surface meaningful errors to the UI where appropriate.
- When adding new API surface area, validate inputs and normalize errors consistently with existing service code.
- Use type-safe error handling; avoid `any` and prefer `unknown` with narrowing when needed.

## Imports

- Group external dependencies first, then internal `@/` aliases, then relative imports.
- Import Pinia stores from `@/store` (barrel file) when available.
- Register FontAwesome icons in `src/icons.ts` and import them from there.
- Avoid deep relative paths such as `../../../foo`; prefer the `@/` alias or a barrel file.
- Use named exports for composables and helpers unless a single default export is more idiomatic.

## Testing

- Use Vitest with `jsdom` environment.
- Tests live in `src/__tests__/` or alongside components as `*.spec.ts`.
- Use `@vue/test-utils` for component tests.
- Run tests before committing and ensure `yarn build` passes locally.
- To run a single test file, pass the relative path from `src/`, e.g., `yarn vitest run --environment jsdom --root src/ components/VideoItem.spec.ts`.
- Prefer descriptive test names and arrange tests with `describe` blocks.

## State Management

- Use Pinia for global state. Stores live in `src/store/` and are exported from `src/store/index.ts`.
- Keep stores small and domain-focused (e.g., `useUiStore`, `useVideos`).
- Use `$patch` for batched state updates when appropriate.
- Avoid duplicating state between stores; derive values with getters or composables.

## API & Services

- GraphQL data is fetched through `@vue/apollo-composable` with an Apollo client configured in `src/services/apolloClient.ts`.
- HTTP API calls use a small Axios wrapper in `src/services/httpClient.ts`.
- Add new Contentful queries in `src/services/queries.ts`.
- Add Twitch integration helpers in `src/services/twitch.ts` and types in `src/types/twitch.ts`.
- Serverless routes in `api/` are deployed on Vercel and may read `process.env` at runtime.

## Styling

- Use Tailwind CSS utility classes for layout and styling.
- Custom fonts (`doppio`, `rajdhani`) are configured in `tailwind.config.js`.
- Keep component classes readable; prefer grouping related utilities.
- Use Tailwind arbitrary values sparingly and consistently.

## Secrets / Environment

- Do not commit `.env*` files or hardcode secrets.
- Required environment variables include Contentful and Twitch API tokens.
- Refer to `.env.local` for local variable names if present.
- Serverless API routes in `api/` may read environment variables via `process.env` at runtime.

## Tooling Notes

- Vite alias `@` maps to `./src` as configured in `vite.config.ts` and `tsconfig.app.json`.
- The project uses `vue-tsc` for type checking and Vitest for unit testing.
- Prettier and ESLint are integrated; run `yarn lint` before committing.
- ESLint config is `.eslintrc.cjs` and uses `@rushstack/eslint-patch/modern-module-resolution`.

## Useful File References

- `vite.config.ts` — Vite build and alias configuration.
- `tailwind.config.js` — Tailwind theme and custom fonts.
- `src/main.ts` — Application bootstrap, Pinia, Apollo, and FontAwesome setup.
- `src/icons.ts` — Central icon library registration.
- `src/router/index.ts` — Route definitions and router instance.
- `src/store/index.ts` — Barrel export for all Pinia stores.
- `src/services/httpClient.ts` — Axios client factory.
- `src/services/redisClient.ts` — Upstash Redis client (`Redis.fromEnv()`).

## Cursor / Copilot Rules

No `.cursorrules`, `.cursor/rules/`, or `.github/copilot-instructions.md` files exist in this repository.
