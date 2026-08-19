import type { Candle, ActionType, TradeResult, SessionDecision, DecisionAction, ReferenceZone } from './types';
import type { ExtendedReferenceZone } from '@/data/packs';

/**
 * Simulate a trade forward from entryIndex through the remaining candles.
 * Returns: { result, resultPrice, pips }
 *
 * SL/TP logic (sub-level 1a: fixed SL/TP derived from reference zone):
 *  - For BUY: SL below, TP above.
 *  - For SELL: mirrored — SL above zone, TP below zone.
 *  - If both SL and TP hit in the same candle, assume SL first (conservative).
 *  - If neither hit by end of data: result = breakeven (close at last close).
 */
export function computeOutcome(
  candles: Candle[],
  entryIndex: number,
  action: ActionType,
  zone: ExtendedReferenceZone,
): { result: TradeResult; resultPrice: number; pips: number } {
  if (action === 'wait') {
    return { result: 'skipped', resultPrice: 0, pips: 0 };
  }

  const entryPrice = candles[entryIndex].close;
  const slDist = Math.abs(entryPrice - zone.sl); // distance from reference entry midpoint? No — from entry to SL
  const tpDist = Math.abs(zone.tp - entryPrice);

  let slPrice: number;
  let tpPrice: number;

  if (action === 'buy') {
    slPrice = entryPrice - slDist;
    tpPrice = entryPrice + tpDist;
  } else {
    // sell: mirrored
    slPrice = entryPrice + slDist;
    tpPrice = entryPrice - tpDist;
  }

  // Walk forward from entryIndex + 1
  for (let i = entryIndex + 1; i < candles.length; i++) {
    const c = candles[i];

    if (action === 'buy') {
      // Check SL first (conservative)
      if (c.low <= slPrice) {
        return { result: 'loss', resultPrice: slPrice, pips: -(entryPrice - slPrice) };
      }
      if (c.high >= tpPrice) {
        return { result: 'win', resultPrice: tpPrice, pips: tpPrice - entryPrice };
      }
    } else {
      // sell
      if (c.high >= slPrice) {
        return { result: 'loss', resultPrice: slPrice, pips: -(slPrice - entryPrice) };
      }
      if (c.low <= tpPrice) {
        return { result: 'win', resultPrice: tpPrice, pips: entryPrice - tpPrice };
      }
    }
  }

  // Neither hit — close at final candle's close
  const finalClose = candles[candles.length - 1].close;
  const diff = finalClose - entryPrice;
  const PIPS_THRESHOLD = 0.5; // within $0.5 = breakeven for gold

  if (action === 'buy') {
    if (diff > PIPS_THRESHOLD) return { result: 'win', resultPrice: finalClose, pips: diff };
    if (diff < -PIPS_THRESHOLD) return { result: 'loss', resultPrice: finalClose, pips: diff };
    return { result: 'breakeven', resultPrice: finalClose, pips: 0 };
  } else {
    if (-diff > PIPS_THRESHOLD) return { result: 'win', resultPrice: finalClose, pips: -diff };
    if (-diff < -PIPS_THRESHOLD) return { result: 'loss', resultPrice: finalClose, pips: diff };
    return { result: 'breakeven', resultPrice: finalClose, pips: 0 };
  }
}

/**
 * Compute what would have happened if the user had taken the CORRECT direction.
 * Used for WAIT decisions to show "you missed this" / "you dodged this".
 */
export function computeReferenceOutcome(
  candles: Candle[],
  decisionIndex: number,
  zone: ExtendedReferenceZone,
): { result: TradeResult; pips: number } {
  const action = zone.direction as ActionType;
  const outcome = computeOutcome(candles, decisionIndex, action, zone);
  return { result: outcome.result, pips: outcome.pips };
}

/**
 * Convert pips to display-friendly number.
 * For XAUUSD: 1 pip = $0.10 (broker convention).
 */
export function pipsToDisplay(pips: number): number {
  return Math.round(pips * 10);
}
