import type { Candle, ActionType, SessionDecision, ComponentScores, ScoreResult, ReferenceZone } from './types';
import type { ExtendedReferenceZone } from '@/data/packs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function body(c: Candle): number {
  return Math.abs(c.close - c.open);
}

// ─── Entry Score ─────────────────────────────────────────────────────────────
// Measures price proximity to reference zone + correct direction.
// 0 if wrong direction. 100 if inside zone in correct direction.
// Falls off linearly outside zone.

function entryScore(
  action: ActionType,
  entryPrice: number | undefined,
  zone: ReferenceZone,
): ScoreResult {
  if (action === 'wait') return { score: 0, applicable: false };
  if (entryPrice === undefined) return { score: 0, applicable: true };

  // Wrong direction → score 0 (entry was fundamentally bad)
  if (action !== zone.direction) {
    return { score: 0, applicable: true };
  }

  // Inside reference zone → 100
  if (entryPrice >= zone.entryLow && entryPrice <= zone.entryHigh) {
    return { score: 100, applicable: true };
  }

  // Outside zone: distance from nearest edge
  const dist = entryPrice < zone.entryLow
    ? zone.entryLow - entryPrice
    : entryPrice - zone.entryHigh;

  const zoneWidth = zone.entryHigh - zone.entryLow;
  const maxDist = zoneWidth * 3; // at 3× zone width away → score 0
  const score = clamp(100 - (dist / maxDist) * 100, 0, 100);
  return { score: Math.round(score), applicable: true };
}

// ─── Risk Score ──────────────────────────────────────────────────────────────
// Measures risk % vs recommended band (0.5–1.0%).
// In sub-level 1a: risk is fixed per scenario → score is deterministic.

function riskScore(
  action: ActionType,
  zone: ExtendedReferenceZone,
): ScoreResult {
  if (action === 'wait') return { score: 0, applicable: false };

  const risk = zone.fixedRiskPct;
  if (risk >= 0.5 && risk <= 1.0) return { score: 100, applicable: true };

  // Outside band: linear penalty
  if (risk < 0.5) return { score: Math.round(clamp(risk / 0.5 * 100, 20, 100)), applicable: true };
  return { score: Math.round(clamp(100 - ((risk - 1.0) / 2.0) * 100, 0, 100)), applicable: true };
}

// ─── RR Score ────────────────────────────────────────────────────────────────
// Achievable risk/reward vs minimum required.
// For wrong direction: score 0 (RR meaningless on wrong side).

function rrScore(
  action: ActionType,
  entryPrice: number | undefined,
  zone: ReferenceZone,
): ScoreResult {
  if (action === 'wait' || entryPrice === undefined) return { score: 0, applicable: false };
  if (action !== zone.direction) return { score: 0, applicable: true };

  const slDist = Math.abs(entryPrice - zone.sl);
  const tpDist = Math.abs(zone.tp - entryPrice);
  if (slDist === 0) return { score: 0, applicable: true };

  const achievedRR = tpDist / slDist;
  if (achievedRR >= zone.minRR) return { score: 100, applicable: true };

  return { score: Math.round(clamp((achievedRR / zone.minRR) * 100, 0, 100)), applicable: true };
}

// ─── FOMO Score ──────────────────────────────────────────────────────────────
// Penalty if entry is within 2 candles after a strong candle (body > 1.5× avg).
// Strong candle = aggressive move that might trigger emotional entry.

const STRONG_BODY_MULT = 1.5;
const FOMO_WINDOW = 2;

function fomoScore(
  action: ActionType,
  candles: Candle[],
  decisionIndex: number,
  zone: ReferenceZone,
): ScoreResult {
  if (action === 'wait') return { score: 100, applicable: false }; // no FOMO risk for wait
  if (action !== zone.direction) return { score: 0, applicable: true }; // wrong direction = fomo-ish

  // Compute average body of recent candles (last 20 before decision, or all available)
  const windowSize = Math.min(20, decisionIndex);
  if (windowSize === 0) return { score: 100, applicable: true }; // no history to judge FOMO
  const lookbackStart = Math.max(0, decisionIndex - windowSize);
  let avgBody = 0;
  for (let i = lookbackStart; i < decisionIndex; i++) {
    avgBody += body(candles[i]);
  }
  avgBody /= windowSize;

  // Check if decision candle or the one right after is "after a strong candle"
  const threshold = avgBody * STRONG_BODY_MULT;
  let fomoPenalty = 0;

  for (let i = decisionIndex - FOMO_WINDOW; i < decisionIndex; i++) {
    if (i < 0) continue;
    if (body(candles[i]) > threshold) {
      // Found a strong candle within FOMO window
      fomoPenalty = 40;
      break;
    }
  }

  return { score: clamp(100 - fomoPenalty, 0, 100), applicable: true };
}

// ─── Patience Score ──────────────────────────────────────────────────────────
// Did the user wait for the setup to complete (price reaching the zone)?
// 100 if entry is inside zone (patient) or if wait (patient).
// Lower if entered before the setup was complete.

function patienceScore(
  action: ActionType,
  entryPrice: number | undefined,
  zone: ReferenceZone,
): ScoreResult {
  if (action === 'wait') return { score: 100, applicable: true };
  if (entryPrice === undefined) return { score: 0, applicable: true };

  // Entered in zone = patient
  if (entryPrice >= zone.entryLow && entryPrice <= zone.entryHigh) {
    return { score: 100, applicable: true };
  }

  // Entered near zone (within 1 zone width) = slightly impatient
  const zoneWidth = zone.entryHigh - zone.entryLow;
  const dist = entryPrice < zone.entryLow
    ? zone.entryLow - entryPrice
    : entryPrice - zone.entryHigh;

  if (dist <= zoneWidth) return { score: 60, applicable: true };
  return { score: 30, applicable: true };
}

// ─── Discipline Score ────────────────────────────────────────────────────────
// In sub-level 1a: no SL moves possible (fixed hidden SL).
// Discipline violations: entering after strong candle overlap (if already scored FOMO, count it here too),
// and emotional re-entry. For MVP with one entry: discipline = 100 if no SL moves and no
// direction violation beyond the scope of other scores.

function disciplineScore(
  action: ActionType,
  decision: SessionDecision,
  zone: ReferenceZone,
): ScoreResult {
  if (action === 'wait') return { score: 100, applicable: true };

  // Check for SL moves in log (shouldn't happen in 1a, but defensive)
  const hasSLMove = decision.log.some((e) => e.type === 'sl-move');
  if (hasSLMove) return { score: 30, applicable: true };

  // Wrong direction is a discipline issue (didn't follow the setup)
  if (action !== zone.direction) return { score: 40, applicable: true };

  return { score: 100, applicable: true };
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function computeAllScores(
  decision: SessionDecision,
  candles: Candle[],
  zone: ExtendedReferenceZone,
): ComponentScores {
  const { action, entryPrice, entryIndex } = decision;

  return {
    entry: entryScore(action, entryPrice, zone),
    risk: riskScore(action, zone),
    rr: rrScore(action, entryPrice, zone),
    fomo: fomoScore(action, candles, entryIndex, zone),
    patience: patienceScore(action, entryPrice, zone),
    discipline: disciplineScore(action, decision, zone),
  };
}
