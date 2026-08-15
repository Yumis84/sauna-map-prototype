// Избранное: отдельная вкладка, хранение в localStorage и синхронизация сердечек. v12.4
(function(){
  if(window.__pargidFavoritesV12)return;
  window.__pargidFavoritesV12=true;

  const KEY='pargid_favs';
  const style=document.createElement('style');
  style.textContent=`
    .nav{grid-template-columns:repeat(3,1fr)!important}
    .nav [data-s="favorites"]{line-height:1;font-weight:800!important}
    .nav [data-s="favorites"] .nav-heart{width:27px;height:27px;display:block;overflow:visible}
    .nav [data-s="favorites"] .nav-heart path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:fill .16s ease,stroke .16s ease}
    .nav [data-s="favorites"] .nav-heart.filled path{fill:currentColor}
    #favorites .favorite-empty{padding:64px 18px;text-align:center;color:#a9b5af;line-height:1.55}
    #favorites .favorite-empty .heart{font-size:38px;color:#ffd37f;margin-bottom:10px}
    #favorites .favorite-item{position:relative}
    #favorites .fav-remove{position:absolute;z-index:3;right:10px;top:10px;width:36px;height:36px;border:0;border-radius:12px;background:#09100dcc;color:#ffd37f;font-size:20px;display:grid;place-items:center}
    #favorites .favorite-item .ct{padding-right:42px}
  `;
  document.head.appendChild(style);

  const navHeart=filled=>`<svg class="nav-heart${filled?' filled':''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.2C10.1 18.5 4.2 14.2 4.2 9.5C4.2 7.1 6.1 5.3 8.5 5.3C10 5.3 11.3 6.1 12 7.3C12.7 6.1 14 5.3 15.5 5.3C17.9 5.3 19.8 7.1 19.8 9.5C19.8 14.2 13.9 18.5 12 20.2Z"/></svg>`;

  const favIds=()=>{
    try{return new Set((JSON.parse(localStorage.getItem(KEY)||'[]')||[]).map(Number))}
    catch(_){return new Set()}
  };

  function writeFavs(set){
    const ids=[...set].map(Number).filter(Number.isFinite);
    localStorage.setItem(KEY,JSON.stringify(ids));
    try{
      if(typeof favs!=='undefined'&&favs&&typeof favs.clear==='function'){
        favs.clear();ids.forEach(id=>favs.add(id));
      }
    }catch(_){ }
  }

  function moneyLocal(n){return n?Number(n).toLocaleString('ru-RU'):''}
  function priceLocal(v){return v.price?`от ${moneyLocal(v.price)}${v.priceMax?`–${moneyLocal(v.priceMax)}`:''} ₽/час`:'Цена по запросу'}
  function rateLocal(v){return v.rating?`★ ${v.rating}`:''}

  function favoriteItem(v){
    return `<article class="item favorite-item" data-favorite-id="${v.id}">
      <img src="${v.img}" alt="${v.name}">
      <div class="ib">
        <div class="ct"><b>${v.name}</b><span class="rate">${rateLocal(v)}</span></div>
        <div class="muted">${v.type}</div>
        <div class="muted">${v.address}</div>
        <div class="price">${priceLocal(v)}</div>
        <div class="tags">${(v.features||[]).slice(0,3).map(x=>`<span class="tag">${x}</span>`).join('')}</div>
      </div>
      <button class="fav-remove" type="button" data-remove-fav="${v.id}" aria-label="Удалить ${v.name} из избранного">♥</button>
    </article>`;
  }

  function ensureUi(){
    const app=document.getElementById('app'),catalog=document.getElementById('catalog'),nav=document.querySelector('.nav');
    if(!app||!catalog||!nav)return false;

    document.querySelector('[data-s="requests"]')?.remove();
    document.getElementById('requests')?.remove();

    if(!document.getElementById('favorites')){
      const section=document.createElement('section');
      section.className='screen';
      section.id='favorites';
      section.innerHTML='<div class="head"><h1>Избранное</h1><span class="badge" id="favCount">0</span></div><div class="list" id="favList"></div>';
      catalog.insertAdjacentElement('afterend',section);
    }

    let button=nav.querySelector('[data-s="favorites"]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.dataset.s='favorites';
      button.innerHTML=navHeart(false);
      button.setAttribute('aria-label','Избранное');
      nav.appendChild(button);
      button.onclick=()=>showFavorites();
    }
    return true;
  }

  function updateNavCount(){
    const count=favIds().size;
    const b=document.querySelector('.nav [data-s="favorites"]');
    if(b){
      b.innerHTML=navHeart(count>0);
      b.setAttribute('aria-label',count?`Избранное, ${count}`:'Избранное');
    }
  }

  function renderFavorites(){
    if(!ensureUi())return;
    const ids=favIds();
    const list=(window.VENUES||[]).filter(v=>ids.has(Number(v.id)));
    const el=document.getElementById('favList'),badge=document.getElementById('favCount');
    if(badge)badge.textContent=String(list.length);
    if(!el)return;
    el.innerHTML=list.length?list.map(favoriteItem).join(''):`<div class="favorite-empty"><div class="heart">♡</div><b>Пока пусто</b><br>Нажмите на сердечко в карточке бани или сауны — она появится здесь.</div>`;

    el.querySelectorAll('[data-favorite-id]').forEach(item=>{
      item.addEventListener('click',e=>{
        if(e.target.closest('[data-remove-fav]'))return;
        const id=Number(item.dataset.favoriteId);
        try{if(typeof open==='function')open(id)}catch(_){ }
      });
    });
    el.querySelectorAll('[data-remove-fav]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const id=Number(btn.dataset.removeFav),set=favIds();
        set.delete(id);writeFavs(set);
        renderFavorites();updateNavCount();
      });
    });
    updateNavCount();
  }

  function showFavorites(){
    if(!ensureUi())return;
    document.getElementById('catalog')?.classList.remove('on');
    document.getElementById('requests')?.classList.remove('on');
    document.getElementById('favorites')?.classList.add('on');
    const mapEl=document.getElementById('map'),top=document.getElementById('mapTop'),cards=document.getElementById('cards');
    if(mapEl)mapEl.style.display='none';
    if(top)top.style.display='none';
    if(cards){cards.classList.add('screen-hidden');cards.style.display='none'}
    document.querySelectorAll('.nav button[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s==='favorites'));
    window.PARGID_FAVORITES_MODE=true;
    renderFavorites();
  }

  function patchScreen(){
    try{
      if(typeof screen!=='function'||screen.__pargidFavPatched)return false;
      const original=screen;
      const wrapped=function(s){
        if(s==='favorites')return showFavorites();
        window.PARGID_FAVORITES_MODE=false;
        document.getElementById('favorites')?.classList.remove('on');
        return original(s);
      };
      wrapped.__pargidFavPatched=true;
      screen=wrapped;
      return true;
    }catch(_){return false}
  }

  function syncOpenHeart(){
    const title=document.querySelector('#sheet .detail h2')?.textContent?.trim();
    if(!title)return;
    const v=(window.VENUES||[]).find(x=>x.name===title),heart=document.querySelector('#sheet .fav');
    if(v&&heart)heart.textContent=favIds().has(Number(v.id))?'♥':'♡';
  }

  function boot(){
    let tries=0;
    const wait=()=>{
      tries++;
      if(!ensureUi()||typeof render!=='function'){
        if(tries<120)setTimeout(wait,50);
        return;
      }
      patchScreen();
      renderFavorites();
      updateNavCount();

      document.addEventListener('click',e=>{
        if(e.target.closest('#sheet .fav'))setTimeout(()=>{renderFavorites();updateNavCount();syncOpenHeart()},0);
      });
      const sheet=document.getElementById('sheet');
      if(sheet)new MutationObserver(()=>requestAnimationFrame(syncOpenHeart)).observe(sheet,{childList:true,subtree:true});
      window.addEventListener('storage',e=>{if(e.key===KEY){renderFavorites();updateNavCount();syncOpenHeart()}});
    };
    wait();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
