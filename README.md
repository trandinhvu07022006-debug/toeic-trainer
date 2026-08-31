# TOEIC Trainer

App luyện TOEIC cá nhân, chạy trên máy bạn. Mobile-first, hoạt động offline,
lưu tiến độ bằng `localStorage`.

## Chạy lần đầu

Cần Node.js 18 trở lên. Kiểm tra bằng `node -v`.

```bash
npm install     # cài phụ thuộc, chạy một lần
npm run dev     # mở http://localhost:5173
```

Muốn mở trên điện thoại cùng mạng Wi-Fi: sau `npm run dev`, terminal in ra một
địa chỉ dạng `http://192.168.x.x:5173` — mở địa chỉ đó trên điện thoại.

Các lệnh khác:

```bash
npm run build     # đóng gói vào dist/ để đưa lên hosting
npm run preview   # xem thử bản đã đóng gói
npm test          # chạy 62 kiểm thử (logic + dữ liệu + accessibility)
```

## Cấu trúc

```
src/
├─ data/                 Toàn bộ nội dung học, tách khỏi code
│  ├─ vocab/*.json       Mỗi chủ đề một file — thả thêm file là app tự nhận
│  ├─ grammar.json       9 chuyên đề ngữ pháp
│  ├─ reading.json       Part 5, 6, 7
│  ├─ listening.json     Part 1–4 và chép chính tả
│  ├─ speaking.json      5 đề Speaking (55 câu)
│  └─ index.js           Nạp dữ liệu, dựng chỉ mục dẫn xuất
├─ lib/                  Logic thuần, không dính giao diện
│  ├─ storage.js         localStorage có đánh version, xuất/nhập JSON
│  ├─ srs.js             Spaced repetition theo ngày thật
│  ├─ scoring.js         Quy đổi điểm LC/RC, mốc CEFR
│  ├─ exam.js            Dựng đề ngẫu nhiên
│  ├─ tts.js             Web Speech API
│  ├─ recorder.js        MediaRecorder
│  └─ utils.js           Xáo trộn, so khớp chép chính tả, khoét chỗ trống
├─ ui/                   Theme sáng/tối và thành phần dùng chung
└─ features/             Sáu màn hình, mỗi tab một file
```

## Thêm nội dung

**Từ vựng.** Tạo file mới trong `src/data/vocab/`, ví dụ `medical.json`:

```json
{
  "topic": "Y tế",
  "words": [
    {
      "id": "med001",
      "topic": "Y tế",
      "w": "prescription",
      "ipa": "/prɪˈskrɪpʃn/",
      "pos": "n",
      "vi": "đơn thuốc",
      "ex": "The pharmacist filled the prescription in ten minutes.",
      "exVi": "Dược sĩ chuẩn bị xong đơn thuốc trong mười phút.",
      "col": ["fill a prescription", "a repeat prescription"]
    }
  ]
}
```

App tự nhận chủ đề mới, không phải sửa dòng code nào. `id` chỉ cần không trùng.

**Ảnh minh hoạ từ vựng.** Thêm một dòng vào `VOCAB_ART` trong `src/ui/art.jsx`,
key trùng `id` của từ. Không vẽ cũng được, app dùng hình mặc định.

**Câu hỏi đọc.** Thêm vào `src/data/reading.json`. Bài Part 7 cần trường
`group` là `"single"`, `"double"` hoặc `"triple"`; double dùng `bodyA`/`bodyB`,
triple thêm `bodyC`.

**Câu nghe.** Thêm vào `src/data/listening.json`. Part 3 và 4 mỗi dòng có
`en`, `vi`, và `hard` để đánh dấu chỗ nghe khó.

**Cấu hình đề thi.** Sửa `EXAM_FORMATS` trong `src/features/Exam.jsx`.

## Dữ liệu của bạn

Tiến độ nằm trong `localStorage` của trình duyệt, không gửi đi đâu. Bản ghi âm
Speaking chỉ tồn tại trong bộ nhớ phiên. Tab Tiến độ có nút xoá toàn bộ dữ liệu.

## Giao diện

Thiết kế theo hướng "phòng đọc / sách luyện đề": nền giấy ấm ở chế độ sáng
(mặc định) và than pha xanh thông ở chế độ tối. Màu nhấn là **xanh thông**
(gợi sự tập trung và "đúng"), thay cho tím-indigo cũ. Đầu đề và con số đặt bằng
**Fraunces** (serif có cá tính), thân bài dùng **Inter**. Trang chủ có "thước
điểm" theo dõi độ thành thạo từng phần 1–7.

Bố cục tự thích ứng: điện thoại dùng thanh điều hướng dưới, máy tính dùng
sidebar cố định bên trái với vùng nội dung rộng hơn. Font tải từ Google Fonts,
được service worker lưu lại để giữ đúng nhận diện khi dùng offline; nếu lần đầu
mất mạng, app tự lùi về font hệ thống.

## Ngân hàng nội dung

| Phần | Số lượng | Một đề thật cần |
|---|---|---|
| Từ vựng | 4.424 từ / 52 chủ đề | — |
| Part 1 | 24 câu | 6 |
| Part 2 | 100 câu | 25 |
| Part 3 | 29 hội thoại / 87 câu | 13 hội thoại |
| Part 4 | 23 bài nói / 69 câu | 10 bài |
| Part 5 | 106 câu (24 + 82 câu ngữ pháp) | 30 |
| Part 6 | 12 bài / 48 câu | 4 bài |
| Part 7 | 42 bài (8 đôi · 9 ba) / 162 câu | 54 câu |
| Speaking | 5 đề / 55 câu | 11 câu |

Ngân hàng gấp khoảng hai lần một đề thật, nên hai lần thi Full liên tiếp chỉ trùng
khoảng 30% số câu. Vị trí đáp án đúng được rải đều A/B/C/D ở mọi phần — đoán mò
một chữ cái chỉ trúng khoảng 25%.

## Giới hạn đã biết

- Audio dùng giọng tổng hợp của trình duyệt, không thay thế được audio đề thật.
  Chỗ nối âm và nuốt âm được đánh dấu trong transcript nhưng máy sẽ không đọc ra
  đúng hiện tượng đó.
- Điểm quy đổi chỉ là ước lượng, không phải điểm ETS.
- ETS quy đổi riêng cho từng đề và không công bố bảng, nên điểm hiển thị chỉ để
  theo dõi xu hướng tiến bộ chứ đừng coi là điểm thi thật.

## Bản quyền

Toàn bộ nội dung trong `src/data/` là nội dung tự viết. Không sao chép từ đề thi
hay giáo trình có bản quyền.
