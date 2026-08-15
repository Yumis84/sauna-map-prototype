// Надёжное закрытие нижней карточки свайпом для Android/iOS.
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .sheet{will-change:transform;overscroll-behavior-y:contain}
    .sheet.dragging-v2{transition:none!important}
    .sheet.snap-v2{transition:transform .22s cubic-bezier(.2,.8,.2,1)!important}
    .sheet-drag-zone{
      position:sticky;top:0;left:50%;z-index:60;display:block;
      width:132px;height:34px;margin:0 auto -34px;padding:0;
      border:0;background:transparent;touch-action:none;cursor:grab;
    }
    .sheet-drag-zone:before{
      content:"";position:absolute;left:50%;top:9px;transform:translateX(-50%);
      width:46px;height:5px;border-radius:999px;background:#ffffffa0;
      box-shadow:0 1px 8px #0007;
    }
    .sheet-drag-zone:active{cursor:grabbing}
  `;
  document.head.appendChild(style);

  const detail=()=>document.getElementById('detail');
  const sheet=()=>document.getElementById('sheet');
  let active=false,startY=0,lastY=0,startAt=0,pointerId=null;

  function finishClose(){
    const d=detail(),s=sheet();
    if(!d||!s)return;
    s.classList.remove('dragging-v2');
    s.classList.add('snap-v2');
    s.style.transform='translateY(110vh)';
    setTimeout(()=>{
      d.classList.remove('on');
      s.classList.remove('snap-v2');
      s.style.transform='';
      s.scrollTop=0;
    },210);
  }

  function snapBack(){
    const s=sheet();if(!s)return;
    s.classList.remove('dragging-v2');
    s.classList.add('snap-v2');
    s.style.transform='translateY(0)';
    setTimeout(()=>s.classList.remove('snap-v2'),230);
  }

  function ensureHandle(){
    const s=sheet();if(!s||!s.children.length)return;
    if(!s.querySelector('.sheet-drag-zone')){
      const h=document.createElement('button');
      h.type='button';h.className='sheet-drag-zone';
      h.setAttribute('aria-label','Смахнуть карточку вниз, чтобы закрыть');
      s.prepend(h);
    }
    // При открытии новой карточки всегда начинаем сверху.
    if(detail()?.classList.contains('on') && !active && s.dataset.lastCardHtml!==String(s.childElementCount)){
      s.scrollTop=0;
      s.dataset.lastCardHtml=String(s.childElementCount);
    }
  }

  function onPointerDown(e){
    const h=e.target.closest('.sheet-drag-zone');
    const s=sheet(),d=detail();
    if(!h||!s||!d?.classList.contains('on'))return;
    if(s.scrollTop>2){s.scrollTo({top:0,behavior:'smooth'});return;}
    active=true;pointerId=e.pointerId;startY=lastY=e.clientY;startAt=performance.now();
    s.classList.remove('snap-v2');s.classList.add('dragging-v2');
    try{h.setPointerCapture(e.pointerId)}catch(_){}
    e.preventDefault();
  }

  function onPointerMove(e){
    if(!active||e.pointerId!==pointerId)return;
    const s=sheet();if(!s)return;
    lastY=e.clientY;
    const dy=Math.max(0,lastY-startY);
    s.style.transform=`translateY(${Math.min(dy,window.innerHeight*.9)}px)`;
    e.preventDefault();
  }

  function onPointerUp(e){
    if(!active||e.pointerId!==pointerId)return;
    const dy=Math.max(0,lastY-startY);
    const elapsed=Math.max(1,performance.now()-startAt);
    const velocity=dy/elapsed;
    active=false;pointerId=null;
    if(dy>=85||velocity>=0.42)finishClose();else snapBack();
  }

  function init(){
    const d=detail(),s=sheet();if(!d||!s)return;
    ensureHandle();
    s.addEventListener('pointerdown',onPointerDown);
    s.addEventListener('pointermove',onPointerMove);
    s.addEventListener('pointerup',onPointerUp);
    s.addEventListener('pointercancel',onPointerUp);
    new MutationObserver(()=>requestAnimationFrame(ensureHandle)).observe(s,{childList:true,subtree:false});
    d.addEventListener('click',e=>{if(e.target===d)finishClose()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&d.classList.contains('on'))finishClose()});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
