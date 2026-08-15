// Поиск в каталоге и на карте: один крестик, синхронизация и чистая карта. v18.4
(function(){
  if(window.__pargidCatalogSearchV184)return;
  window.__pargidCatalogSearchV184=true;

  const style=document.createElement('style');
  style.textContent=`
    /* На карте оставляем только поиск и фильтры — без верхней плашки ПарГид. */
    #mapTop .bar{display:none!important}
    #mapTop{padding-top:8px!important}
    #mapTop .search{margin-top:0!important;position:relative}

    /* Каталог всегда перекрывает карту; верх карты не должен просвечивать поверх него. */
    #catalog.on{z-index:950!important}
    body:has(#catalog.on) #mapTop,
    #app:has(#catalog.on) #mapTop{display:none!important}
    body:has(#catalog.on) #cards,
    #app:has(#catalog.on) #cards{display:none!important}

    #catalog .catalog-search-wrap{position:relative;margin:0 0 14px}
    #catalog .catalog-search{width:100%;height:46px;border:1px solid #ffffff16;border-radius:15px;background:#111815;color:#f4f7f5;padding:0 46px 0 14px;outline:none;box-shadow:0 8px 24px #0003;-webkit-appearance:none;appearance:none}
    #catalog .catalog-search::-webkit-search-cancel-button,#catalog .catalog-search::-webkit-search-decoration{-webkit-appearance:none;display:none}
    #catalog .catalog-search::placeholder{color:#829089}
    #catalog .catalog-search:focus{border-color:#f2a93b88;box-shadow:0 0 0 3px #f2a93b18,0 8px 24px #0003}
    #catalog .catalog-search-clear{position:absolute;z-index:4;right:5px;top:5px;width:36px;height:36px;border:0;border-radius:11px;background:transparent;color:#a9b5af;font-size:25px;line-height:1;display:none;place-items:center;padding:0}
    #catalog .catalog-search-clear:active{color:#fff;background:#ffffff0d}

    #mapTop .search #q{padding-right:48px!important}
    #mapTop .map-search-clear{position:absolute!important;z-index:999!important;right:8px!important;top:50%!important;transform:translateY(-50%)!important;width:36px!important;height:36px!important;border:0!important;border-radius:11px!important;background:transparent!important;color:#d7dfdb!important;font-size:27px!important;font-weight:400!important;line-height:1!important;display:none;place-items:center;padding:0!important;pointer-events:auto!important}
    #mapTop .map-search-clear:active{background:#ffffff12!important;color:#fff!important}
  `;
  document.head.appendChild(style);

  let syncing=false;

  function stripMapBrand(){
    const top=document.getElementById('mapTop');
    if(!top)return false;
    top.querySelectorAll('.bar').forEach(el=>el.remove());
    return true;
  }

  function ensureSearch(){
    stripMapBrand();
    const catalog=document.getElementById('catalog');
    const head=catalog?.querySelector('.head');
    const mapInput=document.getElementById('q');
    const mapWrap=mapInput?.closest('.search');
    if(!catalog||!head||!mapInput||!mapWrap)return false;

    mapInput.type='text';

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
      wrap.innerHTML='<input class="catalog-search" type="text" inputmode="search" autocomplete="off" aria-label="Поиск по каталогу" placeholder="Название, адрес, бассейн, хаммам…"><button class="catalog-search-clear" type="button" aria-label="Очистить поиск">×</button>';
      head.insertAdjacentElement('afterend',wrap);
    }

    const input=wrap.querySelector('.catalog-search');
    const clear=wrap.querySelector('.catalog-search-clear');
    if(!input||!clear)return false;
    input.type='text';

    const updateState=()=>{
      const value=String(mapInput.value||'');
      const has=value.length>0;
      if(input.value!==value)input.value=value;
      mapClear.style.setProperty('display',has?'grid':'none','important');
      clear.style.setProperty('display',has?'grid':'none','important');
    };

    if(!wrap.dataset.bound184){
      wrap.dataset.bound184='1';
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
    }

    if(!mapInput.dataset.searchBound184){
      mapInput.dataset.searchBound184='1';
      mapInput.addEventListener('input',()=>{
        if(syncing)return;
        syncing=true;
        input.value=mapInput.value||'';
        updateState();
        syncing=false;
      });
    }

    if(!mapClear.dataset.bound184){
      mapClear.dataset.bound184='1';
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
    stripMapBrand();
    const catalog=document.getElementById('catalog');
    const top=document.getElementById('mapTop');
    if(!catalog||!top)return;
    if(catalog.classList.contains('on'))top.style.display='none';
  }

  function boot(){
    let tries=0;
    const wait=()=>{
      tries++;
      stripMapBrand();
      if(!ensureSearch()&&tries<120){setTimeout(wait,50);return}
      guardScreens();
      const catalog=document.getElementById('catalog');
      if(catalog&&!catalog.dataset.searchGuard184){
        catalog.dataset.searchGuard184='1';
        new MutationObserver(guardScreens).observe(catalog,{attributes:true,attributeFilter:['class']});
      }
      const top=document.getElementById('mapTop');
      if(top&&!top.dataset.brandGuard184){
        top.dataset.brandGuard184='1';
        new MutationObserver(stripMapBrand).observe(top,{childList:true,subtree:false});
      }
    };
    wait();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
