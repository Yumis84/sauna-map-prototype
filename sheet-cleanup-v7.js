// Убираем визуальные полоски свайпа, сохраняя сам жест закрытия карточки.
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .sheet-handle{display:none!important}
    .sheet-drag-zone:before{display:none!important;content:none!important}
    .sheet-drag-zone{background:transparent!important;box-shadow:none!important}
  `;
  document.head.appendChild(style);
})();
