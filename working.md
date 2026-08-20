# Working — Current Status & Recent Work

> Living document — update after each session. Delete items older than 2 weeks.

## Current Status

**Phase:** MVP Complete, ready for V1 features
**Last session:** 2026-08-19
**TypeScript:** 0 errors
**App runs:** Full loop works (Home → Decision → Autopsy → Home)

## What's Done

- [2026-08-19] Scaffold Expo SDK 57 + TypeScript + expo-router
- [2026-08-19] Data model: types, ScenarioPack (XAUUSD M15 80 candles)
- [2026-08-19] Scoring engine: 6 components (Entry/Risk/RR/FOMO/Patience/Discipline)
- [2026-08-19] Root-cause rules: 5 error + 5 positive + fallbacks
- [2026-08-19] Trade outcome simulation (win/loss/breakeven)
- [2026-08-19] Custom SVG candlestick chart (replaced wagmi-charts)
- [2026-08-19] Zustand stores: session (ephemeral) + trader (persisted)
- [2026-08-19] Home screen: avatar, 4-score grid, CTA
- [2026-08-19] Decision UI: chart, Buy/Sell/Wait, reveal, result
- [2026-08-19] Trade Autopsy: badge → timeline → root cause → positive note
- [2026-08-19] Full loop wiring with score persistence
- [2026-08-19] Code review: 4 bugs found and fixed
- [2026-08-19] Navigation fixes: stack buildup, deep-link guards, Android back
- [2026-08-19] AdMob integration: banner (Home) + interstitial (Autopsy)
- [2026-08-19] Web build: 0 errors, 0 warnings (Platform.select exclusion)
- [2026-08-19] Safe area handling: paddingTop + paddingBottom for Android nav
- [2026-08-19] Android targetSdkVersion 36 (Google Play requirement)
- [2026-08-19] App icons generated (adaptive icon + splash + favicon)
- [2026-08-19] GitHub Actions workflow: debug APK via Gradle
- [2026-08-19] Code pushed to GitHub main branch
- [2026-08-19] Knowledge base created in `.project/` (13 files, 1585 lines)
- [2026-08-19] Memory files created (CLAUDE.md, context.md, working.md, operating_rules.md)

## What's Next

- [ ] Sub-level 1b: unlock SL/TP input fields
- [ ] Sub-level 1c: unlock Risk% + Position Sizing
- [ ] Decision Contract screen
- [ ] More scenario packs (10-20)
- [ ] Unit tests for scoring + root-cause
- [ ] Onboarding flow

## Known Issues

- `rootCauses.ts`: redundant `as ExtendedReferenceZone` casts (harmless)
- `candle-chart.tsx`: unused `zone` prop (deferred feature)
- AdMob native module refs typed as `any` (library limitation)

## Active Decisions

- **Test ads ON** — `src/config.ts` → `testAds: true`
- **No EAS** — Gradle direct build via GitHub Actions
- **Custom SVG chart** — no chart library dependency
- **Zustand persist** — AsyncStorage key `"forex-flight-trader"`

## Files Modified This Session

```
NEW:  .github/workflows/build-debug-apk.yml
NEW:  src/app/_layout.tsx, index.tsx, decision.tsx, autopsy.tsx
NEW:  src/components/action-buttons.tsx, ad-banner.tsx, candle-chart.tsx
NEW:  src/components/insight-block.tsx, result-badge.tsx, score-chip.tsx
NEW:  src/config.ts, src/constants/theme.ts, src/data/packs.ts
NEW:  src/lib/ads.ts, format.ts, outcome.ts, rootCauses.ts, scoring.ts, types.ts
NEW:  src/store/session-store.ts, trader-store.ts
NEW:  scripts/generate-icons.mjs
NEW:  .project/ (13 knowledge base files)
NEW:  CLAUDE.md, context.md, working.md, operating_rules.md
EDIT: app.json, package.json, tsconfig.json, .gitignore
```
