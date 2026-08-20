# Operating Rules — Forex Flight Simulator

> Project-specific rules. These supplement (not replace) AGENTS.md conventions.

## Code Rules

### 1. Business Logic Isolation
ALL business logic (scoring, root-causes, outcome simulation, formatting) lives in `src/lib/` as **pure functions**. Components handle UI only. No exceptions.

### 2. Theme Token Usage
ALL colors use `colors.*` from `src/constants/theme.ts`. ALL spacing uses `spacing.*`. No hardcoded values. No inline styles except dynamic values from props.

### 3. Type Safety
- Use `interface` for object shapes, `type` for unions
- No `any` (except AdMob native module refs which don't export types)
- All exported functions have explicit return types

### 4. Import Order
1. React / React Native
2. Expo
3. Third-party
4. Internal stores
5. Internal components
6. Internal lib
7. Constants
8. Icons
9. Types (last)

### 5. Platform Guards
Native-only features (AdMob, BackHandler) MUST use `Platform.select` or `Platform.OS` checks. Metro resolves `require()` inside if-blocks — only `Platform.select` truly excludes modules from web bundle.

## Design Rules

### 6. Flat Design Only
No gradients, no decorative shadows, no border-radius > 12px, no animations beyond reveal transition. Border 0.5–1px. This is a deliberate aesthetic, not a limitation.

### 7. Semantic Colors
- Green = good, success, positive
- Red = loss, error, wrong direction
- Amber = root cause, warning, FOMO
- Blue = neutral state, level, entry
Never use color decoratively.

### 8. Autopsy Positive Block
Every Autopsy MUST show at least 1 green "what you did right" block — even for worst-case decisions. This is a retention requirement from plan1_final.md §2.6.

### 9. Score by Quality, Not PnL
The app NEVER rewards users for profit or punishes for loss. Scores reflect decision quality (entry placement, risk management, discipline). This is the core product principle.

## Navigation Rules

### 10. No Stack Buildup
Autopsy → Home MUST use `router.dismissAll()` (not `router.back()`). This prevents infinite stack growth across sessions.

### 11. Deep-Link Safety
Decision and Autopsy screens MUST redirect to Home if session data is missing. Use `router.replace('/')` (not `router.back()`) for fallback navigation.

### 12. Android Back Handler
Autopsy screen MUST intercept Android hardware back button and redirect to Home (not back to Decision).

## Build Rules

### 13. Test Ads Default
`src/config.ts` → `testAds: true` is the default. Only change to `false` when deploying to production stores with real ad unit IDs.

### 14. No EAS Dependency
CI/CD uses Gradle directly via GitHub Actions. No EAS tokens, no EAS builds. This simplifies the build pipeline.

### 15. TypeScript Must Pass
`npx tsc --noEmit` must return 0 errors before any commit. No exceptions.

## Data Rules

### 16. Scenario Packs Are Static
Scenario packs are hardcoded JSON in `src/data/packs.ts`. No network fetching, no dynamic loading in MVP. Real data ingestion is a V1 feature.

### 17. AsyncStorage Is Local Only
All persistence is local (AsyncStorage). No server sync, no cloud backup in MVP. User data stays on device.

### 18. No Secrets in Code
API keys, tokens, credentials are NEVER hardcoded in source files. AdMob test IDs are from Google's official test list. Production IDs go in `src/config.ts` (gitignored if sensitive).
