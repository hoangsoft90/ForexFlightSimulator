# Module: Scoring Engine

> File: `src/lib/scoring.ts`
> Pure functions — no React, no side effects, fully unit-testable.

## Overview

6 score components, each returns `{ score: number (0-100), applicable: boolean }`.

**Public API:**
```typescript
function computeAllScores(
  decision: SessionDecision,
  candles: Candle[],
  zone: ExtendedReferenceZone,
): ComponentScores
```

## Score Components

### 1. Entry Score (`entryScore`)

**Measures:** Price proximity to reference zone + correct direction.

| Condition | Score |
|-----------|-------|
| `wait` action | 0 (not applicable) |
| Wrong direction | 0 (fundamentally bad) |
| Inside zone [entryLow, entryHigh] | 100 |
| Outside zone | Linear falloff: 100 → 0 over 3× zone width |

**Logic:**
```
dist = distance from entry to nearest zone edge
maxDist = zoneWidth × 3
score = clamp(100 - (dist / maxDist) × 100, 0, 100)
```

### 2. Risk Score (`riskScore`)

**Measures:** Risk % vs recommended band (0.5–1.0%).

| Condition | Score |
|-----------|-------|
| `wait` action | 0 (not applicable) |
| Risk in [0.5%, 1.0%] | 100 |
| Risk < 0.5% | Linear: `risk / 0.5 × 100`, clamped to [20, 100] |
| Risk > 1.0% | Linear: `100 - ((risk - 1.0) / 2.0) × 100`, clamped to [0, 100] |

**Note:** In sub-level 1a, risk is fixed per scenario (`fixedRiskPct`), so score is deterministic.

### 3. RR Score (`rrScore`)

**Measures:** Achievable risk/reward vs minimum required.

| Condition | Score |
|-----------|-------|
| `wait` or no entry price | 0 (not applicable) |
| Wrong direction | 0 (meaningless on wrong side) |
| `achievedRR >= minRR` | 100 |
| Otherwise | `(achievedRR / minRR) × 100` |

**Calculation:**
```
slDist = |entryPrice - zone.sl|
tpDist = |zone.tp - entryPrice|
achievedRR = tpDist / slDist
```

### 4. FOMO Score (`fomoScore`)

**Measures:** Entry timing after strong candle (emotional entry).

| Condition | Score |
|-----------|-------|
| `wait` | 100 (not applicable, no FOMO risk) |
| Wrong direction | 0 (FOMO-ish behavior) |
| Strong candle within 2 candles before decision | -40 penalty |
| No strong candle | 100 |

**Strong candle definition:** `body > 1.5 × averageBody` (average of last 20 candles before decision).

**Edge case:** If `decisionIndex === 0`, returns 100 (no history to judge).

### 5. Patience Score (`patienceScore`)

**Measures:** Did user wait for setup to complete?

| Condition | Score |
|-----------|-------|
| `wait` | 100 (patient) |
| Entry inside zone | 100 (patient) |
| Entry within 1 zone width of zone | 60 |
| Entry far from zone | 30 |

### 6. Discipline Score (`disciplineScore`)

**Measures:** SL moves, direction violations.

| Condition | Score |
|-----------|-------|
| `wait` | 100 |
| Has SL moves in log | 30 |
| Wrong direction | 40 |
| Otherwise | 100 |

**Note:** In sub-level 1a, SL moves shouldn't happen (fixed SL). Score is 100 for correct-direction entries.

## Score → Trader Profile Mapping

| Score Component | Maps to Trader Profile | When Updated |
|----------------|----------------------|--------------|
| `entry` | `scores.entry` | When `applicable === true` |
| `risk` | `scores.risk` | When `applicable === true` |
| `discipline` | `scores.discipline` | When `applicable === true` |
| `rr` | — (not tracked in profile) | — |
| `fomo` | — (not tracked in profile) | — |
| `patience` | — (not tracked in profile) | — |
| `reading` | `scores.reading` | Never (not implemented yet) |

## Extending Scoring

To add a new score component:
1. Add type to `ScoreComponent` union in `types.ts`
2. Add `ScoreResult` field to `ComponentScores` interface
3. Implement pure function in `scoring.ts`
4. Add to `computeAllScores` return object
5. Update `trader-store.ts` if it should persist to profile
