// ПарГид × n8n Chat — отдельная вкладка после Избранного. v24
(function(){
  if(window.__pargidN8nChatTabV24)return;
  window.__pargidN8nChatTabV24=true;

  const WEBHOOK='https://n8n.xn----8sbalgvaeklgsbf4b.xn--p1ai/webhook/bf0fcba1-353d-4010-b8e5-199abb99a338/chat';
  let chatInitPromise=null;

  const chatIcon=()=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.2 5.5h13.6c1 0 1.7.8 1.7 1.7v8.1c0 1-.8 1.7-1.7 1.7H10l-4.7 3v-3H5.2c-1 0-1.7-.8-1.7-1.7V7.2c0-1 .8-1.7 1.7-1.7Z"/><path d="M8 10h8M8 13h5"/></svg>`;

  function ensureStyles(){
    if(!document.querySelector('link[data-pargid-n8n-chat-css]')){
      const link=document.createElement('link');
      link.rel='stylesheet';
      link.href='https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
      link.dataset.pargidN8nChatCss='1';
      document.head.appendChild(link);
    }
    if(document.getElementById('pargid-chat-tab-style'))return;
    const style=document.createElement('style');
    style.id='pargid-chat-tab-style';
    style.textContent=`
      .nav{grid-template-columns:repeat(4,1fr)!important}
      .nav [data-s="chat"]{display:grid;place-items:center;line-height:1;color:#8e9a94}
      .nav [data-s="chat"] svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
      .nav [data-s="chat"].on{color:#ffd37f}
      #pargid-chat{padding:0 0 72px!important;overflow:hidden!important;background:#0b100f!important}
      #pargid-chat-host{width:100%;height:100%;min-height:0;position:relative;
        --chat--color-primary:#f2a93b;
        --chat--color-primary-shade-50:#d99128;
        --chat--color-primary-shade-100:#b9781f;
        --chat--color-secondary:#7bd6a1;
        --chat--color-white:#f4f7f5;
        --chat--color-light:#18221e;
        --chat--color-light-shade-50:#202c27;
        --chat--color-light-shade-100:#28362f;
        --chat--color-medium:#a9b5af;
        --chat--color-dark:#0b100f;
        --chat--message--bot--background:#18221e;
        --chat--message--bot--color:#f4f7f5;
        --chat--message--user--background:#f2a93b;
        --chat--message--user--color:#271908;
        --chat--window--width:100%;
        --chat--window--height:100%;
      }
      #pargid-chat-host .chat-layout,
      #pargid-chat-host .chat-wrapper,
      #pargid-chat-host .chat-window{width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;border-radius:0!important}
      #pargid-chat-host .chat-header{border-radius:0!important}
      #pargid-chat-error{padding:32px 20px;color:#d8e0dc;line-height:1.55;text-align:center}
      #pargid-chat-error b{display:block;color:#ffd37f;margin-bottom:8px}
    `;
    document.head.appendChild(style);
  }

  function ensureUi(){
    const app=document.getElementById('app');
    const nav=document.querySelector('.nav');
    if(!app||!nav)return false;
    ensureStyles();

    let section=document.getElementById('pargid-chat');
    if(!section){
      section=document.createElement('section');
      section.className='screen';
      section.id='pargid-chat';
      section.innerHTML='<div id="pargid-chat-host"></div>';
      nav.insertAdjacentElement('beforebegin',section);
    }

    let button=nav.querySelector('[data-s="chat"]');
    if(!button){
      button=document.createElement('button');
      button.type='button';
      button.dataset.s='chat';
      button.innerHTML=chatIcon();
      button.setAttribute('aria-label','Чат');
      const fav=nav.querySelector('[data-s="favorites"]');
      if(fav)fav.insertAdjacentElement('afterend',button);else nav.appendChild(button);
      button.addEventListener('click',showChat);
    }
    return true;
  }

  function hideChat(){
    document.getElementById('pargid-chat')?.classList.remove('on');
  }

  function showChat(){
    if(!ensureUi())return;
    document.getElementById('catalog')?.classList.remove('on');
    document.getElementById('requests')?.classList.remove('on');
    document.getElementById('favorites')?.classList.remove('on');
    document.getElementById('detail')?.classList.remove('on');
    document.getElementById('bookModal')?.classList.remove('on');
    document.getElementById('pargid-chat')?.classList.add('on');

    const mapEl=document.getElementById('map');
    const top=document.getElementById('mapTop');
    const cards=document.getElementById('cards');
    if(mapEl)mapEl.style.display='none';
    if(top)top.style.display='none';
    if(cards){cards.classList.add('screen-hidden');cards.style.display='none'}
    document.querySelectorAll('.nav button[data-s]').forEach(b=>b.classList.toggle('on',b.dataset.s==='chat'));
    window.PARGID_FAVORITES_MODE=false;
    initChat();
  }

  function initChat(){
    if(chatInitPromise)return chatInitPromise;
    const host=document.getElementById('pargid-chat-host');
    if(!host)return Promise.resolve();
    host.innerHTML='<div id="pargid-chat-error">Подключаем помощника…</div>';
    chatInitPromise=import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
      .then(({createChat})=>{
        host.innerHTML='';
        createChat({
          webhookUrl:WEBHOOK,
          target:'#pargid-chat-host',
          mode:'fullscreen',
          showWelcomeScreen:false,
          loadPreviousSession:true,
          defaultLanguage:'ru',
          initialMessages:[
            'Привет! 👋',
            'Я помощник ПарГида. Могу помочь подобрать баню или сауну.'
          ],
          i18n:{
            ru:{
              title:'Чат ПарГида',
              subtitle:'Подбор бань и саун',
              footer:'',
              getStarted:'Новый диалог',
              inputPlaceholder:'Напишите, что ищете…',
              closeButtonTooltip:'Закрыть чат'
            }
          },
          metadata:{source:'pargid-github-pages',surface:'chat-tab'}
        });
      })
      .catch(err=>{
        console.error('ParGid n8n chat loading error',err);
        host.innerHTML='<div id="pargid-chat-error"><b>Чат пока не подключился</b>Проверьте доступность webhook и Allowed Origins в n8n, затем обновите страницу.</div>';
        chatInitPromise=null;
      });
    return chatInitPromise;
  }

  function patchScreen(){
    try{
      if(typeof screen!=='function'||screen.__pargidChatPatched)return false;
      const original=screen;
      const wrapped=function(s){
        if(s==='chat')return showChat();
        hideChat();
        return original(s);
      };
      wrapped.__pargidChatPatched=true;
      screen=wrapped;
      return true;
    }catch(_){return false}
  }

  function attachFallbackNavGuard(){
    document.addEventListener('click',e=>{
      const button=e.target.closest('.nav button[data-s]');
      if(!button)return;
      if(button.dataset.s==='chat')return;
      hideChat();
    },true);
  }

  function boot(){
    let tries=0;
    const wait=()=>{
      tries++;
      if(!ensureUi()){
        if(tries<120)setTimeout(wait,50);
        return;
      }
      patchScreen();
      attachFallbackNavGuard();
    };
    wait();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
