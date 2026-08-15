// Избранное: отдельная вкладка, SVG-сердечки и синхронизация состояния. v12.5
(function(){
  if(window.__pargidFavoritesV12)return;
  window.__pargidFavoritesV12=true;

  const KEY='pargid_favs';
  const style=document.createElement('style');
  style.textContent=`
    .nav{grid-template-columns:repeat(3,1fr)!important}
    .nav [data-s="favorites"]{line-height:1;font-weight:800!important}
    .heart-svg{display:block;overflow:visible;pointer-events:none}
    .heart-svg path{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;transition:fill .16s ease,stroke .16s ease,transform .16s ease;transform-origin:center}
    .heart-svg.filled path{fill:currentColor}
    .nav [data-s="favorites"] .heart-svg{width:27px;height:27px}
    #sheet .fav{display:grid!important;place-items:center;color:#ffd37f!important}
    #sheet .fav .heart-svg{width:25px;height:25px}
    #list .item{position:relative}
    #list .catalog-fav,#favorites .fav-remove{position:absolute;z-index:4;right:10px;top:10px;width:38px;height:38px;border:0;border-radius:50%;background:#09100dcc;color:#ffd37f;display:grid;place-items:center;box-shadow:0 3px 12px #0005}
    #list .catalog-fav .heart-svg,#favorites .fav-remove .heart-svg{width:22px;height:22px}
    #list .item .ct,#favorites .favorite-item .ct{padding-right:44px}
    #favorites .favorite-empty{padding:64px 18px;text-align:center;color:#a9b5af;line-height:1.55}
    #favorites .favorite-empty .heart{display:flex;justify-content:center;color:#ffd37f;margin-bottom:10px}
    #favorites .favorite-empty .heart .heart-svg{width:40px;height:40px}
    #favorites .favorite-item{position:relative}
  `;
  document.head.appendChild(style);

  const heartSvg=filled=>`<svg class="heart-svg${filled?' filled':''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.2C10.1 18.5 4.2 14.2 4.2 9.5C4.2 7.1 6.1 5.3 8.5 5.3C10 5.3 11.3 6.1 12 7.3C12.7 6.1 14 5.3 15.5 5.3C17.9 5.3 19.8 7.1 19.8 9.5C19.8 14.2 13.9 18.5 12 20.2Z"/></svg>`;

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
      <button class="fav-remove" type="button" data-remove-fav="${v.id}" aria-label="Удалить ${v.name} из избранного">${heartSvg(true)}</button>
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
      button.innerHTML=heartSvg(false);
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
      b.innerHTML=heartSvg(count>0);
      b.setAttribute('aria-label',count?`Избранное, ${count}`:'Избранное');
    }
  }

  function decorateCatalog(){
    const ids=favIds();
    document.querySelectorAll('#list .item[data-id]').forEach(item=>{
      const id=Number(item.dataset.id);
      if(!Number.isFinite(id))return;
      const venue=(window.VENUES||[]).find(v=>Number(v.id)===id);
      let btn=item.querySelector('.catalog-fav');
      if(!btn){
        btn=document.createElement('button');
        btn.type='button';
        btn.className='catalog-fav';
        btn.dataset.catalogFav=String(id);
        item.appendChild(btn);
        btn.addEventListener('click',e=>{
          e.preventDefault();
          e.stopPropagation();
          toggleFavorite(id,true);
        });
      }
      const filled=ids.has(id);
      btn.innerHTML=heartSvg(filled);
      btn.setAttribute('aria-label',filled?`Удалить ${venue?.name||'заведение'} из избранного`:`Добавить ${venue?.name||'заведение'} в избранное`);
    });
  }

  function renderFavorites(){
    if(!ensureUi())return;
    const ids=favIds();
    const list=(window.VENUES||[]).filter(v=>ids.has(Number(v.id)));
    const el=document.getElementById('favList'),badge=document.getElementById('favCount');
    if(badge)badge.textContent=String(list.length);
    if(!el)return;
    el.innerHTML=list.length?list.map(favoriteItem).join(''):`<div class="favorite-empty"><div class="heart">${heartSvg(false)}</div><b>Пока пусто</b><br>Нажмите на сердечко в карточке бани или сауны — она появится здесь.</div>`;

    el.querySelectorAll('[data-favorite-id]').forEach(item=>{
      item.addEventListener('click',e=>{
        if(e.target.closest('[data-remove-fav]'))return;
        const id=Number(item.dataset.favoriteId);
        try{if(typeof open==='function')open(id)}catch(_){ }
      });
    });
    el.querySelectorAll('[data-remove-fav]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(Number(btn.dataset.removeFav),true);
      });
    });
    updateNavCount();
  }

  function syncOpenHeart(){
    const title=document.querySelector('#sheet .detail h2')?.textContent?.trim();
    if(!title)return;
    const v=(window.VENUES||[]).find(x=>x.name===title),heart=document.querySelector('#sheet .fav');
    if(v&&heart){
      const filled=favIds().has(Number(v.id));
      heart.innerHTML=heartSvg(filled);
      heart.setAttribute('aria-label',filled?'Удалить из избранного':'Добавить в избранное');
    }
  }

  function refreshFavoriteUi(){
    renderFavorites();
    decorateCatalog();
    updateNavCount();
    syncOpenHeart();
  }

  function toggleFavorite(id,showMessage=false){
    if(!Number.isFinite(id))return;
    const set=favIds();
    const add=!set.has(id);
    if(add)set.add(id);else set.delete(id);
    writeFavs(set);
    refreshFavoriteUi();
    if(showMessage){
      try{if(typeof toast==='function')toast(add?'Добавлено в избранное':'Удалено из избранного')}catch(_){ }
    }
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

  function boot(){
    let tries=0;
    const wait=()=>{
      tries++;
      if(!ensureUi()||typeof render!=='function'){
        if(tries<120)setTimeout(wait,50);
        return;
      }
      patchScreen();
      refreshFavoriteUi();

      document.addEventListener('click',e=>{
        if(e.target.closest('#sheet .fav'))setTimeout(refreshFavoriteUi,0);
      });

      const sheet=document.getElementById('sheet');
      if(sheet)new MutationObserver(()=>requestAnimationFrame(syncOpenHeart)).observe(sheet,{childList:true,subtree:true});

      const list=document.getElementById('list');
      if(list)new MutationObserver(()=>requestAnimationFrame(decorateCatalog)).observe(list,{childList:true,subtree:true});

      window.addEventListener('storage',e=>{if(e.key===KEY)refreshFavoriteUi()});
    };
    wait();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
