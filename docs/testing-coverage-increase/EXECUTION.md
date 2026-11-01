# Execution: Testing Coverage Increase & Twitch Stream Status Enhancement

**Date:** 2026-11-01
**Status:** Active
**Area:** Testing, Twitch Stream Status
**Role:** Execution Gateway — this file is the single entry point for all implementation work.

---

## Prime Directive

> **No implementation code shall be written until this document and its referenced files have been read in full.**
>
> 1. Read `SPECIFICATION.md` for the problem, desired outcome, and architecture decisions.
> 2. Read `TODO.md` for the task list and current status.
> 3. Read `BLUEPRINT.md` for the step-by-step implementation prompts.
> 4. Execute tasks in the order defined in the **Sequential Execution Order** below.
> 5. Update `TODO.md` status as each task completes (`TODO` → `IN PROGRESS` → `DONE`).
> 6. If issues arise, create `IMPLEMENTATION.md` documenting them.
> 7. Do NOT create `IMPLEMENTATION.md` if no issues arise.

---

## Rules & Constraints

### Code Rules
1. **Vue SFCs** use `<script setup lang="ts">`.
2. **Type-only imports** use `import type { Foo }`.
3. **Path alias** `@/` maps to `src/`.
4. **Formatting**: 2-space indentation, semicolons, double quotes, trailing commas (Prettier defaults).
5. **No `any`** — use `unknown` with narrowing.
6. **Early returns** and guard clauses over deeply nested conditionals.
7. **Pinia stores** are domain-focused; import from `@/store` barrel.
8. **Test files** are colocated: `ComponentName.spec.ts` next to `ComponentName.vue`.

### Testing Rules
9. **Vitest** uses `jsdom` environment, root `src/`.
10. **Coverage threshold**: ≥ 80% for lines, functions, branches, statements.
11. **Mock HTTP** at the axios boundary using `axios-mock-adapter`.
12. **Mock Redis** using `vi.mock('@upstash/redis')`.
13. **Fresh Pinia instance** per test: `createPinia()` in `beforeEach`.
14. **No real API calls** in any test.
15. **Cypress component tests** use `@cypress/vue` with Vite dev server.
16. **Cypress E2E tests** use `cy.intercept` to mock API responses.
17. **Test names** are descriptive with `describe` blocks.

### Documentation Rules
18. **Update `TODO.md`** as tasks progress.
19. **Create `IMPLEMENTATION.md`** only if issues arise.
20. **Do not modify** files outside the scope of the current task.

### Execution Rules
21. **Sequential order** must be followed (see below).
22. **Dependencies** must be satisfied before starting a task.
23. **Parallelization** is allowed only where explicitly marked.
24. **Verification commands** must pass before marking a task as `DONE`.

---

## Referenced Files

| File | Purpose | When to Read |
|---|---|---|
| `SPECIFICATION.md` | Problem description, desired outcome, architecture decisions | Before any implementation |
| `TODO.md` | Task tracker with status | Before and during implementation |
| `BLUEPRINT.md` | Step-by-step implementation prompts | During implementation |
| `AGENTS.md` | Project conventions, build/test commands | Before any implementation |
| `src/types/twitch.ts` | Twitch type definitions | When writing Twitch-related tests |
| `src/types/api.ts` | StreamStatus type | When writing stream tests |
| `src/store/index.ts` | Root store (stream state) | When writing store tests |
| `src/store/ui.ts` | UI store (modal state) | When writing UI tests |
| `src/services/api.ts` | Frontend API client | When writing service tests |
| `src/services/httpClient.ts` | Axios factory | When writing service tests |
| `src/services/twitch.ts` | Twitch API client | When writing service tests |
| `api/twitch/stream.ts` | Stream status endpoint | When writing route tests |
| `api/twitch/events/live.ts` | Webhook handler | When writing route tests |
| `src/components/NavBar.vue` | Navigation bar | When writing component tests |
| `src/components/LivePlayer.vue` | Twitch iframe embed | When writing component tests |
| `src/components/ModalWindow.vue` | Modal container | When writing component tests |
| `src/views/HomeView.vue` | Home page | When writing component tests |

---

## Sequential Execution Order

### Phase 0: Documentation & Pattern Setup

| Step | Task ID | Description | Depends On | Parallelizable |
|---|---|---|---|---|
| 0.1 | T0.1 | Add "Feature Documentation Pattern" to AGENTS.md | — | No |
| 0.2 | T0.2 | Create SPECIFICATION.md | — | No |
| 0.3 | T0.3 | Create TODO.md | — | No |
| 0.4 | T0.4 | Create BLUEPRINT.md | 0.1, 0.2, 0.3 | No |
| 0.5 | T0.5 | Create EXECUTION.md | 0.4 | No |

**Gate:** All Phase 0 tasks must be `DONE` before proceeding to Phase 1.

---

### Phase 1: Testing Infrastructure

| Step | Task ID | Description | Depends On | Parallelizable |
|---|---|---|---|---|
| 1.1 | T1.1-T1.4 | Install Vitest deps + create `vitest.config.ts` + test utils | Phase 0 | Yes (with 1.2) |
| 1.2 | T1.5-T1.7 | Install Cypress + create `cypress.config.ts` + support files | Phase 0 | Yes (with 1.1) |
| 1.3 | T1.8-T1.10 | Create test utility helpers + add npm scripts | 1.1, 1.2 | No |

**Gate:** `yarn vitest run` and `npx cypress verify` must both pass before proceeding.

---

### Phase 2: Unit Tests (Parallelizable)

| Step | Task ID | Description | Depends On | Parallelizable |
|---|---|---|---|---|
| 2.1 | T2a.1-T2a.7 | Store unit tests (root, ui, videos) | Phase 1 | Yes (with 2.2-2.4) |
| 2.2 | T2b.1-T2b.16 | Component unit tests | Phase 1 | Yes (with 2.1, 2.3, 2.4) |
| 2.3 | T2c.1-T2c.7 | Service/API unit tests | Phase 1 | Yes (with 2.1, 2.2, 2.4) |
| 2.4 | T2c.8-T2c.15 | Serverless route unit tests | Phase 1 | Yes (with 2.1, 2.2, 2.3) |

**Gate:** All unit tests pass (`yarn test:unit` exits 0) and coverage ≥ 80% before proceeding.

---

### Phase 3: UI Enhancement

| Step | Task ID | Description | Depends On | Parallelizable |
|---|---|---|---|---|
| 3.1 | T3.1-T3.2 | Add `isLiveModalOpen` to `useUiStore` | Phase 1 | No |
| 3.2 | T3.3-T3.4 | Convert NavBar `<div>` to `<button>` | 3.1 | No |
| 3.3 | T3.5-T3.8 | Refactor HomeView + add modal + offline notice | 3.2 | No |
| 3.4 | T3.9-T3.10 | Verify modal close + type-check | 3.3 | No |

**Gate:** `yarn type-check && yarn build` must pass before proceeding.

---

### Phase 4: Cypress Component Tests

| Step | Task ID | Description | Depends On | Parallelizable |
|---|---|---|---|---|
| 4.1 | T4.1-T4.5 | Write Cypress CT for NavBar, ModalWindow, LivePlayer | Phase 3 | No |

**Gate:** `yarn cy:component` must pass before proceeding.

---

### Phase 5: Cypress E2E Tests

| Step | Task ID | Description | Depends On | Parallelizable |
|---|---|---|---|---|
| 5.1 | T5.1-T5.5 | Twitch stream status E2E flow | Phase 4 | No |
| 5.2 | T5.6-T5.7 | Navigation & basic functionality E2E | Phase 4 | No |

**Gate:** `yarn cy:e2e` must pass (with dev server running) before proceeding.

---

### Phase 6: CI Integration & Final Verification

| Step | Task ID | Description | Depends On | Parallelizable |
|---|---|---|---|---|
| 6.1 | T6.1-T6.3 | Update GitHub Actions workflow | Phase 5 | No |
| 6.2 | T6.4 | Final verification suite | 6.1 | No |

**Gate:** All verification commands pass:
```bash
yarn lint
yarn type-check
yarn test:unit
yarn test:coverage
yarn build
yarn cy:component
yarn cy:e2e
```

---

## Definition of Done (Per Task)

### Phase 0: Documentation
- [ ] AGENTS.md contains "Feature Documentation Pattern" section
- [ ] SPECIFICATION.md exists with problem, desired outcome, architecture decisions
- [ ] TODO.md exists with all tasks and status tracking
- [ ] BLUEPRINT.md exists with implementation prompts
- [ ] EXECUTION.md exists as execution gateway

### Phase 1: Infrastructure
- [ ] `vitest.config.ts` exists and `yarn vitest run` passes
- [ ] `cypress.config.ts` exists and `npx cypress verify` passes
- [ ] Test utility helpers exist in `src/test-utils/`
- [ ] npm scripts added: `test:coverage`, `cy:open`, `cy:run`, `cy:component`, `cy:e2e`

### Phase 2: Unit Tests
- [ ] All store tests pass
- [ ] All component tests pass
- [ ] All service tests pass
- [ ] All API route tests pass
- [ ] Coverage ≥ 80% for all metrics

### Phase 3: UI Enhancement
- [ ] `useUiStore` has `isLiveModalOpen`, `openLiveModal`, `closeLiveModal`
- [ ] NavBar uses `<button>` for "en vivo" with click handler
- [ ] HomeView always shows catalog + modal overlay
- [ ] "Stream ended" notice appears when stream goes offline during viewing
- [ ] `yarn type-check && yarn build` pass

### Phase 4: Cypress Component Tests
- [ ] All CT tests pass
- [ ] `yarn cy:component` exits 0

### Phase 5: Cypress E2E Tests
- [ ] All E2E tests pass
- [ ] `yarn cy:e2e` exits 0

### Phase 6: CI & Final
- [ ] GitHub Actions workflow updated
- [ ] All verification commands pass
- [ ] IMPLEMENTATION.md created only if issues arose

---

## Parallelization Summary

```
Phase 0: [0.1 → 0.2 → 0.3 → 0.4 → 0.5] (sequential)
Phase 1: [1.1 ‖ 1.2] → 1.3 (parallel then sequential)
Phase 2: [2.1 ‖ 2.2 ‖ 2.3 ‖ 2.4] (all parallel)
Phase 3: [3.1 → 3.2 → 3.3 → 3.4] (sequential)
Phase 4: [4.1] (sequential)
Phase 5: [5.1 ‖ 5.2] (parallel)
Phase 6: [6.1 → 6.2] (sequential)
```

### Agent Assignment Recommendation

| Phase | Agents | Tasks |
|---|---|---|
| 0 | 1 agent | All (sequential) |
| 1 | 2 agents | Agent A: 1.1 (Vitest), Agent B: 1.2 (Cypress), then 1.3 together |
| 2 | 4 agents | Agent A: 2.1 (Stores), Agent B: 2.2 (Components), Agent C: 2.3 (Services), Agent D: 2.4 (Routes) |
| 3 | 1 agent | All (sequential) |
| 4 | 1 agent | All |
| 5 | 1-2 agents | 5.1 and 5.2 can be parallel |
| 6 | 1 agent | All |

---

## Error Recovery

| Scenario | Action |
|---|---|
| Vitest config fails | Check `vite.config.ts` alias; ensure `@vitejs/plugin-vue` is installed |
| Cypress won't start | Run `npx cypress verify`; check Node version ≥ 26.13.0 |
| Redis mock fails | Ensure `vi.mock('@upstash/redis')` is called before imports |
| Coverage below 80% | Identify uncovered files; add targeted tests |
| Type-check fails | Fix type errors before proceeding; do not skip |
| Build fails | Fix build errors; check for missing imports or type issues |
| Modal doesn't open | Verify `isLiveModalOpen` state and `openLiveModal` action in ui store |
| "Stream ended" not showing | Verify reactive binding to `store.stream.isLive` in modal |

---

## Completion Checklist

- [ ] Phase 0: Documentation complete
- [ ] Phase 1: Infrastructure ready
- [ ] Phase 2: Unit tests pass + coverage ≥ 80%
- [ ] Phase 3: UI enhancement complete
- [ ] Phase 4: Cypress CT pass
- [ ] Phase 5: Cypress E2E pass
- [ ] Phase 6: CI updated + final verification
- [ ] IMPLEMENTATION.md created (only if issues arose)

---

## Notes

- This is a **planning document**. No implementation code has been written yet.
- All tasks reference `BLUEPRINT.md` for detailed prompts.
- Status tracking is in `TODO.md`.
- Architecture decisions are in `SPECIFICATION.md`.
- The user will switch to build mode to begin implementation.