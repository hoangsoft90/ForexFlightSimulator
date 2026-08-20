# Code Patterns & Conventions

## Architecture Patterns

### 1. Pure Logic Modules (`src/lib/`)

All business logic lives in `src/lib/` as **pure functions** — no React imports, no side effects, fully unit-testable.

```
lib/
├── types.ts        # Type definitions only
├── outcome.ts      # computeOutcome(), computeReferenceOutcome()
├── scoring.ts      # computeAllScores() → ComponentScores
├── rootCauses.ts   # findRootCause(), findPositiveNote()
├── format.ts       # formatPrice(), formatPips(), formatTime(), scoreColor()
└── ads.ts          # Platform-guarded AdMob helpers
```

**Convention:** Each file exports 1-3 public functions. Helper functions are module-private (not exported).

### 2. Zustand Stores (`src/store/`)

Two stores, separated by lifecycle:

| Store | Lifecycle | Persistence | Purpose |
|-------|-----------|-------------|---------|
| `session-store` | Per-session | None (in-memory) | Current pack, decision, scores, autopsy |
| `trader-store` | Permanent | AsyncStorage | Profile, scores, level, sessions |

**Convention:** Store files export a single `use*Store` hook. Actions are defined inline in `create()`.

### 3. Component Pattern (`src/components/`)

**Functional components only** — no class components.

```typescript
// Standard component structure
interface FooProps {
  bar: string;
  baz?: number;
}

export function Foo({ bar, baz = 0 }: FooProps) {
  // Hooks at top
  // Early returns for null/empty states
  // Render
  return <View>...</View>;
}

// Styles at bottom, co-located
const styles = StyleSheet.create({...});
```

**Convention:**
- Props interface defined above component
- Default values in destructuring
- Styles co-located at bottom of file
- No inline styles (except dynamic values from props)
- Components are stateless when possible

### 4. Screen Pattern (`src/app/`)

Screens follow a consistent structure:

```typescript
export default function ScreenName() {
  // 1. Store hooks
  const { ... } = useSessionStore();
  const { ... } = useTraderStore();
  const insets = useSafeAreaInsets();

  // 2. Local state
  const [phase, setPhase] = useState<Phase>('initial');

  // 3. Side effects (useEffect)
  useEffect(() => { ... }, []);

  // 4. Deep-link guard (early return)
  if (!requiredData) {
    return <ErrorScreen onGoHome={() => router.replace('/')} />;
  }

  // 5. Handlers (useCallback)
  const handleAction = useCallback(() => { ... }, [deps]);

  // 6. Render
  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
    >
      {/* Content */}
    </ScrollView>
  );
}
```

### 5. Rule Table Pattern

Root-cause and scoring use explicit rule arrays — not if/else chains.

```typescript
interface Rule {
  id: string;
  label: string;
  applies: (ctx: Context) => boolean;
  describe: (ctx: Context) => string;
}

const RULES: Rule[] = [
  { id: 'rule-1', ..., applies: (ctx) => ..., describe: (ctx) => ... },
  { id: 'rule-2', ..., applies: (ctx) => ..., describe: (ctx) => ... },
];

// First match wins
function findRule(ctx: Context): Finding {
  for (const rule of RULES) {
    if (rule.applies(ctx)) return { id: rule.id, ... };
  }
  return fallback;
}
```

**Why:** Easy to read, reorder, add/remove rules. No nested conditionals.

## Conventions

### Import Order
```typescript
// 1. React
import React, { useState, useCallback } from 'react';
// 2. React Native
import { View, Text, StyleSheet } from 'react-native';
// 3. Expo
import { router } from 'expo-router';
// 4. Third-party
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// 5. Internal stores
import { useSessionStore } from '@/store/session-store';
// 6. Internal components
import { ScoreChip } from '@/components/score-chip';
// 7. Internal lib
import { computeOutcome } from '@/lib/outcome';
// 8. Constants
import { colors, spacing, font, radius } from '@/constants/theme';
// 9. Icons
import { IconPlayerPlay } from '@tabler/icons-react-native';
// 10. Types (last)
import type { ActionType } from '@/lib/types';
```

### Path Aliases
- `@/` → `src/` (configured in `tsconfig.json`)

### Naming Conventions
- **Files:** kebab-case (`score-chip.tsx`, `trader-store.ts`)
- **Components:** PascalCase (`ScoreChip`, `ActionButtons`)
- **Functions:** camelCase (`computeOutcome`, `findRootCause`)
- **Types/Interfaces:** PascalCase (`Candle`, `SessionDecision`)
- **Constants:** UPPER_SNAKE_CASE for module-level (`STRONG_BODY_MULT`, `CHART_MAX`)
- **Colors/Spacing:** camelCase (`colors.green`, `spacing.md`)

### TypeScript Conventions
- Use `interface` for object shapes (not `type`)
- Use `type` for unions and type aliases
- Explicit return types on exported functions
- `as const` for config objects
- No `any` (except AdMob native module references)

### Error Handling
- Components: show error state with "Go home" link
- AdMob: `try/catch` around initialization, `console.warn` on failure
- No error boundaries (MVP)

### Platform Guards
```typescript
// For native-only features (AdMob, BackHandler)
if (Platform.OS !== 'android') return;

// For web-excluded modules
const module = Platform.select({
  native: require('native-module'),
  default: null,
});
```

## Anti-Patterns to Avoid

1. **No business logic in components** — keep all computation in `lib/`
2. **No inline styles** — use `StyleSheet.create()` with theme tokens
3. **No state prop drilling** — use Zustand stores
4. **No class components** — functional only
5. **No string literals for routes** — use `'/'`, `'/decision'`, `'/autopsy'`
6. **No hardcoded colors** — always use `colors.*` from theme
7. **No hardcoded spacing** — always use `spacing.*` from theme
