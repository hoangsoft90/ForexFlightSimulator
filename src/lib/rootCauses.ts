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
  labelVi: string;
  applies: (ctx: RuleContext) => boolean;
  describe: (ctx: RuleContext) => string;
  describeVi: (ctx: RuleContext) => string;
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
    labelVi: 'Vào lệnh ngược xu hướng',
    applies: ({ decision, zone }) =>
      decision.action !== 'wait' && decision.action !== zone.direction,
    describe: ({ decision, zone }) =>
      `The setup signaled ${zone.direction.toUpperCase()}, but you entered ${decision.action.toUpperCase()}. Price moved in the ${zone.direction} direction — this trade was against the setup.`,
    describeVi: ({ decision, zone }) => {
      const dirMap: Record<string, string> = { buy: 'MUA', sell: 'BÁN', wait: 'CHỜ' };
      return `Setup tín hiệu ${dirMap[zone.direction] ?? zone.direction}, nhưng bạn vào ${dirMap[decision.action] ?? decision.action}. Giá di chuyển theo hướng ${zone.direction} — lệnh này ngược setup.`;
    },
  },
  {
    id: 'fomo-entry',
    label: 'FOMO entry',
    labelVi: 'Vào lệnh FOMO',
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
    describeVi: ({ decision, candles }) => {
      const avgBody = recentAvgBody(candles, decision.entryIndex, 20);
      const threshold = avgBody * 1.5;
      let strongIdx = -1;
      for (let i = decision.entryIndex - 2; i < decision.entryIndex; i++) {
        if (i >= 0 && body(candles[i]) > threshold) { strongIdx = i; break; }
      }
      if (strongIdx < 0) return 'Bạn vào lệnh ngay sau nến mạnh, cho thấy vào theo đà.';
      const gap = decision.entryIndex - strongIdx;
      return `Bạn vào ${gap} nến sau nến mạnh ${body(candles[strongIdx]).toFixed(1)} điểm (${formatTime(candles[strongIdx].timestamp)}). Đây là phản ứng theo đà thay vì chờ setup xác nhận.`;
    },
  },
  {
    id: 'late-entry',
    label: 'Late entry / off-zone',
    labelVi: 'Vào muộn / ngoài vùng',
    applies: ({ decision, zone }) => {
      if (decision.action === 'wait' || decision.entryPrice === undefined) return false;
      if (decision.action !== zone.direction) return false;
      return decision.entryPrice < zone.entryLow || decision.entryPrice > zone.entryHigh;
    },
    describe: ({ decision, zone }) => {
      const side = decision.entryPrice! < zone.entryLow ? 'below' : 'above';
      return `Entry at ${decision.entryPrice?.toFixed(1)} was ${side} the reference zone (${zone.entryLow}–${zone.entryHigh}). A better entry closer to the zone would have improved your risk/reward.`;
    },
    describeVi: ({ decision, zone }) => {
      const side = decision.entryPrice! < zone.entryLow ? 'dưới' : 'trên';
      return `Vào tại ${decision.entryPrice?.toFixed(1)} nằm ${side} vùng tham chiếu (${zone.entryLow}–${zone.entryHigh}). Vào gần vùng hơn sẽ cải thiện tỷ lệ risk/reward.`;
    },
  },
  {
    id: 'missed-setup',
    label: 'Missed setup',
    labelVi: 'Bỏ lỡ setup',
    applies: ({ decision }) => decision.action === 'wait',
    describe: ({ decision }) =>
      decision.refOutcome === 'win'
        ? `You chose to wait, and the setup played out in your favor. While patience is valuable, this was a setup worth considering.`
        : `You chose to wait, and the setup failed — the price moved against the expected direction. Your instinct to hold back was correct this time.`,
    describeVi: ({ decision }) =>
      decision.refOutcome === 'win'
        ? `Bạn chọn chờ, và setup đã diễn ra đúng hướng. Mặc dù kiên nhẫn là tốt, đây là setup đáng cân nhắc.`
        : `Bạn chọn chờ, và setup thất bại — giá di chuyển ngược kỳ vọng.直 giác giữ mình của bạn lần này là đúng.`,
  },
  {
    id: 'trade-failed',
    label: 'Setup failed',
    labelVi: 'Setup thất bại',
    applies: ({ decision }) =>
      decision.action !== 'wait' && (decision.result === 'loss' || decision.result === 'breakeven'),
    describe: ({ decision }) =>
      `Price reached your stop loss at ${decision.resultPrice?.toFixed(1)}. The setup didn't play out — sometimes the best setups fail. The key is whether your risk management was sound.`,
    describeVi: ({ decision }) =>
      `Giá chạm stop loss tại ${decision.resultPrice?.toFixed(1)}. Setup không diễn ra — đôi khi setup tốt nhất cũng thất bại. Điều quan trọng là quản trị rủi ro có đúng không.`,
  },
];

// ─── Positive Rules ("what you did right") ───────────────────────────────────

interface PositiveRule {
  id: string;
  label: string;
  labelVi: string;
  applies: (ctx: RuleContext) => boolean;
  describe: (ctx: RuleContext) => string;
  describeVi: (ctx: RuleContext) => string;
}

const POSITIVE_RULES: PositiveRule[] = [
  {
    id: 'patient-entry',
    label: 'Patient entry at the zone',
    labelVi: 'Vào kiên nhẫn tại vùng',
    applies: ({ decision, zone }) => {
      if (decision.action === 'wait' || decision.entryPrice === undefined) return false;
      return decision.action === zone.direction
        && decision.entryPrice >= zone.entryLow
        && decision.entryPrice <= zone.entryHigh;
    },
    describe: ({ decision }) =>
      `Your entry at ${decision.entryPrice?.toFixed(1)} was right in the setup zone — exactly where a disciplined trader would enter. This maximizes your probability of a favorable outcome.`,
    describeVi: ({ decision }) =>
      `Vào tại ${decision.entryPrice?.toFixed(1)} nằm đúng trong vùng setup — chính xác nơi trader có kỷ luật sẽ vào. Điều này tối ưu hóa xác suất kết quả thuận lợi.`,
  },
  {
    id: 'disciplined-wait',
    label: 'Disciplined patience',
    labelVi: 'Kiên nhẫn có kỷ luật',
    applies: ({ decision, zone }) => {
      return decision.action === 'wait' && decision.refOutcome === 'loss';
    },
    describe: () =>
      `By waiting, you avoided a losing trade. The setup failed — your instinct to hold back was correct and saved you capital.`,
    describeVi: () =>
      `Bằng cách chờ, bạn đã tránh được lệnh thua. Setup thất bại —直 giác giữ mình của bạn là đúng và đã bảo toàn vốn.`,
  },
  {
    id: 'correct-risk',
    label: 'Risk sized correctly',
    labelVi: 'Quản trị rủi ro đúng',
    applies: ({ decision, zone }) => {
      if (decision.action === 'wait') return false;
      const ext = zone as ExtendedReferenceZone;
      return ext.fixedRiskPct >= 0.5 && ext.fixedRiskPct <= 1.0;
    },
    describe: ({ zone }) => {
      const ext = zone as ExtendedReferenceZone;
      return `Your position was sized at ${ext.fixedRiskPct}% risk — within the recommended 0.5–1% band. Good risk management protects your capital even when trades don't work out.`;
    },
    describeVi: ({ zone }) => {
      const ext = zone as ExtendedReferenceZone;
      return `Vị thế được đặt ở ${ext.fixedRiskPct}% rủi ro — trong khoảng khuyến nghị 0.5–1%. Quản trị rủi ro tốt bảo vệ vốn ngay cả khi lệnh không thành công.`;
    },
  },
  {
    id: 'correct-direction',
    label: 'Correct direction',
    labelVi: 'Đúng hướng',
    applies: ({ decision, zone }) =>
      decision.action !== 'wait' && decision.action === zone.direction,
    describe: ({ zone }) =>
      `You picked the right direction (${zone.direction.toUpperCase()}). The setup's directional bias played out correctly — well-read.`,
    describeVi: ({ zone }) => {
      const dirMap: Record<string, string> = { buy: 'MUA', sell: 'BÁN' };
      return `Bạn chọn đúng hướng (${dirMap[zone.direction] ?? zone.direction}). Thiên hướng hướng của setup đã diễn ra đúng — đọc đúng.`;
    },
  },
  {
    id: 'avoided-chase',
    label: 'Avoided chasing',
    labelVi: 'Tránh được chasing',
    applies: ({ decision, candles }) => {
      if (decision.action !== 'wait') return false;
      if (candles.length === 0) return false;
      const avgBody = recentAvgBody(candles, decision.entryIndex, 20);
      const threshold = avgBody * 1.5;
      for (let i = decision.entryIndex - 2; i < decision.entryIndex; i++) {
        if (i >= 0 && body(candles[i]) > threshold) return true;
      }
      return false;
    },
    describe: () =>
      `A strong candle appeared right before your decision point — many traders would have chased that momentum. You waited, which shows discipline.`,
    describeVi: () =>
      `Một nến mạnh xuất hiện ngay trước thời điểm quyết định — nhiều trader sẽ chạy theo đà đó. Bạn đã chờ, thể hiện kỷ luật.`,
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
export function findRootCause(ctx: RuleContextFull, lang: 'en' | 'vi' = 'en'): RootCauseFinding {
  const fullCtx: RuleContext = { ...ctx };

  for (const rule of ERROR_RULES) {
    if (rule.applies(fullCtx)) {
      return {
        id: rule.id,
        label: rule.label,
        labelVi: rule.labelVi,
        description: rule.describe(fullCtx),
        descriptionVi: rule.describeVi(fullCtx),
        type: 'error',
      };
    }
  }

  // Fallback (shouldn't normally be reached)
  return {
    id: 'unknown',
    label: 'Outcome noted',
    labelVi: 'Kết quả đã ghi nhận',
    description: 'No specific root cause identified for this trade.',
    descriptionVi: 'Không xác định được nguyên nhân cụ thể cho lệnh này.',
    type: 'error',
  };
}

/**
 * Find the positive note ("what you did right").
 * Tries rules in order; falls back to "correct risk sizing" (always true in 1a).
 * Per plan §2.6: always show at least one positive — never omit.
 */
export function findPositiveNote(ctx: RuleContextFull, lang: 'en' | 'vi' = 'en'): RootCauseFinding {
  const fullCtx: RuleContext = { ...ctx };

  for (const rule of POSITIVE_RULES) {
    if (rule.applies(fullCtx)) {
      return {
        id: rule.id,
        label: rule.label,
        labelVi: rule.labelVi,
        description: rule.describe(fullCtx),
        descriptionVi: rule.describeVi(fullCtx),
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
      labelVi: 'Thể hiện kiên nhẫn',
      description: 'You exercised patience by waiting for a clearer setup. Disciplined traders pick their battles carefully.',
      descriptionVi: 'Bạn thể hiện kiên nhẫn bằng cách chờ setup rõ ràng hơn. Trader có kỷ luật chọn trận chiến cẩn thận.',
      type: 'positive',
    };
  }
  const ext = ctx.zone as ExtendedReferenceZone;
  return {
    id: 'correct-risk-fallback',
    label: 'Risk sized correctly',
    labelVi: 'Quản trị rủi ro đúng',
    description: `Your position was sized at ${ext.fixedRiskPct}% risk — within the recommended band. Consistent risk management is the foundation of long-term trading success.`,
    descriptionVi: `Vị thế được đặt ở ${ext.fixedRiskPct}% rủi ro — trong khoảng khuyến nghị. Quản trị rủi ro nhất quán là nền tảng thành công trading lâu dài.`,
    type: 'positive',
  };
}
