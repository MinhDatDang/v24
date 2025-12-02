const CACHE_NAME = "saferoute-ai-cache-v2";

// Các file được cache sẵn (App Shell)
const APP_SHELL = [
  "./",
  "./index.html",
  "./dem/hatinh_30m_0p001.json",
  "./dem/hatinh_150km_0p003.json",

  // Thư viện CDN chính

  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
  "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
];

// Khi cài đặt SW → cache các file App Shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

// Clear cache cũ khi update phiên bản
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
});

// Chặn mọi request → ưu tiên cache trước (offline)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => {
      // Nếu có trong cache → trả về ngay
      if (resp) return resp;

      // Nếu không → thử fetch online
      return fetch(event.request).catch(() => {
        // Nếu fetch lỗi (mất mạng) → trả về từ cache nếu có
        return caches.match(event.request);
      });
    })
  );
});
