// Проверенные официальные фото-источники. Сверено 15.08.2026.
window.PHOTO_SOURCES = {
  "Котбус": {url:"https://hotel-cotbus.ru/", label:"Официальный сайт · Котбус"},
  "Дейма": {url:"https://hotel-deima.ru/", label:"Официальный сайт · Дейма"},
  "Навигатор": {url:"https://navigator-hotel.com/ru/services/sauna/", label:"Официальная страница сауны · Навигатор"},
  "В Ёлках": {url:"https://dom-elki39.ru/", label:"Официальный сайт и фотогалерея · В Ёлках"},
  "Банный клуб «Лёд»": {url:"https://chinatown-hotel.ru/", label:"Официальный сайт комплекса · Лёд"},
  "K8 SPA": {url:"https://spa.k8.ru/", label:"Официальный сайт · K8 SPA"},
  "SPA-House": {url:"https://spahouse39.ru/spa-gallery/", label:"Официальная галерея · SPA House"},
  "Высший разряд": {url:"https://bvr39.ru/", label:"Официальный сайт и фото · Высший разряд"},
  "Душа": {url:"https://dushaspa.ru/", label:"Официальный сайт · Душа SPA"},
  "Риверсайд": {url:"https://hotelriverside.ru/", label:"Официальный сайт и галерея · RiverSide"},
  "Посейдон": {url:"https://plyazhposeidona.ru/", label:"Официальный сайт · Пляж Посейдон"},
  "Marton Sauna": {url:"https://hotel-marton.ru/kaliningrad/marton-palace/", label:"Официальный сайт · Marton Palace"},
  "Ашман Парк": {url:"https://www.sauna39.ru/", label:"Официальный сайт оператора · Ашман Парк"},
  "Статус": {url:"https://www.sauna39.ru/", label:"Официальный сайт оператора · Статус"},
  "Граф Орлов": {url:"https://www.sauna39.ru/", label:"Официальный сайт оператора · Граф Орлов"}
};

// Реальные фотографии из карточек Баня.ру. Пользователь подтвердил разрешение на их использование в проекте.
// Файлы остаются на публичном CDN Баня.ру/Yandex Cloud; для каждой фотографии сохранена ссылка на карточку-источник.
window.BANYA_PHOTOS = {
  "Статус": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/3e9cc737-514c-4f25-9f6a-b08f74bf3e4a/018e0983-3c39-149b-201a-12688cd4a440/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/banya-gostevogo-doma-status_9049-3043/"
  },
  "Комильфо": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/21562918-89cb-4d6e-ad2d-a26a97849787/018e606e-4df5-53ca-d968-aa36d9386f60/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/banya-gostevoy-dom-komilfo_2564-3592/"
  },
  "Анклав": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/2dc7fdb5-4520-4473-845e-671861c0357f/018e09c8-b5a2-2bca-3604-99f0e78fe74b/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/banya-na-vode-anklav_4626-6824/"
  },
  "Баня на Грига": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/1a5e0c32-f70d-4c0b-8b98-dd391a42e482/018e09fc-2033-0d01-c0fd-145cf740dd8b/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/banya-na-griga_3518-0715/"
  },
  "Робинзон": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/43b1c3e9-bdc2-408b-a517-07c08dcc44b7/018e09c4-67cb-4aab-9b69-2750d00dd7a0/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/banya-otel-robinzon_4098-5793/"
  },
  "Афродита": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/93ef263e-1e79-496e-9ad2-0d37cf69bf60/018e09a4-8709-8e39-b24e-3ac1168b5c43/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/sauna-afrodita_9573-6307/"
  },
  "Граф Орлов": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/96e2172c-e6f0-4484-9e1d-54f269dd5dda/018e095f-f2bf-8223-e20e-9723a7574e9e/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/sauna-banya-graf-orlov_3318-9306/"
  },
  "Русские Бани": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/feced672-1a35-4afd-96ea-6f32a3acc305/018e09fb-6a7a-9fab-3fbf-ed45dc72a22f/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/russkie-bani-na-turukhanskoy_7698-8234/"
  },
  "Карусель": {
    img:"https://storage.yandexcloud.net/data.banya.ru/uploads/4d81dd38-e404-4bf6-96f5-0584faa89a7f/018e0998-603f-1ede-19f3-5821179ba948/LG.webp",
    url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/sauna-karusel_9470-9439/"
  }
};

if (Array.isArray(window.VENUES)) {
  for (const [name, photo] of Object.entries(window.BANYA_PHOTOS)) {
    const venue = window.VENUES.find(v => v.name === name);
    if (!venue) continue;
    venue.img = photo.img;
    venue.banyaPhotoUrl = photo.url;
    if (!String(venue.source || '').includes('Баня.ру')) {
      venue.source = venue.source ? `${venue.source} / Баня.ру фото` : 'Баня.ру фото';
    }
  }
}

// Не показываем пользователю технический фильтр по источнику фотографий.
(function hidePhotoSourceFilter(){
  const removeChip = () => {
    document.querySelectorAll('[data-f="📷 Официальные фото"]').forEach(el => el.remove());
  };
  const start = () => {
    removeChip();
    new MutationObserver(removeChip).observe(document.body, {childList:true, subtree:true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
