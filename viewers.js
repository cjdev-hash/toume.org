document.querySelectorAll('.original-viewer-frame').forEach(frame=>{
 let observer=null,previousWidth=0;
 function resize(){
  const doc=frame.contentDocument;if(!doc?.body)return;
  const height=Math.ceil(Math.max(doc.body.scrollHeight,doc.documentElement.scrollHeight));
  if(Math.abs(frame.getBoundingClientRect().height-height)>1)frame.style.height=height+'px';
 }
 function connect(){
  observer?.disconnect();const doc=frame.contentDocument;if(!doc?.body)return;
  frame.style.height='1px';resize();
  observer=new ResizeObserver(resize);observer.observe(doc.body);
 }
 frame.addEventListener('load',connect);
 if(frame.contentDocument?.readyState==='complete')connect();
 new ResizeObserver(entries=>{
  const width=entries[0].contentRect.width;
  if(Math.abs(width-previousWidth)<1)return;previousWidth=width;
  frame.style.height='1px';requestAnimationFrame(resize);
 }).observe(frame);
});
