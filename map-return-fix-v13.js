// Исправление чёрной карты после возврата из Избранного. v13
(function(){
  if(window.__pargidMapReturnFixV13)return;
  window.__pargidMapReturnFixV13=true;

  function invalidateMap(){
    try{
      if(typeof map!=='undefined'&&map&&typeof map.invalidateSize==='function'){
        map.invalidateSize({pan:false,animate:false});
      }
    }catch(_){ }
  }

  function restoreMapUi(){
    const mapEl=document.getElementById('map');
    const top=document.getElementById('mapTop');
    const cards=document.getElementById('cards');
    const favorites=document.getElementById('favorites');
    const catalog=document.getElementById('catalog');

    favorites?.classList.remove('on');
    catalog?.classList.remove('on');
    if(mapEl)mapEl.style.display='block';
    if(top)top.style.display='block';
    if(cards){
      cards.classList.remove('screen-hidden');
      cards.style.display='flex';
    }
    document.querySelectorAll('.nav button[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s==='map'));
    window.PARGID_FAVORITES_MODE=false;

    requestAnimationFrame(()=>{
      invalidateMap();
      requestAnimationFrame(invalidateMap);
    });
    setTimeout(invalidateMap,60);
    setTimeout(invalidateMap,180);
    setTimeout(invalidateMap,420);
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('.nav [data-s="map"]');
    if(!btn)return;
    // Даём штатному screen('map') отработать, затем страхуем восстановление Leaflet.
    setTimeout(restoreMapUi,0);
  });

  window.addEventListener('pageshow',()=>{
    const mapBtn=document.querySelector('.nav [data-s="map"].on');
    if(mapBtn)restoreMapUi();
  });
})();
