# Changelog

All notable changes to **Mathify** will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Until v1.0.0 ships, all work lives under `[Unreleased]`. The first published release will correspond to the App Store / Play Store launch defined in [planned.md](planned.md) Phase 4.

---

## [Unreleased]

### Fixed

- **2026-05-03** — Hardened `prefsStore` against missing AsyncStorage native module. Added `src/shared/store/safeAsyncStorage.ts` — a thin adapter that catches `AsyncStorageError: Native module is null` (raised when running in a custom dev client built before the dep was added, since AsyncStorage requires native linking) and transparently falls back to an in-memory `Map`. The store still persists in any build with the native module; in builds without it the app stays usable and prints a single dev warning explaining how to enable persistence (rebuild via `expo run:ios` / `expo run:android`). All Zustand `persist` calls now route through this adapter.
- **2026-05-03** — Layout collapse on Home + Game (and partly Game Over): every screen rendered with content piled at the top of an empty navy field because the load-bearing `flex-1` Tailwind utility was emitted by Tailwind v4 as `flex: 1 1 0%`, which RN's flexbox treats differently from its native `flex: 1` (`flexGrow: 1, flexShrink: 1, flexBasis: 0`). Switched the critical containers to explicit `style={{ flex: 1 }}`: `BackgroundField`, `ScreenContainer` (both `inner` and the plain-bg fallback), `src/app/index.tsx`, `src/app/game.tsx`, `src/app/game-over.tsx`, and `AnswerButton` (which needs `flex: 1` to share row width). Inner spacing inside screens converted to inline `style` (`marginTop`, `gap`) so spacers don't depend on flex math.
- **2026-05-03** — Pinned `@react-native-async-storage/async-storage` to `2.2.0` (the SDK 54 compatible version). Previous `^3.0.2` produced `AsyncStorageError: Native module is null, cannot access legacy storage` at runtime because Expo Go / the SDK 54 dev client ships the v2 native module — running v3 JS against it crashes on every `setLanguage` / `setDifficulty` etc. that touches persisted state.
- **2026-05-03** — Centralised the AsyncStorage Jest mock in a new `jest.setup.js` referenced from `jest.config.js` (`@react-native-async-storage/async-storage/jest/async-storage-mock`). v2 throws synchronously at require-time when no native module is present, so any test touching the prefsStore chain transitively used to fail; the global mock removes the need to repeat `jest.mock(...)` boilerplate per file. `Timer.test.tsx` and `app/game.test.tsx` are now clean without local mocks.
- **2026-05-03** — Switched `LinearGradient` (from `expo-linear-gradient`) to use the `style` prop instead of `className` for layout/positioning in `BackgroundField`, `IconTile`, and the gradient-variant `Button`. Uniwind's `className → style` Babel transform doesn't reliably hit third-party components, so the gradients were rendering with zero dimensions on the Home screen and collapsing the layout.
- **2026-05-03** — Hardened the Home screen layout: wrapped scrollable content in a `ScrollView` so it survives smaller viewports, split the "Mathify." wordmark into two adjacent `Text`s with explicit per-text colors (RN's nested-Text style inheritance was unreliable for the primary-coloured period), kept the gradient PLAY NOW button outside the scroll area pinned to the bottom safe-area edge.

### Changed

- **2026-05-03** — Rewrote `src/global.css` `@theme { … }` block for the dark arcade palette (deep navy `#0B1126`, glass `rgba(255,255,255,0.04)`, primary `#5B7FFF`, accent `#A06BFF`, success `#22C55E`, danger `#EF4444`, white text, muted `#7B8294`, border `rgba(255,255,255,0.08)`). Added `--radius-xl 28px`, `--text-mega 96px`, `--text-display 64px`, `--font-display`, `--font-mega`, `--font-body` tokens (completes T3.7.2).
- **2026-05-03** — Wired display fonts in `src/app/_layout.tsx` via `useFonts({ Anton_400Regular, Inter_500Medium, Inter_700Bold, Inter_900Black_Italic })` using direct `.ttf` requires (avoids the package's `./useFonts` indirection so Metro resolves cleanly). Stack `contentStyle.backgroundColor` set to `#0B1126` so navigation transitions don't flash light (completes T3.7.3).
- **2026-05-03** — Restyled shared components for the dark theme: `Button` gained a `gradient` variant (LinearGradient blue→purple, `--radius-xl` corners, optional leading/trailing Ionicons); `SegmentedControl` gained a `pill` variant and dark-track styling; `FlashOverlay` peak opacity dropped 0.4 → 0.25 (dark bg needs less wash); `ScreenContainer` gained a `background?: 'plain' \| 'field'` prop that mounts `BackgroundField` when set (completes T3.7.7).
- **2026-05-03** — Rebuilt all three screens to the new dark/gradient/glass aesthetic: `src/app/index.tsx` (italic display wordmark, calculator IconTile, EN/FR pill, GlassCard wrapping high-score + difficulty, gradient PLAY NOW CTA), `src/app/game.tsx` (HUD-style time/score, mega numerals + OperatorBadge, 2-up glass-tile answer rows), `src/app/game-over.tsx` (trophy IconTile, conditional NEW BEST pill, "SESSION FINALIZED" rule, italic WELL DONE headline, GlassCard final-score + PTS suffix, accuracy/problems StatCard row, gradient PLAY AGAIN CTA). Repurposed `Timer` to mm:ss + clock-icon HUD, `ScoreBadge` to HUD column with star, `QuestionCard` to split-operand layout with `OperatorBadge`, `AnswerButton` to glass-tile (completes T3.7.9, T3.7.10, T3.7.11).
- **2026-05-03** — Dropped the "light theme only for v1.0.0" rule from [CLAUDE.md](CLAUDE.md) and [project-spec.md](project-spec.md). v1.0.0 will ship **dark only**; a light variant is post-ship. Triggered by user-supplied design mocks for a premium arcade dark UI. Added [planned.md](planned.md) §3.7 UI Visual Redesign tracking the rebuild as tasks **T3.7.1–T3.7.13**; updated [PROJECT_STATUS.md](PROJECT_STATUS.md) Phase 3 progress accordingly (denominator 90 → 103, Phase 3 ~94% → ~57%).
- **2026-05-03** — Wired `prefsStore` into screens. Home screen: difficulty bound to `last_difficulty` + `setDifficulty`; best score for the selected difficulty rendered under the picker; second `SegmentedControl` added for EN/FR language toggle (bound to `language` + `setLanguage`). Game Over screen: `recordScore` called on mount; `gameOver.newBest` badge rendered when the new score beats the previous high (completes T3.5.1, T3.5.2, T3.5.3, T3.5.4).
- **2026-05-02** — Migrated styling from `StyleSheet.create` + JS theme module (`src/shared/constants/theme.ts`) to **Uniwind ^1.6 + Tailwind CSS v4 ^4.2** utility classes via `className`. Tokens moved to `src/global.css` `@theme { … }` block. Added `metro.config.js` wrapping Expo default with `withUniwindConfig`; `src/app/_layout.tsx` imports `'../global.css'`; `src/uniwind.d.ts` loads `uniwind/types` for the React Native `className` augmentation; `src/uniwind-types.d.ts` (auto-generated by Metro) added to `.gitignore`. All five components migrated: `Button`, `ScreenContainer`, `SegmentedControl`, `QuestionCard`, `Timer`, `ScoreBadge`. `src/shared/constants/theme.ts` deleted. (Completes T1.8.1–T1.8.10.)

### Removed

- **2026-05-02** — Deleted leftover Expo template directory `app-example/` and removed its `.gitignore` entry (completes T1.1.1, T1.1.2).

### Added

- **2026-05-03** — Added `problemsAnswered` and `correctAnswered` counters to `gameStore` (incremented inside `answer()`, zeroed by `start()`/`reset()`). Powers the Game-Over Accuracy/Problems StatCard row. Two new unit tests verify counters track mixed correct/wrong answers and that `start()` resets them (completes T3.7.5).
- **2026-05-03** — Created shared components for the new aesthetic: `GlassCard` (rounded-xl translucent panel), `BackgroundField` (full-screen LinearGradient backdrop), `IconTile` (rounded-square gradient tile with centered Ionicon), `StatCard` (Ionicon + caption + Anton-styled value, glass-card base) under `src/shared/components/`. Created `OperatorBadge` (circular blue badge with operator Ionicon and shadow glow) under `src/features/game/components/`. All re-exported from the shared barrel (completes T3.7.6, T3.7.8 partial — `LanguagePill` deferred since `SegmentedControl` `pill` variant covers it; `StreakDots` deferred until needed).
- **2026-05-03** — Added i18n keys for the redesign in [en.json](src/shared/config/locales/en.json) + [fr.json](src/shared/config/locales/fr.json): `home.tagline`, `home.playNow`, `home.highScore`, `gameOver.wellDone`, `gameOver.sessionFinalized`, `gameOver.pts`, `gameOver.accuracy`, `gameOver.problems`, `gameOver.playAgain`. Existing `home.start`, `gameOver.replay` kept for compatibility. `languages.en` / `languages.fr` shortened to `EN` / `FR` for the pill toggle (completes T3.7.12).
- **2026-05-03** — Installed UI redesign deps: `expo-linear-gradient ~15.0.8` (gradient CTA buttons + backgrounds), `@expo-google-fonts/anton ^0.4.2` (condensed mega-digits), `@expo-google-fonts/inter ^0.4.2` (UI text + italic display weight `Inter_900Black_Italic`). Note: Anton ships only `Anton_400Regular`, so the italic display headline uses Inter Black-Italic instead of synthetic-italic Anton (completes T3.7.1).
- **2026-05-03** — Audio feedback wired up: `useSound` hook (`expo-audio`) plays correct/wrong on each answer and `tick` for the last 3 seconds of the timer; gated on `prefsStore.sound_enabled`. Placeholder SFX MP3s generated with `ffmpeg` (sine waves with fade-out) at `src/features/game/audio/` — flagged for pre-launch replacement with real assets (completes T3.2.1, T3.2.2, T3.2.3, T3.2.4).
- **2026-05-02** — Added `useHaptics` hook (`expo-haptics`): `success`/`error` notifications gated on `prefsStore.haptics_enabled`. Wired into game screen so each answer fires the matching haptic alongside the visual flash (completes T3.3.1, T3.3.2).
- **2026-05-02** — Added `FlashOverlay` (Reanimated v4): full-screen non-interactive green/red flash on correct/wrong answers (60ms in, 200ms out at 0.4 peak opacity). Mounted once at the top of the game screen. Effect re-fires across same-value `lastFeedback` updates by also depending on `currentQuestion?.id` (completes T3.1.1, T3.1.2).
- **2026-05-02** — Created persisted `prefsStore` at `src/shared/store/prefsStore.ts`: Zustand + `persist` middleware over AsyncStorage; Zod-validated rehydrate with `DEFAULT_PREFS` fallback; actions for language (also calls `i18next.changeLanguage`), difficulty, sound, haptics, and per-difficulty high-score recording (completes T3.4.1, T3.4.2, T3.4.3, T3.4.4).
- **2026-05-02** — Phase 2 routes wired: `src/app/index.tsx` (Home) replaces the template stub with i18n title, difficulty `SegmentedControl`, Start button; `src/app/game.tsx` (Game) mounts `useGameLoop` and renders the playing UI, navigates to `/game-over` on `game_over`; `src/app/game-over.tsx` (Game Over) shows final score with Replay + Home buttons; `src/app/_layout.tsx` registers all three with `headerShown: false` and `gestureEnabled: false` on the game screens. This completes Phase 2 — a full playable round end-to-end (completes T2.6.1, T2.6.2, T2.6.3, T2.6.4).
- **2026-05-02** — Game screen components verified for Phase 2: `QuestionCard`, `AnswerButton`, `Timer` (selector-subscribed to `timeRemaining`), `ScoreBadge` (selector-subscribed to `score`). Stub comments stripped from `AnswerButton` (completes T2.5.1, T2.5.2, T2.5.3, T2.5.4).
- **2026-05-02** — `useGameLoop` hook drives the 1-second timer via `setInterval` while `gameState === 'playing'`; clears on state change or unmount (completes T2.4.1).
- **2026-05-02** — Implemented `gameStore` actions: `start(difficulty)` initialises a playing session and generates the first `Question`; `answer(choice)` applies scoring via `applyAnswer` and rolls a fresh question. `tick` and `reset` already in place. Selector subscriptions verified in `Timer` / `ScoreBadge` (completes T2.3.1, T2.3.2, T2.3.3).
- **2026-05-02** — Implemented Phase 2 game logic primitives: `difficulty.ts` (operator pools + operand ranges), `questionGenerator.ts` (random arithmetic question with shuffled non-negative distractors and uuid v4 id), `scoring.ts` (pure `applyAnswer` reducer + `pointsFor` per difficulty) (completes T2.1.1, T2.1.2, T2.1.3).
- **2026-05-02** — Created `src/features/game/index.ts` re-exporting the feature's public API (completes T1.7.3).
- **2026-05-02** — Defined `Difficulty`, `Operator`, `GameState`, `Feedback`, `Question` types in `src/features/game/types/index.ts` (completes T1.7.2).
- **2026-05-02** — Stubbed entire `src/features/game/` directory tree: `components/` (QuestionCard, AnswerButton, Timer, ScoreBadge), `hooks/` (useGameLoop, useQuestionGenerator), `lib/` (difficulty, questionGenerator, scoring), `store/gameStore.ts`, `types/index.ts`, `audio/` (completes T1.7.1).
- **2026-05-02** — Created `src/shared/components/index.ts` re-exporting Button, ScreenContainer, SegmentedControl (completes T1.6.4).
- **2026-05-02** — Created `src/shared/components/SegmentedControl.tsx` — generic kid-friendly difficulty toggle with accessibility props and 56dp min-height segments (completes T1.6.3).
- **2026-05-02** — Created `src/shared/components/ScreenContainer.tsx` — SafeAreaView-wrapped container with bg color and default padding (completes T1.6.2).
- **2026-05-02** — Created `src/shared/components/Button.tsx` — theme-driven button with `primary`, `ghost`, `danger` variants; `disabled` and `loading` states; 56dp min-height; full accessibility props (completes T1.6.1).
- **2026-05-02** — Added `src/shared/config/i18n.d.ts` augmenting `react-i18next`'s `Resources` so `t(...)` keys are type-checked against `en.json` (completes T1.5.4).
- **2026-05-02** — Expanded `src/shared/config/locales/fr.json` to mirror all MVP copy keys in French (completes T1.5.2).
- **2026-05-02** — Expanded `src/shared/config/locales/en.json` with namespaces `common`, `home`, `game`, `gameOver`, `difficulty`, `languages` covering all MVP UI strings (completes T1.5.1).
- **2026-05-02** — Created `src/shared/constants/theme.ts` exporting `colors`, `spacing`, `radii`, `type` tokens and the `Theme` type; all foreground/background pairs verified WCAG AA (completes T1.4.1, T1.4.2, T1.4.3).
- **2026-05-02** — Removed `.gitkeep` placeholders from `src/shared/components/`, `src/shared/constants/`, and `src/features/` now that real files have been added (completes T1.1.3 partial).
- **2026-05-02** — `jest.config.js` present with `jest-expo` preset and `passWithNoTests: true`; `"test": "jest"` script in `package.json`; `jest-expo`, `@testing-library/react-native`, `@types/jest` all installed (completes T1.3.1–T1.3.5).
- **2026-05-02** — Installed `uuid ^14.0.0` and `react-native-get-random-values ^2.0.0` for `Question.id` UUID v4 generation (completes T1.2.7).
- **2026-05-02** — Installed `zod ^4.4.1` for runtime schema validation at persistence boundaries (completes T1.2.6).
- **2026-05-02** — `react-native-reanimated ~4.1.1` confirmed present (SDK 54 default template); Expo SDK 54 + New Architecture handles reanimated v4 automatically — no Babel plugin entry required (completes T1.2.5).
- **2026-05-02** — `expo-haptics ~15.0.8` confirmed present (SDK 54 default template); no additional install required (completes T1.2.4).
- **2026-05-02** — Installed `expo-audio ~1.1.1` (SDK 54 compatible) and registered its plugin in `app.json` (completes T1.2.3).
- **2026-05-02** — Installed `@react-native-async-storage/async-storage ^3.0.2` as a runtime dependency (completes T1.2.2).
- **2026-05-02** — Installed `zustand ^5.0.12` as a runtime dependency (completes T1.2.1).
- **2026-05-02** — `CHANGELOG.md` and `PROJECT_STATUS.md` to track project history and milestone progress.
- **2026-05-02** — Three planning documents at the repo root:
  - [project-spec.md](project-spec.md) — product overview, target audience, JTBD, feature map, user flows.
  - [architecture.md](architecture.md) — tech stack, project structure, Zustand store design, data model with Zod schema, engineering requirements.
  - [planned.md](planned.md) — 4-phase MVP roadmap with 80 line-item tasks and definitions of done.
- **2026-05-02** — Original product brief preserved in [BRAIN.md](BRAIN.md).
- **2026-05-02** — Feature-based app architecture under `src/`:
  - `src/app/` — expo-router route root (configured via `EXPO_ROUTER_APP_ROOT` in `app.config.js`).
  - `src/shared/` — cross-cutting modules: `components/`, `hooks/`, `lib/`, `constants/`, `store/`, `context/`, `config/`, `assets/`.
  - `src/features/` — feature-module placeholder.
- **2026-05-02** — Internationalization scaffolding:
  - `i18next` ^26 + `react-i18next` ^17 + `expo-localization` ^55 wired in `src/shared/config/i18n.ts`.
  - English and French locale files at `src/shared/config/locales/{en,fr}.json` (welcome / hello / language keys only — full copy pending Phase 1).
  - Device locale auto-detection with EN fallback.
- **2026-05-02** — Initial Expo project bootstrap:
  - Expo SDK ~54.0.33, React Native 0.81.5, React 19.1.0, TypeScript ~5.9.2.
  - expo-router ~6.0.23 with `typedRoutes: true`.
  - New Architecture (`newArchEnabled: true`) and React Compiler (`reactCompiler: true`) enabled.
  - TypeScript path alias `@/*` mapped to the repo root.
  - `eslint-config-expo` ~10.0.0 for linting.
  - `pnpm` as the package manager (`pnpm-workspace.yaml`, `.npmrc`).

### Notes

- The leftover `app-example/` directory from the Expo template has not yet been removed; deletion is tracked as Phase 1 task **T1.1.1** in [planned.md](planned.md).
- No state-management, animation, audio, haptics, or validation libraries are installed yet — all tracked in Phase 1 §1.2 of [planned.md](planned.md).

---

## Conventions for future entries

When adding to this changelog:

- Place new entries at the top of the relevant `[Unreleased]` subsection.
- Use one of: **Added**, **Changed**, **Deprecated**, **Removed**, **Fixed**, **Security**.
- Prefix each entry with the ISO date (`YYYY-MM-DD`).
- Link to the relevant phase task in [planned.md](planned.md) when applicable (e.g., "completes T2.1.2").
- On release, move `[Unreleased]` content under a new `## [x.y.z] — YYYY-MM-DD` heading and reset `[Unreleased]` to empty.
