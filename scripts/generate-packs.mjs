#!/usr/bin/env node
/**
 * generate-packs.mjs
 * 
 * Generates 100 realistic XAUUSD M15 scenario packs based on real candlestick patterns.
 * Each pack: 55-75 candles, 4 phases (context → pattern → decision → outcome).
 * 
 * Run: node scripts/generate-packs.mjs > src/data/all-scenario-packs.ts
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function round2(n) {
  return Math.round(n * 100) / 100;
}

function rng(min, max) {
  return round2(rand(min, max));
}

/** Create a single candle */
function c(ts, o, h, l, cl) {
  // Ensure OHLC validity
  const hi = Math.max(o, h, l, cl);
  const lo = Math.min(o, h, l, cl);
  return { timestamp: ts, open: round2(o), high: round2(hi), low: round2(lo), close: round2(cl) };
}

/** Create N candles in a trending direction */
function trendCandles(startTs, interval, startPrice, direction, count, volatility = 3) {
  const candles = [];
  let price = startPrice;
  const dir = direction === 'up' ? 1 : -1;
  for (let i = 0; i < count; i++) {
    const move = dir * rand(1, volatility);
    const body = rand(1.5, volatility);
    const o = price;
    const cl = price + dir * body + rand(-1, 1);
    const h = Math.max(o, cl) + rng(0.5, 2);
    const l = Math.min(o, cl) - rng(0.5, 2);
    candles.push(c(startTs + i * interval, o, h, l, cl));
    price = round2(cl);
  }
  return candles;
}

/** Create N sideways/ranging candles */
function rangeCandles(startTs, interval, centerPrice, count, rangeSize = 8) {
  const candles = [];
  let price = centerPrice - rangeSize / 2;
  for (let i = 0; i < count; i++) {
    const move = rand(-rangeSize / 4, rangeSize / 4);
    const o = price;
    const cl = price + move;
    const h = Math.max(o, cl) + rng(0.3, 1.5);
    const l = Math.min(o, cl) - rng(0.3, 1.5);
    candles.push(c(startTs + i * interval, o, h, l, cl));
    price = round2(cl);
  }
  return candles;
}

/** Create a doji candle */
function dojiCandle(ts, price, wickUp = 3, wickDown = 3) {
  return c(ts, price, price + wickUp, price - wickDown, price + rng(-0.3, 0.3));
}

/** Create a hammer (bullish reversal) */
function hammerCandle(ts, price, direction = 'bullish') {
  if (direction === 'bullish') {
    // Small body at top, long lower wick
    const body = rng(0.5, 1.5);
    const upperWick = rng(0.3, 1);
    const lowerWick = rng(4, 8);
    return c(ts, price, price + body + upperWick, price - lowerWick, price + body);
  } else {
    // Hanging man (bearish)
    const body = rng(0.5, 1.5);
    const upperWick = rng(0.3, 1);
    const lowerWick = rng(4, 8);
    return c(ts, price, price + body + upperWick, price - lowerWick, price + body);
  }
}

/** Create a shooting star (bearish reversal) */
function shootingStarCandle(ts, price) {
  const body = rng(0.5, 1.5);
  const upperWick = rng(5, 9);
  const lowerWick = rng(0.3, 1);
  return c(ts, price, price + body + upperWick, price - lowerWick, price + body);
}

/** Create a marubozu (strong body, minimal wicks) */
function marubozu(ts, price, direction, bodySize = 4) {
  if (direction === 'bullish') {
    return c(ts, price, price + bodySize + 0.1, price - 0.1, price + bodySize);
  } else {
    return c(ts, price, price + 0.1, price - bodySize - 0.1, price - bodySize);
  }
}

/** Create spinning top (small body, equal wicks) */
function spinningTop(ts, price) {
  const body = rng(0.3, 1);
  const wick = rng(2, 4);
  const dir = Math.random() > 0.5 ? 1 : -1;
  const mid = price + dir * body / 2;
  return c(ts, mid - body / 2, mid + wick, mid - wick, mid + body / 2);
}

/** Create engulfing pattern (2 candles) */
function engulfing(ts, interval, price, direction) {
  if (direction === 'bullish') {
    // Bearish candle then larger bullish candle
    const body1 = rng(2, 4);
    const c1 = c(ts, price, price + 0.5, price - body1 - 0.5, price - body1);
    const body2 = rng(body1 + 1, body1 + 4);
    const c2 = c(ts + interval, price - body1, price - body1 + body2 + 1, price - body1 - 0.5, price - body1 + body2);
    return [c1, c2];
  } else {
    const body1 = rng(2, 4);
    const c1 = c(ts, price, price + body1 + 0.5, price - 0.5, price + body1);
    const body2 = rng(body1 + 1, body1 + 4);
    const c2 = c(ts + interval, price + body1, price + body1 + 0.5, price + body1 - body2 - 1, price + body1 - body2);
    return [c1, c2];
  }
}

/** Create harami pattern (2 candles) */
function harami(ts, interval, price, direction) {
  if (direction === 'bullish') {
    const body1 = rng(3, 5);
    const c1 = c(ts, price, price + 0.5, price - body1 - 0.5, price - body1);
    const body2 = rng(0.5, 1.5);
    const mid = price - body1 / 2;
    const c2 = c(ts + interval, mid - body2 / 2, mid + body2, mid - body2, mid + body2 / 2);
    return [c1, c2];
  } else {
    const body1 = rng(3, 5);
    const c1 = c(ts, price, price + body1 + 0.5, price - 0.5, price + body1);
    const body2 = rng(0.5, 1.5);
    const mid = price + body1 / 2;
    const c2 = c(ts + interval, mid - body2 / 2, mid + body2, mid - body2, mid + body2 / 2);
    return [c1, c2];
  }
}

/** Morning Star (3 candles) */
function morningStar(ts, interval, price) {
  const body1 = rng(3, 5);
  const c1 = c(ts, price, price + 0.3, price - body1 - 0.3, price - body1);
  const gap = rng(0.5, 2);
  const c2 = dojiCandle(ts + interval, price - body1 - gap, 2, 2);
  const body3 = rng(3, 5);
  const c3 = c(ts + 2 * interval, price - body1 - gap, price - body1 + body3 + 1, price - body1 - gap - 0.5, price - body1 + body3);
  return [c1, c2, c3];
}

/** Evening Star (3 candles) */
function eveningStar(ts, interval, price) {
  const body1 = rng(3, 5);
  const c1 = c(ts, price, price + body1 + 0.3, price - 0.3, price + body1);
  const gap = rng(0.5, 2);
  const c2 = dojiCandle(ts + interval, price + body1 + gap, 2, 2);
  const body3 = rng(3, 5);
  const c3 = c(ts + 2 * interval, price + body1 + gap, price + body1 + gap + 0.5, price + body1 - body3, price + body1 - body3);
  return [c1, c2, c3];
}

/** Three White Soldiers */
function threeWhiteSoldiers(ts, interval, price) {
  const candles = [];
  let p = price;
  for (let i = 0; i < 3; i++) {
    const body = rng(2, 4);
    candles.push(c(ts + i * interval, p, p + body + rng(0.5, 1.5), p - rng(0.3, 0.8), p + body));
    p = p + body + rng(0.5, 1);
  }
  return candles;
}

/** Three Black Crows */
function threeBlackCrows(ts, interval, price) {
  const candles = [];
  let p = price;
  for (let i = 0; i < 3; i++) {
    const body = rng(2, 4);
    candles.push(c(ts + i * interval, p, p + rng(0.3, 0.8), p - body - rng(0.5, 1.5), p - body));
    p = p - body - rng(0.5, 1);
  }
  return candles;
}

/** Piercing Line (2 candles) */
function piercingLine(ts, interval, price) {
  const body1 = rng(3, 5);
  const c1 = c(ts, price, price + 0.3, price - body1 - 0.3, price - body1);
  const gap = rng(0.5, 2);
  const open2 = price - body1 - gap;
  const close2 = price - body1 / 2; // closes above midpoint
  const c2 = c(ts + interval, open2, open2 + rng(0.5, 1.5), open2 - rng(0.5, 1.5), close2);
  return [c1, c2];
}

/** Dark Cloud Cover (2 candles) */
function darkCloudCover(ts, interval, price) {
  const body1 = rng(3, 5);
  const c1 = c(ts, price, price + body1 + 0.3, price - 0.3, price + body1);
  const gap = rng(0.5, 2);
  const open2 = price + body1 + gap;
  const close2 = price + body1 / 2; // closes below midpoint
  const c2 = c(ts + interval, open2, open2 + rng(0.5, 1.5), open2 - rng(0.5, 1.5), close2);
  return [c1, c2];
}

/** Tweezer Top (2 candles at same high) */
function tweezerTop(ts, interval, price) {
  const body1 = rng(2, 4);
  const c1 = c(ts, price, price + body1 + 2, price - 0.5, price + body1);
  const c2 = c(ts + interval, price + body1 - 1, price + body1 + 2, price + body1 - body1 - 3, price + body1 - body1);
  return [c1, c2];
}

/** Tweezer Bottom (2 candles at same low) */
function tweezerBottom(ts, interval, price) {
  const body1 = rng(2, 4);
  const c1 = c(ts, price, price + 0.5, price - body1 - 2, price - body1);
  const c2 = c(ts + interval, price - body1 + 1, price + 3, price - body1 - 2, price - body1 + body1);
  return [c1, c2];
}

/** Rising Three Methods (bullish continuation) */
function risingThreeMethods(ts, interval, price) {
  const candles = [];
  let p = price;
  // Big bullish
  const body1 = rng(3, 5);
  candles.push(c(ts, p, p + body1 + 0.5, p - 0.3, p + body1));
  p += body1;
  // 3 small bearish inside
  for (let i = 0; i < 3; i++) {
    const body = rng(0.5, 1.5);
    candles.push(c(ts + (i + 1) * interval, p, p + rng(0.3, 1), p - body - rng(0.3, 1), p - body));
    p = p - body;
  }
  // Big bullish closing above first
  const lastBody = rng(3, 5);
  candles.push(c(ts + 4 * interval, p, p + lastBody + 1, p - 0.5, p + lastBody));
  return candles;
}

/** Falling Three Methods (bearish continuation) */
function fallingThreeMethods(ts, interval, price) {
  const candles = [];
  let p = price;
  const body1 = rng(3, 5);
  candles.push(c(ts, p, p + 0.3, p - body1 - 0.5, p - body1));
  p -= body1;
  for (let i = 0; i < 3; i++) {
    const body = rng(0.5, 1.5);
    candles.push(c(ts + (i + 1) * interval, p, p + body + rng(0.3, 1), p - rng(0.3, 1), p + body));
    p = p + body;
  }
  const lastBody = rng(3, 5);
  candles.push(c(ts + 4 * interval, p, p + 0.5, p - lastBody - 1, p - lastBody));
  return candles;
}

// ─── Pattern Definitions ────────────────────────────────────────────────────

const BASE_TS = 1719830400000; // 2024-07-01 08:00 UTC
const INTERVAL = 900000; // 15 min

/**
 * Each pattern definition:
 * - id, name, category
 * - direction: 'buy' | 'sell' | 'wait'
 * - setupType: human-readable
 * - contextPrompt: shown to user
 * - generate(startPrice): returns { candles, decisionIndex, entryZone, sl, tp }
 */
const PATTERNS = [
  // ═══ SINGLE CANDLE REVERSAL ═══
  {
    id: 'hammer-001', name: 'Hammer at Support', category: 'Single Candle Reversal',
    direction: 'buy', setupType: 'hammer-support',
    contextPrompt: 'Price has been dropping for several candles. A hammer forms at a key support level.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const hammer = [hammerCandle(8, p - 32, 'bullish')];
      const c2 = trendCandles(9, 1, p - 32 + 2, 'up', 8, 4);
      return [...c1, ...hammer, ...c2];
    }
  },
  {
    id: 'hanging-man-001', name: 'Hanging Man at Resistance', category: 'Single Candle Reversal',
    direction: 'sell', setupType: 'hanging-man-resistance',
    contextPrompt: 'Price rallied into resistance. A hanging man candle warns of reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const hm = [hammerCandle(8, p + 32, 'bearish')];
      const c2 = trendCandles(9, 1, p + 32 + 2, 'down', 8, 4);
      return [...c1, ...hm, ...c2];
    }
  },
  {
    id: 'shooting-star-001', name: 'Shooting Star Reversal', category: 'Single Candle Reversal',
    direction: 'sell', setupType: 'shooting-star',
    contextPrompt: 'Strong uptrend meets overhead resistance. Shooting star signals potential reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 10, 4);
      const ss = [shootingStarCandle(10, p + 38)];
      const c2 = trendCandles(11, 1, p + 38, 'down', 10, 4);
      return [...c1, ...ss, ...c2];
    }
  },
  {
    id: 'inverted-hammer-001', name: 'Inverted Hammer at Bottom', category: 'Single Candle Reversal',
    direction: 'buy', setupType: 'inverted-hammer',
    contextPrompt: 'After extended decline, an inverted hammer appears suggesting buyers are testing.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 10, 4);
      const ih = [c(10, p - 38, p - 38 + 7, p - 38 - 1, p - 38 + 0.5)];
      const c2 = trendCandles(11, 1, p - 38 + 1, 'up', 10, 4);
      return [...c1, ...ih, ...c2];
    }
  },
  {
    id: 'dragonfly-doji-001', name: 'Dragonfly Doji Reversal', category: 'Single Candle Reversal',
    direction: 'buy', setupType: 'dragonfly-doji',
    contextPrompt: 'Downtrend exhaustion. Dragonfly doji shows sellers lost control at the lows.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const dd = [dojiCandle(8, p - 32, 0.5, 6)];
      const c2 = trendCandles(9, 1, p - 32 + 1, 'up', 8, 4);
      return [...c1, ...dd, ...c2];
    }
  },
  {
    id: 'gravestone-doji-001', name: 'Gravestone Doji Reversal', category: 'Single Candle Reversal',
    direction: 'sell', setupType: 'gravestone-doji',
    contextPrompt: 'Uptrend exhaustion. Gravestone doji shows buyers lost control at the highs.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const gd = [dojiCandle(8, p + 32, 6, 0.5)];
      const c2 = trendCandles(9, 1, p + 32 - 1, 'down', 8, 4);
      return [...c1, ...gd, ...c2];
    }
  },
  {
    id: 'long-legged-doji-001', name: 'Long-legged Doji Indecision', category: 'Single Candle Reversal',
    direction: 'wait', setupType: 'long-legged-doji',
    contextPrompt: 'After a strong move, a long-legged doji shows extreme indecision. Wait for confirmation.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 10, 4);
      const ll = [dojiCandle(10, p + 38, 6, 6)];
      const c2 = rangeCandles(11, 1, p + 38, 8, 10);
      return [...c1, ...ll, ...c2];
    }
  },
  {
    id: 'bullish-marubozu-001', name: 'Bullish Marubozu Breakout', category: 'Single Candle Reversal',
    direction: 'buy', setupType: 'marubozu-breakout',
    contextPrompt: 'Price consolidating near resistance. A bullish marubozu breaks out decisively.',
    generate: (p) => {
      const c1 = rangeCandles(0, 1, p, 10, 8);
      const mb = [marubozu(10, p - 2, 'bullish', 5)];
      const c2 = trendCandles(11, 1, p + 3, 'up', 10, 4);
      return [...c1, ...mb, ...c2];
    }
  },
  {
    id: 'bearish-marubozu-001', name: 'Bearish Marubozu Breakdown', category: 'Single Candle Reversal',
    direction: 'sell', setupType: 'marubozu-breakdown',
    contextPrompt: 'Price consolidating near support. A bearish marubozu breaks down decisively.',
    generate: (p) => {
      const c1 = rangeCandles(0, 1, p, 10, 8);
      const mb = [marubozu(10, p + 2, 'bearish', 5)];
      const c2 = trendCandles(11, 1, p - 3, 'down', 10, 4);
      return [...c1, ...mb, ...c2];
    }
  },
  {
    id: 'spinning-top-001', name: 'Spinning Top Consolidation', category: 'Single Candle Reversal',
    direction: 'wait', setupType: 'spinning-top',
    contextPrompt: 'Price at a crossroads. Multiple spinning tops show market is undecided.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 5, 3);
      const spins = Array.from({ length: 4 }, (_, i) => spinningTop(5 + i, p + 20 + rand(-3, 3)));
      const c2 = rangeCandles(9, 1, p + 20, 10, 12);
      return [...c1, ...spins, ...c2];
    }
  },

  // ═══ DOUBLE CANDLE REVERSAL ═══
  {
    id: 'bullish-engulfing-001', name: 'Bullish Engulfing', category: 'Double Candle Reversal',
    direction: 'buy', setupType: 'bullish-engulfing',
    contextPrompt: 'Downtrend ending. Bullish engulfing pattern — buyer momentum overwhelms sellers.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const eng = engulfing(8, 1, p - 32, 'bullish');
      const c2 = trendCandles(10, 1, p - 32 + 5, 'up', 10, 4);
      return [...c1, ...eng, ...c2];
    }
  },
  {
    id: 'bearish-engulfing-001', name: 'Bearish Engulfing', category: 'Double Candle Reversal',
    direction: 'sell', setupType: 'bearish-engulfing',
    contextPrompt: 'Uptrend ending. Bearish engulfing pattern — seller momentum overwhelms buyers.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const eng = engulfing(8, 1, p + 32, 'bearish');
      const c2 = trendCandles(10, 1, p + 32 - 5, 'down', 10, 4);
      return [...c1, ...eng, ...c2];
    }
  },
  {
    id: 'bullish-harami-001', name: 'Bullish Harami', category: 'Double Candle Reversal',
    direction: 'buy', setupType: 'bullish-harami',
    contextPrompt: 'After steady decline, bullish harami suggests sellers are losing steam.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const hr = harami(8, 1, p - 32, 'bullish');
      const c2 = trendCandles(10, 1, p - 32 + 2, 'up', 10, 3);
      return [...c1, ...hr, ...c2];
    }
  },
  {
    id: 'bearish-harami-001', name: 'Bearish Harami', category: 'Double Candle Reversal',
    direction: 'sell', setupType: 'bearish-harami',
    contextPrompt: 'After steady rally, bearish harami suggests buyers are losing steam.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const hr = harami(8, 1, p + 32, 'bearish');
      const c2 = trendCandles(10, 1, p + 32 - 2, 'down', 10, 3);
      return [...c1, ...hr, ...c2];
    }
  },
  {
    id: 'piercing-line-001', name: 'Piercing Line', category: 'Double Candle Reversal',
    direction: 'buy', setupType: 'piercing-line',
    contextPrompt: 'Bearish trend hits support. Piercing line — gap down but buyers close above midpoint.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 10, 4);
      const pl = piercingLine(10, 1, p - 40);
      const c2 = trendCandles(12, 1, p - 40 + 3, 'up', 8, 4);
      return [...c1, ...pl, ...c2];
    }
  },
  {
    id: 'dark-cloud-cover-001', name: 'Dark Cloud Cover', category: 'Double Candle Reversal',
    direction: 'sell', setupType: 'dark-cloud-cover',
    contextPrompt: 'Bullish trend hits resistance. Dark cloud cover — gap up but sellers close below midpoint.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 10, 4);
      const dc = darkCloudCover(10, 1, p + 40);
      const c2 = trendCandles(12, 1, p + 40 - 3, 'down', 8, 4);
      return [...c1, ...dc, ...c2];
    }
  },
  {
    id: 'tweezer-top-001', name: 'Tweezer Top Reversal', category: 'Double Candle Reversal',
    direction: 'sell', setupType: 'tweezer-top',
    contextPrompt: 'Uptrend meets strong resistance. Tweezer top — two candles with matching highs.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const tt = tweezerTop(8, 1, p + 30);
      const c2 = trendCandles(10, 1, p + 30 - 3, 'down', 10, 4);
      return [...c1, ...tt, ...c2];
    }
  },
  {
    id: 'tweezer-bottom-001', name: 'Tweezer Bottom Reversal', category: 'Double Candle Reversal',
    direction: 'buy', setupType: 'tweezer-bottom',
    contextPrompt: 'Downtrend meets strong support. Tweezer bottom — two candles with matching lows.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const tb = tweezerBottom(8, 1, p - 30);
      const c2 = trendCandles(10, 1, p - 30 + 3, 'up', 10, 4);
      return [...c1, ...tb, ...c2];
    }
  },
  {
    id: 'bullish-meeting-line-001', name: 'Bullish Meeting Lines', category: 'Double Candle Reversal',
    direction: 'buy', setupType: 'bullish-meeting-lines',
    contextPrompt: 'Downtrend with gap down. Both candles close at same level — sellers and buyers meet.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const c1b = c(8, p - 32, p - 32 + 0.5, p - 32 - 4, p - 32 - 3.5);
      const c2b = c(9, p - 32 - 5, p - 32 - 5 + 4, p - 32 - 5 - 0.5, p - 32 - 3.5);
      const c2 = trendCandles(10, 1, p - 32 - 3, 'up', 8, 4);
      return [...c1, c1b, c2b, ...c2];
    }
  },

  // ═══ TRIPLE CANDLE REVERSAL ═══
  {
    id: 'morning-star-001', name: 'Morning Star', category: 'Triple Candle Reversal',
    direction: 'buy', setupType: 'morning-star',
    contextPrompt: 'Extended decline followed by indecision. Morning star signals bullish reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 10, 4);
      const ms = morningStar(10, 1, p - 40);
      const c2 = trendCandles(13, 1, p - 40 + 4, 'up', 10, 4);
      return [...c1, ...ms, ...c2];
    }
  },
  {
    id: 'evening-star-001', name: 'Evening Star', category: 'Triple Candle Reversal',
    direction: 'sell', setupType: 'evening-star',
    contextPrompt: 'Extended rally followed by indecision. Evening star signals bearish reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 10, 4);
      const es = eveningStar(10, 1, p + 40);
      const c2 = trendCandles(13, 1, p + 40 - 4, 'down', 10, 4);
      return [...c1, ...es, ...c2];
    }
  },
  {
    id: 'three-white-soldiers-001', name: 'Three White Soldiers', category: 'Triple Candle Reversal',
    direction: 'buy', setupType: 'three-white-soldiers',
    contextPrompt: 'Three strong bullish candles closing higher. Strong bullish confirmation.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const ws = threeWhiteSoldiers(8, 1, p - 32);
      const c2 = trendCandles(11, 1, p - 32 + 10, 'up', 10, 4);
      return [...c1, ...ws, ...c2];
    }
  },
  {
    id: 'three-black-crows-001', name: 'Three Black Crows', category: 'Triple Candle Reversal',
    direction: 'sell', setupType: 'three-black-crows',
    contextPrompt: 'Three strong bearish candles closing lower. Strong bearish confirmation.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const bc = threeBlackCrows(8, 1, p + 32);
      const c2 = trendCandles(11, 1, p + 32 - 10, 'down', 10, 4);
      return [...c1, ...bc, ...c2];
    }
  },
  {
    id: 'three-inside-up-001', name: 'Three Inside Up', category: 'Triple Candle Reversal',
    direction: 'buy', setupType: 'three-inside-up',
    contextPrompt: 'Bullish harami followed by confirmation candle. Three inside up pattern complete.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const hr = harami(8, 1, p - 32, 'bullish');
      const confirm = c(10, p - 32 + 2, p - 32 + 5, p - 32 + 1, p - 32 + 4);
      const c2 = trendCandles(11, 1, p - 32 + 5, 'up', 10, 4);
      return [...c1, ...hr, confirm, ...c2];
    }
  },
  {
    id: 'three-inside-down-001', name: 'Three Inside Down', category: 'Triple Candle Reversal',
    direction: 'sell', setupType: 'three-inside-down',
    contextPrompt: 'Bearish harami followed by confirmation candle. Three inside down pattern complete.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const hr = harami(8, 1, p + 32, 'bearish');
      const confirm = c(10, p + 32 - 2, p + 32 - 1, p + 32 - 5, p + 32 - 4);
      const c2 = trendCandles(11, 1, p + 32 - 5, 'down', 10, 4);
      return [...c1, ...hr, confirm, ...c2];
    }
  },
  {
    id: 'three-outside-up-001', name: 'Three Outside Up', category: 'Triple Candle Reversal',
    direction: 'buy', setupType: 'three-outside-up',
    contextPrompt: 'Bullish engulfing followed by higher close. Three outside up confirms reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const eng = engulfing(8, 1, p - 32, 'bullish');
      const confirm = c(10, p - 32 + 5, p - 32 + 8, p - 32 + 4, p - 32 + 7);
      const c2 = trendCandles(11, 1, p - 32 + 8, 'up', 10, 4);
      return [...c1, ...eng, confirm, ...c2];
    }
  },
  {
    id: 'three-outside-down-001', name: 'Three Outside Down', category: 'Triple Candle Reversal',
    direction: 'sell', setupType: 'three-outside-down',
    contextPrompt: 'Bearish engulfing followed by lower close. Three outside down confirms reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const eng = engulfing(8, 1, p + 32, 'bearish');
      const confirm = c(10, p + 32 - 5, p + 32 - 4, p + 32 - 8, p + 32 - 7);
      const c2 = trendCandles(11, 1, p + 32 - 8, 'down', 10, 4);
      return [...c1, ...eng, confirm, ...c2];
    }
  },
  {
    id: 'abandoned-baby-bull-001', name: 'Bullish Abandoned Baby', category: 'Triple Candle Reversal',
    direction: 'buy', setupType: 'abandoned-baby-bullish',
    contextPrompt: 'Rare pattern: bearish candle, gap-down doji, gap-up bullish candle. Strong reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const cb = c(8, p - 32, p - 32 + 0.5, p - 32 - 3.5, p - 32 - 3);
      const baby = dojiCandle(9, p - 32 - 5, 1.5, 1.5);
      const ca = c(10, p - 32 - 3, p - 32 + 3, p - 32 - 3.5, p - 32 + 2.5);
      const c2 = trendCandles(11, 1, p - 32 + 3, 'up', 10, 4);
      return [...c1, cb, baby, ca, ...c2];
    }
  },
  {
    id: 'abandoned-baby-bear-001', name: 'Bearish Abandoned Baby', category: 'Triple Candle Reversal',
    direction: 'sell', setupType: 'abandoned-baby-bearish',
    contextPrompt: 'Rare pattern: bullish candle, gap-up doji, gap-down bearish candle. Strong reversal.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const cb = c(8, p + 32, p + 32 + 3.5, p + 32 - 0.5, p + 32 + 3);
      const baby = dojiCandle(9, p + 32 + 5, 1.5, 1.5);
      const ca = c(10, p + 32 + 3, p + 32 + 3.5, p + 32 - 3, p + 32 - 2.5);
      const c2 = trendCandles(11, 1, p + 32 - 3, 'down', 10, 4);
      return [...c1, cb, baby, ca, ...c2];
    }
  },
  {
    id: 'advance-block-001', name: 'Advance Block', category: 'Triple Candle Reversal',
    direction: 'sell', setupType: 'advance-block',
    contextPrompt: 'Three bullish candles with shrinking bodies. Bulls are running out of steam.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 3);
      // 3 bullish candles with decreasing body size and increasing upper wicks
      const b1 = rng(4, 5); const b2 = rng(2, 3); const b3 = rng(1, 1.5);
      let price = p + 30;
      const block = [
        c(8, price, price + b1 + 1, price - 0.5, price + b1),
        c(9, price + b1, price + b1 + b2 + 2, price + b1 - 0.5, price + b1 + b2),
        c(10, price + b1 + b2, price + b1 + b2 + b3 + 3, price + b1 + b2 - 0.5, price + b1 + b2 + b3),
      ];
      const c2 = trendCandles(11, 1, price + b1 + b2 + b3 + 1, 'down', 10, 4);
      return [...c1, ...block, ...c2];
    }
  },
  {
    id: 'deliberation-001', name: 'Deliberation Pattern', category: 'Triple Candle Reversal',
    direction: 'wait', setupType: 'deliberation',
    contextPrompt: 'Two strong bullish candles then a small spinning top. Market deliberating.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const deliber = [
        c(8, p + 30, p + 30 + 4, p + 29.5, p + 34),
        c(9, p + 34, p + 34 + 3.5, p + 33.5, p + 37),
        spinningTop(10, p + 38),
      ];
      const c2 = rangeCandles(11, 1, p + 38, 10, 10);
      return [...c1, ...deliber, ...c2];
    }
  },

  // ═══ CONTINUATION PATTERNS ═══
  {
    id: 'rising-three-001', name: 'Rising Three Methods', category: 'Continuation',
    direction: 'buy', setupType: 'rising-three-methods',
    contextPrompt: 'Uptrend pause: three small bearish candles inside a large bullish range. Continuation likely.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 5, 4);
      const rtm = risingThreeMethods(5, 1, p + 18);
      const c2 = trendCandles(10, 1, p + 18 + 8, 'up', 10, 4);
      return [...c1, ...rtm, ...c2];
    }
  },
  {
    id: 'falling-three-001', name: 'Falling Three Methods', category: 'Continuation',
    direction: 'sell', setupType: 'falling-three-methods',
    contextPrompt: 'Downtrend pause: three small bullish candles inside a large bearish range. Continuation likely.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 5, 4);
      const ftm = fallingThreeMethods(5, 1, p - 18);
      const c2 = trendCandles(10, 1, p - 18 - 8, 'down', 10, 4);
      return [...c1, ...ftm, ...c2];
    }
  },
  {
    id: 'bullish-belt-hold-001', name: 'Bullish Belt Hold', category: 'Continuation',
    direction: 'buy', setupType: 'bullish-belt-hold',
    contextPrompt: 'Opens at low, rallies strongly. Bullish belt hold confirms buyers in control.',
    generate: (p) => {
      const c1 = rangeCandles(0, 1, p, 6, 8);
      const bh = c(6, p - 4, p + 6, p - 4.2, p + 5.5);
      const c2 = trendCandles(7, 1, p + 6, 'up', 12, 4);
      return [...c1, bh, ...c2];
    }
  },
  {
    id: 'bearish-belt-hold-001', name: 'Bearish Belt Hold', category: 'Continuation',
    direction: 'sell', setupType: 'bearish-belt-hold',
    contextPrompt: 'Opens at high, sells off strongly. Bearish belt hold confirms sellers in control.',
    generate: (p) => {
      const c1 = rangeCandles(0, 1, p, 6, 8);
      const bh = c(6, p + 4, p + 4.2, p - 6, p - 5.5);
      const c2 = trendCandles(7, 1, p - 6, 'down', 12, 4);
      return [...c1, bh, ...c2];
    }
  },
  {
    id: 'tasuki-gap-bull-001', name: 'Bullish Tasuki Gap', category: 'Continuation',
    direction: 'buy', setupType: 'bullish-tasuki-gap',
    contextPrompt: 'Uptrend with gap: two bullish candles with gap between them. Continuation pattern.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 3);
      const body = rng(3, 4);
      const gap = rng(1, 2);
      const last = p + 28;
      const tCandles = [
        c(8, last, last + body + 0.5, last - 0.3, last + body),
        c(9, last + body + gap, last + body + gap + body + 0.5, last + body + gap - 0.3, last + body + gap + body),
        c(10, last + body + gap, last + body + gap + body, last + body + gap - 0.5, last + body + gap + body - 1),
      ];
      const c2 = trendCandles(11, 1, last + body + gap + body, 'up', 8, 4);
      return [...c1, ...tCandles, ...c2];
    }
  },
  {
    id: 'tasuki-gap-bear-001', name: 'Bearish Tasuki Gap', category: 'Continuation',
    direction: 'sell', setupType: 'bearish-tasuki-gap',
    contextPrompt: 'Downtrend with gap: two bearish candles with gap between them. Continuation pattern.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 3);
      const body = rng(3, 4);
      const gap = rng(1, 2);
      const last = p - 28;
      const tCandles = [
        c(8, last, last + 0.3, last - body - 0.5, last - body),
        c(9, last - body - gap, last - body - gap + 0.3, last - body - gap - body - 0.5, last - body - gap - body),
        c(10, last - body - gap, last - body - gap + 0.5, last - body - gap - body, last - body - gap - body + 1),
      ];
      const c2 = trendCandles(11, 1, last - body - gap - body, 'down', 8, 4);
      return [...c1, ...tCandles, ...c2];
    }
  },

  // ═══ CHART PATTERNS ═══
  {
    id: 'double-top-001', name: 'Double Top Reversal', category: 'Chart Pattern',
    direction: 'sell', setupType: 'double-top',
    contextPrompt: 'Two equal highs with neckline support. Double top pattern completing at neckline.',
    generate: (p) => {
      // Rally to peak 1, dip to neckline, rally to peak 2 (same level), decline to neckline break
      const c1 = trendCandles(0, 1, p, 'up', 8, 4);
      const peak = p + 32;
      const neckline = p + 15;
      const c2 = trendCandles(8, 1, peak, 'down', 5, 3);
      const c3 = trendCandles(13, 1, neckline, 'up', 5, 3);
      const c4 = trendCandles(18, 1, peak, 'down', 10, 4);
      return [...c1, ...c2, ...c3, ...c4];
    }
  },
  {
    id: 'double-bottom-001', name: 'Double Bottom Reversal', category: 'Chart Pattern',
    direction: 'buy', setupType: 'double-bottom',
    contextPrompt: 'Two equal lows with neckline resistance. Double bottom pattern completing at neckline.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 4);
      const trough = p - 32;
      const neckline = p - 15;
      const c2 = trendCandles(8, 1, trough, 'up', 5, 3);
      const c3 = trendCandles(13, 1, neckline, 'down', 5, 3);
      const c4 = trendCandles(18, 1, trough, 'up', 10, 4);
      return [...c1, ...c2, ...c3, ...c4];
    }
  },
  {
    id: 'triple-top-001', name: 'Triple Top Reversal', category: 'Chart Pattern',
    direction: 'sell', setupType: 'triple-top',
    contextPrompt: 'Three equal highs rejected. Triple top — sellers defending this level hard.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 5, 3);
      const peak = p + 20;
      const neck = p + 8;
      // Peak 1, dip, Peak 2, dip, Peak 3, decline
      const seg1 = trendCandles(5, 1, p + 10, 'up', 3, 2).concat(rangeCandles(8, 1, peak, 2, 2));
      const dip1 = trendCandles(10, 1, peak, 'down', 3, 2);
      const seg2 = trendCandles(13, 1, neck, 'up', 3, 2).concat(rangeCandles(16, 1, peak, 2, 2));
      const dip2 = trendCandles(18, 1, peak, 'down', 3, 2);
      const seg3 = trendCandles(21, 1, neck, 'up', 3, 2).concat(rangeCandles(24, 1, peak, 2, 2));
      const drop = trendCandles(26, 1, peak - 2, 'down', 8, 4);
      return [...c1, ...seg1, ...dip1, ...seg2, ...dip2, ...seg3, ...drop];
    }
  },
  {
    id: 'triple-bottom-001', name: 'Triple Bottom Reversal', category: 'Chart Pattern',
    direction: 'buy', setupType: 'triple-bottom',
    contextPrompt: 'Three equal lows held. Triple bottom — buyers defending this level hard.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 5, 3);
      const trough = p - 20;
      const neck = p - 8;
      const seg1 = trendCandles(5, 1, p - 10, 'down', 3, 2).concat(rangeCandles(8, 1, trough, 2, 2));
      const bump1 = trendCandles(10, 1, trough, 'up', 3, 2);
      const seg2 = trendCandles(13, 1, neck, 'down', 3, 2).concat(rangeCandles(16, 1, trough, 2, 2));
      const bump2 = trendCandles(18, 1, trough, 'up', 3, 2);
      const seg3 = trendCandles(21, 1, neck, 'down', 3, 2).concat(rangeCandles(24, 1, trough, 2, 2));
      const rise = trendCandles(26, 1, trough + 2, 'up', 8, 4);
      return [...c1, ...seg1, ...bump1, ...seg2, ...bump2, ...seg3, ...rise];
    }
  },
  {
    id: 'cup-handle-001', name: 'Cup and Handle', category: 'Chart Pattern',
    direction: 'buy', setupType: 'cup-and-handle',
    contextPrompt: 'U-shaped cup followed by small pullback (handle). Classic cup and handle breakout.',
    generate: (p) => {
      const rim = p + 10;
      const bottom = p - 15;
      // Left rim, decline, bottom, rise, right rim, handle decline, handle
      const c1 = trendCandles(0, 1, p, 'up', 3, 2);
      const decline = trendCandles(3, 1, rim, 'down', 8, 3);
      const bottomCandles = rangeCandles(11, 1, bottom, 5, 6);
      const rise = trendCandles(16, 1, bottom, 'up', 8, 3);
      const handle = trendCandles(24, 1, rim, 'down', 4, 2);
      const breakout = trendCandles(28, 1, rim - 4, 'up', 8, 4);
      return [...c1, ...decline, ...bottomCandles, ...rise, ...handle, ...breakout];
    }
  },
  {
    id: 'rounding-bottom-001', name: 'Rounding Bottom', category: 'Chart Pattern',
    direction: 'buy', setupType: 'rounding-bottom',
    contextPrompt: 'Gradual U-shaped recovery forming over many candles. Rounding bottom — slow accumulation.',
    generate: (p) => {
      const candles = [];
      const count = 35;
      for (let i = 0; i < count; i++) {
        const progress = i / (count - 1);
        // U-shape: parabolic
        const y = -15 * Math.pow(2 * progress - 1, 2) + 5;
        const price = p + y;
        candles.push(c(i, price + rng(-1, 1), price + rng(1, 3), price - rng(1, 3), price + rng(-1, 1)));
      }
      const breakout = trendCandles(count, 1, p + 5, 'up', 8, 4);
      return [...candles, ...breakout];
    }
  },
  {
    id: 'falling-wedge-001', name: 'Falling Wedge (Bullish)', category: 'Chart Pattern',
    direction: 'buy', setupType: 'falling-wedge',
    contextPrompt: 'Price declining in narrowing range. Falling wedge often resolves to the upside.',
    generate: (p) => {
      const candles = [];
      for (let i = 0; i < 20; i++) {
        const progress = i / 19;
        const upperLine = p + 15 - progress * 8;
        const lowerLine = p - 5 - progress * 3;
        const mid = (upperLine + lowerLine) / 2;
        const range = (upperLine - lowerLine) / 2;
        candles.push(c(i, mid + rng(-range/2, range/2), upperLine + rng(-1, 1), lowerLine - rng(0, 1), mid + rng(-range/2, range/2)));
      }
      const breakout = trendCandles(20, 1, p + 5, 'up', 12, 5);
      return [...candles, ...breakout];
    }
  },
  {
    id: 'rising-wedge-001', name: 'Rising Wedge (Bearish)', category: 'Chart Pattern',
    direction: 'sell', setupType: 'rising-wedge',
    contextPrompt: 'Price rising in narrowing range. Rising wedge often resolves to the downside.',
    generate: (p) => {
      const candles = [];
      for (let i = 0; i < 20; i++) {
        const progress = i / 19;
        const upperLine = p + 5 + progress * 8;
        const lowerLine = p - 15 + progress * 3;
        const mid = (upperLine + lowerLine) / 2;
        const range = (upperLine - lowerLine) / 2;
        candles.push(c(i, mid + rng(-range/2, range/2), upperLine + rng(0, 1), lowerLine - rng(-1, 1), mid + rng(-range/2, range/2)));
      }
      const breakout = trendCandles(20, 1, p - 5, 'down', 12, 5);
      return [...candles, ...breakout];
    }
  },
  {
    id: 'ascending-triangle-001', name: 'Ascending Triangle', category: 'Chart Pattern',
    direction: 'buy', setupType: 'ascending-triangle',
    contextPrompt: 'Flat resistance with rising support. Ascending triangle — breakout above resistance expected.',
    generate: (p) => {
      const candles = [];
      const resistance = p + 10;
      for (let i = 0; i < 20; i++) {
        const progress = i / 19;
        const low = p - 10 + progress * 8; // rising support
        const high = resistance + rng(-0.5, 2);
        const mid = (high + low) / 2;
        candles.push(c(i, mid + rng(-2, 2), high, low - rng(0, 1), mid + rng(-2, 2)));
      }
      const breakout = trendCandles(20, 1, resistance + 1, 'up', 12, 4);
      return [...candles, ...breakout];
    }
  },
  {
    id: 'descending-triangle-001', name: 'Descending Triangle', category: 'Chart Pattern',
    direction: 'sell', setupType: 'descending-triangle',
    contextPrompt: 'Flat support with falling resistance. Descending triangle — breakdown below support expected.',
    generate: (p) => {
      const candles = [];
      const support = p - 10;
      for (let i = 0; i < 20; i++) {
        const progress = i / 19;
        const high = p + 10 - progress * 8; // falling resistance
        const low = support - rng(0, 1);
        const mid = (high + low) / 2;
        candles.push(c(i, mid + rng(-2, 2), high + rng(0, 1), low, mid + rng(-2, 2)));
      }
      const breakout = trendCandles(20, 1, support - 1, 'down', 12, 4);
      return [...candles, ...breakout];
    }
  },
  {
    id: 'symmetrical-triangle-001', name: 'Symmetrical Triangle', category: 'Chart Pattern',
    direction: 'wait', setupType: 'symmetrical-triangle',
    contextPrompt: 'Converging trendlines. Symmetrical triangle — breakout direction uncertain. Wait for confirmation.',
    generate: (p) => {
      const candles = [];
      for (let i = 0; i < 25; i++) {
        const progress = i / 24;
        const high = p + 15 - progress * 12;
        const low = p - 15 + progress * 12;
        const mid = (high + low) / 2;
        const range = (high - low) / 2;
        candles.push(c(i, mid + rng(-range/3, range/3), high + rng(0, 1), low - rng(0, 1), mid + rng(-range/3, range/3)));
      }
      const breakout = trendCandles(25, 1, p, Math.random() > 0.5 ? 'up' : 'down', 8, 5);
      return [...candles, ...breakout];
    }
  },
  {
    id: 'rectangle-range-001', name: 'Rectangle Range', category: 'Chart Pattern',
    direction: 'wait', setupType: 'rectangle-range',
    contextPrompt: 'Price bouncing between clear support and resistance. Rectangle range — wait for breakout.',
    generate: (p) => {
      const candles = rangeCandles(0, 1, p, 25, 20);
      const breakout = trendCandles(25, 1, p, Math.random() > 0.5 ? 'up' : 'down', 8, 5);
      return [...candles, ...breakout];
    }
  },
  {
    id: 'bull-flag-001', name: 'Bull Flag', category: 'Chart Pattern',
    direction: 'buy', setupType: 'bull-flag',
    contextPrompt: 'Strong rally followed by slight downward channel. Bull flag — continuation higher expected.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 8, 5);
      // Flag: slight downward channel
      const flag = trendCandles(8, 1, p + 35, 'down', 6, 2);
      const breakout = trendCandles(14, 1, p + 28, 'up', 10, 5);
      return [...c1, ...flag, ...breakout];
    }
  },
  {
    id: 'bear-flag-001', name: 'Bear Flag', category: 'Chart Pattern',
    direction: 'sell', setupType: 'bear-flag',
    contextPrompt: 'Strong decline followed by slight upward channel. Bear flag — continuation lower expected.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 8, 5);
      const flag = trendCandles(8, 1, p - 35, 'up', 6, 2);
      const breakout = trendCandles(14, 1, p - 28, 'down', 10, 5);
      return [...c1, ...flag, ...breakout];
    }
  },
  {
    id: 'bull-pennant-001', name: 'Bull Pennant', category: 'Chart Pattern',
    direction: 'buy', setupType: 'bull-pennant',
    contextPrompt: 'Sharp rally then converging consolidation. Bull pennant — brief pause before continuation.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 6, 5);
      // Pennant: converging lines
      const pennant = [];
      for (let i = 0; i < 8; i++) {
        const progress = i / 7;
        const high = p + 30 - progress * 5;
        const low = p + 20 + progress * 5;
        const mid = (high + low) / 2;
        pennant.push(c(6 + i, mid + rng(-1, 1), high + rng(0, 0.5), low - rng(0, 0.5), mid + rng(-1, 1)));
      }
      const breakout = trendCandles(14, 1, p + 28, 'up', 10, 5);
      return [...c1, ...pennant, ...breakout];
    }
  },
  {
    id: 'bear-pennant-001', name: 'Bear Pennant', category: 'Chart Pattern',
    direction: 'sell', setupType: 'bear-pennant',
    contextPrompt: 'Sharp decline then converging consolidation. Bear pennant — brief pause before continuation.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 6, 5);
      const pennant = [];
      for (let i = 0; i < 8; i++) {
        const progress = i / 7;
        const high = p - 20 + progress * 5;
        const low = p - 30 - progress * 5;
        const mid = (high + low) / 2;
        pennant.push(c(6 + i, mid + rng(-1, 1), high + rng(0, 0.5), low - rng(0, 0.5), mid + rng(-1, 1)));
      }
      const breakout = trendCandles(14, 1, p - 28, 'down', 10, 5);
      return [...c1, ...pennant, ...breakout];
    }
  },

  // ═══ CONTEXTUAL SETUPS ═══
  {
    id: 'support-bounce-001', name: 'Support Level Bounce', category: 'Contextual',
    direction: 'buy', setupType: 'support-bounce',
    contextPrompt: 'Price testing a strong horizontal support level for the third time. Bounce likely.',
    generate: (p) => {
      const support = p - 5;
      const c1 = trendCandles(0, 1, p, 'down', 6, 3);
      const b1 = trendCandles(6, 1, support, 'up', 4, 2);
      const d1 = trendCandles(10, 1, p, 'down', 5, 3);
      const b2 = trendCandles(15, 1, support, 'up', 4, 2);
      const d2 = trendCandles(19, 1, p - 2, 'down', 3, 2);
      const bounce = trendCandles(22, 1, support, 'up', 10, 4);
      return [...c1, ...b1, ...d1, ...b2, ...d2, ...bounce];
    }
  },
  {
    id: 'resistance-rejection-001', name: 'Resistance Rejection', category: 'Contextual',
    direction: 'sell', setupType: 'resistance-rejection',
    contextPrompt: 'Price testing a strong horizontal resistance level. Sellers defending aggressively.',
    generate: (p) => {
      const resistance = p + 5;
      const c1 = trendCandles(0, 1, p, 'up', 6, 3);
      const r1 = trendCandles(6, 1, resistance, 'down', 4, 2);
      const u1 = trendCandles(10, 1, p, 'up', 5, 3);
      const r2 = trendCandles(15, 1, resistance, 'down', 4, 2);
      const u2 = trendCandles(19, 1, p + 2, 'up', 3, 2);
      const drop = trendCandles(22, 1, resistance, 'down', 10, 4);
      return [...c1, ...r1, ...u1, ...r2, ...u2, ...drop];
    }
  },
  {
    id: 'fib-retracement-001', name: 'Fibonacci 61.8% Retracement', category: 'Contextual',
    direction: 'buy', setupType: 'fibonacci-retracement',
    contextPrompt: 'Price retracing to the 61.8% Fibonacci level after a strong impulse move. High-probability bounce zone.',
    generate: (p) => {
      const impulse = trendCandles(0, 1, p, 'up', 10, 4);
      const high = p + 40;
      const fib618 = high - 40 * 0.618;
      const retracement = trendCandles(10, 1, high, 'down', 6, 3);
      const bounce = trendCandles(16, 1, fib618, 'up', 10, 4);
      return [...impulse, ...retracement, ...bounce];
    }
  },
  {
    id: 'ema-support-001', name: 'EMA Dynamic Support', category: 'Contextual',
    direction: 'buy', setupType: 'ema-support',
    contextPrompt: 'Price pulling back to the 20 EMA in an uptrend. Dynamic support zone.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 12, 4);
      // Pullback to EMA zone
      const pullback = trendCandles(12, 1, p + 48, 'down', 5, 2);
      // Bounce from EMA
      const bounce = trendCandles(17, 1, p + 38, 'up', 10, 4);
      return [...c1, ...pullback, ...bounce];
    }
  },
  {
    id: 'sma-resistance-001', name: 'SMA Dynamic Resistance', category: 'Contextual',
    direction: 'sell', setupType: 'sma-resistance',
    contextPrompt: 'Price rallying to the 50 SMA in a downtrend. Dynamic resistance zone.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 12, 4);
      const rally = trendCandles(12, 1, p - 48, 'up', 5, 2);
      const drop = trendCandles(17, 1, p - 38, 'down', 10, 4);
      return [...c1, ...rally, ...drop];
    }
  },
  {
    id: 'break-of-structure-bull-001', name: 'Bullish Break of Structure', category: 'Contextual',
    direction: 'buy', setupType: 'break-of-structure',
    contextPrompt: 'Price breaks above previous higher high. Bullish BOS confirms trend continuation.',
    generate: (p) => {
      // Higher low, higher high pattern
      const c1 = trendCandles(0, 1, p, 'up', 5, 3);
      const dip = trendCandles(5, 1, p + 15, 'down', 3, 2);
      const c2 = trendCandles(8, 1, p + 10, 'up', 3, 3);
      const prevHigh = p + 20;
      // Break above previous high
      const breakout = trendCandles(11, 1, prevHigh - 3, 'up', 10, 4);
      return [...c1, ...dip, ...c2, ...breakout];
    }
  },
  {
    id: 'break-of-structure-bear-001', name: 'Bearish Break of Structure', category: 'Contextual',
    direction: 'sell', setupType: 'bearish-bos',
    contextPrompt: 'Price breaks below previous lower low. Bearish BOS confirms trend continuation.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 5, 3);
      const bump = trendCandles(5, 1, p - 15, 'up', 3, 2);
      const c2 = trendCandles(8, 1, p - 10, 'down', 3, 3);
      const prevLow = p - 20;
      const breakdown = trendCandles(11, 1, prevLow + 3, 'down', 10, 4);
      return [...c1, ...bump, ...c2, ...breakdown];
    }
  },
  {
    id: 'liquidity-sweep-bull-001', name: 'Bullish Liquidity Sweep', category: 'Contextual',
    direction: 'buy', setupType: 'liquidity-sweep',
    contextPrompt: 'Price swept below support (grabbed stop losses) then immediately reversed. Liquidity grab.',
    generate: (p) => {
      const support = p - 5;
      const c1 = trendCandles(0, 1, p, 'down', 6, 3);
      // Sweep below support
      const sweep = [
        c(6, support, support + 1, support - 4, support - 3),
        c(7, support - 3, support - 2, support - 5, support - 1),
      ];
      const recovery = trendCandles(8, 1, support - 1, 'up', 10, 4);
      return [...c1, ...sweep, ...recovery];
    }
  },
  {
    id: 'liquidity-sweep-bear-001', name: 'Bearish Liquidity Sweep', category: 'Contextual',
    direction: 'sell', setupType: 'bearish-liquidity-sweep',
    contextPrompt: 'Price swept above resistance (grabbed stop losses) then immediately reversed. Liquidity grab.',
    generate: (p) => {
      const resistance = p + 5;
      const c1 = trendCandles(0, 1, p, 'up', 6, 3);
      const sweep = [
        c(6, resistance, resistance + 4, resistance - 1, resistance + 3),
        c(7, resistance + 3, resistance + 5, resistance + 2, resistance + 1),
      ];
      const decline = trendCandles(8, 1, resistance + 1, 'down', 10, 4);
      return [...c1, ...sweep, ...decline];
    }
  },
  {
    id: 'fake-breakout-bear-001', name: 'Fake Breakout (Bull Trap)', category: 'Contextual',
    direction: 'sell', setupType: 'bull-trap',
    contextPrompt: 'Price broke above resistance but quickly reversed. Classic bull trap — fake breakout.',
    generate: (p) => {
      const resistance = p + 8;
      const c1 = rangeCandles(0, 1, p, 8, 8);
      // Fake breakout
      const fake = trendCandles(8, 1, resistance, 'up', 3, 3);
      const trap = trendCandles(11, 1, resistance + 10, 'down', 10, 5);
      return [...c1, ...fake, ...trap];
    }
  },
  {
    id: 'fake-breakout-bull-001', name: 'Fake Breakout (Bear Trap)', category: 'Contextual',
    direction: 'buy', setupType: 'bear-trap',
    contextPrompt: 'Price broke below support but quickly reversed. Classic bear trap — fake breakdown.',
    generate: (p) => {
      const support = p - 8;
      const c1 = rangeCandles(0, 1, p, 8, 8);
      const fake = trendCandles(8, 1, support, 'down', 3, 3);
      const trap = trendCandles(11, 1, support - 10, 'up', 10, 5);
      return [...c1, ...fake, ...trap];
    }
  },
  {
    id: 'order-block-bull-001', name: 'Bullish Order Block', category: 'Contextual',
    direction: 'buy', setupType: 'bullish-order-block',
    contextPrompt: 'Last bearish candle before strong rally = bullish order block. Expect reaction here.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 5, 3);
      // Order block candle
      const ob = c(5, p - 15, p - 14, p - 18, p - 17);
      // Strong rally away from OB
      const rally = trendCandles(6, 1, p - 17, 'up', 8, 5);
      // Pullback to OB
      const pullback = trendCandles(14, 1, p - 17 + 35, 'down', 4, 2);
      const bounce = trendCandles(18, 1, p - 15, 'up', 8, 4);
      return [...c1, ob, ...rally, ...pullback, ...bounce];
    }
  },
  {
    id: 'order-block-bear-001', name: 'Bearish Order Block', category: 'Contextual',
    direction: 'sell', setupType: 'bearish-order-block',
    contextPrompt: 'Last bullish candle before strong decline = bearish order block. Expect reaction here.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 5, 3);
      const ob = c(5, p + 15, p + 18, p + 14, p + 17);
      const decline = trendCandles(6, 1, p + 17, 'down', 8, 5);
      const rally = trendCandles(14, 1, p + 17 - 35, 'up', 4, 2);
      const drop = trendCandles(18, 1, p + 15, 'down', 8, 4);
      return [...c1, ob, ...decline, ...rally, ...drop];
    }
  },
  {
    id: 'v-top-001', name: 'V-Top Reversal', category: 'Chart Pattern',
    direction: 'sell', setupType: 'v-top',
    contextPrompt: 'Sharp spike up followed by immediate sharp reversal. V-top — extremely bearish.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'up', 5, 4);
      const spike = [
        c(5, p + 20, p + 30, p + 19, p + 28),
        c(6, p + 28, p + 29, p + 20, p + 21),
      ];
      const decline = trendCandles(7, 1, p + 21, 'down', 12, 5);
      return [...c1, ...spike, ...decline];
    }
  },
  {
    id: 'v-bottom-001', name: 'V-Bottom Reversal', category: 'Chart Pattern',
    direction: 'buy', setupType: 'v-bottom',
    contextPrompt: 'Sharp spike down followed by immediate sharp reversal. V-bottom — extremely bullish.',
    generate: (p) => {
      const c1 = trendCandles(0, 1, p, 'down', 5, 4);
      const spike = [
        c(5, p - 20, p - 19, p - 30, p - 21),
        c(6, p - 21, p - 20, p - 29, p - 28),
      ];
      const rally = trendCandles(7, 1, p - 28, 'up', 12, 5);
      return [...c1, ...spike, ...rally];
    }
  },
  {
    id: 'breakout-retest-001', name: 'Breakout and Retest', category: 'Contextual',
    direction: 'buy', setupType: 'breakout-retest',
    contextPrompt: 'Price broke above resistance, now retesting it as support. Classic breakout-retest entry.',
    generate: (p) => {
      const resistance = p + 10;
      const c1 = rangeCandles(0, 1, p, 10, 8);
      const breakout = trendCandles(10, 1, resistance - 3, 'up', 4, 4);
      const retest = trendCandles(14, 1, resistance + 12, 'down', 3, 2);
      const bounce = trendCandles(17, 1, resistance, 'up', 10, 4);
      return [...c1, ...breakout, ...retest, ...bounce];
    }
  },
  {
    id: 'breakdown-rally-001', name: 'Breakdown and Rally', category: 'Contextual',
    direction: 'sell', setupType: 'breakdown-rally',
    contextPrompt: 'Price broke below support, now retesting it as resistance. Classic breakdown-rally entry.',
    generate: (p) => {
      const support = p - 10;
      const c1 = rangeCandles(0, 1, p, 10, 8);
      const breakdown = trendCandles(10, 1, support + 3, 'down', 4, 4);
      const rally = trendCandles(14, 1, support - 12, 'up', 3, 2);
      const drop = trendCandles(17, 1, support, 'down', 10, 4);
      return [...c1, ...breakdown, ...rally, ...drop];
    }
  },
  {
    id: 'divergence-bull-001', name: 'Bullish Divergence Setup', category: 'Contextual',
    direction: 'buy', setupType: 'bullish-divergence',
    contextPrompt: 'Price making lower lows but momentum suggests exhaustion. Bullish divergence setup.',
    generate: (p) => {
      // Two legs down, second leg slightly lower but with decreasing momentum
      const leg1 = trendCandles(0, 1, p, 'down', 8, 4);
      const bounce1 = trendCandles(8, 1, p - 32, 'up', 5, 2);
      const leg2 = trendCandles(13, 1, p - 22, 'down', 8, 3);
      const reversal = trendCandles(21, 1, p - 35, 'up', 10, 5);
      return [...leg1, ...bounce1, ...leg2, ...reversal];
    }
  },
  {
    id: 'divergence-bear-001', name: 'Bearish Divergence Setup', category: 'Contextual',
    direction: 'sell', setupType: 'bearish-divergence',
    contextPrompt: 'Price making higher highs but momentum suggests exhaustion. Bearish divergence setup.',
    generate: (p) => {
      const leg1 = trendCandles(0, 1, p, 'up', 8, 4);
      const dip1 = trendCandles(8, 1, p + 32, 'down', 5, 2);
      const leg2 = trendCandles(13, 1, p + 22, 'up', 8, 3);
      const reversal = trendCandles(21, 1, p + 35, 'down', 10, 5);
      return [...leg1, ...dip1, ...leg2, ...reversal];
    }
  },
];

// ═══ Pattern Variations (generate multiple packs per pattern) ═══

// ─── Vietnamese translations ─────────────────────────────────────────────────
const VI_SETUP_TYPES = {
  'hammer-support': 'Búa tại hỗ trợ',
  'hanging-man-resistance': 'Người treo tại kháng cự',
  'shooting-star': 'Sao băng',
  'inverted-hammer': 'Búa ngược',
  'dragonfly-doji': 'Chuồn chuồn Doji',
  'gravestone-doji': 'Mộ đá Doji',
  'long-legged-doji': 'Doji chân dài',
  'marubozu-breakout': 'Marubozu phá vỡ lên',
  'marubozu-breakdown': 'Marubozu phá vỡ xuống',
  'spinning-top': 'Đỉnh quay',
  'bullish-engulfing': 'Nuốt chửng tăng',
  'bearish-engulfing': 'Nuốt chửng giảm',
  'bullish-harami': 'Harami tăng',
  'bearish-harami': 'Harami giảm',
  'piercing-line': 'Đường xuyên',
  'dark-cloud-cover': 'Mây đen che phủ',
  'tweezer-top': 'Kìm đỉnh',
  'tweezer-bottom': 'Kìm đáy',
  'morning-sao': 'Sao mai',
  'evening-star': 'Sao hôm',
  'three-white-soldiers': 'Ba binh lính trắng',
  'three-black-crows': 'Ba quạ đen',
  'three-inside-up': 'Ba trong tăng',
  'three-inside-down': 'Ba trong giảm',
  'three-outside-up': 'Ba ngoài tăng',
  'three-outside-down': 'Ba ngoài giảm',
  'abandoned-baby-bull': 'Bé bỏng tăng',
  'abandoned-baby-bear': 'Bé bỏng giảm',
  'advance-block': 'Chặn tiến',
  'deliberation': 'Ngập ngừng',
  'rising-three-methods': 'Ba nến tăng tiếp diễn',
  'falling-three-methods': 'Ba nến giảm tiếp diễn',
  'bullish-belt-hold': 'Đai giữ tăng',
  'bearish-belt-hold': 'Đai giữ giảm',
  'bullish-tasuki-gap': 'Khoảng trống Tasuki tăng',
  'bearish-tasuki-gap': 'Khoảng trống Tasuki giảm',
  'double-top': 'Đỉnh đôi',
  'double-bottom': 'Đáy đôi',
  'triple-top': 'Đỉnh ba',
  'triple-bottom': 'Đáy ba',
  'cup-and-handle': 'Cốc và tay cầm',
  'rounding-bottom': 'Đáy tròn',
  'falling-wedge': 'C楔 giảm',
  'rising-wedge': 'C楔 tăng',
  'ascending-triangle': 'Tam giác tăng',
  'descending-triangle': 'Tam giác giảm',
  'symmetrical-triangle': 'Tam giác đối xứng',
  'rectangle-range': 'Hình chữ nhật',
  'bull-flag': 'Cờ tăng',
  'bear-flag': 'Cờ giảm',
  'bull-pennant': 'Phi thường tăng',
  'bear-pennant': 'Phi thường giảm',
  'v-top': 'Đỉnh V',
  'v-bottom': 'Đáy V',
  'support-bounce': 'Nảy tại hỗ trợ',
  'support-rejection': 'Từ chối tại hỗ trợ',
  'resistance-bounce': 'Nảy tại kháng cự',
  'resistance-rejection': 'Từ chối tại kháng cự',
  'fibonacci-618': 'Fibonacci 61.8%',
  'ema-support': 'EMA hỗ trợ',
  'ema-resistance': 'EMA kháng cự',
  'sma-support': 'SMA hỗ trợ',
  'sma-resistance': 'SMA kháng cự',
  'bos-bullish': 'Phá cấu trúc tăng',
  'bos-bearish': 'Phá cấu trúc giảm',
  'liquidity-sweep-bull': 'Quét thanh khoản tăng',
  'liquidity-sweep-bear': 'Quét thanh khoản giảm',
  'fake-breakout-bull': 'Phá vỡ giả tăng',
  'fake-breakout-bear': 'Phá vỡ giả giảm',
  'order-block-bull': 'Khối lệnh tăng',
  'order-block-bear': 'Khối lệnh giảm',
  'breakout-retest': 'Phá vỡ rồi retest',
  'breakdown-rally': 'Phá vỡ xuống rồi phục hồi',
  'bullish-divergence': 'Phân kỳ tăng',
  'bearish-divergence': 'Phân kỳ giảm',
};

const VI_CONTEXT_PROMPTS = {
  'hammer-support': 'Giá giảm nhiều nến. Búa hình thành tại vùng hỗ trợ quan trọng.',
  'hanging-man-resistance': 'Giá tăng lên kháng cự. Nến người treo cảnh báo đảo chiều.',
  'shooting-star': 'Xu hướng tăng mạnh gặp kháng cự trên. Sao băng tín hiệu đảo chiều tiềm năng.',
  'inverted-hammer': 'Sau đợt giảm kéo dài, búa ngược xuất hiện cho thấy người mua đang thử.',
  'dragonfly-doji': 'Kiệt sức giảm. Chuồn chuồn Doji cho thấy người bán mất kiểm soát tại đáy.',
  'gravestone-doji': 'Kiệt sức tăng. Mộ đá Doji cho thấy người mua mất kiểm soát tại đỉnh.',
  'long-legged-doji': 'Sau một di chuyển mạnh, Doji chân dài cho thấy sự do dự cực độ. Chờ xác nhận.',
  'marubozu-breakout': 'Giá tích lũy gần kháng cự. Marubozu tăng phá vỡ quyết đoán.',
  'marubozu-breakdown': 'Giá tích lũy gần hỗ trợ. Marubozu giảm phá vỡ quyết đoán.',
  'spinning-top': 'Giá ở ngã tư. Nhiều đỉnh quay cho thấy thị trường chưa quyết định.',
  'bullish-engulfing': 'Xu hướng giảm kết thúc. Mẫu nuốt chửng tăng — đà mua áp đảo người bán.',
  'bearish-engulfing': 'Xu hướng tăng kết thúc. Mẫu nuốt chửng giảm — đà bán áp đảo người mua.',
  'bullish-harami': 'Sau đợt giảm đều đặn, Harami tăng gợi ý người bán đang hết hơi.',
  'bearish-harami': 'Sau đợt tăng đều đặn, Harami giảm gợi ý người mua đang hết hơi.',
  'piercing-line': 'Xu hướng giảm chạm hỗ trợ. Đường xuyên — gap xuống nhưng người mua đóng cửa trên giữa.',
  'dark-cloud-cover': 'Xu hướng tăng chạm kháng cự. Mây đen — gap lên nhưng người bán đóng cửa dưới giữa.',
  'tweezer-top': 'Xu hướng tăng gặp kháng cự mạnh. Kìm đỉnh — hai nến có đỉnh trùng nhau.',
  'tweezer-bottom': 'Xu hướng giảm chạm hỗ trợ mạnh. Kìm đáy — hai nến có đáy trùng nhau.',
  'morning-sao': 'Xu hướng giảm kiệt sức. Sao mai — nến Doji giữa hai nến đảo chiều.',
  'evening-star': 'Xu hướng tăng kiệt sức. Sao hôm — nến Doji giữa hai nến đảo chiều.',
  'three-white-soldiers': 'Ba nến tăng liên tiếp với thân dài. Đà mua mạnh, tiếp diễn.',
  'three-black-crows': 'Ba nến giảm liên tiếp với thân dài. Đà bán mạnh, tiếp diễn.',
  'three-inside-up': 'Harami tăng xác nhận bởi nến tăng thứ ba. Đảo chiều tăng.',
  'three-inside-down': 'Harami giảm xác nhận bởi nến giảm thứ ba. Đảo chiều giảm.',
  'three-outside-up': 'Nuốt chửng tăng xác nhận bởi nến tăng thứ ba. Đảo chiều tăng mạnh.',
  'three-outside-down': 'Nuốt chửng giảm xác nhận bởi nến giảm thứ ba. Đảo chiều giảm mạnh.',
  'abandoned-baby-bull': 'Bé bỏng tăng — Doji tăng bị bỏ rơi giữa hai nến. Đảo chiều hiếm gặp.',
  'abandoned-baby-bear': 'Bé bỏng giảm — Doji giảm bị bỏ rơi giữa hai nến. Đảo chiều hiếm gặp.',
  'advance-block': 'Ba nến tăng nhưng thân ngắn dần và bóng trên dài. Đà tăng yếu dần.',
  'deliberation': 'Hai nến tăng mạnh followed by spinning top. Thị trường ngập ngừng.',
  'rising-three-methods': 'Nến tăng dài, 3 nến nhỏ giảm trong phạm vi, nến tăng cuối xác nhận.',
  'falling-three-methods': 'Nến giảm dài, 3 nến nhỏ tăng trong phạm vi, nến giảm cuối xác nhận.',
  'bullish-belt-hold': 'Nến tăng mở ở đáy và đóng ở đỉnh. Người mua kiểm soát từ đầu.',
  'bearish-belt-hold': 'Nến giảm mở ở đỉnh và đóng ở đáy. Người bán kiểm soát từ đầu.',
  'bullish-tasuki-gap': 'Khoảng trống tăng giữa hai nến tăng, nến thứ ba không lấp khoảng trống.',
  'bearish-tasuki-gap': 'Khoảng trống giảm giữa hai nến giảm, nến thứ ba không lấp khoảng trống.',
  'double-top': 'Hai đỉnh gần bằng nhau với đáy ở giữa. Kháng cự kép.',
  'double-bottom': 'Hai đáy gần bằng nhau với đỉnh ở giữa. Hỗ trợ kép.',
  'triple-top': 'Ba đỉnh gần bằng nhau. Kháng cự mạnh, khó phá vỡ.',
  'triple-bottom': 'Ba đáy gần bằng nhau. Hỗ trợ mạnh, khó phá vỡ.',
  'cup-and-handle': 'Đáy tròn followed by pullback nhỏ. Breakout khỏi tay cầm.',
  'rounding-bottom': 'Đáy hình cung gradual. Chuyển dịch từ giảm sang tăng.',
  'falling-wedge': 'C楔 giảm — giá tạo đỉnh thấp hơn nhưng楔 co lại. Breakout tăng.',
  'rising-wedge': 'C楔 tăng — giá tạo đáy cao hơn nhưng楔 co lại. Breakout giảm.',
  'ascending-triangle': 'Tam giác tăng — kháng cự phẳng, hỗ trợ tăng dần.',
  'descending-triangle': 'Tam giác giảm — hỗ trợ phẳng, kháng cự giảm dần.',
  'symmetrical-triangle': 'Tam giác đối xứng — cả hai đường hội tụ. Chờ breakout.',
  'rectangle-range': 'Hình chữ nhật — giá dao động giữa hỗ trợ và kháng cự ngang.',
  'bull-flag': 'Cờ tăng — impulse mạnh followed by pullback tam giác nhỏ.',
  'bear-flag': 'Cờ giảm — impulse mạnh xuống followed by pullback tam giác nhỏ.',
  'bull-pennant': 'Phi thường tăng — impulse mạnh followed by consolidation tam giác.',
  'bear-pennant': 'Phi thường giảm — impulse mạnh xuống followed by consolidation.',
  'v-top': 'Đỉnh V — tăng mạnh rồi giảm mạnh ngay lập tức.',
  'v-bottom': 'Đáy V — giảm mạnh rồi tăng mạnh ngay lập tức.',
  'support-bounce': 'Giá chạm hỗ trợ và nảy lên. Người mua defends vùng này.',
  'support-rejection': 'Giá phá hỗ trợ nhưng đóng cửa lại trên. False breakdown.',
  'resistance-bounce': 'Giá chạm kháng cự và quay xuống. Người bán defends vùng này.',
  'resistance-rejection': 'Giá phá kháng cự nhưng đóng cửa lại dưới. False breakout.',
  'fibonacci-618': 'Giá retracement về vùng Fibonacci 61.8%. Vùng vào lệnh tiềm năng.',
  'ema-support': 'Giá retracement về EMA 50. Dynamic hỗ trợ trong xu hướng tăng.',
  'ema-resistance': 'Giá rally về EMA 50. Dynamic kháng cự trong xu hướng giảm.',
  'sma-support': 'Giá retracement về SMA 200. Hỗ trợ dài hạn.',
  'sma-resistance': 'Giá rally về SMA 200. Kháng cự dài hạn.',
  'bos-bullish': 'Phá cấu trúc tăng — đỉnh cũ bị phá. Xu hướng mới bắt đầu.',
  'bos-bearish': 'Phá cấu trúc giảm — đáy cũ bị phá. Xu hướng mới bắt đầu.',
  'liquidity-sweep-bull': 'Quét thanh khoản tăng — giá phá đáy rồi phục hồi mạnh.',
  'liquidity-sweep-bear': 'Quét thanh khoản giảm — giá phá đỉnh rồi giảm mạnh.',
  'fake-breakout-bull': 'Phá vỡ giả tăng — giá phá kháng cự rồi quay lại bên trong.',
  'fake-breakout-bear': 'Phá vỡ giả giảm — giá phá hỗ trợ rồi quay lại bên trong.',
  'order-block-bull': 'Khối lệnh tăng — vùng mà người mua đã đặt lệnh mạnh trước đó.',
  'order-block-bear': 'Khối lệnh giảm — vùng mà người bán đã đặt lệnh mạnh trước đó.',
  'breakout-retest': 'Phá vỡ rồi retest — giá phá kháng cự, quay lại test, rồi tiếp tục.',
  'breakdown-rally': 'Phá vỡ xuống rồi phục hồi — giá phá hỗ trợ, phục hồi mạnh.',
  'bullish-divergence': 'Phân kỳ tăng — giá tạo đáy thấp hơn nhưng RSI tạo đáy cao hơn.',
  'bearish-divergence': 'Phân kỳ giảm — giá tạo đỉnh cao hơn nhưng RSI tạo đỉnh thấp hơn.',
};

function getViSetupType(setupType) {
  return VI_SETUP_TYPES[setupType] || setupType;
}

function getViContextPrompt(setupType) {
  return VI_CONTEXT_PROMPTS[setupType] || '';
}

/**
 * We have ~50 base patterns. To reach 100 packs, we generate variations:
 * - Different base prices (2350-2450 range)
 * - Different volatility
 * - Different context lengths
 * - Some patterns get 2 variations (buy/sell versions)
 */
function generatePack(pattern, variation) {
  const basePrice = rng(2350, 2450);
  const rawCandles = pattern.generate(basePrice);

  // The decision point is ~60% through the candles
  const totalCandles = rawCandles.length;
  const decisionIndex = Math.floor(totalCandles * 0.55);

  // Compute entry zone from reference candle
  const decisionCandle = rawCandles[decisionIndex];
  const prevCandle = rawCandles[decisionIndex - 1];
  const closeAtDecision = decisionCandle.close;

  // Entry zone: small range around decision price
  const entryRange = rng(3, 6);
  let entryLow, entryHigh, sl, tp;

  if (pattern.direction === 'buy') {
    entryLow = round2(closeAtDecision - entryRange / 2);
    entryHigh = round2(closeAtDecision + entryRange / 2);
    sl = round2(entryLow - rng(5, 12));
    tp = round2(entryHigh + rng(12, 30));
  } else if (pattern.direction === 'sell') {
    entryLow = round2(closeAtDecision - entryRange / 2);
    entryHigh = round2(closeAtDecision + entryRange / 2);
    sl = round2(entryHigh + rng(5, 12));
    tp = round2(entryLow - rng(12, 30));
  } else {
    // wait
    entryLow = round2(closeAtDecision - entryRange);
    entryHigh = round2(closeAtDecision + entryRange);
    sl = round2(entryLow - rng(5, 10));
    tp = round2(entryHigh + rng(5, 10));
  }

  return {
    id: `xauusd-m15-${pattern.id.replace(/-/g, '-').slice(0, 20)}-${String(variation).padStart(3, '0')}`,
    symbol: 'XAUUSD',
    timeframe: 'M15',
    candles: rawCandles.map((candle, i) => ({
      timestamp: BASE_TS + i * INTERVAL,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    })),
    referenceZone: {
      entryLow,
      entryHigh,
      sl,
      tp,
      minRR: rng(1.5, 3),
      direction: pattern.direction,
      setupType: pattern.setupType,
      fixedRiskPct: 1.0,
    },
    contextPrompt: pattern.contextPrompt,
    contextPromptVi: getViContextPrompt(pattern.setupType),
    setupTypeVi: getViSetupType(pattern.setupType),
    decisionIndex,
  };
}

// ─── Generate all packs ─────────────────────────────────────────────────────

function main() {
  const packs = [];

  // Generate 1 variation per pattern (some have 2)
  for (const pattern of PATTERNS) {
    packs.push(generatePack(pattern, 0));
  }

  // If we have fewer than 100, add second variations with different seeds
  let extraIndex = 1;
  while (packs.length < 100) {
    const patternIdx = packs.length % PATTERNS.length;
    const pattern = PATTERNS[patternIdx];
    packs.push(generatePack(pattern, extraIndex));
    extraIndex++;
  }

  // Output TypeScript
  const lines = [
    `import type { ScenarioPack } from '@/lib/types';`,
    ``,
    `// Auto-generated: 100 XAUUSD M15 scenario packs based on real candlestick patterns`,
    `// Generated: ${new Date().toISOString()}`,
    `// Each pack has 55-75 candles with 4 phases: context → pattern → decision → outcome`,
    ``,
    `export const ALL_PACKS: ScenarioPack[] = [`,
  ];

  for (let i = 0; i < packs.length; i++) {
    const pack = packs[i];
    lines.push(`  // Pack ${i + 1}: ${pack.referenceZone.setupType} (${pack.referenceZone.direction})`);
    lines.push(`  ${JSON.stringify(pack, null, 0).replace(/"([^"]+)":/g, '$1:')},`);
  }

  lines.push(`];`);
  lines.push(``);

  process.stdout.write(lines.join('\n'));
}

main();
