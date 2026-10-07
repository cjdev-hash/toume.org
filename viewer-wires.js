(()=>{
 function boundary(rect,target,ellipse=false,radius=0){
  const cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,dx=target.x-cx,dy=target.y-cy;
  if(!dx&&!dy)return {x:cx,y:cy};
  const hw=rect.width/2,hh=rect.height/2;
  if(ellipse){const t=1/Math.sqrt(dx*dx/(hw*hw)+dy*dy/(hh*hh));return {x:cx+dx*t,y:cy+dy*t};}
  const r=Math.min(radius,hw,hh),length=Math.hypot(dx,dy),ux=dx/length,uy=dy/length;
  let lo=0,hi=Math.hypot(hw,hh)+1;
  for(let i=0;i<40;i++){const distance=(lo+hi)/2,qx=Math.abs(ux*distance)-(hw-r),qy=Math.abs(uy*distance)-(hh-r);const signed=Math.hypot(Math.max(qx,0),Math.max(qy,0))+Math.min(Math.max(qx,qy),0)-r;if(signed<=0)lo=distance;else hi=distance;}
  return {x:cx+ux*lo,y:cy+uy*lo};
 }
 const root=document.querySelector('.viewer');if(!root)return;
 const kind=root.querySelector('#wires')?'workflow':root.querySelector('.flow')?'automation':root.querySelector('.scene')?'mapping':null;
 if(!kind)return;
 const automation=[['.n-input','.n-understand'],['.n-understand','.n-decision'],['.n-decision','.n-output'],['.n-decision','.n-monitor'],['.n-understand','.n-human'],['.n-human','.n-monitor']];
 const mapping=[['.c1','.c2'],['.c2','.c3'],['.c4','.c5'],['.c5','.c6'],['.c7','.c5'],['.c8','.c5'],['.c2','.c5'],['.c5','.c3'],['.c5','.c7']];
 function update(){
  root.querySelectorAll('svg').forEach(svg=>{
   const scope=kind==='mapping'?svg.parentElement:root;
   const pairs=kind==='workflow'?links.map(([a,b])=>[`[data-id="${a}"]`,`[data-id="${b}"]`]):kind==='automation'?automation:mapping;
   const bounds=svg.getBoundingClientRect();if(!bounds.width||!bounds.height)return;
   const vb=svg.viewBox.baseVal,scaleX=vb.width? vb.width/bounds.width:1,scaleY=vb.height?vb.height/bounds.height:1;
   [...svg.querySelectorAll('path')].forEach((path,i)=>{
    const pair=pairs[i];if(!pair)return;
    const a=scope.querySelector(pair[0]),b=scope.querySelector(pair[1]);if(!a||!b)return;
    const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect();
    const ac={x:ar.left+ar.width/2,y:ar.top+ar.height/2},bc={x:br.left+br.width/2,y:br.top+br.height/2};
    const sa=getComputedStyle(a),sb=getComputedStyle(b);
    const ellipseA=sa.borderTopLeftRadius.includes('%'),ellipseB=sb.borderTopLeftRadius.includes('%');
    const start=boundary(ar,bc,ellipseA,parseFloat(sa.borderTopLeftRadius)||0),end=boundary(br,ac,ellipseB,parseFloat(sb.borderTopLeftRadius)||0);
    const x1=(start.x-bounds.left)*scaleX,y1=(start.y-bounds.top)*scaleY,x2=(end.x-bounds.left)*scaleX,y2=(end.y-bounds.top)*scaleY,mx=(x1+x2)/2;
    const d=`M${x1} ${y1} C${mx} ${y1},${mx} ${y2},${x2} ${y2}`;
    if(path.getAttribute('d')!==d)path.setAttribute('d',d);
    const motion=path.nextElementSibling?.querySelector('animateMotion');if(motion&&motion.getAttribute('path')!==d)motion.setAttribute('path',d);
   });
  });
 }
 let scheduled=false,until=0;
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;update();if(performance.now()<until)schedule();});}
 root.addEventListener('pointermove',schedule,{passive:true});
 root.addEventListener('pointerover',()=>{until=performance.now()+300;schedule();},{passive:true});
 root.addEventListener('pointerout',()=>{until=performance.now()+300;schedule();},{passive:true});
 root.addEventListener('transitionend',schedule);
 const resize=new ResizeObserver(schedule);resize.observe(root);root.querySelectorAll('.node,.card').forEach(n=>resize.observe(n));
 root.querySelectorAll('svg').forEach(svg=>new MutationObserver(schedule).observe(svg,{childList:true}));
 window.addEventListener('resize',schedule,{passive:true});update();schedule();
})();
