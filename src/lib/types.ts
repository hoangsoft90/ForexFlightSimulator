// ─── Candle & Scenario Pack ──────────────────────────────────────────────────

export interface Candle {
  timestamp: number;  // epoch ms
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ReferenceZone {
  entryLow: number;
  entryHigh: number;
  sl: number;           // reference SL price (for correct direction)
  tp: number;           // reference TP price (for correct direction)
  minRR: number;        // minimum risk/reward for a good score
  direction: 'buy' | 'sell' | 'wait';
  setupType: string;    // e.g. 'pullback-support', 'breakout'
  fixedRiskPct: number; // risk % per trade (sub-level 1a: fixed, hidden from UI)
}

export interface ScenarioPack {
  id: string;
  symbol: string;       // e.g. 'XAUUSD'
  timeframe: string;    // e.g. 'M15'
  candles: Candle[];
  referenceZone: ReferenceZone;
  contextPrompt: string; // 1-line, ≤20 words
  decisionIndex: number; // candle index where user decides
}

// ─── Decision & Session ──────────────────────────────────────────────────────

export type ActionType = 'buy' | 'sell' | 'wait';

export type TradeResult = 'win' | 'loss' | 'breakeven' | 'skipped';

export interface DecisionAction {
  type: 'enter' | 'sl-move' | 'exit';
  timestamp: number;
  price: number;
  detail?: string;
}

export interface SessionDecision {
  scenarioId: string;
  action: ActionType;
  entryPrice?: number;
  entryIndex: number;
  log: DecisionAction[];
  result?: TradeResult;
  resultPrice?: number;
  pips?: number;        // signed (negative = loss)
  refOutcome?: TradeResult; // what would have happened if they took the correct direction
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

export type ScoreComponent = 'entry' | 'risk' | 'rr' | 'fomo' | 'patience' | 'discipline';

export interface ScoreResult {
  score: number;       // 0–100
  applicable: boolean; // whether this component applies to the decision
}

export interface ComponentScores {
  entry: ScoreResult;
  risk: ScoreResult;
  rr: ScoreResult;
  fomo: ScoreResult;
  patience: ScoreResult;
  discipline: ScoreResult;
}

// ─── Root Cause ──────────────────────────────────────────────────────────────

export interface RootCauseFinding {
  id: string;
  label: string;        // short title e.g. "FOMO entry"
  description: string;  // concrete explanation
  type: 'error' | 'positive';
}

// ─── Autopsy ─────────────────────────────────────────────────────────────────

export interface AutopsyResult {
  decision: SessionDecision;
  scores: ComponentScores;
  rootCause: RootCauseFinding;
  positiveNote: RootCauseFinding;
}

// ─── Trader Profile (persisted) ─────────────────────────────────────────────

export interface ScoreTrack {
  value: number;
  count: number;
}

export interface TraderProfile {
  scores: {
    reading: ScoreTrack;
    entry: ScoreTrack;
    risk: ScoreTrack;
    discipline: ScoreTrack;
  };
  level: number;
  sub: string;     // e.g. '1a'
  rank: string;    // e.g. 'Novice'
  sessionsCompleted: number;
}
