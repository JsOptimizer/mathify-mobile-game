# Mathify — Project Status

> Live snapshot of where the project stands against the MVP plan.
> Source of truth for milestones: [planned.md](planned.md). Source of truth for completed history: [CHANGELOG.md](CHANGELOG.md).

**Last updated:** 2026-05-02
**Current phase:** Phase 1 — Foundation (in progress, ~29% complete)
**Overall MVP progress:** ~11% (9 / 80 tasks complete)
**Next release target:** v1.0.0 — App Store + Play Store (end of Phase 4)
**Active blockers:** None

---

## Phase Overview

| Phase | Focus | Status | Progress |
|---|---|---|---|
| **0** | Project bootstrap (pre-MVP scaffold) | ✅ Complete | 100% |
| **1** | Foundation — deps, theme, locales, skeleton | 🟡 In progress | ~29% |
| **2** | Core gameplay — playable round end-to-end | ⏳ Not started | 0% |
| **3** | Feel & polish — animation, audio, haptics, persistence, a11y | ⏳ Not started | 0% |
| **4** | Release — EAS, store assets, submission | ⏳ Not started | 0% |

---

## Phase 0 — Bootstrap (✅ Complete)

Pre-MVP setup that happened before the formal phase plan was written. Captured here for completeness.

- [x] Expo SDK 54 project initialized with TypeScript, expo-router, New Architecture, React Compiler.
- [x] `pnpm` configured as package manager.
- [x] Feature-based directory structure created under `src/` with `app/`, `shared/`, `features/`.
- [x] i18n wired (i18next + react-i18next + expo-localization), EN + FR locale files in place.
- [x] TypeScript path alias `@/*` configured.
- [x] Product brief written ([BRAIN.md](BRAIN.md)).
- [x] Planning docs published: [project-spec.md](project-spec.md), [architecture.md](architecture.md), [planned.md](planned.md).
- [x] [CHANGELOG.md](CHANGELOG.md) and this status doc created.

---

## Phase 1 — Foundation (🟡 In progress)

**Goal:** A clean project skeleton with all dependencies installed, theme tokens defined, locales scaffolded, and feature folders ready to receive code. No gameplay yet.

**See [planned.md §Phase 1](planned.md) for the full 24-task breakdown.**

### Accomplished

- [x] **T1.1.1** — `app-example/` directory deleted.
- [x] **T1.1.2** — `app-example` entry removed from `.gitignore`.
- [x] **T1.1.4** — `tsconfig.json` path alias `@/*` verified working.
- [x] **T1.7.1 (partial)** — Empty placeholder folders for `src/features/` and `src/shared/store|context|hooks|components` exist with `.gitkeep`.
- [x] **T1.2.1** — `zustand` installed.
- [x] **T1.2.2** — `@react-native-async-storage/async-storage` installed.
- [x] **T1.2.3** — `expo-audio` installed.

### Up next (immediate)

These should be tackled first to unblock Phase 2:

1. **T1.2.1–T1.2.7** — Install runtime deps: `zustand`, `@react-native-async-storage/async-storage`, `expo-audio`, `expo-haptics`, `react-native-reanimated`, `zod`, `uuid` + `react-native-get-random-values`.
2. **T1.3.1–T1.3.5** — Install dev deps and add `jest-expo` test runner.
3. **T1.4.1–T1.4.3** — Create `src/shared/constants/theme.ts` with color/spacing/radii/type tokens.
4. **T1.5.1–T1.5.4** — Expand `en.json` and `fr.json` to cover all MVP UI copy; add `i18n.d.ts` for typed `t()` keys.
5. **T1.6.1–T1.6.4** — Create `Button`, `ScreenContainer`, `SegmentedControl` shared components.
6. **T1.7.1–T1.7.3** — Stub the `src/features/game/` tree (components, hooks, lib, store, types).

### Definition of Done (Phase 1)

- `pnpm install` succeeds.
- `npx tsc --noEmit` passes.
- `pnpm test` runs (zero tests yet, but exits 0).
- App still launches with `npx expo start`.
- `app-example/` is gone.

---

## Phase 2 — Core Gameplay (⏳ Not started)

**Goal:** A playable round end-to-end. Tap Start → answer questions for 60 seconds → see final score. No polish yet.

Highlights of what will be delivered here:

- Pure-function game logic: `questionGenerator`, `difficulty`, `scoring` (with full unit tests).
- Zustand `gameStore` (transient): `gameState`, `score`, `timeRemaining`, `currentQuestion`, `streak`.
- `useGameLoop` hook driving the 1s tick.
- Wired Home / Game / Game Over screens.

**Cannot start until Phase 1 DoD is met.**

---

## Phase 3 — Feel & Polish (⏳ Not started)

**Goal:** Convert "playable" into "fun" — feedback flashes, audio, haptics, persisted high score per difficulty, language toggle, and accessibility pass.

Highlights:

- Reanimated `FlashOverlay` for green/red feedback.
- `useSound` (expo-audio) and `useHaptics` (expo-haptics) hooks gated by user prefs.
- `prefsStore` (Zustand `persist` + AsyncStorage) with Zod rehydration validation.
- High score persisted per difficulty.
- VoiceOver / TalkBack pass and WCAG AA contrast verification.

---

## Phase 4 — Release (⏳ Not started)

**Goal:** Ship Mathify v1.0.0 to the App Store and Play Store.

Highlights:

- `eas.json` with development / preview / production profiles.
- App icon, adaptive icon, splash, store screenshots (iOS + iPad + Android).
- Store listings written in EN + FR.
- Privacy policy published (no data collection).
- TestFlight + Play Internal Testing round with real kid testers.
- Production submission to both stores.

---

## Risks & Watch Items

| Risk | Mitigation |
|---|---|
| Reanimated babel plugin misconfiguration after install | Verify `babel.config.js` includes `'react-native-reanimated/plugin'` immediately after `T1.2.5`. Run a dry build before moving on. |
| `expo-audio` API differences from the deprecated `expo-av` | Read the `expo-audio` docs once before T3.2.2; budget extra time if APIs have shifted. |
| App Store kid-app review (4+ rating) is stricter on permissions and trackers | The "no data collected" posture is intentional — keep it strict; don't add analytics in MVP even under pressure. |
| Difficulty tuning may need real-kid playtesting iteration | Build the difficulty pool as data, not as hard-coded numbers, so it can be tuned without code changes during Phase 4. |

---

## How to update this file

- After completing a Phase 1 task, tick the box and update the percentage in the **Phase Overview** table.
- When a phase's Definition of Done is met, mark the phase ✅ Complete and bump the **Current phase** field at the top.
- When something changes scope or priority, log it in [CHANGELOG.md](CHANGELOG.md) under `[Unreleased]` → **Changed**.
- Keep the **Last updated** date at the top in sync with the most recent edit.
