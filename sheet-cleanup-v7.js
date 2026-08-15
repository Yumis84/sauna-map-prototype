// UI cleanup loader + practical sauna/price filters + venue swipe. v9.1
(function(){
  const swipe=document.createElement('script');
  swipe.src='venue-swipe-v9.js?v=9.1';
  document.head.appendChild(swipe);

  const legacy=document.createElement('script');
  legacy.src='sauna101-legacy-v7.js?v=8';
  legacy.onload=bootFilters;
  legacy.onerror=bootFilters;
  document.head.appendChild(legacy);

  function bootFilters(){
    let tries=0;
    const wait=()=>{
      tries++;
      try{
        if(typeof render!=='function'||typeof data!=='function'||typeof filters==='undefined'||typeof active==='undefined')throw new Error('main not ready');

        const desired=['Все','Бассейн','Сауна','На дровах','Хаммам','До 1000 ₽','1000–1500 ₽','От 1500 ₽'];
        filters.splice(0,filters.length,...desired);

        const baseSearch=()=>{
          const q=(document.querySelector('#q')?.value||'').trim().toLowerCase();
          return (window.VENUES||[]).filter(v=>!q||[v.name,v.type,v.address,...(v.features||[])].join(' ').toLowerCase().includes(q));
        };
        const has=(v,label)=>(v.features||[]).some(x=>String(x).toLowerCase()===label.toLowerCase());
        const isSauna=v=>(v.features||[]).some(x=>/^(сауна|финская сауна)$/i.test(String(x)));

        data=function(){
          const list=baseSearch();
          if(active==='Все')return list;
          if(active==='Бассейн')return list.filter(v=>has(v,'Бассейн'));
          if(active==='Сауна')return list.filter(isSauna);
          if(active==='На дровах')return list.filter(v=>has(v,'На дровах'));
          if(active==='Хаммам')return list.filter(v=>has(v,'Хаммам'));
          if(active==='До 1000 ₽')return list.filter(v=>Number.isFinite(v.price)&&v.price<1000);
          if(active==='1000–1500 ₽')return list.filter(v=>Number.isFinite(v.price)&&v.price>=1000&&v.price<1500);
          if(active==='От 1500 ₽')return list.filter(v=>Number.isFinite(v.price)&&v.price>=1500);
          return list;
        };

        if(!desired.includes(active))active='Все';
        render();
      }catch(e){
        if(tries<80)setTimeout(wait,40);
      }
    };
    wait();
  }
})();
