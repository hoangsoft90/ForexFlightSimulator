# Forex/Trading Decision Simulator — Final Product Plan

> Tổng hợp từ plan1.md (ý tưởng gốc) + plan1_review1–4.md (4 bản phản biện AI) + phản biện tổng hợp cuối cùng.
> Đây là bản plan quyết định (decision doc), không phải bản liệt kê mọi ý tưởng đã bàn.

---

## 1. Positioning & USP

**Không xây:** app "học Forex" kiểu khóa học + quiz.
**Xây:** một **decision-training simulator** — biến người chưa biết gì thành người biết *ra quyết định giao dịch có kỷ luật*, trong môi trường mô phỏng an toàn.

- Tagline: **"Đừng học cách trade. Hãy tập làm trader."**
- Định vị kỹ thuật (tránh vùng xám pháp lý VN — xem mục 9): **"Trading Decision & Psychology Trainer"**, không dùng chữ "Forex" làm từ khóa chính trong tên/mô tả app, không liên kết sàn/broker thật dưới bất kỳ hình thức nào (kể cả link giới thiệu, referral).
- Mô hình tư duy: **Duolingo (adaptive, từng kỹ năng nhỏ) + Flight Simulator (hậu quả thực tế) + Chess.com (phân tích lại từng nước đi)**.
- Thước đo thành công không phải "học xong bao nhiêu bài" mà là **"kiểu trader bạn đang trở thành sau N quyết định"**.

---

## 2. Nguyên tắc cốt lõi (giữ nguyên xuyên suốt sản phẩm)

1. Không bao giờ chấm điểm cao vì lãi (kể cả trong sim). Chấm theo **chất lượng quyết định**, không theo PnL.
2. Không có bảng xếp hạng công khai dựa trên PnL hoặc số lệnh.
3. Không dùng AI để dự đoán BUY/SELL. AI (nếu có, không phải MVP) chỉ đóng vai coach phản tư.
4. Level 1 tuyệt đối không bắt nhập nhiều tham số cùng lúc (Entry/SL/TP/Risk% cùng lúc là sai lầm — đã bị cả 4 review chỉ ra).
5. Không kết nối tài khoản trade thật ở bất kỳ giai đoạn nào gần MVP.
6. Mỗi phiên, dù người dùng chơi tệ, vẫn phải kết thúc bằng ít nhất một điểm làm đúng cụ thể — không chỉ liệt kê lỗi (nguyên tắc giữ retention cho một app "nói thật").

---

## 3. Learning loop (trái tim của sản phẩm)

```
Quan sát chart (đã xảy ra, không biết tương lai)
        ↓
Ra quyết định: BUY / SELL / WAIT
        ↓
Thị trường tiếp tục chạy (replay nến tĩnh)
        ↓
Nhận hậu quả (thắng/thua, hoặc "đã tránh được setup xấu")
        ↓
Trade Autopsy (rule-based): vì sao thắng/thua, root cause
        ↓
Cập nhật Trader Score + Mistake Library
        ↓
Adaptive: phiên tiếp theo nhắm đúng lỗi lớn nhất của người đó
```

---

## 4. Cấu trúc 4 Level (theo plan1, giữ nguyên vì logic đúng)

| Level | Mục tiêu | Nội dung học qua scenario |
|---|---|---|
| 🟢 1 — Survive | Không cháy tài khoản | Pip, Lot, SL, TP, Risk, Spread, RR — nhưng **không dạy trực tiếp**, học qua tình huống |
| 🟡 2 — Read | Hiểu chart đang nói gì | Trend, Range, Breakout, Pullback, Reversal |
| 🟠 3 — Decide | Biết khi nào **không** trade | Thưởng WAIT đúng lúc (+Discipline), không ép BUY/SELL |
| 🔴 4 — Perform | Xây hệ thống cá nhân | Trading Plan cá nhân + kiểm tra tuân thủ plan |

Level 1 chia nhỏ hơn nữa để tránh cognitive overload (đồng thuận cả 4 review):
- 1a: chỉ BUY/SELL/WAIT, lot và SL cố định.
- 1b: mở khóa tùy chỉnh SL/TP.
- 1c: mở khóa Risk% và Position Sizing.

---

## 5. Trader Score — mô hình minh bạch

Không có "đáp án BUY/SELL đúng" tuyệt đối. Mỗi scenario có một **bộ tham chiếu chất lượng quyết định** (không phải hướng giá) được thiết kế trước:

- **Entry Score** — khoảng cách giữa điểm vào lệnh thực tế và vùng entry hợp lý của setup (support/resistance/breakout zone đã định nghĩa trước cho scenario đó).
- **Risk Score** — Risk% đặt ra so với ngưỡng tối ưu của scenario (càng gần ngưỡng khuyến nghị 0.5–1%, điểm càng cao).
- **RR Score** — Risk/Reward đạt được so với RR tối thiểu yêu cầu của setup.
- **FOMO Score** — tần suất vào lệnh trong vòng X giây/phút sau một nến biến động mạnh.
- **Patience Score** — % lệnh vào đúng thời điểm tín hiệu hoàn thành, không vào sớm.
- **Discipline Score** — có di chuyển SL theo cảm xúc không, có tuân thủ Decision Contract không (mục 6).

Công thức và ngưỡng phải **công khai trong app** (một màn "Cách chúng tôi chấm điểm bạn") — tránh bị phản ứng "app tự đặt đáp án đúng" như review3 cảnh báo.

---

## 6. Tính năng — phân tầng theo mức độ ưu tiên thực tế

### Tầng 0 — Phải test TRƯỚC KHI code (xem mục 8, đây là điểm khác biệt lớn nhất so với 4 bản review gốc)
Không phải tính năng, mà là một bài test giả định: người mới có sẵn sàng nhận điểm số hành vi thấp một cách trung thực hay không.

### Tầng MVP (5 module, theo đúng tinh thần plan1 + review3/4 tinh chỉnh)

| # | Module | Mô tả | Ghi chú kỹ thuật |
|---|---|---|---|
| 1 | Fixed Scenario Packs | 20–30 kịch bản, mỗi kịch bản 50–100 nến, JSON tĩnh, XAUUSD trước (đã quen dữ liệu qua EA) | Nguồn dữ liệu: xem mục 8 |
| 2 | Decision UI | BUY/SELL/WAIT trước, mở khóa SL/TP/Risk% dần theo sub-level 1a→1c | react-native-wagmi-charts hoặc victory-native, KHÔNG cần chart engine kiểu TradingView |
| 3 | Instant Autopsy | Rule-based, không cần AI: nếu vào lệnh <2 phút sau nến mạnh → gắn nhãn FOMO; nếu di chuyển SL sau khi có lãi → gắn nhãn Emotional SL, v.v. | Bộ rule cố định, viết tay cho 20–30 scenario đầu |
| 4 | Trader Profile cơ bản | Discipline / Risk / Patience / FOMO + Top 3 lỗi thường gặp | Local storage (AsyncStorage), chưa cần sync server ở MVP |
| 5 | Decision Contract (rút gọn) | Trước mỗi phiên: chọn setup đang tìm + risk % tối đa + max số lệnh. Sau phiên so sánh hành vi thực tế với contract | Đây là bổ sung tốt nhất từ review3/4, đưa thẳng vào MVP vì chi phí code thấp nhưng giá trị giáo dục cao |

### Tầng V1 (sau khi MVP có tín hiệu retention tốt)
- Slippage & Spread Simulator (mô phỏng ma sát thực tế — review1 đề xuất, quan trọng để không tạo thói quen xấu khi ra tài khoản thật).
- Weekly Market Recap (replay dữ liệu tuần vừa qua bằng dữ liệu thật, tạo cầu nối sim → reality).
- Skill Debt: lỗi nghiêm trọng → nợ kỹ năng → phải hoàn thành mini-scenario sửa lỗi mới "trả nợ" (dùng thận trọng, dễ gây cảm giác bị phạt nếu không đi kèm nguyên tắc mục 2.6).

### Tầng V2 (khi có dữ liệu hành vi đủ lớn, chưa cần nghĩ tới ở giai đoạn này)
- AI Coach dạng phản tư (không dự đoán giá).
- Counterfactual Replay ("nếu bạn đặt SL xa hơn 10 pips thì sao").
- Pressure Injection có kiểm soát (tin giả, chuỗi thua liên tiếp).
- Scenario Generator bán tự động theo lỗi phổ biến của cộng đồng.
- Shadow Trading theo chiến lược mẫu.

**Chủ động KHÔNG làm ở mọi giai đoạn gần:** AI dự đoán giá, social/leaderboard PnL, kết nối broker thật, copy trading, tim/energy kiểu Duolingo (thay bằng Progressive Challenge — không lên level nếu chưa đạt ngưỡng, nhưng thử lại vô hạn).

---

## 7. UX cấu trúc Home

Không phải "Courses / Lessons". Home = **My Trader Profile**:

```
┌─────────────────────────┐
│     MY TRADER PROFILE   │
│       Level 3 (1b)      │
│  🧠 Reading       58    │
│  🎯 Entry         61    │
│  🛡 Risk          74    │
│  🧘 Discipline    45    │
│     ▶ TODAY'S SESSION   │
└─────────────────────────┘
```

Skill progression thay vì coin/spin/jackpot: Novice → Survivor → Observer → Disciplined → Consistent → Advanced.

---

## 8. Dữ liệu — trả lời câu hỏi mà 4 bản review đều để ngỏ

Review 1/2/3/4 đều nói "đóng gói Scenario Packs tĩnh" nhưng không ai chỉ nguồn dữ liệu cụ thể. Giải pháp:

- **HistData.com** — dữ liệu OHLC/tick lịch sử forex, miễn phí, tải về file, không cần API runtime.
- **Dukascopy Historical Data Feed** — có cả XAUUSD, miễn phí, đủ chi tiết để cắt thành nến M15/H1.
- Quy trình: tải 1 lần → viết script cắt thành 20–30 đoạn 50–100 nến có tình huống rõ ràng (breakout, pullback, fake breakout, range, news spike) → gắn thủ công vùng entry/SL/TP tham chiếu cho mỗi đoạn → xuất JSON tĩnh nhúng trong app.
- **Không cần** trả phí Tiingo/Polygon/Oanda ở giai đoạn MVP — chi phí này chỉ phát sinh nếu sau này làm Weekly Market Recap (V1) cần dữ liệu tuần hiện tại, lúc đó vẫn có thể dùng API miễn phí giới hạn (ví dụ Twelve Data free tier) vì tần suất gọi rất thấp (1 lần/tuần).

---

## 9. Rủi ro & lưu ý — phần bị 4 bản review bỏ sót

1. **Rủi ro product-market fit tâm lý (quan trọng nhất):** người mới vào thị trường vì kỳ vọng kiếm tiền nhanh, không chắc muốn một app "nói thật" rằng họ là trader yếu. Đây là rủi ro về *có ai chịu dùng app này thật sự* — nặng hơn mọi rủi ro kỹ thuật. Bắt buộc validate trước khi code (xem mục 10, Bước 0).
2. **Rủi ro pháp lý/định vị tại Việt Nam:** forex trading ngoài sàn được cấp phép nằm trong vùng xám pháp lý. App mô phỏng vẫn có thể bị hiểu nhầm là quảng bá trading thật, ảnh hưởng việc duyệt trên Google Play (chính sách nghiêm với app tài chính) và rủi ro truyền thông. → Định vị ngôn ngữ như mục 1, tuyệt đối không link đến broker/sàn thật.
3. **Rủi ro retention của một app "khó chịu":** khác Duolingo (không ai thấy kém cỏi khi sai ngữ pháp), app này có thể tát vào ego người dùng mỗi phiên. Áp dụng nguyên tắc mục 2.6 (luôn có điểm sáng cụ thể) để giảm rủi ro rời bỏ.
4. **Rủi ro dễ bị sao chép:** concept "Decision-first + behavior score" không có rào cản kỹ thuật cao, các app lớn có thể copy nhanh nếu concept chứng minh hiệu quả. Lợi thế bền vững thực sự nằm ở **kho Mistake Library + Scenario Pack được tinh chỉnh qua thời gian**, không nằm ở UI — nên đầu tư chất lượng bộ tham chiếu chấm điểm (mục 5) nghiêm túc ngay từ đầu, đây là tài sản khó copy nhất.

---

## 10. Roadmap hành động — thứ tự thực dụng cho solo dev

**Bước 0 — Validate giả định tâm lý (3–5 ngày, không code app):**
Dựng 3–5 tình huống bằng Google Form/Slide tĩnh, cho 15–20 người mới học trade thật trải nghiệm, đo phản ứng khi nhận điểm Discipline/FOMO thấp. Nếu phần lớn thấy hữu ích và muốn tiếp tục → đi tiếp. Nếu phần lớn thấy khó chịu/bỏ ngang → cần điều chỉnh tông giọng feedback (mềm hơn, kèm hướng sửa cụ thể ngay lập tức) trước khi đầu tư code.

**Bước 1 — Chuẩn bị dữ liệu:** tải HistData/Dukascopy, cắt 20–30 Scenario Pack cho XAUUSD, gắn tham chiếu chất lượng quyết định thủ công.

**Bước 2 — Prototype Decision UI + Instant Autopsy** trên Expo, chỉ Level 1a–1b, chart lib nhẹ, local storage, chưa cần backend.

**Bước 3 — Test nội bộ với 10–20 người mới thật**, đo: có hiểu cách chơi không, có thấy Autopsy hữu ích không, có quay lại phiên 2 không.

**Bước 4 — Chỉ sau khi có tín hiệu tích cực rõ ràng** mới đầu tư Decision Contract, Trader Profile đầy đủ, và các tính năng tầng V1.

Không làm AI Coach, Weekly Recap, Pressure Injection, Shadow Trading ở giai đoạn này — không tính năng nào trong số đó trả lời được câu hỏi sống còn của Bước 0.

---

## 11. Monetization (giữ nguyên định hướng plan1, chưa cần chi tiết ở giai đoạn MVP)

- Free: simulator cơ bản, ~20 scenario, trader profile cơ bản.
- Pro: unlimited scenario, advanced stats, trading journal, custom training (chỉ triển khai sau khi retention MVP được chứng minh).
- Scenario Pack theo chủ đề (Gold Pack, Breakout Pack, Psychology Pack...) — mô hình content-led phù hợp với hướng zero-cost marketing đã cân nhắc trước đó (ASO + content).

---

## 12. Tóm tắt quyết định

Ý tưởng gốc đủ mạnh để tạo category riêng thay vì cạnh tranh trực tiếp với app "Forex Course". Bốn bản review đã xử lý tốt rủi ro nhận thức và chi phí kỹ thuật replay. Phần còn thiếu — và là phần quyết định app này có nên làm hay không — là: (1) validate giả định tâm lý trước khi code, (2) nguồn dữ liệu cụ thể miễn phí đã xác định, (3) định vị tránh vùng xám pháp lý VN, (4) nguyên tắc giữ retention cho một sản phẩm "nói thật". Bước tiếp theo hợp lý nhất không phải viết thêm feature, mà là chạy Bước 0.