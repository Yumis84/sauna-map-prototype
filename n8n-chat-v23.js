// ПарГид × n8n Chat — отдельная вкладка после Избранного. v25
(function(){
  if(window.__pargidN8nChatTabV25)return;
  window.__pargidN8nChatTabV25=true;

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

      #pargid-chat{
        padding:0 0 72px!important;
        overflow:hidden!important;
        background:#0b100f!important;
      }

      #pargid-chat-host{
        width:100%;height:100%;min-height:0;position:relative;
        font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;

        --chat--color-primary:#f2a93b;
        --chat--color-primary-shade-50:#d99128;
        --chat--color-primary-shade-100:#b9781f;
        --chat--color-secondary:#7bd6a1;
        --chat--color-secondary-shade-50:#57bb81;
        --chat--color-white:#f4f7f5;
        --chat--color-light:#18221e;
        --chat--color-light-shade-50:#202c27;
        --chat--color-light-shade-100:#28362f;
        --chat--color-medium:#84918b;
        --chat--color-dark:#0b100f;
        --chat--color-disabled:#66726c;
        --chat--color-typing:#a9b5af;

        --chat--spacing:1rem;
        --chat--border-radius:16px;
        --chat--transition-duration:.16s;
        --chat--font-family:system-ui,-apple-system,Segoe UI,Arial,sans-serif;

        --chat--window--width:100%;
        --chat--window--height:100%;
        --chat--window--border:none;
        --chat--window--border-radius:0;
        --chat--window--box-shadow:none;

        --chat--header-height:auto;
        --chat--header--padding:18px 16px 14px;
        --chat--header--background:#111815;
        --chat--header--color:#f4f7f5;
        --chat--header--border-top:none;
        --chat--header--border-bottom:1px solid #28362f;
        --chat--heading--font-size:1.3rem;
        --chat--subtitle--font-size:.82rem;
        --chat--subtitle--line-height:1.35;

        --chat--body--background:#0b100f;
        --chat--footer--background:#0d1311;
        --chat--footer--color:#a9b5af;

        --chat--messages-list--padding:16px 12px 22px;
        --chat--message--font-size:.96rem;
        --chat--message--padding:11px 13px;
        --chat--message--border-radius:16px;
        --chat--message-line-height:1.48;
        --chat--message--margin-bottom:9px;
        --chat--message--bot--background:#18221e;
        --chat--message--bot--color:#f4f7f5;
        --chat--message--bot--border:1px solid #26332d;
        --chat--message--user--background:#f2a93b;
        --chat--message--user--color:#271908;
        --chat--message--user--border:1px solid #f6bb62;
        --chat--message--pre--background:#0d1311;

        --chat--textarea--height:50px;
        --chat--textarea--max-height:150px;
        --chat--input--font-size:1rem;
        --chat--input--padding:12px 13px;
        --chat--input--background:#111815;
        --chat--input--line-height:1.4;
        --chat--input--border:1px solid #28362f;
        --chat--input--border-active:1px solid #f2a93b;
        --chat--input--placeholder--font-size:.95rem;
        --chat--input--send--button--background:#f2a93b;
        --chat--input--send--button--color:#271908;
        --chat--input--send--button--background-hover:#d99128;
        --chat--input--send--button--color-hover:#271908;

        --chat--button--color:#271908;
        --chat--button--background:#f2a93b;
        --chat--button--padding:10px 14px;
        --chat--button--border-radius:14px;
        --chat--button--hover--background:#d99128;
      }

      #pargid-chat-host .chat-layout,
      #pargid-chat-host .chat-wrapper,
      #pargid-chat-host .chat-window{
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        max-height:none!important;
        border:0!important;
        border-radius:0!important;
        box-shadow:none!important;
        background:#0b100f!important;
      }

      #pargid-chat-host .chat-header{
        border-radius:0!important;
        background:linear-gradient(180deg,#141d19 0%,#111815 100%)!important;
        box-shadow:0 10px 28px #0004;
      }
      #pargid-chat-host .chat-header h1,
      #pargid-chat-host .chat-header .heading{
        color:#ffd37f!important;
        font-weight:850!important;
        letter-spacing:-.02em;
      }
      #pargid-chat-host .chat-header p,
      #pargid-chat-host .chat-header .subtitle{
        color:#a9b5af!important;
      }

      #pargid-chat-host .chat-body,
      #pargid-chat-host .chat-messages-list{
        background:#0b100f!important;
      }

      #pargid-chat-host .chat-message{
        box-shadow:0 7px 22px #0002;
        max-width:86%;
      }

      #pargid-chat-host .chat-message.chat-message-from-user,
      #pargid-chat-host .chat-message.user{
        box-shadow:0 7px 22px #f2a93b18;
      }

      #pargid-chat-host .chat-input,
      #pargid-chat-host .chat-inputs,
      #pargid-chat-host .chat-footer{
        background:#0d1311!important;
        border-top:1px solid #202c27!important;
      }

      #pargid-chat-host textarea{
        color:#f4f7f5!important;
        caret-color:#f2a93b!important;
        background:#111815!important;
        border-radius:15px!important;
      }
      #pargid-chat-host textarea::placeholder{color:#75817b!important}

      #pargid-chat-host button:hover{filter:brightness(1.04)}
      #pargid-chat-host a{color:#9ee4b8!important}

      #pargid-chat-error{
        margin:18px 12px;
        padding:22px 18px;
        border:1px solid #28362f;
        border-radius:18px;
        background:#111815;
        color:#d8e0dc;
        line-height:1.55;
        text-align:center;
      }
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
              title:'ПарГид',
              subtitle:'Помощник по баням и саунам',
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
