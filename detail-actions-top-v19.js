// Перенос основных действий вверх открытой карточки. v19
(function(){
  if(window.__pargidDetailActionsTopV19)return;
  window.__pargidDetailActionsTopV19=true;

  const style=document.createElement('style');
  style.textContent=`
    #sheet .contact-v4.contact-top-v19{margin:14px 0 20px!important}
    #sheet .contact-v4.contact-top-v19 + .desc-v4{margin-top:0!important}
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
