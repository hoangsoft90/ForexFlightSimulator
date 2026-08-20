# Progress Tracker — OpenSpec

> Last updated: 2026-08-19

## Completed ✅

### MVP Core (Session 1)
- [x] Expo SDK 57 + TypeScript scaffold
- [x] Data model: `types.ts` (Candle, ScenarioPack, ReferenceZone, SessionDecision, etc.)
- [x] Scenario Pack: XAUUSD M15, 80 candles, pullback-support setup
- [x] Scoring engine: 6 components (Entry, Risk, RR, FOMO, Patience, Discipline)
- [x] Root-cause rules: 5 error rules + 5 positive rules + fallbacks
- [x] Trade outcome simulation: win/loss/breakeven with SL/TP walk-forward
- [x] Custom SVG candlestick chart (replaced wagmi-charts for SDK 57 compat)
- [x] Zustand stores: session-store (ephemeral) + trader-store (persisted)
- [x] Home screen: avatar, 4-score grid, CTA
- [x] Decision UI: chart, Buy/Sell/Wait, reveal animation, result display
- [x] Trade Autopsy: result badge → timeline → root cause → positive note
- [x] Full loop wiring: Home → Decision → Autopsy → Home with score update
- [x] TypeScript: 0 errors

### Bug Fixes (Session 1)
- [x] `missed-setup` root cause wrong message when refOutcome=loss
- [x] Fallback positive note mentions risk% for wait decisions
- [x] Breakeven shows non-zero pips (e.g. "+3 pips" instead of "0")
- [x] Chart visual jump between deciding→reveal phases
- [x] Unused SVG imports cleaned up
- [x] `fomoScore` division by zero when `decisionIndex === 0`
- [x] `rootCauses` describe crash on `candles[-1]` when `strongIdx === -1`
- [x] Loose type `result: any` → `TradeResult` in decision.tsx
- [x] Unused imports cleaned up

### Navigation & UX (Session 2)
- [x] Stack buildup fix: `router.dismissAll()` from Autopsy
- [x] Decision back button: `router.replace('/')` for deep-link safety
- [x] Android hardware back handler on Autopsy
- [x] Timer cleanup on unmount (prevent setState on unmounted)
- [x] Deep-link guards for `/decision` and `/autopsy`

### AdMob Integration (Session 2)
- [x] Config file: `src/config.ts` with `testAds: true` flag
- [x] Platform-guarded ads module: `src/lib/ads.ts`
- [x] BannerAd component: `src/components/ad-banner.tsx`
- [x] Banner on Home screen
- [x] Interstitial after Autopsy
- [x] AdMob init on app mount
- [x] Web build: 0 errors, 0 warnings (Platform.select exclusion)

### Platform & Build (Session 3)
- [x] Android targetSdkVersion 36 (Google Play requirement)
- [x] Android SDK Platform 36 installed locally
- [x] `expo-build-properties` plugin configured
- [x] App icons generated (adaptive icon + favicon + splash)
- [x] GitHub Actions workflow: `.github/workflows/build-debug-apk.yml`
- [x] Code pushed to GitHub: `hoangsoft90/ForexFlightSimulator`
- [x] Debug APK build triggered on push to main

### Safe Area (Session 3)
- [x] `SafeAreaProvider` at root layout
- [x] `paddingTop: insets.top` on all screens
- [x] `paddingBottom: insets.bottom + spacing.xl` on all screens
- [x] AdBanner safe on Android nav bar

## Known Bugs 🐛

### Minor / Cosmetic
- [ ] `rootCauses.ts`: redundant `as ExtendedReferenceZone` casts (harmless, same type now)
- [ ] `candle-chart.tsx`: unused `zone` prop in interface (deferred feature)

## TODO 📋

### Next Priority (V1)
- [ ] Sub-level 1b: unlock SL/TP input fields after Buy/Sell
- [ ] Sub-level 1c: unlock Risk% + Position Sizing
- [ ] Decision Contract screen (pre-session declaration)
- [ ] Scenario select / Level map screen
- [ ] Mistake Library / Top 3 recurring errors
- [ ] Onboarding / Pre-flight for first-time users
- [ ] More scenario packs (10-20 packs across different pairs/timeframes)
- [ ] Real data ingestion from HistData/Dukascopy
- [ ] Slippage & Spread Simulator
- [ ] Weekly Market Recap
- [ ] Backend sync (server-side persistence)
- [ ] Push notifications (daily reminders)
- [ ] Unit tests for scoring + root-cause modules
- [ ] Level progression system
- [ ] "How we score you" transparency screen

### Technical Debt
- [ ] `ads.ts`: AdMob native module references typed as `any` (library doesn't export types cleanly)
- [ ] `autopsy.tsx`: `completeSession` called in `useEffect` — should be more explicit trigger
- [ ] No error boundary — app crashes on unhandled errors
- [ ] No loading states — screens render instantly (fine for local data, needs work for network)

## Design Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-08-19 | Replaced wagmi-charts with custom SVG | `getDomain` circular import crash on Reanimated 4 (SDK 57) |
| 2026-08-19 | Used Zustand over Redux/MobX | Minimal boilerplate, built-in persist, ~1KB bundle |
| 2026-08-19 | expo-router over React Navigation | File-based routing, less config, Expo ecosystem |
| 2026-08-19 | Platform.select for AdMob web safety | Metro resolves `require()` inside if-blocks — must use `select` |
| 2026-08-19 | `router.dismissAll()` from Autopsy | Prevents stack buildup (Decision → Autopsy → Home → Decision → ...) |
| 2026-08-19 | Test ads by default | Avoid AdMob policy violations during development |
| 2026-08-19 | Gradle direct build (no EAS) | No EAS token needed, simpler CI/CD for debug builds |
