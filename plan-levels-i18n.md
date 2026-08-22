# Plan: Level System + Pack Localization

> Thay đổi kiến trúc lớn — cần user duyệt trước khi code.

---

## Vấn đề hiện tại

1. **i18n:** UI texts đã EN/VI nhưng pack data (contextPrompt, setupType) và root cause labels/descriptions vẫn hardcoded English.
2. **Level system:** Không có level progression. 100 packs nằm flat, user chọn tay, không có nút "Play"random, không có connection giữa trader level và available packs.

---

## Phần A: Pack Localization (i18n Data Sync)

### Approach: Thêm `*_vi` fields vào ScenarioPack

```typescript
// src/lib/types.ts
export interface ScenarioPack {
  id: string;
  symbol: string;
  timeframe: string;
  candles: Candle[];
  referenceZone: ReferenceZone;
  contextPrompt: string;        // English
  contextPromptVi: string;      // Vietnamese ← MỚI
  setupType: string;            // English key
  setupTypeVi: string;          // Vietnamese label ← MỚI
  decisionIndex: number;
}
```

**Tại sao không dùng translation map bên ngoài?**
- Pack data sinh ra từ script, mỗi pack có contextPrompt riêng
- Thêm field trực tiếp vào pack data → đơn giản, không cần lookup
- Script generate sẽ output cả 2 ngôn ngữ

### Root cause labels/descriptions — i18n

Thêm `label_vi` và `description_vi` vào `RootCauseFinding`:

```typescript
export interface RootCauseFinding {
  id: string;
  label: string;
  labelVi: string;
  description: string;
  descriptionVi: string;
  type: 'error' | 'positive';
}
```

### Files thay đổi

| File | Thay đổi |
|------|----------|
| `src/lib/types.ts` | Thêm `contextPromptVi`, `setupTypeVi`, `labelVi`, `descriptionVi` |
| `scripts/generate-packs.mjs` | Sinh cả EN + VI cho contextPrompt, setupType |
| `src/data/all-scenario-packs.ts` | Regenerate 100 packs với 2 ngôn ngữ |
| `src/lib/rootCauses.ts` | Thêm VN labels cho rule table |
| `src/app/decision.tsx` | Dùng `contextPromptVi` khi lang='vi' |
| `src/app/levels.tsx` | Dùng `setupTypeVi` khi lang='vi' |
| `src/app/autopsy.tsx` | Dùng `labelVi`/`descriptionVi` khi lang='vi' |

---

## Phần B: Level System Redesign

### Cấu trúc Level từ plan1_final.md §4

| Level | Tên | Mục tiêu | Packs | Unlock condition |
|-------|-----|----------|-------|-----------------|
| 🟢 1a | Survive | BUY/SELL/WAIT, lot & SL cố định | ~25 packs (single candle + easy patterns) | Default unlocked |
| 🟢 1b | Survive+ | Mở khóa SL/TP input | ~25 packs (double/triple candle) | Level 1a: avg score ≥ 60 |
| 🟡 2 | Read | Trend/Range/Breakout/Reversal | ~25 packs (chart patterns) | Level 1b: avg score ≥ 60 |
| 🟠 3 | Decide | Biết khi nào KHÔNG trade | ~15 packs (contextual, wait-heavy) | Level 2: avg score ≥ 60 |
| 🔴 4 | Perform | Trading plan cá nhân | ~10 packs (complex multi-factor) | Level 3: avg score ≥ 60 |

**Tổng: 100 packs phân bổ hợp lý.**

### Flow mới

```
┌─────────────────────────────────────────────┐
│  HOME (Trader Profile)                      │
│  ┌─────┐  Level 2 · sub 1b                 │
│  │ L2  │  Reading 58 | Entry 61             │
│  └─────┘  Risk 74   | Discipline 45         │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  ▶  PLAY NEXT SESSION                │   │ ← Random pack từ level hiện tại
│  │     Level 2 · pack 14/25            │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  📋 Choose scenario                  │   │ ← Vào Scenario Select
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  SCENARIO SELECT (Levels screen)            │
│                                             │
│  ┌─ Level 1a: Survive ─────────────────┐   │
│  │  ✅ #1 Hammer Support    ▶          │   │
│  │  ✅ #2 Hanging Man       ▶          │   │
│  │  ○  #3 Shooting Star     🔒        │   │ ← Lock nếu chưa unlock
│  │  ...                                │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌─ Level 1b: Survive+ ────────────────┐   │
│  │  🔒 Unlock after Level 1a ≥ 60     │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌─ Level 2: Read ─────────────────────┐   │
│  │  🔒 Unlock after Level 1b ≥ 60     │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Nút "Play" — Random/Next Session

**Behavior:**
1. Pack tiếp theo chưa hoàn thành trong level hiện tại
2. Nếu hoàn thành hết level hiện tại →提醒 unlock level tiếp
3. Nếu không còn pack nào → hiển thị "All done! 🎉"

**Logic selection:**
```typescript
function getNextPack(traderProfile: TraderProfile): ScenarioPack | null {
  const currentLevel = getCurrentLevel(traderProfile.level);
  const levelPacks = getPacksForLevel(currentLevel);
  const nextPack = levelPacks.find(p => !traderProfile.completedPacks.includes(p.id));
  return nextPack ?? null;
}
```

### Level unlock logic

```typescript
function getUnlockedLevels(traderProfile: TraderProfile): number[] {
  const avgScore = computeOverallScore(traderProfile.scores);
  const unlocked = [1]; // Level 1 always unlocked
  if (avgScore >= 60) unlocked.push(2);
  if (avgScore >= 65) unlocked.push(3);
  if (avgScore >= 70) unlocked.push(4);
  return unlocked;
}
```

### TraderProfile changes

```typescript
export interface TraderProfile {
  scores: { ... };
  level: number;          // highest unlocked level (1-4)
  sub: string;            // '1a' | '1b' | '2' | '3' | '4'
  rank: string;
  sessionsCompleted: number;
  completedPacks: string[];
  currentLevelProgress: number; // % hoàn thành level hiện tại ← MỚI
}
```

### Files thay đổi

| File | Thay đổi |
|------|----------|
| `src/lib/types.ts` | Thêm level mapping types, `currentLevelProgress` |
| `src/data/packs.ts` | Thêm `getPacksForLevel()`, `getNextPack()`, `getUnlockedLevels()` |
| `src/store/trader-store.ts` | Thêm level unlock logic, progress tracking |
| `src/app/index.tsx` | Thêm nút "Play Next Session" + progress bar level |
| `src/app/levels.tsx` | Nhóm packs theo level, hiển thị lock/unlock |
| `src/constants/theme.ts` | Level colors |
| `src/i18n/translations.ts` | Thêm level names + descriptions EN/VI |

---

## Thứ tự implement

1. **Pack localization** (phần A) — đơn giản hơn, làm trước
2. **Level system** (phần B) — phức tạp hơn, làm sau

---

## Ước lượng thay đổi

| Phạm vi | Files mới | Files sửa | Effort |
|---------|-----------|-----------|--------|
| Part A: i18n sync | 0 | ~7 files | Nhỏ |
| Part B: Level system | 0 | ~6 files | Trung bình |
| **Tổng** | **0** | **~10 files** | **~2-3h** |

---

## Câu hỏi cho user

1. **Level unlock threshold:** Dùng avg score ≥ 60 để unlock level tiếp? Hay bạn muốn cách khác (hoàn thành X packs, v.v.)?
2. **Pack distribution:** 25/25/25/15/10 cho 5 tier, hay bạn muốn phân bổ khác?
3. **"Play" button:** Random pack chưa hoàn thành trong level, hay pack tiếp theo theo thứ tự?
