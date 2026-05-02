# Mathify — Architecture

> Technical design for Mathify. Companion to [project-spec.md](project-spec.md) (product) and [planned.md](planned.md) (roadmap).

---

## 1. Tech Stack

| Layer | Technology | Role | Rationale |
|---|---|---|---|
| Frontend | Expo SDK ~54.0.33, React Native 0.81.5, React 19.1.0 | Mobile client | Already scaffolded; New Architecture and React Compiler enabled. |
| Language | TypeScript ~5.9.2 | Static typing | Already configured; non-negotiable for store/schema correctness. |
| Routing | expo-router ~6.0.23 with `typedRoutes: true` | File-based navigation | Installed; `EXPO_ROUTER_APP_ROOT=src/app` set in `app.config.js`. |
| State (transient) | Zustand | Game state machine, timer tick, current question | Tiny (<2KB), no boilerplate, selector-based subscriptions keep the timer from re-rendering everything. |
| State (persisted) | Zustand `persist` middleware + `@react-native-async-storage/async-storage` | High scores, language, difficulty, sound/haptics prefs | Standard for non-sensitive small data; survives app restarts. |
| Styling | `uniwind` ^1.6 + `tailwindcss` ^4.2 (utility classes via `className`) | Component styling | Compile-time Tailwind for React Native; tokens centralised in `src/global.css` `@theme` block. Light theme only for MVP. |
| Animation | `react-native-reanimated` (Expo-bundled) | Flash overlay, button press, transitions | Best-in-class on RN; works with the New Architecture. |
| Audio | `expo-audio` | Correct / wrong / tick sound effects | First-party Expo module, replaces the deprecated `expo-av`. |
| Haptics | `expo-haptics` | Success / error tactile feedback | First-party Expo module. |
| i18n | `i18next` ^26 + `react-i18next` ^17 + `expo-localization` ^55 | English + French | Already wired at `src/shared/config/i18n.ts`. |
| Validation | `zod` | Runtime validation of persisted store payload on rehydrate | Protects against corrupt/legacy AsyncStorage data after schema changes. |
| Testing | `jest` + `jest-expo` + `@testing-library/react-native` | Unit tests for pure logic, component tests for screens | Standard Expo combo. |
| Lint | `eslint-config-expo` ~10.0.0 | Linting | Already installed. |
| Build/Deploy | EAS Build + EAS Submit + EAS Update | CI builds, store submission, OTA JS patches | Default Expo pipeline; managed workflow keeps native config simple. |

---

## 2. Project Structure

```
Mathify/
├── app.config.js                     # Sets EXPO_ROUTER_APP_ROOT=src/app
├── app.json                          # Expo config; typedRoutes, reactCompiler, newArchEnabled
├── metro.config.js                   # Wraps Expo default with withUniwindConfig
├── package.json
├── tsconfig.json                     # Path alias @/* -> repo root
├── eslint.config.js
└── src/
    ├── global.css                    # Tailwind/Uniwind imports + @theme tokens
    ├── uniwind.d.ts                  # Loads uniwind/types for className augmentation
    ├── app/                          # expo-router routes
    │   ├── _layout.tsx               # Root Stack — imports ../global.css
    │   ├── index.tsx                 # Home screen
    │   ├── game.tsx                  # Game screen
    │   └── game-over.tsx             # Game Over screen
    ├── shared/
    │   ├── components/               # Button, ScreenContainer, FlashOverlay, SegmentedControl (className-styled)
    │   ├── hooks/                    # useHaptics, useSound, useCountdown
    │   ├── lib/                      # asyncStorage helpers, math utils, rng with seed
    │   ├── constants/                # config.ts (theme tokens live in global.css)
    │   ├── store/                    # prefsStore.ts (Zustand + persist), rootStore re-exports
    │   └── config/
    │       ├── i18n.ts               # (existing)
    │       └── locales/
    │           ├── en.json           # (existing — to be expanded)
    │           └── fr.json           # (existing — to be expanded)
    └── features/
        └── game/
            ├── components/           # QuestionCard, AnswerButton, Timer, ScoreBadge
            ├── hooks/                # useGameLoop, useQuestionGenerator
            ├── lib/                  # questionGenerator.ts, difficulty.ts, scoring.ts
            ├── store/                # gameStore.ts (Zustand, transient)
            ├── types/                # Question, Difficulty, GameState, Answer
            └── audio/                # SFX asset references (correct.mp3, wrong.mp3, tick.mp3)
```

> The leftover `app-example/` directory from the Expo template is unintegrated and will be deleted during Phase 1 implementation.

---

## 3. Styling Strategy

Styling uses **Uniwind v1 + Tailwind CSS v4**. Components apply utility classes through the `className` prop; `StyleSheet.create` is not used.

- **Token source**: `src/global.css` declares all tokens inside a `@theme { … }` block:
  - `--color-bg`, `--color-surface`, `--color-primary`, `--color-success`, `--color-danger`, `--color-text-primary`, `--color-text-muted`, `--color-border` → generates `bg-primary`, `text-text-primary`, `border-border`, etc.
  - `--spacing-{xs,sm,md,lg,xl,2xl}` (4-pt scale) → `p-md`, `gap-lg`, `m-xs`.
  - `--radius-{sm,md,lg,pill}` → `rounded-md`, `rounded-pill`.
  - `--text-{display,h1,h2,body,caption}` (with `--line-height` and `--font-weight` siblings) → `text-display`, `text-h1`, `text-body`.
- **Wiring**: `metro.config.js` wraps Expo's default config with `withUniwindConfig({ cssEntryFile: './src/global.css', dtsFile: './src/uniwind-types.d.ts' })`. `src/app/_layout.tsx` imports `'../global.css'` once at the route root. `src/uniwind.d.ts` (committed) loads `import 'uniwind/types';` so React Native props get the `className` augmentation in TS. `src/uniwind-types.d.ts` is auto-generated by Metro and gitignored.
- **Pseudo-classes**: use Tailwind prefixes (`active:`, `disabled:`, `focus:`) instead of dynamic style callbacks.
- **`ActivityIndicator`** uses `colorClassName` (Uniwind) instead of `className`.
- **Tap targets**: minimum **56×56dp** for kid-friendly UX (e.g. `min-h-[56px] min-w-[56px]`).
- **Light theme only** for MVP. A dark variant can later be added by extending the `@theme` block without touching components.
- **Responsive**: `useWindowDimensions()` for one-off layout decisions; no breakpoint system needed (single-form-factor app).

---

## 4. State Management

Two Zustand stores, deliberately split by lifetime.

### 4.1 `gameStore` (transient, in-memory)

File: `src/features/game/store/gameStore.ts`

| Field | Type | Notes |
|---|---|---|
| `gameState` | `'idle' \| 'playing' \| 'game_over'` | Drives screen transitions. |
| `score` | `number` | Resets each round. |
| `timeRemaining` | `number` | Seconds; ticks via interval in `useGameLoop`. |
| `currentQuestion` | `Question \| null` | Regenerated after each answer. |
| `streak` | `number` | Consecutive correct answers (used post-MVP for combos). |
| `lastFeedback` | `'correct' \| 'wrong' \| null` | Drives FlashOverlay. |

Actions: `start()`, `answer(choice)`, `tick()`, `reset()`.

The `<Timer/>` component subscribes via selector to `timeRemaining` only, isolating per-second re-renders from the rest of the screen.

### 4.2 `prefsStore` (persisted)

File: `src/shared/store/prefsStore.ts`

Wraps the Zustand `persist` middleware against AsyncStorage. Persisted shape validated with Zod on rehydrate; on schema mismatch, the store falls back to defaults rather than crashing.

| Field | Type | Notes |
|---|---|---|
| `language` | `'en' \| 'fr'` | Calls `i18next.changeLanguage` in `setLanguage`. |
| `last_difficulty` | `Difficulty` | Restored on Home mount. |
| `sound_enabled` | `boolean` | Default `true`. |
| `haptics_enabled` | `boolean` | Default `true`. |
| `high_score` | `Record<Difficulty, number>` | Per-difficulty bests. |

Actions: `setLanguage`, `setDifficulty`, `setSoundEnabled`, `setHapticsEnabled`, `recordScore(difficulty, score)`.

---

## 5. Data Model

### 5.1 Entity Relationship Overview

The MVP has no remote database. Three logical entities live entirely on-device:

- **`Question`** — generated on-the-fly by a pure function. Never persisted; lives only in `gameStore.currentQuestion`.
- **`GameSession`** — the in-memory `gameStore` snapshot during a round. Discarded on round end; only the final `score` is persisted (into `Prefs.high_score`).
- **`Prefs`** — persisted to AsyncStorage via Zustand `persist` middleware.

### 5.2 Schema Definitions

No SQL; all schemas are TypeScript types validated at runtime with Zod where they cross the persistence boundary.

```ts
// src/features/game/types/index.ts
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operator = '+' | '-' | '*';
export type GameState = 'idle' | 'playing' | 'game_over';

export interface Question {
  id: string;                 // uuid v4
  operand_left: number;       // 1–10 (easy) or 1–20 (medium/hard)
  operator: Operator;
  operand_right: number;
  correct_answer: number;
  answer_choices: number[];   // length 3 (easy/medium) or 4 (hard); contains correct_answer
}
```

```ts
// src/shared/store/prefsStore.ts (schema)
import { z } from 'zod';

export const PrefsSchema = z.object({
  language: z.enum(['en', 'fr']),
  last_difficulty: z.enum(['easy', 'medium', 'hard']),
  sound_enabled: z.boolean(),
  haptics_enabled: z.boolean(),
  high_score: z.object({
    easy: z.number().int().nonnegative(),
    medium: z.number().int().nonnegative(),
    hard: z.number().int().nonnegative(),
  }),
});

export type Prefs = z.infer<typeof PrefsSchema>;

export const DEFAULT_PREFS: Prefs = {
  language: 'en',
  last_difficulty: 'easy',
  sound_enabled: true,
  haptics_enabled: true,
  high_score: { easy: 0, medium: 0, hard: 0 },
};
```

> **Migration strategy**: on rehydrate, run `PrefsSchema.safeParse(stored)`. If invalid, log a single dev warning and reset to `DEFAULT_PREFS`. No multi-version migration code in the MVP — the persisted footprint is small enough that resetting is acceptable.

### 5.3 Authentication Model

**None.** Mathify is a single-user-per-device app with no accounts, no login, no PII. This is a deliberate kid-safety and time-to-ship decision. If/when a leaderboard ships post-MVP, anonymous auth (Supabase or Firebase) will be added without retroactively requiring sign-in for offline play.

---

## 6. API Design

### 6.1 API Style

**N/A for MVP** — no network surface area. The "API" of the app is its local module boundaries: pure functions in `lib/`, store actions in `store/`. Conventions:

- Pure functions take state in, return state out, never mutate.
- Store actions are thin wrappers that call pure functions and commit the result.
- No side effects (audio, haptics, navigation) inside pure functions — those happen in hooks/components.

### 6.2 Local API Surface

| Module | Function / Action | Description |
|---|---|---|
| `features/game/lib/questionGenerator.ts` | `generateQuestion(difficulty: Difficulty): Question` | Pure function returning a `Question` with non-duplicate distractors; correct answer randomized into the choices array. |
| `features/game/lib/difficulty.ts` | `operatorPool(difficulty)`, `operandRange(difficulty)` | Configures the generator. |
| `features/game/lib/scoring.ts` | `pointsFor(difficulty)`, `applyAnswer(state, choice)` | Pure reducer-style updaters. |
| `features/game/store/gameStore.ts` | `start()`, `answer(choice)`, `tick()`, `reset()` | Zustand actions. |
| `features/game/hooks/useGameLoop.ts` | `useGameLoop()` | Wires a `setInterval` to `tick()` while `gameState === 'playing'`; cleans up on unmount or state change. |
| `shared/store/prefsStore.ts` | `setLanguage`, `setDifficulty`, `setSoundEnabled`, `setHapticsEnabled`, `recordScore` | Persisted prefs actions. |
| `shared/hooks/useSound.ts` | `useSound() => { playCorrect, playWrong, playTick }` | Loads SFX once via `expo-audio`; gated by `prefsStore.sound_enabled`. |
| `shared/hooks/useHaptics.ts` | `useHaptics() => { success, error }` | Wraps `expo-haptics`; gated by `prefsStore.haptics_enabled`. |

---

## 7. Engineering Requirements

### 7.1 Performance Targets

- **Cold start** ≤ 1.5s on iPhone 12 (production build).
- **JS-thread frame budget** ≤ 16ms during gameplay (60fps target). Reanimated runs animations on the UI thread, so the JS thread is mostly idle between ticks.
- **Answer-press → feedback** ≤ 50ms end-to-end (haptic + flash + audio start).
- **App download size** ≤ 30MB.
- **Memory** ≤ 150MB resident during gameplay.

### 7.2 Security & Privacy

- **No accounts, no network calls** (MVP) — no attack surface beyond the device.
- **No PII collected**. No analytics in MVP.
- **AsyncStorage** stores only non-sensitive prefs. Not encrypted; acceptable since nothing sensitive is stored.
- **Input validation** at the persistence boundary via `PrefsSchema` (Zod). Pure functions trust their TS-typed inputs.
- **COPPA-aligned posture**: no ads, no IAP, no third-party SDKs that collect identifiers.
- **Permissions**: none required (no camera, location, microphone, contacts).

### 7.3 Internationalization

- **Library**: `i18next` + `react-i18next` + `expo-localization` (already wired at `src/shared/config/i18n.ts`).
- **Languages**: English (`en`), French (`fr`). Device locale auto-detected on first run via `Localization.getLocales()`, falls back to `en`.
- **Translation files**: `src/shared/config/locales/{en,fr}.json`. Keys grouped by screen:
  - `common.*` — buttons, generic copy.
  - `home.*` — Home screen.
  - `game.*` — Game screen (timer label, score label).
  - `gameOver.*` — Game Over screen.
  - `difficulty.{easy,medium,hard}` — difficulty labels.
- **Number formatting**: any text-rendered numeric uses `Intl.NumberFormat(language)` (high score, final score). Question operands rendered as plain digits (universally readable).

### 7.4 Deployment & Infrastructure

- **Build pipeline**: EAS Build (managed workflow).
- **Environments**:
  - **Dev** — Expo Go or dev client; `EXPO_PUBLIC_*` env vars from `.env.development`.
  - **Preview** — internal TestFlight (iOS) + Play Internal Testing (Android); built via `eas build --profile preview`.
  - **Production** — App Store + Play Store; built via `eas build --profile production` and submitted via `eas submit`.
- **OTA updates**: EAS Update for JS-only patches without resubmitting binaries.
- **No backend infra** in MVP — no servers, no DB, no DNS, no secrets management.
- **Source control**: GitHub (already initialized); `main` is the deploy branch.

### 7.5 Third-Party Integrations

| Service | Purpose | Provider |
|---|---|---|
| EAS Build / EAS Submit / EAS Update | CI builds, store submission, OTA JS updates | Expo |
| App Store Connect | iOS distribution | Apple |
| Google Play Console | Android distribution | Google |
| Sentry (post-MVP) | Crash reporting and performance monitoring | Sentry |

> No analytics, advertising, or auth providers in the MVP. This is a deliberate constraint, not an oversight.
