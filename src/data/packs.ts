// Re-export all packs from scenario-packs.ts
// Original packs.ts data moved to scenario-packs.ts for better organization
export { ALL_PACKS } from './scenario-packs';
export type { ExtendedReferenceZone } from './scenario-packs';

// Legacy exports for backward compatibility
import { ALL_PACKS } from './scenario-packs';

export const XAUUSD_PULLBACK_PACK = ALL_PACKS[0];
export const PACKS = ALL_PACKS;
