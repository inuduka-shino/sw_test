/* sw-cash.js */
/*eslint-env browser */
/*eslint no-console: off */

//
console.log('sw-cash.js loaded.');

self.addEventListener('install', (event) => {
  console.log('fire install event.');
  console.log(event);

});

const constTest='const test';

self.addEventListener('fetch', (event) => {
  console.log('fire fetch event');
  console.log(event.request);

  const requestUrl = event.request.url;
  // const urlPattern = /[^:]+:\/\/[^\/]+\/([^#]*)/;

  console.log(`constTest:${constTest}`);

  console.log(`url:${requestUrl}`);
  console.log(`location:${location.pathname}`);

  /*event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // キャッシュがあったのでそのレスポンスを返す
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
  */
});

self.addEventListener('activate', () => {
  console.log('fire activate event.');
});
