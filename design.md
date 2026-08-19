# Design Spec — MVP Screens

> Đặc tả UI/UX cho 3 màn hình cốt lõi của MVP, dựa trên plan1_final.md. Dùng làm tham chiếu khi build Expo/React Native.

---

## 0. Design principles áp dụng cho toàn app

- **Không phải app "khóa học"** — Home không có danh sách Lessons/Courses, chỉ có Trader Profile + 1 CTA duy nhất ("Today's session").
- **Flat, tối giản** — không gradient, không shadow trang trí, border mảnh 0.5–1px, bo góc nhẹ (8–12px).
- **Semantic color, không trang trí** — xanh lá = tốt/thành công, đỏ = lỗi/thua, vàng/cam = cảnh báo/root cause, tím/xanh dương = trạng thái trung tính (level, entry).
- **Mỗi màn hình kết quả (Autopsy) luôn có ít nhất 1 block màu xanh** — nguyên tắc giữ retention đã chốt trong plan1_final.md mục 2.6, không chỉ liệt kê lỗi.
- **Tối đa 3 lựa chọn hành động chính trên Decision UI** (Buy / Sell / Wait) — không thêm tham số ở sub-level 1a.
- Icon: outline style, đơn sắc, không dùng icon nhiều màu.
- Typography: 2 trọng lượng (regular/medium), không dùng bold nặng; cỡ chữ nhỏ nhất 11px.

---

## 1. Screen: Home / Trader Profile

**Mục đích:** điểm vào duy nhất của app, thay thế hoàn toàn mô hình "danh sách bài học".

**Bố cục (top → bottom):**
1. Avatar tròn hiển thị Level hiện tại (ví dụ "L3") — nền accent nhạt, chữ đậm màu accent.
2. Label phụ: `Level {n} · sub {1a/1b/1c/2/3/4}`.
3. Grid 2×2 — 4 chỉ số Trader Score: Reading, Entry, Risk, Discipline (theo mục 5 plan1_final.md). Mỗi ô: icon nhỏ + label 11px màu muted + số điểm 18px medium.
4. Nút CTA chính, full-width, nền fill-primary: **"Today's session"** + icon play.

**Trạng thái:**
- Điểm số cập nhật ngay sau mỗi phiên, không cần refresh thủ công.
- Nếu người dùng chưa hoàn thành phiên nào trong ngày → CTA giữ nguyên style, không dùng badge "!" gây áp lực (tránh cảm giác notification-nag).

**Dữ liệu cần:** 4 điểm số hiện tại (từ AsyncStorage local ở MVP), level/sub-level hiện tại.

---

## 2. Screen: Decision UI (Scenario Player)

**Mục đích:** màn hình lặp lại nhiều nhất trong app — nơi diễn ra learning loop cốt lõi.

**Bố cục:**
1. Header nhỏ: cặp tiền + khung thời gian (`XAUUSD · M15`) và vị trí trong pack (`#14/30`).
2. Candle chart tĩnh — nến từ Scenario Pack JSON (mục 8 plan1_final.md), tối đa hiển thị ~10-15 nến gần nhất trên viewport để không rối mắt trên màn hình nhỏ. Đường kẻ đứt ngang tùy chọn để đánh dấu vùng resistance/support tham chiếu.
3. Câu hỏi ngữ cảnh ngắn (1 dòng, ≤ 20 từ) mô tả tình huống — KHÔNG giải thích lý thuyết, chỉ mô tả sự kiện vừa xảy ra.
4. 3 nút hành động ngang hàng, cùng kích thước: **Buy** (nền xanh lá nhạt) / **Sell** (nền đỏ nhạt) / **Wait** (nền trung tính).

**Quy tắc sub-level (theo mục 4 plan1_final.md):**
- 1a: chỉ 3 nút Buy/Sell/Wait, lot & SL cố định ẩn hoàn toàn khỏi UI.
- 1b: sau khi chọn Buy/Sell → hiện thêm 2 input SL/TP (không hiện cùng lúc với bước chọn hướng).
- 1c: mở khóa thêm input Risk % — vẫn tách bước, không dồn 4 tham số vào 1 màn hình.

**Sau khi chọn:** chart tiếp tục chạy thêm nến (animate ngắn), rồi chuyển sang kết quả lệnh (thắng/thua/hòa) trước khi vào Autopsy.

**Dữ liệu cần:** Scenario Pack JSON hiện tại (mảng OHLC + vùng tham chiếu entry/SL/TP để chấm điểm), index nến hiện tại.

---

## 3. Screen: Trade Autopsy

**Mục đích:** giá trị giáo dục cốt lõi — nơi người dùng "nhìn thấy chính mình". Đây là màn hình quyết định retention.

**Bố cục (thứ tự bắt buộc, không đảo):**
1. Badge kết quả lệnh ở đầu — nền đỏ nếu thua (`Stop loss · -18 pips`), nền xanh nếu thắng.
2. Timeline rút gọn 3 dòng, mỗi dòng: giờ + icon clock + mô tả hành động (vào lệnh, dời SL, kết quả). Tối đa 4 dòng, không liệt kê toàn bộ mọi tick giá.
3. Block **Root cause** (nền vàng/cam) — tiêu đề ngắn (`FOMO entry`) + 1 câu giải thích rule-based cụ thể (ví dụ: khoảng thời gian giữa nến mạnh và lúc vào lệnh).
4. Block **Điểm tốt** (nền xanh lá) — LUÔN xuất hiện, kể cả phiên thua hoàn toàn. Nêu đúng 1 điều làm đúng, cụ thể (ví dụ: Risk% nằm trong ngưỡng khuyến nghị).

**Quy tắc nội dung:**
- Root cause phải map trực tiếp tới rule-based logic đã định nghĩa cho scenario đó (mục 6, Module 3 trong plan1_final.md) — không dùng ngôn ngữ mơ hồ như "bạn cần cẩn thận hơn".
- Không hiển thị PnL bằng số tiền lớn nổi bật hơn phần phân tích hành vi — tránh lặp lại sai lầm "chấm điểm theo lãi/lỗ" mà plan1 gốc đã cảnh báo.

**Dữ liệu cần:** log quyết định trong phiên (timestamp, hành động, giá), bộ rule root-cause tương ứng scenario, điểm tốt đã đạt (tính từ Trader Score components ở mục 5).

---

## 4. Component tái sử dụng giữa các màn hình

| Component | Dùng ở | Ghi chú |
|---|---|---|
| Score chip (icon + label + số) | Home, Autopsy | Icon Tabler outline, số 18px medium |
| Candle chart tĩnh | Decision UI | react-native-wagmi-charts hoặc victory-native, dữ liệu tĩnh từ JSON, không realtime |
| Action button group (Buy/Sell/Wait) | Decision UI | 3 nút bằng nhau, không có nút nào nổi bật hơn để tránh dẫn dắt lựa chọn |
| Result badge | Autopsy | Màu semantic theo kết quả lệnh |
| Insight block (root cause / điểm tốt) | Autopsy | 2 biến thể màu, cùng layout |

---

## 5. Việc chưa thiết kế ở bản này (để làm tiếp)

- Decision Contract (màn trước phiên — khai báo setup/risk/max lệnh).
- Scenario select / Level map (màn chọn hoặc mở khóa scenario).
- Mistake Library / Top 3 lỗi (mở rộng từ Home).
- Onboarding/Pre-flight ngắn cho người dùng lần đầu.

Đây là các màn hình thuộc tầng V1 hoặc bổ trợ, chưa cần thiết kế trước khi bắt đầu code MVP Decision UI + Autopsy.