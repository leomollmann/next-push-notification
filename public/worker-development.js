/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
self.addEventListener('push', function (event) {
  const data = JSON.parse(event.data.text());
  event.waitUntil(registration.showNotification(data.title, {
    body: data.message,
    icon: '/public/next.svg'
  }));
});
/******/ })()
;