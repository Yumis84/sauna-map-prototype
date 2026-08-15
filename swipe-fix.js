// Надёжное закрытие нижней карточки свайпом для Android/iOS. v5.1
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .nav button{
      background:transparent!important;color:#8e9a94!important;
      box-shadow:none!important;font-weight:700;
      transition:color .16s ease,transform .16s ease;
    }
    .nav button.on{
      background:transparent!important;color:#ffd37f!important;
      box-shadow:none!important;font-weight:900;
    }
    .nav button:active{transform:scale(.98)}
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

  function syncNavActive(section){
    document.querySelectorAll('.nav button[data-s]').forEach(b=>{
      b.classList.toggle('on',b.dataset.s===section);
      b.setAttribute('aria-current',b.dataset.s===section?'page':'false');
    });
  }

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
    syncNavActive('map');
    document.addEventListener('click',e=>{
      const b=e.target.closest('.nav button[data-s]');
      if(b)requestAnimationFrame(()=>syncNavActive(b.dataset.s));
    });
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

// Какая карточка по центру нижней карусели — та метка активна и центрируется на карте.
(function(){
  const cards=document.getElementById('cards');
  if(!cards)return;

  const style=document.createElement('style');
  style.textContent=`
    #cards{scroll-snap-type:x mandatory;scroll-padding-inline:6vw}
    #cards .card{scroll-snap-align:center;scroll-snap-stop:normal;transition:border-color .16s ease,transform .16s ease}
    #cards .card.map-selected{border-color:#f2a93b66;transform:translateY(-2px)}
  `;
  document.head.appendChild(style);

  let currentId=null;
  let raf=0;
  let panTimer=0;

  function mapModeVisible(){
    return !cards.classList.contains('screen-hidden') && cards.style.display!=='none';
  }

  function centeredCard(){
    const list=[...cards.querySelectorAll('.card[data-id]')];
    if(!list.length)return null;
    const r=cards.getBoundingClientRect();
    const cx=r.left+r.width/2;
    let best=null,bestDist=Infinity;
    for(const card of list){
      const cr=card.getBoundingClientRect();
      if(cr.right<r.left||cr.left>r.right)continue;
      const dist=Math.abs((cr.left+cr.width/2)-cx);
      if(dist<bestDist){bestDist=dist;best=card;}
    }
    return best||list[0];
  }

  function refreshMarkerIcons(){
    try{
      for(const [id,m] of Object.entries(markers||{})){
        if(m&&typeof m.setIcon==='function')m.setIcon(icon(Number(id)));
      }
    }catch(_){ }
  }

  function panToVenue(id){
    if(!mapModeVisible()||id!==currentId)return;
    try{
      const v=venues.find(x=>Number(x.id)===Number(id));
      if(!v||!v.lat||!v.lng||!map)return;
      if(typeof map.stop==='function')map.stop();
      if(typeof map.panTo==='function'){
        map.panTo([v.lat,v.lng],{animate:true,duration:.32,easeLinearity:.35});
      }else if(typeof map.flyTo==='function'){
        map.flyTo([v.lat,v.lng],typeof map.getZoom==='function'?map.getZoom():14,{animate:true,duration:.32});
      }
    }catch(_){ }
  }

  function schedulePan(id,delay=90){
    clearTimeout(panTimer);
    panTimer=setTimeout(()=>panToVenue(id),delay);
  }

  function selectCentered(){
    if(!mapModeVisible())return;
    const card=centeredCard();
    if(!card)return;
    const id=Number(card.dataset.id);
    if(!Number.isFinite(id))return;

    cards.querySelectorAll('.card.map-selected').forEach(el=>el.classList.remove('map-selected'));
    card.classList.add('map-selected');

    if(id!==currentId){
      currentId=id;
      try{chosen=id;}catch(_){ }
      refreshMarkerIcons();
    }
    schedulePan(id);
  }

  function onScroll(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      selectCentered();
    });
  }

  cards.addEventListener('scroll',onScroll,{passive:true});
  cards.addEventListener('touchend',()=>setTimeout(selectCentered,35),{passive:true});
  cards.addEventListener('pointerup',()=>setTimeout(selectCentered,35),{passive:true});

  new MutationObserver(()=>requestAnimationFrame(selectCentered)).observe(cards,{childList:true});

  try{
    if(typeof addMarker==='function'){
      const originalAddMarker=addMarker;
      addMarker=function(v){
        originalAddMarker(v);
        if(v&&Number(v.id)===Number(currentId))schedulePan(currentId,30);
      };
    }
  }catch(_){ }

  document.addEventListener('click',e=>{
    const b=e.target.closest('.nav button[data-s="map"]');
    if(b)setTimeout(selectCentered,70);
  });

  requestAnimationFrame(selectCentered);
})();
