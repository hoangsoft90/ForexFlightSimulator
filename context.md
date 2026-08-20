# Context — Forex Flight Simulator

> Static project overview. Update only when major changes occur.

## What This App Does

Trading decision training simulator — users practice BUY/SELL/WAIT on real XAUUSD candlestick data, receive rule-based behavioral analysis (Autopsy), and improve their Trader Score over time.

**Not** a "learn Forex" course. **Not** connected to real brokers. **Not** gamified with PnL leaderboards.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo SDK 57 |
| UI | React Native 0.86.2 |
| Language | TypeScript ~6.0.3 |
| Navigation | expo-router ~57.0.14 |
| State | Zustand ^5.0.0 |
| Persistence | AsyncStorage 2.2.0 |
| Icons | @tabler/icons-react-native ^3.46.0 |
| Charts | Custom SVG (react-native-svg 15.15.4) |
| Animations | react-native-reanimated 4.5.1 |
| Ads | react-native-google-mobile-ads ^16.5.0 |
| Android | targetSdk 36, compileSdk 36, minSdk 24 |
| Package | com.forexflightsimulator.app |
| Repo | github.com/hoangsoft90/ForexFlightSimulator |

## Key Architecture Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| State management | Zustand | Minimal boilerplate, built-in persist, ~1KB |
| Routing | expo-router | File-based, less config, Expo ecosystem |
| Charts | Custom SVG | wagmi-charts incompatible with Reanimated 4 (SDK 57) |
| Ads platform guard | Platform.select | Metro resolves require() inside if-blocks |
| Build CI | Gradle direct | No EAS token needed, simpler for debug builds |
| Ad mode | Test ads by default | Avoid policy violations during development |

## Project Structure

See `.project/architecture.md` for full breakdown.

```
src/
├── app/           # 3 screens (index, decision, autopsy)
├── components/    # 6 reusable components
├── lib/           # Pure logic modules (scoring, root-causes, outcome, format)
├── store/         # 2 Zustand stores (session + trader)
├── data/          # 1 Scenario Pack (XAUUSD M15)
├── constants/     # Design tokens
└── config.ts      # AdMob config
```

## MVP Scope (Completed)

- Home / Trader Profile
- Decision UI (sub-level 1a: Buy/Sell/Wait)
- Trade Autopsy (root cause + positive note)
- Scoring engine (6 components)
- Custom SVG candlestick chart
- AsyncStorage persistence
- AdMob (test ads)
- Android targetSdk 36
- GitHub Actions CI/CD
- App icons

## What's NOT Built Yet

- Sub-levels 1b/1c (SL/TP, Risk% inputs)
- Decision Contract screen
- Scenario select / Level map
- Mistake Library
- Onboarding
- More scenario packs
- Backend sync
- Unit tests
- Push notifications

## External References

- Product plan: `plan1_final.md`
- Design spec: `design.md`
- Knowledge base: `.project/README.md`
- GitHub Actions: `.github/workflows/build-debug-apk.yml`
