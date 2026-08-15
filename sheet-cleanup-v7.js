// Чистая верхняя часть карточки: без визуальных полосок, свайп вниз остаётся рабочим. v7.3
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .sheet-handle{display:none!important;opacity:0!important}
    .sheet-drag-zone:before{display:none!important;content:none!important;opacity:0!important}
    .sheet-drag-zone{background:transparent!important;box-shadow:none!important}
    [data-f="24/7"]{display:none!important}
  `;
  document.head.appendChild(style);

  function remove247(){
    document.querySelectorAll('[data-f="24/7"]').forEach(el=>el.remove());
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',remove247,{once:true});
  }else remove247();

  new MutationObserver(remove247).observe(document.documentElement,{childList:true,subtree:true});
})();
