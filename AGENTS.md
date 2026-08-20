# AGENTS.md — Forex Flight Simulator

> Project-specific instructions for AI agents. Supplements system-level AGENTS.md.

## Quick Context

This is a **trading decision training simulator** built with Expo SDK 57 + React Native. Users practice BUY/SELL/WAIT on real candlestick data and receive behavioral analysis.

**Entry point:** Read `CLAUDE.md` first, then `.project/README.md` for deep context.

## Project Identity

- **Project name:** `forex-flight-simulator`
- **Package:** `com.forexflightsimulator.app`
- **Repo:** `github.com/hoangsoft90/ForexFlightSimulator`
- **Branch:** `main`

## Critical Rules

1. **Business logic stays in `src/lib/`** — pure functions, no React, no side effects
2. **Theme tokens only** — `colors.*`, `spacing.*`, `font.*`, `radius.*` from `src/constants/theme.ts`
3. **TypeScript 0 errors** before any commit (`npx tsc --noEmit`)
4. **Autopsy always shows ≥1 green block** — retention principle (plan1 §2.6)
5. **Score by decision quality, NOT PnL** — core product principle
6. **Test ads ON** — `src/config.ts` → `testAds: true` (only change for production deploy)
7. **No stack buildup** — Autopsy uses `router.dismissAll()`, not `router.back()`
8. **Platform guards for native modules** — AdMob, BackHandler must check `Platform.OS`
9. **Don't commit `.agents/`** — contains tokens (gitignored)
10. **Don't commit `node_modules/`, `.expo/`, `/android/`, `/ios/`** — all gitignored

## Workflow

### Making Code Changes
1. Read relevant file in `.project/modules/` for context
2. Edit code following patterns in `.project/patterns.md`
3. Run `npx tsc --noEmit` — must pass
4. Test with `npx expo start`
5. Update `working.md` with what was done

### Adding Features
1. Check `.project/openspec.md` for TODO items
2. Follow architecture in `.project/architecture.md`
3. Use design tokens from `.project/design-system.md`
4. Add to relevant module doc in `.project/modules/`

### Building Debug APK
```bash
git push origin main  # Auto-triggers GitHub Actions
# Monitor: https://github.com/hoangsoft90/ForexFlightSimulator/actions
```

## File Map

| Need | Read |
|------|------|
| Project overview | `context.md` or `.project/overview.md` |
| What's being worked on | `working.md` |
| Rules & conventions | `operating_rules.md` or `.project/patterns.md` |
| Code architecture | `.project/architecture.md` |
| Scoring logic | `.project/modules/scoring.md` |
| Root-cause rules | `.project/modules/root-causes.md` |
| Navigation/routing | `.project/state-routing.md` |
| Design system | `.project/design-system.md` |
| Progress & TODO | `.project/openspec.md` |
| Build & deploy | `.project/integrations.md` |

## Don't

- Don't put business logic in components
- Don't use inline styles (use theme tokens)
- Don't use `any` type (except AdMob native refs)
- Don't hardcode colors (use `colors.*`)
- Don't use `router.back()` from Autopsy (use `dismissAll`)
- Don't add chart libraries (custom SVG is intentional)
- Don't enable production ads without real ad unit IDs
- Don't commit tokens or secrets
