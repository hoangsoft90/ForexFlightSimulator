import type { ScenarioPack, Candle } from '@/lib/types';

// ─────────────────────────────────────────────────────────────────────
// Pack 1: Trend Continuation (BUY)
// XAUUSD M15 — Strong uptrend, shallow pullback to 20 EMA zone, continue up
// Base: 2024-07-01 08:00 UTC
// ─────────────────────────────────────────────────────────────────────
const T1_START = 1719830400000;
const T1_INT = 900000;

export const TREND_CONTINUATION_PACK: ScenarioPack = {
  id: 'xauusd-m15-trend-001',
  symbol: 'XAUUSD',
  timeframe: 'M15',
  candles: [
    // Phase 1: Strong rally 2380 → 2420
    { timestamp: T1_START + 0 * T1_INT, open: 2380.0, high: 2382.5, low: 2379.0, close: 2382.0 },
    { timestamp: T1_START + 1 * T1_INT, open: 2382.0, high: 2384.8, low: 2381.5, close: 2384.5 },
    { timestamp: T1_START + 2 * T1_INT, open: 2384.5, high: 2387.0, low: 2384.0, close: 2386.8 },
    { timestamp: T1_START + 3 * T1_INT, open: 2386.8, high: 2389.5, low: 2386.0, close: 2389.0 },
    { timestamp: T1_START + 4 * T1_INT, open: 2389.0, high: 2391.2, low: 2388.5, close: 2391.0 },
    { timestamp: T1_START + 5 * T1_INT, open: 2391.0, high: 2393.5, low: 2390.2, close: 2393.0 },
    { timestamp: T1_START + 6 * T1_INT, open: 2393.0, high: 2396.0, low: 2392.5, close: 2395.5 },
    { timestamp: T1_START + 7 * T1_INT, open: 2395.5, high: 2398.0, low: 2394.8, close: 2397.5 },
    { timestamp: T1_START + 8 * T1_INT, open: 2397.5, high: 2400.2, low: 2396.5, close: 2400.0 },
    { timestamp: T1_START + 9 * T1_INT, open: 2400.0, high: 2402.5, low: 2399.0, close: 2402.0 },
    { timestamp: T1_START + 10 * T1_INT, open: 2402.0, high: 2405.0, low: 2401.5, close: 2404.5 },
    { timestamp: T1_START + 11 * T1_INT, open: 2404.5, high: 2407.0, low: 2403.8, close: 2406.5 },
    { timestamp: T1_START + 12 * T1_INT, open: 2406.5, high: 2409.5, low: 2405.8, close: 2409.0 },
    { timestamp: T1_START + 13 * T1_INT, open: 2409.0, high: 2411.5, low: 2408.2, close: 2411.0 },
    { timestamp: T1_START + 14 * T1_INT, open: 2411.0, high: 2413.5, low: 2410.0, close: 2413.0 },
    { timestamp: T1_START + 15 * T1_INT, open: 2413.0, high: 2416.0, low: 2412.5, close: 2415.5 },
    { timestamp: T1_START + 16 * T1_INT, open: 2415.5, high: 2418.0, low: 2414.8, close: 2417.5 },
    { timestamp: T1_START + 17 * T1_INT, open: 2417.5, high: 2420.0, low: 2416.5, close: 2419.5 },
    { timestamp: T1_START + 18 * T1_INT, open: 2419.5, high: 2421.5, low: 2418.5, close: 2421.0 },
    // Phase 2: Shallow pullback to ~2410 (20 EMA zone)
    { timestamp: T1_START + 19 * T1_INT, open: 2421.0, high: 2421.5, low: 2418.0, close: 2418.5 },
    { timestamp: T1_START + 20 * T1_INT, open: 2418.5, high: 2419.0, low: 2415.5, close: 2416.0 },
    { timestamp: T1_START + 21 * T1_INT, open: 2416.0, high: 2417.0, low: 2413.0, close: 2413.5 },
    { timestamp: T1_START + 22 * T1_INT, open: 2413.5, high: 2414.5, low: 2410.5, close: 2411.0 },
    { timestamp: T1_START + 23 * T1_INT, open: 2411.0, high: 2412.5, low: 2409.5, close: 2410.5 },
    { timestamp: T1_START + 24 * T1_INT, open: 2410.5, high: 2412.0, low: 2409.0, close: 2411.5 },
    { timestamp: T1_START + 25 * T1_INT, open: 2411.5, high: 2413.0, low: 2410.0, close: 2412.5 },
    { timestamp: T1_START + 26 * T1_INT, open: 2412.5, high: 2414.0, low: 2411.5, close: 2413.5 },
    // Phase 3: Small bounce, price stabilizing — DECISION POINT
    { timestamp: T1_START + 27 * T1_INT, open: 2413.5, high: 2415.0, low: 2412.5, close: 2414.5 },
    { timestamp: T1_START + 28 * T1_INT, open: 2414.5, high: 2416.0, low: 2413.5, close: 2415.5 },
    // Phase 4: Continuation up
    { timestamp: T1_START + 29 * T1_INT, open: 2415.5, high: 2418.0, low: 2415.0, close: 2417.5 },
    { timestamp: T1_START + 30 * T1_INT, open: 2417.5, high: 2420.0, low: 2417.0, close: 2419.5 },
    { timestamp: T1_START + 31 * T1_INT, open: 2419.5, high: 2422.0, low: 2419.0, close: 2421.5 },
    { timestamp: T1_START + 32 * T1_INT, open: 2421.5, high: 2424.0, low: 2420.8, close: 2423.5 },
    { timestamp: T1_START + 33 * T1_INT, open: 2423.5, high: 2426.0, low: 2423.0, close: 2425.5 },
    { timestamp: T1_START + 34 * T1_INT, open: 2425.5, high: 2428.0, low: 2424.8, close: 2427.5 },
    { timestamp: T1_START + 35 * T1_INT, open: 2427.5, high: 2430.0, low: 2426.5, close: 2429.5 },
    { timestamp: T1_START + 36 * T1_INT, open: 2429.5, high: 2432.0, low: 2429.0, close: 2431.5 },
    { timestamp: T1_START + 37 * T1_INT, open: 2431.5, high: 2433.5, low: 2430.5, close: 2433.0 },
    { timestamp: T1_START + 38 * T1_INT, open: 2433.0, high: 2435.0, low: 2432.0, close: 2434.5 },
    { timestamp: T1_START + 39 * T1_INT, open: 2434.5, high: 2436.5, low: 2433.5, close: 2436.0 },
    { timestamp: T1_START + 40 * T1_INT, open: 2436.0, high: 2438.0, low: 2435.0, close: 2437.5 },
  ],
  referenceZone: {
    entryLow: 2410.0,
    entryHigh: 2415.0,
    sl: 2405.0,
    tp: 2430.0,
    minRR: 2.0,
    direction: 'buy',
    setupType: 'trend-continuation',
    fixedRiskPct: 1.0,
  },
  contextPrompt: 'Gold has rallied strongly from 2380 to 2420. Price pulled back to the 20 EMA around 2410 and is stabilizing. Trend remains bullish.',
  decisionIndex: 28,
};

// ─────────────────────────────────────────────────────────────────────
// Pack 2: Head & Shoulders (SELL)
// XAUUSD M15 — Classic H&S reversal after extended uptrend
// Base: 2024-07-10 08:00 UTC
// ─────────────────────────────────────────────────────────────────────
const T2_START = 1720608000000;

export const HEAD_SHOULDERS_PACK: ScenarioPack = {
  id: 'xauusd-m15-hs-001',
  symbol: 'XAUUSD',
  timeframe: 'M15',
  candles: [
    // Phase 1: Left shoulder (peak ~2440, dip to 2430)
    { timestamp: T2_START + 0 * T1_INT, open: 2425.0, high: 2427.5, low: 2424.0, close: 2427.0 },
    { timestamp: T2_START + 1 * T1_INT, open: 2427.0, high: 2430.0, low: 2426.5, close: 2429.5 },
    { timestamp: T2_START + 2 * T1_INT, open: 2429.5, high: 2432.0, low: 2429.0, close: 2431.5 },
    { timestamp: T2_START + 3 * T1_INT, open: 2431.5, high: 2435.0, low: 2431.0, close: 2434.5 },
    { timestamp: T2_START + 4 * T1_INT, open: 2434.5, high: 2438.0, low: 2434.0, close: 2437.5 },
    { timestamp: T2_START + 5 * T1_INT, open: 2437.5, high: 2440.5, low: 2437.0, close: 2440.0 }, // LS peak
    { timestamp: T2_START + 6 * T1_INT, open: 2440.0, high: 2440.5, low: 2436.5, close: 2437.0 },
    { timestamp: T2_START + 7 * T1_INT, open: 2437.0, high: 2438.0, low: 2434.0, close: 2434.5 },
    { timestamp: T2_START + 8 * T1_INT, open: 2434.5, high: 2435.5, low: 2431.0, close: 2431.5 },
    { timestamp: T2_START + 9 * T1_INT, open: 2431.5, high: 2432.5, low: 2429.5, close: 2430.0 }, // neckline test
    // Phase 2: Head (peak ~2448, dip to 2430)
    { timestamp: T2_START + 10 * T1_INT, open: 2430.0, high: 2433.0, low: 2429.5, close: 2432.5 },
    { timestamp: T2_START + 11 * T1_INT, open: 2432.5, high: 2436.0, low: 2432.0, close: 2435.5 },
    { timestamp: T2_START + 12 * T1_INT, open: 2435.5, high: 2439.0, low: 2435.0, close: 2438.5 },
    { timestamp: T2_START + 13 * T1_INT, open: 2438.5, high: 2442.0, low: 2438.0, close: 2441.5 },
    { timestamp: T2_START + 14 * T1_INT, open: 2441.5, high: 2445.0, low: 2441.0, close: 2444.5 },
    { timestamp: T2_START + 15 * T1_INT, open: 2444.5, high: 2448.5, low: 2444.0, close: 2448.0 }, // HEAD peak
    { timestamp: T2_START + 16 * T1_INT, open: 2448.0, high: 2448.5, low: 2444.0, close: 2444.5 },
    { timestamp: T2_START + 17 * T1_INT, open: 2444.5, high: 2445.5, low: 2440.5, close: 2441.0 },
    { timestamp: T2_START + 18 * T1_INT, open: 2441.0, high: 2442.0, low: 2437.5, close: 2438.0 },
    { timestamp: T2_START + 19 * T1_INT, open: 2438.0, high: 2439.0, low: 2434.5, close: 2435.0 },
    { timestamp: T2_START + 20 * T1_INT, open: 2435.0, high: 2436.0, low: 2430.5, close: 2431.0 }, // neckline
    { timestamp: T2_START + 21 * T1_INT, open: 2431.0, high: 2432.5, low: 2430.0, close: 2431.5 }, // neckline holds
    // Phase 3: Right shoulder forming (peak ~2440, lower than head)
    { timestamp: T2_START + 22 * T1_INT, open: 2431.5, high: 2434.0, low: 2431.0, close: 2433.5 },
    { timestamp: T2_START + 23 * T1_INT, open: 2433.5, high: 2436.5, low: 2433.0, close: 2436.0 },
    { timestamp: T2_START + 24 * T1_INT, open: 2436.0, high: 2439.0, low: 2435.5, close: 2438.5 },
    { timestamp: T2_START + 25 * T1_INT, open: 2438.5, high: 2440.5, low: 2437.5, close: 2440.0 }, // RS peak (lower than head)
    { timestamp: T2_START + 26 * T1_INT, open: 2440.0, high: 2440.5, low: 2436.5, close: 2437.0 },
    { timestamp: T2_START + 27 * T1_INT, open: 2437.0, high: 2438.0, low: 2434.0, close: 2434.5 },
    { timestamp: T2_START + 28 * T1_INT, open: 2434.5, high: 2435.5, low: 2432.0, close: 2432.5 },
    // DECISION POINT — RS declining, approaching neckline
    { timestamp: T2_START + 29 * T1_INT, open: 2432.5, high: 2433.5, low: 2431.0, close: 2431.5 },
    // Phase 4: Breakdown
    { timestamp: T2_START + 30 * T1_INT, open: 2431.5, high: 2432.0, low: 2428.5, close: 2429.0 },
    { timestamp: T2_START + 31 * T1_INT, open: 2429.0, high: 2430.0, low: 2426.0, close: 2426.5 },
    { timestamp: T2_START + 32 * T1_INT, open: 2426.5, high: 2427.5, low: 2423.5, close: 2424.0 },
    { timestamp: T2_START + 33 * T1_INT, open: 2424.0, high: 2425.5, low: 2421.0, close: 2421.5 },
    { timestamp: T2_START + 34 * T1_INT, open: 2421.5, high: 2423.0, low: 2419.0, close: 2419.5 },
    { timestamp: T2_START + 35 * T1_INT, open: 2419.5, high: 2420.5, low: 2417.0, close: 2417.5 },
    { timestamp: T2_START + 36 * T1_INT, open: 2417.5, high: 2418.5, low: 2415.0, close: 2415.5 },
    { timestamp: T2_START + 37 * T1_INT, open: 2415.5, high: 2417.0, low: 2413.5, close: 2414.0 },
    { timestamp: T2_START + 38 * T1_INT, open: 2414.0, high: 2415.5, low: 2412.0, close: 2412.5 },
    { timestamp: T2_START + 39 * T1_INT, open: 2412.5, high: 2414.0, low: 2411.0, close: 2411.5 },
    { timestamp: T2_START + 40 * T1_INT, open: 2411.5, high: 2413.0, low: 2410.0, close: 2410.5 },
  ],
  referenceZone: {
    entryLow: 2430.0,
    entryHigh: 2434.0,
    sl: 2442.0,
    tp: 2414.0,
    minRR: 1.5,
    direction: 'sell',
    setupType: 'head-shoulders',
    fixedRiskPct: 1.0,
  },
  contextPrompt: 'Gold formed a Head & Shoulders pattern after a strong rally. Right shoulder is declining and approaching neckline at 2430. Watch for the breakdown.',
  decisionIndex: 29,
};

// ─────────────────────────────────────────────────────────────────────
// Pack 3: Double Bottom (BUY)
// XAUUSD M15 — W-pattern reversal after downtrend
// Base: 2024-07-18 08:00 UTC
// ─────────────────────────────────────────────────────────────────────
const T3_START = 1721299200000;

export const DOUBLE_BOTTOM_PACK: ScenarioPack = {
  id: 'xauusd-m15-db-001',
  symbol: 'XAUUSD',
  timeframe: 'M15',
  candles: [
    // Phase 1: Downtrend from 2460 to 2430
    { timestamp: T3_START + 0 * T1_INT, open: 2460.0, high: 2461.0, low: 2457.5, close: 2458.0 },
    { timestamp: T3_START + 1 * T1_INT, open: 2458.0, high: 2459.0, low: 2455.0, close: 2455.5 },
    { timestamp: T3_START + 2 * T1_INT, open: 2455.5, high: 2456.5, low: 2452.5, close: 2453.0 },
    { timestamp: T3_START + 3 * T1_INT, open: 2453.0, high: 2454.0, low: 2450.0, close: 2450.5 },
    { timestamp: T3_START + 4 * T1_INT, open: 2450.5, high: 2451.5, low: 2447.5, close: 2448.0 },
    { timestamp: T3_START + 5 * T1_INT, open: 2448.0, high: 2449.0, low: 2445.0, close: 2445.5 },
    { timestamp: T3_START + 6 * T1_INT, open: 2445.5, high: 2446.5, low: 2442.5, close: 2443.0 },
    { timestamp: T3_START + 7 * T1_INT, open: 2443.0, high: 2444.0, low: 2440.0, close: 2440.5 },
    { timestamp: T3_START + 8 * T1_INT, open: 2440.5, high: 2441.5, low: 2438.0, close: 2438.5 },
    { timestamp: T3_START + 9 * T1_INT, open: 2438.5, high: 2439.5, low: 2436.0, close: 2436.5 },
    { timestamp: T3_START + 10 * T1_INT, open: 2436.5, high: 2437.5, low: 2434.0, close: 2434.5 },
    { timestamp: T3_START + 11 * T1_INT, open: 2434.5, high: 2435.5, low: 2432.0, close: 2432.5 },
    { timestamp: T3_START + 12 * T1_INT, open: 2432.5, high: 2433.5, low: 2430.0, close: 2430.5 },
    // Phase 2: First bottom (2430)
    { timestamp: T3_START + 13 * T1_INT, open: 2430.5, high: 2431.5, low: 2429.5, close: 2430.0 }, // Bottom 1
    { timestamp: T3_START + 14 * T1_INT, open: 2430.0, high: 2433.0, low: 2429.8, close: 2432.5 },
    // Phase 3: Bounce to neckline ~2440
    { timestamp: T3_START + 15 * T1_INT, open: 2432.5, high: 2435.5, low: 2432.0, close: 2435.0 },
    { timestamp: T3_START + 16 * T1_INT, open: 2435.0, high: 2438.0, low: 2434.5, close: 2437.5 },
    { timestamp: T3_START + 17 * T1_INT, open: 2437.5, high: 2440.5, low: 2437.0, close: 2440.0 }, // Neckline
    { timestamp: T3_START + 18 * T1_INT, open: 2440.0, high: 2440.5, low: 2437.0, close: 2437.5 },
    { timestamp: T3_START + 19 * T1_INT, open: 2437.5, high: 2438.5, low: 2435.0, close: 2435.5 },
    // Phase 4: Decline to second bottom
    { timestamp: T3_START + 20 * T1_INT, open: 2435.5, high: 2436.5, low: 2433.0, close: 2433.5 },
    { timestamp: T3_START + 21 * T1_INT, open: 2433.5, high: 2434.5, low: 2431.0, close: 2431.5 },
    { timestamp: T3_START + 22 * T1_INT, open: 2431.5, high: 2432.5, low: 2429.5, close: 2430.0 },
    // Phase 5: Second bottom (2429 — slightly lower than first)
    { timestamp: T3_START + 23 * T1_INT, open: 2430.0, high: 2431.0, low: 2428.5, close: 2429.0 }, // Bottom 2
    { timestamp: T3_START + 24 * T1_INT, open: 2429.0, high: 2431.5, low: 2428.8, close: 2431.0 },
    // Phase 6: Bounce — DECISION POINT
    { timestamp: T3_START + 25 * T1_INT, open: 2431.0, high: 2433.5, low: 2430.5, close: 2433.0 },
    { timestamp: T3_START + 26 * T1_INT, open: 2433.0, high: 2435.5, low: 2432.5, close: 2435.0 },
    // Phase 7: Breakout above neckline
    { timestamp: T3_START + 27 * T1_INT, open: 2435.0, high: 2438.0, low: 2434.5, close: 2437.5 },
    { timestamp: T3_START + 28 * T1_INT, open: 2437.5, high: 2440.5, low: 2437.0, close: 2440.0 },
    { timestamp: T3_START + 29 * T1_INT, open: 2440.0, high: 2443.0, low: 2439.5, close: 2442.5 },
    { timestamp: T3_START + 30 * T1_INT, open: 2442.5, high: 2445.0, low: 2442.0, close: 2444.5 },
    { timestamp: T3_START + 31 * T1_INT, open: 2444.5, high: 2447.0, low: 2444.0, close: 2446.5 },
    { timestamp: T3_START + 32 * T1_INT, open: 2446.5, high: 2449.0, low: 2446.0, close: 2448.5 },
    { timestamp: T3_START + 33 * T1_INT, open: 2448.5, high: 2451.0, low: 2448.0, close: 2450.5 },
    { timestamp: T3_START + 34 * T1_INT, open: 2450.5, high: 2452.5, low: 2449.5, close: 2452.0 },
    { timestamp: T3_START + 35 * T1_INT, open: 2452.0, high: 2454.0, low: 2451.0, close: 2453.5 },
    { timestamp: T3_START + 36 * T1_INT, open: 2453.5, high: 2455.5, low: 2453.0, close: 2455.0 },
    { timestamp: T3_START + 37 * T1_INT, open: 2455.0, high: 2457.0, low: 2454.5, close: 2456.5 },
    { timestamp: T3_START + 38 * T1_INT, open: 2456.5, high: 2458.5, low: 2456.0, close: 2458.0 },
    { timestamp: T3_START + 39 * T1_INT, open: 2458.0, high: 2460.0, low: 2457.5, close: 2459.5 },
  ],
  referenceZone: {
    entryLow: 2429.0,
    entryHigh: 2434.0,
    sl: 2424.0,
    tp: 2444.0,
    minRR: 2.0,
    direction: 'buy',
    setupType: 'double-bottom',
    fixedRiskPct: 1.0,
  },
  contextPrompt: 'Gold dropped from 2460 and found support at 2430 twice (double bottom). Price is bouncing from the second test. Neckline at 2440.',
  decisionIndex: 26,
};

// ─────────────────────────────────────────────────────────────────────
// Pack 4: News Spike / FOMO Trap (WAIT)
// XAUUSD M15 — Sudden spike, clearly not a setup, wait is the right call
// Base: 2024-07-25 08:00 UTC
// ─────────────────────────────────────────────────────────────────────
const T4_START = 1721894400000;

export const NEWS_SPIKE_PACK: ScenarioPack = {
  id: 'xauusd-m15-news-001',
  symbol: 'XAUUSD',
  timeframe: 'M15',
  candles: [
    // Phase 1: Quiet range 2420-2425
    { timestamp: T4_START + 0 * T1_INT, open: 2422.0, high: 2423.5, low: 2421.0, close: 2423.0 },
    { timestamp: T4_START + 1 * T1_INT, open: 2423.0, high: 2424.5, low: 2422.0, close: 2424.0 },
    { timestamp: T4_START + 2 * T1_INT, open: 2424.0, high: 2425.0, low: 2422.5, close: 2422.8 },
    { timestamp: T4_START + 3 * T1_INT, open: 2422.8, high: 2424.0, low: 2421.5, close: 2423.5 },
    { timestamp: T4_START + 4 * T1_INT, open: 2423.5, high: 2425.0, low: 2422.8, close: 2424.5 },
    { timestamp: T4_START + 5 * T1_INT, open: 2424.5, high: 2425.5, low: 2423.0, close: 2423.8 },
    { timestamp: T4_START + 6 * T1_INT, open: 2423.8, high: 2424.8, low: 2422.0, close: 2422.5 },
    { timestamp: T4_START + 7 * T1_INT, open: 2422.5, high: 2424.0, low: 2421.5, close: 2423.5 },
    { timestamp: T4_START + 8 * T1_INT, open: 2423.5, high: 2425.0, low: 2423.0, close: 2424.5 },
    { timestamp: T4_START + 9 * T1_INT, open: 2424.5, high: 2425.5, low: 2423.5, close: 2424.0 },
    // Phase 2: News spike — sudden 25-point candle
    { timestamp: T4_START + 10 * T1_INT, open: 2424.0, high: 2435.0, low: 2423.5, close: 2433.0 }, // SPIKE!
    { timestamp: T4_START + 11 * T1_INT, open: 2433.0, high: 2440.0, low: 2432.5, close: 2438.5 },
    { timestamp: T4_START + 12 * T1_INT, open: 2438.5, high: 2442.0, low: 2437.0, close: 2440.0 },
    // Phase 3: Sharp rejection — price drops back
    { timestamp: T4_START + 13 * T1_INT, open: 2440.0, high: 2440.5, low: 2435.0, close: 2435.5 },
    { timestamp: T4_START + 14 * T1_INT, open: 2435.5, high: 2436.5, low: 2431.0, close: 2431.5 },
    { timestamp: T4_START + 15 * T1_INT, open: 2431.5, high: 2432.5, low: 2427.0, close: 2427.5 },
    { timestamp: T4_START + 16 * T1_INT, open: 2427.5, high: 2428.5, low: 2423.0, close: 2423.5 },
    // Phase 4: Chaos, no clear direction — DECISION POINT
    { timestamp: T4_START + 17 * T1_INT, open: 2423.5, high: 2426.0, low: 2422.0, close: 2425.5 },
    { timestamp: T4_START + 18 * T1_INT, open: 2425.5, high: 2430.0, low: 2425.0, close: 2429.0 },
    { timestamp: T4_START + 19 * T1_INT, open: 2429.0, high: 2432.0, low: 2428.5, close: 2431.5 },
    // Phase 5: Further chop
    { timestamp: T4_START + 20 * T1_INT, open: 2431.5, high: 2432.5, low: 2427.0, close: 2427.5 },
    { timestamp: T4_START + 21 * T1_INT, open: 2427.5, high: 2428.5, low: 2424.0, close: 2424.5 },
    { timestamp: T4_START + 22 * T1_INT, open: 2424.5, high: 2426.0, low: 2422.0, close: 2422.5 },
    { timestamp: T4_START + 23 * T1_INT, open: 2422.5, high: 2425.0, low: 2421.5, close: 2424.5 },
    { timestamp: T4_START + 24 * T1_INT, open: 2424.5, high: 2426.5, low: 2423.0, close: 2425.5 },
    { timestamp: T4_START + 25 * T1_INT, open: 2425.5, high: 2427.0, low: 2424.0, close: 2426.0 },
    { timestamp: T4_START + 26 * T1_INT, open: 2426.0, high: 2428.0, low: 2425.0, close: 2427.5 },
    { timestamp: T4_START + 27 * T1_INT, open: 2427.5, high: 2429.0, low: 2426.5, close: 2428.5 },
    { timestamp: T4_START + 28 * T1_INT, open: 2428.5, high: 2430.0, low: 2427.5, close: 2429.0 },
    { timestamp: T4_START + 29 * T1_INT, open: 2429.0, high: 2431.0, low: 2428.5, close: 2430.5 },
    { timestamp: T4_START + 30 * T1_INT, open: 2430.5, high: 2432.0, low: 2429.5, close: 2431.0 },
    { timestamp: T4_START + 31 * T1_INT, open: 2431.0, high: 2433.0, low: 2430.0, close: 2432.5 },
  ],
  referenceZone: {
    entryLow: 2430.0,
    entryHigh: 2435.0,
    sl: 2420.0,
    tp: 2445.0,
    minRR: 1.5,
    direction: 'wait',
    setupType: 'news-spike',
    fixedRiskPct: 1.0,
  },
  contextPrompt: 'Gold just spiked 25 points on news data. Price is chaotic — no clear setup, no structure. Chasing now is gambling, not trading.',
  decisionIndex: 17,
};

// ─────────────────────────────────────────────────────────────────────
// Pack 5: Range Trading (BUY at support)
// XAUUSD M15 — Clear range 2400-2415, buy at bottom of range
// Base: 2024-08-01 08:00 UTC
// ─────────────────────────────────────────────────────────────────────
const T5_START = 1722508800000;

export const RANGE_TRADING_PACK: ScenarioPack = {
  id: 'xauusd-m15-range-001',
  symbol: 'XAUUSD',
  timeframe: 'M15',
  candles: [
    // Phase 1: Upper range ~2415
    { timestamp: T5_START + 0 * T1_INT, open: 2413.0, high: 2415.5, low: 2412.5, close: 2415.0 },
    { timestamp: T5_START + 1 * T1_INT, open: 2415.0, high: 2416.0, low: 2413.0, close: 2413.5 },
    { timestamp: T5_START + 2 * T1_INT, open: 2413.5, high: 2414.5, low: 2411.5, close: 2412.0 },
    { timestamp: T5_START + 3 * T1_INT, open: 2412.0, high: 2413.0, low: 2410.0, close: 2410.5 },
    { timestamp: T5_START + 4 * T1_INT, open: 2410.5, high: 2411.5, low: 2408.5, close: 2409.0 },
    { timestamp: T5_START + 5 * T1_INT, open: 2409.0, high: 2410.0, low: 2407.0, close: 2407.5 },
    { timestamp: T5_START + 6 * T1_INT, open: 2407.5, high: 2408.5, low: 2405.5, close: 2406.0 },
    // Phase 2: Lower range ~2400 (support)
    { timestamp: T5_START + 7 * T1_INT, open: 2406.0, high: 2407.0, low: 2404.0, close: 2404.5 },
    { timestamp: T5_START + 8 * T1_INT, open: 2404.5, high: 2405.5, low: 2402.5, close: 2403.0 },
    { timestamp: T5_START + 9 * T1_INT, open: 2403.0, high: 2404.0, low: 2401.5, close: 2402.0 },
    { timestamp: T5_START + 10 * T1_INT, open: 2402.0, high: 2403.5, low: 2400.5, close: 2401.0 }, // Near support
    { timestamp: T5_START + 11 * T1_INT, open: 2401.0, high: 2402.5, low: 2400.0, close: 2400.5 }, // Touch support
    { timestamp: T5_START + 12 * T1_INT, open: 2400.5, high: 2402.0, low: 2400.0, close: 2401.5 },
    // Phase 3: Bounce from support
    { timestamp: T5_START + 13 * T1_INT, open: 2401.5, high: 2404.0, low: 2401.0, close: 2403.5 },
    { timestamp: T5_START + 14 * T1_INT, open: 2403.5, high: 2406.0, low: 2403.0, close: 2405.5 },
    { timestamp: T5_START + 15 * T1_INT, open: 2405.5, high: 2408.0, low: 2405.0, close: 2407.5 },
    { timestamp: T5_START + 16 * T1_INT, open: 2407.5, high: 2410.0, low: 2407.0, close: 2409.5 },
    { timestamp: T5_START + 17 * T1_INT, open: 2409.5, high: 2412.0, low: 2409.0, close: 2411.5 },
    { timestamp: T5_START + 18 * T1_INT, open: 2411.5, high: 2414.0, low: 2411.0, close: 2413.5 },
    { timestamp: T5_START + 19 * T1_INT, open: 2413.5, high: 2415.5, low: 2413.0, close: 2415.0 }, // Back to top
    // Phase 4: Decline again
    { timestamp: T5_START + 20 * T1_INT, open: 2415.0, high: 2415.5, low: 2412.5, close: 2413.0 },
    { timestamp: T5_START + 21 * T1_INT, open: 2413.0, high: 2414.0, low: 2411.0, close: 2411.5 },
    { timestamp: T5_START + 22 * T1_INT, open: 2411.5, high: 2412.5, low: 2409.5, close: 2410.0 },
    { timestamp: T5_START + 23 * T1_INT, open: 2410.0, high: 2411.0, low: 2408.0, close: 2408.5 },
    { timestamp: T5_START + 24 * T1_INT, open: 2408.5, high: 2409.5, low: 2406.5, close: 2407.0 },
    { timestamp: T5_START + 25 * T1_INT, open: 2407.0, high: 2408.0, low: 2405.0, close: 2405.5 },
    { timestamp: T5_START + 26 * T1_INT, open: 2405.5, high: 2406.5, low: 2403.5, close: 2404.0 },
    { timestamp: T5_START + 27 * T1_INT, open: 2404.0, high: 2405.0, low: 2402.5, close: 2403.0 },
    // Phase 5: Touch support again — DECISION POINT
    { timestamp: T5_START + 28 * T1_INT, open: 2403.0, high: 2404.0, low: 2401.5, close: 2402.0 },
    { timestamp: T5_START + 29 * T1_INT, open: 2402.0, high: 2403.0, low: 2400.5, close: 2401.0 }, // At support
    // Phase 6: Bounce from support again
    { timestamp: T5_START + 30 * T1_INT, open: 2401.0, high: 2403.5, low: 2400.8, close: 2403.0 },
    { timestamp: T5_START + 31 * T1_INT, open: 2403.0, high: 2405.5, low: 2402.5, close: 2405.0 },
    { timestamp: T5_START + 32 * T1_INT, open: 2405.0, high: 2407.5, low: 2404.5, close: 2407.0 },
    { timestamp: T5_START + 33 * T1_INT, open: 2407.0, high: 2409.5, low: 2406.5, close: 2409.0 },
    { timestamp: T5_START + 34 * T1_INT, open: 2409.0, high: 2411.5, low: 2408.5, close: 2411.0 },
    { timestamp: T5_START + 35 * T1_INT, open: 2411.0, high: 2413.5, low: 2410.5, close: 2413.0 },
    { timestamp: T5_START + 36 * T1_INT, open: 2413.0, high: 2415.5, low: 2412.5, close: 2415.0 },
  ],
  referenceZone: {
    entryLow: 2400.0,
    entryHigh: 2404.0,
    sl: 2395.0,
    tp: 2413.0,
    minRR: 2.0,
    direction: 'buy',
    setupType: 'range-support',
    fixedRiskPct: 1.0,
  },
  contextPrompt: 'Gold is in a clear range between 2400 (support) and 2415 (resistance). Price is testing support again. Buy at support, sell at resistance.',
  decisionIndex: 29,
};

// ─────────────────────────────────────────────────────────────────────
// Export all packs
// ─────────────────────────────────────────────────────────────────────
export type ExtendedReferenceZone = ScenarioPack['referenceZone'];

export const ALL_PACKS: ScenarioPack[] = [
  // Original MVP pack
  {
    id: 'xauusd-m15-pullback-001',
    symbol: 'XAUUSD',
    timeframe: 'M15',
    candles: (() => {
      const S = 1718620800000;
      const I = 900000;
      return [
        { timestamp: S + 0 * I, open: 2395.0, high: 2396.2, low: 2394.3, close: 2395.8 },
        { timestamp: S + 1 * I, open: 2395.8, high: 2396.9, low: 2395.2, close: 2396.5 },
        { timestamp: S + 2 * I, open: 2396.5, high: 2397.8, low: 2395.8, close: 2397.5 },
        { timestamp: S + 3 * I, open: 2397.5, high: 2398.2, low: 2396.8, close: 2397.2 },
        { timestamp: S + 4 * I, open: 2397.2, high: 2398.9, low: 2396.9, close: 2398.7 },
        { timestamp: S + 5 * I, open: 2398.7, high: 2400.1, low: 2398.3, close: 2399.8 },
        { timestamp: S + 6 * I, open: 2399.8, high: 2401.2, low: 2399.2, close: 2400.9 },
        { timestamp: S + 7 * I, open: 2400.9, high: 2401.8, low: 2400.1, close: 2401.5 },
        { timestamp: S + 8 * I, open: 2401.5, high: 2403.0, low: 2400.8, close: 2402.8 },
        { timestamp: S + 9 * I, open: 2402.8, high: 2403.5, low: 2401.9, close: 2402.2 },
        { timestamp: S + 10 * I, open: 2402.2, high: 2404.2, low: 2402.0, close: 2404.0 },
        { timestamp: S + 11 * I, open: 2404.0, high: 2405.5, low: 2403.5, close: 2405.2 },
        { timestamp: S + 12 * I, open: 2405.2, high: 2406.3, low: 2404.5, close: 2406.0 },
        { timestamp: S + 13 * I, open: 2406.0, high: 2406.8, low: 2405.0, close: 2405.5 },
        { timestamp: S + 14 * I, open: 2405.5, high: 2406.1, low: 2404.8, close: 2405.0 },
        { timestamp: S + 15 * I, open: 2405.0, high: 2405.3, low: 2402.8, close: 2403.0 },
        { timestamp: S + 16 * I, open: 2403.0, high: 2403.5, low: 2400.5, close: 2400.8 },
        { timestamp: S + 17 * I, open: 2400.8, high: 2401.5, low: 2398.0, close: 2398.3 },
        { timestamp: S + 18 * I, open: 2398.3, high: 2399.0, low: 2396.5, close: 2397.0 },
        { timestamp: S + 19 * I, open: 2397.0, high: 2398.5, low: 2395.5, close: 2396.0 },
        { timestamp: S + 20 * I, open: 2396.0, high: 2396.5, low: 2393.0, close: 2393.5 },
        { timestamp: S + 21 * I, open: 2393.5, high: 2394.0, low: 2390.5, close: 2391.0 },
        { timestamp: S + 22 * I, open: 2391.0, high: 2392.0, low: 2388.5, close: 2389.0 },
        { timestamp: S + 23 * I, open: 2389.0, high: 2390.5, low: 2387.0, close: 2387.5 },
        { timestamp: S + 24 * I, open: 2387.5, high: 2388.0, low: 2385.0, close: 2385.5 },
        { timestamp: S + 25 * I, open: 2385.5, high: 2386.5, low: 2383.0, close: 2383.5 },
        { timestamp: S + 26 * I, open: 2383.5, high: 2384.5, low: 2381.5, close: 2382.0 },
        { timestamp: S + 27 * I, open: 2382.0, high: 2383.5, low: 2380.5, close: 2382.8 },
        { timestamp: S + 28 * I, open: 2382.8, high: 2384.0, low: 2381.0, close: 2381.5 },
        { timestamp: S + 29 * I, open: 2381.5, high: 2383.0, low: 2380.2, close: 2382.5 },
        { timestamp: S + 30 * I, open: 2382.5, high: 2383.8, low: 2381.0, close: 2381.8 },
        { timestamp: S + 31 * I, open: 2381.8, high: 2383.0, low: 2380.5, close: 2382.5 },
        { timestamp: S + 32 * I, open: 2382.5, high: 2383.2, low: 2381.5, close: 2382.0 },
        { timestamp: S + 33 * I, open: 2382.0, high: 2383.5, low: 2381.0, close: 2383.0 },
        { timestamp: S + 34 * I, open: 2383.0, high: 2383.8, low: 2381.5, close: 2381.8 },
        { timestamp: S + 35 * I, open: 2381.8, high: 2382.5, low: 2380.3, close: 2380.8 },
        { timestamp: S + 36 * I, open: 2380.8, high: 2382.0, low: 2380.2, close: 2381.5 },
        { timestamp: S + 37 * I, open: 2381.5, high: 2382.5, low: 2380.8, close: 2382.2 },
        { timestamp: S + 38 * I, open: 2382.2, high: 2383.0, low: 2381.2, close: 2381.5 },
        { timestamp: S + 39 * I, open: 2381.5, high: 2382.8, low: 2380.5, close: 2382.5 },
        { timestamp: S + 40 * I, open: 2382.5, high: 2383.2, low: 2381.8, close: 2382.0 },
        { timestamp: S + 41 * I, open: 2382.0, high: 2383.5, low: 2381.0, close: 2383.2 },
        { timestamp: S + 42 * I, open: 2383.2, high: 2383.8, low: 2382.0, close: 2382.5 },
        { timestamp: S + 43 * I, open: 2382.5, high: 2383.0, low: 2381.0, close: 2381.5 },
        { timestamp: S + 44 * I, open: 2381.5, high: 2382.5, low: 2380.5, close: 2382.0 },
        { timestamp: S + 45 * I, open: 2382.0, high: 2383.2, low: 2381.2, close: 2382.8 },
        { timestamp: S + 46 * I, open: 2382.8, high: 2383.5, low: 2381.8, close: 2382.2 },
        { timestamp: S + 47 * I, open: 2382.2, high: 2382.8, low: 2380.8, close: 2381.2 },
        { timestamp: S + 48 * I, open: 2381.2, high: 2382.5, low: 2380.5, close: 2382.0 },
        { timestamp: S + 49 * I, open: 2382.0, high: 2382.8, low: 2381.0, close: 2381.5 },
        { timestamp: S + 50 * I, open: 2381.5, high: 2382.2, low: 2380.5, close: 2381.8 },
        { timestamp: S + 51 * I, open: 2381.8, high: 2382.5, low: 2380.8, close: 2381.2 },
        { timestamp: S + 52 * I, open: 2381.2, high: 2382.0, low: 2380.5, close: 2381.5 },
        { timestamp: S + 53 * I, open: 2381.5, high: 2382.3, low: 2381.0, close: 2381.8 },
        { timestamp: S + 54 * I, open: 2381.8, high: 2382.5, low: 2381.2, close: 2382.2 },
        { timestamp: S + 55 * I, open: 2382.2, high: 2384.5, low: 2381.5, close: 2384.0 },
        { timestamp: S + 56 * I, open: 2384.0, high: 2386.5, low: 2383.5, close: 2386.2 },
        { timestamp: S + 57 * I, open: 2386.2, high: 2388.0, low: 2385.5, close: 2387.8 },
        { timestamp: S + 58 * I, open: 2387.8, high: 2389.5, low: 2387.0, close: 2389.2 },
        { timestamp: S + 59 * I, open: 2389.2, high: 2391.0, low: 2388.5, close: 2390.8 },
        { timestamp: S + 60 * I, open: 2390.8, high: 2392.5, low: 2390.0, close: 2392.0 },
        { timestamp: S + 61 * I, open: 2392.0, high: 2393.5, low: 2391.5, close: 2393.2 },
        { timestamp: S + 62 * I, open: 2393.2, high: 2394.5, low: 2392.8, close: 2394.0 },
        { timestamp: S + 63 * I, open: 2394.0, high: 2395.5, low: 2393.5, close: 2395.2 },
        { timestamp: S + 64 * I, open: 2395.2, high: 2396.5, low: 2394.8, close: 2396.0 },
        { timestamp: S + 65 * I, open: 2396.0, high: 2397.8, low: 2395.2, close: 2397.5 },
        { timestamp: S + 66 * I, open: 2397.5, high: 2399.0, low: 2396.8, close: 2398.5 },
        { timestamp: S + 67 * I, open: 2398.5, high: 2400.0, low: 2397.8, close: 2399.5 },
        { timestamp: S + 68 * I, open: 2399.5, high: 2401.0, low: 2399.0, close: 2400.8 },
        { timestamp: S + 69 * I, open: 2400.8, high: 2402.0, low: 2400.2, close: 2401.5 },
        { timestamp: S + 70 * I, open: 2401.5, high: 2403.0, low: 2400.8, close: 2402.5 },
        { timestamp: S + 71 * I, open: 2402.5, high: 2403.5, low: 2401.8, close: 2402.0 },
        { timestamp: S + 72 * I, open: 2402.0, high: 2403.8, low: 2401.5, close: 2403.5 },
        { timestamp: S + 73 * I, open: 2403.5, high: 2405.0, low: 2403.0, close: 2404.5 },
        { timestamp: S + 74 * I, open: 2404.5, high: 2405.5, low: 2403.5, close: 2404.0 },
        { timestamp: S + 75 * I, open: 2404.0, high: 2406.0, low: 2403.8, close: 2405.8 },
        { timestamp: S + 76 * I, open: 2405.8, high: 2407.0, low: 2405.0, close: 2406.5 },
        { timestamp: S + 77 * I, open: 2406.5, high: 2407.8, low: 2405.5, close: 2406.0 },
        { timestamp: S + 78 * I, open: 2406.0, high: 2408.0, low: 2405.5, close: 2407.5 },
        { timestamp: S + 79 * I, open: 2407.5, high: 2409.0, low: 2406.8, close: 2408.5 },
      ];
    })(),
    referenceZone: {
      entryLow: 2380.0,
      entryHigh: 2384.0,
      sl: 2376.0,
      tp: 2396.0,
      minRR: 2.0,
      direction: 'buy',
      setupType: 'pullback-support',
      fixedRiskPct: 1.0,
    },
    contextPrompt: 'Gold pulled back to the 2380 support after a strong up move. Price is coiling above the level.',
    decisionIndex: 54,
  },
  TREND_CONTINUATION_PACK,
  HEAD_SHOULDERS_PACK,
  DOUBLE_BOTTOM_PACK,
  NEWS_SPIKE_PACK,
  RANGE_TRADING_PACK,
];
