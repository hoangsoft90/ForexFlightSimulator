import type { Candle, ActionType, SessionDecision, RootCauseFinding, ComponentScores, ReferenceZone } from './types';
import type { ExtendedReferenceZone } from '@/data/packs';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function body(c: Candle): number {
  return Math.abs(c.close - c.open);
}

// ─── Error Rules (root cause for losses / bad decisions) ─────────────────────
// Rules fire in priority order; first match wins.

interface ErrorRule {
  id: string;
  label: string;
  applies: (ctx: RuleContext) => boolean;
  describe: (ctx: RuleContext) => string;
}

interface RuleContext {
  decision: SessionDecision;
  candles: Candle[];
  zone: ReferenceZone;
  scores: ComponentScores;
}

const ERROR_RULES: ErrorRule[] = [
  {
    id: 'wrong-direction',
    label: 'Counter-trend entry',
    applies: ({ decision, zone }) =>
      decision.action !== 'wait' && decision.action !== zone.direction,
    describe: ({ decision, zone }) =>
      `The setup signaled ${zone.direction.toUpperCase()}, but you entered ${decision.action.toUpperCase()}. Price moved in the ${zone.direction} direction — this trade was against the setup.`,
  },
  {
    id: 'fomo-entry',
    label: 'FOMO entry',
    applies: ({ decision, candles, zone }) => {
      if (decision.action === 'wait' || decision.action !== zone.direction) return false;
      const avgBody = recentAvgBody(candles, decision.entryIndex, 20);
      const threshold = avgBody * 1.5;
      for (let i = decision.entryIndex - 2; i < decision.entryIndex; i++) {
        if (i >= 0 && body(candles[i]) > threshold) return true;
      }
      return false;
    },
    describe: ({ decision, candles }) => {
      const avgBody = recentAvgBody(candles, decision.entryIndex, 20);
      const threshold = avgBody * 1.5;
      let strongIdx = -1;
      for (let i = decision.entryIndex - 2; i < decision.entryIndex; i++) {
        if (i >= 0 && body(candles[i]) > threshold) { strongIdx = i; break; }
      }
      if (strongIdx < 0) return 'You entered shortly after a strong candle, suggesting momentum-driven entry.';
      const gap = decision.entryIndex - strongIdx;
      return `You entered ${gap} candle(s) after a strong ${body(candles[strongIdx]).toFixed(1)}-point candle (${formatTime(candles[strongIdx].timestamp)}). This suggests reacting to momentum rather than waiting for the setup to confirm.`;
    },
  },
  {
    id: 'late-entry',
    label: 'Late entry / off-zone',
    applies: ({ decision, zone }) => {
      if (decision.action === 'wait' || decision.entryPrice === undefined) return false;
      if (decision.action !== zone.direction) return false;
      return decision.entryPrice < zone.entryLow || decision.entryPrice > zone.entryHigh;
    },
    describe: ({ decision, zone }) => {
      const side = decision.entryPrice! < zone.entryLow ? 'below' : 'above';
      return `Entry at ${decision.entryPrice?.toFixed(1)} was ${side} the reference zone (${zone.entryLow}–${zone.entryHigh}). A better entry closer to the zone would have improved your risk/reward.`;
    },
  },
  {
    id: 'missed-setup',
    label: 'Missed setup',
    applies: ({ decision }) => decision.action === 'wait',
    describe: ({ decision }) =>
      decision.refOutcome === 'win'
        ? `You chose to wait, and the setup played out in your favor. While patience is valuable, this was a setup worth considering.`
        : `You chose to wait, and the setup failed — the price moved against the expected direction. Your instinct to hold back was correct this time.`,
  },
  {
    id: 'trade-failed',
    label: 'Setup failed',
    applies: ({ decision }) =>
      decision.action !== 'wait' && (decision.result === 'loss' || decision.result === 'breakeven'),
    describe: ({ decision }) =>
      `Price reached your stop loss at ${decision.resultPrice?.toFixed(1)}. The setup didn't play out — sometimes the best setups fail. The key is whether your risk management was sound.`,
  },
];

// ─── Positive Rules ("what you did right") ───────────────────────────────────

interface PositiveRule {
  id: string;
  label: string;
  applies: (ctx: RuleContext) => boolean;
  describe: (ctx: RuleContext) => string;
}

const POSITIVE_RULES: PositiveRule[] = [
  {
    id: 'patient-entry',
    label: 'Patient entry at the zone',
    applies: ({ decision, zone }) => {
      if (decision.action === 'wait' || decision.entryPrice === undefined) return false;
      return decision.action === zone.direction
        && decision.entryPrice >= zone.entryLow
        && decision.entryPrice <= zone.entryHigh;
    },
    describe: ({ decision }) =>
      `Your entry at ${decision.entryPrice?.toFixed(1)} was right in the setup zone — exactly where a disciplined trader would enter. This maximizes your probability of a favorable outcome.`,
  },
  {
    id: 'disciplined-wait',
    label: 'Disciplined patience',
    applies: ({ decision, zone }) => {
      // Waiting when the setup actually would have been a loss = good patience
      return decision.action === 'wait' && decision.refOutcome === 'loss';
    },
    describe: () =>
      `By waiting, you avoided a losing trade. The setup failed — your instinct to hold back was correct and saved you capital.`,
  },
  {
    id: 'correct-risk',
    label: 'Risk sized correctly',
    applies: ({ decision, zone }) => {
      if (decision.action === 'wait') return false;
      const ext = zone as ExtendedReferenceZone;
      return ext.fixedRiskPct >= 0.5 && ext.fixedRiskPct <= 1.0;
    },
    describe: ({ zone }) => {
      const ext = zone as ExtendedReferenceZone;
      return `Your position was sized at ${ext.fixedRiskPct}% risk — within the recommended 0.5–1% band. Good risk management protects your capital even when trades don't work out.`;
    },
  },
  {
    id: 'correct-direction',
    label: 'Correct direction',
    applies: ({ decision, zone }) =>
      decision.action !== 'wait' && decision.action === zone.direction,
    describe: ({ zone }) =>
      `You picked the right direction (${zone.direction.toUpperCase()}). The setup's directional bias played out correctly — well-read.`,
  },
  {
    id: 'avoided-chase',
    label: 'Avoided chasing',
    applies: ({ decision, candles }) => {
      if (decision.action !== 'wait') return false;
      if (candles.length === 0) return false;
      // Waited even though a strong candle was present = avoided chase
      const avgBody = recentAvgBody(candles, decision.entryIndex, 20);
      const threshold = avgBody * 1.5;
      for (let i = decision.entryIndex - 2; i < decision.entryIndex; i++) {
        if (i >= 0 && body(candles[i]) > threshold) return true;
      }
      return false;
    },
    describe: () =>
      `A strong candle appeared right before your decision point — many traders would have chased that momentum. You waited, which shows discipline.`,
  },
];

// ─── Context helper ──────────────────────────────────────────────────────────

function recentAvgBody(candles: Candle[], fromIndex: number, windowSize: number): number {
  const start = Math.max(0, fromIndex - windowSize);
  let sum = 0;
  for (let i = start; i < fromIndex; i++) {
    sum += body(candles[i]);
  }
  return sum / Math.max(1, fromIndex - start);
}


function formatTime(ts: number): string {
  const d = new Date(ts);
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export interface RuleContextFull {
  decision: SessionDecision;
  candles: Candle[];
  zone: ReferenceZone;
  scores: ComponentScores;
}

/**
 * Find the root cause (error) for a trade.
 * Returns the first matching error rule.
 * Falls back to a generic "setup failed" if no specific rule matches.
 */
export function findRootCause(ctx: RuleContextFull): RootCauseFinding {
  const fullCtx: RuleContext = { ...ctx };

  for (const rule of ERROR_RULES) {
    if (rule.applies(fullCtx)) {
      return {
        id: rule.id,
        label: rule.label,
        description: rule.describe(fullCtx),
        type: 'error',
      };
    }
  }

  // Fallback (shouldn't normally be reached)
  return {
    id: 'unknown',
    label: 'Outcome noted',
    description: 'No specific root cause identified for this trade.',
    type: 'error',
  };
}

/**
 * Find the positive note ("what you did right").
 * Tries rules in order; falls back to "correct risk sizing" (always true in 1a).
 * Per plan §2.6: always show at least one positive — never omit.
 */
export function findPositiveNote(ctx: RuleContextFull): RootCauseFinding {
  const fullCtx: RuleContext = { ...ctx };

  for (const rule of POSITIVE_RULES) {
    if (rule.applies(fullCtx)) {
      return {
        id: rule.id,
        label: rule.label,
        description: rule.describe(fullCtx),
        type: 'positive',
      };
    }
  }

  // Fallback: adjust message based on whether a trade was taken.
  // FLAGGED in code: as packs grow, ensure at least one positive rule always fires.
  if (ctx.decision.action === 'wait') {
    return {
      id: 'patience-fallback',
      label: 'Patience shown',
      description: 'You exercised patience by waiting for a clearer setup. Disciplined traders pick their battles carefully.',
      type: 'positive',
    };
  }
  const ext = ctx.zone as ExtendedReferenceZone;
  return {
    id: 'correct-risk-fallback',
    label: 'Risk sized correctly',
    description: `Your position was sized at ${ext.fixedRiskPct}% risk — within the recommended band. Consistent risk management is the foundation of long-term trading success.`,
    type: 'positive',
  };
}
