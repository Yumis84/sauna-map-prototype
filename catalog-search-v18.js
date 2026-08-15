// Поиск внутри каталога с синхронизацией карты и кнопкой очистки. v18
(function(){
  if(window.__pargidCatalogSearchV18)return;
  window.__pargidCatalogSearchV18=true;

  const style=document.createElement('style');
  style.textContent=`
    #catalog .catalog-search-wrap{position:relative;margin:0 0 14px}
    #catalog .catalog-search{width:100%;height:46px;border:1px solid #ffffff16;border-radius:15px;background:#111815;color:#f4f7f5;padding:0 46px 0 14px;outline:none;box-shadow:0 8px 24px #0003}
    #catalog .catalog-search::placeholder{color:#829089}
    #catalog .catalog-search:focus{border-color:#f2a93b88;box-shadow:0 0 0 3px #f2a93b18,0 8px 24px #0003}
    #catalog .catalog-search-clear{position:absolute;right:5px;top:5px;width:36px;height:36px;border:0;border-radius:11px;background:transparent;color:#a9b5af;font-size:25px;line-height:1;display:grid;place-items:center;padding:0}
    #catalog .catalog-search-clear:hover,#catalog .catalog-search-clear:active{color:#fff;background:#ffffff0d}
    #catalog .catalog-search-clear[hidden]{display:none!important}
  `;
  document.head.appendChild(style);

  let syncing=false;

  function ensureSearch(){
    const catalog=document.getElementById('catalog');
    const head=catalog?.querySelector('.head');
    const mapInput=document.getElementById('q');
    if(!catalog||!head||!mapInput)return false;

    let wrap=catalog.querySelector('.catalog-search-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='catalog-search-wrap';
      wrap.innerHTML='<input class="catalog-search" type="search" inputmode="search" autocomplete="off" aria-label="Поиск по каталогу" placeholder="Название, адрес, бассейн, хаммам…"><button class="catalog-search-clear" type="button" aria-label="Очистить поиск" hidden>×</button>';
      head.insertAdjacentElement('afterend',wrap);

      const input=wrap.querySelector('.catalog-search');
      const clear=wrap.querySelector('.catalog-search-clear');

      const updateClear=()=>{clear.hidden=!input.value.length};
      input.value=mapInput.value||'';
      updateClear();

      input.addEventListener('input',()=>{
        if(syncing)return;
        syncing=true;
        mapInput.value=input.value;
        updateClear();
        mapInput.dispatchEvent(new Event('input',{bubbles:true}));
        syncing=false;
      });

      clear.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        if(!input.value&&!mapInput.value)return;
        syncing=true;
        input.value='';
        mapInput.value='';
        updateClear();
        mapInput.dispatchEvent(new Event('input',{bubbles:true}));
        syncing=false;
        input.focus();
      });

      mapInput.addEventListener('input',()=>{
        if(syncing)return;
        syncing=true;
        input.value=mapInput.value||'';
        updateClear();
        syncing=false;
      });
    }
    return true;
  }

  function boot(){
    let tries=0;
    const wait=()=>{
      tries++;
      if(!ensureSearch()&&tries<120)setTimeout(wait,50);
    };
    wait();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
