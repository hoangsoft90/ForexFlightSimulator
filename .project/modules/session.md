# Module: Session State Machine

> File: `src/store/session-store.ts` + `src/app/decision.tsx`

## State Machine

```
                    ┌──────────────────────────────────────┐
                    │                                      │
                    ▼                                      │
              ┌──────────┐      ┌──────────┐      ┌──────────┐
  startSession │ DECIDING │ ──→  │ REVEAL   │ ──→  │ RESULT   │
              └──────────┘      └──────────┘      └──────────┘
                    │                  │                  │
              User taps          Timer fires         User taps
              Buy/Sell/Wait      (1.2-1.5s)          "See autopsy"
```

## Phases

### Phase 1: DECIDING

**UI:** Chart shows candles up to decisionIndex, ActionButtons visible
**Duration:** User-controlled (unlimited)
**Actions:** Buy / Sell / Wait

**On action:**
- `wait` → log decision, set refOutcome, phase → REVEAL
- `buy`/`sell` → compute outcome, log decision, phase → REVEAL

### Phase 2: REVEAL

**UI:** Chart expands to show more candles (animated), "Market is moving..." text
**Duration:** Auto-timer
- Wait: 1200ms
- Buy/Sell: 1500ms

**Chart behavior:**
- Sliding window that always includes the decision candle
- Max 15 candles visible
- Left edge slides right with revealed candles

### Phase 3: RESULT

**UI:** ResultBadge (win/loss/breakeven/skipped) + "See autopsy →" button
**Duration:** User-controlled
**Actions:** Tap "See autopsy →" → compute scores → navigate to Autopsy

## Decision Log Structure

```typescript
interface DecisionAction {
  type: 'enter' | 'sl-move' | 'exit';
  timestamp: number;
  price: number;
  detail?: string;
}
```

**In MVP (sub-level 1a):**
- Only `enter` actions logged
- No `sl-move` (fixed SL)
- No `exit` (outcome computed automatically)

## Timer Management

```typescript
const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

// Cleanup on unmount
useEffect(() => {
  return () => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
  };
}, []);
```

## Deep-Link Guard

```tsx
if (!pack) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>No scenario loaded</Text>
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={styles.linkText}>Go home</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Chart Window Logic

```typescript
const CHART_MAX = 15;

// DECIDING: show last 15 candles up to decision point
chartStart = Math.max(0, decisionIndex + 1 - CHART_MAX);
chartEnd = decisionIndex + 1;

// REVEAL/RESULT: sliding window
chartStart = Math.min(decisionIndex, Math.max(0, decisionIndex + 1 - CHART_MAX + visibleCount));
chartEnd = Math.min(chartStart + CHART_MAX, Math.min(decisionIndex + 1 + visibleCount, pack.candles.length));
```

## Session → Autopsy Data Flow

```
decision.tsx: handleContinue()
  → recompute decision with final result
  → computeAllScores(decision, pack.candles, zone)
  → findRootCause({ decision, candles, zone, scores })
  → findPositiveNote({ decision, candles, zone, scores })
  → useSessionStore.setAutopsy(scores, { decision, scores, rootCause, positiveNote })
  → router.push('/autopsy')
```

## Autopsy → Home Data Flow

```
autopsy.tsx: useEffect (on mount)
  → useTraderStore.completeSession(autopsy.scores)
    → mergeScore() for entry, risk, discipline
    → increment sessionsCompleted

autopsy.tsx: "Back to profile" tap
  → showInterstitial() [AdMob]
  → router.dismissAll() [resets stack to root]
```
