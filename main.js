/*eslint-env browser */
/*eslint no-console: off */

console.log('loaded main.js');

const $id=document.getElementById.bind(document);

const LoadedDocument = new Promise((resolve) => {
  console.log(`Doc readyState:${document.readyState}`);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', resolve);
  } else {
    console.log(`Doc readyState:${document.readyState}`);
    resolve();
  }
});

function infoMessage($info) {
  return {
    log(msg) {
      $info.textContent=msg;
    }
  };
}
function ttgView($disp) {
  return {
    setInnerHTML(strHtml) {
      $disp.innerHTML=strHtml;
    }
  };
}

LoadedDocument.then(()=>{
  console.log('LoadedDoccument');

  const tView = ttgView($id('disp')),
        message = infoMessage($id('info'));

  message.log('hello.');

  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('./sw-cash.js')
    .then(()=>{
      message.log('serviceWorker.register成功。');
    })
    .catch((err)=>{
      message.log('serviceWorker.register失敗。');
      throw err;
    });
  } else {
    //console.log(`navigator.serviceWorker:${typeof navigator.serviceWorker}`);
    message.log('serviceWorkerが使えません。');
  }
  tView.setInnerHTML('script init data');

  fetch('./sample.data').then((data) =>{
      return data.text();
  })
  .then(tView.setInnerHTML);
});
