/* eslint-disable */
import { Audio } from './audio';
import { State, game } from '../game';
import { renderBattleScene } from './battle';
import { box, renderWorld, text } from './renderer';
import { VIEW_H, VIEW_W } from '../core/constants';
import { ctx } from '../core/canvas';
import { consume } from './input';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: dialogue

export function dialogue(lines,onDone?){
  game.dialogue={ lines:lines.slice(), i:0, char:0, t:0, onDone:onDone||null };
  game.state=State.DIALOGUE;
}

export function choice(prompt,options,onCancel?){
  game.choice={ prompt, options, idx:0, onCancel:onCancel||null };
  game.state=State.CHOICE;
}

/* ---------------------------------------------------------------------------
   9. STARTER + RIVAL
--------------------------------------------------------------------------- */

export function renderDialogue(){
  // keep world or battle behind
  if(game.battle) renderBattleScene(); else renderWorld();
  const d=game.dialogue!;
  box(4,VIEW_H-44,VIEW_W-8,40);
  const full=d.lines[d.i];
  const shown=full.slice(0,Math.floor(d.char));
  text(shown,10,VIEW_H-38,'#283040',7);
  if(d.char>=full.length){
    // blinking arrow
    if(Math.floor(performance.now()/350)%2===0){
      ctx.fillStyle='#283040';
      ctx.beginPath();
      ctx.moveTo(VIEW_W-16,VIEW_H-12); ctx.lineTo(VIEW_W-10,VIEW_H-12); ctx.lineTo(VIEW_W-13,VIEW_H-8); ctx.fill();
    }
  }
}

export function updateDialogue(dt){
  const d=game.dialogue!;
  const full=d.lines[d.i];
  if(d.char<full.length){
    d.char+=dt*44;
    if(d.char>full.length) d.char=full.length;
    if(consume('a')||consume('b')) d.char=full.length;
    return;
  }
  if(consume('a')||consume('b')){
    Audio.select();
    d.i++;
    if(d.i>=d.lines.length){
      const cb=d.onDone; game.dialogue=null;
      game.state = game.battle?State.BATTLE:State.WORLD;
      if(cb) cb();
    } else { d.char=0; }
  }
}


export function renderChoice(){
  if(game.battle) renderBattleScene(); else renderWorld();
  const c=game.choice!;
  box(4,VIEW_H-58,VIEW_W-8,54);
  text(c.prompt,10,VIEW_H-52,'#283040',7);
  for(let i=0;i<c.options.length;i++){
    const yy=VIEW_H-36+i*12;
    if(i===c.idx){ text(">",10,yy,'#283040',7); }
    text(c.options[i].label,20,yy,'#283040',7);
  }
}

export function updateChoice(){
  const c=game.choice!;
  if(consume('up')){ c.idx=(c.idx-1+c.options.length)%c.options.length; Audio.select(); }
  if(consume('down')){ c.idx=(c.idx+1)%c.options.length; Audio.select(); }
  if(consume('a')){
    Audio.confirm();
    const fn=c.options[c.idx].fn; game.choice=null;
    game.state = game.battle?State.BATTLE:State.WORLD;
    if(fn) fn();
  } else if(consume('b')){
    const cancel=c.onCancel; game.choice=null;
    game.state = game.battle?State.BATTLE:State.WORLD;
    Audio.cancel();
    if(cancel) cancel();
  }
}

/* ---------------------------------------------------------------------------
   16. RENDER — overworld MENU + PARTY
--------------------------------------------------------------------------- */
