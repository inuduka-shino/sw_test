/*eslint-env browser */
/*eslint no-console: off */
/*global Promise */

console.log('loaded main.js');

function regitServiceWorker() {
  if (navigator.serviceWorker) {
    return navigator.serviceWorker.register('./sw-cache.js')
    .then(()=>{
      console.log('serviceWorker.register成功。');
    })
    .catch((err)=>{
      console.log('serviceWorker.register失敗。');
      throw err;
    })
    .then(()=>{
      return fetch('./sw/sw_version').then((data) =>{
            if (data.ok) {
              return data.text();
            }

            return null;
            //throw new Error('sw_version is no response.');
        })
        .then((version)=>{
            if (version === null) {
              return null;
            }

            return {version};
        });
    });
  }

  return Promise.resolve()
  .then(()=>{
    console.log('serviceWorkerが使えません。');
    throw new Error('navigator.serviceWorker undefined.');
  });
}


const $id=document.getElementById.bind(document);

function checkLoadedDocument() {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve();
    }
  });
}

function infoMessage($info) {
  return {
    log(msg) {
      console.log(msg);
      $info.textContent = msg;
    }
  };
}
function ttgView($disp) {
  return {
    setInnerHTML(strHtml) {
      $disp.innerHTML = strHtml;
    }
  };
}

//eslint-disable-next-line max-statements
(async () => {
  const values = await Promise.all([
          checkLoadedDocument(),
          regitServiceWorker()
        ]),
        swInfo = values[1];

  console.log('LoadedDoccument');
  const tView= ttgView($id('disp')),
        message= infoMessage($id('info'));

  message.log('hello.');
  tView.setInnerHTML('init data by script');

  if (swInfo === null) {
    message.log('please, reload for servie workers.');

    return;
  }

  message.log(swInfo.version);
  const dataText = await fetch('./sample.data').then((data)=>{
    return data.text();
  });

  tView.setInnerHTML(dataText);
})();
