import { create } from 'zustand';
import type { SessionDecision, ComponentScores, AutopsyResult, ScenarioPack } from '@/lib/types';

interface SessionState {
  /** Current pack being played. */
  pack: ScenarioPack | null;
  /** The decision made by the user. */
  decision: SessionDecision | null;
  /** Computed scores for this session. */
  scores: ComponentScores | null;
  /** The autopsy result. */
  autopsy: AutopsyResult | null;

  /** Start a new session with a pack. */
  startSession: (pack: ScenarioPack) => void;
  /** Record the user's decision. */
  setDecision: (decision: SessionDecision) => void;
  /** Set the computed scores and autopsy. */
  setAutopsy: (scores: ComponentScores, autopsy: AutopsyResult) => void;
  /** Clear the session (return to Home). */
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  pack: null,
  decision: null,
  scores: null,
  autopsy: null,

  startSession: (pack) => set({ pack, decision: null, scores: null, autopsy: null }),

  setDecision: (decision) => set({ decision }),

  setAutopsy: (scores, autopsy) => set({ scores, autopsy }),

  clearSession: () => set({ pack: null, decision: null, scores: null, autopsy: null }),
}));
