document.querySelectorAll('.services-menu').forEach(menu=>{
 const trigger=menu.querySelector('summary'),popup=menu.querySelector('.services-popup');
 const hover=matchMedia('(hover: hover) and (pointer: fine)');
 const tolerance=28,closeDelay=240;
 let timer=null,pointer=null,keyboardNavigation=false;
 const cancelClose=()=>{clearTimeout(timer);timer=null;};
 const close=()=>{cancelClose();menu.open=false;};
 function nearRect(point,rect){
  const dx=Math.max(rect.left-point.x,0,point.x-rect.right),dy=Math.max(rect.top-point.y,0,point.y-rect.bottom);
  return Math.hypot(dx,dy)<=tolerance;
 }
 function nearMenu(){
  if(!pointer||!menu.open)return false;
  const a=trigger.getBoundingClientRect(),b=popup.getBoundingClientRect();
  if(nearRect(pointer,a)||nearRect(pointer,b))return true;
  return pointer.y>=a.bottom&&pointer.y<=b.top&&pointer.x>=Math.min(a.left,b.left)-tolerance&&pointer.x<=Math.max(a.right,b.right)+tolerance;
 }
 function checkPosition(){
  if(!menu.open)return;
  if(nearMenu()||(keyboardNavigation&&menu.contains(document.activeElement))){cancelClose();return;}
  if(timer===null)timer=setTimeout(()=>{
   timer=null;
   if(!nearMenu()&&!(keyboardNavigation&&menu.contains(document.activeElement)))close();
  },closeDelay);
 }
 menu.addEventListener('pointerenter',event=>{
  if(!hover.matches||event.pointerType==='touch')return;
  pointer={x:event.clientX,y:event.clientY};keyboardNavigation=false;cancelClose();menu.open=true;
 });
 menu.addEventListener('pointerleave',event=>{
  if(!hover.matches||event.pointerType==='touch')return;
  pointer={x:event.clientX,y:event.clientY};checkPosition();
 });
 document.addEventListener('pointermove',event=>{
  if(!hover.matches||event.pointerType==='touch')return;
  pointer={x:event.clientX,y:event.clientY};keyboardNavigation=false;checkPosition();
 },{passive:true});
 document.addEventListener('keydown',event=>{if(event.key==='Tab')keyboardNavigation=true;});
 menu.addEventListener('keydown',event=>{
  keyboardNavigation=true;
  if(event.key==='Escape'){event.preventDefault();close();trigger.focus();}
 });
 document.addEventListener('click',event=>{if(!menu.contains(event.target))close();});
 menu.addEventListener('focusout',event=>{
  if(!menu.contains(event.relatedTarget)){if(keyboardNavigation)close();else checkPosition();}
 });
 menu.addEventListener('toggle',()=>{if(!menu.open)cancelClose();});
 document.documentElement.addEventListener('pointerleave',()=>{pointer=null;checkPosition();});
 window.addEventListener('blur',close);
 window.addEventListener('resize',()=>{if(menu.open)checkPosition();},{passive:true});
});
