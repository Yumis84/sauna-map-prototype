// Синхронизация нижней карусели карточек с активной меткой на карте.
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
  let wrappedAddMarker=false;

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

  function schedulePan(id,delay=85){
    clearTimeout(panTimer);
    panTimer=setTimeout(()=>panToVenue(id),delay);
  }

  function selectCentered({pan=true}={}){
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
    if(pan)schedulePan(id);
  }

  function onScroll(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      // Метка меняется сразу при попадании карточки в центр,
      // а сама карта центрируется с небольшой задержкой, чтобы не дёргаться.
      selectCentered({pan:true});
    });
  }

  cards.addEventListener('scroll',onScroll,{passive:true});
  cards.addEventListener('touchend',()=>setTimeout(()=>selectCentered({pan:true}),35),{passive:true});
  cards.addEventListener('pointerup',()=>setTimeout(()=>selectCentered({pan:true}),35),{passive:true});

  new MutationObserver(()=>requestAnimationFrame(()=>selectCentered({pan:true})))
    .observe(cards,{childList:true});

  // Если координаты/маркер появились позже из геокодера,
  // центрируем карту на уже выбранной карточке.
  try{
    if(typeof addMarker==='function'&&!wrappedAddMarker){
      const originalAddMarker=addMarker;
      addMarker=function(v){
        originalAddMarker(v);
        if(v&&Number(v.id)===Number(currentId))schedulePan(currentId,30);
      };
      wrappedAddMarker=true;
    }
  }catch(_){ }

  // Возврат из каталога на карту — восстановить выбранную карточку/метку.
  document.addEventListener('click',e=>{
    const b=e.target.closest('.nav button[data-s="map"]');
    if(b)setTimeout(()=>selectCentered({pan:true}),70);
  });

  requestAnimationFrame(()=>selectCentered({pan:true}));
})();
