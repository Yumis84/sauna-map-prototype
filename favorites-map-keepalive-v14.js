// Карта остаётся живой под экраном Избранного, чтобы не чернеть при возврате. v14
(function(){
  if(window.__pargidFavoritesMapKeepaliveV14)return;
  window.__pargidFavoritesMapKeepaliveV14=true;

  function invalidate(){
    try{
      if(typeof map!=='undefined'&&map&&typeof map.invalidateSize==='function'){
        map.invalidateSize({pan:false,animate:false});
      }
    }catch(_){ }
  }

  function keepAlive(){
    const fav=document.getElementById('favorites');
    if(!fav?.classList.contains('on'))return;
    const mapEl=document.getElementById('map');
    if(mapEl)mapEl.style.display='block';
    requestAnimationFrame(()=>{
      invalidate();
      requestAnimationFrame(invalidate);
    });
    setTimeout(invalidate,80);
  }

  function attach(){
    const fav=document.getElementById('favorites');
    if(!fav)return false;
    new MutationObserver(()=>keepAlive()).observe(fav,{attributes:true,attributeFilter:['class']});
    keepAlive();
    return true;
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('.nav [data-s="favorites"]'))setTimeout(keepAlive,0);
  });

  let tries=0;
  const wait=()=>{
    tries++;
    if(!attach()&&tries<120)setTimeout(wait,50);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
