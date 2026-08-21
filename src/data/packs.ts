import type { ScenarioPack } from '@/lib/types';

// Re-export all packs from auto-generated file
export { ALL_PACKS } from './all-scenario-packs';

/** Type for the referenceZone field — used by scoring/outcome/rootCauses modules */
export type ExtendedReferenceZone = ScenarioPack['referenceZone'];

// Legacy exports for backward compatibility
import { ALL_PACKS } from './all-scenario-packs';

export const XAUUSD_PULLBACK_PACK = ALL_PACKS[0];
export const PACKS = ALL_PACKS;
