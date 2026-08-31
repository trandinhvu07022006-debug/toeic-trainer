# Đưa TOEIC Trainer lên web

App đã được tối ưu cho web: tách nhỏ mã theo màn (mỗi tab tải riêng),
dữ liệu từ vựng chỉ tải khi mở tab Từ vựng, và có PWA để cài như app điện thoại.

## Build

```bash
npm install
npm run build
```

Kết quả nằm trong thư mục `dist/` — đây là toàn bộ trang web tĩnh, deploy ở đâu cũng chạy.

## Cách deploy nhanh (chọn một)

**Vercel** (Khuyên dùng, tối ưu nhất):
- Đã có sẵn cấu hình chuyên nghiệp trong `vercel.json` giúp ứng dụng tận dụng bộ nhớ đệm phân tán (Edge Cache siêu tốc) và tự thêm các chuẩn bảo mật (`X-Frame-Options`...).
- **Cách làm:** Chỉ cần đẩy code này lên GitHub, vào Vercel và chọn Import repo, sau đó ấn Deploy. (Tự động nhận diện Vite).

**Netlify / Cloudflare Pages** (Miễn phí khác):
- Kéo thả thư mục `dist/` vào trang của họ, hoặc nối với Git repo
- Lệnh build: `npm run build` · Thư mục xuất: `dist`

**GitHub Pages:**
- Đẩy code lên GitHub, bật Pages trỏ vào nhánh chứa `dist/`
- Vì `vite.config.js` đã đặt `base: "./"` nên chạy được ở cả thư mục con

**Máy chủ tĩnh bất kỳ** (nginx, Apache, hoặc thử tại chỗ):
```bash
npm run preview      # xem thử bản build tại http://localhost:4173
```
Hoặc copy `dist/` vào thư mục web gốc của máy chủ.

## Tối ưu đã áp dụng

- **Tách mã theo màn**: trang đầu chỉ khoảng 62KB (gzip); các phần nặng tải khi cần
- **Dữ liệu tách chunk**: 3.000+ từ vựng chỉ tải khi mở tab Từ vựng
- **PWA**: có manifest + service worker, cài được lên màn hình chính, chạy offline sau lần tải đầu
- **Đường dẫn tương đối** (`base: "./"`): deploy được ở bất kỳ thư mục nào

## Lưu ý

- App lưu tiến độ trong localStorage của trình duyệt — không cần máy chủ backend
- Phần đọc phát âm (nghe/nói) dùng giọng đọc sẵn có của trình duyệt
