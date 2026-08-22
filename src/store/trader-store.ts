import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TraderProfile, ScoreTrack, ComponentScores } from '@/lib/types';
import { computeOverallScore, getLevelProgress, getUnlockedLevels, LEVELS } from '@/data/packs';

interface TraderState extends TraderProfile {
  /** Update scores after a completed session. Uses running mean per component. */
  completeSession: (scores: ComponentScores) => void;
  /** Mark a pack as completed and potentially advance level. */
  completePack: (packId: string) => void;
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
  completedPacks: [],
  currentLevelProgress: 0,
};

function mergeScore(prev: ScoreTrack, newScore: number): ScoreTrack {
  const count = prev.count + 1;
  const value = Math.round((prev.value * prev.count + newScore) / count);
  return { value, count };
}

/** Determine rank based on overall score */
function getRank(avgScore: number): string {
  if (avgScore >= 80) return 'Advanced';
  if (avgScore >= 70) return 'Consistent';
  if (avgScore >= 60) return 'Disciplined';
  if (avgScore >= 55) return 'Observer';
  if (avgScore >= 50) return 'Survivor';
  return 'Novice';
}

export const useTraderStore = create<TraderState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      completeSession: (scores) =>
        set((state) => {
          const newScores = {
            reading: state.scores.reading, // not updated in level 1
            entry: scores.entry.applicable
              ? mergeScore(state.scores.entry, scores.entry.score)
              : state.scores.entry,
            risk: scores.risk.applicable
              ? mergeScore(state.scores.risk, scores.risk.score)
              : state.scores.risk,
            discipline: scores.discipline.applicable
              ? mergeScore(state.scores.discipline, scores.discipline.score)
              : state.scores.discipline,
          };

          const avgScore = computeOverallScore(newScores);
          const newRank = getRank(avgScore);

          return {
            scores: newScores,
            sessionsCompleted: state.sessionsCompleted + 1,
            rank: newRank,
          };
        }),

      completePack: (packId) =>
        set((state) => {
          const completedPacks = state.completedPacks.includes(packId)
            ? state.completedPacks
            : [...state.completedPacks, packId];

          // Check if level should advance
          const avgScore = computeOverallScore(state.scores);
          const unlocked = getUnlockedLevels({
            ...state,
            completedPacks,
          });

          // Current level is the highest unlocked level
          const newLevel = Math.max(...unlocked);

          // Compute current level progress
          const progress = getLevelProgress(newLevel, completedPacks);

          // Get sub label from level def
          const levelDef = LEVELS.find((l) => l.level === newLevel);
          const sub = levelDef ? levelDef.name.toLowerCase() : `${newLevel}`;

          return {
            completedPacks,
            level: newLevel,
            sub,
            currentLevelProgress: progress.percentage,
          };
        }),

      reset: () => set(INITIAL_STATE),
    }),
    {
      name: 'forex-flight-trader',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
