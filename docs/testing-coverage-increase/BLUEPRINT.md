# Blueprint: Testing Coverage Increase & Twitch Stream Status Enhancement

**Date:** 2026-11-01
**Status:** Active
**Area:** Testing, Twitch Stream Status

This document contains the step-by-step implementation prompts that will be fed to agents. Each prompt is self-contained and references the SPECIFICATION.md for architectural context.

---

## Prompt 0: Add Feature Documentation Pattern to AGENTS.md

> **Agent Task:** Add a "Feature Documentation Pattern" section to the project's AGENTS.md file, adapted from the lofiverse-xr project's pattern. The section should define the documentation structure (`docs/{feature-name}/` with `BLUEPRINT.md`, `SPECIFICATION.md`, `TODO.md`, `EXECUTION.md`, and optional `IMPLEMENTATION.md`), when to create each document, documentation maintenance rules, and a pre-planning research protocol. Place the section before the "Cursor / Copilot Rules" section at the end of the file.

**Verification:**
```bash
grep -n "Feature Documentation Pattern" /home/dave/projects/davemedinatv-new/AGENTS.md
```

---

## Prompt 1: Create Vitest Configuration

> **Agent Task:** Create a dedicated `vitest.config.ts` at the project root. It must:
> - Use `defineConfig` from `vitest/config`
> - Set `test.environment` to `jsdom`
> - Set `test.root` to `./src`
> - Set `test.include` to `['**/*.spec.ts']`
> - Configure `test.coverage` with:
>   - `provider: 'v8'`
>   - `reporter: ['text', 'html', 'lcov']`
>   - `thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 }`
>   - `exclude: ['**/*.spec.ts', '**/node_modules/**', '**/dist/**']`
> - Add the Vue plugin (`@vitejs/plugin-vue`) for SFC compilation
> - Configure path alias `@` → `./src`
> - Add a `test:coverage` script to `package.json`: `"test:coverage": "vitest run --coverage"`
>
> **Reference:** See `vite.config.ts` for the existing alias configuration.
>
> **Verification:**
> ```bash
> yarn vitest run --environment jsdom --root src/
> ```

---

## Prompt 2: Create Test Utility Helpers

> **Agent Task:** Create `src/test-utils/` directory with the following files:
>
> **`src/test-utils/mocks.ts`** — Shared mock factories:
> - `createMockStreamStatus(isLive, overrides?)` → returns a `StreamStatus` object
> - `createMockStream(overrides?)` → returns a `Stream` object (from `@/types/twitch`)
> - `createMockVideo(overrides?)` → returns a `Video` object (from `@/types/video`)
>
> **`src/test-utils/api-mock.ts`** — Axios mock setup:
> - Export a function `setupAxiosMock()` that returns a `MockAdapter` instance for the `/api` base URL client
> - Export `teardownAxiosMock(mock)` for cleanup
>
> **`src/test-utils/mount.ts`** — Vue Test Utils mount helpers:
> - Export `mountWithPlugins(component, options?)` that wraps `mount` with Pinia store installation and router
> - Accept `initialState` for store overrides
>
> **`src/test-utils/index.ts`** — Barrel export for all test utilities
>
> **Verification:**
> ```bash
> yarn type-check
> ```

---

## Prompt 3: Install and Configure Cypress

> **Agent Task:** Set up Cypress for both Component Testing and E2E Testing:
>
> 1. Install dependencies: `cypress`, `@cypress/vue`, `@cypress/vite-dev-server`
> 2. Create `cypress.config.ts` at project root:
>    - `component.devServer` using `@cypress/vite-dev-server` with Vite config
>    - `e2e.baseUrl` set to `http://localhost:5173` (Vite dev server default)
>    - `e2e.specPattern` set to `cypress/e2e/**/*.cy.ts`
>    - `component.specPattern` set to `cypress/component/**/*.cy.ts`
> 3. Create `cypress/support/component.ts` with Pinia and Vue plugin setup
> 4. Create `cypress/support/e2e.ts` with common setup
> 5. Create `cypress/fixtures/` directory with:
>    - `stream-live.json` → `{ "isLive": true, "stream": { ... } }`
>    - `stream-offline.json` → `{ "isLive": false, "stream": { ... } }`
> 6. Add scripts to `package.json`:
>    - `"cy:open": "cypress open"`
>    - `"cy:run": "cypress run"`
>    - `"cy:component": "cypress run --component"`
>    - `"cy:e2e": "cypress run --e2e"`
>
> **Reference:** Cypress docs for Vue 3 + Vite component testing.
>
> **Verification:**
> ```bash
> npx cypress verify
> ```

---

## Prompt 4: Create Store Unit Tests

> **Agent Task:** Create colocated unit tests for all Pinia stores:
>
> **`src/store/root.spec.ts`** (covers `useRootStore`):
> - Test initial state matches expected defaults
> - Test `fetchLiveState` updates state when stream is live
> - Test `fetchLiveState` updates state when stream is offline
> - Test `fetchLiveState` handles errors gracefully (logs, doesn't crash)
> - Test `updateNow` updates `now` and schedules update when live
> - Test `scheduleUpdateStreamState` calls `fetchLiveState` after timeout
> - Test `initStore` calls `fetchLiveState`
> - Mock `getStream` from `@/services/api` using `vi.mock`
>
> **`src/store/ui.spec.ts`** (covers `useUiStore`):
> - Test initial state
> - Test `swipeTouch` sets swipe direction
> - Test `swipeWheel` updates `swipeDeltaY` within bounds
> - Test `touchStart` records start coordinates
> - Test `touchEnd` computes delta and triggers landing roll-up
> - Test `isLiveModalOpen` initial state is `false`
> - Test `openLiveModal` sets `isLiveModalOpen` to `true`
> - Test `closeLiveModal` sets `isLiveModalOpen` to `false`
>
> **`src/hooks/useVideos.spec.ts`** (covers `useVideos` composable):
> - Test returns videos and loading state
> - Test loading is true initially
> - Mock Apollo client queries
>
> **Verification:**
> ```bash
> yarn vitest run --environment jsdom --root src/ src/store/root.spec.ts src/store/ui.spec.ts
> ```

---

## Prompt 5: Create Component Unit Tests

> **Agent Task:** Create colocated unit tests for all Vue components using `@vue/test-utils`:
>
> **`src/components/NavBar.spec.ts`**:
> - Renders navigation links (videos, social links)
> - Shows "en vivo" button when `stream.isLive` is true
> - Hides "en vivo" button when `stream.isLive` is false
> - Displays stream runtime text when live
> - Button click calls `ui.openLiveModal()`
> - Button is a `<button>` element (not div)
> - Button has appropriate ARIA attributes (`aria-label` or text content)
>
> **`src/components/LivePlayer.spec.ts`**:
> - Renders iframe with correct `src` URL
> - Uses `VITE_TWITCH_LOGIN` and `VITE_BASE_URL` env vars
> - iframe has `allowfullscreen` attribute
> - iframe has correct title
>
> **`src/components/ModalWindow.spec.ts`**:
> - Renders slot content
> - Emits `close` when backdrop is clicked
> - Emits `close` when Escape key is pressed
> - Does not emit `close` when inner content is clicked
> - Renders close button (X icon)
>
> **`src/components/VideoItem.spec.ts`**:
> - Renders video title, thumbnail, duration
> - Handles click events
>
> **`src/components/VideoDock.spec.ts`**:
> - Renders list of `VideoItem` components
> - Shows loading state
> - Shows empty state
>
> **`src/components/VideoPlayer.spec.ts`**:
> - Renders video element with correct src
> - Controls (play, pause, seek) work
>
> **`src/components/SectionContainer.spec.ts`**:
> - Renders slot content
>
> **`src/components/SocialLinks.spec.ts`**:
> - Renders social media links
>
> **`src/components/VideoSeekbar.spec.ts`**:
> - Renders seekbar with correct value
> - Handles seek events
>
> **`src/components/RangeSlider.spec.ts`**:
> - Renders slider with min/max
> - Handles value changes
>
> **Verification:**
> ```bash
> yarn vitest run --environment jsdom --root src/ src/components/
> ```

---

## Prompt 6: Create API/Service Unit Tests

> **Agent Task:** Create unit tests for the service layer:
>
> **`src/services/httpClient.spec.ts`**:
> - `createClient` returns an axios instance
> - Base URL and headers are set correctly
>
> **`src/services/api.spec.ts`**:
> - `getStream` calls `GET /twitch/stream`
> - Returns typed `AxiosResponse<StreamStatus>`
>
> **`src/services/twitch.spec.ts`**:
> - `getToken`: returns cached token if not expired
> - `getToken`: fetches new token if expired or missing
> - `getToken`: stores new token in Redis
> - `getStreamData`: calls correct endpoint with user_id param
> - `verifyRequest`: returns true for valid HMAC signature
> - `verifyRequest`: returns false for invalid signature
> - `verifyRequest`: returns false when headers are missing
> - `webhookChallengeMiddleware`: returns true and sends challenge for verification request
> - `webhookChallengeMiddleware`: returns false for non-verification request
> - `updateStreamMetadata`: stores stream data in Redis when live
>
> Mock `Redis` from `@upstash/redis` and HTTP calls with `axios-mock-adapter`.
>
> **Verification:**
> ```bash
> yarn vitest run --environment jsdom --root src/ src/services/
> ```

---

## Prompt 7: Create Serverless API Route Unit Tests

> **Agent Task:** Create unit tests for serverless API routes in `api/`:
>
> **`api/twitch/stream.spec.ts`**:
> - Returns 200 with `{ isLive, stream }` from Redis
> - Returns 500 with error message when Redis fails
>
> **`api/twitch/events/live.spec.ts`**:
> - `stream.online` event: sets `stream:status` to true, calls `updateStreamMetadata`
> - `stream.offline` event: sets `stream:status` to false
> - `channel.update` event: calls `updateStreamMetadata`
> - Unknown subscription type: returns 400
> - Invalid signature: returns 403
> - Webhook challenge: returns 200 with challenge text
>
> Mock `Redis` and `twitch.ts` functions. Use `node-mocks-http` or manual mock req/res objects.
>
> **Verification:**
> ```bash
> yarn vitest run --environment jsdom --root src/ api/
> ```

---

## Prompt 8: Implement UI Enhancement — NavBar Button & Modal

> **Agent Task:** Modify the following files to implement the new Twitch stream status UX:
>
> 1. **`src/store/ui.ts`**: Add `isLiveModalOpen: false` to state. Add `openLiveModal()` and `closeLiveModal()` actions.
>
> 2. **`src/components/NavBar.vue`**:
>    - Replace the `<div>` (line ~63) that shows "en vivo {streamRun}" with a `<button>` element.
>    - Add `@click="ui.openLiveModal"` handler.
>    - Add `aria-label="Watch live stream"` attribute.
>    - Keep the existing styling classes.
>    - Keep the `v-if="isLive && !ui.landingRolledUp"` condition.
>
> 3. **`src/views/HomeView.vue`**:
>    - Remove the `v-if="isLive"` / `v-else` conditional.
>    - Always render `<SectionContainer>` with `<VideoDock>`.
>    - Add a `<ModalWindow v-if="ui.isLiveModalOpen" @close="ui.closeLiveModal()">` containing `<LivePlayer />`.
>    - Import `ModalWindow` and `useUiStore`.
>    - Add "Stream ended" notice inside the modal when `!store.stream.isLive` while modal is open.
>    - Add a dismiss button that calls `ui.closeLiveModal()`.
>
> 4. **`src/components/ModalWindow.vue`** (if needed):
>    - Ensure the modal handles the `isLive` transition gracefully.
>
> **Verification:**
> ```bash
> yarn type-check && yarn build
> ```
>
> **Manual verification:**
> - With stream live, "en vivo" button appears in NavBar.
> - Clicking it opens a modal with Twitch player.
> - When stream goes offline, modal shows "Stream ended" notice.

---

## Prompt 9: Create Cypress Component Tests

> **Agent Task:** Create Cypress component tests for the UI changes:
>
> **`cypress/component/NavBar.cy.ts`**:
> - Renders with stream offline → no "en vivo" button
> - Renders with stream live → "en vivo" button visible
> - Clicking button emits openLiveModal (or opens modal)
>
> **`cypress/component/ModalWindow.cy.ts`**:
> - Renders slot content
> - Closes on backdrop click
> - Closes on Escape key
>
> **`cypress/component/LivePlayer.cy.ts`**:
> - Renders iframe with correct src
>
> **Verification:**
> ```bash
> yarn cy:component
> ```

---

## Prompt 10: Create Cypress E2E Tests

> **Agent Task:** Create E2E tests for the full Twitch stream status flow:
>
> **`cypress/e2e/twitch-stream.cy.ts`**:
> - Home page renders video catalog when stream is offline
> - "En Vivo" button appears when stream is live (intercept API)
> - Clicking "En Vivo" opens modal with Twitch player iframe
> - Modal closes on backdrop click
> - Modal closes on Escape key
> - "Stream ended" notice appears when stream goes offline during viewing
>
> **`cypress/e2e/navigation.cy.ts`**:
> - Home page loads successfully
> - Navigate to /videos and back
> - NavBar is visible on both routes
>
> Use `cy.intercept` to mock `/api/twitch/stream` responses.
>
> **Verification:**
> ```bash
> yarn dev &  # start dev server
> yarn cy:e2e
> ```

---

## Prompt 11: Update CI Pipeline

> **Agent Task:** Update `.github/workflows/build.yml` to:
> 1. Add a `cypress` job that:
>    - Checks out code
>    - Sets up Node.js 26.13.0
>    - Installs dependencies with `yarn install --frozen-lockfile`
>    - Starts the dev server
>    - Runs `yarn cy:e2e`
> 2. Add coverage threshold enforcement to the `build` job:
>    - Run `yarn test:coverage` instead of `yarn test:unit`
>    - Fail if coverage is below 80%
> 3. Add `yarn cy:component` to the build job
>
> **Verification:** Push to a PR and confirm CI passes.

---

## Prompt 12: Final Verification & Cleanup

> **Agent Task:** Run the full verification suite:
> 1. `yarn lint` — no errors
> 2. `yarn type-check` — no errors
> 3. `yarn test:unit` — all pass
> 4. `yarn test:coverage` — ≥ 80% coverage
> 5. `yarn build` — succeeds
> 6. `yarn cy:component` — all pass
> 7. `yarn cy:e2e` — all pass (with dev server running)
>
> If any issues arise during implementation, create `IMPLEMENTATION.md` documenting:
> - What was implemented
> - Key decisions made during implementation
> - Issues encountered and how they were resolved
> - Code references for future maintainers
>
> If no issues arise, do NOT create `IMPLEMENTATION.md`.

---

## Parallelization Guide

| Phase | Tasks | Can Parallelize? | Agent Assignment |
|---|---|---|---|
| 0 | Prompt 0 | — | Single agent |
| 1 | Prompts 1-3 | ✅ (1, 2, 3 are independent) | 3 agents |
| 2 | Prompts 4-7 | ✅ (4, 5, 6, 7 are independent) | 4 agents |
| 3 | Prompt 8 | — | Single agent (depends on Phase 1) |
| 4 | Prompt 9 | — | Single agent (depends on Phase 3) |
| 5 | Prompt 10 | — | Single agent (depends on Phases 2-4) |
| 6 | Prompts 11-12 | — | Single agent (depends on Phase 5) |

### Parallelization Rules

1. **Phase 1 (Infrastructure)**: Prompts 1 (Vitest), 2 (Test utils), and 3 (Cypress) are independent. Run all three in parallel.
2. **Phase 2 (Unit Tests)**: Prompts 4 (Stores), 5 (Components), 6 (Services), and 7 (API routes) are independent. Run all four in parallel.
3. **Phase 3 (UI)**: Prompt 8 depends on Phase 1 (test infra) but NOT on Phase 2. Can run in parallel with Phase 2.
4. **Phase 4 (CT)**: Prompt 9 depends on Phase 3 (tests new UI).
5. **Phase 5 (E2E)**: Prompt 10 depends on Phases 2-4.
6. **Phase 6 (CI)**: Prompts 11-12 depend on Phase 5.

---

## Known Constraints

1. **Vue 3 + Vite**: Component tests need `@vitejs/plugin-vue` for SFC compilation.
2. **Pinia**: Tests need to create a fresh Pinia instance per test (`createPinia()`).
3. **Vue Router**: Component tests that use `RouterLink` need a router instance.
4. **Environment variables**: `VITE_*` vars are available at build time; test setup must provide defaults.
5. **Redis mocking**: `@upstash/redis` `Redis.fromEnv()` is called at module load time. Tests must mock the module before import.
6. **Twitch embed**: The iframe `src` uses `VITE_TWITCH_LOGIN` and `VITE_BASE_URL`. Tests must set these env vars.
7. **No existing test infrastructure**: Everything must be created from scratch.
8. **Node version**: Project requires Node.js ≥ 26.13.0 (per `package.json` engines).