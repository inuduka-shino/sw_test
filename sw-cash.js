/* sw-cash.js */
/*eslint-env browser */
/*eslint no-console: off */

//
console.log('sw-cash.js loaded.');

self.addEventListener('install', (event) => {
  console.log('fire install event.');
  console.log(event);

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
  console.log('fire fetch event');
  console.log(event.request);

  const requestUrl = parseURL(event.request.url),
        swPath = checkSWPath(requestUrl.path);

  console.log(`swPath:${swPath}`);
  if (swPath === null) {
    return;
  }
  console.log(`swPath:${swPath}`);

  if (swPath === 'sw_version') {
      event.respondWith(new Response('sw_version: 2015/07/29 08:24'));
  } else if (swPath === 'sample.data') {
      event.respondWith(fetch('sample-A.data'));
  } else if (swPath === 'sample2.data') {
      event.respondWith(fetch('https://inuduka-shino.github.io/sw_test/sample.data'));
  }

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
