/* sw-cache.js */
/*eslint-env browser */
/*eslint no-console: off */

//
const swVersion = 'sw-cash.js(2017/06/02 07:06)';
const cacheName = 'sw-test';

console.log(`${swVersion} loaded.`);

self.addEventListener('install', (event) => {
  console.log(`${swVersion} install.`);
  event.waitUntil(Promise.resoleve());
});
self.addEventListener('activate', (event) => {
  console.log(`${swVersion} activate.`);
  event.waitUntil(Promise.resoleve());
});

const urlPattern = /^([^:]+):\/\/([^/]*)\/([^?]*)(\?[^#]*)?(#.*)?$/;

function parseURL(url) {
  const urlStruct = urlPattern.exec(url);

  //console.log(`url:${url}`);

  return {
    scheme: urlStruct[1],
    authorityComponent: urlStruct[2],
    path: urlStruct[3],
    query: urlStruct[4],
    fragment: urlStruct[5],
  };
}

const swPathPattern = /^[^/]+\/sw\/(.*)$/;

function checkSWPath(path) {
    const matchResult = swPathPattern.exec(path);

    if (matchResult) {
      return matchResult[1];
    }

    return null;
}

//eslint-disable-next-line max-statements
self.addEventListener('fetch', (event) => {
  //console.log('fire fetch event');
  //console.log(event.request);

  const requestUrl = parseURL(event.request.url),
        swPath = checkSWPath(requestUrl.path);

  //console.log(`fire fetch event:${event.request.url}`);


  if (swPath !== null) {
    //console.log(`sw special :${event.request.url}`);
    console.log(`swPath:${swPath}`);

    if (swPath === 'sw_version') {
        event.respondWith(new Response(swVersion));
    } else if (swPath === 'sample.data') {
        event.respondWith(fetch('sample-A.data'));
    } else if (swPath === 'sample2.data') {
        event.respondWith(fetch('https://inuduka-shino.github.io/sw_test/sample.data'));
    }

    return;
  }

  if (event.request.url.startsWith(location.origin)) {

      console.log(`normal cache target:${event.request.url}`);

      //eslint-disable-next-line max-len
      // ref: https://developers.google.com/web/fundamentals/getting-started/primers/service-workers?hl=ja
      /*
      event.respondWith(
        caches.match(event.request)
       .then((response) => {
           // キャッシュがあったのでレスポンスを返す
           if (response) {
             return response;
           }

           const fetchRequest = event.request.clone();

           return fetch(fetchRequest).then((response) => {
              // レスポンスが正しいかをチェック
              if (!response || response.status !== 200 || response.type !== 'basic') {
               return response;
              }
              const responseToCache = response.clone();

              caches.open(cacheName)
               .then((cache) => {
                 cache.put(event.request, responseToCache);
               });

             return response;
           });
         })
     );
     */
  }


});
