# Changelog

All notable changes to **Mathify** will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> Until v1.0.0 ships, all work lives under `[Unreleased]`. The first published release will correspond to the App Store / Play Store launch defined in [planned.md](planned.md) Phase 4.

---

## [Unreleased]

### Removed

- **2026-05-02** — Deleted leftover Expo template directory `app-example/` and removed its `.gitignore` entry (completes T1.1.1, T1.1.2).

### Added

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
