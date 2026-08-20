# Design System

> Based on `design.md` §0 — Flat, no gradients, no decorative shadows.
> File: `src/constants/theme.ts`

## Design Principles

1. **Flat, minimal** — no gradients, no decorative shadows, border 0.5–1px, radius 8–12px
2. **Semantic color** — green=good, red=loss/error, amber=root cause, blue=neutral/level
3. **No "course" feel** — Home has no lesson list, just Profile + 1 CTA
4. **Autopsy always has ≥1 green block** — retention principle (plan1 §2.6)
5. **Icon style** — outline, single color, no filled/multi-color icons
6. **Typography** — 2 weights only (regular/medium), min size 11px

## Colors

### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `green` | `#16A34A` | Win, positive note, correct action |
| `greenLight` | `#DCFCE7` | Win badge bg, positive block bg |
| `red` | `#DC2626` | Loss, error, wrong direction |
| `redLight` | `#FEE2E2` | Loss badge bg |
| `amber` | `#D97706` | Root cause, warning, FOMO |
| `amberLight` | `#FEF3C7` | Root cause block bg |
| `blue` | `#2563EB` | Level, entry, neutral state |
| `blueLight` | `#DBEAFE` | Breakeven badge bg, skipped bg |

### Neutral Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `bg` | `#F8F9FA` | Screen background |
| `surface` | `#FFFFFF` | Card, chart container, timeline |
| `border` | `#E5E7EB` | Button borders, dividers |
| `borderLight` | `#F3F4F6` | Card borders |
| `text` | `#111827` | Primary text |
| `textSecondary` | `#6B7280` | Secondary text, labels |
| `textMuted` | `#9CA3AF` | Muted text, timestamps |
| `primary` | `#2563EB` | CTA buttons, links |
| `primaryDark` | `#1D4ED8` | CTA press state |
| `primaryLight` | `#EFF6FF` | Avatar bg |

## Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon gaps, tight spacing |
| `sm` | 8px | Component gaps, inner padding |
| `md` | 12px | Button padding, card padding |
| `lg` | 16px | Section gaps, content padding |
| `xl` | 20px | Screen horizontal padding |
| `xxl` | 24px | Large gaps |
| `xxxl` | 32px | Top spacing (avatar) |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 8px | Cards, buttons, badges |
| `md` | 12px | (reserved for larger cards) |

## Typography

| Token | Size | Usage |
|-------|------|-------|
| `xs` | 11px | Section labels, timestamps |
| `sm` | 13px | Body text, descriptions |
| `md` | 15px | Button text, header text |
| `lg` | 18px | Score values, section titles |
| `xl` | 22px | Result pips, large scores |
| `xxl` | 28px | Level badge (L1) |

**Weights:** `400` (regular) and `500` (medium) only. No bold/heavy.

## Shared Components

### ScoreChip
**Used in:** Home, (future: Autopsy)
```
┌─────────────┐
│   [icon]    │  ← Tabler outline, 18px, textSecondary
│   READING   │  ← xs, muted, uppercase, letterSpacing 0.5
│     72      │  ← lg, scoreColor(value)
└─────────────┘
```

### ActionButtons
**Used in:** Decision UI
```
┌──────┬──────┬──────┐
│ Buy  │ Sell │ Wait │  ← Equal width, same height
│(green│(red  │(gray │     Buy: greenLight bg, green text
│ bg)  │ bg)  │ bg)  │     Sell: redLight bg, red text
└──────┴──────┴──────┘     Wait: surface bg, textSecondary text
```

### CandleChart
**Used in:** Decision UI
```
┌────────────────────────┐
│  ▐                    ▐│  ← Green candles (close ≥ open)
│  ▐▐    ▐              ▐│     Red candles (close < open)
│  ▐▐▐  ▐▐▐   ▐▐▐▐     ▐│     Wick: 1px line
│  ▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐▐   ▐│     Body: Rect with rx=1
│         ▐▐▐▐▐▐▐▐▐▐▐▐  │
│  ───────────────────── │  ← Optional zone lines (dashed)
└────────────────────────┘
Chart: 300×196, padding 12, candle gap 2
Container: white bg, border, radius 8, height 220
```

### ResultBadge
**Used in:** Decision UI (result phase), Autopsy
```
┌────────────────────────┐
│     Take profit        │  ← lg, bold, semantic color
│      +45 pips          │  ← xl, semantic color
│  TP at 2396.0          │  ← sm, textSecondary
└────────────────────────┘
```

### InsightBlock
**Used in:** Autopsy (root cause + positive note)
```
┌────────────────────────┐
│ ⚠ FOMO entry           │  ← Icon (16px) + md, bold, amber/green
│ You entered 2 candle.. │  ← sm, text, lineHeight 20
└────────────────────────┘
Variant: error (amber bg) | positive (green bg)
```

### AdBanner
**Used in:** Home (bottom)
- Native only (returns null on web)
- Auto-hides on load failure
- `ANCHORED_ADAPTIVE_BANNER` size

## Color Usage Map

| Context | Color | Token |
|---------|-------|-------|
| Win result | Green bg + green text | `greenLight` / `green` |
| Loss result | Red bg + red text | `redLight` / `red` |
| Breakeven | Blue bg + blue text | `blueLight` / `blue` |
| Root cause block | Amber bg + amber text | `amberLight` / `amber` |
| Positive block | Green bg + green text | `greenLight` / `green` |
| CTA button | Blue bg + white text | `primary` / `#FFFFFF` |
| Score ≥70 | Green text | `green` |
| Score 40-69 | Amber text | `amber` |
| Score <40 | Red text | `red` |
| Screen bg | Light gray | `bg` |
| Cards/surfaces | White | `surface` |
