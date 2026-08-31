/* Service worker: dùng được offline nhưng không phục vụ app cũ sau khi cập nhật.

   Hai chiến lược khác nhau cho hai loại tài nguyên:
   - Trang (index.html): NETWORK-FIRST. Tên file không có mã băm nên nếu cache
     trước thì sau khi triển khai bản mới, người dùng vẫn mở ra app cũ. Ưu tiên
     lấy từ mạng, hỏng mạng mới lấy bản đã lưu.
   - Tài nguyên tĩnh (js/css/ảnh): CACHE-FIRST. Vite gắn mã băm vào tên file nên
     nội dung mới luôn có URL mới, không bao giờ bị phục vụ nhầm bản cũ. */
const CACHE = "toeic-trainer-v5";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Font Google (Fraunces/Inter): cache-first để giữ đúng nhận diện khi offline.
  // Đây là ngoại lệ cross-origin có chủ đích, chỉ cho hai miền font.
  const isFont = url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com";
  if (isFont) {
    e.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((res) => {
        if (res && (res.ok || res.type === "opaque")) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }).catch(() => cached))
    );
    return;
  }

  if (url.origin !== self.location.origin) return; // các miền khác: không can thiệp

  const isPage = req.mode === "navigate" || url.pathname.endsWith(".html");

  if (isPage) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match("./index.html")))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      const fetchAndCache = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(req, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetchAndCache;
    })
  );
});
