// Verified Vsaunah.ru venue data, photos and attribution. v11
(function(){
  const SOURCE={
    'Афина':{
      url:'https://kaliningrad.vsaunah.ru/sauna-rusalochka/',
      images:[
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_a456490d4c601db981beb7f3779b4d64_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_6f38a7112377b821b69e04e39df04f30_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_e26b0bc1afd734f9368246f0bbfa1548_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_6802c7ed8acfb4997a9e8a205fa29d7e_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_56586250d82acbe4757c979336f964d4_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_36874b7550459c5fa09e08c9e671c501_2.jpg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_bec30dbcb6387c890ef5b4581cd1a3d8_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_de9ba4ca31189de2971dbfe463bf5520_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_dcee381adcce0e0b080d8b77a77ea04f_2.jpeg',
        'https://cdn.vsaunah.ru/cache/sauns/5637/file_ee9369ef8d994550e1624ca01b5af154_2.jpeg'
      ],
      features:['Бассейн'],
      details:{
        description:'«Афина» совмещает русскую баню и финскую сауну с бассейном — формат подойдёт и для спокойного семейного вечера, и для отдыха компанией. После парной можно перейти в зону отдыха, включить караоке или приготовить еду на мангале; рядом есть парковка и гостиничные номера.',
        steam:['Русская баня','Сауна'],
        aqua:['Бассейн'],
        service:['Караоке','Мангал','Кафе / ресторан','Парковка','Гостиница','TV','Аудиоцентр']
      }
    },
    'Августо':{
      url:'https://kaliningrad.vsaunah.ru/sauna-avgusto/',
      features:['Бассейн'],
      details:{
        description:'«Августо» — финская сауна для компании или семейного отдыха с бассейном и отдельной зоной отдыха. После парной можно переключиться на настольные игры или караоке, а для более спокойного отдыха есть массажное кресло, бар и чайная зона.',
        steam:['Сауна'],
        aqua:['Бассейн'],
        service:['Караоке','Настольные игры','Массажное кресло','Бар','Парковка','TV','Аудиоцентр']
      }
    },
    'Стиль':{
      url:'https://kaliningrad.vsaunah.ru/sauna-stil/',
      features:['Бассейн','Джакузи','Бильярд'],
      details:{
        description:'В «Стиле» несколько залов с разным форматом отдыха: финская сауна, бассейн и отдельный зал с джакузи. Для компании есть бильярд и караоке, а для спокойного отдыха — комнаты отдыха и массажное кресло.',
        steam:['Сауна'],
        aqua:['Бассейн','Джакузи'],
        service:['Бильярд','Караоке','Массажное кресло','Wi‑Fi','Парковка']
      }
    },
    'Милана':{
      url:'https://kaliningrad.vsaunah.ru/sauna-milana/',
      features:['Бассейн','Бильярд'],
      details:{
        description:'«Милана» — финская сауна с тёплым бассейном и комнатой отдыха. После парной можно сыграть в бильярд, включить караоке или расслабиться в массажном кресле; предусмотрены барная зона и парковка.',
        steam:['Сауна'],
        aqua:['Бассейн','Обливное устройство'],
        service:['Бильярд','Караоке','Массажное кресло','Бар','Парковка','TV','Аудиоцентр']
      }
    },
    'Ашман Парк':{
      url:'https://kaliningrad.vsaunah.ru/sauna-ashman-park/',
      features:['Бильярд','Гостевой дом'],
      details:{
        description:'Сауна «Ашман Парк» работает при гостиничном комплексе и сочетает русскую и финскую парные с тёплым бассейном. Для компании есть бильярд и караоке, а отдых можно продолжить в кафе или гостиничном номере.',
        steam:['Русская баня','Сауна'],
        aqua:['Бассейн'],
        service:['Бильярд','Караоке','Кафе / ресторан','Мангал','Wi‑Fi','Массажное кресло','Гостиница','Парковка']
      }
    },
    'Высший разряд':{
      url:'https://kaliningrad.vsaunah.ru/vysshij-razryad-bannyj-kompleks/',
      features:['Русская баня','Бассейн'],
      details:{
        description:'«Высший разряд» — банный комплекс с несколькими русскими парными и разными аквазонами: в одних залах есть купели, в другом — бассейн и банный чан. Формат рассчитан на небольшие компании; доступны ресторан, бар, массаж и услуги парильщика.',
        steam:['Русская баня'],
        aqua:['Купель','Бассейн','Банный чан','Обливное устройство'],
        service:['Кафе / ресторан','Бар','Массаж','Парильщик','Wi‑Fi','Парковка']
      }
    },
    'Статус':{
      url:'https://kaliningrad.vsaunah.ru/sauna-status/',
      features:['Хаммам','Бассейн','Джакузи','Бильярд','На дровах']
    },
    'Царские забавы':{
      url:'https://kaliningrad.vsaunah.ru/sauna-teremok/',
      features:['Бассейн','Джакузи','На дровах']
    }
  };

  window.VSAUNAH_DATA=SOURCE;

  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const isPlaceholder=u=>/venue-placeholder\.svg/i.test(String(u||''));
  const isDemo=u=>/images\.unsplash\.com/i.test(String(u||''));

  function apply(){
    if(!Array.isArray(window.VENUES))return false;
    for(const [name,s] of Object.entries(SOURCE)){
      const v=window.VENUES.find(x=>x.name===name);
      if(!v)continue;
      v.vsaunahUrl=s.url;
      v.features=unique([...(v.features||[]),...(s.features||[])]);

      const realExisting=(v.gallery||[]).filter(u=>u&&!isPlaceholder(u)&&!isDemo(u));
      const incoming=s.images||[];
      if(incoming.length){
        v.gallery=unique([...realExisting,...incoming]);
        if((!v.img||isPlaceholder(v.img)||isDemo(v.img))&&v.gallery.length)v.img=v.gallery[0];
      }
      if(s.details&&!v.details)v.details=s.details;
    }
    document.dispatchEvent(new CustomEvent('pargid:vsaunah-ready'));
    return true;
  }

  const style=document.createElement('style');
  style.textContent=`
    .vsaunah-source-v11{display:inline-flex;align-items:center;gap:4px;margin-top:12px;color:#9eaaa4;font-size:12px;line-height:1.4;text-decoration:none;border-bottom:1px dotted #617069;padding-bottom:1px}
    .vsaunah-source-v11:hover{color:#d9e2dd;border-bottom-color:#9eaaa4}
  `;
  document.head.appendChild(style);

  function addAttribution(){
    const detail=document.querySelector('#sheet .detail');
    const title=detail?.querySelector('h2')?.textContent?.trim();
    const desc=detail?.querySelector('.desc-v4');
    if(!detail||!title||!desc)return;
    const v=(window.VENUES||[]).find(x=>x.name===title);
    if(!v?.vsaunahUrl)return;
    const old=desc.querySelector('.vsaunah-source-v11');
    if(old){old.href=v.vsaunahUrl;return;}
    const a=document.createElement('a');
    a.className='vsaunah-source-v11';
    a.href=v.vsaunahUrl;
    a.target='_blank';
    a.rel='noopener';
    a.textContent='Источник данных и фото: Vsaunah.ru ↗';
    desc.appendChild(a);
  }

  let tries=0;
  const start=()=>{
    tries++;
    if(!apply()&&tries<80){setTimeout(start,40);return;}
    try{if(typeof render==='function')render();}catch(_){ }
    addAttribution();
  };
  start();

  new MutationObserver(()=>requestAnimationFrame(addAttribution)).observe(document.documentElement,{childList:true,subtree:true});
})();
