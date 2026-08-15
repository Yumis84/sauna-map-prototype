// ПарГид × n8n Chat — тестовый popup-чат. v23
(function(){
  if(window.__pargidN8nChatV23)return;
  window.__pargidN8nChatV23=true;

  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href='https://cdn.jsdelivr.net/npm/@n8n/chat/dist/style.css';
  document.head.appendChild(style);

  const localStyle=document.createElement('style');
  localStyle.textContent=`
    #n8n-chat{
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
      --chat--window--width:min(390px,calc(100vw - 20px));
      --chat--window--height:min(650px,calc(100vh - 96px));
      position:relative;
      z-index:2200;
    }
    #n8n-chat .chat-window-wrapper,
    #n8n-chat .chat-window,
    #n8n-chat .chat-toggle{z-index:2200!important}
    @media(max-width:520px){
      #n8n-chat{--chat--window--width:calc(100vw - 16px);--chat--window--height:calc(100vh - 92px)}
    }
  `;
  document.head.appendChild(localStyle);

  const host=document.createElement('div');
  host.id='n8n-chat';
  document.body.appendChild(host);

  import('https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js')
    .then(({createChat})=>{
      createChat({
        webhookUrl:'https://n8n.xn----8sbalgvaeklgsbf4b.xn--p1ai/webhook/bf0fcba1-353d-4010-b8e5-199abb99a338/chat',
        target:'#n8n-chat',
        mode:'window',
        showWelcomeScreen:false,
        loadPreviousSession:true,
        defaultLanguage:'ru',
        initialMessages:[
          'Привет! 👋',
          'Я тестовый помощник ПарГида. Напиши сообщение — проверим связь с n8n.'
        ],
        i18n:{
          ru:{
            title:'Чат ПарГида',
            subtitle:'Тест связи с n8n',
            footer:'',
            getStarted:'Новый диалог',
            inputPlaceholder:'Напишите сообщение…',
            closeButtonTooltip:'Закрыть чат'
          }
        },
        metadata:{source:'pargid-github-pages'}
      });
    })
    .catch(err=>console.error('ParGid n8n chat loading error',err));
})();
