# State Management & Routing

## State Management: Zustand

### Store 1: `trader-store.ts` (Persisted)

**Key:** `"forex-flight-trader"` (AsyncStorage)

```typescript
interface TraderProfile {
  scores: {
    reading: ScoreTrack;   // { value: number, count: number }
    entry: ScoreTrack;
    risk: ScoreTrack;
    discipline: ScoreTrack;
  };
  level: number;           // MVP: 1
  sub: string;             // MVP: "1a"
  rank: string;            // MVP: "Novice"
  sessionsCompleted: number;
}
```

**Actions:**
- `completeSession(scores: ComponentScores)` — merges new scores into running mean, increments sessionsCompleted
- `reset()` — resets to initial state (for testing)

**Score Merge Logic:**
```typescript
function mergeScore(prev: ScoreTrack, newScore: number): ScoreTrack {
  const count = prev.count + 1;
  const value = Math.round((prev.value * prev.count + newScore) / count);
  return { value, count };
}
```

**Which scores update:**
- `entry` — updates if `scores.entry.applicable === true`
- `risk` — updates if `scores.risk.applicable === true`
- `discipline` — updates if `scores.discipline.applicable === true`
- `reading` — NOT updated in MVP (no reading component yet)

### Store 2: `session-store.ts` (Ephemeral)

**No persistence** — resets on app restart.

```typescript
interface SessionState {
  pack: ScenarioPack | null;
  decision: SessionDecision | null;
  scores: ComponentScores | null;
  autopsy: AutopsyResult | null;

  startSession(pack) → void;
  setDecision(decision) → void;
  setAutopsy(scores, autopsy) → void;
  clearSession() → void;
}
```

**State Machine:**
```
Initial: { pack: null, decision: null, scores: null, autopsy: null }
  ↓ startSession(pack)
{ pack: <pack>, decision: null, scores: null, autopsy: null }
  ↓ setDecision(decision)
{ pack: <pack>, decision: <decision>, scores: null, autopsy: null }
  ↓ setAutopsy(scores, autopsy)
{ pack: <pack>, decision: <decision>, scores: <scores>, autopsy: <autopsy> }
  ↓ clearSession() [called implicitly by router.dismissAll()]
{ pack: null, decision: null, scores: null, autopsy: null }
```

### Why Zustand over alternatives

- **No boilerplate** — single file per store, no providers/reducers/actions
- **Built-in persist middleware** — AsyncStorage integration is 3 lines
- **No context re-renders** — Zustand uses selectors, only re-renders when selected state changes
- **Small bundle** — ~1KB gzipped, perfect for MVP

## Routing: expo-router

### Route Configuration (`_layout.tsx`)

```tsx
<SafeAreaProvider>
  <StatusBar style="dark" />
  <Stack
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.bg },
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="index" />       // Home
    <Stack.Screen name="decision" />    // Decision UI
    <Stack.Screen name="autopsy" />     // Trade Autopsy
  </Stack>
</SafeAreaProvider>
```

### Navigation Flow

```
Home (/) ──push──→ Decision (/decision) ──push──→ Autopsy (/autopsy)
  ↑                                                          │
  └──────────── router.dismissAll() ─────────────────────────┘
```

### Navigation Actions by Screen

| Screen | Action | Method | Why |
|--------|--------|--------|-----|
| Home → Decision | Start session | `router.push('/decision')` | Standard push |
| Decision → Autopsy | See autopsy | `router.push('/autopsy')` | Standard push |
| Decision → Home | Back button | `router.replace('/')` | Deep-link safe (no stack buildup) |
| Decision → Home | Error guard | `router.replace('/')` | Safe fallback if no pack |
| Autopsy → Home | Back button | `router.dismissAll()` | Reset entire stack to root |
| Autopsy → Home | Android back | `BackHandler` → `router.dismissAll()` | Prevent going back to Decision |

### Deep Link Handling

**Scheme:** `forex-flight-simulator://`

**Routes with guards:**
- `/decision` — if `pack === null` → redirect to `/` with error message
- `/autopsy` — if `decision === null || autopsy === null || pack === null` → redirect to `/` with error message

**Guard pattern:**
```tsx
if (!pack) {
  return (
    <View style={styles.center}>
      <Text style={styles.errorText}>No scenario loaded</Text>
      <TouchableOpacity onPress={() => router.replace('/')}>
        <Text style={styles.linkText}>Go home</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### Stack Management Rules

1. **No stack buildup** — Autopsy always calls `router.dismissAll()` to reset to root
2. **No back to Decision from Autopsy** — Android BackHandler intercepts and goes to Home
3. **Timer cleanup** — `revealTimer` tracked via `useRef`, cleared in `useEffect` return
4. **Platform-specific** — BackHandler only registered on Android

### AdMob Integration Points

| Location | Trigger | Action |
|----------|---------|--------|
| `_layout.tsx` | App mount | `initAds()` + `preloadInterstitial()` |
| `index.tsx` | Home screen | `<AdBanner />` at bottom |
| `autopsy.tsx` | "Back to profile" tap | `showInterstitial()` before `router.dismissAll()` |
