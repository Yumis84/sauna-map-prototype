// UI cleanup loader + filters + venue swipe + favorites + verified photo sources. v13.0
(function(){
  const PLACEHOLDER='venue-placeholder.svg?v=10';
  const isDemo=url=>/images\.unsplash\.com/i.test(String(url||''));
  const isPlaceholder=url=>/venue-placeholder\.svg/i.test(String(url||''));

  function cleanDemoPhotos(){
    if(!Array.isArray(window.VENUES))return;
    for(const v of window.VENUES){
      const gallery=Array.isArray(v.gallery)?v.gallery:[];
      const real=[...new Set(gallery.filter(src=>src&&!isDemo(src)&&!isPlaceholder(src)))];
      if(real.length){
        v.gallery=real;
        v.img=real[0];
      }else if(v.img&&!isDemo(v.img)&&!isPlaceholder(v.img)){
        v.gallery=[v.img];
      }else{
        v.img=PLACEHOLDER;
        v.gallery=[PLACEHOLDER];
      }
    }
  }

  function remove101SourceLabels(){
    document.querySelectorAll('#sheet .detail .muted').forEach(el=>{
      const text=(el.textContent||'').trim();
      if(/^Источник данных:/i.test(text)&&/(101SAUNA|101sauna\.ru фото)/i.test(text))el.remove();
    });
  }

  cleanDemoPhotos();

  const swipe=document.createElement('script');
  swipe.src='venue-swipe-v9.js?v=9.2';
  document.head.appendChild(swipe);

  const favorites=document.createElement('script');
  favorites.src='favorites-v12.js?v=12.5';
  document.head.appendChild(favorites);

  const keepMapAlive=document.createElement('script');
  keepMapAlive.src='favorites-map-keepalive-v14.js?v=14';
  document.head.appendChild(keepMapAlive);

  const mapReturnFix=document.createElement('script');
  mapReturnFix.src='map-return-fix-v13.js?v=13';
  document.head.appendChild(mapReturnFix);

  document.addEventListener('pargid:map-photos-ready',()=>{
    cleanDemoPhotos();
    try{if(typeof render==='function')render();}catch(_){ }
    requestAnimationFrame(remove101SourceLabels);
  });
  const mapPhotos=document.createElement('script');
  mapPhotos.src='map-photos-v15.js?v=15';
  document.head.appendChild(mapPhotos);

  document.addEventListener('pargid:vsaunah-ready',()=>{
    cleanDemoPhotos();
    try{if(typeof render==='function')render();}catch(_){ }
    requestAnimationFrame(remove101SourceLabels);
  });
  const vsaunah=document.createElement('script');
  vsaunah.src='vsaunah-v11.js?v=11.1';
  document.head.appendChild(vsaunah);

  const legacy=document.createElement('script');
  legacy.src='sauna101-legacy-v7.js?v=8';
  legacy.onload=()=>{cleanDemoPhotos();bootFilters();};
  legacy.onerror=()=>{cleanDemoPhotos();bootFilters();};
  document.head.appendChild(legacy);

  function bootFilters(){
    let tries=0;
    const wait=()=>{
      tries++;
      try{
        if(typeof render!=='function'||typeof data!=='function'||typeof filters==='undefined'||typeof active==='undefined')throw new Error('main not ready');
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
        requestAnimationFrame(remove101SourceLabels);
      }catch(e){if(tries<80)setTimeout(wait,40);}
    };
    wait();
  }

  function startSourceCleanup(){
    remove101SourceLabels();
    const sheet=document.getElementById('sheet');
    if(sheet)new MutationObserver(()=>requestAnimationFrame(remove101SourceLabels)).observe(sheet,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startSourceCleanup,{once:true});else startSourceCleanup();
})();
