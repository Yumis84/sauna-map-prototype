// Поиск в каталоге и на карте: синхронизация, очистка и защита экранов. v18.2
(function(){
  if(window.__pargidCatalogSearchV182)return;
  window.__pargidCatalogSearchV182=true;

  const style=document.createElement('style');
  style.textContent=`
    /* Каталог всегда перекрывает карту; верх карты не должен просвечивать поверх него. */
    #catalog.on{z-index:950!important}
    body:has(#catalog.on) #mapTop,
    #app:has(#catalog.on) #mapTop{display:none!important}
    body:has(#catalog.on) #cards,
    #app:has(#catalog.on) #cards{display:none!important}

    #catalog .catalog-search-wrap{position:relative;margin:0 0 14px}
    #catalog .catalog-search{width:100%;height:46px;border:1px solid #ffffff16;border-radius:15px;background:#111815;color:#f4f7f5;padding:0 46px 0 14px;outline:none;box-shadow:0 8px 24px #0003}
    #catalog .catalog-search::placeholder{color:#829089}
    #catalog .catalog-search:focus{border-color:#f2a93b88;box-shadow:0 0 0 3px #f2a93b18,0 8px 24px #0003}
    #catalog .catalog-search-clear{position:absolute;z-index:3;right:5px;top:5px;width:36px;height:36px;border:0;border-radius:11px;background:transparent;color:#a9b5af;font-size:25px;line-height:1;display:none;place-items:center;padding:0}
    #catalog .catalog-search-wrap.has-query .catalog-search-clear{display:grid}
    #catalog .catalog-search-clear:active{color:#fff;background:#ffffff0d}

    #mapTop .search{position:relative}
    #mapTop .search #q{padding-right:46px!important}
    #mapTop .map-search-clear{position:absolute;z-index:5;right:9px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;border-radius:10px;background:#111815;color:#c7d0cb;font-size:25px;line-height:1;display:none;place-items:center;padding:0;pointer-events:auto}
    #mapTop .search.has-query .map-search-clear{display:grid!important}
    #mapTop .map-search-clear:active{color:#fff;background:#202c27}
  `;
  document.head.appendChild(style);

  let syncing=false;

  function ensureSearch(){
    const catalog=document.getElementById('catalog');
    const head=catalog?.querySelector('.head');
    const mapInput=document.getElementById('q');
    const mapWrap=mapInput?.closest('.search');
    if(!catalog||!head||!mapInput||!mapWrap)return false;

    let mapClear=mapWrap.querySelector('.map-search-clear');
    if(!mapClear){
      mapClear=document.createElement('button');
      mapClear.type='button';
      mapClear.className='map-search-clear';
      mapClear.setAttribute('aria-label','Очистить поиск');
      mapClear.textContent='×';
      mapWrap.appendChild(mapClear);
    }

    let wrap=catalog.querySelector('.catalog-search-wrap');
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='catalog-search-wrap';
      wrap.innerHTML='<input class="catalog-search" type="search" inputmode="search" autocomplete="off" aria-label="Поиск по каталогу" placeholder="Название, адрес, бассейн, хаммам…"><button class="catalog-search-clear" type="button" aria-label="Очистить поиск">×</button>';
      head.insertAdjacentElement('afterend',wrap);
    }

    const input=wrap.querySelector('.catalog-search');
    const clear=wrap.querySelector('.catalog-search-clear');
    if(!input||!clear)return false;

    const updateState=()=>{
      const has=!!String(mapInput.value||'').length;
      mapWrap.classList.toggle('has-query',has);
      wrap.classList.toggle('has-query',has);
    };

    if(!wrap.dataset.bound){
      wrap.dataset.bound='1';
      input.value=mapInput.value||'';

      input.addEventListener('input',()=>{
        if(syncing)return;
        syncing=true;
        mapInput.value=input.value;
        updateState();
        mapInput.dispatchEvent(new Event('input',{bubbles:true}));
        syncing=false;
      });

      clear.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        syncing=true;
        input.value='';
        mapInput.value='';
        updateState();
        mapInput.dispatchEvent(new Event('input',{bubbles:true}));
        syncing=false;
        input.focus();
      });

      mapInput.addEventListener('input',()=>{
        if(syncing)return;
        syncing=true;
        input.value=mapInput.value||'';
        updateState();
        syncing=false;
      });
    }

    if(!mapClear.dataset.bound){
      mapClear.dataset.bound='1';
      mapClear.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        syncing=true;
        mapInput.value='';
        input.value='';
        updateState();
        mapInput.dispatchEvent(new Event('input',{bubbles:true}));
        syncing=false;
        mapInput.focus();
      });
    }

    updateState();
    return true;
  }

  function guardScreens(){
    const catalog=document.getElementById('catalog');
    const top=document.getElementById('mapTop');
    if(!catalog||!top)return;
    if(catalog.classList.contains('on'))top.style.display='none';
  }

  function boot(){
    let tries=0;
    const wait=()=>{
      tries++;
      if(!ensureSearch()&&tries<120){setTimeout(wait,50);return}
      guardScreens();
      const catalog=document.getElementById('catalog');
      if(catalog&&!catalog.dataset.searchGuard){
        catalog.dataset.searchGuard='1';
        new MutationObserver(guardScreens).observe(catalog,{attributes:true,attributeFilter:['class']});
      }
    };
    wait();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
