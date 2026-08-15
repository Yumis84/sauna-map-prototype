// Геопозиция пользователя на карте: метка «Вы здесь», точность и возврат к себе. v16
(function(){
  if(window.__pargidUserLocationV16)return;
  window.__pargidUserLocationV16=true;

  const style=document.createElement('style');
  style.textContent=`
    .pargid-user-marker{background:transparent!important;border:0!important}
    .pargid-user-dot{width:22px;height:22px;border-radius:50%;background:#2f8cff;border:4px solid #fff;box-shadow:0 0 0 5px #2f8cff38,0 4px 14px #0008;position:relative}
    .pargid-user-dot:after{content:"";position:absolute;inset:-9px;border:2px solid #2f8cff66;border-radius:50%;animation:pargidUserPulse 2s ease-out infinite}
    @keyframes pargidUserPulse{0%{transform:scale(.55);opacity:.9}75%,100%{transform:scale(1.45);opacity:0}}
    .pargid-locate-btn{position:absolute;z-index:850;right:14px;bottom:198px;width:46px;height:46px;border:1px solid #ffffff18;border-radius:15px;background:#111815f2;color:#eaf3ff;display:grid;place-items:center;box-shadow:0 10px 28px #0007;font-size:23px;line-height:1;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px)}
    .pargid-locate-btn:active{transform:scale(.96)}
    .pargid-locate-btn.located{color:#65a9ff}
    .pargid-locate-btn[hidden]{display:none!important}
  `;
  document.head.appendChild(style);

  let userMarker=null,accuracyCircle=null,lastCoords=null,watchId=null,firstFix=true;
  const KGD={lat:54.7104,lng:20.5100};

  function distanceKm(a,b){
    const R=6371,toRad=x=>x*Math.PI/180;
    const dLat=toRad(b.lat-a.lat),dLng=toRad(b.lng-a.lng);
    const s=Math.sin(dLat/2)**2+Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*Math.sin(dLng/2)**2;
    return 2*R*Math.asin(Math.sqrt(s));
  }

  function mapReady(){
    try{return !!(window.L&&typeof map!=='undefined'&&map&&typeof map.setView==='function'&&typeof map.addLayer==='function')}
    catch(_){return false}
  }

  function icon(){
    return L.divIcon({className:'pargid-user-marker',html:'<div class="pargid-user-dot"></div>',iconSize:[22,22],iconAnchor:[11,11]});
  }

  function button(){
    let btn=document.querySelector('.pargid-locate-btn');
    if(btn)return btn;
    const app=document.getElementById('app');
    if(!app)return null;
    btn=document.createElement('button');
    btn.type='button';
    btn.className='pargid-locate-btn';
    btn.innerHTML='◎';
    btn.setAttribute('aria-label','Показать моё местоположение');
    btn.title='Моё местоположение';
    btn.addEventListener('click',()=>{
      if(lastCoords&&mapReady()){
        map.setView([lastCoords.latitude,lastCoords.longitude],Math.max(15,map.getZoom?.()||15),{animate:true});
        return;
      }
      requestLocation(true);
    });
    app.appendChild(btn);
    syncButtonVisibility();
    return btn;
  }

  function syncButtonVisibility(){
    const btn=document.querySelector('.pargid-locate-btn');
    if(!btn)return;
    const mapTab=document.querySelector('.nav [data-s="map"]');
    btn.hidden=!!mapTab&&!mapTab.classList.contains('on');
  }

  function updatePosition(pos){
    if(!mapReady())return;
    const c=pos.coords;
    lastCoords=c;
    const ll=[c.latitude,c.longitude];
    const btn=button();
    btn?.classList.add('located');

    if(!userMarker){
      userMarker=L.marker(ll,{icon:icon(),zIndexOffset:10000,keyboard:false}).addTo(map);
      userMarker.bindPopup('<b>Вы здесь</b>');
    }else userMarker.setLatLng(ll);

    if(Number.isFinite(c.accuracy)&&c.accuracy>0&&c.accuracy<=2000){
      if(!accuracyCircle){
        accuracyCircle=L.circle(ll,{radius:c.accuracy,interactive:false,weight:1,opacity:.45,fillOpacity:.08,color:'#2f8cff',fillColor:'#2f8cff'}).addTo(map);
      }else accuracyCircle.setLatLng(ll).setRadius(c.accuracy);
    }else if(accuracyCircle){
      map.removeLayer(accuracyCircle);accuracyCircle=null;
    }

    if(firstFix){
      firstFix=false;
      const here={lat:c.latitude,lng:c.longitude};
      if(distanceKm(here,KGD)<=100){
        map.setView(ll,Math.max(14,map.getZoom?.()||14),{animate:true});
      }
    }
  }

  function locationError(err,manual){
    const btn=button();
    btn?.classList.remove('located');
    if(!manual)return;
    let msg='Не удалось определить местоположение';
    if(err?.code===1)msg='Разрешите доступ к геопозиции в браузере';
    try{if(typeof toast==='function')toast(msg)}catch(_){ }
  }

  function startWatch(){
    if(watchId!==null||!navigator.geolocation)return;
    try{
      watchId=navigator.geolocation.watchPosition(updatePosition,()=>{},
        {enableHighAccuracy:true,maximumAge:15000,timeout:12000});
    }catch(_){ }
  }

  function requestLocation(manual=false){
    if(!navigator.geolocation){
      locationError(null,manual);return;
    }
    navigator.geolocation.getCurrentPosition(pos=>{
      updatePosition(pos);
      startWatch();
    },err=>locationError(err,manual),{enableHighAccuracy:true,maximumAge:30000,timeout:10000});
  }

  function boot(){
    let tries=0;
    const wait=()=>{
      tries++;
      button();
      if(!mapReady()){
        if(tries<160)setTimeout(wait,50);
        return;
      }
      requestLocation(false);
      document.addEventListener('click',e=>{
        if(e.target.closest('.nav [data-s]'))setTimeout(syncButtonVisibility,0);
      });
      window.addEventListener('pageshow',syncButtonVisibility);
    };
    wait();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
