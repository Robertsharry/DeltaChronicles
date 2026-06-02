/* eslint-disable */
import { Audio } from './audio';
import { State, game, setMap } from '../game';
import { choice, dialogue } from './dialogue';
import { box, drawMon, hpBar, renderWorld, text } from './renderer';
import { VIEW_H, VIEW_W } from '../core/constants';
import { consume } from './input';
import { saveGame } from './save';
import { ctx } from '../core/canvas';
import { DEX, recalc } from '../data/dex';
import { TRADE_EVOLVE, applyExp, markCaught, renderBattleScene, startEvolutionCutscene, switchTo } from './battle';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: ui

export function teachCut(){
  if(!game.party.length){ dialogue(["...but you have no\nPOKEMON to learn it!"]); return; }
  const lead=game.party[0];
  if(lead.cut){ dialogue([lead.name+" already\nknows CUT!"]); return; }
  choice("Teach CUT to "+lead.name+"?",[
    {label:"YES", fn:()=>{ lead.cut=true; Audio.heal(); dialogue([lead.name+" learned CUT!\nUse it on small trees\nin the field."]); }},
    {label:"NO",  fn:()=>dialogue(["Put another POKEMON first\nin your party, then talk\nto the CAPTAIN again."]) }
  ], ()=>dialogue(["Talk to the CAPTAIN again\nto teach CUT."]));
}

export function teachSurf(){
  if(!game.party.length){ dialogue(["...but you have no\nPOKEMON to learn it!"]); return; }
  const lead=game.party[0];
  if(lead.surf){ dialogue([lead.name+" already\nknows SURF!"]); return; }
  choice("Teach SURF to "+lead.name+"?",[
    {label:"YES", fn:()=>{ lead.surf=true; Audio.heal(); dialogue([lead.name+" learned SURF!\nWalk onto water to ride\nacross the waves."]); }},
    {label:"NO",  fn:()=>dialogue(["Put the POKEMON you want\nfirst in your party, then\ntalk again."]) }
  ], ()=>dialogue(["Talk again to teach SURF."]));
}

export function teachFly(){
  if(!game.party.length){ dialogue(["...but you have no\nPOKEMON to learn it!"]); return; }
  const lead=game.party[0];
  if(lead.fly){ dialogue([lead.name+" already\nknows the secret FLY!"]); return; }
  choice("Teach FLY to "+lead.name+"?",[
    {label:"YES", fn:()=>{ lead.fly=true; Audio.heal(); dialogue([lead.name+" learned FLY!\nOpen the MENU and pick\nFLY to travel anywhere."]); }},
    {label:"NO",  fn:()=>dialogue(["Put the POKEMON you want\nfirst in your party, then\ntalk again."]) }
  ], ()=>dialogue(["Talk again to learn FLY."]));
}

export function buyItem(key,label,price,reopen){
  price = price||500;
  reopen = reopen||openCeruleanShop;
  if((game.flags.money|0) < price){
    dialogue(["CLERK: You don't have\nenough money for that."],()=>reopen());
    return;
  }
  game.flags.money=(game.flags.money|0)-price;
  game.bag[key]=(game.bag[key]|0)+1;
  Audio.heal();
  dialogue(["Bought a "+label+"!\nMoney left: P"+(game.flags.money|0)],()=>reopen());
}

export function openViridianShop(){
  choice("VIRIDIAN MART  (P"+(game.flags.money|0)+")",[
    {label:"MASTER BALL P20000", fn:()=>buyItem('masterball','MASTER BALL',20000,openViridianShop)},
    {label:"GREAT BALL  P500",   fn:()=>buyItem('greatball','GREAT BALL',500,openViridianShop)},
    {label:"MORE...",            fn:()=>openViridianShop2()}
  ], ()=>dialogue(["CLERK: Please come\nagain!"]));
}

export function openViridianShop2(){
  choice("VIRIDIAN MART  (P"+(game.flags.money|0)+")",[
    {label:"RARE CANDY  P1000", fn:()=>buyItem('rarecandy','RARE CANDY',1000,openViridianShop2)},
    {label:"BACK",              fn:()=>openViridianShop()},
    {label:"LEAVE",             fn:()=>dialogue(["CLERK: Please come\nagain!"])}
  ], ()=>dialogue(["CLERK: Please come\nagain!"]));
}

export function openCeruleanShop(){
  choice("MART  (you have P"+(game.flags.money|0)+")",[
    {label:"GREAT BALL  P500",   fn:()=>buyItem('greatball','GREAT BALL',500,openCeruleanShop)},
    {label:"SUPER POTION  P500", fn:()=>buyItem('superpotion','SUPER POTION',500,openCeruleanShop)},
    {label:"MORE...",            fn:()=>openCeruleanShop2()}
  ], ()=>dialogue(["CLERK: Please come\nagain!"]));
}

export function openCeruleanShop2(){
  choice("MART  (you have P"+(game.flags.money|0)+")",[
    {label:"RARE CANDY  P1000", fn:()=>buyItem('rarecandy','RARE CANDY',1000,openCeruleanShop2)},
    {label:"BACK",              fn:()=>openCeruleanShop()},
    {label:"LEAVE",             fn:()=>dialogue(["CLERK: Please come\nagain!"])}
  ], ()=>dialogue(["CLERK: Please come\nagain!"]));
}

export function flyDests(){
  const d=[
    {n:'LITTLEROOT', m:'TOWN',     x:6, y:6},
    {n:'OLDALE',     m:'VIRIDIAN', x:7, y:12},
    {n:'RUSTBORO',   m:'PEWTER',   x:7, y:6},
    {n:'VERDANTURF', m:'VERDANTURF',x:7, y:11}
  ];
  if(game.flags.steelGymBeaten) d.push({n:'STEELWORKS', m:'STEEL_CITY', x:7, y:9});
  if(game.flags.mirage_route_t1||game.flags.mirageGymBeaten) d.push({n:'CARROUSEL', m:'CARROUSEL_CITY', x:7, y:9});
  if(game.flags.mf_t1||game.flags.normanBeaten) d.push({n:'PETALBURG', m:'PETALBURG_TOWN', x:7, y:8});
  if(game.flags.br_t1||game.flags.birchGymBeaten||game.flags.infiniteCable) d.push({n:'BIRCH TOWN', m:'BIRCH_TOWN', x:7, y:8});
  if(game.flags.sr_t1||game.flags.auroraGymBeaten) d.push({n:'AURORA TOWN', m:'AURORA_TOWN', x:7, y:8});
  if(game.flags.cp_t1||game.flags.zenithGymBeaten||game.flags.flyGranted) d.push({n:'ZENITH CITY', m:'ZENITH_CITY', x:7, y:8});
  if(game.flags.zenithGymBeaten || game.flags.viridianBeaten) d.push({n:'LEAGUE', m:'POKEMON_LEAGUE', x:4, y:11});
  return d;
}

export function renderFly(){
  renderWorld();
  const d=flyDests(), w=86, x=VIEW_W-w-6, y=4;
  box(x,y,w,d.length*12+12);
  text("FLY TO:",x+8,y+6,'#283040',6);
  for(let i=0;i<d.length;i++){ const yy=y+18+i*12;
    if(i===game.flyView.idx) text(">",x+6,yy,'#283040',7);
    text(d[i].n,x+16,yy,'#283040',7); }
}

export function updateFly(){
  const d=flyDests(), v=game.flyView;
  if(consume('up')){ v.idx=(v.idx-1+d.length)%d.length; Audio.select(); }
  if(consume('down')){ v.idx=(v.idx+1)%d.length; Audio.select(); }
  if(consume('b')||consume('menu')){ Audio.cancel(); game.state=State.MENU; return; }
  if(consume('a')){ Audio.confirm(); const t=d[v.idx]||d[0];
    Audio.heal(); game.state=State.WORLD; setMap(t.m,t.x,t.y,'down'); }
}

export function renderMenu(){
  renderWorld();
  const w=72, x=VIEW_W-w-6, y=6, items=game.menu.items;
  box(x,y,w,items.length*12+10);
  for(let i=0;i<items.length;i++){
    const yy=y+8+i*12;
    if(i===game.menu.idx) text(">",x+6,yy,'#283040',7);
    text(items[i],x+16,yy,'#283040',7);
  }
}

export function updateMenu(){
  const m=game.menu;
  if(consume('up')){ m.idx=(m.idx-1+m.items.length)%m.items.length; Audio.select(); }
  if(consume('down')){ m.idx=(m.idx+1)%m.items.length; Audio.select(); }
  if(consume('b')||consume('menu')){ Audio.cancel(); game.state=State.WORLD; return; }
  if(consume('a')){
    Audio.confirm();
    const sel=m.items[m.idx];
    if(sel==='CLOSE'){ game.state=State.WORLD; }
    else if(sel==='SAVE'){
      const ok=saveGame();
      dialogue([ ok ? "Game saved!\nUse CONTINUE on the\ntitle screen next time."
                    : "Couldn't save — this\nbrowser blocks storage\nfor local files." ],
               ()=>{ game.state=State.MENU; });
    }
    else if(sel==='POKEMON'){ game.partyView={idx:0,ret:State.MENU}; game.state=State.PARTY; }
    else if(sel==='POKEDEX'){
      if(!game.flags.pokedex){
        dialogue(["You don't have the\nPOKEDEX yet.","Deliver OAK'S PARCEL\nto PROF. OAK first."],()=>{game.state=State.MENU;});
      } else { game.dexView={top:0,idx:0}; game.state=State.POKEDEX; }
    }
    else if(sel==='BAG'){ game.bagView={idx:0}; game.state=State.BAG; }
    else if(sel==='FLY'){
      if(!game.party.some(m=>m&&m.fly)){
        dialogue(["No POKEMON knows the\nsecret move FLY.\nFind the tutor on\nCINNABAR ISLAND."],()=>{game.state=State.MENU;});
      } else { game.flyView={idx:0}; game.state=State.FLY; }
    }
    else if(sel==='TRAINER'){ game.state=State.TRAINER; }
    else if(sel==='MUSIC'){ Audio.toggleMusic();
      dialogue(["Music is now "+(Audio._mt?"ON.":"OFF.")],()=>{ game.state=State.MENU; }); }
  }
}
/* ---- POKEDEX ---- */

export function dexList(){
  const a: number[]=[];
  for(let i=1;i<=151;i++) if(game.dex.seen[i]) a.push(i);
  return a;
}

export function renderPokedex(){
  renderWorld();
  ctx.fillStyle='rgba(20,28,40,.92)'; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  const seen=dexList();
  const owned=Object.keys(game.dex.caught).length;
  text("POKEDEX",10,8,'#fff',8);
  text("OWNED "+owned+"   SEEN "+seen.length+"   / 151",10,20,'#7ec77e',6);
  if(seen.length===0){ text("No data yet. Go and",10,44,'#cfe0f5',7);
    text("find some POKEMON!",10,56,'#cfe0f5',7);
    text("X = back",10,VIEW_H-12,'#9ab',6); return; }
  const dv=game.dexView, ROWS=4, PITCH=24, Y0=30;
  if(dv.idx<dv.top) dv.top=dv.idx;
  if(dv.idx>=dv.top+ROWS) dv.top=dv.idx-ROWS+1;
  for(let r=0;r<ROWS;r++){
    const li=dv.top+r; if(li>=seen.length) break;
    const id=seen[li], y=Y0+r*PITCH, own=game.dex.caught[id];
    if(li===dv.idx){ ctx.strokeStyle='#f0d040'; ctx.lineWidth=2; ctx.strokeRect(4,y-1,VIEW_W-8,PITCH-3); }
    text((own?"\u25CF":"\u25CB"),9,y+8,own?'#f0d040':'#6a7a8a',7);
    text("No."+String(id).padStart(3,'0'),20,y+8,'#cfe0f5',6);
    drawMon(id, 62, y, 20);
    text(DEX[id-1][0].toUpperCase(),88,y+8,'#fff',7);
  }
  text("\u2191\u2193 scroll    X = back",10,VIEW_H-8,'#9ab',6);
}

export function updatePokedex(){
  const seen=dexList(), dv=game.dexView;
  if(consume('b')||consume('menu')){ Audio.cancel(); game.state=State.MENU; return; }
  if(seen.length){
    if(consume('up')){ dv.idx=(dv.idx-1+seen.length)%seen.length; Audio.select(); }
    if(consume('down')){ dv.idx=(dv.idx+1)%seen.length; Audio.select(); }
    if(consume('a')){ Audio.confirm(); }   // "cry" beep (uses confirm sfx)
  }
}
/* ---- BAG ---- */

export function bagItems(){
  const list: any[]=[
    {name:"POKE BALL", qty:game.bag.ball},
    {name:"POTION",    qty:game.bag.potion},
    ...(game.bag.masterball>0?[{name:"MASTER BALL", qty:game.bag.masterball}]:[]),
    ...(game.bag.greatball>0?[{name:"GREAT BALL", qty:game.bag.greatball}]:[]),
    ...(game.bag.rarecandy>0?[{name:"RARE CANDY", qty:game.bag.rarecandy}]:[]),
    ...((game.bag.linkcable>0||game.flags.infiniteCable)?[{name:"LINK CABLE", qty:(game.flags.infiniteCable?"\u221e":game.bag.linkcable)}]:[]),
    ...(game.bag.tradepass>0?[{name:"TRADE PASS", qty:game.bag.tradepass}]:[]),
    ...(game.bag.superpotion>0?[{name:"SUPER POTION", qty:game.bag.superpotion}]:[]),
    {name:"EXP SHARE", key:true, toggle:true},
    {name:"MUSIC", key:true, toggle:true}
  ];
  if(game.flags.parcel)  list.push({name:"OAK'S PARCEL", qty:1, key:true});
  if(game.flags.pokedex) list.push({name:"POKEDEX", qty:1, key:true});
  if(game.flags.fossil)  list.push({name:game.flags.fossil+" FOSSIL", qty:1, key:true});
  if(game.flags.hmCut)   list.push({name:"HM01 CUT", qty:1, key:true});
  if(game.flags.hmSurf)  list.push({name:"HM03 SURF", qty:1, key:true});
  return list;
}

export function renderBag(){
  renderWorld();
  ctx.fillStyle='rgba(20,28,40,.92)'; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  text("BAG",10,8,'#fff',8);
  const items=bagItems(), bv=game.bagView;
  for(let i=0;i<items.length;i++){
    const it=items[i], y=28+i*20;
    if(i===bv.idx){ ctx.strokeStyle='#f0d040'; ctx.lineWidth=2; ctx.strokeRect(4,y-2,VIEW_W-8,18); }
    text(it.name,14,y+5,'#fff',7);
    const tflag = it.name==='MUSIC' ? game.flags.music : game.flags.expShare;
    const rhs = it.toggle ? (tflag?"ON":"OFF") : (it.key?"--":("x"+it.qty));
    text(rhs,VIEW_W-40,y+5, it.toggle?(tflag?'#7ec77e':'#9ab'):'#cfe0f5',7);
  }
  text("X = back",10,VIEW_H-12,'#9ab',6);
}

export function updateBag(){
  const items=bagItems(), bv=game.bagView;
  if(consume('b')||consume('menu')){ Audio.cancel(); game.state=State.MENU; return; }
  if(consume('up')){ bv.idx=(bv.idx-1+items.length)%items.length; Audio.select(); }
  if(consume('down')){ bv.idx=(bv.idx+1)%items.length; Audio.select(); }
  if(consume('a')){
    const it=items[bv.idx];
    if(it && it.toggle){ if(it.name==='MUSIC'){ game.flags.music=!game.flags.music; } else { game.flags.expShare=!game.flags.expShare; } Audio.confirm(); }
    else if(it && it.name==='RARE CANDY'){
      if((game.bag.rarecandy|0)<=0){ Audio.cancel(); return; }
      if(!game.party.length){ Audio.cancel(); return; }
      Audio.confirm();
      game.partyView={ idx:0, ret:State.BAG, useItem:'rarecandy' };
      game.state=State.PARTY;
    }
    else if(it && it.name==='LINK CABLE'){
      if((game.bag.linkcable|0)<=0 && !game.flags.infiniteCable){ Audio.cancel(); return; }
      if(!game.party.length){ Audio.cancel(); return; }
      Audio.confirm();
      game.partyView={ idx:0, ret:State.BAG, useItem:'linkcable' };
      game.state=State.PARTY;
    }
    else if(it && (it.name==='POTION' || it.name==='SUPER POTION')){
      const kind = it.name==='SUPER POTION' ? 'superpotion' : 'potion';
      if((game.bag[kind]|0)<=0){ Audio.cancel(); return; }
      if(!game.party.length || !game.party.some(m=>m.hp>0 && m.hp<m.maxHp)){
        Audio.cancel();
        dialogue(["No POKEMON needs a "+it.name+"\nright now."],()=>{ game.state=State.BAG; });
        return;
      }
      Audio.confirm();
      game.partyView={ idx:0, ret:State.BAG, useItem:kind };
      game.state=State.PARTY;
    }
    else Audio.select();
  }
}

export function fieldLinkCable(){
  // LINK CABLE: triggers trade-evolution for eligible Pokemon.
  // Validates eligibility BEFORE consuming the item (no waste on misses).
  const pv = game.partyView, mon = game.party[pv.idx];
  if(!mon){ return; }
  if((game.bag.linkcable|0) <= 0 && !game.flags.infiniteCable){
    Audio.cancel();
    dialogue(["You're out of LINK\nCABLES!"], ()=>{ game.state = State.BAG; });
    return;
  }
  const targetId = TRADE_EVOLVE[mon.id];
  if(!targetId){
    Audio.cancel();
    dialogue(["The LINK CABLE had no\neffect on "+mon.name+"."], ()=>{ game.state = State.BAG; });
    return;
  }
  // Eligible — consume the cable (unless infinite) and trigger evolution + cutscene.
  if(!game.flags.infiniteCable) game.bag.linkcable--;
  const fromId = mon.id, fromName = mon.name;
  const d = DEX[targetId - 1];
  if(!d){
    // Safety: should not happen since TRADE_EVOLVE targets are all in DEX
    Audio.cancel();
    dialogue(["Something went wrong\nwith the LINK CABLE..."], ()=>{ game.state = State.BAG; });
    return;
  }
  mon.id = targetId;
  mon.name = d[0].toUpperCase();
  mon.t1 = d[1]; mon.t2 = d[2];
  mon.base = { hp:d[3], atk:d[4], def:d[5], spc:d[6], spe:d[7] };
  markCaught(mon.id);
  recalc(mon, false);
  // Fire the 5-second cutscene; onDone returns to BAG
  startEvolutionCutscene(
    { mon, fromId, fromName, toId: targetId, toName: mon.name },
    () => { game.state = State.BAG; }
  );
}

export function fieldCandy(){
  const pv=game.partyView, mon=game.party[pv.idx];
  if(!mon){ return; }
  if((game.bag.rarecandy|0)<=0){ Audio.cancel(); dialogue(["You're out of RARE\nCANDY!"],()=>{ game.state=State.BAG; }); return; }
  if(mon.level>=100){ Audio.cancel(); dialogue([mon.name+" can't grow any\nfurther (Lv100)."],()=>{ game.state=State.BAG; }); return; }
  game.bag.rarecandy--;
  const r=applyExp(mon, (mon.xpNext - mon.xp) + 1);   // exactly one level
  Audio.heal();
  const q=[mon.name+" grew to\nLEVEL "+mon.level+"!"];
  for(const lm of r.learnMsgs) q.push(lm);
  for(const e of r.evoMsgs) q.push(e);
  dialogue(q,()=>{ game.state=State.BAG; });
}

export function fieldHeal(kind){
  const pv=game.partyView, mon=game.party[pv.idx];
  if(!mon){ return; }
  if(mon.hp<=0){ Audio.cancel(); dialogue(["A POTION can't revive a\nfainted POKEMON."],()=>{ game.state=State.BAG; }); return; }
  if(mon.hp>=mon.maxHp){ Audio.cancel(); dialogue([mon.name+" is already at\nfull health!"],()=>{ game.state=State.BAG; }); return; }
  if((game.bag[kind]|0)<=0){ Audio.cancel(); dialogue(["You're out of those!"],()=>{ game.state=State.BAG; }); return; }
  const heal = kind==='superpotion' ? 60 : 20;
  const nm   = kind==='superpotion' ? 'SUPER POTION' : 'POTION';
  game.bag[kind]--;
  mon.hp=Math.min(mon.maxHp, mon.hp+heal);
  Audio.heal();
  dialogue(["Used a "+nm+".\n"+mon.name+" recovered HP!"],()=>{ game.state=State.BAG; });
}
/* ---- TRAINER CARD ---- */

export function renderTrainer(){
  renderWorld();
  ctx.fillStyle='rgba(20,28,40,.92)'; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  text("TRAINER CARD",10,8,'#fff',8);
  const owned=Object.keys(game.dex.caught).length;
  const lines=[
    ["NAME", "RED"],
    ["POKEDEX", owned+" owned"],
    ["PARTY", game.party.length+" / 6"],
    ["MONEY", "P "+(game.flags.money|0)],
    ["BADGES", (function(){const a: string[]=[];if(game.flags.boulderBadge)a.push('STN');if(game.flags.cascadeBadge)a.push('KNK');if(game.flags.thunderBadge)a.push('THD');if(game.flags.rainbowBadge)a.push('RNB');if(game.flags.soulBadge)a.push('SOU');if(game.flags.marshBadge)a.push('MRS');if(game.flags.volcanoBadge)a.push('VOL');if(game.flags.earthBadge)a.push('ERT');if(game.flags.steelBadge)a.push('IRN');if(game.flags.mirageBadge)a.push('MIR');if(game.flags.mistralBadge)a.push('MST');if(game.flags.birchBadge)a.push('VRD');if(game.flags.auroraBadge)a.push('TMP');if(game.flags.zenithBadge)a.push('ZEN');return a.length?a.join('/'):'none';})()],
    ["LV CAP", game.flags.noCap ? "NONE" : String(game.flags.levelCap)]
  ];
  for(let i=0;i<lines.length;i++){
    const y=30+i*18;
    text(lines[i][0],14,y,'#7ec77e',7);
    text(lines[i][1],90,y,'#fff',7);
  }
  if(game.party[0]) drawMon(game.party[0].id, VIEW_W-44, 26, 28);
  text("X = back",10,VIEW_H-12,'#9ab',6);
}

export function updateTrainer(){
  if(consume('b')||consume('a')||consume('menu')){ Audio.cancel(); game.state=State.MENU; }
}

export function renderPC(){
  renderWorld();
  ctx.fillStyle='rgba(20,28,40,.92)'; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  const v=game.pcView;
  const list = v.side==='party' ? game.party : game.pc;
  const sideName = v.side==='party' ? 'PARTY' : 'BOX';
  text("PC  -  "+sideName+"  ("+list.length+(v.side==='party'?"/6":"")+")",10,8,'#fff',7);
  const VIS=5, rowH=21;
  if(v.top>list.length-VIS) v.top=Math.max(0,list.length-VIS);
  if(v.top<0) v.top=0;
  if(list.length===0){ text("(empty)",16,34,'#cfe0f5',7); }
  for(let i=0;i<VIS;i++){
    const idx=v.top+i; if(idx>=list.length) break;
    const m=list[idx], y=24+i*rowH;
    if(idx===v.idx){ ctx.strokeStyle='#f0d040'; ctx.lineWidth=2; ctx.strokeRect(4,y-2,VIEW_W-8,rowH-3); }
    drawMon(m.id, 8, y-3, 18);
    text(m.name,32,y,'#fff',7);
    text("Lv"+m.level,32,y+9,'#cfe0f5',6);
    hpBar(96,y+6,46,m.hp,m.maxHp);
    text(m.hp+"/"+m.maxHp,96,y+11,m.hp>0?'#cfe0f5':'#e08080',5);
  }
  if(v.top>0) text("^ more",VIEW_W-40,20,'#9ab',5);
  if(v.top+VIS<list.length) text("v more",VIEW_W-40,VIEW_H-22,'#9ab',5);
  const act = v.side==='party' ? "Z=deposit" : "Z=withdraw";
  text(v.msg ? v.msg : (act+"   <>=switch   X=exit"),10,VIEW_H-12,'#9ab',6);
}

export function updatePC(){
  const v=game.pcView;
  if(consume('b')||consume('menu')){ Audio.cancel(); game.state=State.WORLD; return; }
  if(consume('left')||consume('right')){
    v.side = v.side==='party' ? 'box' : 'party';
    v.idx=0; v.top=0; v.msg=''; Audio.select(); return;
  }
  const list = v.side==='party' ? game.party : game.pc;
  if(consume('up')){ if(v.idx>0){ v.idx--; if(v.idx<v.top) v.top=v.idx; v.msg=''; Audio.select(); } }
  if(consume('down')){ if(v.idx<list.length-1){ v.idx++; if(v.idx>v.top+4) v.top=v.idx-4; v.msg=''; Audio.select(); } }
  if(consume('a')){
    if(v.side==='party'){
      if(game.party.length<=1){ v.msg="Keep at least 1 POKEMON!"; Audio.cancel(); return; }
      if(v.idx>=game.party.length){ Audio.cancel(); return; }
      const m=game.party.splice(v.idx,1)[0];
      game.pc.push(m);
      Audio.confirm(); v.msg=m.name+" moved to BOX.";
      if(v.idx>=game.party.length) v.idx=game.party.length-1;
      if(v.idx<v.top) v.top=Math.max(0,v.idx);
    } else {
      if(game.pc.length===0){ Audio.cancel(); return; }
      if(game.party.length>=6){ v.msg="Your PARTY is full!"; Audio.cancel(); return; }
      if(v.idx>=game.pc.length){ Audio.cancel(); return; }
      const m=game.pc.splice(v.idx,1)[0];
      game.party.push(m);
      Audio.confirm(); v.msg=m.name+" added to PARTY.";
      if(v.idx>=game.pc.length) v.idx=Math.max(0,game.pc.length-1);
      if(v.idx<v.top) v.top=Math.max(0,v.idx);
    }
  }
}

export function renderParty(){
  if(game.partyView.ret===State.MENU || game.partyView.ret===State.BAG) renderWorld(); else renderBattleScene();
  ctx.fillStyle='rgba(20,28,40,.85)'; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  text("POKEMON",10,8,'#fff',8);
  if(game.party.length===0){ text("(empty)",10,30,'#cfe0f5',7); return; }
  for(let i=0;i<game.party.length;i++){
    const m=game.party[i], y=22+i*28;
    if(game.partyView.swap===i){ ctx.strokeStyle='#54c8f0'; ctx.lineWidth=2; ctx.strokeRect(4,y-2,VIEW_W-8,26); }
    else if(i===game.partyView.idx){ ctx.strokeStyle='#f0d040'; ctx.lineWidth=2; ctx.strokeRect(4,y-2,VIEW_W-8,26); }
    drawMon(m.id, 8, y, 24);
    text(m.name,36,y,'#fff',7);
    text((i===0?"LEAD  ":"")+"Lv"+m.level,36,y+10,i===0?'#7ec77e':'#cfe0f5',6);
    hpBar(82,y+9,60,m.hp,m.maxHp);
    text(m.hp+"/"+m.maxHp,82,y+13,m.hp>0?'#cfe0f5':'#e08080',6);
  }
  const hint = game.battle ? "Z=send out  X=back"
             : (game.partyView.swap!=null ? "Z=place here  X=cancel" : "Z=move  X=back");
  text(hint,10,VIEW_H-12,'#9ab',6);
}

export function updateParty(){
  const pv=game.partyView;
  if(game.party.length){
    if(consume('up')){ pv.idx=(pv.idx-1+game.party.length)%game.party.length; Audio.select(); }
    if(consume('down')){ pv.idx=(pv.idx+1)%game.party.length; Audio.select(); }
  }
  if(consume('b')){
    if(pv.swap!=null){ pv.swap=null; Audio.cancel(); return; }   // cancel a pick-up first
    if(game.battle && game.battle!.forced){ Audio.cancel(); return; }  // must pick after a faint
    Audio.cancel();
    if(pv.useItem){ game.state=State.BAG; return; }
    if(pv.ret===State.MENU){ game.state=State.MENU; }
    else if(pv.ret===State.BAG){ game.state=State.BAG; }
    else { game.state=State.BATTLE; if(game.battle&&!game.battle!.forced) game.battle!.sub=null; }
    return;
  }
  if(consume('a')){
    if(game.battle){
      const t=game.party[pv.idx];
      if(!t || t.hp<=0 || t===game.battle!.me){ Audio.cancel(); return; }  // can't send a fainted / active mon
      Audio.confirm();
      switchTo(pv.idx);
      game.state=State.BATTLE;
    } else if(pv.useItem){
      Audio.confirm();
      if(pv.useItem==='rarecandy') fieldCandy(); else if(pv.useItem==='linkcable') fieldLinkCable(); else fieldHeal(pv.useItem);
    } else {
      // reorder the party: pick one up, then place it to swap (front = battle lead)
      if(pv.swap==null){
        if(game.party[pv.idx]){ pv.swap=pv.idx; Audio.confirm(); }
      } else if(pv.swap===pv.idx){
        pv.swap=null; Audio.cancel();
      } else {
        const t=game.party[pv.swap]; game.party[pv.swap]=game.party[pv.idx]; game.party[pv.idx]=t;
        pv.swap=null; Audio.confirm();
      }
    }
  }
}

/* ---------------------------------------------------------------------------
   17. RENDER — BATTLE
--------------------------------------------------------------------------- */
