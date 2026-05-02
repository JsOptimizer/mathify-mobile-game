# Mathify — Project Specification

> A fast-paced, arcade-style mental-math game for kids 8–12, built with Expo and React Native.

> **Companion documents**
> - [architecture.md](architecture.md) — tech stack, project structure, data model, engineering requirements
> - [planned.md](planned.md) — detailed MVP roadmap and task breakdown

---

## 1. Project Overview

### 1.1 Problem Statement

Kids aged 8–12 need engaging, low-friction practice for mental arithmetic, but most options on the market either feel like homework (worksheet-style apps) or bury the practice inside heavy "edutainment" platforms that demand long sessions and account setup. Parents want something safe, screen-time-friendly, and free of ads or in-app purchases. Mathify is a single-mechanic arcade game: solve as many math problems as possible before the timer runs out. Practice feels like play, sessions are short, and there's no signup or paywall.

### 1.2 Purpose & Vision

Mathify's MVP delivers one polished, addictive core loop — answer math questions under time pressure — with the smallest possible scope to ship a quality experience. Beyond the MVP, the product can grow into themed packs (multiplication tables, fractions), daily challenges, online leaderboards, and a parent-facing progress view, while preserving the arcade feel and kid-safe posture.

### 1.3 Target Audience

| Persona | Description | Primary Need |
|---|---|---|
| **"Mia, 10"** (primary) | Solo player on a parent's phone or her own tablet; short, frequent sessions between activities. | Quick, fun, satisfying mental-math practice without homework vibes. |
| **"Adult casual"** (secondary) | Brain-warmup player on a commute or break. | A 60-second mental tune-up with a high-score chase. |
| **"Parent"** (tertiary, gatekeeper) | Approves what their child installs. | Kid-safe (no ads, no IAP, no PII collection, no sign-in). |

### 1.4 Success Metrics

- **D1 retention** ≥ 35% (kid-app benchmark for casual arcade).
- **Median session length** ≥ 3 rounds played.
- **Round-completion rate** ≥ 70% (player reaches game-over screen rather than abandoning mid-round).
- **Crash-free sessions** ≥ 99.5% (Sentry, post-MVP).

---

## 2. Product Requirements

### 2.1 Jobs to Be Done

- **Start a quick round**: When I open the app with one minute to kill, I want to tap once and start playing so that I'm in the action immediately.
- **Get instant feedback on each answer**: When I tap an answer, I want immediate visual + tactile confirmation so that I know whether I was right without breaking flow.
- **Beat my high score**: When I finish a round, I want to see whether I beat my personal best so that I have a reason to play again.
- **Pick a difficulty that matches me**: When I'm new (or want a challenge), I want to choose Easy / Medium / Hard so that the questions match my skill.
- **Replay instantly**: When the round ends, I want to start a new round in one tap so that the loop stays tight.

### 2.2 Feature Map

#### MVP (Must Have)

- **Home screen** with Start button, difficulty picker, language toggle (EN/FR), and current high score per difficulty.
- **Game screen** showing question, 3–4 answer choices, countdown timer, and live score.
- **Game Over screen** with final score, "new high score" badge if applicable, and Replay / Home buttons.
- **Question generator** with three difficulties:
  - Easy: addition only, operands 1–10.
  - Medium: addition and subtraction, operands 1–20 (no negative results).
  - Hard: addition, subtraction, multiplication, operands 1–20.
- **Answer system**: 1 correct + 2–3 unique non-negative distractors, randomized order.
- **60-second countdown timer** with end-of-game state transition.
- **Scoring**: +1 per correct (Easy), +2 (Medium), +3 (Hard); no penalty in MVP.
- **Visual feedback**: green flash on correct, red flash on incorrect (Reanimated overlay).
- **Sound effects**: correct, wrong, last-3-seconds tick (expo-audio).
- **Haptics**: success / error patterns (expo-haptics).
- **Persisted local high score** per difficulty (AsyncStorage via Zustand persist middleware).
- **i18n** (English, French) for all UI copy.

#### Post-MVP (Should Have)

- In-round difficulty auto-scaling (questions get harder as score climbs).
- Streak bonuses and combo multipliers.
- Daily challenge (deterministic seed per day).
- Light/dark theme variants and visual themes (e.g., space, jungle).
- Sentry crash reporting.

#### Future (Nice to Have)

- Online leaderboard (would re-introduce the backend question — likely Supabase).
- Account-based score sync across devices.
- Parent dashboard (progress over time, weakest operations).
- More operations: division, fractions, exponents.
- Per-kid profiles on a shared device.

### 2.3 User Flows

**Flow: First Run**
1. User launches app for the first time.
2. App detects device locale via `expo-localization`; defaults to EN if neither EN nor FR.
3. Home screen renders with difficulty defaulting to Easy and high score `0` for all difficulties.
4. User taps **Start**.

**Flow: Play a Round**
1. User taps **Start** on Home.
2. Navigate to `/game`. `gameStore.start()` is dispatched: `gameState = 'playing'`, `score = 0`, `timeRemaining = 60`, first `Question` generated.
3. Timer ticks once per second.
4. User taps an answer:
   - Correct → green flash, success haptic, success SFX, score updated, next question generated.
   - Incorrect → red flash, error haptic, error SFX, next question generated (no time penalty in MVP).
5. When `timeRemaining` hits `0`, `gameState = 'game_over'` and the app navigates to `/game-over`.

**Flow: Game Over → Replay**
1. Game Over screen shows final score, high-score comparison, "new best!" badge if applicable.
2. `prefsStore.recordScore(difficulty, score)` updates the persisted high score if beaten.
3. User taps **Replay** → `gameStore.reset()` then `start()` → back to `/game`.
4. Or **Home** → `/`.

**Flow: Change Difficulty**
1. User taps difficulty segmented control on Home.
2. `prefsStore.setDifficulty(d)` persists the choice.
3. Home re-renders with the high score for the selected difficulty.

**Flow: Change Language**
1. User taps the EN/FR toggle on Home.
2. `prefsStore.setLanguage(lang)` persists; `i18next.changeLanguage(lang)` is called.
3. All screens re-render in the new language.

---

## 3. Where to Find the Rest

| Topic | Document |
|---|---|
| Tech stack, project structure, state management, data model, API surface, performance/security/i18n/deployment | [architecture.md](architecture.md) |
| Detailed MVP milestones, phase-by-phase task breakdown, definition-of-done | [planned.md](planned.md) |
| Original product brief (raw notes) | [BRAIN.md](BRAIN.md) |
