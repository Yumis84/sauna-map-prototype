// Горизонтальный свайп между заведениями в открытой карточке. v9.2
(function(){
  if(window.__venueSwipeV9)return;
  window.__venueSwipeV9=true;

  const style=document.createElement('style');
  style.textContent=`
    #sheet.venue-x-drag{transition:none!important;will-change:transform,opacity}
    #sheet.venue-x-anim{transition:transform .18s cubic-bezier(.2,.8,.2,1),opacity .18s ease!important;will-change:transform,opacity}
  `;
  document.head.appendChild(style);

  let tracking=false,locked=false,cancelled=false;
  let sx=0,sy=0,lastX=0,startAt=0;
  const sheet=()=>document.getElementById('sheet');
  const overlay=()=>document.getElementById('detail');

  function currentVenue(){
    const name=sheet()?.querySelector('.detail h2')?.textContent?.trim();
    return (window.VENUES||[]).find(v=>v.name===name)||null;
  }

  function currentList(){
    if(window.PARGID_FAVORITES_MODE){
      try{
        const ids=new Set((JSON.parse(localStorage.getItem('pargid_favs')||'[]')||[]).map(Number));
        return (window.VENUES||[]).filter(v=>ids.has(Number(v.id)));
      }catch(_){return []}
    }
    try{if(typeof data==='function')return data()}catch(_){ }
    return window.VENUES||[];
  }

  function neighbor(direction){
    const cur=currentVenue(),list=currentList();
    if(!cur||!list.length)return null;
    const i=list.findIndex(v=>Number(v.id)===Number(cur.id));
    if(i<0)return null;
    return list[i+direction]||null;
  }

  function interactive(target){
    return !!target.closest('button,a,input,select,textarea,label,.gallery-track,.gallery-arrow');
  }

  function reset(animate=true){
    const s=sheet();if(!s)return;
    s.classList.remove('venue-x-drag');
    if(animate)s.classList.add('venue-x-anim');
    s.style.transform='translateX(0)';
    s.style.opacity='1';
    setTimeout(()=>s.classList.remove('venue-x-anim'),210);
  }

  function alignUnderlying(id){
    requestAnimationFrame(()=>{
      const favorites=document.getElementById('favorites');
      if(favorites?.classList.contains('on')){
        const item=favorites.querySelector(`[data-favorite-id="${id}"]`);
        if(item)item.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'});
        return;
      }
      const catalog=document.getElementById('catalog');
      if(catalog?.classList.contains('on')){
        const item=document.querySelector(`#list [data-id="${id}"]`);
        if(item)item.scrollIntoView({block:'center',inline:'nearest',behavior:'smooth'});
        return;
      }
      const cards=document.getElementById('cards');
      const card=cards?.querySelector(`.card[data-id="${id}"]`);
      if(card){
        const left=card.offsetLeft-(cards.clientWidth-card.clientWidth)/2;
        cards.scrollTo({left:Math.max(0,left),behavior:'smooth'});
      }
    });
  }

  function switchVenue(target,direction){
    const s=sheet();if(!s||!target)return reset();
    const exitX=direction>0?-window.innerWidth:window.innerWidth;
    s.classList.remove('venue-x-drag');
    s.classList.add('venue-x-anim');
    s.style.transform=`translateX(${exitX}px)`;
    s.style.opacity='.45';

    setTimeout(()=>{
      try{
        if(typeof open!=='function')throw new Error('open unavailable');
        open(Number(target.id));
        s.scrollTop=0;
        alignUnderlying(target.id);

        s.classList.remove('venue-x-anim');
        s.style.transform=`translateX(${-exitX*.24}px)`;
        s.style.opacity='.72';
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          s.classList.add('venue-x-anim');
          s.style.transform='translateX(0)';
          s.style.opacity='1';
          setTimeout(()=>s.classList.remove('venue-x-anim'),210);
        }));
      }catch(_){reset();}
    },165);
  }

  function onStart(e){
    const s=sheet(),d=overlay();
    if(!s||!d?.classList.contains('on')||e.touches.length!==1)return;
    if(!e.target.closest('.detail')||interactive(e.target))return;
    tracking=true;locked=false;cancelled=false;
    sx=lastX=e.touches[0].clientX;sy=e.touches[0].clientY;startAt=performance.now();
  }

  function onMove(e){
    if(!tracking||cancelled||e.touches.length!==1)return;
    const s=sheet();if(!s)return;
    const x=e.touches[0].clientX,y=e.touches[0].clientY;
    const dx=x-sx,dy=y-sy;lastX=x;

    if(!locked){
      if(Math.abs(dx)<10&&Math.abs(dy)<10)return;
      if(Math.abs(dy)>=Math.abs(dx)*.9){cancelled=true;tracking=false;return;}
      locked=true;
      s.classList.remove('venue-x-anim');
      s.classList.add('venue-x-drag');
    }

    e.preventDefault();
    const direction=dx<0?1:-1;
    const hasTarget=!!neighbor(direction);
    const shown=hasTarget?dx:dx*.26;
    const cap=Math.min(window.innerWidth*.72,Math.abs(shown));
    const tx=Math.sign(shown)*cap;
    s.style.transform=`translateX(${tx}px)`;
    s.style.opacity=String(Math.max(.72,1-Math.abs(tx)/window.innerWidth*.32));
  }

  function onEnd(){
    if(!tracking&&!locked)return;
    const s=sheet();
    const dx=lastX-sx;
    const elapsed=Math.max(1,performance.now()-startAt);
    const velocity=Math.abs(dx)/elapsed;
    const wasLocked=locked;
    tracking=false;locked=false;
    if(!s||!wasLocked||cancelled){cancelled=false;return;}

    const direction=dx<0?1:-1;
    const target=neighbor(direction);
    const threshold=Math.min(105,window.innerWidth*.24);
    if(target&&(Math.abs(dx)>=threshold||velocity>=.48))switchVenue(target,direction);
    else reset(true);
  }

  function init(){
    const s=sheet();if(!s)return;
    s.addEventListener('touchstart',onStart,{passive:true});
    s.addEventListener('touchmove',onMove,{passive:false});
    s.addEventListener('touchend',onEnd,{passive:true});
    s.addEventListener('touchcancel',onEnd,{passive:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
