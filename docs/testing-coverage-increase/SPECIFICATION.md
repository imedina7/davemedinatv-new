# Specification: Testing Coverage Increase & Twitch Stream Status Enhancement

**Date:** 2026-11-01
**Status:** Active
**Area:** Testing, Twitch Stream Status

---

## 1. Problem Description

The `davemedinatv` web application currently has **zero test coverage**. There is no Vitest configuration file, no Cypress setup, and no test files anywhere in the repository. This means:

- No confidence in the Twitch stream status reporting flow (the most critical user-facing feature).
- No regression protection when modifying components, stores, or API routes.
- No automated verification of the "En Vivo" (live) indicator behavior.
- The CI pipeline runs `yarn test:unit` but there are no tests to run.

Additionally, the current Twitch live experience is **not interactive**: when the stream goes live, `HomeView` **replaces** the entire video catalog with a full-screen `LivePlayer` iframe. There is no explicit "En Vivo" button that the user can click to open the stream; the player is forced upon them. There is also no graceful handling when the stream goes offline while the player is visible.

## 2. Desired Outcome

### 2.1 UI/UX Enhancement

1. The `HomeView` **always** renders the video catalog, regardless of stream status.
2. The `NavBar` displays an "en vivo" indicator styled as a `<button>` (replacing the current `<div>`).
3. Clicking the "En Vivo" button opens a `ModalWindow` containing the `LivePlayer` (Twitch iframe embed).
4. When the stream goes offline while the modal is open, a "Stream ended" notice is shown inside the modal with a dismiss button that closes the modal.
5. The NavBar button is accessible (keyboard-focusable, proper ARIA attributes, semantic `<button>` element).

### 2.2 Testing Infrastructure

1. **Vitest** configured with:
   - `jsdom` environment
   - Vue plugin (`@vitejs/plugin-vue`)
   - Coverage reporting with an **80% threshold** target
   - Colocated test files (`*.spec.ts` next to source)
   - Axios mock adapter (`axios-mock-adapter`) for HTTP-level mocking

2. **Cypress** configured for:
   - Component Testing (Vue components in isolation)
   - E2E Testing (full browser flows against a running dev server)
   - Both added to the GitHub Actions CI pipeline

### 2.3 Test Coverage Areas

| Area | Description |
|---|---|
| **Pinia stores** | `useRootStore` (stream state, fetchLiveState, polling), `useUiStore` (swipe, modal, landing), `useVideos` (fetch, loading) |
| **Vue components** | `NavBar`, `LivePlayer`, `ModalWindow`, `VideoItem`, `VideoDock`, `VideoPlayer`, `SectionContainer`, `SocialLinks`, `VideoSeekbar`, `RangeSlider` |
| **API/service layer** | `httpClient`, `api.ts` (`getStream`), `twitch.ts` (token, getStreamData, verifyRequest, webhookChallengeMiddleware) |
| **Serverless API routes** | `api/twitch/stream.ts` (status read), `api/twitch/events/live.ts` (webhook handler) |
| **E2E flows** | Twitch status → "En Vivo" button → modal player → offline notice; navigation; basic page rendering |

### 2.4 Success Criteria

- All unit tests pass (`yarn test:unit` exits 0).
- Cypress component and E2E tests pass locally.
- Code coverage reaches **≥ 80%** for lines, functions, branches, and statements.
- `yarn build` still passes after all changes.
- `yarn type-check` passes.
- `yarn lint` passes with no errors.
- The "En Vivo" button appears only when stream is live.
- Clicking the button opens a modal with the Twitch player.
- Offline stream shows "Stream ended" notice.

---

## 3. Architecture Decisions

### 3.1 Modal Approach for Twitch Player

**Decision:** Use the existing `ModalWindow` component to display `LivePlayer` in an overlay, rather than navigating to a new route or replacing the catalog.

**Rationale:**
- `ModalWindow` already exists and provides a backdrop, close button, Escape key handling, and focus trapping (`v-focus`).
- This keeps the catalog visible underneath, reducing layout shifts.
- A dedicated route would require router changes and a new view component — unnecessary complexity.
- The existing `LivePlayer` component already encapsulates the Twitch iframe; it just needs to be placed inside the modal.

### 3.2 Store State for Modal Visibility

**Decision:** Add a `isLiveModalOpen` boolean to `useUiStore` rather than `useRootStore`.

**Rationale:**
- UI visibility state (modals, overlays) belongs in `useUiStore`, which already manages `isVideoOverlayOpen` and `landingRolledUp`.
- `useRootStore` is responsible for stream data (isLive, title, runtime), not UI visibility.
- This keeps stores domain-focused per the project conventions.

### 3.3 Stream Offline Detection in Modal

**Decision:** The modal monitors `useRootStore.stream.isLive` reactively. When it transitions from `true` to `false` while the modal is open, a "Stream ended" notice replaces the player.

**Rationale:**
- The store already polls every 60s via `scheduleUpdateStreamState`.
- Vue's reactivity system will automatically trigger the template update.
- No additional polling or WebSocket needed for the modal.

### 3.4 Test File Locations

**Decision:** Colocate test files alongside source files (e.g., `src/components/NavBar.spec.ts`).

**Rationale:**
- Easier to find tests for a given file.
- Matches the existing AGENTS.md convention ("Tests live in `src/__tests__/` or alongside components").
- Vitest's `--root src/` with default include patterns picks up `*.spec.ts` files recursively.

### 3.5 Mocking Strategy

**Decision:** Use `axios-mock-adapter` for HTTP-level mocking in unit tests.

**Rationale:**
- Mocks at the HTTP boundary, not the service boundary — tests verify the service code itself.
- Consistent with the project's `httpClient` factory pattern.
- No need for MSW (additional dependency and setup complexity).

### 3.6 Serverless Route Testing

**Decision:** Test `api/` routes using `node-mocks-http` or by importing the handler and calling it with mock request/response objects.

**Rationale:**
- Vercel serverless handlers are plain `(req, res)` functions.
- Can be tested in the Vitest/jsdom environment with mock HTTP objects.
- Redis calls will be mocked with a manual mock.

---

## 4. Environment Variables Required for Tests

| Variable | Purpose | Test Default |
|---|---|---|
| `VITE_TWITCH_LOGIN` | Twitch channel name for embed URL | `davemedinatv` |
| `VITE_BASE_URL` | Parent domain for Twitch embed | `localhost` |
| `TWITCH_CLIENT_ID` | Twitch API client ID (server-side) | Mocked |
| `TWITCH_CLIENT_SECRET` | Twitch API client secret (server-side) | Mocked |
| `TWITCH_USER_ID` | Twitch broadcaster user ID | Mocked |
| `TWITCH_EVENT_SUB_SECRET` | Webhook signature verification | Mocked |
| `UPSTASH_REDIS_REST_URL` | Redis connection URL | Mocked |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token | Mocked |

---

## 5. Non-Goals (Out of Scope)

- Implementing real Twitch API integration from scratch (already exists).
- Changing the Twitch webhook subscription flow.
- Adding new serverless API endpoints.
- Internationalization / i18n (the app uses Spanish strings already).
- Accessibility audit beyond basic semantic HTML (button vs div).
- Performance optimization of the Twitch embed.

---

## 6. Dependencies on Existing Code

| Existing File | Role in This Feature |
|---|---|
| `src/components/ModalWindow.vue` | Reused as the player modal container |
| `src/components/LivePlayer.vue` | Rendered inside the modal |
| `src/store/ui.ts` | Extended with `isLiveModalOpen` state |
| `src/store/index.ts` | Read by components for `stream.isLive` (no changes) |
| `src/services/api.ts` | Mocked in component/unit tests |
| `api/twitch/stream.ts` | Tested directly |
| `api/twitch/events/live.ts` | Tested directly |
| `src/components/NavBar.vue` | Modified: div → button |
| `src/views/HomeView.vue` | Modified: always show catalog, remove conditional LivePlayer |

---

## 7. Risk Assessment

| Risk | Impact | Mitigation |
|---|---|---|
| Twitch embed requires HTTPS parent domain | Medium | Use `localhost` parent in dev; document env var |
| Redis mock complexity in route tests | Medium | Create shared mock factory in test utilities |
| Cypress component testing with Pinia/Vue | Low | Use `@cypress/vue` and mount with plugins |
| 80% coverage with many small components | Low | Focus on behavioral coverage, not line padding |
| Modal focus trapping conflicts with tests | Low | Use `cy.get()` with specific selectors |