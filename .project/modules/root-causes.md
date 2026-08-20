# Module: Root-Cause Rules

> File: `src/lib/rootCauses.ts`
> Explicit rule table — first match wins, easy to extend.

## Overview

Two rule tables:
1. **Error Rules** — identify root cause for losses/bad decisions
2. **Positive Rules** — identify what user did right (ALWAYS at least one fires)

**Public API:**
```typescript
function findRootCause(ctx: RuleContextFull): RootCauseFinding
function findPositiveNote(ctx: RuleContextFull): RootCauseFinding
```

## Error Rules (Priority Order)

| # | ID | Label | Condition | Description Pattern |
|---|-----|-------|-----------|-------------------|
| 1 | `wrong-direction` | Counter-trend entry | action ≠ wait AND action ≠ zone.direction | "Setup signaled {dir}, but you entered {action}. Price moved in {dir} direction." |
| 2 | `fomo-entry` | FOMO entry | Correct direction + strong candle within 2 candles before decision | "You entered {gap} candle(s) after a strong {body}-point candle." |
| 3 | `late-entry` | Late entry / off-zone | Correct direction + entry outside zone | "Entry at {price} was {side} the reference zone." |
| 4 | `missed-setup` | Missed setup | action === wait + refOutcome === win | "You chose to wait, and the setup played out in your favor." |
| 5 | `missed-setup` | Missed setup | action === wait + refOutcome !== win | "You chose to wait, and the setup failed. Your instinct was correct." |
| 6 | `trade-failed` | Setup failed | action ≠ wait + result ∈ {loss, breakeven} | "Price reached your stop loss. Sometimes the best setups fail." |

**Fallback:** If no rule matches → `{ id: 'unknown', label: 'Outcome noted' }`

## Positive Rules (Priority Order)

| # | ID | Label | Condition | Description Pattern |
|---|-----|-------|-----------|-------------------|
| 1 | `patient-entry` | Patient entry at the zone | Correct direction + entry inside zone | "Your entry at {price} was right in the setup zone." |
| 2 | `disciplined-wait` | Disciplined patience | Wait + refOutcome === loss | "By waiting, you avoided a losing trade." |
| 3 | `correct-risk` | Risk sized correctly | action ≠ wait + fixedRiskPct ∈ [0.5, 1.0] | "Position sized at {risk}% — within the recommended band." |
| 4 | `correct-direction` | Correct direction | action ≠ wait + action === zone.direction | "You picked the right direction ({dir})." |
| 5 | `avoided-chase` | Avoided chasing | Wait + strong candle present | "A strong candle appeared — many traders would have chased." |

**Fallback (ALWAYS fires if no rule matches):**
- Wait → `{ id: 'patience-fallback', label: 'Patience shown' }`
- Trade → `{ id: 'correct-risk-fallback', label: 'Risk sized correctly' }`

## Rule Context

```typescript
interface RuleContextFull {
  decision: SessionDecision;   // action, entryPrice, result, log, etc.
  candles: Candle[];           // full candle array from pack
  zone: ReferenceZone;         // entry zone, SL, TP, direction
  scores: ComponentScores;     // computed scores (for potential future use)
}
```

## Key Implementation Details

### `recentAvgBody` helper
```typescript
function recentAvgBody(candles: Candle[], fromIndex: number, windowSize: number): number
// Average body size of candles from [fromIndex - windowSize, fromIndex)
```

### `body` helper
```typescript
function body(c: Candle): number
// Math.abs(c.close - c.open) — candle body size in price units
```

### Strong candle threshold
- `STRONG_BODY_MULT = 1.5` — body must be > 1.5× average to count as "strong"
- `FOMO_WINDOW = 2` — only checks 2 candles before decision

## Extending Rules

To add a new root cause:
1. Add entry to `ERROR_RULES` array (priority = array order)
2. Implement `applies(ctx)` — boolean condition
3. Implement `describe(ctx)` — returns human-readable explanation
4. Keep descriptions concrete (mention specific prices, times, candle sizes)

To add a new positive rule:
1. Add entry to `POSITIVE_RULES` array
2. Ensure at least one rule always fires (check fallback logic)

**Rule of thumb:** Root cause rules should answer "WHY did this happen?" Positive rules should answer "WHAT did you do right?"
