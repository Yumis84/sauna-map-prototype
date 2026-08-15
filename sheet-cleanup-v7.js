// Чистая верхняя часть карточки: без визуальных полосок, свайп вниз остаётся рабочим. v7.4
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .sheet-handle{display:none!important;opacity:0!important}
    .sheet-drag-zone:before{display:none!important;content:none!important;opacity:0!important}
    .sheet-drag-zone{background:transparent!important;box-shadow:none!important}
    [data-f="24/7"]{display:none!important}
    .yandex-photos-v7{width:100%;height:48px;margin-top:10px;border:1px solid #5a4a12;border-radius:15px;background:#2b250d;color:#ffdd57;font-weight:850}
  `;
  document.head.appendChild(style);

  function remove247(){
    document.querySelectorAll('[data-f="24/7"]').forEach(el=>el.remove());
  }

  function addYandexPhotos(){
    const detail=document.querySelector('#sheet .detail');
    const title=detail?.querySelector('h2')?.textContent?.trim();
    const desc=detail?.querySelector('.desc-v4');
    if(!detail||!title||!desc||desc.querySelector('.yandex-photos-v7'))return;
    const venue=(window.VENUES||[]).find(v=>v.name===title);
    if(!venue)return;
    const btn=document.createElement('button');
    btn.type='button';
    btn.className='yandex-photos-v7';
    btn.textContent='📷 Фото на Яндекс Картах';
    btn.onclick=()=>{
      const q=encodeURIComponent(`${venue.name}, ${venue.address}, Калининград`);
      window.open(`https://yandex.ru/maps/?text=${q}`,'_blank','noopener');
    };
    desc.appendChild(btn);
  }

  function sync(){
    remove247();
    addYandexPhotos();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',sync,{once:true});
  }else sync();

  new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{childList:true,subtree:true});
})();
