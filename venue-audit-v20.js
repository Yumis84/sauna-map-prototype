// Точечная сверка каталога по свежим/официальным источникам. v20.0
(function(){
  if(window.__pargidVenueAuditV20)return;
  window.__pargidVenueAuditV20=true;

  const uniq=a=>[...new Set((a||[]).filter(Boolean))];

  const OVERRIDES={
    'Бордо':{
      phone:'+74012507070',
      phoneAlternates:['+79114502013'],
      addFeatures:['Финская сауна','Бассейн','Джакузи'],
      details:{
        description:'Сауна «Бордо» на Генерала Буткова: финская парная, тёплый бассейн, джакузи и гидромассаж. Есть комната отдыха, караоке, Wi‑Fi и зона барбекю.',
        steam:['Финская сауна'],
        aqua:['Тёплый бассейн','Джакузи','Гидромассаж','Душ'],
        service:['Комната отдыха','Караоке','Wi‑Fi','Барбекю-зона','Парковка']
      }
    },
    'Багира':{
      phone:'+74012770231',
      addFeatures:['Финская сауна','Бассейн','Джакузи'],
      details:{
        description:'Сауна «Багира» на проспекте Победы с финской парной, бассейном и зоной отдыха. В актуальных справочниках также указано джакузи.',
        steam:['Финская сауна'],
        aqua:['Бассейн','Джакузи'],
        service:['Комната отдыха','TV','Караоке']
      }
    },
    'Котбус':{
      phone:'+74012585888',
      addFeatures:['Сауна','Бассейн'],
      details:{
        description:'Сауна при отеле «Котбус»: парная, бассейн с подогревом, гидромассажем и противотоком. Во дворе есть зона барбекю.',
        steam:['Сауна','Можно париться с вениками'],
        aqua:['Тёплый бассейн','Гидромассаж','Противоток'],
        service:['Зона барбекю','Отель','Wi‑Fi','Парковка']
      }
    },
    'Навигатор':{
      phone:'+74012566222',
      addFeatures:['Сауна','Бассейн'],
      details:{
        description:'Сауна отеля «Навигатор» с бассейном, комнатой отдыха и раздевалкой. В бассейне предусмотрены противоток, водяной каскад и водопадное устройство.',
        steam:['Сауна'],
        aqua:['Бассейн','Противоток','Водяной каскад'],
        service:['Комната отдыха','Раздевалка','Отель','Парковка']
      }
    },
    'Кристалл':{
      phone:'+74012533434',
      addFeatures:['Сауна','Бассейн','Хаммам'],
      details:{
        description:'Семейная сауна «Кристалл» на Литовском Валу. Есть большой комплекс с тёплым бассейном и отдельный малый комплекс с хаммамом и тёплым чаном.',
        steam:['Сауна','Хаммам'],
        aqua:['Тёплый бассейн','Тёплый чан'],
        service:['Банкетный зал','Караоке','Массажные кресла','Мангальная зона']
      }
    },
    'Родная гавань':{
      phone:'+74012521036',
      phoneAlternates:['+79506724001']
    },
    'Баныч':{phone:'+79062375434'},
    'Дейма':{phone:'+74012710814'},
    'Калина':{phone:'+74012770463',phoneAlternates:['+74012685070']},
    'Пирс':{phone:'+74012385098'}
  };

  function apply(){
    if(!Array.isArray(window.VENUES))return;
    for(const v of window.VENUES){
      const o=OVERRIDES[v.name];
      if(!o)continue;
      if(o.phone)v.phone=o.phone;
      if(o.phoneAlternates)v.phoneAlternates=uniq(o.phoneAlternates);
      if(o.addFeatures)v.features=uniq([...(v.features||[]),...o.addFeatures]);
      if(o.details){v.details=o.details;v.desc=o.details.description}
    }
    const uoz=window.VENUES.find(v=>v.name==='У озера');
    if(uoz)uoz.auditStatus='listed-active-in-current-directories';
    const afro=window.VENUES.find(v=>v.name==='Афродита');
    if(afro)afro.auditStatus='listed-active-in-current-directories';
  }

  apply();
  document.addEventListener('pargid:map-photos-ready',apply);
  document.addEventListener('pargid:vsaunah-ready',apply);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});
  setTimeout(apply,250);
  setTimeout(apply,900);
})();
