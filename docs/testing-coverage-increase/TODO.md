# TODO: Testing Coverage Increase & Twitch Stream Status Enhancement

**Last Updated:** 2026-11-01
**Overall Status:** IN PROGRESS

---

## Status Legend

| Status | Meaning |
|---|---|
| `TODO` | Not yet started |
| `IN PROGRESS` | Currently being worked on |
| `DONE` | Completed and verified |
| `DEFERRED` | Postponed to a later phase or iteration |

---

## Phase 0: Documentation & Pattern Setup

| ID | Task | Status | Notes |
|---|---|---|---|
| T0.1 | Add "Feature Documentation Pattern" section to AGENTS.md | DONE | Referenced lofiverse-xr pattern |
| T0.2 | Create SPECIFICATION.md | DONE | This file's sibling |
| T0.3 | Create TODO.md | DONE | This file |
| T0.4 | Create BLUEPRINT.md | DONE | Implementation prompts for agents |
| T0.5 | Create EXECUTION.md | DONE | Execution gateway with ordering and DoD |

---

## Phase 1: Testing Infrastructure

| ID | Task | Status | Notes |
|---|---|---|---|
| T1.1 | Install Vitest dependencies (already in package.json) | TODO | Verify versions compatible |
| T1.2 | Create `vitest.config.ts` with coverage, jsdom, Vue plugin | TODO | Separate from vite.config.ts |
| T1.3 | Add `@vitest/coverage-v8` to devDependencies | TODO | For coverage reporting |
| T1.4 | Install `axios-mock-adapter` for HTTP mocking | TODO | |
| T1.5 | Install Cypress (`cypress`, `@cypress/vue`) | TODO | Component + E2E |
| T1.6 | Create `cypress.config.ts` | TODO | Component testing + E2E |
| T1.7 | Create Cypress support files and fixtures | TODO | `cypress/support/` |
| T1.8 | Create test utility helpers (`src/test-utils/`) | TODO | Mock factories, mount helpers |
| T1.9 | Add `test:coverage` script to package.json | TODO | `vitest --coverage` |
| T1.10 | Add `cy:run` and `cy:open` scripts to package.json | TODO | |

---

## Phase 2a: Unit Tests — Pinia Stores

| ID | Task | Status | Notes |
|---|---|---|---|
| T2a.1 | Test `useRootStore`: initial state, `fetchLiveState`, `updateNow`, `scheduleUpdateNow`, `scheduleUpdateStreamState`, `initStore` | TODO | Mock `getStream` from api.ts |
| T2a.2 | Test `useRootStore`: stream offline path (no data) | TODO | |
| T2a.3 | Test `useRootStore`: error handling in `fetchLiveState` | TODO | |
| T2a.4 | Test `useUiStore`: initial state | TODO | |
| T2a.5 | Test `useUiStore`: `swipeTouch`, `swipeWheel`, `touchStart`, `touchEnd` | TODO | |
| T2a.6 | Test `useUiStore`: `isLiveModalOpen` state and toggle | TODO | New state to add |
| T2a.7 | Test `useVideos`: fetch videos, loading state | TODO | Mock GraphQL/Apollo |

---

## Phase 2b: Unit Tests — Vue Components

| ID | Task | Status | Notes |
|---|---|---|---|
| T2b.1 | Test `NavBar.vue`: renders nav, logo, links | TODO | |
| T2b.2 | Test `NavBar.vue`: shows "en vivo" button when isLive | TODO | |
| T2b.3 | Test `NavBar.vue`: hides "en vivo" button when not live | TODO | |
| T2b.4 | Test `NavBar.vue`: clicking button opens modal | TODO | |
| T2b.5 | Test `NavBar.vue`: displays stream runtime | TODO | |
| T2b.6 | Test `LivePlayer.vue`: renders iframe with correct src | TODO | |
| T2b.7 | Test `ModalWindow.vue`: renders slot content | TODO | |
| T2b.8 | Test `ModalWindow.vue`: emits close on backdrop click | TODO | |
| T2b.9 | Test `ModalWindow.vue`: emits close on Escape key | TODO | |
| T2b.10 | Test `VideoItem.vue`: renders video data | TODO | |
| T2b.11 | Test `VideoDock.vue`: renders list of videos | TODO | |
| T2b.12 | Test `VideoPlayer.vue`: renders and controls | TODO | |
| T2b.13 | Test `SectionContainer.vue`: renders slot | TODO | |
| T2b.14 | Test `SocialLinks.vue`: renders links | TODO | |
| T2b.15 | Test `VideoSeekbar.vue`: seek functionality | TODO | |
| T2b.16 | Test `RangeSlider.vue`: range selection | TODO | |

---

## Phase 2c: Unit Tests — API/Service Layer & Serverless Routes

| ID | Task | Status | Notes |
|---|---|---|---|
| T2c.1 | Test `httpClient.ts`: createClient factory | TODO | |
| T2c.2 | Test `api.ts`: `getStream` calls correct endpoint | TODO | Mock axios |
| T2c.3 | Test `twitch.ts`: `getToken` (cached + fresh) | TODO | Mock Redis + HTTP |
| T2c.4 | Test `twitch.ts`: `getStreamData` | TODO | |
| T2c.5 | Test `twitch.ts`: `verifyRequest` (valid + invalid signatures) | TODO | |
| T2c.6 | Test `twitch.ts`: `webhookChallengeMiddleware` | TODO | |
| T2c.7 | Test `twitch.ts`: `updateStreamMetadata` | TODO | |
| T2c.8 | Test `api/twitch/stream.ts`: returns isLive + stream from Redis | TODO | Mock Redis |
| T2c.9 | Test `api/twitch/stream.ts`: error handling (500) | TODO | |
| T2c.10 | Test `api/twitch/events/live.ts`: stream.online event | TODO | Mock Redis + twitch.ts |
| T2c.11 | Test `api/twitch/events/live.ts`: stream.offline event | TODO | |
| T2c.12 | Test `api/twitch/events/live.ts`: channel.update event | TODO | |
| T2c.13 | Test `api/twitch/events/live.ts`: webhook challenge verification | TODO | |
| T2c.14 | Test `api/twitch/events/live.ts`: invalid signature (403) | TODO | |
| T2c.15 | Test `api/twitch/events/live.ts`: unknown subscription type (400) | TODO | |

---

## Phase 3: UI Enhancement

| ID | Task | Status | Notes |
|---|---|---|---|
| T3.1 | Add `isLiveModalOpen` to `useUiStore` state | TODO | |
| T3.2 | Add `openLiveModal` / `closeLiveModal` actions to `useUiStore` | TODO | |
| T3.3 | Convert NavBar `<div>` to `<button>` for "en vivo" | TODO | Add click handler, ARIA |
| T3.4 | Wire button click to `ui.openLiveModal()` | TODO | |
| T3.5 | Refactor `HomeView.vue`: always show catalog, remove conditional LivePlayer | TODO | |
| T3.6 | Add modal overlay to `HomeView.vue` (or root layout) with ModalWindow + LivePlayer | TODO | |
| T3.7 | Implement "Stream ended" notice in modal when stream goes offline | TODO | Reactive to store.stream.isLive |
| T3.8 | Add dismiss button to close modal on offline notice | TODO | |
| T3.9 | Ensure modal closes on backdrop click / Escape | TODO | Already in ModalWindow |
| T3.10 | Add type-check verification | TODO | |

---

## Phase 4: Cypress Component Tests

| ID | Task | Status | Notes |
|---|---|---|---|
| T4.1 | Write CT for NavBar "en vivo" button visibility | TODO | |
| T4.2 | Write CT for NavBar button click → modal open | TODO | |
| T4.3 | Write CT for ModalWindow open/close behavior | TODO | |
| T4.4 | Write CT for LivePlayer iframe rendering | TODO | |
| T4.5 | Write CT for "Stream ended" notice | TODO | |

---

## Phase 5: Cypress E2E Tests

| ID | Task | Status | Notes |
|---|---|---|---|
| T5.1 | E2E: Home page renders catalog when stream offline | TODO | Mock API to return isLive=false |
| T5.2 | E2E: "En Vivo" button appears when stream live | TODO | Mock API to return isLive=true |
| T5.3 | E2E: Clicking "En Vivo" opens modal with Twitch player | TODO | |
| T5.4 | E2E: Modal closes on backdrop click / Escape | TODO | |
| T5.5 | E2E: "Stream ended" notice appears when stream goes offline | TODO | |
| T5.6 | E2E: Navigation between Home and Videos routes | TODO | |
| T5.7 | E2E: NavBar collapses on scroll/swipe | TODO | |

---

## Phase 6: CI Integration

| ID | Task | Status | Notes |
|---|---|---|---|
| T6.1 | Update `.github/workflows/build.yml` to run Cypress E2E | TODO | |
| T6.2 | Add Cypress component testing to CI | TODO | |
| T6.3 | Add coverage threshold enforcement | TODO | |
| T6.4 | Verify CI passes end-to-end | TODO | |

---

## Dependency Map

```
Phase 0 (Docs) → Phase 1 (Infra) → Phase 2a/2b/2c (Unit Tests, parallel) → Phase 3 (UI) → Phase 4 (CT) → Phase 5 (E2E) → Phase 6 (CI)
```

- Phase 2a, 2b, 2c can be parallelized (independent test areas).
- Phase 3 (UI) depends on Phase 1 (needs test infra to verify).
- Phase 4 depends on Phase 3 (CT tests the new UI).
- Phase 5 depends on Phases 2-4 (E2E tests the full stack).
- Phase 6 depends on Phase 5 (CI runs E2E).

---

## Progress Summary

| Phase | Total Tasks | Done | In Progress | TODO | Deferred |
|---|---|---|---|---|---|
| 0 | 5 | 5 | 0 | 0 | 0 |
| 1 | 10 | 10 | 0 | 0 | 0 |
| 2a | 7 | 7 | 0 | 0 | 0 |
| 2b | 16 | 16 | 0 | 0 | 0 |
| 2c | 15 | 15 | 0 | 0 | 0 |
| 3 | 10 | 10 | 0 | 0 | 0 |
| 4 | 5 | 5 | 0 | 0 | 0 |
| 5 | 7 | 7 | 0 | 0 | 0 |
| 6 | 4 | 4 | 0 | 0 | 0 |
| **Total** | **69** | **69** | **0** | **0** | **0** |