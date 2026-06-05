/* eslint-disable */
import { Audio } from './audio';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: input

export const keys: Record<string, boolean>={};

export const pressed={};
window.addEventListener('keydown',e=>{
  Audio.init(); if(Audio.ctx && Audio.ctx.state==='suspended') Audio.ctx.resume();
  const k=mapKey(e.code);
  if(k){ if(!keys[k]) pressed[k]=true; keys[k]=true; e.preventDefault(); }
});
window.addEventListener('keyup',e=>{ const k=mapKey(e.code); if(k){ keys[k]=false; e.preventDefault(); } });

export function mapKey(code){
  if(['ArrowUp','KeyW'].includes(code)) return 'up';
  if(['ArrowDown','KeyS'].includes(code)) return 'down';
  if(['ArrowLeft','KeyA'].includes(code)) return 'left';
  if(['ArrowRight','KeyD'].includes(code)) return 'right';
  if(['KeyZ','Space'].includes(code)) return 'a';
  if(['KeyX','Backspace','Escape'].includes(code)) return 'b';
  if(code==='Enter') return 'menu';
  return null;
}

export function elKey(el){
  const c = el && el.getAttribute && el.getAttribute('data-k');
  if(!c) return null;
  return mapKey(c) || (c==='ArrowUp'?'up':c==='ArrowDown'?'down':c==='ArrowLeft'?'left':c==='ArrowRight'?'right':c==='KeyZ'?'a':c==='KeyX'?'b':null);
}

export function setKey(k,on){
  if(!k) return;
  if(on){ if(!keys[k]) pressed[k]=true; keys[k]=true; }
  else { keys[k]=false; }
}
// pointerId -> the key it is currently holding (supports multi-touch + sliding)

export const activePtr={};

export function keyElAt(x,y){
  const t=document.elementFromPoint(x,y);
  return t && t.closest ? t.closest('.key') : null;
}

export function ptrDown(ev){
  const el=ev.target && ev.target.closest ? ev.target.closest('.key') : null;
  if(!el) return;
  ev.preventDefault();
  Audio.init(); if(Audio.ctx && Audio.ctx.state==='suspended') Audio.ctx.resume();
  const k=elKey(el);
  activePtr[ev.pointerId]=k;
  setKey(k,true);
}

export function ptrMove(ev){
  if(!(ev.pointerId in activePtr)) return;       // not a control press
  ev.preventDefault();
  const el=keyElAt(ev.clientX,ev.clientY);
  const nk=el?elKey(el):null;
  const ok=activePtr[ev.pointerId];
  if(nk!==ok){ setKey(ok,false); setKey(nk,true); activePtr[ev.pointerId]=nk; }
}

export function ptrUp(ev){
  if(!(ev.pointerId in activePtr)) return;
  ev.preventDefault();
  setKey(activePtr[ev.pointerId],false);
  delete activePtr[ev.pointerId];
}
document.querySelectorAll('.key').forEach(el=>{
  el.addEventListener('pointerdown',ptrDown,{passive:false});
});
window.addEventListener('pointermove',ptrMove,{passive:false});
window.addEventListener('pointerup',ptrUp,{passive:false});
window.addEventListener('pointercancel',ptrUp,{passive:false});
// --- Fallback for environments where pointer events are swallowed (e.g. the
// Claude artifact preview iframe): wire touch + mouse directly per button. ---

export const _hasPtr = ('PointerEvent' in window);

export const _touchKey = {};   // touch.identifier -> key

export function _btnTouchStart(ev){
  if(Object.keys(activePtr).length) return;   // pointer path already handling
  Audio.init(); if(Audio.ctx && Audio.ctx.state==='suspended') Audio.ctx.resume();
  for(const t of ev.changedTouches){
    const el=document.elementFromPoint(t.clientX,t.clientY);
    const key=el && el.closest ? el.closest('.key') : null;
    const k=key?elKey(key):null;
    if(k){ _touchKey[t.identifier]=k; setKey(k,true); }
  }
  if(ev.cancelable) ev.preventDefault();
}

export function _btnTouchMove(ev){
  for(const t of ev.changedTouches){
    if(!(t.identifier in _touchKey)) continue;
    const el=document.elementFromPoint(t.clientX,t.clientY);
    const key=el && el.closest ? el.closest('.key') : null;
    const nk=key?elKey(key):null, ok=_touchKey[t.identifier];
    if(nk!==ok){ setKey(ok,false); setKey(nk,true); _touchKey[t.identifier]=nk; }
  }
  if(ev.cancelable) ev.preventDefault();
}

export function _btnTouchEnd(ev){
  for(const t of ev.changedTouches){
    if(t.identifier in _touchKey){ setKey(_touchKey[t.identifier],false); delete _touchKey[t.identifier]; }
  }
  if(ev.cancelable) ev.preventDefault();
}
document.querySelectorAll('.key').forEach(el=>{
  el.addEventListener('touchstart',_btnTouchStart,{passive:false});
  el.addEventListener('touchmove',_btnTouchMove,{passive:false});
  el.addEventListener('touchend',_btnTouchEnd,{passive:false});
  el.addEventListener('touchcancel',_btnTouchEnd,{passive:false});
  // Mouse fallback (desktop preview where pointer events don't arrive)
  el.addEventListener('mousedown',e=>{
    if(Object.keys(activePtr).length) return;
    Audio.init(); if(Audio.ctx && Audio.ctx.state==='suspended') Audio.ctx.resume();
    const k=elKey(el); if(k){ setKey(k,true); (el as any)._mk=k; } e.preventDefault();
  });
});
window.addEventListener('mouseup',e=>{
  document.querySelectorAll('.key').forEach((el: any)=>{ if(el._mk){ setKey(el._mk,false); el._mk=null; } });
});
// Never let a held key get stuck if the page loses focus / is hidden / a
// gesture is interrupted — clear everything and re-arm.

export function clearAllKeys(){
  for(const k in keys) keys[k]=false;
  for(const id in activePtr) delete activePtr[id];
}
window.addEventListener('blur',clearAllKeys);
document.addEventListener('visibilitychange',()=>{ if(document.hidden) clearAllKeys(); });

export function consume(k){ if(pressed[k]){ pressed[k]=false; return true; } return false; }

/* ---------------------------------------------------------------------------
   13. WORLD MOVEMENT + COLLISION
--------------------------------------------------------------------------- */
