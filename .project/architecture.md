# Architecture — Code Structure & Data Flow

## Cấu trúc thư mục

```
src/
├── app/                    # Expo Router screens (file-based routing)
│   ├── _layout.tsx         # Root layout: SafeAreaProvider, Stack, AdMob init
│   ├── index.tsx           # Home / Trader Profile (entry point)
│   ├── decision.tsx        # Decision UI (Scenario Player)
│   └── autopsy.tsx         # Trade Autopsy
│
├── components/             # Reusable UI components (stateless)
│   ├── action-buttons.tsx  # Buy/Sell/Wait button group
│   ├── ad-banner.tsx       # AdMob BannerAd wrapper (native only)
│   ├── candle-chart.tsx    # Custom SVG candlestick chart
│   ├── insight-block.tsx   # Root cause / positive note block
│   ├── result-badge.tsx    # Win/Loss/Breakeven badge
│   └── score-chip.tsx      # Score display (icon + label + value)
│
├── config.ts               # App config (AdMob test_ads flag + ad unit IDs)
│
├── constants/
│   └── theme.ts            # Design tokens: colors, spacing, radius, font
│
├── data/
│   └── packs.ts            # Scenario Pack data + ExtendedReferenceZone type
│
├── lib/                    # Pure logic modules (no React dependencies)
│   ├── ads.ts              # AdMob init, preload, show (platform-guarded)
│   ├── format.ts           # Formatting helpers (price, pips, time, score color)
│   ├── outcome.ts          # Trade outcome simulation (win/loss/breakeven)
│   ├── rootCauses.ts       # Root-cause rule table (error + positive rules)
│   ├── scoring.ts          # Scoring engine (6 components)
│   └── types.ts            # TypeScript type definitions
│
└── store/                  # Zustand stores
    ├── session-store.ts    # Current session state (ephemeral)
    └── trader-store.ts     # Trader profile + scores (persisted)
```

## Module Dependency Graph

```
types.ts ─────────────────────────────────────────────┐
    │                                                  │
    ├── outcome.ts (Candle, ActionType, ReferenceZone) │
    │                                                  │
    ├── scoring.ts (Candle, SessionDecision, etc.)     │
    │   └── uses ExtendedReferenceZone from packs.ts   │
    │                                                  │
    ├── rootCauses.ts (Candle, SessionDecision, etc.)  │
    │   └── uses ExtendedReferenceZone from packs.ts   │
    │                                                  │
    ├── format.ts (no type deps)                       │
    │                                                  │
    └── packs.ts (ScenarioPack, Candle from types.ts)  │
        └── exports ExtendedReferenceZone              │
                                                      │
session-store.ts ──────────────────────────────────────┘
    ├── uses: ScenarioPack, SessionDecision, ComponentScores, AutopsyResult
    └── consumed by: decision.tsx, autopsy.tsx, index.tsx

trader-store.ts
    ├── uses: TraderProfile, ScoreTrack, ComponentScores
    ├── persists via: AsyncStorage (key: "forex-flight-trader")
    └── consumed by: index.tsx, autopsy.tsx

ads.ts
    ├── uses: config.ts
    ├── platform-guarded: Platform.select (native vs web)
    └── consumed by: _layout.tsx, autopsy.tsx, ad-banner.tsx
```

## Data Flow

### Flow 1: Starting a Session
```
User taps "Today's session"
  → index.tsx: handleStartSession()
    → useSessionStore.startSession(PACKS[0])
    → router.push('/decision')
```

### Flow 2: Making a Decision
```
User taps Buy/Sell/Wait
  → decision.tsx: handleAction(selectedAction)
    → computeOutcome(candles, entryIndex, action, zone)
    → useSessionStore.setDecision(decision)
    → Phase: deciding → reveal (chart animates)
    → Phase: reveal → result (outcome displayed)
```

### Flow 3: Viewing Autopsy
```
User taps "See autopsy →"
  → decision.tsx: handleContinue()
    → computeAllScores(decision, candles, zone)
    → findRootCause({ decision, candles, zone, scores })
    → findPositiveNote({ decision, candles, zone, scores })
    → useSessionStore.setAutopsy(scores, autopsy)
    → router.push('/autopsy')
```

### Flow 4: Returning to Home
```
User taps "Back to profile"
  → autopsy.tsx: showInterstitial() → router.dismissAll()
    → useEffect fires: useTraderStore.completeSession(autopsy.scores)
      → merges new scores into running mean
      → increments sessionsCompleted
    → Home screen re-renders with updated scores
```

## File Responsibilities

| File | Responsibility | State | Side Effects |
|------|---------------|-------|--------------|
| `types.ts` | Type definitions only | None | None |
| `outcome.ts` | Trade outcome simulation | None (pure function) | None |
| `scoring.ts` | Score computation | None (pure function) | None |
| `rootCauses.ts` | Root cause + positive note | None (pure function) | None |
| `format.ts` | Display formatting | None (pure function) | None |
| `packs.ts` | Static data + type export | None (const) | None |
| `config.ts` | Static config | None (const) | None |
| `ads.ts` | AdMob lifecycle | Singleton state | Native ad loading |
| `session-store.ts` | Current session | Zustand (in-memory) | None |
| `trader-store.ts` | Persistent profile | Zustand + AsyncStorage | AsyncStorage writes |
| `_layout.tsx` | Root layout | React state | AdMob init on mount |
| `index.tsx` | Home screen | Zustand reads | None |
| `decision.tsx` | Decision screen | Local state + Zustand | setTimeout for reveal |
| `autopsy.tsx` | Autopsy screen | Zustand reads | CompleteSession on mount, interstitial |
