import type { ScenarioPack, Candle } from '@/lib/types';

// Realistic XAUUSD M15 candles — base 2024-06-17T08:00:00Z
// Phase 0-14: uptrend from ~2395 to ~2405
// Phase 15-29: sharp pullback from 2405 to 2382
// Phase 30-54: consolidation at 2380–2384
// Phase 55-69: breakout up to 2396+
// Phase 70-79: continuation past 2406
const START = 1718620800000; // 2024-06-17 08:00 UTC
const INTERVAL = 900000;     // 15 min in ms

const candles: Candle[] = [
  // ── Phase 1: Uptrend ─────────────────────────────────────────────
  { timestamp: START + 0 * INTERVAL, open: 2395.0, high: 2396.2, low: 2394.3, close: 2395.8 },
  { timestamp: START + 1 * INTERVAL, open: 2395.8, high: 2396.9, low: 2395.2, close: 2396.5 },
  { timestamp: START + 2 * INTERVAL, open: 2396.5, high: 2397.8, low: 2395.8, close: 2397.5 },
  { timestamp: START + 3 * INTERVAL, open: 2397.5, high: 2398.2, low: 2396.8, close: 2397.2 },
  { timestamp: START + 4 * INTERVAL, open: 2397.2, high: 2398.9, low: 2396.9, close: 2398.7 },
  { timestamp: START + 5 * INTERVAL, open: 2398.7, high: 2400.1, low: 2398.3, close: 2399.8 },
  { timestamp: START + 6 * INTERVAL, open: 2399.8, high: 2401.2, low: 2399.2, close: 2400.9 },
  { timestamp: START + 7 * INTERVAL, open: 2400.9, high: 2401.8, low: 2400.1, close: 2401.5 },
  { timestamp: START + 8 * INTERVAL, open: 2401.5, high: 2403.0, low: 2400.8, close: 2402.8 },
  { timestamp: START + 9 * INTERVAL, open: 2402.8, high: 2403.5, low: 2401.9, close: 2402.2 },
  { timestamp: START + 10 * INTERVAL, open: 2402.2, high: 2404.2, low: 2402.0, close: 2404.0 },
  { timestamp: START + 11 * INTERVAL, open: 2404.0, high: 2405.5, low: 2403.5, close: 2405.2 },
  { timestamp: START + 12 * INTERVAL, open: 2405.2, high: 2406.3, low: 2404.5, close: 2406.0 },
  { timestamp: START + 13 * INTERVAL, open: 2406.0, high: 2406.8, low: 2405.0, close: 2405.5 },
  { timestamp: START + 14 * INTERVAL, open: 2405.5, high: 2406.1, low: 2404.8, close: 2405.0 },
  // ── Phase 2: Sharp pullback ──────────────────────────────────────
  { timestamp: START + 15 * INTERVAL, open: 2405.0, high: 2405.3, low: 2402.8, close: 2403.0 },
  { timestamp: START + 16 * INTERVAL, open: 2403.0, high: 2403.5, low: 2400.5, close: 2400.8 },
  { timestamp: START + 17 * INTERVAL, open: 2400.8, high: 2401.5, low: 2398.0, close: 2398.3 },
  { timestamp: START + 18 * INTERVAL, open: 2398.3, high: 2399.0, low: 2396.5, close: 2397.0 },
  { timestamp: START + 19 * INTERVAL, open: 2397.0, high: 2398.5, low: 2395.5, close: 2396.0 },
  { timestamp: START + 20 * INTERVAL, open: 2396.0, high: 2396.5, low: 2393.0, close: 2393.5 },
  { timestamp: START + 21 * INTERVAL, open: 2393.5, high: 2394.0, low: 2390.5, close: 2391.0 },
  { timestamp: START + 22 * INTERVAL, open: 2391.0, high: 2392.0, low: 2388.5, close: 2389.0 },
  { timestamp: START + 23 * INTERVAL, open: 2389.0, high: 2390.5, low: 2387.0, close: 2387.5 },
  { timestamp: START + 24 * INTERVAL, open: 2387.5, high: 2388.0, low: 2385.0, close: 2385.5 },
  { timestamp: START + 25 * INTERVAL, open: 2385.5, high: 2386.5, low: 2383.0, close: 2383.5 },
  { timestamp: START + 26 * INTERVAL, open: 2383.5, high: 2384.5, low: 2381.5, close: 2382.0 },
  { timestamp: START + 27 * INTERVAL, open: 2382.0, high: 2383.5, low: 2380.5, close: 2382.8 },
  { timestamp: START + 28 * INTERVAL, open: 2382.8, high: 2384.0, low: 2381.0, close: 2381.5 },
  { timestamp: START + 29 * INTERVAL, open: 2381.5, high: 2383.0, low: 2380.2, close: 2382.5 },
  // ── Phase 3: Consolidation at support (2380–2384) ────────────────
  { timestamp: START + 30 * INTERVAL, open: 2382.5, high: 2383.8, low: 2381.0, close: 2381.8 },
  { timestamp: START + 31 * INTERVAL, open: 2381.8, high: 2383.0, low: 2380.5, close: 2382.5 },
  { timestamp: START + 32 * INTERVAL, open: 2382.5, high: 2383.2, low: 2381.5, close: 2382.0 },
  { timestamp: START + 33 * INTERVAL, open: 2382.0, high: 2383.5, low: 2381.0, close: 2383.0 },
  { timestamp: START + 34 * INTERVAL, open: 2383.0, high: 2383.8, low: 2381.5, close: 2381.8 },
  { timestamp: START + 35 * INTERVAL, open: 2381.8, high: 2382.5, low: 2380.3, close: 2380.8 },
  { timestamp: START + 36 * INTERVAL, open: 2380.8, high: 2382.0, low: 2380.2, close: 2381.5 },
  { timestamp: START + 37 * INTERVAL, open: 2381.5, high: 2382.5, low: 2380.8, close: 2382.2 },
  { timestamp: START + 38 * INTERVAL, open: 2382.2, high: 2383.0, low: 2381.2, close: 2381.5 },
  { timestamp: START + 39 * INTERVAL, open: 2381.5, high: 2382.8, low: 2380.5, close: 2382.5 },
  { timestamp: START + 40 * INTERVAL, open: 2382.5, high: 2383.2, low: 2381.8, close: 2382.0 },
  { timestamp: START + 41 * INTERVAL, open: 2382.0, high: 2383.5, low: 2381.0, close: 2383.2 },
  { timestamp: START + 42 * INTERVAL, open: 2383.2, high: 2383.8, low: 2382.0, close: 2382.5 },
  { timestamp: START + 43 * INTERVAL, open: 2382.5, high: 2383.0, low: 2381.0, close: 2381.5 },
  { timestamp: START + 44 * INTERVAL, open: 2381.5, high: 2382.5, low: 2380.5, close: 2382.0 },
  { timestamp: START + 45 * INTERVAL, open: 2382.0, high: 2383.2, low: 2381.2, close: 2382.8 },
  { timestamp: START + 46 * INTERVAL, open: 2382.8, high: 2383.5, low: 2381.8, close: 2382.2 },
  { timestamp: START + 47 * INTERVAL, open: 2382.2, high: 2382.8, low: 2380.8, close: 2381.2 },
  { timestamp: START + 48 * INTERVAL, open: 2381.2, high: 2382.5, low: 2380.5, close: 2382.0 },
  { timestamp: START + 49 * INTERVAL, open: 2382.0, high: 2382.8, low: 2381.0, close: 2381.5 },
  { timestamp: START + 50 * INTERVAL, open: 2381.5, high: 2382.2, low: 2380.5, close: 2381.8 },
  { timestamp: START + 51 * INTERVAL, open: 2381.8, high: 2382.5, low: 2380.8, close: 2381.2 },
  { timestamp: START + 52 * INTERVAL, open: 2381.2, high: 2382.0, low: 2380.5, close: 2381.5 },
  { timestamp: START + 53 * INTERVAL, open: 2381.5, high: 2382.3, low: 2381.0, close: 2381.8 },
  { timestamp: START + 54 * INTERVAL, open: 2381.8, high: 2382.5, low: 2381.2, close: 2382.2 }, // ← DECISION POINT
  // ── Phase 4: Breakout ────────────────────────────────────────────
  { timestamp: START + 55 * INTERVAL, open: 2382.2, high: 2384.5, low: 2381.5, close: 2384.0 },
  { timestamp: START + 56 * INTERVAL, open: 2384.0, high: 2386.5, low: 2383.5, close: 2386.2 },
  { timestamp: START + 57 * INTERVAL, open: 2386.2, high: 2388.0, low: 2385.5, close: 2387.8 },
  { timestamp: START + 58 * INTERVAL, open: 2387.8, high: 2389.5, low: 2387.0, close: 2389.2 },
  { timestamp: START + 59 * INTERVAL, open: 2389.2, high: 2391.0, low: 2388.5, close: 2390.8 },
  { timestamp: START + 60 * INTERVAL, open: 2390.8, high: 2392.5, low: 2390.0, close: 2392.0 },
  { timestamp: START + 61 * INTERVAL, open: 2392.0, high: 2393.5, low: 2391.5, close: 2393.2 },
  { timestamp: START + 62 * INTERVAL, open: 2393.2, high: 2394.5, low: 2392.8, close: 2394.0 },
  { timestamp: START + 63 * INTERVAL, open: 2394.0, high: 2395.5, low: 2393.5, close: 2395.2 },
  { timestamp: START + 64 * INTERVAL, open: 2395.2, high: 2396.5, low: 2394.8, close: 2396.0 }, // TP hit at 2396
  { timestamp: START + 65 * INTERVAL, open: 2396.0, high: 2397.8, low: 2395.2, close: 2397.5 },
  { timestamp: START + 66 * INTERVAL, open: 2397.5, high: 2399.0, low: 2396.8, close: 2398.5 },
  { timestamp: START + 67 * INTERVAL, open: 2398.5, high: 2400.0, low: 2397.8, close: 2399.5 },
  { timestamp: START + 68 * INTERVAL, open: 2399.5, high: 2401.0, low: 2399.0, close: 2400.8 },
  { timestamp: START + 69 * INTERVAL, open: 2400.8, high: 2402.0, low: 2400.2, close: 2401.5 },
  // ── Phase 5: Continuation ────────────────────────────────────────
  { timestamp: START + 70 * INTERVAL, open: 2401.5, high: 2403.0, low: 2400.8, close: 2402.5 },
  { timestamp: START + 71 * INTERVAL, open: 2402.5, high: 2403.5, low: 2401.8, close: 2402.0 },
  { timestamp: START + 72 * INTERVAL, open: 2402.0, high: 2403.8, low: 2401.5, close: 2403.5 },
  { timestamp: START + 73 * INTERVAL, open: 2403.5, high: 2405.0, low: 2403.0, close: 2404.5 },
  { timestamp: START + 74 * INTERVAL, open: 2404.5, high: 2405.5, low: 2403.5, close: 2404.0 },
  { timestamp: START + 75 * INTERVAL, open: 2404.0, high: 2406.0, low: 2403.8, close: 2405.8 },
  { timestamp: START + 76 * INTERVAL, open: 2405.8, high: 2407.0, low: 2405.0, close: 2406.5 },
  { timestamp: START + 77 * INTERVAL, open: 2406.5, high: 2407.8, low: 2405.5, close: 2406.0 },
  { timestamp: START + 78 * INTERVAL, open: 2406.0, high: 2408.0, low: 2405.5, close: 2407.5 },
  { timestamp: START + 79 * INTERVAL, open: 2407.5, high: 2409.0, low: 2406.8, close: 2408.5 },
];

export const XAUUSD_PULLBACK_PACK: ScenarioPack = {
  id: 'xauusd-m15-pullback-001',
  symbol: 'XAUUSD',
  timeframe: 'M15',
  candles,
  referenceZone: {
    entryLow: 2380.0,
    entryHigh: 2384.0,
    sl: 2376.0,
    tp: 2396.0,
    minRR: 2.0,
    direction: 'buy',
    setupType: 'pullback-support',
    fixedRiskPct: 1.0, // fixed risk at 1% of account (within 0.5–1% recommended band)
  },
  contextPrompt: 'Gold pulled back to the 2380 support after a strong up move. Price is coiling above the level.',
  decisionIndex: 54,
};

// ExtendedReferenceZone = ReferenceZone (fixedRiskPct is now in base type)
export type ExtendedReferenceZone = ScenarioPack['referenceZone'];

export const PACKS: ScenarioPack[] = [XAUUSD_PULLBACK_PACK];
