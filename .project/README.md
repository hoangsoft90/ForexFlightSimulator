# Forex Flight Simulator — Knowledge Base

> Last updated: 2026-08-19

## Quick Overview

**Forex Flight Simulator** là app mobile mô phỏng ra quyết định giao dịch外汇 — người dùng thực hành BUY/SELL/WAIT trên dữ liệu nến thật, nhận phân tích hành vi (Autopsy), và tiến bộ qua các level. Không phải app "học Forex" kiểu khóa học.

| Item | Value |
|------|-------|
| Platform | Expo SDK 57 + React Native 0.86 |
| State | Zustand + AsyncStorage |
| Navigation | expo-router (file-based) |
| Monetization | AdMob (test ads mode) |
| Target | Android (targetSdk 36) + iOS + Web |
| Repo | [github.com/hoangsoft90/ForexFlightSimulator](https://github.com/hoangsoft90/ForexFlightSimulator) |

## Documents

| File | Nội dung |
|------|----------|
| [overview.md](./overview.md) | Mục tiêu, đối tượng, tech stack, MVP scope |
| [architecture.md](./architecture.md) | Cấu trúc thư mục, data flow, module dependency |
| [state-routing.md](./state-routing.md) | Zustand stores, expo-router config, deep link, navigation flow |
| [modules/scoring.md](./modules/scoring.md) | Scoring engine (Entry/Risk/RR/FOMO/Patience/Discipline) |
| [modules/root-causes.md](./modules/root-causes.md) | Root-cause rule table + positive notes |
| [modules/scenario-pack.md](./modules/scenario-pack.md) | Scenario Pack data model + sample data |
| [modules/trader-profile.md](./modules/trader-profile.md) | Trader Profile store, score persistence |
| [modules/session.md](./modules/session.md) | Session state machine (Deciding → Reveal → Result) |
| [integrations.md](./integrations.md) | AdMob setup, 3rd party libs, CI/CD |
| [design-system.md](./design-system.md) | Colors, spacing, typography, shared components |
| [patterns.md](./patterns.md) | Code patterns, conventions, anti-patterns |
| [openspec.md](./openspec.md) | Progress tracker, known bugs, TODO |

## Navigation Guide

- **New to project?** Start with [overview.md](./overview.md) → [architecture.md](./architecture.md)
- **Working on a feature?** Check [modules/](./modules/) for the relevant module
- **Debugging navigation?** See [state-routing.md](./state-routing.md)
- **Adding UI?** Follow [design-system.md](./design-system.md)
- **Adding scoring rules?** See [modules/scoring.md](./modules/scoring.md) + [modules/root-causes.md](./modules/root-causes.md)
- **What's left to do?** Check [openspec.md](./openspec.md)
