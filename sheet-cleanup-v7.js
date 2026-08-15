// Актуализация каталога + UI cleanup loader. v13.17
(function(){
  const PLACEHOLDER='venue-placeholder.svg?v=10';
  const isDemo=url=>/images\.unsplash\.com/i.test(String(url||''));
  const isPlaceholder=url=>/venue-placeholder\.svg/i.test(String(url||''));
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  const GENERIC_DESC_RE=/Данные и цены справочные|Данные и цены .*уточн/i;

  // Закрытые карточки не показываем в актуальном каталоге.
  const CLOSED_VENUES=new Set(['Villa Spa']);

  // Структурные правки после сверки названия + адреса + свежих источников.
  const EAST_PATCH={
    name:'Восток',
    type:'Семейная сауна',
    address:'ул. Дзержинского, 242 к1',
    price:2500,
    priceMax:null,
    cap:10,
    features:['Сауна','Бассейн','Караоке','Комната отдыха','Мангал','Wi‑Fi'],
    phone:'+79999996139',
    source:'Официальный сайт sauna-kaliningrad.ru / 2ГИС',
    desc:'Семейная финская сауна до 10 гостей с бассейном, караоке и отдельной комнатой отдыха. Есть Wi‑Fi, парковка, летняя веранда и мангал; посещение — по предварительной записи.'
  };
  const SPAROHOD_PATCH={
    name:'СПАроход',
    type:'Баня / SPA',
    address:'ул. Ялтинская, 66 к19',
    price:null,
    priceMax:null,
    cap:null,
    features:['Русская баня','Сауна','SPA','Бассейн'],
    phone:'+79062385852',
    source:'Официальный сайт sparoxod.ru / Яндекс Карты',
    desc:'Банный SPA-комплекс у пристани на Ялтинской, 66 к19. В актуальных источниках подтверждаются русская баня, сауна, SPA-формат и бассейн; стоимость зависит от выбранной программы.'
  };
  const NUMBERED_BATHS_PATCH={
    name:'Номерные бани',
    type:'Русская баня',
    address:'ул. Ялтинская, 20А',
    price:1700,
    priceMax:3000,
    cap:6,
    features:['Русская баня','Комната отдыха','SPA'],
    phone:'+74012755555',
    source:'Актуальная карточка банного комплекса / RiverSide',
    desc:'Приватные номерные русские бани для компании до 6 гостей. Есть отдельная парная, просторная зона отдыха и дополнительные банные и SPA-процедуры; требуется предварительное бронирование.'
  };

  const VENUE_PATCHES={
    'Бордо':{
      phone:'+79114502013',
      features:['Финская сауна','Бассейн','Джакузи','Гидромассаж','Караоке','Мангал'],
      source:'Официальный сайт sauna-bordo.ru / bordo.obiz.ru / 2ГИС',
      desc:'Финская сауна до 10 гостей с тёплым бассейном, гидромассажем и джакузи. Есть караоке, комната отдыха, мангал и зона барбекю; работает круглосуточно.'
    },
    'Эйфория':{
      price:400,
      priceMax:500,
      cap:15,
      features:['Русская баня','На дровах','Бассейн','Бильярд','Комната отдыха','TV'],
      source:'101sauna.ru',
      desc:'Русская баня на дровах до 15 гостей на Суворова, 54г. Есть бассейн, бильярд, зона отдыха и TV; в бане можно париться с веником. Номер администратора источник подтверждает, но сами цифры публично не раскрывает.'
    },
    'Феникс':EAST_PATCH,
    'Восток':EAST_PATCH,
    'Пирс':SPAROHOD_PATCH,
    'СПАроход':SPAROHOD_PATCH,
    'Банный дворЪ':NUMBERED_BATHS_PATCH,
    'Номерные бани':NUMBERED_BATHS_PATCH,
    'Околица':{
      address:'ул. Магнитогорская, 7 к2',
      phone:'+79637388666',
      features:['Русская баня','На дровах','Бассейн','Мангал','Беседка'],
      source:'2ГИС / актуальные городские справочники',
      desc:'Русская баня на дровах с тёплым бассейном, беседкой и мангальной зоной. Работает круглосуточно; подходит для отдыха небольшой компанией.'
    },
    'Серебряная чаша':{
      address:'ул. Судостроительная, 6/2',
      phone:'+79814606804',
      price:1500,
      features:['Русская баня','Хаммам','Бассейн','Сауна'],
      source:'Яндекс Карты / актуальная карточка заведения',
      desc:'Банный комплекс с русской парной, хаммамом и бассейном. Актуальная карточка заведения указывает адрес Судостроительная, 6/2 и круглосуточный режим работы.'
    },
    'Баня №1':{
      address:'ул. Комсомольская, 83',
      phone:'+74012215842',
      features:['Русская баня','Сауна'],
      source:'Официальный сайт Калининградских городских бань',
      desc:'Действующая городская общественная баня на Комсомольской, 83. Есть русская парная и отдельная сауна, которую можно посещать по предварительному бронированию.'
    },
    'Орион':{
      phone:'+79062388832',
      features:['Сауна','Бассейн','Гостевой дом'],
      source:'Официальный сайт orion39.ru',
      desc:'Сауна с бассейном при гостинице «Орион» на Подполковника Иванникова, 8. Рассчитана примерно на 6 гостей; работает по расписанию гостиничного комплекса.'
    },
    'Ашман Парк':{
      phone:'+79062115016',
      source:'Официальный сайт sauna39.ru',
      desc:'Русская баня на дровах при комплексе «Ашман Парк». Есть комнаты для отдыха и парковка; баня рассчитана на небольшую компанию и бронируется по телефону.'
    },
    'Граф Орлов':{
      phone:'+79097841087',
      features:['Русская баня','На дровах','Сауна','Бильярд','Гостевой дом'],
      source:'Официальный сайт sauna39.ru',
      desc:'Комплекс с отдельной сауной и русской баней на дровах. Есть бильярд и гостиничные комнаты; баня и сауна бронируются по одному актуальному номеру комплекса.'
    },
    'Статус':{
      phone:'+79097949237',
      source:'Официальный сайт sauna39.ru'
    },
    'Marton Sauna':{
      phone:'+74012560086',
      source:'Официальный сайт Marton Palace / Visit Kaliningrad',
      desc:'Сауна при отеле Marton Palace в Большевистском переулке, 3. Для связи используется актуальный официальный телефон отеля; наличие и время сауны лучше уточнять при бронировании.'
    },
    'Отдых':{
      phone:'+79114546759',
      features:['Сауна','Бассейн','Комната отдыха'],
      source:'Актуальная страница комплекса / городские справочники',
      desc:'Финская сауна с большим бассейном и зоной отдыха на Карла Маркса, 80Б. В парной допускается использование веников; работает по предварительной записи.'
    },
    'Калина':{
      phone:'+74012685070',
      features:['Русская баня','На дровах','Бассейн','Комната отдыха','Гостевой дом'],
      source:'2ГИС / актуальные городские справочники',
      desc:'Русская баня на дровах при гостевом доме «Калина». Есть бассейн и комната отдыха; банный формат рассчитан примерно на 6 гостей.'
    }
  };

  // Основной телефон для звонка. Старые значения намеренно заменяются выбранным
  // после сверки номером, чтобы в приложении не было конфликтующих слоёв данных.
  const PHONE_UPDATES={
    'Бордо':'+79114502013',
    'У озера':'+79527981495',
    'Котбус':'+74012585888',
    'Навигатор':'+74012566222',
    'Восток':'+79999996139',
    'Кристалл':'+74012533434',
    'Родная гавань':'+74012521036',
    'Ника':'+74012904019',
    'Женский Рай':'+79052428040',
    'Баня на Шишкина':'+79062379575',
    'Русские Бани':'+79114601900',
    'Золотая ночь':'+74012677070',
    'В Ёлках':'+74012410077',
    'Форто-Ранта Рой Джой':'+74012376040',
    'Турецкая баня':'+74012772114',
    'Тазик':'+74012386620',
    'У Каштана':'+74012377279',
    'На Третьяковской 27':'+79521183727',
    'Баныч':'+79062375434',
    'Дейма':'+74012710814',
    'Отдых':'+79114546759',
    'Милана':'+74012772114',
    'Территория отдыха':'+74012774717',
    'СПАроход':'+79062385852',
    'Стиль':'+74012916331',
    'Релакс':'+74012379804',
    'Высший разряд':'+74012300013',
    'K8 SPA':'+74012338338',
    'Marton Sauna':'+74012560086',
    'Карусель':'+74012767693',
    'Посейдон':'+74012388783',
    'Статус':'+79097949237',
    'Комильфо':'+74012751015',
    'Робинзон':'+74012365367',
    'Царские забавы':'+79211009911',
    'Околица':'+79637388666',
    'Берлога':'+79632913197',
    'Номерные бани':'+74012755555',
    'Апельсин':'+74012642525',
    'Анклав':'+79633503505',
    'Душа':'+79097991700',
    'Ашман Парк':'+79062115016',
    'Калина':'+74012685070',
    'Серебряная чаша':'+79814606804',
    'Релакс плюс':'+74012526242',
    'Орион':'+79062388832',
    'Граф Орлов':'+79097841087',
    'Эфис':'+74012557678'
  };

  // 101sauna подтверждает действующую карточку Эйфории и возможность звонка,
  // но не публикует цифры в доступном HTML — поэтому не подставляем случайный номер.
  const PHONE_SOURCE_FALLBACKS={
    'Эйфория':'https://101sauna.ru/Kaliningrad/Euforiya'
  };

  function buildDescription(v){
    const kind=String(v.type||'Баня или сауна').trim();
    const address=String(v.address||'').trim();
    const cap=Number(v.cap)>0?` Формат рассчитан примерно до ${v.cap} гостей.`:'';
    const feats=unique(v.features||[]).slice(0,5);
    const services=feats.length?` Подтверждённые особенности: ${feats.join(', ').toLowerCase()}.`:'';
    const check=' Перед посещением лучше уточнить свободное время и текущую стоимость.';
    return `${kind}${address?` по адресу ${address}`:''}.${cap}${services}${check}`;
  }

  function applyVenueUpdates(){
    if(!Array.isArray(window.VENUES))return;

    for(let i=window.VENUES.length-1;i>=0;i--){
      if(CLOSED_VENUES.has(window.VENUES[i]?.name))window.VENUES.splice(i,1);
    }

    for(const v of window.VENUES){
      const patch=VENUE_PATCHES[v.name];
      if(patch)Object.assign(v,patch);
      if(v.details?.description&&!patch?.desc)v.desc=v.details.description;
      v.features=unique(v.features||[]);
      if(!v.desc||GENERIC_DESC_RE.test(v.desc))v.desc=buildDescription(v);
    }
  }

  function applyPhoneUpdates(){
    if(!Array.isArray(window.VENUES))return;
    for(const v of window.VENUES){
      const phone=PHONE_UPDATES[v.name];
      if(phone)v.phone=phone;
    }
  }

  function cleanDemoPhotos(){
    if(!Array.isArray(window.VENUES))return;
    for(const v of window.VENUES){
      const gallery=Array.isArray(v.gallery)?v.gallery:[];
      const real=unique(gallery.filter(src=>src&&!isDemo(src)&&!isPlaceholder(src)));
      if(real.length){v.gallery=real;v.img=real[0]}
      else if(v.img&&!isDemo(v.img)&&!isPlaceholder(v.img)){v.gallery=[v.img]}
      else{v.img=PLACEHOLDER;v.gallery=[PLACEHOLDER]}
    }
  }

  function applyAllData(){
    applyVenueUpdates();
    applyPhoneUpdates();
    cleanDemoPhotos();
  }

  function remove101SourceLabels(){
    document.querySelectorAll('#sheet .detail .muted').forEach(el=>{
      const text=(el.textContent||'').trim();
      if(/^Источник данных:/i.test(text)&&/(101SAUNA|101sauna\.ru фото)/i.test(text))el.remove();
    });
  }

  function cleanCallLabel(){
    document.querySelectorAll('#sheet .call-v4').forEach(btn=>{
      if(!btn.disabled&&/Позвонить в баню/i.test(btn.textContent||''))btn.textContent='☎ Позвонить';
    });
  }

  function installPhoneFallback(){
    if(window.__pargidPhoneSourceFallbackV13)return;
    window.__pargidPhoneSourceFallbackV13=true;
    document.addEventListener('click',e=>{
      const btn=e.target.closest?.('#sheet #call,#sheet .call-v4');
      if(!btn)return;
      const detail=btn.closest('.detail');
      const name=detail?.querySelector('h2')?.textContent?.trim();
      const venue=(window.VENUES||[]).find(v=>v.name===name);
      if(!venue||venue.phone)return;
      const url=PHONE_SOURCE_FALLBACKS[name];
      if(!url)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      window.open(url,'_blank','noopener');
    },true);
  }

  applyAllData();
  installPhoneFallback();

  const swipe=document.createElement('script');swipe.src='venue-swipe-v9.js?v=9.2';document.head.appendChild(swipe);
  const favorites=document.createElement('script');favorites.src='favorites-v12.js?v=12.6';document.head.appendChild(favorites);
  const ratingUi=document.createElement('script');ratingUi.src='rating-ui-v17.js?v=17';document.head.appendChild(ratingUi);
  const catalogSearch=document.createElement('script');catalogSearch.src='catalog-search-v18.js?v=18.5';document.head.appendChild(catalogSearch);
  const detailActions=document.createElement('script');detailActions.src='detail-actions-top-v19.js?v=19.4';document.head.appendChild(detailActions);
  const keepMapAlive=document.createElement('script');keepMapAlive.src='favorites-map-keepalive-v14.js?v=14';document.head.appendChild(keepMapAlive);
  const mapReturnFix=document.createElement('script');mapReturnFix.src='map-return-fix-v13.js?v=13';document.head.appendChild(mapReturnFix);
  const userLocation=document.createElement('script');userLocation.src='user-location-v16.js?v=16';document.head.appendChild(userLocation);

  document.addEventListener('pargid:map-photos-ready',()=>{
    applyAllData();
    try{if(typeof render==='function')render()}catch(_){ }
    requestAnimationFrame(()=>{remove101SourceLabels();cleanCallLabel()});
  });
  const mapPhotos=document.createElement('script');mapPhotos.src='map-photos-v15.js?v=15';document.head.appendChild(mapPhotos);

  document.addEventListener('pargid:vsaunah-ready',()=>{
    applyAllData();
    try{if(typeof render==='function')render()}catch(_){ }
    requestAnimationFrame(()=>{remove101SourceLabels();cleanCallLabel()});
  });
  const vsaunah=document.createElement('script');vsaunah.src='vsaunah-v11.js?v=11.1';document.head.appendChild(vsaunah);

  const legacy=document.createElement('script');
  legacy.src='sauna101-legacy-v7.js?v=8';
  legacy.onload=()=>{applyAllData();bootFilters()};
  legacy.onerror=()=>{applyAllData();bootFilters()};
  document.head.appendChild(legacy);

  function bootFilters(){
    let tries=0;
    const wait=()=>{
      tries++;
      try{
        if(typeof render!=='function'||typeof data!=='function'||typeof filters==='undefined'||typeof active==='undefined')throw new Error('main not ready');
        applyAllData();
        const desired=['Все','Бассейн','Джакузи','Сауна','На дровах','Хаммам','До 1000 ₽','1000–1500 ₽','От 1500 ₽'];
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
          if(active==='Джакузи')return list.filter(v=>has(v,'Джакузи'));
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
        requestAnimationFrame(()=>{remove101SourceLabels();cleanCallLabel()});
      }catch(e){if(tries<80)setTimeout(wait,40)}
    };
    wait();
  }

  function startSourceCleanup(){
    applyAllData();remove101SourceLabels();cleanCallLabel();
    const sheet=document.getElementById('sheet');
    if(sheet)new MutationObserver(()=>requestAnimationFrame(()=>{
      applyAllData();remove101SourceLabels();cleanCallLabel();
    })).observe(sheet,{childList:true,subtree:true});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startSourceCleanup,{once:true});
  else startSourceCleanup();
})();
