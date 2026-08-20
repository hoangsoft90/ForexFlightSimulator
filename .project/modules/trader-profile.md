# Module: Trader Profile

> File: `src/store/trader-store.ts`
> Persisted via AsyncStorage (key: `"forex-flight-trader"`)

## Data Model

```typescript
interface TraderProfile {
  scores: {
    reading: ScoreTrack;    // { value: 50, count: 0 } — not updated in MVP
    entry: ScoreTrack;      // Updated when entry score applicable
    risk: ScoreTrack;       // Updated when risk score applicable
    discipline: ScoreTrack; // Updated when discipline score applicable
  };
  level: number;            // MVP: 1
  sub: string;              // MVP: "1a"
  rank: string;             // MVP: "Novice"
  sessionsCompleted: number;
}

interface ScoreTrack {
  value: number;  // 0-100, running mean
  count: number;  // number of sessions contributed
}
```

## Initial State

```typescript
const INITIAL_STATE: TraderProfile = {
  scores: {
    reading: { value: 50, count: 0 },
    entry: { value: 50, count: 0 },
    risk: { value: 50, count: 0 },
    discipline: { value: 50, count: 0 },
  },
  level: 1,
  sub: '1a',
  rank: 'Novice',
  sessionsCompleted: 0,
};
```

## Score Update Logic

When a session completes, `completeSession(scores)` is called:

```typescript
completeSession: (scores) => set((state) => ({
  scores: {
    reading: state.scores.reading, // unchanged
    entry: scores.entry.applicable
      ? mergeScore(state.scores.entry, scores.entry.score)
      : state.scores.entry,
    risk: scores.risk.applicable
      ? mergeScore(state.scores.risk, scores.risk.score)
      : state.scores.risk,
    discipline: scores.discipline.applicable
      ? mergeScore(state.scores.discipline, scores.discipline.score)
      : state.scores.discipline,
  },
  sessionsCompleted: state.sessionsCompleted + 1,
}));
```

**Running mean formula:**
```
newValue = round((prevValue × prevCount + newScore) / (prevCount + 1))
```

## Level Progression (Future)

Currently hardcoded to Level 1, sub 1a. Future levels:

| Level | Sub-levels | Unlock |
|-------|-----------|--------|
| 1 | 1a, 1b, 1c | Buy/Sell/Wait → SL/TP → Risk% |
| 2 | — | Trend, Range, Breakout reading |
| 3 | — | When to NOT trade |
| 4 | — | Personal trading plan |

## AsyncStorage Key

- **Key:** `"forex-flight-trader"`
- **Format:** JSON-serialized `TraderProfile`
- **Middleware:** `zustand/middleware/persist` with `createJSONStorage(() => AsyncStorage)`

## UI Display

Home screen shows:
- Avatar with level badge ("L1")
- Level label: "Level 1 · sub 1a"
- Rank label: "Novice"
- 4-score grid: Reading, Entry, Risk, Discipline
- Sessions completed count

Score colors (from `format.ts`):
- ≥70: green (`#16A34A`)
- ≥40: amber (`#D97706`)
- <40: red (`#DC2626`)
