/* eslint-disable */
import { State, game, setMap } from '../game';
import { recalc } from '../data/dex';
import { evolve, startEvolutionCutscene } from './battle';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: save

export const SAVE_KEY='hoenn_save_v1';

export function saveGame(){
  try{
    const data={ v:1, map:game.mapName,
      px:game.player.x, py:game.player.y, dir:game.player.dir,
      party:game.party, flags:game.flags, bag:game.bag, dex:game.dex, pc:game.pc, lastCenter:game.lastCenter };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    return true;
  }catch(e){ return false; }
}

export function hasSave(){
  try{ return !!localStorage.getItem(SAVE_KEY); }catch(e){ return false; }
}

export function loadGame(){
  try{
    const raw=localStorage.getItem(SAVE_KEY); if(!raw) return false;
    const d=JSON.parse(raw);
    if(!d || !Array.isArray(d.party)) return false;
    game.party=d.party.map(m=>{ recalc(m,false); return m; });   // keep saved HP, fix stats
    game.flags=Object.assign({}, game.flags, d.flags||{});        // new flags keep defaults
    game.bag=Object.assign({}, game.bag, d.bag||{});
    game.dex={ seen:(d.dex&&d.dex.seen)||{}, caught:(d.dex&&d.dex.caught)||{} };
    game.pc=Array.isArray(d.pc)?d.pc.map(m=>{ recalc(m,false); return m; }):[];
    game.lastCenter=(d.lastCenter && d.lastCenter.map)?d.lastCenter:null;
    setMap(d.map||'PLAYER_HOUSE', d.px!=null?d.px:4, d.py!=null?d.py:4, d.dir||'down');
    game.state=State.WORLD;
    // Catch-up: any party mon that hit its evolution threshold before this fix shipped
    // gets to evolve now (via the cutscene chain).
    runPendingEvolutionsThen(null);
    return true;
  }catch(e){ return false; }
}

export function runPendingEvolutionsThen(after){
  const pending: any[] = [];
  for(const m of game.party){
    let evt;
    while((evt = evolve(m))){
      pending.push({ mon:m, fromId:evt.fromId, fromName:evt.fromName, toId:evt.toId, toName:evt.toName });
    }
  }
  if(!pending.length){ if(after) after(); return; }
  let i = 0;
  const step = () => {
    if(i < pending.length) startEvolutionCutscene(pending[i++], step);
    else if(after) after();
  };
  step();
}
