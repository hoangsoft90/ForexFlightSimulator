# CLAUDE.md — Forex Flight Simulator

> This file is the primary entry point for AI agents working on this project.
> Read this FIRST, then follow links to deeper docs as needed.

## Quick Start

```bash
npx expo start          # Dev server
npx tsc --noEmit        # Typecheck
npx expo export --platform web  # Verify bundle
```

## Project Summary

**Forex Flight Simulator** — trading decision training simulator. Users practice BUY/SELL/WAIT on real candlestick data, receive behavioral analysis (Autopsy), and progress through levels. NOT a "learn Forex" course app.

| Item | Value |
|------|-------|
| Stack | Expo SDK 57 + React Native 0.86 + TypeScript |
| State | Zustand + AsyncStorage |
| Navigation | expo-router (file-based, 3 screens) |
| Ads | AdMob (test mode, banner + interstitial) |
| CI/CD | GitHub Actions → debug APK via Gradle |
| Android | targetSdk 36, compileSdk 36, minSdk 24 |
| Package | `com.forexflightsimulator.app` |

## Architecture

```
src/
├── app/           # 3 screens: index (Home), decision, autopsy
├── components/    # 6 reusable components (stateless)
├── lib/           # Pure logic: scoring, root-causes, outcome, format
├── store/         # 2 Zustand stores: session (ephemeral), trader (persisted)
├── data/          # Scenario Packs (static JSON)
├── constants/     # Design tokens (theme.ts)
└── config.ts      # AdMob config (testAds flag)
```

**Key rule:** ALL business logic lives in `src/lib/` as pure functions. No logic in components.

## Core Loop

```
Home → tap session → Decision UI (Buy/Sell/Wait) → Reveal → Result → Autopsy → Home (scores updated)
```

## Common Tasks

### Add a new screen
1. Create `src/app/new-screen.tsx`
2. Add `<Stack.Screen name="new-screen" />` in `_layout.tsx`
3. Use `SafeAreaProvider` insets for padding

### Add a scoring component
1. Add type to `ScoreComponent` in `src/lib/types.ts`
2. Implement pure function in `src/lib/scoring.ts`
3. Add to `computeAllScores` return
4. Update `trader-store.ts` if it should persist

### Add a root cause rule
1. Add to `ERROR_RULES` array in `src/lib/rootCauses.ts`
2. Implement `applies(ctx)` and `describe(ctx)`
3. Priority = array order (first match wins)

### Add a scenario pack
1. Add to `src/data/packs.ts`
2. Define 50-100 candles + referenceZone
3. Add to `PACKS` array

### Build debug APK
```bash
git push origin main  # Workflow auto-triggers
# Check: https://github.com/hoangsoft90/ForexFlightSimulator/actions
```

## Design Principles

- **Flat, minimal** — no gradients, no decorative shadows
- **Semantic color** — green=good, red=loss, amber=root cause, blue=neutral
- **Autopsy always has ≥1 green block** — retention principle
- **Score by decision quality, NOT by PnL**

## Detailed Docs

For deeper context, read `.project/README.md` which links to:
- `.project/overview.md` — full product overview
- `.project/architecture.md` — code structure & data flow
- `.project/state-routing.md` — Zustand + expo-router details
- `.project/modules/` — scoring, root-causes, scenario packs, etc.
- `.project/design-system.md` — colors, spacing, typography
- `.project/patterns.md` — code conventions
- `.project/openspec.md` — progress tracker & TODO

## Build & Deploy

- **GitHub Actions:** `.github/workflows/build-debug-apk.yml`
- **Push to `main`** → auto-triggers debug APK build
- **Token:** stored in `.agents/skills/build-debug-apk/config.json` (gitignored)
- **No EAS needed** — Gradle direct build

## Don't

- Don't put business logic in components
- Don't use inline styles (use theme tokens)
- Don't use `any` type (except AdMob native refs)
- Don't hardcode colors (use `colors.*`)
- Don't commit `.agents/` (contains tokens)
