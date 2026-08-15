// UI cleanup loader + filters + venue swipe + favorites + verified photo sources. v13.15
(function(){
  const PLACEHOLDER='venue-placeholder.svg?v=10';
  const isDemo=url=>/images\.unsplash\.com/i.test(String(url||''));
  const isPlaceholder=url=>/venue-placeholder\.svg/i.test(String(url||''));

  // Телефоны, собранные/обновлённые 15.08.2026. Существующие номера не перезаписываем.
  const PHONE_UPDATES={
    'Бордо':'+79114502264',
    'У озера':'+79527981495',
    'Котбус':'+74012585888',
    'Навигатор':'+74012566222',
    'Феникс':'+79114559024',
    'Кристалл':'+74012533434',
    'Родная гавань':'+74012521036',
    'Ника':'+74012904019',
    'Женский Рай':'+79052428040',
    'Баня на Шишкина':'+79062379575',
    'Русские Бани':'+79114601900',
    'Золотая ночь':'+74012677070',
    'В Ёлках':'+74012410077',
    'Форто-Ранта Рой Джой':'+74012376040',
    'Турецкая баня':'+74012772114',
    'Тазик':'+74012386620',
    'У Каштана':'+74012377279',
    'На Третьяковской 27':'+79521183727',
    'Villa Spa':'+74012955313',
    'Баныч':'+79062375434',
    'Дейма':'+74012710814',
    'Отдых':'+74012509556',
    'Милана':'+74012772114',
    'Территория отдыха':'+74012774717',
    'Пирс':'+79062377001',
    'Стиль':'+74012916331',
    'Релакс':'+74012379804',
    'Высший разряд':'+74012300013',
    'K8 SPA':'+74012338338',
    'Marton Sauna':'+79637381632',
    'Карусель':'+74012767693',
    'Посейдон':'+74012388783',
    'Статус':'+74012773119',
    'Комильфо':'+74012751015',
    'Робинзон':'+74012365367',
    'Царские забавы':'+79211009911',
    'Околица':'+79052410544',
    'Берлога':'+79632913197',
    'Апельсин':'+74012642525',
    'Анклав':'+79633503505',
    'Душа':'+79097991700',
    'Калина':'+74012685070',
    'Серебряная чаша':'+74012387348',
    'Релакс плюс':'+74012526242',
    'Орион':'+79062388832',
    'Граф Орлов':'+74012762215',
    'Эфис':'+74012557678'
  };

  // Если каталог-источник скрывает сами цифры за своей кнопкой звонка,
  // не подставляем номер другой организации: ведём пользователя к исходной карточке.
  const PHONE_SOURCE_FALLBACKS={
    'Эйфория':'https://101sauna.ru/Kaliningrad/Euforiya'
  };

  function applyPhoneUpdates(){
    if(!Array.isArray(window.VENUES))return;
    for(const v of window.VENUES){
      const phone=PHONE_UPDATES[v.name];
      if(phone&&!v.phone)v.phone=phone;
    }
  }

  function cleanDemoPhotos(){
    if(!Array.isArray(window.VENUES))return;
    for(const v of window.VENUES){
      const gallery=Array.isArray(v.gallery)?v.gallery:[];
      const real=[...new Set(gallery.filter(src=>src&&!isDemo(src)&&!isPlaceholder(src)))];
      if(real.length){v.gallery=real;v.img=real[0]}
      else if(v.img&&!isDemo(v.img)&&!isPlaceholder(v.img)){v.gallery=[v.img]}
      else{v.img=PLACEHOLDER;v.gallery=[PLACEHOLDER]}
    }
  }

  function remove101SourceLabels(){
    document.querySelectorAll('#sheet .detail .muted').forEach(el=>{
      const text=(el.textContent||'').trim();
      if(/^Источник данных:/i.test(text)&&/(101SAUNA|101sauna\.ru фото)/i.test(text))el.remove();
    });
  }

  function cleanCallLabel(){
    document.querySelectorAll('#sheet .call-v4').forEach(btn=>{
      if(!btn.disabled&&/Позвонить в баню/i.test(btn.textContent||''))btn.textContent='☎ Позвонить';
    });
  }

  function installPhoneFallback(){
    if(window.__pargidPhoneSourceFallbackV13)return;
    window.__pargidPhoneSourceFallbackV13=true;
    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('#sheet #call,#sheet .call-v4');
      if(!btn)return;
      const detail=btn.closest('.detail');
      const name=detail?.querySelector('h2')?.textContent?.trim();
      const venue=(window.VENUES||[]).find(v=>v.name===name);
      if(!venue||venue.phone)return;
      const url=PHONE_SOURCE_FALLBACKS[name];
      if(!url)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      window.open(url,'_blank','noopener');
    },true);
  }

  applyPhoneUpdates();
  cleanDemoPhotos();
  installPhoneFallback();

  const swipe=document.createElement('script');swipe.src='venue-swipe-v9.js?v=9.2';document.head.appendChild(swipe);
  const favorites=document.createElement('script');favorites.src='favorites-v12.js?v=12.6';document.head.appendChild(favorites);
  const ratingUi=document.createElement('script');ratingUi.src='rating-ui-v17.js?v=17';document.head.appendChild(ratingUi);
  const catalogSearch=document.createElement('script');catalogSearch.src='catalog-search-v18.js?v=18.5';document.head.appendChild(catalogSearch);
  const detailActions=document.createElement('script');detailActions.src='detail-actions-top-v19.js?v=19';document.head.appendChild(detailActions);
  const keepMapAlive=document.createElement('script');keepMapAlive.src='favorites-map-keepalive-v14.js?v=14';document.head.appendChild(keepMapAlive);
  const mapReturnFix=document.createElement('script');mapReturnFix.src='map-return-fix-v13.js?v=13';document.head.appendChild(mapReturnFix);
  const userLocation=document.createElement('script');userLocation.src='user-location-v16.js?v=16';document.head.appendChild(userLocation);

  document.addEventListener('pargid:map-photos-ready',()=>{applyPhoneUpdates();cleanDemoPhotos();try{if(typeof render==='function')render()}catch(_){ }requestAnimationFrame(()=>{remove101SourceLabels();cleanCallLabel()})});
  const mapPhotos=document.createElement('script');mapPhotos.src='map-photos-v15.js?v=15';document.head.appendChild(mapPhotos);

  document.addEventListener('pargid:vsaunah-ready',()=>{applyPhoneUpdates();cleanDemoPhotos();try{if(typeof render==='function')render()}catch(_){ }requestAnimationFrame(()=>{remove101SourceLabels();cleanCallLabel()})});
  const vsaunah=document.createElement('script');vsaunah.src='vsaunah-v11.js?v=11.1';document.head.appendChild(vsaunah);

  const legacy=document.createElement('script');legacy.src='sauna101-legacy-v7.js?v=8';legacy.onload=()=>{applyPhoneUpdates();cleanDemoPhotos();bootFilters()};legacy.onerror=()=>{applyPhoneUpdates();cleanDemoPhotos();bootFilters()};document.head.appendChild(legacy);

  function bootFilters(){
    let tries=0;
    const wait=()=>{
      tries++;
      try{
        if(typeof render!=='function'||typeof data!=='function'||typeof filters==='undefined'||typeof active==='undefined')throw new Error('main not ready');
        applyPhoneUpdates();
        cleanDemoPhotos();
        const desired=['Все','Бассейн','Джакузи','Сауна','На дровах','Хаммам','До 1000 ₽','1000–1500 ₽','От 1500 ₽'];
        filters.splice(0,filters.length,...desired);
        const baseSearch=()=>{
          const q=(document.querySelector('#q')?.value||'').trim().toLowerCase();
          return (window.VENUES||[]).filter(v=>!q||[v.name,v.type,v.address,...(v.features||[])].join(' ').toLowerCase().includes(q));
        };
        const has=(v,label)=>(v.features||[]).some(x=>String(x).toLowerCase()===label.toLowerCase());
        const isSauna=v=>(v.features||[]).some(x=>/^(сауна|финская сауна)$/i.test(String(x)));
        data=function(){
          const list=baseSearch();
          if(active==='Все')return list;
          if(active==='Бассейн')return list.filter(v=>has(v,'Бассейн'));
          if(active==='Джакузи')return list.filter(v=>has(v,'Джакузи'));
          if(active==='Сауна')return list.filter(isSauna);
          if(active==='На дровах')return list.filter(v=>has(v,'На дровах'));
          if(active==='Хаммам')return list.filter(v=>has(v,'Хаммам'));
          if(active==='До 1000 ₽')return list.filter(v=>Number.isFinite(v.price)&&v.price<1000);
          if(active==='1000–1500 ₽')return list.filter(v=>Number.isFinite(v.price)&&v.price>=1000&&v.price<1500);
          if(active==='От 1500 ₽')return list.filter(v=>Number.isFinite(v.price)&&v.price>=1500);
          return list;
        };
        if(!desired.includes(active))active='Все';
        render();
        requestAnimationFrame(()=>{remove101SourceLabels();cleanCallLabel()});
      }catch(e){if(tries<80)setTimeout(wait,40)}
    };
    wait();
  }

  function startSourceCleanup(){
    applyPhoneUpdates();remove101SourceLabels();cleanCallLabel();
    const sheet=document.getElementById('sheet');
    if(sheet)new MutationObserver(()=>requestAnimationFrame(()=>{applyPhoneUpdates();remove101SourceLabels();cleanCallLabel()})).observe(sheet,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startSourceCleanup,{once:true});else startSourceCleanup();
})();
