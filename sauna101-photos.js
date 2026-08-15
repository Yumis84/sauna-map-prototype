// Дополнительные фото заведений из публичного каталога 101sauna.ru.
// Файлы не копируются в репозиторий: используются прямые внешние URL изображений.
(function(){
  const source='https://101sauna.ru/Kaliningrad';
  const photos={
    'Бордо':[
      'https://101sauna.ru/media/4187/conversions/sauna-101986-0-main-image-card.jpg',
      'https://101sauna.ru/media/4188/conversions/sauna-101986-1-main-image-card.jpg',
      'https://101sauna.ru/media/4189/conversions/sauna-101986-2-main-image-card.jpg'
    ],
    'У озера':[
      'https://101sauna.ru/media/5355/conversions/sauna-128672-0-main-image-card.jpg',
      'https://101sauna.ru/media/5357/conversions/sauna-128672-1-main-image-card.jpg',
      'https://101sauna.ru/media/5360/conversions/sauna-128672-2-main-image-card.jpg'
    ],
    'Афродита':[
      'https://101sauna.ru/media/13660/conversions/sauna-14508-0-main-image-card.jpg',
      'https://101sauna.ru/media/13662/conversions/sauna-14508-1-main-image-card.jpg',
      'https://101sauna.ru/media/13663/conversions/sauna-14508-2-main-image-card.jpg'
    ],
    'Багира':[
      'https://101sauna.ru/media/13671/conversions/sauna-14512-0-main-image-card.jpg',
      'https://101sauna.ru/media/13672/conversions/sauna-14512-1-main-image-card.jpg',
      'https://101sauna.ru/media/13673/conversions/sauna-14512-2-main-image-card.jpg'
    ],
    'Центр отдыха «Баньки»':[
      'https://101sauna.ru/media/13678/conversions/sauna-14520-0-main-image-card.jpg',
      'https://101sauna.ru/media/13679/conversions/sauna-14520-1-main-image-card.jpg',
      'https://101sauna.ru/media/13680/conversions/sauna-14520-2-main-image-card.jpg'
    ],
    'Котбус':[
      'https://101sauna.ru/media/13700/conversions/sauna-14640-0-main-image-card.jpg',
      'https://101sauna.ru/media/13701/conversions/sauna-14640-1-main-image-card.jpg',
      'https://101sauna.ru/media/13702/conversions/sauna-14640-2-main-image-card.jpg'
    ],
    'Феникс':[
      'https://101sauna.ru/media/17922/conversions/sauna-42032-0-main-image-card.jpg',
      'https://101sauna.ru/media/17923/conversions/sauna-42032-1-main-image-card.jpg',
      'https://101sauna.ru/media/17924/conversions/sauna-42032-2-main-image-card.jpg'
    ],
    'Кристалл':[
      'https://101sauna.ru/media/92680/conversions/sauna-84601-2-main-image-card.jpg',
      'https://101sauna.ru/media/92678/conversions/sauna-84601-0-main-image-card.jpg',
      'https://101sauna.ru/media/92679/conversions/sauna-84601-1-main-image-card.jpg'
    ],
    'Родная гавань':[
      'https://101sauna.ru/media/3891/conversions/sauna-90046-0-main-image-card.jpg',
      'https://101sauna.ru/media/3892/conversions/sauna-90046-1-main-image-card.jpg',
      'https://101sauna.ru/media/3893/conversions/sauna-90046-2-main-image-card.jpg'
    ],
    'Ника':[
      'https://101sauna.ru/media/31848/conversions/sauna-90234-0-main-image-card.jpg',
      'https://101sauna.ru/media/31849/conversions/sauna-90234-1-main-image-card.jpg',
      'https://101sauna.ru/media/31850/conversions/sauna-90234-2-main-image-card.jpg'
    ],
    'Баня на Шишкина':[
      'https://101sauna.ru/media/81918/conversions/sauna-141454-0-main-image-card.jpg',
      'https://101sauna.ru/media/81919/conversions/sauna-141454-1-main-image-card.jpg',
      'https://101sauna.ru/media/81920/conversions/sauna-141454-2-main-image-card.jpg'
    ],
    'Русские Бани':[
      'https://101sauna.ru/media/43265/conversions/sauna-143011-0-main-image-card.jpg',
      'https://101sauna.ru/media/43267/conversions/sauna-143011-1-main-image-card.jpg',
      'https://101sauna.ru/media/43269/conversions/sauna-143011-2-main-image-card.jpg'
    ],
    'Золотая ночь':[
      'https://101sauna.ru/media/43695/conversions/sauna-145551-0-main-image-card.jpg',
      'https://101sauna.ru/media/43697/conversions/sauna-145551-1-main-image-card.jpg',
      'https://101sauna.ru/media/43699/conversions/sauna-145551-2-main-image-card.jpg'
    ],
    'В Ёлках':[
      'https://101sauna.ru/media/45296/conversions/sauna-154588-0-main-image-card.jpg',
      'https://101sauna.ru/media/45297/conversions/sauna-154588-1-main-image-card.jpg',
      'https://101sauna.ru/media/45298/conversions/sauna-154588-2-main-image-card.jpg'
    ],
    'Баныч':[
      'https://101sauna.ru/media/39777/conversions/sauna-126607-0-main-image-card.jpg',
      'https://101sauna.ru/media/39778/conversions/sauna-126607-1-main-image-card.jpg',
      'https://101sauna.ru/media/39779/conversions/sauna-126607-2-main-image-card.jpg'
    ],
    'Дейма':[
      'https://101sauna.ru/media/13699/conversions/sauna-14596-0-main-image-card.jpg'
    ]
  };

  window.SAUNA101_PHOTOS=photos;
  if(!Array.isArray(window.VENUES))return;
  const unique=a=>[...new Set((a||[]).filter(Boolean))];
  for(const [name,images] of Object.entries(photos)){
    const v=window.VENUES.find(x=>x.name===name);
    if(!v)continue;
    const existing=Array.isArray(v.gallery)&&v.gallery.length?v.gallery:(v.img?[v.img]:[]);
    v.gallery=unique([...existing,...images]);
    v.sauna101PhotoSource=source;
    if(!String(v.source||'').includes('101sauna'))v.source=v.source?`${v.source} / 101sauna.ru фото`:'101sauna.ru фото';
  }
})();
