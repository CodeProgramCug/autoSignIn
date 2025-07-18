const CACHE_NAME = "checkin-rewards-v1"
const urlsToCache = [
  "/",
  "/manifest.json",
  "/images/wechat-pay-points.jpeg",
  "/images/wechat-pay-recommend.jpeg",
  "/images/wechat-contact.jpeg",
]

// 安装事件
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// 获取事件
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 如果缓存中有响应，则返回缓存的版本
      if (response) {
        return response
      }

      // 否则，获取网络响应
      return fetch(event.request)
        .then((response) => {
          // 检查是否收到有效响应
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // 克隆响应
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // 网络失败时，返回离线页面
          if (event.request.destination === "document") {
            return caches.match("/")
          }
        })
    }),
  )
})

// 激活事件
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
