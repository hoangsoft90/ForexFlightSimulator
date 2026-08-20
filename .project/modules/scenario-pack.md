# Module: Scenario Pack

> File: `src/data/packs.ts` + `src/lib/types.ts`

## Data Model

```typescript
interface ScenarioPack {
  id: string;              // e.g. 'xauusd-m15-pullback-001'
  symbol: string;          // e.g. 'XAUUSD'
  timeframe: string;       // e.g. 'M15'
  candles: Candle[];       // 50-100 entries
  referenceZone: ReferenceZone;
  contextPrompt: string;   // 1-line, ≤20 words
  decisionIndex: number;   // candle index where user decides
}

interface Candle {
  timestamp: number;       // epoch ms
  open: number;
  high: number;
  low: number;
  close: number;
}

interface ReferenceZone {
  entryLow: number;        // entry zone lower bound
  entryHigh: number;       // entry zone upper bound
  sl: number;              // reference SL price
  tp: number;              // reference TP price
  minRR: number;           // minimum risk/reward ratio
  direction: 'buy' | 'sell';
  setupType: string;       // e.g. 'pullback-support', 'breakout'
  fixedRiskPct: number;    // risk % per trade (fixed in sub-level 1a)
}
```

## Current Pack: XAUUSD Pullback

| Property | Value |
|----------|-------|
| ID | `xauusd-m15-pullback-001` |
| Symbol | XAUUSD (Gold) |
| Timeframe | M15 (15-minute) |
| Candles | 80 entries |
| Decision Index | 54 (out of 80) |
| Direction | BUY |
| Entry Zone | 2380.0 – 2384.0 |
| SL | 2376.0 |
| TP | 2396.0 |
| Min RR | 2.0 |
| Fixed Risk | 1.0% |
| Setup Type | pullback-support |

### Candle Phases

| Phase | Candles | Price Range | Description |
|-------|---------|-------------|-------------|
| 1. Uptrend | 0–14 | 2395 → 2406 | Strong move up |
| 2. Pullback | 15–29 | 2406 → 2382 | Sharp retracement |
| 3. Consolidation | 30–54 | 2380–2384 | Sideways at support |
| 4. Breakout | 55–64 | 2382 → 2396 | Breakout + TP hit |
| 5. Continuation | 65–79 | 2396 → 2408 | Extended move |

### Context Prompt
> "Gold pulled back to the 2380 support after a strong up move. Price is coiling above the level."

## ExtendedReferenceZone

```typescript
// In packs.ts:
export type ExtendedReferenceZone = ScenarioPack['referenceZone'];
// Currently same as ReferenceZone (fixedRiskPct is in base type)
```

## Trade Outcome Logic

File: `src/lib/outcome.ts`

```
computeOutcome(candles, entryIndex, action, zone):
  - entryPrice = candles[entryIndex].close
  - For BUY: SL = entry - |entry - zone.sl|, TP = entry + |zone.tp - entry|
  - For SELL: mirrored (SL above, TP below)
  - Walk forward from entryIndex + 1:
    - If candle hits SL → loss
    - If candle hits TP → win
    - Conservative: if both in same candle, assume SL first
  - If neither hit → close at last candle's close
    - Within ±$0.50 → breakeven
    - Otherwise → win/loss based on direction
```

**Pip convention (XAUUSD):** 1 pip = $0.10

## How to Add New Packs

1. Create new entry in `packs.ts`
2. Define 50-100 realistic candles (real historical data preferred)
3. Set `referenceZone` with entry/SL/TP/direction
4. Set `decisionIndex` (where user makes their choice)
5. Write `contextPrompt` (1-line situational description)
6. Add to `PACKS` array

**Future:** Real data ingestion from HistData/Dukascopy (out of scope for MVP).
