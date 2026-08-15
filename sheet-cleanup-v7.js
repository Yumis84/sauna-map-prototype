// Bootstrap for existing UI fixes + Favorites + embedded n8n chat tab. v24
(function(){
  if(window.__pargidBootstrapV24)return;
  window.__pargidBootstrapV24=true;

  const scripts=[
    'sheet-cleanup-v7-core.js?v=13.19-core',
    'favorites-v12.js?v=12.6',
    'favorites-map-keepalive-v14.js?v=14',
    'map-return-fix-v13.js?v=13',
    'n8n-chat-v23.js?v=24.0'
  ];

  function loadOne(src){
    return new Promise(resolve=>{
      const s=document.createElement('script');
      s.src=src;
      s.async=false;
      s.onload=resolve;
      s.onerror=()=>{
        console.error('ParGid bootstrap: failed to load',src);
        resolve();
      };
      document.body.appendChild(s);
    });
  }

  async function boot(){
    for(const src of scripts)await loadOne(src);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',boot,{once:true});
  }else{
    boot();
  }
})();
