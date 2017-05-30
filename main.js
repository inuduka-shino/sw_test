/*eslint-env browser */
/*eslint no-console: off */
/*global Promise */

console.log('loaded main.js');

const regitServiceWorker = (()=>{
  if (navigator.serviceWorker) {
    return navigator.serviceWorker.register('./sw-cash.js')
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

            throw new Error('sw_version is no response.');
        })
        .then((version)=>{

            return {version};
        });

    });
  }

  return Promise.resolve()
  .then(()=>{
    console.log('serviceWorkerが使えません。');
    throw new Error('navigator.serviceWorker undefined.');
  });
})();


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
      console.log(msg);
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

const persedDocument= LoadedDocument.then(()=>{
  console.log('LoadedDoccument');

  const docElements = {
      tView: ttgView($id('disp')),
      tView2: ttgView($id('disp2')),
      message: infoMessage($id('info'))
    };

  docElements.message.log('hello.');
  docElements.tView.setInnerHTML('script init data');

  return docElements;
});


Promise.all([persedDocument,regitServiceWorker]).then((values)=>{
  const doc = values[0],
        swInfo = values[1];

  doc.message.log(swInfo.version);

  fetch('./sw/sample.data').then((data) =>{
      return data.text();
  })
  .then(doc.tView.setInnerHTML);

  fetch('./sw/sample2.data').then((data) =>{
      return data.text();
  })
  .then(doc.tView2.setInnerHTML);
});
