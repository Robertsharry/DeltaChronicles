/* eslint-disable */
import { DEX } from '../data/dex';
import { CUSTOM_SPRITES, MEGA_SPR, OW_RAW } from '../data/sprites';
import { ctx } from '../core/canvas';
import { followerMon, game, tileAt } from '../game';
import { TILE, VIEW_H, VIEW_W } from '../core/constants';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: renderer
import megaMewtwoXUrl from '../assets/gen/mega_mewtwo_x.png';
import megaMewtwoYUrl from '../assets/gen/mega_mewtwo_y.png';
import titleImgUrl from '../assets/gen/title.jpg';
import oakImgUrl from '../assets/gen/oak.png';

export const SPRITE_BASE='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald/';

export const monImg={};

export const monCache={};

export function monSprite(id,size){
  const key=id+'@'+size;
  if(monCache[key]) return monCache[key];
  const c=document.createElement('canvas'); c.width=size; c.height=size;
  const g=c.getContext('2d')!;
  const d=DEX[id-1];
  const tints={Normal:'#b8b89a',Fire:'#f08030',Water:'#6890f0',Grass:'#78c850',
   Electric:'#f8d030',Ice:'#98d8d8',Fighting:'#c03028',Poison:'#a040a0',
   Ground:'#e0c068',Flying:'#a890f0',Psychic:'#f85888',Bug:'#a8b820',
   Rock:'#b8a038',Ghost:'#705898',Dragon:'#7038f8',
   Dark:'#705848',Steel:'#b8b8d0'};
  const col=tints[d[1]]||'#888';
  let s=(id*2654435761)>>>0;
  const rnd=()=>{ s=(s*1664525+1013904223)>>>0; return s/4294967296; };
  g.fillStyle=col;
  const u=size/16;
  // body
  g.beginPath();
  g.ellipse(size/2,size*0.62,size*0.30,size*0.30,0,0,7);
  g.fill();
  // head
  g.beginPath();
  g.ellipse(size/2,size*0.36,size*0.24,size*0.22,0,0,7);
  g.fill();
  // ears / appendages (deterministic per species)
  g.fillStyle=col;
  const ear=rnd();
  if(ear<0.4){
    g.beginPath(); g.moveTo(size*0.36,size*0.20); g.lineTo(size*0.30,size*0.04); g.lineTo(size*0.46,size*0.18); g.fill();
    g.beginPath(); g.moveTo(size*0.64,size*0.20); g.lineTo(size*0.70,size*0.04); g.lineTo(size*0.54,size*0.18); g.fill();
  } else if(ear<0.7){
    g.beginPath(); g.ellipse(size*0.30,size*0.18,u*1.3,u*1.6,0,0,7); g.fill();
    g.beginPath(); g.ellipse(size*0.70,size*0.18,u*1.3,u*1.6,0,0,7); g.fill();
  }
  // feet
  g.beginPath(); g.ellipse(size*0.40,size*0.90,u*1.6,u*1.1,0,0,7); g.fill();
  g.beginPath(); g.ellipse(size*0.60,size*0.90,u*1.6,u*1.1,0,0,7); g.fill();
  // belly highlight
  g.fillStyle='rgba(255,255,255,.22)';
  g.beginPath(); g.ellipse(size/2,size*0.66,size*0.16,size*0.18,0,0,7); g.fill();
  // eyes
  g.fillStyle='#1a1a1a';
  g.beginPath(); g.ellipse(size*0.42,size*0.35,u*0.9,u*1.1,0,0,7); g.fill();
  g.beginPath(); g.ellipse(size*0.58,size*0.35,u*0.9,u*1.1,0,0,7); g.fill();
  g.fillStyle='#fff';
  g.fillRect(size*0.40,size*0.31,u*0.5,u*0.5);
  g.fillRect(size*0.56,size*0.31,u*0.5,u*0.5);
  // outline
  g.strokeStyle='rgba(0,0,0,.35)'; g.lineWidth=Math.max(1,u*0.4);
  g.beginPath(); g.ellipse(size/2,size*0.62,size*0.30,size*0.30,0,0,7); g.stroke();
  monCache[key]=c; return c;
}

export const owImg={};            // cache: key `${nat}_${dir}` -> Image|null

export function getOWImage(nat,dir){
  // dir: 'down'|'up'|'left'|'right'. left = horizontally flipped right.
  const rec=OW_RAW[nat]; if(!rec) return null;
  const slot = dir==='up'?1 : (dir==='left'||dir==='right')?2 : 0;
  const b=rec[slot]; if(!b) { // fall back: up->down, side->down
    const fb=rec[0]; if(!fb) return null; return getOWImageData(nat+'_d', fb, false);
  }
  const flip = (dir==='left');
  return getOWImageData(nat+'_'+dir, b, flip);
}

export function getOWImageData(key,b64,flip){
  let e=owImg[key];
  if(e===undefined){
    const img=new Image();
    img.onload=()=>{
      if(!flip){ owImg[key]=img; return; }
      const c=document.createElement('canvas'); c.width=img.naturalWidth; c.height=img.naturalHeight;
      const g=c.getContext('2d')!; g.translate(c.width,0); g.scale(-1,1); g.drawImage(img,0,0);
      const fimg=new Image(); fimg.onload=()=>{owImg[key]=fimg;}; fimg.src=c.toDataURL();
      owImg[key]='pending';   // hold until flipped version ready
    };
    img.onerror=()=>{ owImg[key]=null; };
    img.src=b64;
    owImg[key]=null; return null;
  }
  if(e==='pending'||e===null) return null;
  if(e.complete && e.naturalWidth>0) return e;
  return null;
}

export function drawOW(nat,dir,x,y,size){
  const im=getOWImage(nat,dir); if(!im) return false;
  const sc=size/Math.max(im.naturalWidth,im.naturalHeight);
  const w=im.naturalWidth*sc, h=im.naturalHeight*sc;
  ctx.imageSmoothingEnabled=false;
  ctx.drawImage(im, Math.round(x+(size-w)/2), Math.round(y+(size-h)), w, h);
  return true;
}


export function getMonImage(id){
  let e=monImg[id];
  if(e===undefined){
    const img=new Image();
    img.onerror=()=>{ monImg[id]=null; };          // permanent fallback for this id
    img.src=CUSTOM_SPRITES[id] || (SPRITE_BASE+id+'.png');
    monImg[id]=img;
    return null;
  }
  if(e===null) return null;                         // failed -> procedural
  if(e.complete && e.naturalWidth>0) return e;      // ready
  return null;                                      // still loading
}

export const MEGA_MEWTWO_X=new Image(); MEGA_MEWTWO_X.src=megaMewtwoXUrl;

export const MEGA_MEWTWO_Y=new Image(); MEGA_MEWTWO_Y.src=megaMewtwoYUrl;

export const MEGA_IMG = {};
for(const k in MEGA_SPR){ const im=new Image(); im.src=MEGA_SPR[k]; MEGA_IMG[k]=im; }

export function drawBattler(mon,x,y,size){
  const im=mon.mega?(mon.megaImg||MEGA_IMG[mon.id]):null;
  if(im && im.complete && im.naturalWidth>0){
    const iw=im.naturalWidth, ih=im.naturalHeight;
    const sc=Math.min(size/iw,size/ih), w=iw*sc, h=ih*sc;
    ctx.drawImage(im, x+(size-w)/2, y+(size-h), w, h);
  } else drawMon(mon.id,x,y,size);
}

export function drawMon(id,x,y,size){
  const im=getMonImage(id);
  if(im){
    // fit within the size box preserving aspect ratio; anchor bottom-center
    const iw=im.naturalWidth||size, ih=im.naturalHeight||size;
    const scale=Math.min(size/iw, size/ih);
    const w=iw*scale, h=ih*scale;
    const dx=x+(size-w)/2;        // horizontally centered
    const dy=y+(size-h);          // sit on the bottom edge
    ctx.drawImage(im,dx,dy,w,h);
  } else {
    ctx.drawImage(monSprite(id,size),x,y);
  }
}

export function preloadMons(ids){ for(const id of ids) if(id) getMonImage(id); }

/* player / NPC sprite — 4 dirs, drawn procedurally */

const _actorMods = import.meta.glob('../assets/gen/actor/*', { eager: true, query: '?url', import: 'default' });
export const SPR_SRC: Record<string, string> = {};
for (const [_p, _u] of Object.entries(_actorMods)) { const _m = _p.match(/([^/]+)\.[a-z0-9]+$/); if (_m) SPR_SRC[_m[1]] = _u as string; }

// Load every sprite once; ACTOR_IMG[k] is an <img> (may still be loading).

export const ACTOR_IMG={};
for(const k in SPR_SRC){ const im=new Image(); im.src=SPR_SRC[k]; ACTOR_IMG[k]=im; }

export function _rdy(im){ return im && im.complete && im.naturalWidth>0; }

// Dedicated Professor Oak sprite (uploaded RG battle sprite, 29x56, white keyed out).

export const OAK_IMG=new Image();
OAK_IMG.src=oakImgUrl;

export const TITLE_IMG=new Image(); TITLE_IMG.src=titleImgUrl;

export function _blitOak(px,py,bob){
  // tall battle sprite (29x56) -> fit to tile, feet at tile bottom, head well above
  const Dw=15, Dh=28, dx=px+1, dy=py+15-Dh+bob;
  ctx.fillStyle='rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(px+8,py+15,6,2.5,0,0,7); ctx.fill();
  ctx.drawImage(OAK_IMG,0,0,29,56,dx,dy,Dw,Dh);
}

// kind -> stationary NPC front sprite key

export const NPC_SPR={ rival:'rival', mom:'mom', npc:'npc', rocket:'rocket', clerk:'clerk', nurse:'nurse' };


export function _blit(im,px,py,bob,flip){
  // 16x24 source frame (character at top 20px) -> fit to tile, feet at tile bottom
  const Dw=16, Dh=24, dx=px, dy=py+15-Dh+bob;
  ctx.fillStyle='rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(px+8,py+15,6,2.5,0,0,7); ctx.fill();
  if(flip){ ctx.save(); ctx.translate(dx+Dw,dy); ctx.scale(-1,1);
            ctx.drawImage(im,0,0,16,24,0,0,Dw,Dh); ctx.restore(); }
  else    { ctx.drawImage(im,0,0,16,24,dx,dy,Dw,Dh); }
}


/* === 3D PROTAGONIST (Pokemon Sun/Moon "Red" model, pre-rendered 4 views) ===
   To RESET to the old sprite, set USE_HERO3D = false (single flip). */

export const USE_HERO3D = false;

const _hero3dMods = import.meta.glob('../assets/gen/hero3d/*', { eager: true, query: '?url', import: 'default' });
export const HERO3D_SRC: Record<string, string> = {};
for (const [_p, _u] of Object.entries(_hero3dMods)) { const _m = _p.match(/([^/]+)\.[a-z0-9]+$/); if (_m) HERO3D_SRC[_m[1]] = _u as string; }

export const HERO3D = {};
for(const k in HERO3D_SRC){ const im=new Image(); im.src=HERO3D_SRC[k]; HERO3D[k]=im; }

export const HERO3D_AR = { down:0.2969, up:0.2969, left:0.2812, right:0.2812 }; // w/h

export function _blitHero3D(im,px,py,bob,ar){
  const Dh=30, Dw=Math.max(10,Math.round(Dh*ar)), dx=px+8-Dw/2, dy=py+15-Dh+bob;
  ctx.fillStyle='rgba(0,0,0,.28)';
  ctx.beginPath(); ctx.ellipse(px+8,py+15,6,2.5,0,0,7); ctx.fill();
  ctx.drawImage(im,dx,dy,Dw,Dh);
}


export function drawActor(px,py,dir,frame,kind){
  const bob=(frame? -1:0);
  if(kind==='hero'){
    if(USE_HERO3D){
      const d=(dir==='up')?'up':(dir==='left')?'left':(dir==='right')?'right':'down';
      const m=HERO3D[d];
      if(_rdy(m)){ _blitHero3D(m,px,py,bob,HERO3D_AR[d]); return; }
    }
    const g = game.flags.girl ? 'herof_' : 'hero_';
    const set = dir==='up' ? [g+'u0',g+'u1']
              : (dir==='left'||dir==='right') ? [g+'l0',g+'l1']
              : [g+'d0',g+'d1'];
    const im=ACTOR_IMG[ frame ? set[1] : set[0] ];
    if(_rdy(im)){ _blit(im,px,py,bob, dir==='right'); return; }
  } else if(kind==='oak'){
    if(_rdy(OAK_IMG)){ _blitOak(px,py,bob); return; }
  } else {
    const key=NPC_SPR[kind];
    if(key && _rdy(ACTOR_IMG[key])){ _blit(ACTOR_IMG[key],px,py,bob,false); return; }
  }
  // ---- procedural fallback (image not yet loaded / unknown kind) ----
  const palettes={
    hero:['#3a5a9a','#dfe6f0','#f0c89a'],
    rival:['#9a3a4a','#f0dfe0','#f0c89a'],
    mom:['#7a5a9a','#f0e0f0','#f0c89a'],
    oak:['#888','#fff','#f0c89a'],
    npc:['#5a8a5a','#e0f0e0','#f0c89a'],
    rocket:['#2a2a30','#b03030','#f0c89a'],
    clerk:['#3a6a8a','#e8eef5','#f0c89a'],
    nurse:['#d8567a','#f3dfe6','#f0c89a']
  };
  const p=palettes[kind]||palettes.npc;
  ctx.fillStyle='rgba(0,0,0,.25)';
  ctx.beginPath(); ctx.ellipse(px+8,py+15,6,2.5,0,0,7); ctx.fill();
  ctx.fillStyle=p[0]; ctx.fillRect(px+4,py+11+bob,3,4); ctx.fillRect(px+9,py+11+bob,3,4);
  ctx.fillStyle=p[0]; ctx.fillRect(px+3,py+6+bob,10,6);
  ctx.fillStyle=p[2]; ctx.fillRect(px+4,py+1+bob,8,6);
  ctx.fillStyle=p[1]; ctx.fillRect(px+3,py+0+bob,10,3);
  ctx.fillStyle='#1a1a1a';
  if(dir==='down'){ ctx.fillRect(px+5,py+4+bob,1,1); ctx.fillRect(px+10,py+4+bob,1,1); }
  else if(dir==='left'){ ctx.fillRect(px+5,py+4+bob,1,1); }
  else if(dir==='right'){ ctx.fillRect(px+10,py+4+bob,1,1); }
}

/* ---------------------------------------------------------------------------
   6. MAPS  (legend: # wall  . grass-floor  , tall-grass  ~ water
              T tree  F flower  P path  H house  L lab  D door  S sign  _ floor)
--------------------------------------------------------------------------- */

export function drawTile(ch,sx,sy){
  switch(ch){
    case 'T':
      ctx.fillStyle='#3a6e3a'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#234d23'; ctx.beginPath(); ctx.ellipse(sx+8,sy+6,7,6,0,0,7); ctx.fill();
      ctx.fillStyle='#2e5e2e'; ctx.beginPath(); ctx.ellipse(sx+5,sy+8,5,5,0,0,7); ctx.fill();
      ctx.beginPath(); ctx.ellipse(sx+11,sy+8,5,5,0,0,7); ctx.fill();
      ctx.fillStyle='#5a3a1a'; ctx.fillRect(sx+7,sy+11,2,4); break;
    case '~':
      ctx.fillStyle='#3a6ec0'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#5a8ee0'; ctx.fillRect(sx+2,sy+4,5,2); ctx.fillRect(sx+9,sy+9,5,2); break;
    case ',':
      ctx.fillStyle='#5aa84a'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#3e8a36';
      for(let i=0;i<4;i++){ const gx=sx+2+i*4; ctx.fillRect(gx,sy+9,1,5); ctx.fillRect(gx+1,sy+7,1,7); }
      break;
    case 'F':
      ctx.fillStyle='#7ac060'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#f0d040'; ctx.beginPath(); ctx.arc(sx+8,sy+8,2,0,7); ctx.fill();
      ctx.fillStyle='#e85858';
      ctx.beginPath(); ctx.arc(sx+5,sy+8,1.6,0,7); ctx.fill();
      ctx.beginPath(); ctx.arc(sx+11,sy+8,1.6,0,7); ctx.fill();
      ctx.beginPath(); ctx.arc(sx+8,sy+5,1.6,0,7); ctx.fill();
      ctx.beginPath(); ctx.arc(sx+8,sy+11,1.6,0,7); ctx.fill(); break;
    case 'P':
      ctx.fillStyle='#caa86a'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#b8945a'; ctx.fillRect(sx,sy,TILE,1); ctx.fillRect(sx,sy,1,TILE); break;
    case 'H':
      ctx.fillStyle='#c05050'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#8a3838'; ctx.fillRect(sx,sy,TILE,6);
      ctx.fillStyle='#e0c080'; ctx.fillRect(sx+3,sy+9,4,5);
      ctx.fillStyle='#7ac9e8'; ctx.fillRect(sx+9,sy+8,4,4); break;
    case 'L':
      ctx.fillStyle='#9aa0a8'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#c05050'; ctx.fillRect(sx,sy,TILE,5);
      ctx.fillStyle='#7ac9e8'; ctx.fillRect(sx+3,sy+8,4,4); ctx.fillRect(sx+9,sy+8,4,4); break;
    case 'G':
      ctx.fillStyle='#7a7e88'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#565a64'; ctx.fillRect(sx,sy,TILE,5);
      ctx.fillStyle='#3a3e48'; ctx.fillRect(sx+5,sy+7,6,9);
      ctx.fillStyle='#c0c4cc'; ctx.fillRect(sx+1,sy+6,2,2); ctx.fillRect(sx+13,sy+6,2,2); break;
    case 'C':
      ctx.fillStyle='#e8eef0'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#d83a4a'; ctx.fillRect(sx,sy,TILE,6);
      ctx.fillStyle='#f8f8f8'; ctx.fillRect(sx+6,sy+1,4,2); ctx.fillRect(sx+7,sy,2,4);
      ctx.fillStyle='#7ac9e8'; ctx.fillRect(sx+3,sy+9,3,4); ctx.fillRect(sx+10,sy+9,3,4); break;
    case 'M':
      ctx.fillStyle='#5a8ec8'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#3a6ea8'; ctx.fillRect(sx,sy,TILE,5);
      ctx.fillStyle='#e8eef5'; ctx.fillRect(sx+3,sy+8,4,4);
      ctx.fillStyle='#f0d040'; ctx.fillRect(sx+9,sy+7,4,5); break;
    case 'D':
      ctx.fillStyle='#caa86a'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#6a4a2a'; ctx.fillRect(sx+4,sy+3,8,13);
      ctx.fillStyle='#f0d040'; ctx.fillRect(sx+10,sy+9,1,2); break;
    case 'S':
      ctx.fillStyle='#7ac060'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#8a5a2a'; ctx.fillRect(sx+3,sy+4,10,7);
      ctx.fillStyle='#6a4a1a'; ctx.fillRect(sx+7,sy+11,2,4); break;
    case '#':
      ctx.fillStyle='#4a4a5a'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#3a3a48'; ctx.fillRect(sx,sy,TILE,2); ctx.fillRect(sx,sy+8,TILE,1); break;
    case '_':
      ctx.fillStyle='#caa07a'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#b8906a'; ctx.fillRect(sx,sy,TILE,1); break;
    case 'B':
      ctx.fillStyle='#caa07a'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#5a7ac0'; ctx.fillRect(sx+1,sy+3,14,11);
      ctx.fillStyle='#cfe0f5'; ctx.fillRect(sx+1,sy+3,14,3); break;
    case 'O':
      ctx.fillStyle='#caa07a'; ctx.fillRect(sx,sy,TILE,TILE); break;
    case 'b':
      ctx.fillStyle='#caa07a'; ctx.fillRect(sx,sy,TILE,TILE); break;
    case 'c':
      ctx.fillStyle='#4a4040'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#3a3232'; ctx.fillRect(sx+2,sy+3,3,2); ctx.fillRect(sx+9,sy+8,4,3);
      ctx.fillStyle='#5a5050'; ctx.fillRect(sx+6,sy+11,3,2); break;
    case 'X':
      ctx.fillStyle='#7ac060'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#3f8f43'; ctx.beginPath(); ctx.arc(sx+8,sy+7,6,0,7); ctx.fill();
      ctx.fillStyle='#2f6f33'; ctx.beginPath(); ctx.arc(sx+5,sy+5,3,0,7); ctx.arc(sx+11,sy+8,3,0,7); ctx.fill();
      ctx.fillStyle='#6b4a2a'; ctx.fillRect(sx+7,sy+12,2,3); break;
    case 's':
      ctx.fillStyle='#7fb8e8'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#9fcdf2'; ctx.fillRect(sx+2,sy+11,5,2); break;
    case 'v':
      // Lava — pulsing orange/red with hot spots that shift per tile-coord.
      {
        const t = (performance.now ? performance.now() : Date.now())/240;
        const p = (Math.sin(t + (sx*0.13+sy*0.17))*0.5 + 0.5);
        const r = Math.round(180 + 60*p);
        const g = Math.round(40  + 50*p);
        ctx.fillStyle = 'rgb('+r+','+g+',20)';
        ctx.fillRect(sx,sy,TILE,TILE);
        ctx.fillStyle = 'rgba(255,220,80,'+(0.35+0.35*p).toFixed(2)+')';
        ctx.fillRect(sx+3, sy+5, 4, 2);
        ctx.fillRect(sx+10, sy+11, 3, 2);
        ctx.fillStyle = '#3a0808';
        ctx.fillRect(sx, sy, TILE, 1);
      }
      break;
    case 'h':
      // Wooden chair (sit-and-think interactable). Solid + tryInteract hook.
      ctx.fillStyle='#caa07a'; ctx.fillRect(sx,sy,TILE,TILE);                  // floor underneath
      ctx.fillStyle='#5a2a10'; ctx.fillRect(sx+4,sy+2,8,8);                    // chair back
      ctx.fillStyle='#7a3a18'; ctx.fillRect(sx+5,sy+3,6,6);                    // back inset
      ctx.fillStyle='#6a3a1a'; ctx.fillRect(sx+3,sy+9,10,3);                   // seat
      ctx.fillStyle='#4a1a08'; ctx.fillRect(sx+4,sy+12,2,3); ctx.fillRect(sx+10,sy+12,2,3); // legs
      break;
    case 'Y':
      // Dive spot — swirling deep-water vortex. Walkable while surfing -> warps to UNDERWATER.
      ctx.fillStyle='#1a3a78'; ctx.fillRect(sx,sy,TILE,TILE);                  // dark blue
      {
        const t=(performance.now?performance.now():Date.now())/600;
        const cx=sx+8, cy=sy+8;
        ctx.strokeStyle='#5fb0e0'; ctx.lineWidth=1.5;
        for(let i=0;i<3;i++){
          const r=2+i*2.2;
          const a0=t+i*1.5;
          ctx.beginPath();
          ctx.arc(cx, cy, r, a0, a0+4.5);
          ctx.stroke();
        }
        ctx.fillStyle='#9fcdf2';
        ctx.fillRect(cx-1,cy-1,2,2);
      }
      break;
    case 'w':
      // Underwater floor — dark blue with shimmer + drifting sand specks.
      ctx.fillStyle='#0e2848'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#163a64'; ctx.fillRect(sx, sy+TILE-3, TILE, 3);          // sand ridge
      {
        const t=(performance.now?performance.now():Date.now())/800;
        const a=(Math.sin(t + (sx*0.21+sy*0.11))*0.5+0.5)*0.25;
        ctx.fillStyle='rgba(120,200,255,'+a.toFixed(2)+')';
        ctx.fillRect(sx+2, sy+3, 3, 1);
        ctx.fillRect(sx+10, sy+8, 3, 1);
      }
      ctx.fillStyle='#a08a5a'; ctx.fillRect(sx+5, sy+TILE-2, 1, 1); ctx.fillRect(sx+12, sy+TILE-2, 1, 1); // sand specks
      break;
    case 'k':
      // Coral — solid, bioluminescent magenta/orange.
      ctx.fillStyle='#0e2848'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#c04488'; ctx.fillRect(sx+3,sy+4,3,9);
      ctx.fillStyle='#e06aaa'; ctx.fillRect(sx+4,sy+5,1,7);
      ctx.fillStyle='#e09030'; ctx.fillRect(sx+9,sy+6,3,7);
      ctx.fillStyle='#f0b860'; ctx.fillRect(sx+10,sy+7,1,5);
      ctx.fillStyle='#88e0d0'; ctx.fillRect(sx+7,sy+2,1,3);
      break;
    default:
      ctx.fillStyle='#7ac060'; ctx.fillRect(sx,sy,TILE,TILE);
      ctx.fillStyle='#6eb456'; ctx.fillRect(sx+10,sy+11,3,1);
  }
}

export function renderWorld(){
  const map=game.map, p=game.player;
  // camera centered on player, clamped
  const mapW=map.grid[0].length*TILE, mapH=map.grid.length*TILE;
  let cx=p.px+8-VIEW_W/2, cy=p.py+8-VIEW_H/2;
  cx=Math.max(0,Math.min(cx,Math.max(0,mapW-VIEW_W)));
  cy=Math.max(0,Math.min(cy,Math.max(0,mapH-VIEW_H)));
  if(mapW<VIEW_W) cx=(mapW-VIEW_W)/2;
  if(mapH<VIEW_H) cy=(mapH-VIEW_H)/2;
  game.cam.x=cx; game.cam.y=cy;

  ctx.fillStyle=map.interior?'#2a2030':(game.mapName==='SKY_FIELD'?'#7fb8e8':'#7ac060');
  ctx.fillRect(0,0,VIEW_W,VIEW_H);

  const x0=Math.floor(cx/TILE), y0=Math.floor(cy/TILE);
  for(let y=y0;y<=y0+VIEW_H/TILE+1;y++){
    for(let x=x0;x<=x0+VIEW_W/TILE+1;x++){
      const ch=tileAt(map,x,y);
      drawTile(ch, Math.floor(x*TILE-cx), Math.floor(y*TILE-cy));
    }
  }
  // poke balls in lab
  for(const n of game.npcs){
    const nx=Math.floor(n.x*TILE-cx), ny=Math.floor(n.y*TILE-cy);
    if(n.kind==='ball'){
      const taken=game.flags.hasStarter;
      ctx.fillStyle=taken?'#777':'#e0e0e0';
      ctx.beginPath(); ctx.arc(nx+8,ny+9,4,0,7); ctx.fill();
      ctx.fillStyle=taken?'#555':'#d04040';
      ctx.beginPath(); ctx.arc(nx+8,ny+9,4,Math.PI,2*Math.PI); ctx.fill();
      ctx.fillStyle='#222'; ctx.fillRect(nx+4,ny+8.5,8,1);
    } else if(n.npcMon!=null){
      drawMon(n.npcMon, nx, ny-2, TILE+4);
    } else {
      drawActor(nx,ny,n.dir||'down',0,n.kind);
    }
  }
  // follower (lead party Pokemon) — drawn before player
  const fmon=game.flags.skyForm?null:followerMon();
  if(fmon){
    const f=game.follower;
    const fx=Math.floor(f.px-cx), fy=Math.floor(f.py-cy);
    const hop = f.moving ? Math.abs(Math.sin(f.bob))*2 : 0;
    ctx.fillStyle='rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(fx+8, fy+14, 6, 2.5, 0, 0, 7); ctx.fill();
    const nat=fmon.id+1;
    if(!drawOW(nat, f.dir, fx, fy-hop, TILE)){
      drawMon(fmon.id, fx, fy-2-hop, TILE);
    }
  }
  // player (Metagross during the sky sequence)
  if(game.flags.skyForm){
    drawMon(376, Math.floor(p.px-cx)-2, Math.floor(p.py-cy)-4, TILE+8);
  } else {
    drawActor(Math.floor(p.px-cx),Math.floor(p.py-cy),p.dir,p.frame,'hero');
  }
}

/* ---------------------------------------------------------------------------
   15. RENDER — UI bits (boxes, text)
--------------------------------------------------------------------------- */

export function box(x,y,w,h){
  ctx.fillStyle='#f8f8f8'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#384860'; ctx.lineWidth=2;
  ctx.strokeRect(x+1,y+1,w-2,h-2);
  ctx.strokeStyle='#a8b8d0'; ctx.lineWidth=1;
  ctx.strokeRect(x+3,y+3,w-6,h-6);
}

export function text(str,x,y,col,size){
  ctx.fillStyle=col||'#283040';
  ctx.font=(size||7)+"px 'Press Start 2P', monospace";
  ctx.textBaseline='top';
  const lines=str.split('\n');
  for(let i=0;i<lines.length;i++) ctx.fillText(lines[i],x,y+i*(size?size+3:10));
}

export function hpBar(x,y,w,cur,max,label?,lvl?){
  if(label){ text(label,x,y-9,'#283040',6); }
  if(lvl!==undefined) text("Lv"+lvl, x+w-22, y-9, '#283040',6);
  ctx.fillStyle='#384860'; ctx.fillRect(x-1,y-1,w+2,5);
  ctx.fillStyle='#202830'; ctx.fillRect(x,y,w,3);
  const pct=Math.max(0,cur/max);
  ctx.fillStyle=pct>0.5?'#48c048':pct>0.2?'#f0c030':'#e04040';
  ctx.fillRect(x,y,Math.ceil(w*pct),3);
}


export function renderTitle(){
  // Dark backdrop (letterbox)
  ctx.fillStyle='#080a12'; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  // Draw the DELTA CRONICLES title art: fit to width, center vertically
  if(_rdy(TITLE_IMG)){
    const iw=TITLE_IMG.naturalWidth, ih=TITLE_IMG.naturalHeight;
    const dw=VIEW_W, dh=Math.round(ih*VIEW_W/iw);
    const dy=Math.floor((VIEW_H-dh)/2);
    ctx.imageSmoothingEnabled=true;
    ctx.drawImage(TITLE_IMG, 0, dy, dw, dh);
  } else {
    // fallback while image loads
    ctx.fillStyle='#f0d040'; ctx.font="12px 'Press Start 2P', monospace";
    ctx.textAlign='center'; ctx.textBaseline='top';
    ctx.fillText("DELTA",VIEW_W/2,40); ctx.fillText("CRONICLES",VIEW_W/2,58);
    ctx.textAlign='left';
  }
  // Build stamp (top-left, small, with subtle shadow for readability over art)
  ctx.textAlign='left'; ctx.textBaseline='top';
  ctx.font="6px 'Press Start 2P', monospace";
  ctx.fillStyle='rgba(0,0,0,.7)';
  ctx.fillText("BUILD 2026-05-31 · delta v19 · part 3 rayquaza",3,3);
  ctx.fillStyle='#7ec77e';
  ctx.fillText("BUILD 2026-05-31 · delta v19 · part 3 rayquaza",2,2);
  // Blinking start prompt (bottom, boxed for contrast)
  if(Math.floor(game.titleT*1.6)%2===0){
    ctx.textAlign='center';
    ctx.font="7px 'Press Start 2P', monospace";
    const msg="PRESS  Z  TO  START";
    const tw=ctx.measureText(msg).width;
    ctx.fillStyle='rgba(0,0,0,.6)';
    ctx.fillRect(VIEW_W/2-tw/2-4, VIEW_H-24, tw+8, 12);
    ctx.fillStyle='#fff';
    ctx.fillText(msg,VIEW_W/2,VIEW_H-22);
    ctx.textAlign='left';
  }
}
