// Перенос основных действий вверх открытой карточки. v19.2
(function(){
  if(window.__pargidDetailActionsTopV19)return;
  window.__pargidDetailActionsTopV19=true;

  const style=document.createElement('style');
  style.textContent=`
    #sheet .contact-v4.contact-top-v19{margin:10px 0 14px!important;gap:6px!important}
    #sheet .contact-v4.contact-top-v19 + .desc-v4{margin-top:0!important}

    /* Делаем действия визуально легче и компактнее. */
    #sheet .contact-v4 button,
    #sheet .actions button{
      min-height:38px!important;
      height:38px!important;
      border-radius:12px!important;
      padding:0 11px!important;
      font-size:13px!important;
      line-height:1!important;
    }

    #sheet .actions{
      grid-template-columns:1fr 1fr!important;
      gap:6px!important;
      margin-top:10px!important;
    }

    /* Звонок — зелёный и такой же ширины, как соседнее действие. */
    #sheet #call,
    #sheet .call-v4{
      width:100%!important;
      min-width:0!important;
      max-width:none!important;
      justify-self:stretch!important;
      flex:1 1 auto!important;
      background:#2f9e62!important;
      color:#fff!important;
      border:1px solid #45b97a!important;
      box-shadow:none!important;
    }

    #sheet #call:active,
    #sheet .call-v4:active{background:#278653!important}

    #sheet .route,
    #sheet .photos{grid-column:1/-1!important}
  `;
  document.head.appendChild(style);

  function moveActions(){
    const detail=document.querySelector('#sheet .detail');
    const contact=detail?.querySelector('.contact-v4');
    if(!detail||!contact||contact.dataset.topV19==='1')return;

    const facts=detail.querySelector('.facts');
    const address=[...detail.querySelectorAll(':scope > .muted')].find(el=>{
      const text=(el.textContent||'').trim();
      return text&&!/^Источник/i.test(text);
    });
    const anchor=facts||address||detail.querySelector('h2');
    if(!anchor)return;

    anchor.insertAdjacentElement('afterend',contact);
    contact.classList.add('contact-top-v19');
    contact.dataset.topV19='1';
  }

  function boot(){
    const sheet=document.getElementById('sheet');
    moveActions();
    if(sheet)new MutationObserver(()=>requestAnimationFrame(moveActions)).observe(sheet,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
