/* eslint-disable */
import { Audio } from '../engine/audio';
import { State, game } from '../game';
import { dialogue } from '../engine/dialogue';
import { healParty, startBattle } from '../engine/battle';
import { makeMon } from '../data/dex';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: mirage

// ====== MIRAGE ISLAND cinematic sprites ======
// Originally base64-embedded; now loaded from public/sprites/ as real PNGs.
const _MI_URL = (name: string): string => `${import.meta.env.BASE_URL}sprites/${name}.png`;
const _MI: Record<string, HTMLImageElement> = {};
{
  const s: Record<string, string> = {
    ray: _MI_URL('rayquaza'),
    gro: _MI_URL('groudon'),
    kyo: _MI_URL('kyogre'),
    bren: _MI_URL('brendan'),
    stev: _MI_URL('steven'),
  };
  for (const k in s) {
    const im = new Image();
    im.src = s[k];
    _MI[k] = im;
  }
}

export function startMirageIslandCutscene(){
  game.state=State.DIALOGUE;
  dialogue([
    "The ground shudders. A deep\nrumble builds from below.",
    "Waves split apart on both\nsides of the island.",
    "GROUDON and KYOGRE surface.\nThey face you in silence.",
    "...Then they bow."
  ], ()=>{
    launchMirageCinematic(()=>{
      dialogue([
        "A gold-green streak cuts\nthrough the sky above.",
        "RAYQUAZA acknowledges you\nand banks west into cloud.",
        "STEVEN: That happens once\nin a lifetime.",
        "STEVEN: Both of them want\nto battle one final time.",
        "STEVEN: They're not angry.\nThey want to see what\nyou've got."
      ], ()=>{
        healParty(); Audio.heal();
        dialogue([
          "Your POKEMON were healed\nby the island's power.",
          "GROUDON watches you.\nIt wants to battle."
        ], ()=>startMirageGroudonBattle());
      });
    });
  });
}

export function startMirageGroudonBattle(){
  const g=makeMon(383,75);
  g.atk=Math.round(g.atk*1.25);g.def=Math.round(g.def*1.2);
  g.spc=Math.round(g.spc*1.2);g.spe=Math.round(g.spe*1.1);
  g.maxHp=Math.round(g.maxHp*1.15);g.hp=g.maxHp;
  startBattle(g,false);
  game.battle!.isMirageGroudon=true;
  game.battle!.noCatchMsg="GROUDON chose this freely.\nA BALL would be an insult.";
}

export function startMirageKyogreBattle(){
  const k=makeMon(382,75);
  k.atk=Math.round(k.atk*1.25);k.def=Math.round(k.def*1.2);
  k.spc=Math.round(k.spc*1.3);k.spe=Math.round(k.spe*1.15);
  k.maxHp=Math.round(k.maxHp*1.15);k.hp=k.maxHp;
  startBattle(k,false);
  game.battle!.isMirageKyogre=true;
  game.battle!.noCatchMsg="KYOGRE will not be held.\nThis is its own choice.";
}

export function launchMirageCinematic(onDone){
  let ov=document.getElementById('_mi_ov') as HTMLElement;
  if(!ov){
    ov=document.createElement('div');
    ov.id='_mi_ov';
    Object.assign(ov.style,{position:'fixed',inset:'0',zIndex:'9999',background:'#000',display:'none',alignItems:'center',justifyContent:'center'});
    const mc=document.createElement('canvas');
    mc.id='_mi_cv';
    mc.style.cssText='display:block;max-width:100vw;max-height:100vh;';
    ov.appendChild(mc);
    document.body.appendChild(ov);
  }
  const mc=document.getElementById('_mi_cv') as HTMLCanvasElement;
  mc.width=window.innerWidth;mc.height=window.innerHeight;
  const c=mc.getContext('2d')!;
  ov.style.display='flex';
  let t=0,lTs:number|null=null,ph='rise',phT=0,done=false;
  const RISE=4.5,CALM=3.0,RAY=3.5;
  const pts:any[]=[],shown=new Set<number>();
  let subTxt='',subT=0;
  const subs=[{t:0.8,s:"The sea opens..."},{t:2.2,s:"GROUDON rises from the left."},{t:3.4,s:"KYOGRE rises from the right."},{t:4.9,s:"They bow."},{t:6.0,s:"A gold streak cuts the sky."},{t:7.1,s:"RAYQUAZA acknowledges you."}];
  function drSub(){
    if(!subTxt||subT<=0) return;
    const W=mc.width,H=mc.height;
    c.save();c.fillStyle='rgba(0,0,0,0.82)';c.fillRect(W*0.08,H-80,W*0.84,44);
    c.strokeStyle='rgba(255,255,255,0.15)';c.lineWidth=1;c.strokeRect(W*0.08,H-80,W*0.84,44);
    c.fillStyle='#fff';c.font=Math.max(9,Math.min(14,W/44))+"px 'Press Start 2P',monospace";c.textAlign='center';
    c.fillText(subTxt,W/2,H-50);c.restore();
  }
  function spr(k,cx,cy,tw,th,gl,al,flip,by){
    const img=_MI[k];if(!img||!img.complete||!img.naturalWidth) return;
    const sc=Math.min(tw/img.width,th/img.height),dw=img.width*sc,dh=img.height*sc;
    c.save();c.translate(cx,cy+(by||0));if(flip)c.scale(-1,1);c.globalAlpha=al||1;
    if(gl){c.shadowColor=gl;c.shadowBlur=30;}c.drawImage(img,-dw/2,-dh/2,dw,dh);c.restore();
  }
  function aura(cx,cy,rw,rh,r,g,b,a){
    const ag=c.createRadialGradient(cx,cy,5,cx,cy,Math.max(rw,rh));
    ag.addColorStop(0,`rgba(${r},${g},${b},${a*0.4})`);ag.addColorStop(.5,`rgba(${r},${g},${b},${a*0.2})`);ag.addColorStop(1,'rgba(0,0,0,0)');
    c.fillStyle=ag;c.beginPath();c.ellipse(cx,cy,rw,rh,0,0,Math.PI*2);c.fill();
  }
  function frame(ts){
    if(done) return;
    if(!lTs) lTs=ts;
    const dt=Math.min((ts-lTs!)/1000,.05);lTs=ts;t+=dt;phT+=dt;
    for(const s of subs){if(t>=s.t&&!shown.has(s.t)){shown.add(s.t);subTxt=s.s;subT=2.8;}}
    subT=Math.max(0,subT-dt);if(subT<=0) subTxt='';
    for(let i=pts.length-1;i>=0;i--){const p=pts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=15*dt;p.l-=dt;if(p.l<=0)pts.splice(i,1);}
    if(ph==='rise'&&phT>=RISE){ph='calm';phT=0;}
    else if(ph==='calm'&&phT>=CALM){ph='ray';phT=0;}
    else if(ph==='ray'&&phT>=RAY){done=true;ov.style.display='none';if(onDone)onDone();return;}
    if(ph==='rise'&&Math.random()<0.2){
      pts.push({x:mc.width*.2+Math.random()*60,y:mc.height*.55,vx:(Math.random()-.5)*90,vy:-Math.random()*70-25,l:.7,col:`hsl(${20+Math.random()*25|0},100%,60%)`});
      pts.push({x:mc.width*.78+Math.random()*50,y:mc.height*.52,vx:(Math.random()-.5)*90,vy:-Math.random()*70-25,l:.7,col:`hsl(${205+Math.random()*20|0},100%,65%)`});
    }
    const W=mc.width,H=mc.height;
    const ri=ph==='rise'?.45+.35*Math.sin(t*.6):.12;
    const bg=c.createLinearGradient(0,0,W,H*.75);
    bg.addColorStop(0,`rgb(${7+22*ri|0},${3+7*ri|0},16)`);bg.addColorStop(.5,`rgb(4,${9+11*ri|0},${38+13*(1-ri)|0})`);bg.addColorStop(1,'rgb(2,4,12)');
    c.fillStyle=bg;c.fillRect(0,0,W,H);
    const gy=H*.66;c.fillStyle='#071019';c.fillRect(0,gy,W,H-gy);
    c.save();c.globalAlpha=.25;
    for(let w=0;w<3;w++){c.beginPath();c.moveTo(0,H);for(let x=0;x<=W;x+=14)c.lineTo(x,gy+13+Math.sin(t*1.2+x*.04+w*.7)*8+w*10);c.lineTo(W,H);c.closePath();const wg=c.createLinearGradient(0,gy,0,H);wg.addColorStop(0,`rgba(0,65,180,${.48-w*.11})`);wg.addColorStop(1,'rgba(0,12,45,.04)');c.fillStyle=wg;c.fill();}
    c.restore();
    for(let i=0;i<4;i++){const lx=W*(.04+i*.06),pg=.5+.5*Math.sin(t*2+i);const lg=c.createLinearGradient(lx,gy,lx,H);lg.addColorStop(0,`rgba(255,85,0,${.82*pg})`);lg.addColorStop(.4,`rgba(130,32,0,${.22*pg})`);lg.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=lg;c.fillRect(lx-2,gy,4,H-gy);}
    const gR=ph==='rise'?Math.min(1,phT/2):1,gY=H*.52+H*.27*(1-gR),gB=ph!=='rise'?Math.sin(t*.65)*6:0,gG=.5+.5*Math.sin(t*1.8);
    aura(W*.22,gY,W*.17,H*.22,220,80,10,gG*gR);spr('gro',W*.22,gY,Math.min(W*.34,400),Math.min(H*.5,351),`rgba(255,80,0,${gG*.8})`,gR,false,gB);
    const kR=ph==='rise'?Math.min(1,Math.max(0,(phT-.5)/2)):1,kY=H*.49+H*.27*(1-kR),kB=ph!=='rise'?Math.sin(t*.9+1.2)*8:0,kG=.5+.5*Math.sin(t*1.3+2);
    aura(W*.76,kY,W*.18,H*.21,0,100,220,kG*kR);spr('kyo',W*.76,kY,Math.min(W*.35,400),Math.min(H*.4,218),`rgba(0,115,255,${kG*.8})`,kR,false,kB);
    if(ph==='ray'){const rIn=Math.min(1,phT/1.4),rB=Math.sin(t*.5)*10,rG=.6+.4*Math.sin(t*2);aura(W*.5,H*.22,W*.15,H*.2,0,210,160,rG*rIn);spr('ray',W*.5,H*.22,Math.min(W*.30,360),Math.min(H*.38,380),`rgba(0,255,175,${rG*.9})`,rIn,false,rB);}
    const fY=H*.81;
    const bH=Math.min(H*.30,185),bW=bH*(85/219);
    spr('bren',W*.09,fY,bW,bH,'',1,false,0);c.fillStyle='rgba(0,0,0,.65)';c.fillRect(W*.09-bW*1.3,fY+bH*.43,bW*2.6,bH*.7);
    c.fillStyle='#160e04';c.beginPath();c.ellipse(W*.09,fY+bH*.43,bW*1.1,bH*.17,0,0,Math.PI*2);c.fill();
    const sH=Math.min(H*.32,195),sW=sH*(119/220);
    spr('stev',W*.91,fY,sW,sH,'',1,true,0);c.fillStyle='rgba(0,0,0,.65)';c.fillRect(W*.91-sW*1.4,fY+sH*.43,sW*2.8,sH*.7);
    c.fillStyle='#160e04';c.beginPath();c.ellipse(W*.91,fY+sH*.43,sW*1.1,sH*.17,0,0,Math.PI*2);c.fill();
    pts.forEach(p=>{const a=Math.max(0,p.l);c.save();c.globalAlpha=a;c.fillStyle=p.col;c.shadowColor=p.col;c.shadowBlur=10;c.beginPath();c.arc(p.x,p.y,3,0,Math.PI*2);c.fill();c.restore();});
    const vg=c.createRadialGradient(W/2,H/2,H*.14,W/2,H/2,H*.8);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(.6,'rgba(0,0,0,.04)');vg.addColorStop(1,'rgba(0,0,0,.88)');c.fillStyle=vg;c.fillRect(0,0,W,H);
    c.save();c.fillStyle='rgba(255,255,255,.2)';c.font='8px monospace';c.textAlign='right';c.fillText('[Z/tap skip]',W-8,14);c.restore();
    drSub();
    requestAnimationFrame(frame);
  }
  function skip(){if(!done){done=true;ov.style.display='none';if(onDone)onDone();}}
  const sk=e=>{if(e.code==='KeyZ'||e.code==='Space'){skip();window.removeEventListener('keydown',sk);}};
  window.addEventListener('keydown',sk);
  mc.addEventListener('pointerdown',skip,{once:true});
  requestAnimationFrame(frame);
}


