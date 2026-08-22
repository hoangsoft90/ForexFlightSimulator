import type { ScenarioPack, TraderProfile } from '@/lib/types';

// Re-export all packs from auto-generated file
export { ALL_PACKS } from './all-scenario-packs';

/** Type for the referenceZone field — used by scoring/outcome/rootCauses modules */
export type ExtendedReferenceZone = ScenarioPack['referenceZone'];

// Legacy exports for backward compatibility
import { ALL_PACKS } from './all-scenario-packs';

export const XAUUSD_PULLBACK_PACK = ALL_PACKS[0];
export const PACKS = ALL_PACKS;

// ─── Level Definitions ──────────────────────────────────────────────────────

export interface LevelDef {
  level: number;
  name: string;
  nameVi: string;
  description: string;
  descriptionVi: string;
  color: string;
  /** setupType keywords that belong to this level */
  setupTypes: string[];
  /** Number of packs in this level */
  packCount: number;
}

export const LEVELS: LevelDef[] = [
  {
    level: 1,
    name: 'Survive',
    nameVi: 'Sống sót',
    description: 'Learn basic BUY/SELL/WAIT decisions with fixed lot & SL',
    descriptionVi: 'Học quyết định MUA/BÁN/CHỜ cơ bản với lot & SL cố định',
    color: '#22C55E',
    setupTypes: [
      'hammer', 'hanging-man', 'shooting-star', 'inverted-hammer',
      'dragonfly-doji', 'gravestone-doji', 'long-legged-doji',
      'marubozu', 'spinning-top',
    ],
    packCount: 30,
  },
  {
    level: 2,
    name: 'Survive+',
    nameVi: 'Sống sót+',
    description: 'Double & triple candle patterns — unlock SL/TP input',
    descriptionVi: 'Mẫu nến đôi & ba — mở khóa nhập SL/TP',
    color: '#22C55E',
    setupTypes: [
      'engulfing', 'harami', 'piercing-line', 'dark-cloud-cover',
      'tweezer', 'morning-star', 'evening-star',
      'three-white-soldiers', 'three-black-crows',
      'three-inside', 'three-outside',
      'abandoned-baby', 'advance-block', 'deliberation',
    ],
    packCount: 25,
  },
  {
    level: 3,
    name: 'Read',
    nameVi: 'Đọc chart',
    description: 'Chart patterns: trend, range, breakout, reversal',
    descriptionVi: 'Mẫu biểu đồ: xu hướng, biên độ, phá vỡ, đảo chiều',
    color: '#EAB308',
    setupTypes: [
      'rising-three', 'falling-three',
      'belt-hold', 'tasuki-gap',
      'double-top', 'double-bottom',
      'triple-top', 'triple-bottom',
      'cup-and-handle', 'rounding-bottom',
      'wedge', 'triangle', 'rectangle',
      'flag', 'pennant', 'v-top', 'v-bottom',
    ],
    packCount: 20,
  },
  {
    level: 4,
    name: 'Decide',
    nameVi: 'Quyết định',
    description: 'Contextual setups — know when NOT to trade',
    descriptionVi: 'Tình huống thực tế — biết khi nào KHÔNG nên trade',
    color: '#F97316',
    setupTypes: [
      'support', 'resistance', 'fibonacci',
      'ema', 'sma',
      'bos', 'liquidity-sweep', 'fake-breakout',
      'order-block', 'breakout-retest', 'breakdown-rally',
      'divergence',
    ],
    packCount: 15,
  },
  {
    level: 5,
    name: 'Perform',
    nameVi: 'Thực hiện',
    description: 'Complex multi-factor — build your own trading plan',
    descriptionVi: 'Phân tích đa yếu tố — xây dựng kế hoạch giao dịch cá nhân',
    color: '#EF4444',
    setupTypes: [], // will take remaining packs
    packCount: 10,
  },
];

// ─── Level Mapping Functions ────────────────────────────────────────────────

/** Get all packs assigned to a specific level */
export function getPacksForLevel(level: number): ScenarioPack[] {
  const levelDef = LEVELS.find((l) => l.level === level);
  if (!levelDef) return [];

  if (level === 5) {
    // Level 5 gets all remaining packs not assigned to levels 1-4
    const assignedIds = new Set(
      LEVELS.filter((l) => l.level < 5).flatMap((l) =>
        getPacksForLevel(l.level).map((p) => p.id),
      ),
    );
    return ALL_PACKS.filter((p) => !assignedIds.has(p.id));
  }

  return ALL_PACKS.filter((pack) => {
    const setup = pack.referenceZone.setupType.toLowerCase();
    return levelDef.setupTypes.some((st) => setup.includes(st));
  }).slice(0, levelDef.packCount);
}

/** Get packs for a level with a completion filter */
export function getLevelProgress(
  level: number,
  completedPacks: string[],
): { total: number; completed: number; percentage: number } {
  const packs = getPacksForLevel(level);
  const completedCount = packs.filter((p) =>
    completedPacks.includes(p.id),
  ).length;
  return {
    total: packs.length,
    completed: completedCount,
    percentage:
      packs.length > 0
        ? Math.round((completedCount / packs.length) * 100)
        : 0,
  };
}

/**
 * Compute overall score from trader scores.
 * Used for level unlock thresholds.
 */
export function computeOverallScore(
  scores: TraderProfile['scores'],
): number {
  return Math.round(
    (scores.reading.value +
      scores.entry.value +
      scores.risk.value +
      scores.discipline.value) /
      4,
  );
}

/**
 * Determine which levels are unlocked based on:
 * 1. Level 1 always unlocked
 * 2. Next level unlocked when avg score >= 60 AND >= 70% packs completed in previous level
 */
export function getUnlockedLevels(profile: TraderProfile): number[] {
  const unlocked: number[] = [1]; // Level 1 always unlocked

  for (let i = 2; i <= LEVELS.length; i++) {
    const prevLevel = i - 1;
    const prevProgress = getLevelProgress(prevLevel, profile.completedPacks);
    const avgScore = computeOverallScore(profile.scores);

    // Need avg score >= 60 AND >= 70% packs completed in previous level
    if (avgScore >= 60 && prevProgress.percentage >= 70) {
      unlocked.push(i);
    } else {
      break; // Once locked, all subsequent levels are locked too
    }
  }

  return unlocked;
}

/**
 * Get the next uncompleted pack in the current level.
 * Returns null if all packs in current level are completed.
 */
export function getNextPack(profile: TraderProfile): ScenarioPack | null {
  const currentLevel = profile.level;
  const levelPacks = getPacksForLevel(currentLevel);
  return (
    levelPacks.find((p) => !profile.completedPacks.includes(p.id)) ?? null
  );
}

/** Get level definition by number */
export function getLevelDef(level: number): LevelDef | undefined {
  return LEVELS.find((l) => l.level === level);
}

/** Get the display label for a setup type based on language */
export function getSetupTypeLabel(
  pack: ScenarioPack,
  lang: 'en' | 'vi',
): string {
  return lang === 'vi' ? pack.setupTypeVi : pack.referenceZone.setupType;
}

/** Get the context prompt based on language */
export function getContextPrompt(
  pack: ScenarioPack,
  lang: 'en' | 'vi',
): string {
  return lang === 'vi' ? pack.contextPromptVi : pack.contextPrompt;
}
