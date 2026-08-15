// ПарГид chat visual refinement: compact header + app-matched colors. v26
(function(){
  if(window.__pargidChatStyleV26)return;
  window.__pargidChatStyleV26=true;

  const style=document.createElement('style');
  style.id='pargid-chat-style-v26';
  style.textContent=`
    #pargid-chat-host{
      --chat--header-height:auto;
      --chat--header--padding:8px 14px 7px;
      --chat--header--background:#0d1311;
      --chat--header--color:#f4f7f5;
      --chat--header--border-bottom:1px solid #ffffff14;
      --chat--heading--font-size:1.05rem;
      --chat--subtitle--font-size:.72rem;
      --chat--subtitle--line-height:1.18;
    }

    #pargid-chat-host .chat-header{
      min-height:52px!important;
      padding:8px 14px 7px!important;
      background:#0d1311!important;
      border-bottom:1px solid #ffffff14!important;
      box-shadow:none!important;
    }

    #pargid-chat-host .chat-header h1,
    #pargid-chat-host .chat-header .heading{
      margin:0!important;
      color:#f4f7f5!important;
      font-size:1.05rem!important;
      line-height:1.12!important;
      font-weight:800!important;
      letter-spacing:-.015em!important;
    }

    #pargid-chat-host .chat-header p,
    #pargid-chat-host .chat-header .subtitle{
      margin:2px 0 0!important;
      color:#8e9a94!important;
      font-size:.72rem!important;
      line-height:1.18!important;
    }

    #pargid-chat-host .chat-header svg,
    #pargid-chat-host .chat-header button{
      color:#a9b5af!important;
    }

    #pargid-chat-host .chat-header button:hover{
      color:#ffd37f!important;
      background:#18221e!important;
    }
  `;
  document.head.appendChild(style);
})();
