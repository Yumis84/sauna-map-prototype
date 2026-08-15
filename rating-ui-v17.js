// Рейтинг: на карте скрыт; в каталоге/избранном/детали показывается с числом отзывов, если оно известно. v17
(function(){
  if(window.__pargidRatingUiV17)return;
  window.__pargidRatingUiV17=true;

  const style=document.createElement('style');
  style.textContent=`
    #cards .rate{display:none!important}
    #list .rate,#favorites .rate{white-space:nowrap;font-size:12px}
  `;
  document.head.appendChild(style);

  function venueById(id){
    return (window.VENUES||[]).find(v=>Number(v.id)===Number(id));
  }

  function reviewCount(v){
    const direct=Number(v?.reviewCount ?? v?.reviewsCount ?? v?.reviews);
    if(Number.isFinite(direct)&&direct>=0)return direct;
    const external=Number(window.VENUE_REVIEW_COUNTS?.[v?.name]);
    return Number.isFinite(external)&&external>=0?external:null;
  }

  function reviewWord(n){
    const n10=n%10,n100=n%100;
    if(n10===1&&n100!==11)return 'отзыв';
    if(n10>=2&&n10<=4&&(n100<12||n100>14))return 'отзыва';
    return 'отзывов';
  }

  function ratingText(v){
    const rating=Number(v?.rating);
    if(!Number.isFinite(rating)||rating<=0)return '';
    const count=reviewCount(v);
    return `★ ${rating}${count===null?'':` · ${count} ${reviewWord(count)}`}`;
  }

  function decorateList(root,selector,idAttr){
    root?.querySelectorAll(selector).forEach(item=>{
      const id=Number(item.getAttribute(idAttr));
      const v=venueById(id);
      const rateEl=item.querySelector('.rate');
      if(!rateEl||!v)return;
      const text=ratingText(v);
      if(rateEl.textContent!==text)rateEl.textContent=text;
      rateEl.style.display=text?'':'none';
    });
  }

  function decorateCatalog(){
    decorateList(document.getElementById('list'),'.item[data-id]','data-id');
    decorateList(document.getElementById('favList'),'.favorite-item[data-favorite-id]','data-favorite-id');
  }

  function decorateDetail(){
    const detail=document.querySelector('#sheet .detail');
    const title=detail?.querySelector('h2')?.textContent?.trim();
    if(!detail||!title)return;
    const v=(window.VENUES||[]).find(x=>x.name===title);
    if(!v)return;
    const facts=detail.querySelector('.facts');
    if(!facts)return;
    const ratingFact=[...facts.querySelectorAll('.fact')].find(f=>/рейтинг/i.test(f.querySelector('small')?.textContent||''))||facts.querySelector('.fact');
    if(!ratingFact)return;
    const text=ratingText(v);
    if(!text){
      ratingFact.style.display='none';
      facts.style.gridTemplateColumns='repeat(2,1fr)';
      return;
    }
    ratingFact.style.display='';
    facts.style.gridTemplateColumns='repeat(3,1fr)';
    const value=ratingFact.querySelector('b');
    if(value&&value.textContent!==text)value.textContent=text;
  }

  let scheduled=false;
  function refresh(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{
      scheduled=false;
      decorateCatalog();
      decorateDetail();
    });
  }

  function boot(){
    refresh();
    const list=document.getElementById('list');
    const favList=document.getElementById('favList');
    const sheet=document.getElementById('sheet');
    if(list)new MutationObserver(refresh).observe(list,{childList:true,subtree:true});
    if(favList)new MutationObserver(refresh).observe(favList,{childList:true,subtree:true});
    if(sheet)new MutationObserver(refresh).observe(sheet,{childList:true,subtree:true});
    document.addEventListener('click',e=>{
      if(e.target.closest('[data-id],[data-favorite-id],.nav'))setTimeout(refresh,0);
    });
    window.addEventListener('pargid:ratings-updated',refresh);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
