/**
 * ================================================
 * 📚 Service Worker – منصة نتعلم سوياً
 * 👨‍🏫 إعداد: كنان سكيف
 * 📅 2025
 * ================================================
 */

const CACHE_NAME = 'manhaj-v5.0.1'; // تم تحديث رقم الإصدار

/* الملفات التي تُحفظ للعمل بدون إنترنت */
const FILES_TO_CACHE = [
  './',
  './index.html',
  './lesson1.html',
  './lesson2.html',
  './lesson3.html',
  './lesson4.html',
  './lesson5.html',
  './lesson6.html',
  './lesson7.html',
  './lesson8.html',
  './lesson9.html',
  './simulator.html',
  './simulator-lessons.html',
  './numbers.html',
  './journey.html',
  './malware.html',
  './worksheet.html',
  './faq.html',            /* ملف الأسئلة الشائعة الجديد */
  './honor.html',          /* ملف لوحة الشرف الجديد */
  './logo.png',
  './teacher-logo.png',    /* شعار المعلم الشخصي */
  './manifest.json'
];

/* تثبيت Service Worker */
self.addEventListener('install', (event) => {
  console.log('✅ جاري تثبيت Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 جاري حفظ الملفات...');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('✅ تم حفظ جميع الملفات!');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ خطأ في الحفظ:', error);
      })
  );
});

/* تفعيل Service Worker وحذف النسخ القديمة */
self.addEventListener('activate', (event) => {
  console.log('🚀 جاري تفعيل Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ حذف النسخة القديمة:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ تم التفعيل!');
      return self.clients.claim();
    })
  );
});

/* اعتراض الطلبات */
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});
