// Пар-Гид branding. v27
(function(){
  if(window.__pargidBrandV27)return;
  window.__pargidBrandV27=true;

  document.title='Пар-Гид — бани и сауны Калининграда';

  function replaceBrand(root=document.body){
    if(!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{
      if(node.nodeValue&&node.nodeValue.includes('ПарГид')){
        node.nodeValue=node.nodeValue.replaceAll('ПарГид','Пар-Гид');
      }
      if(node.nodeValue&&node.nodeValue.includes('ПарГида')){
        node.nodeValue=node.nodeValue.replaceAll('ПарГида','Пар-Гида');
      }
    });
  }

  replaceBrand();
  new MutationObserver(()=>replaceBrand()).observe(document.body,{childList:true,subtree:true});
})();
