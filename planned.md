# Mathify — MVP Roadmap & Task Breakdown

> Detailed, line-item plan of every contribution required to ship the MVP.
> Companion to [project-spec.md](project-spec.md) (product) and [architecture.md](architecture.md) (technical).

This file lists **only MVP work**. Post-MVP and future items are intentionally excluded — see [project-spec.md §2.2](project-spec.md) for the broader feature map.

---

## How to read this document

- The MVP is broken into **4 phases**, each ~1 week of focused work for one developer.
- Each phase has a **goal**, an ordered **task list**, and a **definition of done (DoD)**.
- Each task is small enough to complete in under half a day. Tasks are written as concrete actions ("create file X", "add export Y"), not abstract goals.
- Phases build on each other — do not start Phase 2 work until Phase 1's DoD is met.
- When a task references a file path, that's the exact location to create/edit it.

---

## Phase 1 — Foundation (Week 1)

**Goal:** A clean project skeleton with all dependencies installed, theme tokens defined, locales scaffolded, and feature folders ready to receive code. No gameplay yet.

### 1.1 Repo cleanup

- [ ] **T1.1.1** — Delete the leftover Expo template directory `app-example/` (it is unintegrated and confuses navigation).
- [ ] **T1.1.2** — Delete `app-example/` references from `.gitignore` if any exist.
- [ ] **T1.1.3** — Remove `.gitkeep` placeholders in `src/shared/store/`, `src/shared/context/`, `src/shared/hooks/`, `src/shared/components/`, and `src/features/` once real files are added (final cleanup at end of Phase 1).
- [ ] **T1.1.4** — Confirm `tsconfig.json` path alias `@/*` works by adding a single `import` of an existing module in `src/app/index.tsx` and verifying TS does not error.

### 1.2 Install runtime dependencies

Run via `pnpm add`:

- [ ] **T1.2.1** — `zustand` (state management).
- [ ] **T1.2.2** — `@react-native-async-storage/async-storage` (persistence backend for Zustand).
- [ ] **T1.2.3** — `expo-audio` (sound effects). Use the version compatible with Expo SDK 54 — let `npx expo install` pick it.
- [ ] **T1.2.4** — `expo-haptics` (tactile feedback). Use `npx expo install`.
- [ ] **T1.2.5** — `react-native-reanimated` (animations). Use `npx expo install`. Verify the Babel plugin is configured (Expo SDK 54 with reactCompiler enabled handles this; double-check `babel.config.js` has `'react-native-reanimated/plugin'` if a custom config exists).
- [ ] **T1.2.6** — `zod` (runtime schema validation).
- [ ] **T1.2.7** — `uuid` and `react-native-get-random-values` for `Question.id` generation.

### 1.3 Install dev dependencies

- [ ] **T1.3.1** — `jest-expo` (test runner preset).
- [ ] **T1.3.2** — `@testing-library/react-native` (component tests).
- [ ] **T1.3.3** — `@types/jest` (types for test files).
- [ ] **T1.3.4** — Add a `"test"` script to `package.json`: `"test": "jest"`.
- [ ] **T1.3.5** — Add a minimal `jest.config.js` extending `jest-expo`.

### 1.4 Theme tokens

- [ ] **T1.4.1** — Create `src/shared/constants/theme.ts` exporting:
  - `colors` — `bg`, `surface`, `primary`, `success`, `danger`, `text` (`primary`, `muted`), `border`.
  - `spacing` — `xs: 4`, `sm: 8`, `md: 16`, `lg: 24`, `xl: 32`, `2xl: 48`.
  - `radii` — `sm: 8`, `md: 12`, `lg: 20`, `pill: 9999`.
  - `type` — five styles (`display`, `h1`, `h2`, `body`, `caption`) with `fontSize`, `fontWeight`, `lineHeight`.
- [ ] **T1.4.2** — Export a TypeScript `Theme` type for consumers.
- [ ] **T1.4.3** — Pick concrete color values that pass WCAG AA on the `bg` color — verify with a contrast checker.

### 1.5 i18n locale expansion

- [ ] **T1.5.1** — Expand `src/shared/config/locales/en.json` with the namespaces `common`, `home`, `game`, `gameOver`, `difficulty`. Add every string the MVP will render (Start, Replay, Score, Time, Easy, Medium, Hard, "New best!", "Game over", language names, etc.).
- [ ] **T1.5.2** — Mirror every key in `src/shared/config/locales/fr.json` with French translations.
- [ ] **T1.5.3** — Audit `src/shared/config/i18n.ts` to confirm both EN and FR resources are imported (currently only loads existing keys — extend if needed).
- [ ] **T1.5.4** — Add a TypeScript declaration so `t('home.start')` is type-checked. Create `src/shared/config/i18n.d.ts` with the `react-i18next` `Resources` augmentation pointing at `en.json`.

### 1.6 Shared component primitives

- [ ] **T1.6.1** — Create `src/shared/components/Button.tsx` — a single, theme-driven button with variants (`primary`, `ghost`, `danger`), `disabled` state, 56dp min height, accessibility props.
- [ ] **T1.6.2** — Create `src/shared/components/ScreenContainer.tsx` — a `SafeAreaView`-wrapped container that applies `bg` color and a default padding.
- [ ] **T1.6.3** — Create `src/shared/components/SegmentedControl.tsx` — a kid-friendly toggle for difficulty (Easy/Medium/Hard). Generic over option type.
- [ ] **T1.6.4** — Create `src/shared/components/index.ts` that re-exports the above.

### 1.7 Feature folder skeleton

- [ ] **T1.7.1** — Create empty files (just stub exports) for the entire `src/features/game/` tree per [architecture.md §2](architecture.md):
  - `components/{QuestionCard,AnswerButton,Timer,ScoreBadge}.tsx`
  - `hooks/{useGameLoop,useQuestionGenerator}.ts`
  - `lib/{questionGenerator,difficulty,scoring}.ts`
  - `store/gameStore.ts`
  - `types/index.ts`
- [ ] **T1.7.2** — In `types/index.ts`, define `Difficulty`, `Operator`, `GameState`, `Question` per [architecture.md §5.2](architecture.md).
- [ ] **T1.7.3** — Add `src/features/game/index.ts` re-exporting the public API.

### Phase 1 — Definition of Done

- `pnpm install` succeeds.
- `npx tsc --noEmit` passes.
- `pnpm test` runs (zero tests yet, but exits 0).
- App still launches with `npx expo start` and the boilerplate index screen renders.
- `app-example/` is gone.

---

## Phase 2 — Core Gameplay (Week 2)

**Goal:** A playable round end-to-end. No polish yet — no animations, no audio, no haptics. Just: tap Start, answer questions for 60 seconds, see your final score.

### 2.1 Pure-function game logic

- [ ] **T2.1.1** — Implement `src/features/game/lib/difficulty.ts`:
  - `operatorPool(d: Difficulty): Operator[]`
  - `operandRange(d: Difficulty): { min: number; max: number }`
- [ ] **T2.1.2** — Implement `src/features/game/lib/questionGenerator.ts`:
  - `generateQuestion(difficulty: Difficulty): Question`
  - Picks operator from pool, picks operands within range.
  - For subtraction, ensure `correct_answer >= 0` (swap operands if needed).
  - Generates 2–3 unique non-negative distractors (3 choices for Easy/Medium, 4 for Hard).
  - Distractors must not equal the correct answer or each other.
  - Shuffles the choices array before returning.
  - Generates a UUID v4 `id` (use `uuid/v4` after importing `react-native-get-random-values`).
- [ ] **T2.1.3** — Implement `src/features/game/lib/scoring.ts`:
  - `pointsFor(d: Difficulty): number` → `1` / `2` / `3`.
  - `applyAnswer(state, choice)` returns next slice (`score`, `streak`, `lastFeedback`).

### 2.2 Game logic tests

- [ ] **T2.2.1** — `questionGenerator.test.ts`: 100 random samples per difficulty, assert:
  - `correct_answer` matches the operation result.
  - `answer_choices.length` equals 3 (easy/medium) or 4 (hard).
  - `correct_answer ∈ answer_choices`.
  - `answer_choices` has no duplicates.
  - All choices are non-negative integers.
- [ ] **T2.2.2** — `difficulty.test.ts`: assert pools and ranges per spec.
- [ ] **T2.2.3** — `scoring.test.ts`: assert points per difficulty and that `applyAnswer` is pure (same input → same output, no mutation of input).

### 2.3 `gameStore` (Zustand, transient)

- [ ] **T2.3.1** — Implement `src/features/game/store/gameStore.ts` with the shape from [architecture.md §4.1](architecture.md).
- [ ] **T2.3.2** — Implement actions:
  - `start(difficulty)` — sets `gameState='playing'`, `score=0`, `timeRemaining=60`, `streak=0`, `currentQuestion=generateQuestion(difficulty)`, stores `difficulty`.
  - `answer(choice)` — calls `applyAnswer`, then replaces `currentQuestion` with a fresh one.
  - `tick()` — decrements `timeRemaining`; on reaching `0`, sets `gameState='game_over'`.
  - `reset()` — back to idle defaults.
- [ ] **T2.3.3** — Use selector-based subscriptions in components (no `useStore()` without a selector).

### 2.4 `useGameLoop` hook

- [ ] **T2.4.1** — Implement `src/features/game/hooks/useGameLoop.ts`:
  - On mount, if `gameState === 'playing'`, start a 1-second `setInterval` calling `tick()`.
  - On `gameState !== 'playing'`, clear interval.
  - On unmount, clear interval.
  - Use `useEffect` with `gameState` as the dependency.

### 2.5 Game screen components

- [ ] **T2.5.1** — `QuestionCard.tsx` — renders `${operand_left} ${operator} ${operand_right} = ?` in `display` type.
- [ ] **T2.5.2** — `AnswerButton.tsx` — wraps `Button`, takes a numeric value and an `onPress(value)`.
- [ ] **T2.5.3** — `Timer.tsx` — selector-subscribes to `timeRemaining` only, renders MM:SS or just seconds.
- [ ] **T2.5.4** — `ScoreBadge.tsx` — selector-subscribes to `score`, renders the current score.

### 2.6 Routes

- [ ] **T2.6.1** — Replace `src/app/index.tsx` with the Home screen:
  - Title (i18n `home.title`), Start button, difficulty SegmentedControl (controlled by local state for now — Phase 3 wires it to `prefsStore`).
  - Tapping Start calls `gameStore.start(difficulty)` then `router.push('/game')`.
- [ ] **T2.6.2** — Create `src/app/game.tsx`:
  - Mount `useGameLoop`.
  - Render `Timer`, `ScoreBadge`, `QuestionCard`, list of `AnswerButton`.
  - Tapping an answer calls `gameStore.answer(value)`.
  - On `gameState === 'game_over'`, `router.replace('/game-over')`.
- [ ] **T2.6.3** — Create `src/app/game-over.tsx`:
  - Read final `score` from `gameStore`.
  - Render score, **Replay** button (`gameStore.reset()` + `start()` + `router.replace('/game')`), **Home** button (`router.replace('/')`).
- [ ] **T2.6.4** — Update `src/app/_layout.tsx` to register the three screens with appropriate Stack options (header hidden, gestures disabled on game screen so kids can't accidentally swipe back).

### Phase 2 — Definition of Done

- A user can tap Start, answer at least one question, watch the timer count down, and reach the Game Over screen with the correct final score.
- Replay restarts cleanly with a fresh score and full timer.
- All unit tests pass.
- `npx tsc --noEmit` passes.

---

## Phase 3 — Feel & Polish (Week 3)

**Goal:** Convert "playable" into "fun." Add feedback flashes, audio, haptics, persisted high score, language toggle, and accessibility.

### 3.1 `FlashOverlay` (Reanimated)

- [ ] **T3.1.1** — Create `src/shared/components/FlashOverlay.tsx`:
  - Full-screen `Animated.View` with `pointerEvents="none"`.
  - Subscribes to `gameStore.lastFeedback`.
  - On change to `'correct'`: green tint flashes in (60ms) and out (200ms).
  - On change to `'wrong'`: red tint flashes in (60ms) and out (200ms).
  - Uses `useSharedValue` + `withSequence` + `withTiming` on the UI thread.
- [ ] **T3.1.2** — Mount `FlashOverlay` once at the top of `src/app/game.tsx`.

### 3.2 Audio (`expo-audio`)

- [ ] **T3.2.1** — Add SFX assets at `src/features/game/audio/`: `correct.mp3`, `wrong.mp3`, `tick.mp3` (use royalty-free SFX or generate).
- [ ] **T3.2.2** — Create `src/shared/hooks/useSound.ts`:
  - On mount, preload the three sounds (single instance per sound).
  - Returns `{ playCorrect, playWrong, playTick }`.
  - Each play function checks `prefsStore.sound_enabled` before playing.
  - Cleans up sound resources on unmount.
- [ ] **T3.2.3** — Wire `useSound` into `src/app/game.tsx`. Call `playCorrect`/`playWrong` based on `lastFeedback`.
- [ ] **T3.2.4** — In `Timer.tsx`, when `timeRemaining` enters the last 3 seconds, call `playTick` once per second.

### 3.3 Haptics (`expo-haptics`)

- [ ] **T3.3.1** — Create `src/shared/hooks/useHaptics.ts`:
  - Returns `{ success, error }`.
  - `success` uses `Haptics.NotificationFeedbackType.Success`.
  - `error` uses `Haptics.NotificationFeedbackType.Error`.
  - Both check `prefsStore.haptics_enabled` first.
- [ ] **T3.3.2** — Wire `useHaptics` into `src/app/game.tsx` — fire on each correct/wrong answer (alongside the audio call).

### 3.4 `prefsStore` (persisted)

- [ ] **T3.4.1** — Create `src/shared/store/prefsStore.ts` with the schema and defaults from [architecture.md §5.2](architecture.md).
- [ ] **T3.4.2** — Wrap the store in Zustand `persist` middleware using AsyncStorage as the storage adapter.
- [ ] **T3.4.3** — Add a custom `merge` (rehydrate) function that runs `PrefsSchema.safeParse`. On failure, return `DEFAULT_PREFS`. Log a single dev warning.
- [ ] **T3.4.4** — Implement actions: `setLanguage(lang)` (also calls `i18next.changeLanguage`), `setDifficulty(d)`, `setSoundEnabled(b)`, `setHapticsEnabled(b)`, `recordScore(d, score)` (only writes if `score > current`).

### 3.5 Wire `prefsStore` into screens

- [ ] **T3.5.1** — Home screen: replace local difficulty state with `prefsStore.last_difficulty`. SegmentedControl calls `setDifficulty`.
- [ ] **T3.5.2** — Home screen: render `prefsStore.high_score[last_difficulty]` next to the difficulty picker.
- [ ] **T3.5.3** — Home screen: add an EN/FR language toggle that calls `setLanguage`.
- [ ] **T3.5.4** — Game Over screen: on mount, call `recordScore(difficulty, score)`. If the score beat the previous best, render a "New best!" badge (i18n key `gameOver.newBest`).

### 3.6 Accessibility pass

- [ ] **T3.6.1** — Verify every interactive element has `accessibilityRole`, `accessibilityLabel`, and (where dynamic) `accessibilityHint`.
- [ ] **T3.6.2** — Verify every tap target is ≥ 56×56dp (use a measurement overlay during dev).
- [ ] **T3.6.3** — Test with iOS VoiceOver and Android TalkBack — the round must be playable purely with screen reader feedback.
- [ ] **T3.6.4** — Test with iOS Dynamic Type at largest setting — text must not clip; use `numberOfLines` and `adjustsFontSizeToFit` only where appropriate.
- [ ] **T3.6.5** — Verify color choices pass WCAG AA contrast on `success`, `danger`, `primary`, and `text.primary`.

### Phase 3 — Definition of Done

- A round looks, sounds, and feels like an arcade game.
- High score per difficulty persists across full app restarts.
- Language toggle works end-to-end (EN ↔ FR) and persists.
- Sound and haptics toggles respect user preference (test by toggling them off via a dev menu or temporary debug button).
- VoiceOver / TalkBack walkthrough completes a round successfully.
- `npx tsc --noEmit` and `pnpm test` both green.

---

## Phase 4 — Release (Week 4)

**Goal:** Ship to TestFlight + Play Internal, gather small-group feedback, then submit to public stores.

### 4.1 EAS configuration

- [ ] **T4.1.1** — Run `eas init` (if not already done) to attach the project to an EAS project ID.
- [ ] **T4.1.2** — Create `eas.json` with three profiles: `development` (dev client, internal distribution), `preview` (internal distribution, production-like build), `production` (store distribution, auto-increment build numbers).
- [ ] **T4.1.3** — Verify `app.json` has final `name`, `slug`, `ios.bundleIdentifier`, `android.package`, and version `1.0.0`.

### 4.2 Visual assets

- [ ] **T4.2.1** — Design app icon (1024×1024 source). Export to `assets/icon.png`. Verify it renders well at small sizes.
- [ ] **T4.2.2** — Design adaptive icon for Android (foreground + background). Export per Expo's adaptive icon spec.
- [ ] **T4.2.3** — Design splash screen (1284×2778 source). Configure `expo-splash-screen` plugin in `app.json`.
- [ ] **T4.2.4** — Generate App Store screenshots: iPhone 6.5", iPhone 5.5", iPad 12.9" — minimum 3 each (Home, Game in progress, Game Over).
- [ ] **T4.2.5** — Generate Play Store screenshots: phone (3 minimum) + tablet.
- [ ] **T4.2.6** — Generate Play Store feature graphic (1024×500).

### 4.3 Store metadata

- [ ] **T4.3.1** — Write App Store description (EN + FR), title, subtitle, keywords, promotional text.
- [ ] **T4.3.2** — Write Play Store short description (80 chars) and full description (4000 chars), EN + FR.
- [ ] **T4.3.3** — Set App Store age rating to **4+** (no objectionable content).
- [ ] **T4.3.4** — Set Play Store target audience to "Ages 6–12" and complete the Play Console kids-and-families questionnaire.
- [ ] **T4.3.5** — Write a privacy policy stating "no data collected, no tracking, no third-party SDKs that collect identifiers" and host it (GitHub Pages is fine for MVP).

### 4.4 Internal testing

- [ ] **T4.4.1** — Build preview profile for both platforms: `eas build --profile preview --platform ios` and `... --platform android`.
- [ ] **T4.4.2** — Submit iOS build to TestFlight; add 5–10 internal testers (parents and their kids).
- [ ] **T4.4.3** — Submit Android build to Play Internal Testing; add the same testers via Google account.
- [ ] **T4.4.4** — Run a structured 2-day testing window. Collect feedback via a simple form (5 questions max).
- [ ] **T4.4.5** — Triage feedback into "must fix before launch" vs "post-launch."
- [ ] **T4.4.6** — Fix all "must fix" items. Cut a new preview build, re-test.

### 4.5 Production submission

- [ ] **T4.5.1** — Bump version to `1.0.0` (if not already) and increment `ios.buildNumber` and `android.versionCode`.
- [ ] **T4.5.2** — Build production profile both platforms.
- [ ] **T4.5.3** — Submit to App Store: `eas submit --platform ios`. Fill out the App Store Connect submission form (export compliance: no encryption used; uses content from third parties: no).
- [ ] **T4.5.4** — Submit to Play Store: `eas submit --platform android`. Complete the Play Console release form.
- [ ] **T4.5.5** — Monitor review status. Respond promptly to any reviewer requests.
- [ ] **T4.5.6** — Once approved, release to public on both stores.

### Phase 4 — Definition of Done

- Mathify v1.0.0 is live on the App Store and Play Store.
- Privacy policy is published and linked from both store listings.
- A small group of real kids (8–12) and their parents have played the production build and the feedback is captured for the post-MVP backlog.
- The repo's `main` branch is tagged `v1.0.0`.

---

## MVP — Total Contributions Summary

| Phase | Focus | Tasks | Output |
|---|---|---|---|
| 1 | Foundation | 24 | Clean scaffold with deps installed and tokens defined |
| 2 | Core gameplay | 17 | End-to-end playable round |
| 3 | Feel & polish | 17 | Animations, audio, haptics, persistence, i18n, a11y |
| 4 | Release | 22 | Live on App Store + Play Store |
| **Total** | | **80** | **Mathify v1.0.0 shipped** |

> Each task is intentionally small. If a task feels like it needs more than half a day, split it before starting.
