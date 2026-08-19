import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TraderProfile, ScoreTrack, ComponentScores } from '@/lib/types';

interface TraderState extends TraderProfile {
  /** Update scores after a completed session. Uses running mean per component. */
  completeSession: (scores: ComponentScores) => void;
  /** Reset to fresh profile (for testing). */
  reset: () => void;
}

const INITIAL_SCORE: ScoreTrack = { value: 50, count: 0 };

const INITIAL_STATE: TraderProfile = {
  scores: {
    reading: { ...INITIAL_SCORE },
    entry: { ...INITIAL_SCORE },
    risk: { ...INITIAL_SCORE },
    discipline: { ...INITIAL_SCORE },
  },
  level: 1,
  sub: '1a',
  rank: 'Novice',
  sessionsCompleted: 0,
};

function mergeScore(prev: ScoreTrack, newScore: number): ScoreTrack {
  const count = prev.count + 1;
  const value = Math.round((prev.value * prev.count + newScore) / count);
  return { value, count };
}

export const useTraderStore = create<TraderState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      completeSession: (scores) =>
        set((state) => ({
          scores: {
            reading: state.scores.reading, // not updated in 1a
            entry: scores.entry.applicable
              ? mergeScore(state.scores.entry, scores.entry.score)
              : state.scores.entry,
            risk: scores.risk.applicable
              ? mergeScore(state.scores.risk, scores.risk.score)
              : state.scores.risk,
            discipline: scores.discipline.applicable
              ? mergeScore(state.scores.discipline, scores.discipline.score)
              : state.scores.discipline,
          },
          sessionsCompleted: state.sessionsCompleted + 1,
        })),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'forex-flight-trader',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
