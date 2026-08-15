// Чистая верхняя часть карточки: без визуальных полосок, свайп вниз остаётся рабочим. v7.1
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .sheet-handle{display:none!important;opacity:0!important}
    .sheet-drag-zone:before{display:none!important;content:none!important;opacity:0!important}
    .sheet-drag-zone{background:transparent!important;box-shadow:none!important}
  `;
  document.head.appendChild(style);
})();
