# Overview — Forex Flight Simulator

## Mục tiêu sản phẩm

Một **decision-training simulator** — biến người mới biết gì thành người biết ra quyết định giao dịch có kỷ luật, trong môi trường mô phỏng an toàn.

- **Tagline:** "Đừng học cách trade. Hãy tập làm trader."
- **Định vị:** "Trading Decision & Psychology Trainer" — KHÔNG dùng "Forex" làm keyword chính (tránh vùng xám pháp lý VN).
- **Mô hình tư duy:** Duolingo (adaptive, từng skill nhỏ) + Flight Simulator (hậu quả thực tế) + Chess.com (phân tích lại từng nước đi).

## Nguyên tắc cốt lõi

1. Không bao giờ chấm điểm cao vì lãi — chấm theo **chất lượng quyết định**, không theo PnL.
2. Không có bảng xếp hạng công khai dựa trên PnL.
3. Không dùng AI để dự đoán BUY/SELL — AI (nếu có) chỉ là coach phản tư.
4. Level 1 không bắt nhập nhiều tham số cùng lúc.
5. Không kết nối tài khoản trade thật.
6. Mỗi phiên luôn kết thúc bằng ít nhất 1 điểm làm đúng cụ thể (nguyên tắc retention).

## Đối tượng người dùng

- Người mới bắt đầu tìm hiểu trading/đầu tư
- Trader muốn rèn luyện kỷ luật tâm lý
- Người muốn hiểu rõ hành vi giao dịch của mình

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo | SDK 57 |
| UI | React Native | 0.86.2 |
| Language | TypeScript | ~6.0.3 |
| Navigation | expo-router | ~57.0.14 |
| State | Zustand | ^5.0.0 |
| Persistence | AsyncStorage | 2.2.0 |
| Icons | @tabler/icons-react-native | ^3.46.0 |
| Charts | Custom SVG (react-native-svg 15.15.4) | — |
| Animations | react-native-reanimated | 4.5.1 |
| Ads | react-native-google-mobile-ads | ^16.5.0 |
| Android | targetSdk 36, compileSdk 36, minSdk 24 | — |

## MVP Scope (Đã hoàn thành)

### Hoàn thành ✅
- Home / Trader Profile screen
- Decision UI (Scenario Player) — sub-level 1a (Buy/Sell/Wait)
- Trade Autopsy screen (root cause + positive note)
- Scoring engine (6 components)
- Root-cause rule table (5 error rules + 5 positive rules)
- Custom SVG candlestick chart
- AsyncStorage persistence
- AdMob integration (test ads)
- Android targetSdk 36
- GitHub Actions CI/CD (debug APK build)
- App icons (adaptive icon)

### Chưa làm (Plan V1)
- Sub-level 1b (unlock SL/TP inputs)
- Sub-level 1c (unlock Risk% + Position Sizing)
- Decision Contract screen
- Scenario select / Level map
- Mistake Library / Top 3 lỗi
- Onboarding/Pre-flight
- Slippage & Spread Simulator
- Weekly Market Recap
- Backend sync
- More scenario packs

## Flow cốt lõi

```
Home (Trader Profile)
  → tap "Today's session"
    → Decision UI (chart + Buy/Sell/Wait)
      → Reveal (chart mở rộng)
        → Result (win/loss/breakeven/skipped)
          → Trade Autopsy (root cause + positive note)
            → Back to Home (scores updated, interstitial ad)
```

## Kích thước codebase

- **21 source files** trong `src/`
- **~1,800 lines** TypeScript/TSX
- **1 Scenario Pack** (XAUUSD M15, 80 nến)
- **5 reusable components** + **5 logic modules** + **2 stores**
