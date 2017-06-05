/* sw-cache.js */
/*eslint-env browser */
/*eslint no-console: off */

//
const swVersion = 'sw-cash.js(2017/06/06 06:46)';
const cacheName = 'sw-test-v1';
const cacheNamePattern = /^sw-test(|-v[0-9]+)$/;
const checkUpdateUrl =(()=>{
  const checkList =[
     '',
     'index.html',
     'main.css',
     'main.js',
   ].map((subPath) => {
     const pathStruct = location.pathname.split('/');

     pathStruct.splice(-1,1,subPath);

     return [location.origin, pathStruct.join('/')].join('');
   });

   return (url)=>{
     return checkList.indexOf(url) >= 0;
   };
})();

async function deleteOldVerCache() {
  const cacheNames = await caches.keys();

  await Promise.all(
    cacheNames.map((otherCacheName) => {
      if (cacheNamePattern.test(otherCacheName) && otherCacheName !== cacheName) {
        return caches.delete(otherCacheName);
      }

      return Promise.resolve();
    })
  );
}

console.log(`${swVersion} loaded.`);

self.addEventListener('install', (event) => {
  console.log(`${swVersion} install.`);
  event.waitUntil(Promise.resolve());
});

self.addEventListener('activate', (event) => {
  console.log(`${swVersion} activate.`);
  event.waitUntil(deleteOldVerCache());
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


async function getCacheResponse0(req) {
  //eslint-disable-next-line max-len
  // ref: https://developers.google.com/web/fundamentals/getting-started/primers/service-workers?hl=ja

  const cache = await caches.open(cacheName);
  const cacheResp = await cache.match(req);


  if (cacheResp) {
    return cacheResp;
  }
  // Fetch and Cache save
  const req2 = req.clone();
  const resp = await fetch(req);

  if (resp.status === 200 && resp.type === 'basic') {
    const resp2 = resp.clone();

    await cache.put(req2, resp2);
  }

  return resp;
}

//eslint-disable-next-line max-statements
async function getUpdateOrCacheResponse(req) {
  // Fetch and Cache save
  const cache = await caches.open(cacheName);
  const req2 = req.clone();
  const resp = await fetch(
    req,
    {cache: 'default'}
  );

  if (resp.status === 200 && resp.type === 'basic') {
    const resp2 = resp.clone();

    await cache.put(req2, resp2);

    return resp;
  }
  const cacheResp = await cache.match(req);

  if (cacheResp) {
    return cacheResp;
  }

  return resp;
}

async function getCacheResponse(req) {
  const UpdateMode = checkUpdateUrl(req.url);
  let resp = null;

  if (UpdateMode) {
    resp = await getUpdateOrCacheResponse(req);
  } else {
    resp = await getCacheResponse0(req);
  }

  return resp;
}

//eslint-disable-next-line max-statements
self.addEventListener('fetch', (event) => {

  const requestUrl = parseURL(event.request.url),
        swPath = checkSWPath(requestUrl.path);

  console.log(`fire fetch event:${event.request.url}`);

  if (swPath !== null) {
    //console.log(`sw special :${event.request.url}`);
    console.log(`swPath:${swPath}`);

    if (swPath === 'sw_version') {
      event.respondWith(Promise.resolve(new Response(swVersion)));
    } else if (swPath === 'sample.data') {
      event.respondWith(fetch('sample-A.data'));
    } else if (swPath === 'sample2.data') {
      event.respondWith(fetch('https://inuduka-shino.github.io/sw_test/sample.data'));
    } else {
      event.respondWith(new Response(null));
    }

    return;
  }
  if (event.request.url.startsWith(location.origin)) {
    event.respondWith(getCacheResponse(event.request));
  }
});
