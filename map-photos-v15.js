// Дополнительные проверяемые фото-источники. Не применяем URL, если изображение не загрузилось. v15
(function(){
  if(window.__pargidMapPhotosV15)return;
  window.__pargidMapPhotosV15=true;

  const SOURCES={
    "K8 SPA":{
      preferIncoming:true,
      url:"https://spa.k8.ru/",
      images:[
        "https://static.tildacdn.com/tild3832-6631-4330-a365-306533613735/photo-1.webp",
        "https://static.tildacdn.com/tild6538-3562-4136-a239-636336383031/photo-2.webp",
        "https://static.tildacdn.com/tild6363-3662-4530-b365-666334326461/photo-3.webp"
      ]
    },
    "Посейдон":{
      preferIncoming:true,
      url:"https://plyazhposeidona.ru/",
      images:[
        "https://optim.tildacdn.com/tild3661-3461-4566-b339-393461373333/-/resize/1200x/-/format/webp/IMG_9947-min_1_1_5.png.webp",
        "https://optim.tildacdn.com/tild3534-6139-4164-b962-666665616439/-/format/webp/IMG_0218-min.jpeg.webp",
        "https://optim.tildacdn.com/tild6561-3937-4633-b830-396666396663/-/format/webp/IMG_1085-min.jpeg.webp"
      ]
    },
    "Marton Sauna":{
      url:"https://101sauna.ru/Kaliningrad/marton",
      images:[
        "https://101sauna.ru/media/41167/conversions/sauna-133558-0-main-image-card.jpg",
        "https://101sauna.ru/media/41169/conversions/sauna-133558-1-main-image-card.jpg",
        "https://101sauna.ru/media/41171/conversions/sauna-133558-2-main-image-card.jpg",
        "https://101sauna.ru/media/41173/conversions/sauna-133558-3-image-card.jpg",
        "https://101sauna.ru/media/41176/conversions/sauna-133558-4-image-card.jpg"
      ]
    },
    "Банька":{
      url:"https://101sauna.ru/Kaliningrad/banyka",
      images:[
        [
          "https://101sauna.ru/media/77682/conversions/sauna-119817-0-main-image-card.jpg",
          "https://101sauna.ru/media/77682/conversions/sauna-119817-0-main-image-thumb-desktop.jpg"
        ],
        "https://101sauna.ru/media/77683/conversions/sauna-119817-1-main-image-card.jpg",
        "https://101sauna.ru/media/77684/conversions/sauna-119817-2-main-image-card.jpg"
      ]
    },
    "Банный клуб «Лёд»":{
      url:"https://banya.ru/kaliningradskaya-obl_kaliningrad/bathhouses/bannyy-klub-led_4279-5553/",
      images:[
        "https://storage.yandexcloud.net/data.banya.ru/uploads/23c04346-5b6d-47a1-9689-a53728b68ee9/018de7e3-bab3-9732-da36-4ff022f77258/LG.webp",
        "https://storage.yandexcloud.net/data.banya.ru/uploads/23c04346-5b6d-47a1-9689-a53728b68ee9/018de7e3-b427-2fd8-bc49-679807042d16/LG.webp",
        "https://storage.yandexcloud.net/data.banya.ru/uploads/23c04346-5b6d-47a1-9689-a53728b68ee9/018de7e3-abab-2005-5842-57d6963676b8/LG.webp"
      ]
    },
    "Spa-House":{
      preferIncoming:true,
      url:"https://spahouse39.ru/",
      images:[
        "https://spahouse39.ru/wp-content/uploads/2022/01/ss.jpg",
        "https://spahouse39.ru/wp-content/uploads/2022/01/s3250-min.png",
        "https://spahouse39.ru/wp-content/uploads/2022/01/s2250-min.png",
        "https://spahouse39.ru/wp-content/uploads/2022/01/s1250-min.png"
      ]
    }
  };

  const isDemo=url=>/images\.unsplash\.com/i.test(String(url||''));
  const isPlaceholder=url=>/venue-placeholder\.svg/i.test(String(url||''));
  const unique=a=>[...new Set(a.filter(Boolean))];

  function probe(url,timeout=9000){
    return new Promise(resolve=>{
      const img=new Image();
      let done=false;
      const finish=ok=>{if(done)return;done=true;clearTimeout(timer);img.onload=img.onerror=null;resolve(ok?url:null)};
      const timer=setTimeout(()=>finish(false),timeout);
      img.onload=()=>finish((img.naturalWidth||0)>40&&(img.naturalHeight||0)>40);
      img.onerror=()=>finish(false);
      img.referrerPolicy='no-referrer-when-downgrade';
      img.src=url;
    });
  }

  async function firstWorking(candidate){
    const variants=Array.isArray(candidate)?candidate:[candidate];
    for(const url of variants){
      const ok=await probe(url);
      if(ok)return ok;
    }
    return null;
  }

  async function applyOne(name,source){
    const v=(window.VENUES||[]).find(x=>x.name===name);
    if(!v)return false;

    const incoming=[];
    for(const candidate of source.images||[]){
      const ok=await firstWorking(candidate);
      if(ok)incoming.push(ok);
    }
    if(!incoming.length)return false;

    const existing=unique([...(Array.isArray(v.gallery)?v.gallery:[]),v.img])
      .filter(u=>u&&!isDemo(u)&&!isPlaceholder(u));
    const merged=source.preferIncoming?unique([...incoming,...existing]):unique([...existing,...incoming]);
    if(!merged.length)return false;

    v.gallery=merged;
    v.img=merged[0];
    v.photoSourceUrl=source.url;
    return true;
  }

  async function start(){
    if(!Array.isArray(window.VENUES))return;
    let changed=false;
    for(const [name,source] of Object.entries(SOURCES)){
      try{if(await applyOne(name,source))changed=true}catch(_){ }
    }
    if(changed)document.dispatchEvent(new CustomEvent('pargid:map-photos-ready'));
  }

  start();
})();
