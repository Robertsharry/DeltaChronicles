/* eslint-disable */
import type { Mon } from '../types';
import { Audio } from './audio';
import { State, game, giveMon, offerGen2Choice, setMap, triggerIntroCutscene, snapshotE4Party, restoreE4Party, isMidE4Gauntlet } from '../game';
import { startHallOfFame } from '../cutscenes/halloffame';
import { DEX, buildRivalMoves, dmg, learnList, makeMon, makeMoveObjs, mkMega, recalc } from '../data/dex';
import { choice, dialogue } from './dialogue';
import { MEGA_MEWTWO_X, MEGA_MEWTWO_Y, box, drawBattler, drawMon, hpBar, preloadMons, renderWorld, text } from './renderer';
import { consume } from './input';
import { ctx } from '../core/canvas';
import { VIEW_H, VIEW_W } from '../core/constants';
import { startMirageKyogreBattle } from '../cutscenes/mirage';
import { MAPS } from '../data/maps';
import { MEGA } from '../data/sprites';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: battle

export function healParty(){ for(const m of game.party){ m.hp=m.maxHp; for(const mv of m.moves) mv.ppNow=mv.pp; m.friendship = Math.min(255, (m.friendship|0) + 5); } }

/* ---------------------------------------------------------------------------
   5. SPRITES — real PokeAPI art, lazy-loaded, procedural fallback.

   ====================  DROP YOUR OWN ART HERE  =======================
   Map a National-Dex id to ANY image source; it wins over the download
   and the procedural fallback.
     Bulbasaur 1 · Charmander 4 · Squirtle 7 · Pikachu 25
     Pidgey 16 · Rattata 19 · Caterpie 10 · Weedle 13 · Spearow 21
   A source can be:
     1) a URL ........... 16:'https://example.com/pidgey.png'
     2) a file beside this .html (needs a local server):
                          16:'art/pidgey.png'
     3) an embedded image (keeps it single-file & fully offline):
                          16:'data:image/png;base64,iVBORw0KGgo...'
--------------------------------------------------------------------------- */

export function doMegaEvolve(mon){
  mon.mega=true;
  mon.atk=Math.round(mon.atk*1.3);
  mon.def=Math.round(mon.def*1.3);
  mon.spc=Math.round(mon.spc*1.3);
  mon.spe=Math.round(mon.spe*1.25);
  Audio.heal();
}

export function startJohtoChamp(){
  const t=[makeMon(130,56),makeMon(142,58),makeMon(248,60),makeMon(6,60),makeMon(149,62),makeMon(149,64)];
  startBattle(t[0],true,'LANCE');
  if(game.battle){ game.battle!.foeTeam=t.slice(1); game.battle!.johtoChamp=true; }
}

export function startMayBattle(){
  const starterId = game.flags.starterId;
  // May picks the one your starter is weak to (Grass < Fire < Water < Grass)
  const mayId = starterId === 252 ? 255 : starterId === 255 ? 258 : 252;
  const may = makeMon(mayId, 12);
  const zigzagoon = makeMon(263, 9);
  startBattle(zigzagoon, true, 'MAY');
  game.battle!.foeTeam = [may];
  game.battle!.isMayFirstFight = true;
}

export function startBrawlyBattle(){
  // BRAWLY — Fighting-type GYM LEADER (Gym 2).
  const machop = makeMon(66, 17);   // Machop Lv17 lead
  const mankey = makeMon(56, 19);   // Mankey Lv19 (stand-in for Makuhita)
  startBattle(machop, true, 'BRAWLY');
  game.battle!.foeTeam = [mankey];
  game.battle!.isBrawly = true;
}

export function startMayRematch1(){
  // MAY second meeting — stronger team after Roxanne.
  const starterId = game.flags.starterId;
  const mayStarter = starterId === 252 ? 256 :    // Treecko -> Combusken
                     starterId === 255 ? 259 :    // Torchic -> Marshtomp
                                         253;     // Mudkip  -> Grovyle
  const linoone = makeMon(264, 18);   // Linoone — May's everyman mon
  const evolved = makeMon(mayStarter, 20);  // Her evolved starter (counter-type to yours)
  startBattle(linoone, true, 'MAY');
  game.battle!.foeTeam = [evolved];
  game.battle!.isMayRematch1 = true;
}

export function startMagmaAdminBattle(){
  // Pre-Groudon climax. Strong team.
  const mightyena = makeMon(262, 55);
  const houndoom  = makeMon(229, 56);
  const blaziken  = makeMon(257, 58);
  startBattle(mightyena, true, 'MAGMA ADMIN');
  game.battle!.foeTeam = [houndoom, blaziken];
  game.battle!.isMagmaAdmin = true;
}

export function startGroudonFight(){
  const groudon = makeMon(383, 60);
  startBattle(groudon, false);
  game.battle!.isGroudon = true;
  game.battle!.label = 'GROUDON';
}

export function startRivalBattle(){
  const stage=game.flags.rivalStage|0;
  const lvl=5+stage*5;                                  // 5, 10, 15, 20, ...
  const d=DEX[game.flags.rivalId!-1];
  const foe=makeMon(game.flags.rivalId!,lvl);
  foe.moves=buildRivalMoves(d[1],d[2],stage);           // no type moves until later
  startBattle(foe,true,'RIVAL');
  game.battle!.isRival=true;
}

export function startGruntBattle(){
  const foe=makeMon(23,3);             // Ekans Lv3 — a scrubby just-caught grunt mon
  startBattle(foe,true,'ROCKET GRUNT');
  game.battle!.isGrunt=true;
}

export function startRocketBoss(){
  const foe=makeMon(20,15);            // Raticate Lv15 — single tough boss mon
  startBattle(foe,true,'ROCKET BOSS');
  game.battle!.isRocketBoss=true;
}

export function startBrockBattle(){
  // Roxanne's team — distinct from canonical Brock to feel like a Hoenn LEADER.
  const graveler = makeMon(75, 22);    // Graveler Lv 22 (lead — heavier than Geodude)
  const steelix  = makeMon(208, 24);   // Steelix  Lv 24 (ace — Steel/Ground, scary)
  startBattle(graveler, true, 'ROXANNE');
  game.battle!.foeTeam = [steelix];
  game.battle!.isBrock = true;          // keep flag name; UI says ROXANNE/STONE BADGE
}

export function towerTeam(round){
  const pool=[3,6,9,38,59,65,94,112,130,131,143,149];
  const lv=52 + round*3 + Math.min(20,(game.flags.towerBest||0)*2);
  const pick: Mon[]=[], used: Record<number,number>={};
  while(pick.length<3){ const id=pool[(Math.random()*pool.length)|0];
    if(used[id]) continue; used[id]=1; pick.push(makeMon(id, lv)); }
  return pick;
}

export function startTowerBattle(){
  const t=game.tower; if(!t) return;
  const team=towerTeam(t.round);
  startBattle(team[0],true,'TOWER R'+(t.round+1));
  if(game.battle){ game.battle!.foeTeam=team.slice(1); game.battle!.towerBattle=true; }
}

export function startTower(){
  if(!game.party.some(m=>m&&m.hp>0)){ dialogue(["Your POKEMON need rest\nbefore the challenge."]); return; }
  healParty();
  game.tower={round:0,total:5};
  dialogue(["TOWER CLERK: Five battles,\nno healing between them.","Your team is fully\nhealed. Good luck!"],()=>startTowerBattle());
}

export function startRematch(){
  const team=[makeMon(149,70),makeMon(112,70),makeMon(94,71),makeMon(65,71),makeMon(143,72),makeMon(6,74)];
  startBattle(team[0],true,'CHAMPION');
  if(game.battle){ game.battle!.foeTeam=team.slice(1); game.battle!.rematch=true; }
}

export function startTrainerFight(npcName,label,team,flagName){
  startBattle(team[0],true,label);
  game.battle!.foeTeam=team.slice(1);
  game.battle!.genericTrainer=true;
  game.battle!.trainerNpc=npcName;
  game.battle!.trainerFlag=flagName;
}

export function startBigRivalBattle(){
  const pidgeotto=makeMon(17,30);      // Pidgeotto Lv30
  const kadabra  =makeMon(64,32);      // Kadabra   Lv32
  const wartortle=makeMon(8,34);       // WARTORTLE  Lv34  (always present)
  startBattle(pidgeotto,true,'RIVAL');
  game.battle!.foeTeam=[kadabra,wartortle];
  game.battle!.isBigRival=true;
}

export function startBlaineBattle(){
  const growlithe=makeMon(58,57);
  const rapidash =makeMon(78,59);
  const magmar   =makeMon(126,60);
  const arcanine =makeMon(59,62);
  startBattle(growlithe,true,'BLAINE');
  game.battle!.foeTeam=[rapidash,magmar,arcanine];
  game.battle!.isBlaine=true;
}

export function startCinnaRivalBattle(){
  const pidgeot  =makeMon(18,58);
  const alakazam =makeMon(65,59);
  const rhydon   =makeMon(112,60);
  const exeggutor=makeMon(103,60);
  const blastoise=makeMon(9,62);
  blastoise.mega=true;
  blastoise.atk=Math.round(blastoise.atk*1.3); blastoise.def=Math.round(blastoise.def*1.35);
  blastoise.spc=Math.round(blastoise.spc*1.35); blastoise.spe=Math.round(blastoise.spe*1.25);
  blastoise.hp=blastoise.maxHp;
  startBattle(pidgeot,true,'RIVAL');
  game.battle!.foeTeam=[alakazam,rhydon,exeggutor,blastoise];
  game.battle!.isCinnaRival=true;
}

export function startMistyBattle(){
  const magikarp=makeMon(129,30);      // Magikarp Lv30
  const gyarados=makeMon(130,33);      // Gyarados Lv33
  const golduck =makeMon(55,35);       // GOLDUCK  Lv35  (her ace, sent last)
  startBattle(magikarp,true,'MISTY');
  game.battle!.foeTeam=[gyarados,golduck];
  game.battle!.isMisty=true;
}

export function startMarowakBattle(){
  const m=makeMon(105,66);
  m.atk=Math.round(m.atk*1.6); m.def=Math.round(m.def*1.5);
  m.spc=Math.round(m.spc*1.4); m.spe=Math.round(m.spe*1.3);
  m.hp=m.maxHp;
  startBattle(m,true,'MAROWAK');
  game.battle!.isMarowak=true;
}

export function marowakEnd(){
  game.flags.marowakSeen=true;
  game.npcs=game.npcs.filter(n=>n.name!=='GHOST_MAROWAK');
  healParty();
  game.battle=null; game.state=State.WORLD;
  dialogue([
    "The crazed MAROWAK let out\na final shriek...",
    "...then melted into the\nmist and was gone.",
    "Your POKEMON were nursed\nback to health. The path\nsouth is clear."
  ]);
}

export function startKogaBattle(){
  const weezing =makeMon(110,44);
  const arbok   =makeMon(24,46);
  const muk     =makeMon(89,48);
  const nidoking=makeMon(34,50);
  const venomoth=makeMon(49,50);
  const gengar  =makeMon(94,52);
  gengar.mega=true;
  gengar.atk=Math.round(gengar.atk*1.35); gengar.def=Math.round(gengar.def*1.3);
  gengar.spc=Math.round(gengar.spc*1.4);  gengar.spe=Math.round(gengar.spe*1.35);
  gengar.hp=gengar.maxHp;
  startBattle(weezing,true,'KOGA');
  game.battle!.foeTeam=[arbok,muk,nidoking,venomoth,gengar];
  game.battle!.isKoga=true;
}

export function startSteelGymBattle(){
  // JASPER — STEEL-type LEADER, levels 35-45 as advertised in dialogue.
  const onix      = makeMon(95, 35);
  const magneton  = makeMon(82, 38);
  const forretress= makeMon(205, 40);
  const scizor    = makeMon(212, 42);
  const skarmory  = makeMon(227, 43);
  const steelix   = makeMon(208, 45);
  startBattle(onix, true, 'JASPER');
  game.battle!.foeTeam=[magneton,forretress,scizor,skarmory,steelix];
  game.battle!.isSteelGym=true;
}

export function startMirageGymBattle(){
  // NOVA — PSYCHIC LEADER, levels 46-52 (sits just above the IRON cap of 48).
  const drowzee = makeMon(96, 46);
  const slowbro = makeMon(80, 48);
  const hypno   = makeMon(97, 49);
  const starmie = makeMon(121, 50);
  const exeggutor=makeMon(103, 51);
  const alakazam= makeMon(65, 52);
  startBattle(drowzee, true, 'NOVA');
  game.battle!.foeTeam=[slowbro,hypno,starmie,exeggutor,alakazam];
  game.battle!.isMirageGym=true;
}

export function startNormanBattle(){
  // NORMAN (Dad) — NORMAL-type LEADER, Lv 52-58.
  const tauros    = makeMon(128, 52);
  const persian   = makeMon(53, 53);
  const lickitung = makeMon(108, 54);
  const kangaskhan= makeMon(115, 55);
  const miltank   = makeMon(241, 56);
  const snorlax   = makeMon(143, 58);
  startBattle(tauros, true, 'NORMAN');
  game.battle!.foeTeam=[persian,lickitung,kangaskhan,miltank,snorlax];
  game.battle!.isNorman=true;
}

export function startAquaSkyBattle(){
  // TEAM AQUA grunt in the sky — Water/Flying-ish team, Lv 54-58.
  const golbat   = makeMon(42, 54);
  const tentacruel=makeMon(73, 55);
  const quagsire = makeMon(195, 56);
  const gyarados = makeMon(130, 58);
  startBattle(golbat, true, 'AQUA GRUNT');
  game.battle!.foeTeam=[tentacruel,quagsire,gyarados];
  game.battle!.isAquaSky=true;
}

export function startBirchGymBattle(){
  // LEADER ROWAN — mixed "strongest" team, Lv 58-64. Final gym before Elite 4.
  const gengar   = makeMon(94, 58);
  const machamp  = makeMon(68, 59);
  const scyther  = makeMon(123, 60);
  const gyarados = makeMon(130, 61);
  const arcanine = makeMon(59, 62);
  const dragonite= makeMon(149, 64);
  startBattle(gengar, true, 'ROWAN');
  game.battle!.foeTeam=[machamp,scyther,gyarados,arcanine,dragonite];
  game.battle!.isBirchGym=true;
}

export function startAuroraGymBattle(){
  // LEADER TESLA — ELECTRIC / storm team, Lv 60-66. Final gym before the big event.
  const magneton = makeMon(82, 60);
  const fearow   = makeMon(22, 61);
  const electabuzz=makeMon(125, 62);
  const jolteon  = makeMon(135, 63);
  const aerodactyl=makeMon(142, 64);
  const raichu   = makeMon(26, 66);
  startBattle(magneton, true, 'TESLA');
  game.battle!.foeTeam=[fearow,electabuzz,jolteon,aerodactyl,raichu];
  game.battle!.isAuroraGym=true;
}

export function startZenithGymBattle(){
  // LEADER ASTRA — the region's final, champion-tier gym. Lv 66-72, mixed elite team.
  const scizor    = makeMon(212, 66);
  const gengar    = makeMon(94, 67);
  const tyranitar = makeMon(248, 68);
  const snorlax   = makeMon(143, 69);
  const metagross = makeMon(376, 70);
  const dragonite = makeMon(149, 72);
  startBattle(scizor, true, 'ASTRA');
  game.battle!.foeTeam=[gengar,tyranitar,snorlax,metagross,dragonite];
  game.battle!.isZenithGym=true;
}

/* ===========================================================================
   CLIMAX PART 1 — "The Volcano"
   Beat ASTRA -> auto-fly to OLDALE -> Mom call -> Fly to PETALBURG ->
   Dinner with NORMAN/MAY/BIRCH/STEVEN/MOM -> Fly to LEAGUE ->
   Steven's call -> METAGROSS -> MAGMA_VOLCANO -> grunts -> MAXIE -> GROUDON
=========================================================================== */

export function startMaxieClimaxBattle(){
  // Maxie — Magma boss. Fire/Dark team, no mega.
  const mightyena = makeMon(262, 70);   // Dark
  const magcargo  = makeMon(219, 72);   // Fire/Rock
  const houndoom  = makeMon(229, 73);   // Dark/Fire
  const arcanine  = makeMon(59,  75);   // Fire ace
  startBattle(mightyena, true, 'MAXIE');
  game.battle!.foeTeam = [magcargo, houndoom, arcanine];
  game.battle!.isMaxieClimax = true;
}


export function startGroudonClimaxFight(){
  const groudon = makeMon(383, 80);
  // Boss buff — Drought-charged form.
  groudon.atk = Math.round(groudon.atk * 1.15);
  groudon.def = Math.round(groudon.def * 1.1);
  groudon.hp  = groudon.maxHp = Math.round(groudon.maxHp * 1.25);
  startBattle(groudon, false);
  game.battle!.label = 'GROUDON';
  game.battle!.isGroudonClimax = true;
}

// ===== CLIMAX PART 2 — ARCHIE + KYOGRE =====

export function startArchieBattle(){
  // Archie — AQUA boss. All-water four-mon ace team.
  const tentacruel = makeMon(73,  70);  // Water/Poison
  const gyarados   = makeMon(130, 72);  // Water/Flying — intimidate
  const lapras     = makeMon(131, 73);  // Water/Ice tank
  const kingdra    = makeMon(230, 75);  // Dragon/Water ace
  startBattle(tentacruel, true, 'ARCHIE');
  game.battle!.foeTeam = [gyarados, lapras, kingdra];
  game.battle!.isArchieClimax = true;
}


export function startKyogreClimaxFight(){
  const kyogre = makeMon(382, 80);
  // Boss buff — Drizzle-empowered form (mirrors Groudon).
  kyogre.atk = Math.round(kyogre.atk * 1.10);
  kyogre.spc = Math.round(kyogre.spc * 1.15);
  kyogre.hp  = kyogre.maxHp = Math.round(kyogre.maxHp * 1.25);
  startBattle(kyogre, false);
  game.battle!.label = 'KYOGRE';
  game.battle!.isKyogreClimax = true;
  game.battle!.noCatch = true;
  game.battle!.noCatchMsg = "KYOGRE is too vast\nto be contained by\nany BALL!";
}


// ===== CLIMAX PART 3 — SKY ISLAND + RAYQUAZA =====
// Rayquaza cinematic sprite (provided by Sean) — separate from the in-battle PokeAPI sprite.

export function startSabrinaBattle(){
  const hypno=makeMon(97,51);
  const slowbro=makeMon(80,52);
  const alakazam=makeMon(65,53);
  alakazam.mega=true;
  alakazam.atk=Math.round(alakazam.atk*1.3); alakazam.def=Math.round(alakazam.def*1.3);
  alakazam.spc=Math.round(alakazam.spc*1.4); alakazam.spe=Math.round(alakazam.spe*1.35);
  alakazam.hp=alakazam.maxHp;
  startBattle(hypno,true,'SABRINA');
  game.battle!.foeTeam=[slowbro,alakazam];
  game.battle!.isSabrina=true;
}

export function startViridianBattle(){
  const nidoking =makeMon(34,60);
  const nidoqueen=makeMon(31,61);
  const dugtrio  =makeMon(51,62);
  const rhydon   =makeMon(112,63);
  const persian  =makeMon(53,65);
  const kang     =makeMon(115,67);
  kang.mega=true;
  kang.atk=Math.round(kang.atk*1.4); kang.def=Math.round(kang.def*1.35);
  kang.spc=Math.round(kang.spc*1.3); kang.spe=Math.round(kang.spe*1.3);
  kang.hp=kang.maxHp;
  startBattle(nidoking,true,'GIOVANNI');
  game.battle!.foeTeam=[nidoqueen,dugtrio,rhydon,persian,kang];
  game.battle!.isViridianBoss=true;
}

export function startMewtwoBoss(){
  const x=makeMon(150,74); x.mega=true; x.megaImg=MEGA_MEWTWO_X;
  x.atk=Math.round(x.atk*1.3);  x.def=Math.round(x.def*1.3);
  x.spc=Math.round(x.spc*1.35); x.spe=Math.round(x.spe*1.3);  x.hp=x.maxHp;
  const y=makeMon(150,77); y.mega=true; y.megaImg=MEGA_MEWTWO_Y;
  y.atk=Math.round(y.atk*1.4);  y.def=Math.round(y.def*1.35);
  y.spc=Math.round(y.spc*1.45); y.spe=Math.round(y.spe*1.35); y.hp=y.maxHp;
  startBattle(x,true,'MEWTWO');
  if(game.battle){ game.battle!.foeTeam=[y]; game.battle!.isMewtwoBoss=true; }
}

export function startLeagueRivalBattle(){
  startBattle(makeMon(18,66),true,'RIVAL');
  game.battle!.foeTeam=[makeMon(112,67),makeMon(65,68),makeMon(94,68),makeMon(59,69),mkMega(9,72)];
  game.battle!.isLeagueRival=true;
}

export function startSilphBattle(){
  const dugtrio=makeMon(51,48);
  const rhydon=makeMon(112,49);
  const nidoqueen=makeMon(31,50);
  const nidoking=makeMon(34,50);
  const persian=makeMon(53,54);
  const kang=makeMon(115,56);
  kang.mega=true;
  kang.atk=Math.round(kang.atk*1.35); kang.def=Math.round(kang.def*1.3);
  kang.spc=Math.round(kang.spc*1.3);  kang.spe=Math.round(kang.spe*1.3);
  kang.hp=kang.maxHp;
  startBattle(dugtrio,true,'GIOVANNI');
  game.battle!.foeTeam=[rhydon,nidoqueen,nidoking,persian,kang];
  game.battle!.isSilphBoss=true;
}

export function startErikaBattle(){
  const venusaur =makeMon(3,53);       // Venusaur  Lv53
  const meganium =makeMon(154,49);     // Meganium  Lv49
  const vileplume=makeMon(45,48);      // Vileplume Lv48
  const victreebel=makeMon(71,45);     // Victreebel Lv45  (sent last)
  startBattle(venusaur,true,'ERIKA');
  game.battle!.foeTeam=[meganium,vileplume,victreebel];
  game.battle!.isErika=true;
}

export function startGiovanniBattle(){
  const dugtrio =makeMon(51,42);       // Dugtrio  Lv42
  const rhyhorn =makeMon(111,44);      // Rhyhorn  Lv44
  const nidoqueen=makeMon(31,46);      // Nidoqueen Lv46
  const nidoking =makeMon(34,48);      // NIDOKING  Lv48  (ace, sent last)
  startBattle(dugtrio,true,'GIOVANNI');
  game.battle!.foeTeam=[rhyhorn,nidoqueen,nidoking];
  game.battle!.isGiovanni=true;
}

export function startSurgeBattle(){
  const pikachu   =makeMon(25,34);     // Pikachu    Lv34
  const electrode =makeMon(101,37);    // Electrode  Lv37
  const magneton  =makeMon(82,38);     // Magneton   Lv38
  const electabuzz=makeMon(125,39);    // Electabuzz Lv39
  const raichu    =makeMon(26,40);     // RAICHU     Lv40  (ace, sent last)
  startBattle(pikachu,true,'LT.SURGE');
  game.battle!.foeTeam=[electrode,magneton,electabuzz,raichu];
  game.battle!.isSurge=true;
}

export function startShipRivalBattle(){
  const pidgeotto=makeMon(17,33);      // Pidgeotto Lv33
  const kadabra  =makeMon(64,37);      // Kadabra   Lv37
  const blastoise=makeMon(9,40);       // BLASTOISE Lv40  (ace, sent last)
  startBattle(pidgeotto,true,'RIVAL');
  game.battle!.foeTeam=[kadabra,blastoise];
  game.battle!.isShipRival=true;
}

export function startMakerRescue(){
  const foe=makeMon(20,16);            // THUG's Raticate Lv16
  startBattle(foe,true,'THUG');
  game.battle!.isMakerRescue=true;
}

export function markSeen(id){ if(id) game.dex.seen[id]=1; }

export function markCaught(id){ if(id){ game.dex.seen[id]=1; game.dex.caught[id]=1; } }

export function startBattle(foe,isTrainer?,label?){
  const me=game.party.find(m=>m.hp>0);
  if(!me){ blackout(); return; }
  markSeen(foe.id); markSeen(me.id);
  game.battle={
    foe, me, isTrainer, foeLabel: isTrainer ? (label||'RIVAL') : null,
    msg:null, msgQ:[],
    phase:'intro',         // intro -> menu -> ... -> end
    sub:null,              // 'fight' | 'bag' | 'party' | null
    selIdx:0,
    foeShake:0, meShake:0, flash:0,
    over:false, result:null,
    introT:0,
    foeHpShown:foe.hp, meHpShown:me.hp,
    _foeHpLast:foe.hp, _meHpLast:me.hp,
    _foeRef:foe, _meRef:me, floats:[]
  };
  game.state=State.BATTLE;
  Audio.battleStart();
  bMsg((isTrainer? game.battle!.foeLabel+" sent out\n" : "Wild ")+foe.name+(isTrainer?"!":" appeared!"),()=>{
    bMsg("Go! "+me.name+"!",()=>{ game.battle!.phase='menu'; });
  });
}

export function bMsg(text,after?){
  const b=game.battle!;
  b.msgQ.push({text,after:after||null});
  if(!b.msg) bNext();
}

export function bNext(){
  const b=game.battle!;
  if(b.msgQ.length===0){ b.msg=null; return; }
  const m=b.msgQ.shift()!;
  b.msg={ text:m.text, char:0, t:0, done:false, after:m.after };
}

export function playerMove(moveIdx){
  const b=game.battle!;
  const me=b.me, foe=b.foe;
  const mv=me.moves[moveIdx];
  if(mv.ppNow<=0){ bMsg("No PP left for that move!"); return; }
  mv.ppNow--;
  b.phase='resolve';
  // turn order by speed
  const meFirst = me.spe>=foe.spe;
  const doMe=()=>{
    if(me.hp<=0) return doFoe(true);
    const r=dmg(me,foe,mv);
    if(r.miss){ bMsg(me.name+" used "+mv.name+"!",()=>bMsg(me.name+"'s attack missed!",cont1)); return; }
    bMsg(me.name+" used "+mv.name+"!",()=>{
      foe.hp=Math.max(0,foe.hp-r.dealt);
      b.foeShake=8; Audio.hit(r.eff);
      const ex=r.eff===0?"It doesn't affect "+foe.name+"...":
               r.eff>1?"It's super effective!":r.eff<1&&r.eff>0?"It's not very\neffective...":null;
      const fin=()=>{ if(foe.hp<=0){ winFoe(); } else cont1(); };
      if(r.crit) bMsg("A critical hit!",()=>{ ex?bMsg(ex,fin):fin(); });
      else ex?bMsg(ex,fin):fin();
    });
  };
  const doFoe=(skipIfDead)=>{
    if(foe.hp<=0){ if(!skipIfDead) winFoe(); else { b.phase='menu'; } return; }
    const fm=foe.moves[Math.floor(Math.random()*foe.moves.length)];
    const r=dmg(foe,me,fm);
    if(r.miss){ bMsg("Foe "+foe.name+" used\n"+fm.name+"!",()=>bMsg("Its attack missed!",cont2)); return; }
    bMsg("Foe "+foe.name+" used\n"+fm.name+"!",()=>{
      me.hp=Math.max(0,me.hp-r.dealt);
      b.meShake=8; b.flash=6; Audio.hit(r.eff);
      const ex=r.eff===0?"It doesn't affect\n"+me.name+"...":
               r.eff>1?"It's super effective!":r.eff<1&&r.eff>0?"It's not very\neffective...":null;
      const fin=()=>{ if(me.hp<=0){ faint(); } else cont2(); };
      if(r.crit) bMsg("A critical hit!",()=>{ ex?bMsg(ex,fin):fin(); });
      else ex?bMsg(ex,fin):fin();
    });
  };
  let cont1,cont2;
  if(meFirst){ cont1=()=>doFoe(false); cont2=()=>{ b.phase='menu'; }; doMe(); }
  else       { cont1=()=>{ b.phase='menu'; }; cont2=()=>doMe2(); doFoe(false); }
  function doMe2(){
    if(me.hp<=0){ b.phase='menu'; return; }
    const r=dmg(me,foe,mv);
    if(r.miss){ bMsg(me.name+" used "+mv.name+"!",()=>bMsg(me.name+"'s attack missed!",()=>{b.phase='menu';})); return; }
    bMsg(me.name+" used "+mv.name+"!",()=>{
      foe.hp=Math.max(0,foe.hp-r.dealt);
      b.foeShake=8; Audio.hit(r.eff);
      const ex=r.eff>1?"It's super effective!":r.eff<1&&r.eff>0?"It's not very\neffective...":null;
      const fin=()=>{ if(foe.hp<=0) winFoe(); else b.phase='menu'; };
      if(r.crit) bMsg("A critical hit!",()=>{ ex?bMsg(ex,fin):fin(); });
      else ex?bMsg(ex,fin):fin();
    });
  }
}

export function expGainFor(mon, foe){
  const base=Math.floor((foe.base.hp+foe.base.atk+foe.base.spe)*foe.level/16)+10;
  // EXP by level gap (mon.level - foe.level):
  //   defeated mon level < 5    -> 1 level only
  //   foe HIGHER level than mon -> ~2+ levels
  //   foe 0-20 levels below mon -> ~1 level
  //   foe 21+ levels below mon  -> half of base EXP
  const gap=mon.level - foe.level;
  const oneLevel  = (mon.xpNext-mon.xp) + 1;
  const twoLevels = (mon.xpNext-mon.xp) + Math.pow(mon.level+1,3) + 1;
  let gain;
  if(foe.level < 5)      gain=oneLevel;
  else if(gap < 0)       gain=twoLevels;
  else if(gap <= 20)     gain=oneLevel;
  else                   gain=Math.max(1, Math.floor(base/2));
  return Math.max(1, Math.floor(gain));
}

export function applyExp(mon, amount){
  const startLv=mon.level;
  mon.xp+=amount; let leveled=false;
  while(mon.xp>=mon.xpNext && mon.level<100){
    mon.xp-=mon.xpNext; mon.level++; mon.xpNext=mon.level*mon.level*mon.level;
    const oldMax=mon.maxHp; recalc(mon,false); if(mon.hp>0) mon.hp+=(mon.maxHp-oldMax);
    leveled=true;
  }
  if(mon.level>=100) mon.xp=0;
  const evolutions: any[]=[]; const evoMsgs: string[]=[]; let evt;
  while((evt=evolve(mon))){
    evolutions.push({ mon, fromId:evt.fromId, fromName:evt.fromName, toId:evt.toId, toName:evt.toName });
    evoMsgs.push(evt.fromName+" evolved\ninto "+evt.toName+"!");
  }
  const learnMsgs: string[]=[];
  if(mon.level>startLv){
    for(const e of learnList(mon.id)){
      if(e.lv>startLv && e.lv<=mon.level && !mon.moves.some(mm=>mm.key===e.key)){
        const nm=makeMoveObjs([e.key])[0];
        if(mon.moves.length<4) mon.moves.push(nm);
        else { mon.moves.shift(); mon.moves.push(nm); }
        learnMsgs.push(mon.name+" learned\n"+nm.name+"!");
      }
    }
  }
  return { leveled, evoMsgs, learnMsgs, evolutions };
}

export function winFoe(){
  const b=game.battle!;
  const me=b.me, foe=b.foe;
  const cap=()=>game.flags.levelCap||9999;
  // Multi-Pokemon trainers: send the next mon instead of ending the battle.
  const concludeWin=()=>{
    const bb=game.battle;
    if(bb && bb.foeTeam && bb.foeTeam.length){
      // STEVEN's mid-battle taunt, fired once when his team drops to half (3 left in queue).
      const stevenTaunt = bb.isStevenChamp && bb.foeTeam.length===3 && !bb.stevenTaunted;
      const nf=bb.foeTeam.shift()!;
      bb.foe=nf; markSeen(nf.id);
      bb.foeShake=0; bb.flash=0; bb.phase='intro';
      const sendOut=()=>bMsg(nf.mega?(bb.foeLabel+"'s "+nf.name+"\nMega Evolved!"):(bb.foeLabel+" sent out\n"+nf.name+"!"),()=>{ bb.phase='menu'; });
      if(stevenTaunt){
        bb.stevenTaunted=true;
        bMsg("STEVEN: Beautiful. You're\neverything they said.\nBut steel only hardens\nunder pressure.",sendOut);
      } else sendOut();
    } else if(bb && bb.isErika && !bb.erikaMegaDone){
      bb.erikaMegaDone=true;
      const mv=makeMon(3,55); mv.mega=true;
      mv.atk=Math.round(mv.atk*1.4); mv.def=Math.round(mv.def*1.35);
      mv.spc=Math.round(mv.spc*1.4); mv.spe=Math.round(mv.spe*1.3);
      mv.hp=mv.maxHp;
      bb.foe=mv; markSeen(3); bb.foeShake=0; bb.flash=0; bb.phase='intro';
      bMsg("ERIKA: Not yet! VENUSAUR,\nrespond to my heart!",()=>{
        bMsg("Erika's VENUSAUR\nMega Evolved into\nMEGA VENUSAUR!",()=>{ bb.phase='menu'; });
      });
    } else {
      game.flags.money=(game.flags.money|0)+2000;
      bMsg("You won! Earned P2000!",()=>endBattle(true));
    }
  };
  // EXP SHARE — benched mons each get exactly +1 level (unless over the LEVEL CAP)
  const shareThenEnd=()=>{
    if(game.flags.expShare){
      const others=game.party.filter(m=>m!==me);   // benched mons share, even if fainted
      if(others.length){
        const q: string[]=[];           // text-only msgs (level-up + move learns)
        const evolutions: any[]=[];  // cutscene events
        for(const m of others){
          if(m.level > cap()) continue;
          const rr=applyExp(m, (m.xpNext - m.xp) + 1);
          if(rr.leveled) q.push(m.name+" grew to\nLEVEL "+m.level+"!");
          for(const lm of rr.learnMsgs) q.push(lm);
          for(const evt of rr.evolutions) evolutions.push(evt);
        }
        if(q.length || evolutions.length){
          bMsg("The rest of your team\nshared in the EXP!",()=>{
            const playEvolutions=()=>{
              let j=0;
              const evoStep=()=>{ if(j<evolutions.length){ startEvolutionCutscene(evolutions[j++], evoStep); } else concludeWin(); };
              evoStep();
            };
            if(q.length){
              let i=0;
              const st=()=>{ if(i<q.length){ Audio.heal(); bMsg(q[i++],st); } else playEvolutions(); };
              st();
            } else playEvolutions();
          });
          return;
        }
      }
    }
    concludeWin();
  };
  bMsg((b.isTrainer? b.foeLabel+"'s " : "Wild ")+foe.name+" fainted!",()=>{
    if(me.level > cap()){
      bMsg(me.name+" is above the\nLEVEL CAP (Lv"+cap()+") —\nit gained no EXP!", shareThenEnd);
      return;
    }
    const gain=expGainFor(me,foe);
    bMsg(me.name+" gained\n"+gain+" EXP!",()=>{
      const r=applyExp(me,gain);
      const learns=r.learnMsgs, evols=r.evolutions;
      const playEvolutions=()=>{
        let j=0;
        const evoStep=()=>{ if(j<evols.length){ startEvolutionCutscene(evols[j++], evoStep); } else shareThenEnd(); };
        evoStep();
      };
      const playLearns=()=>{
        let i=0;
        const learnStep=()=>{ if(i<learns.length){ Audio.heal(); bMsg(learns[i++], learnStep); } else playEvolutions(); };
        learnStep();
      };
      if(r.leveled) bMsg(me.name+" grew to\nLEVEL "+me.level+"!", playLearns);
      else playLearns();
    });
  });
}
// Gen-1 LEVEL-UP evolutions only  { fromId:[toId, level] }
// (stone/trade evos like Pikachu, Eevee, Gastly-line don't evolve by level)
// Comprehensive evolution table.
// Canonical level-up evos are preserved; stone/trade/friendship evos are
// converted to level-up thresholds for our simplified mechanic.
// Format: { fromId:[toId, level] }

export const EVOLVE={
  // ---- Gen 1 (Kanto) ----
  1:[2,16],   2:[3,32],     // Bulbasaur line
  4:[5,16],   5:[6,36],     // Charmander line
  7:[8,16],   8:[9,36],     // Squirtle line
  10:[11,7],  11:[12,10],   // Caterpie line
  13:[14,7],  14:[15,10],   // Weedle line
  16:[17,18], 17:[18,36],   // Pidgey line
  19:[20,20],               // Rattata
  21:[22,20],               // Spearow
  23:[24,22],               // Ekans
  25:[26,22],               // Pikachu (was Thunder Stone)
  27:[28,22],               // Sandshrew
  29:[30,16], 30:[31,30],   // Nidoran F (30->31 was Moon Stone)
  32:[33,16], 33:[34,30],   // Nidoran M (33->34 was Moon Stone)
  35:[36,28],               // Clefairy (was Moon Stone)
  37:[38,32],               // Vulpix (was Fire Stone)
  39:[40,28],               // Jigglypuff (was Moon Stone)
  41:[42,22],               // Zubat
  43:[44,21], 44:[45,28],   // Oddish line (44->45 was Leaf Stone)
  46:[47,24],               // Paras
  48:[49,31],               // Venonat
  50:[51,26],               // Diglett
  52:[53,28],               // Meowth
  54:[55,33],               // Psyduck
  56:[57,28],               // Mankey
  58:[59,38],               // Growlithe (was Fire Stone)
  60:[61,25], 61:[62,35],   // Poliwag line (61->62 was Water Stone)
  63:[64,16],               // Abra line (64->65 needs LINK CABLE)
  66:[67,28],               // Machop line (67->68 needs LINK CABLE)
  69:[70,21], 70:[71,32],   // Bellsprout line (70->71 was Leaf Stone)
  72:[73,30],               // Tentacool
  74:[75,25],               // Geodude line (75->76 needs LINK CABLE)
  77:[78,40],               // Ponyta
  79:[80,37],               // Slowpoke
  81:[82,30],               // Magnemite
  84:[85,31],               // Doduo
  86:[87,34],               // Seel
  88:[89,38],               // Grimer
  90:[91,30],               // Shellder (was Water Stone)
  92:[93,25],               // Gastly line (93->94 needs LINK CABLE)
  96:[97,26],               // Drowzee
  98:[99,28],               // Krabby
  100:[101,30],             // Voltorb
  102:[103,28],             // Exeggcute (was Leaf Stone)
  104:[105,28],             // Cubone
  109:[110,35],             // Koffing
  111:[112,42],             // Rhyhorn
  113:[242,30],             // Chansey -> Blissey (was friendship)
  116:[117,32],             // Horsea line (117->230 needs LINK CABLE)
  118:[119,33],             // Goldeen
  120:[121,30],             // Staryu (was Water Stone)
  129:[130,20],             // Magikarp
  133:[134,25],             // Eevee -> Vaporeon (was Water Stone; one branch chosen)
  138:[139,40],             // Omanyte
  140:[141,40],             // Kabuto
  147:[148,30], 148:[149,55], // Dratini line

  // ---- Gen 2 (Johto) ----
  152:[153,16], 153:[154,32], // Chikorita line
  155:[156,14], 156:[157,36], // Cyndaquil line
  158:[159,18], 159:[160,30], // Totodile line
  161:[162,15],             // Sentret
  163:[164,20],             // Hoothoot
  165:[166,18],             // Ledyba
  167:[168,22],             // Spinarak
  170:[171,27],             // Chinchou
  173:[35,18],              // Cleffa -> Clefairy (was friendship)
  174:[39,18],              // Igglybuff -> Jigglypuff (was friendship)
  175:[176,22],             // Togepi -> Togetic (was friendship)
  177:[178,25],             // Natu
  179:[180,15], 180:[181,30], // Mareep line
  183:[184,18],             // Marill
  187:[188,18], 188:[189,27], // Hoppip line
  191:[192,25],             // Sunkern (was Sun Stone)
  194:[195,20],             // Wooper
  204:[205,31],             // Pineco
  209:[210,23],             // Snubbull
  216:[217,30],             // Teddiursa
  218:[219,38],             // Slugma
  220:[221,33],             // Swinub
  223:[224,25],             // Remoraid
  228:[229,24],             // Houndour
  231:[232,25],             // Phanpy
  236:[237,20],             // Tyrogue -> Hitmontop (canonically stat-based branch)
  238:[124,30],             // Smoochum -> Jynx
  239:[125,30],             // Elekid -> Electabuzz
  240:[126,30],             // Magby -> Magmar
  246:[247,30], 247:[248,55], // Larvitar line

  // ---- Gen 3 (Hoenn early) ----
  252:[253,16], 253:[254,36], // Treecko line
  255:[256,16], 256:[257,36], // Torchic line
  258:[259,16], 259:[260,36], // Mudkip line
  261:[262,18],             // Poochyena
  263:[264,20],             // Zigzagoon
  265:[266,7],              // Wurmple -> Silcoon (one branch; canonically random)
  266:[267,10],             // Silcoon -> Beautifly
  268:[269,10],             // Cascoon -> Dustox (in case Cascoon ever obtained)
  270:[271,14], 271:[272,25], // Lotad line (271->272 was Water Stone)
  273:[274,14], 274:[275,28], // Seedot line (274->275 was Leaf Stone)
  280:[281,20], 281:[282,30], // Ralts line (Wally's gift evolves!)
  304:[305,32], 305:[306,42]  // Aron line (Gen 3 Steel/Rock)
};
// Trade evolutions — these require a LINK CABLE item to evolve.
// Format: { fromId: toId }

export const TRADE_EVOLVE = {
  64:  65,    // Kadabra  -> Alakazam
  67:  68,    // Machoke  -> Machamp
  75:  76,    // Graveler -> Golem
  93:  94,    // Haunter  -> Gengar
  95:  208,   // Onix     -> Steelix (canonically trade w/ Metal Coat)
  117: 230,   // Seadra   -> Kingdra (canonically trade w/ Dragon Scale)
  123: 212,   // Scyther  -> Scizor  (canonically trade w/ Metal Coat)
  137: 233    // Porygon  -> Porygon2 (canonically trade w/ Upgrade)
};
// Friendship-based evolutions. Mon evolves when friendship reaches threshold
// AND the next applyExp() call fires. Friendship is tracked on each mon and
// raised by: +1 per overworld step, +1 per battle won, +5 per heal at PC.

export const FRIENDSHIP_THRESHOLD = 120;

export const FRIENDSHIP_EVOLVE = {
  42: 169     // Golbat -> Crobat (Gen 2 friendship evolution)
};

export function evolve(mon){
  // Friendship-evolution path: takes priority if eligible
  const fEvo = FRIENDSHIP_EVOLVE[mon.id];
  if(fEvo && (mon.friendship|0) >= FRIENDSHIP_THRESHOLD){
    const fromId=mon.id, fromName=mon.name;
    const d=DEX[fEvo-1];
    if(d){
      mon.id=fEvo; mon.name=d[0].toUpperCase(); mon.t1=d[1]; mon.t2=d[2];
      mon.base={hp:d[3],atk:d[4],def:d[5],spc:d[6],spe:d[7]};
      markCaught(mon.id);
      recalc(mon,false);
      return { fromId, fromName, toId:mon.id, toName:mon.name };
    }
  }
  // Level-up evolution path
  const e=EVOLVE[mon.id];
  if(!e || mon.level < e[1]) return null;
  const fromId=mon.id, fromName=mon.name;
  const d=DEX[e[0]-1];
  mon.id=e[0]; mon.name=d[0].toUpperCase(); mon.t1=d[1]; mon.t2=d[2];
  mon.base={hp:d[3],atk:d[4],def:d[5],spc:d[6],spe:d[7]};
  markCaught(mon.id);
  recalc(mon,false);            // keep current HP, raise the max
  return { fromId, fromName, toId:mon.id, toName:mon.name };
}
/* ---------------------------------------------------------------------------
   Evolution cutscene (~5 seconds; A skips/dismisses)
--------------------------------------------------------------------------- */

export function startEvolutionCutscene(evt, onDone){
  game.evolution = {
    fromId:   evt.fromId,
    fromName: evt.fromName,
    toId:     evt.toId,
    toName:   evt.toName,
    t: 0,
    phase: 'announce',
    onDone:  onDone || null,
    returnState: game.state
  };
  game.state = State.EVOLUTION;
  preloadMons([evt.fromId, evt.toId]);
  Audio.heal();
}

export function updateEvolution(dt){
  const e = game.evolution;
  if(!e){ game.state = State.WORLD; return; }
  e.t += dt;
  if(e.t < 1.2)      e.phase = 'announce';
  else if(e.t < 3.6) e.phase = 'morph';
  else if(e.t < 5.0) e.phase = 'reveal';
  else               e.phase = 'done';

  if(consume('a') || consume('b')){
    if(e.phase === 'done'){
      const cb = e.onDone, ret = e.returnState;
      game.evolution = null;
      game.state = ret;
      Audio.confirm();
      if(cb) cb();
      return;
    } else {
      // skip to final reveal phase
      e.t = 5.01; e.phase = 'done';
    }
  }
}

export function renderEvolution(){
  const e = game.evolution;
  if(!e) return;
  // black background
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);

  // Choose sprite for this frame
  const cx = VIEW_W/2 - 32;
  const cy = 24;
  let spriteId;
  if(e.phase === 'announce'){
    spriteId = e.fromId;
  } else if(e.phase === 'morph'){
    // alternate sprites; speed accelerates as morph progresses
    const morphT = e.t - 1.2;          // 0 .. 2.4
    const hz = 6 + morphT * 5;         // 6 -> 18 hz
    const tick = Math.floor(morphT * hz) % 2;
    spriteId = tick ? e.toId : e.fromId;
  } else { // reveal | done
    spriteId = e.toId;
  }
  drawMon(spriteId, cx, cy, 64);

  // pulsing white flash during morph
  if(e.phase === 'morph'){
    const morphT = e.t - 1.2;
    const flash = 0.18 + 0.35 * Math.abs(Math.sin(morphT * 7));
    ctx.fillStyle = 'rgba(255,255,255,' + flash + ')';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  // brief bright flash on the announce->morph and reveal entrances
  if(e.phase === 'announce' && e.t > 1.0){
    ctx.fillStyle = 'rgba(255,255,255,' + (e.t - 1.0) / 0.2 + ')';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }
  if(e.phase === 'reveal' && e.t < 3.8){
    ctx.fillStyle = 'rgba(255,255,255,' + (1 - (e.t - 3.6)/0.2) + ')';
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  }

  // dialog box at bottom
  let msg = '';
  if(e.phase === 'announce') msg = "What?\n" + e.fromName + " is\nevolving!";
  else if(e.phase === 'reveal' || e.phase === 'done')
    msg = "Congratulations!\n" + e.fromName + " evolved\ninto " + e.toName + "!";

  if(msg){
    const boxY = VIEW_H - 46;
    box(4, boxY, VIEW_W - 8, 42);
    text(msg, 10, boxY + 6, '#283040', 7);
  }
  // blinking ▼ indicator when waiting for A
  if(e.phase === 'done' && Math.floor(e.t * 2) % 2 === 0){
    text('\u25BC', VIEW_W - 14, VIEW_H - 12, '#283040', 6);
  }
}

export function faint(){
  const b=game.battle!;
  bMsg(b.me.name+" fainted!",()=>{
    const next=game.party.find(m=>m.hp>0 && m!==b.me);
    if(next){
      b.forced=true; b.sub=null; b.phase='menu';
      bMsg("Choose your next\nPOKEMON!",()=>{
        game.partyView={idx:0,ret:State.BATTLE};
        game.state=State.PARTY;
      });
    } else {
      bMsg("You have no POKEMON\nleft!",()=>{ if(game.battle&&game.battle!.isMarowak){ marowakEnd(); } else { endBattle(false); blackout(); } });
    }
  });
}

export function tryCatch(){
  const b=game.battle!;
  if(b.isTrainer){ bMsg("You can't catch a\ntrainer's POKEMON!"); b.phase='menu'; return; }
  if(b.noCatch){ bMsg(b.noCatchMsg || "It can't be caught\nlike that."); b.phase='menu'; return; }
  const useMaster=(game.bag.masterball|0)>0;
  const useGreat=!useMaster && (game.bag.greatball|0)>0;
  if(!useMaster && !useGreat && (game.bag.ball|0)<=0){ bMsg("You're out of BALLS!"); b.phase='menu'; return; }
  if(useMaster) game.bag.masterball--; else if(useGreat) game.bag.greatball--; else game.bag.ball--;
  const ballName=useMaster?"MASTER BALL":(useGreat?"GREAT BALL":"POKE BALL");
  b.phase='resolve';
  bMsg("You threw a "+ballName+"!",()=>{
    const foe=b.foe;
    // ONE real catch roll (shakes below are just flavor).
    const hpBonus  = (1 - foe.hp/foe.maxHp) * 0.40;          // up to +40% as HP drops
    const lowLvl   = Math.max(0, (15 - foe.level)/15) * 0.15; // small boost vs weak mons
    const catchP   = useMaster?1 : Math.max(0.40, Math.min(0.99, 0.55 + hpBonus + lowLvl + (useGreat?0.18:0)));
    const caught   = Math.random() < catchP;
    // shake count: 3 if caught, otherwise scaled to how close it was
    const shakes   = caught ? 3 : Math.min(2, Math.floor((Math.random()*catchP)*3));
    const shakeMsg=()=>{
      if(caught){
        Audio.heal();
        game.flags.money=(game.flags.money|0)+2000;
        bMsg("Gotcha! "+foe.name+"\nwas caught!",()=>{
          if(game.party.length<6){ markCaught(foe.id); game.party.push(foe); bMsg(foe.name+" joined\nyour party!",()=>endBattle(true,true)); }
          else { markCaught(foe.id); game.pc.push(foe); bMsg("Party is full! "+foe.name+"\nwas sent to the PC.",()=>endBattle(true,true)); }
        });
      } else {
        const m=["Oh no! It broke free!","Aww! So close!","It escaped the ball!"][Math.min(shakes,2)];
        bMsg(m,()=>foeTurnThenMenu());
      }
    };
    bMsg(shakes===0?"...":(shakes+(shakes===1?" shake...":" shakes...")),shakeMsg);
  });
}

export function foeTurnThenMenu(){
  const b=game.battle!, me=b.me, foe=b.foe;
  if(foe.hp<=0){ winFoe(); return; }
  const fm=foe.moves[Math.floor(Math.random()*foe.moves.length)];
  const r=dmg(foe,me,fm);
  if(r.miss){ bMsg("Foe "+foe.name+" used\n"+fm.name+"!",()=>bMsg("Its attack missed!",()=>{b.phase='menu';})); return; }
  bMsg("Foe "+foe.name+" used\n"+fm.name+"!",()=>{
    me.hp=Math.max(0,me.hp-r.dealt); b.meShake=8; b.flash=6; Audio.hit(r.eff);
    if(me.hp<=0) faint(); else b.phase='menu';
  });
}

export function useItemPotion(){
  const b=game.battle!;
  const useSuper=(game.bag.superpotion|0)>0;
  if(!useSuper && (game.bag.potion|0)<=0){ bMsg("You're out of POTIONS!"); b.phase='menu'; return; }
  if(b.me.hp>=b.me.maxHp){ bMsg(b.me.name+" is already\nat full health!"); b.phase='menu'; return; }
  const heal=useSuper?60:20, nm=useSuper?"SUPER POTION":"POTION";
  if(useSuper) game.bag.superpotion--; else game.bag.potion--;
  b.phase='resolve';
  b.me.hp=Math.min(b.me.maxHp,b.me.hp+heal);
  Audio.heal();
  bMsg("Used a "+nm+".\n"+b.me.name+" recovered HP!",()=>foeTurnThenMenu());
}

export function switchTo(idx){
  const b=game.battle!;
  const target=game.party[idx];
  if(!target||target.hp<=0){ bMsg("That POKEMON can't\nfight!"); return; }
  if(target===b.me){ bMsg(target.name+" is already\nin battle!"); return; }
  const wasForced=b.forced;
  b.me=target; b.sub=null; b.forced=false; b.phase='resolve';
  bMsg("Go! "+target.name+"!",()=>{ if(wasForced){ b.phase='menu'; } else foeTurnThenMenu(); });
}

export function tryRun(){
  const b=game.battle!;
  if(b.isTrainer){ bMsg("You can't run from a\ntrainer battle!"); b.phase='menu'; return; }
  b.phase='resolve';
  if(Math.random()<0.7){ bMsg("Got away safely!",()=>endBattle(true)); }
  else { bMsg("Can't escape!",()=>foeTurnThenMenu()); }
}

export function endBattle(playerOk, _caught?){
  const b=game.battle!;
  for(const m of game.party){ if(m.mega){ delete m.mega; recalc(m,false); } }
  // Friendship gain on victory (surviving mons grow attached)
  if(playerOk){
    for(const fM of game.party){
      if(fM && fM.hp > 0) fM.friendship = Math.min(255, (fM.friendship|0) + 1);
    }
  }
  if(b && b.isMarowak){ marowakEnd(); return; }
  // === Hoenn storyline battle handlers ===
  if(b.isBrawly && playerOk){
    game.flags.brawlyBeaten = true;
    game.flags.cascadeBadge = true;   // reused as KNUCKLE BADGE in display
    game.flags.levelCap = Math.max(game.flags.levelCap||35, 45);
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "BRAWLY: Whoa! A clean hit!\nThat's a wave I didn't see\ncoming!",
      "BRAWLY: Take this — the\nKNUCKLE BADGE!",
      "You received the\nKNUCKLE BADGE!",
      "BRAWLY: Your FIGHTING\nspirit is real. The next\nGYM won't be so chill —\nstay sharp!"
    ]);
    return;
  }
  if(b.isBrawlyApp1 && playerOk){
    game.flags.brawly_app1 = true;
    game.battle = null; game.state = State.WORLD;
    dialogue(["APPRENTICE: You're tough!\nBRAWLY's gonna love\nthis fight."]);
    return;
  }
  if(b.isBrawlyApp2 && playerOk){
    game.flags.brawly_app2 = true;
    game.battle = null; game.state = State.WORLD;
    dialogue(["APPRENTICE: Nice form!\nKeep going — BRAWLY's\nstraight ahead."]);
    return;
  }
  if(b.isMayRematch1 && playerOk){
    game.flags.mayRematch1 = true;
    game.npcs = game.npcs.filter(n => n.name !== 'MAY_VERDANTURF');
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "MAY: You're still ahead of\nme! But I'm catching up!",
      "MAY: Here — I picked this\nup from a fisherman.",
      "You received a SUPER\nPOTION from MAY!",
      "MAY: Go take down BRAWLY!\nI'll see you on the road."
    ], () => { game.bag.superpotion = (game.bag.superpotion || 0) + 1; Audio.heal(); });
    return;
  }
  if(b.isRusturfHiker1 && playerOk){
    game.flags.rt_hiker1 = true;
    game.battle = null; game.state = State.WORLD;
    dialogue(["HIKER: Hmph! Not bad,\nrookie. Mind the tunnel\nahead — it gets dark."]);
    return;
  }
  if(b.isRusturfHiker2 && playerOk){
    game.flags.rt_hiker2 = true;
    game.battle = null; game.state = State.WORLD;
    dialogue(["HIKER: I trained too long\nin one spot. You move\nquick."]);
    return;
  }
  if(b.isRusturfMagma && playerOk){
    game.flags.rt_magma = true;
    game.npcs = game.npcs.filter(n => n.name !== 'MAGMA_TUNNEL_GRUNT');
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "MAGMA GRUNT: Argh — fine!\nTake the stupid goods!",
      "The GRUNT drops a small\npackage labeled DEVON\nGOODS, then bolts north.",
      "You recovered the DEVON\nGOODS! (Plot point — TEAM\nMAGMA's up to something.)"
    ]);
    return;
  }
  if(b.isBirchIntro && playerOk){
    // Strip the borrowed Machoke and proceed
    game.party = game.party.filter(m => !m.borrowed);
    game.flags.introSeen = true;
    // Remove the cutscene NPCs
    game.npcs = game.npcs.filter(n => n.name !== 'INTRO_BIRCH' && n.name !== 'INTRO_POOCHYENA');
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "PROF. BIRCH: That was close!\nWhew. Thanks, trainer!",
      "PROF. BIRCH: I'll take\nMACHOKE back — that\none's been with me for\nyears.",
      "PROF. BIRCH: Come by my\nLAB. I've got a POKEMON\nfor you to keep — your\nown partner."
    ]);
    return;
  }
  if(b.isBirchIntro && !playerOk){
    // Should be near-impossible (Machoke Lv12 vs Poochyena Lv5), but handle it
    game.party = game.party.filter(m => !m.borrowed);
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "PROF. BIRCH: That's okay!\nLet's regroup. Try again!"
    ], () => triggerIntroCutscene());
    return;
  }
  if(b.isMayFirstFight && playerOk){
    game.flags.metMay = true;
    game.flags.mayBeaten = true;
    game.flags.pokedex = true;
    game.npcs = game.npcs.filter(n => n.name !== 'MAY_ROUTE2');
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "MAY: Wow — you're really\nstrong already!",
      "MAY: Dad told me to give\nyou this if you beat me.",
      "You received the POKEDEX!",
      "MAY: It records every\nPOKEMON you encounter.\nDad wants you to fill it.",
      "MAY: And take these too —\nyou'll need them.",
      "You received 5 POKE BALLS\nfrom MAY!",
      "MAY: Head north to\nRUSTBORO CITY — that's\nwhere the first GYM is.",
      "MAY: Watch out — TEAM\nMAGMA and TEAM AQUA have\nbeen seen in the region.\nSomething big is brewing."
    ], () => { game.bag.ball = (game.bag.ball || 0) + 5; Audio.heal(); });
    return;
  }
  if(b.isMagmaAdmin && playerOk){
    game.flags.magmaAdminBeaten = true;
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "MAGMA ADMIN: It's too\nlate, trainer!",
      "MAGMA ADMIN: I've already\ncompleted the AWAKENING\nRITUAL.",
      "The cave shakes violently.\nA monstrous roar splits\nthe stone!",
      "MAGMA ADMIN: Behold —\nGROUDON! The continent-\nshaper rises!",
      "GROUDON HAS RISEN!"
    ], () => startGroudonFight());
    return;
  }
  if(b.isMagmaAdmin && !playerOk){
    // Player blacks out — magma admin escapes, must come back
    return;
  }
  if(b.isMirageGroudon && playerOk){
    game.flags.mirageGroudonCalmed=true;
    game.battle=null; game.state=State.WORLD;
    healParty();
    dialogue([
      "GROUDON rumbles and sinks\nback into the earth.",
      "The lava cracks seal over.",
      "KYOGRE watches from the\nwater's edge."
    ], ()=>startMirageKyogreBattle());
    return;
  }
  if(b.isMirageGroudon && !playerOk){
    game.battle=null; game.state=State.WORLD;
    healParty();
    dialogue(["The island healed your\nteam. GROUDON still waits."],
      ()=>{ game.flags.mirageGroudonCalmed=false; });
    return;
  }
  if(b.isMirageKyogre && playerOk){
    game.flags.mirageKyogreCalmed=true; game.flags.mirageFinale=true;
    game.battle=null; game.state=State.WORLD;
    healParty();
    dialogue([
      "KYOGRE rises fully, then\ndescends below the surface.",
      "The water stills. The island\ngoes perfectly quiet.",
      "STEVEN: Both of them yielded.",
      "STEVEN: I've studied lore\nmy entire life. This has\nnever happened before.",
      "STEVEN: You're not just\nHoenn's champion anymore.",
      "STEVEN: You're its anchor.",
      "* * * * * * * * * *",
      "   THE DELTA CHRONICLES",
      "         F I N A L E",
      "* * * * * * * * * *",
      "(GROUDON and KYOGRE rest.\nThe island stays visible\n\u2014 for you.)"
    ]);
    return;
  }
  if(b.isMirageKyogre && !playerOk){
    game.battle=null; game.state=State.WORLD;
    healParty();
    dialogue(["The sea breeze healed your\nteam. KYOGRE still waits."],
      ()=>{ game.flags.mirageKyogreCalmed=false; });
    return;
  }
  if(b.isGroudon && playerOk){
    game.flags.groudonDefeated = true;
    game.npcs = game.npcs.filter(n => n.name !== 'MAGMA_ADMIN');
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "GROUDON lets out a low\nrumble, then sinks back\ninto the deep earth.",
      "The cave stops shaking.\nQuiet returns.",
      "The MAGMA ADMIN stares\nat you in disbelief, then\nturns and bolts into the\ndarkness.",
      "You saved the region.\nThe POKEMON LEAGUE awaits\nbeyond this cave."
    ]);
    return;
  }
  if(b.isGroudon && !playerOk){
    // Lost to Groudon — admin doesn't repeat the ritual, just retry
    return;
  }
    if(b.isRival && playerOk){
    const wasFirst=!game.flags.rivalBeaten;
    game.flags.rivalBeaten=true;
    game.flags.rivalStage=(game.flags.rivalStage|0)+1;
    game.battle=null; game.state=State.WORLD;
    if(wasFirst){
      dialogue(["RIVAL: What?! I picked the\nwrong POKEMON?!",
                "RIVAL: My POKEMON didn't\neven know its best moves\nyet — that's the only\nreason you won!",
                "Find me up on ROUTE 1 for\na rematch. I'll have\ntaught it more by then."]);
    } else {
      const next = game.flags.rivalStage>=2
        ? "its full set of moves"
        : "one of its real moves";
      dialogue(["RIVAL: Argh — beaten again!",
                "RIVAL: Next time my\nPOKEMON will know "+next+".",
                "Come find me when you're\nready for another round."]);
    }
    return;
  }
  if(b.isGrunt && playerOk){
    game.flags.gruntBeaten=true;
    game.npcs=game.npcs.filter(n=>n.name!=='ROCKET_GRUNT');   // he flees right away
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "ROCKET GRUNT: Tch! You\ngot lucky, brat!",
      "The ROCKET GRUNT shoved\npast you and bolted out\nof the MART!",
      "CLERK: Th-thank you! You\nsaved the shop!",
      "CLERK: Say — this PARCEL\narrived for PROF. OAK.\nCould you deliver it?",
      "You received OAK'S\nPARCEL!"
    ],()=>{ game.flags.parcel=true; });
    return;
  }
  if(b.isRocketBoss && playerOk){
    game.flags.rocketBossBeaten=true;
    game.npcs=game.npcs.filter(n=>n.name!=='ROCKET_BOSS');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "ROCKET BOSS: Gah...! Beaten\nby some rookie?!",
      "The ROCKET BOSS hurled a\nsmoke pellet and vanished\ninto the dark.",
      "You cleared out the old\nTEAM ROCKET HIDEOUT!\nThe region owes you one."
    ]);
    return;
  }
  if(b.isBrock && playerOk){
    game.flags.brockBeaten=true;
    game.flags.boulderBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,35);
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "ROXANNE: ...Impressive.\nYour POKEMON fight with\nreal heart.",
      "ROXANNE: As proof of your\nvictory, take this — the\nSTONE BADGE!",
      "You received the\nSTONE BADGE!",
      "ROXANNE: With this, you're\nan official trainer of\nHOENN. Keep climbing —\nthe region is waiting."
    ]);
    return;
  }
  if(b.isMakerRescue && playerOk){
    game.flags.makerSaved=true;
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "THUG: Gah! Forget it —\nthese aren't worth the\ntrouble!",
      "The THUG bolted out of\nVIRIDIAN CITY.",
      "POKEMON MAKER: You saved\nthem! Thank you, trainer.",
      "POKEMON MAKER: Please —\ntake one of my GEN 2\nPOKEMON as my thanks."],
      ()=>offerGen2Choice());
    return;
  }
  if(b.isGiovanni && playerOk){
    game.flags.giovanniBeaten=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,50);
    game.npcs=game.npcs.filter(n=>n.name!=='GIOVANNI');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "GIOVANNI: ...Impressive.\nFew trainers could best\nTEAM ROCKET's leader.",
      "GIOVANNI: I underestimated\nyou. We will withdraw...\nfor now.",
      "GIOVANNI vanished into\nthe shadows. The HIDEOUT\nfell silent.",
      "LEVEL CAP rose to 50."
    ]);
    return;
  }
  if(b.isSurge && playerOk){
    game.flags.surgeBeaten=true;
    game.flags.thunderBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,48);
    game.npcs=game.npcs.filter(n=>n.name!=='SURGE');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "LT.SURGE: Gwahaha! You're\nno rookie, soldier!",
      "LT.SURGE: My RAICHU is the\npride of this base — and\nyou dropped it!",
      "LT.SURGE: Take the THUNDER\nBADGE. You earned it!",
      "You received the\nTHUNDER BADGE!",
      "LT.SURGE: LEVEL CAP is up\nto 48. Dismissed!"
    ]);
    return;
  }
  if(b.isShipRival && playerOk){
    game.flags.shipRivalBeaten=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,45);
    game.npcs=game.npcs.filter(n=>n.name!=='SHIP_RIVAL');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "RIVAL: My BLASTOISE lost?!\nUgh, you're impossible!",
      "RIVAL: Fine. Go talk to\nthe CAPTAIN — I'm done\nhere.",
      "RIVAL: The LEVEL CAP rose\nto 45. ...Don't get\ncocky."
    ]);
    return;
  }
  if(b.isMisty && playerOk){
    game.flags.mistyBeaten=true;
    game.flags.cascadeBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,40);
    game.npcs=game.npcs.filter(n=>n.name!=='MISTY');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "MISTY: Wow... you really\nare strong! You beat my\nwhole team.",
      "MISTY: As proof, take the\nCASCADE BADGE!",
      "You received the\nCASCADE BADGE!",
      "MISTY: The LEVEL CAP rose\nto 40. Keep training!"
    ]);
    return;
  }
  if(b.isViridianBoss && playerOk){
    game.flags.viridianBeaten=true;
    game.flags.earthBadge=true;
    game.flags.noCap=true;
    game.flags.levelCap=100;   // LEVEL CAP removed after GIOVANNI
    game.npcs=game.npcs.filter(n=>n.name!=='GIOVANNI');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "GIOVANNI: ...So. TEAM ROCKET\nis truly finished. You\nhave bested me at last.",
      "You received the\nEARTH BADGE!",
      "GIOVANNI: With ROCKET gone,\nyour limits fall too. The\nLEVEL CAP is LIFTED!",
      "Your POKEMON can now grow\nall the way to Lv100!",
      "GIOVANNI: The POKEMON\nLEAGUE now opens to you.",
      "(MENU -> FLY -> LEAGUE to\nchallenge the ELITE FOUR\nand the CHAMPION!)"
    ]);
    return;
  }
  if(b.isMewtwoBoss && playerOk){
    game.flags.mewtwoBeaten=true;
    game.battle=null; game.state=State.WORLD;
    game.npcs=game.map.npcs.filter(n=>!n.present||n.present()).map(n=>Object.assign({},n));
    dialogue([
      "MEWTWO's mega forms\nshatter — it reverts,\nexhausted.",
      "MEWTWO retreats deeper\ninto the cave to rest...",
      "It can now be found and\nCAUGHT here. (A MASTER\nBALL is a sure thing.)"
    ]);
    return;
  }
  if(b.isHoennE4_1 && playerOk){ game.flags.hE4_1=true; game.battle=null; game.state=State.WORLD; dialogue(['SIDNEY: Impressive!\nNot many get past me.\nPHOEBE is next.']); return; }
  if(b.isHoennE4_2 && playerOk){ game.flags.hE4_2=true; game.battle=null; game.state=State.WORLD; dialogue(['PHOEBE: Our bonds were\nnot enough. GLACIA waits.']); return; }
  if(b.isHoennE4_3 && playerOk){ game.flags.hE4_3=true; game.battle=null; game.state=State.WORLD; dialogue(['GLACIA: My ice melted.\nA worthy trainer.\nDRAKE is ahead.']); return; }
  if(b.isHoennE4_4 && playerOk){ game.flags.hE4_4=true; game.battle=null; game.state=State.WORLD; dialogue(['DRAKE: My DRAGONS bow\nto your strength.\nSTEVEN STONE awaits.']); return; }
  if(b.isStevenChamp && playerOk){
    game.flags.stevenBeaten=true; game.flags.hoennChampBeaten=true;
    game.npcs=game.npcs.filter(n=>n.name!=='STEVEN_CHAMP');
    game.battle=null; game.state=State.WORLD; healParty(); Audio.heal();
    // Steven's defeat lines, then the Hall of Fame ceremony (sprites + warp home).
    dialogue([
      'STEVEN: ...You did it.',
      'STEVEN: I held this title\nfor years. Waiting for\nsomeone worthy.',
      'STEVEN: You calmed GROUDON\nand KYOGRE. RAYQUAZA bowed.\nMIRAGE ISLAND opened\nfor you alone.',
      'STEVEN: And now this.',
      'STEVEN: You are HOENN\'s\nCHAMPION. Come — let the\nregion record your team.'
    ], ()=>startHallOfFame()); return;
  }
  if((b.isHoennE4_1||b.isHoennE4_2||b.isHoennE4_3||b.isHoennE4_4||b.isStevenChamp) && !playerOk){ game.battle=null; return; }
  if(b.isLeagueRival && playerOk){
    game.flags.leagueBeaten=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,80);
    game.npcs=game.npcs.filter(n=>n.name!=='RIVAL');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "RIVAL: ...No way. Even my\nMEGA BLASTOISE couldn't\nstop you.",
      "RIVAL: You really are the\nbest there ever was.",
      "You defeated the ELITE\nFOUR and the CHAMPION!",
      "You are the new POKEMON\nLEAGUE CHAMPION!",
      "* * * HALL OF FAME * * *",
      ...game.party.map((m,i)=>
        (i+1)+".  "+m.name+"\nLv"+m.level+"   HP "+m.maxHp+"\nA true champion's partner."),
      "These POKEMON and YOU\nwill be remembered here\nforever.",
      "Thank you for playing\nPOKEMON: THE DELTA\nCRONICLES!\n— The end... for now."
    ]);
    game.flags.champion=true; Audio.heal();
    return;
  }
  if(b.isCinnaRival && playerOk){
    game.flags.cinnaRivalBeaten=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,64);
    game.npcs=game.npcs.filter(n=>n.name!=='RIVAL');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "RIVAL: ...Even my MEGA\nBLASTOISE wasn't enough?!",
      "RIVAL: Tch. Fine. BLAINE's\nGYM is all yours. Don't\nget cocky!",
      "The RIVAL storms off\ntoward the docks."
    ]);
    return;
  }
  if(b.isBlaine && playerOk){
    game.flags.blaineBeaten=true;
    game.flags.volcanoBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,64);
    game.npcs=game.npcs.filter(n=>n.name!=='BLAINE');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "BLAINE: Hah! My fire has\nbeen put out. You burn\nbrighter than I!",
      "You received the\nVOLCANO BADGE!",
      "BLAINE: The LEVEL CAP\nrises to 64. Go on!"
    ]);
    return;
  }
  if(b.isSabrina && playerOk){
    game.flags.sabrinaBeaten=true;
    game.flags.marshBadge=true;
    game.flags.hmSurf=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,58);
    game.npcs=game.npcs.filter(n=>n.name!=='SABRINA');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "SABRINA: ...I foresaw this\ndefeat. The future does\nnot lie.",
      "You received the\nMARSH BADGE!",
      "SABRINA: Take HM03 SURF.\nThe waves will obey you...\nin time.",
      "You received HM03 SURF!\n(You can't use it yet.)"
    ]);
    return;
  }
  if(b.isSilphBoss && playerOk){
    game.flags.silphBeaten=true;
    game.bag.masterball=(game.bag.masterball|0)+1;
    const lap=giveMon(131,50);
    game.flags.levelCap=Math.max(game.flags.levelCap||24,62);
    game.npcs=game.npcs.filter(n=>n.name!=='SILPH_GIOVANNI');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "GIOVANNI: Hmph! TEAM ROCKET\nretreats from SILPH... for\nnow.",
      "The SILPH PRESIDENT thanks\nyou and offers gifts!",
      "You received a\nMASTER BALL!",
      "The PRESIDENT also gives\nyou a LAPRAS!",
      lap
    ]);
    return;
  }
  if(b.isKoga && playerOk){
    game.flags.kogaBeaten=true;
    game.flags.soulBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,60);
    game.npcs=game.npcs.filter(n=>n.name!=='KOGA');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "KOGA: Fwahahaha! A ninja\nconcedes with honor.",
      "KOGA: Even my MEGA GENGAR\ncould not poison your\nresolve.",
      "You received the\nSOUL BADGE!",
      "KOGA: The LEVEL CAP rises\nto 60. Farewell!"
    ]);
    return;
  }
  if(b.isSteelGym && playerOk){
    game.flags.steelGymBeaten=true;
    game.flags.steelBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,48);
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "JASPER: ...My STEELIX fell.\nMy whole forge, undone.",
      "JASPER: You didn't just beat\nmy team \u2014 you out-thought\nit. That's true steel.",
      "You received the\nIRON BADGE!",
      "JASPER: The LEVEL CAP rises\nto 48. Now go see STEVEN \u2014\nhe's been waiting for\nsomeone like you."
    ]);
    return;
  }
  if(b.isMirageGym && playerOk){
    game.flags.mirageGymBeaten=true;
    game.flags.mirageBadge=true;
    game.flags.tradePass=true;
    game.bag.tradepass=(game.bag.tradepass|0)+1;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,54);
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "NOVA: ...My ALAKAZAM read\nyour mind and still could\nnot stop you.",
      "NOVA: You bent my mirage to\nyour will. The badge \u2014 and\nthe park \u2014 are yours.",
      "You received the\nMIRAGE BADGE!",
      "You received the\nTRADE PASS!",
      "NOVA: Show that PASS to the\nGUARD. The TRADE PARK is\nopen now. LEVEL CAP rises\nto 54!"
    ]);
    return;
  }
  if(b.isNorman && playerOk){
    game.flags.normanBeaten=true;
    game.flags.mistralBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,58);
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "NORMAN: ...Heh. Beaten. By my\nown kid, no less.",
      "NORMAN: Yeah. It's me. I took\nthis GYM to be near you on\nyour journey \u2014 and to see\nhow far you'd come.",
      "NORMAN: Look how far. I'm so\nproud of you.",
      "You received the\nMISTRAL BADGE!",
      "NORMAN: LEVEL CAP rises to 58.\nNow \u2014 STEVEN STONE is waiting\noutside. He needs your help\nin the skies. Go."
    ]);
    return;
  }
  if(b.isAquaSky && playerOk){
    game.flags.aquaEonBeaten=true;
    game.battle=null; game.state=State.WORLD;
    // rebuild npcs so the grunt vanishes and the EON pair appears
    game.npcs=game.map.npcs.filter(n=>!n.present||n.present()).map(n=>Object.assign({},n));
    dialogue([
      "AQUA GRUNT: Gah! Beaten in the\nsky?! The boss'll have my\nhide!",
      "The grunt's wings faltered and\nhe fled toward the sea.",
      "The EON POKEMON drift down to\nyou, no longer afraid.\nApproach them."
    ]);
    return;
  }
  if(b.isBirchGym && playerOk){
    game.flags.birchGymBeaten=true;
    game.flags.birchBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,64);
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "LEADER ROWAN: ...Magnificent.\nNot one type, but mastery\nof many. You beat them all.",
      "You received the\nVERDANT BADGE!",
      "LEADER ROWAN: One gym remains \u2014\nTESLA, east past STORM RIDGE\nin AURORA TOWN. Beat her,\nand you'll be ready.",
      "LEADER ROWAN: LEVEL CAP rises to\n64. Go on, storm-chaser."
    ]);
    return;
  }
  if(b.isAuroraGym && playerOk){
    game.flags.auroraGymBeaten=true;
    game.flags.auroraBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,70);
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "LEADER TESLA: ...Incredible. The\nstorm itself bowed to you.",
      "You received the\nTEMPEST BADGE!",
      "LEADER TESLA: One gym remains \u2014\nASTRA, at the summit. Take\nthe CELESTIAL PATH east of\ntown to reach ZENITH CITY.",
      "LEADER TESLA: LEVEL CAP rises to\n70. Go claim the summit,\nchampion."
    ]);
    return;
  }
  if(b.isZenithGym && playerOk){
    game.flags.zenithGymBeaten=true;
    game.flags.zenithBadge=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,75);
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "LEADER ASTRA: ...So. The summit\nfalls at last.",
      "You received the\nZENITH BADGE!",
      "LEADER ASTRA: There has never\nbeen a trainer like you.\nEvery badge in the region\nis yours.",
      "LEADER ASTRA: LEVEL CAP rises to\n75. ...But listen \u2014 the air\nhas changed. Something vast\nis stirring beyond ZENITH.",
      "LEADER ASTRA: Go home, champion.\nYour family will want to\nsee you tonight."
    ], ()=>{
      // Auto-fly cinematic back to OLDALE (VIRIDIAN map).
      game.flags.flewHomePostAstra = true;
      setMap('VIRIDIAN', 7, 5, 'down');
      Audio.heal();
      dialogue([
        "You drifted south on the\nwind, the ZENITH BADGE\nstill warm in your hand.",
        "METAGROSS set you down\noutside OLDALE TOWN.",
        "* * *",
        "Your POKENAV is ringing...",
        "MOM: Sweetie! I heard about\nthe BADGE \u2014 I'm so proud of\nyou!",
        "MOM: Listen \u2014 your father,\nMAY, BIRCH, and STEVEN are\nall at PETALBURG tonight.\nWe're having dinner.",
        "MOM: Come straight through.\nEveryone's waiting.",
        "MOM: Love you. Hurry.",
        "(MENU \u2192 FLY \u2192 PETALBURG)"
      ], ()=>{ game.flags.momCalled = true; });
    });
    return;
  }
  if(b.isMaxieClimax && playerOk){
    game.flags.maxieBeaten = true;
    game.battle = null; game.state = State.WORLD;
    healParty();
    dialogue([
      "MAXIE: ...How. How could you\nbeat ALL of them.",
      "MAXIE: It doesn't matter. You\nare too late, child.",
      "MAXIE: The RITUAL is complete!\nThe magma sings to me!",
      "The summit shudders. Stone\ncracks. Lava roars upward!",
      "MAXIE: BEHOLD \u2014 GROUDON!\nThe CONTINENT-SHAPER!\nHe will scour Hoenn clean!",
      "A monstrous shape rises\nfrom the molten core \u2014\nGROUDON, awake at last!",
      "GROUDON's roar splits the\nsky! Your team braces!"
    ], ()=> startGroudonClimaxFight());
    return;
  }
  if(b.isMaxieClimax && !playerOk){
    return;  // standard blackout — try again
  }
  if(b.isGroudonClimax && playerOk){
    game.flags.groudonPart1 = true;
    markCaught(383);  // GROUDON now seen
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "GROUDON staggers. Its red\nglow dims.",
      "GROUDON lets out a final,\nshuddering roar \u2014 then sinks\nback into the molten dark.",
      "The summit goes quiet.\nThe lava recedes. The sky\nbreathes again.",
      "MAXIE: ...impossible. You\nstopped it. You actually\nstopped it.",
      "MAXIE: This isn't over. The\nbalance has been broken.\nWhat I started... cannot\nbe undone alone.",
      "MAXIE turned and vanished\ninto the smoke.",
      "STEVEN (PokeNav): You did\nit. Get back to LITTLEROOT.\nRest. We'll talk soon.",
      "STEVEN: But... if MAGMA stirred\nGROUDON, then somewhere out\nthere... AQUA is waking\nKYOGRE.",
      "* * * * * * * * * *",
      "       END OF PART ONE",
      "        \u2014 PART TWO \u2014",
      "    THE OCEAN ANSWERS",
      "* * * * * * * * * * *",
      "(Return to LITTLEROOT \u2014\nSTEVEN will meet you there.)"
    ], ()=>{
      // Return player to the family home (PLAYER_HOUSE = LITTLEROOT in the Fly menu).
      setMap('PLAYER_HOUSE', 4, 4, 'down');
      Audio.heal();
    });
    return;
  }
  if(b.isGroudonClimax && !playerOk){
    // Lost to Groudon — re-spawn at the summit, Maxie is still beaten.
    return;
  }
  // ===== CLIMAX PART 2 — ARCHIE + KYOGRE =====
  if(b.isArchieClimax && playerOk){
    game.flags.archieBeaten = true;
    game.battle = null; game.state = State.WORLD;
    healParty();
    dialogue([
      "ARCHIE: ...You took down MY\nteam too. Just like MAXIE.",
      "ARCHIE: Doesn't matter.\nThe RITUAL is done. The sea\nremembers what's owed.",
      "ARCHIE: Behold KYOGRE \u2014\nLEVIATHAN of the deep!",
      "The cavern floor cracks.\nWater roars upward from\nthe abyss!",
      "A vast blue shape emerges \u2014\nKYOGRE, eyes burning gold!",
      "KYOGRE's cry shakes the\nstone. Your team braces!"
    ], ()=> startKyogreClimaxFight());
    return;
  }
  if(b.isArchieClimax && !playerOk){
    return;  // standard blackout — try again
  }
  if(b.isKyogreClimax && playerOk){
    game.flags.kyogrePart2 = true;
    markSeen(382);  // KYOGRE only seen, never caught (uncatchable boss)
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "KYOGRE shudders. The\nbioluminescent glow on its\nfins flickers and fades.",
      "It lets out a single low\nsong \u2014 sorrow, defiance, or\nrelief, you can't tell.",
      "Then it sinks back into\nthe abyss. The water\ndrains. The cavern stills.",
      "ARCHIE: ...You. You really\nare the one.",
      "ARCHIE: GROUDON sleeps. Now\nKYOGRE sleeps. ...Maybe\nthat means I can too.",
      "ARCHIE turned and walked\ninto the dark. Gone.",
      "STEVEN (PokeNav): It's over.\nBoth Legendaries silenced.\nBoth Teams broken.",
      "STEVEN: Come home, champion.\nYou earned a long rest.",
      "* * * * * * * * * *",
      "      END OF PART TWO",
      "    THE WORLD AT REST",
      "* * * * * * * * * *",
      "(Return to LITTLEROOT \u2014\nSTEVEN has one more thing\nto tell you.)"
    ], ()=>{
      setMap('PLAYER_HOUSE', 4, 4, 'down');
      Audio.heal();
    });
    return;
  }
  if(b.isKyogreClimax && !playerOk){
    return;  // re-spawn at archie's tile, archie still beaten
  }
  // ===== CLIMAX PART 3 — RAYQUAZA =====
  if(b.isRayquazaClimax && playerOk){
    game.flags.rayquazaBeaten = true;
    game.flags.mirageIslandUnlocked = true;
    markCaught(384);  // RAYQUAZA seen + acknowledged
    game.battle = null; game.state = State.WORLD;
    dialogue([
      "RAYQUAZA hovers, breathing\nhard \u2014 then drifts down\nto eye level.",
      "RAYQUAZA: ...You fight like\nthe storm itself. I see\nwhy GROUDON and KYOGRE\nyielded.",
      "RAYQUAZA: You are worthy.\nWhen Hoenn calls you again,\nI will answer with you.",
      "RAYQUAZA rose into the\nupper sky, leaving a\ngold-green streak across\nthe storm.",
      "METAGROSS returned to the\nplateau and bowed for you\nto mount.",
      "STEVEN (PokeNav): I felt that\nfrom the surface. ...Hoenn\nfound its TRUE CHAMPION\ntoday.",
      "* * * * * * * * * *",
      "     END OF PART THREE",
      "    THE SKY ACKNOWLEDGES",
      "* * * * * * * * * *",
      "(All three Legendaries\nhave bowed. The region is\nwhole. ...For now.)"
    ], ()=>{
      game.flags.skyForm=true;
      dialogue([
        "STEVEN (PokeNav): MIRAGE ISLAND\njust appeared on radar.\nGROUDON and KYOGRE went there.",
        "STEVEN: METAGROSS is in\nZENITH CITY. Fly to me.",
        "(MENU -> FLY -> ZENITH CITY)"
      ], ()=>{
        setMap('ZENITH_CITY',6,5,'down');
        game.flags.skyForm=false;
        Audio.heal();
      });
    });
    return;
  }
  if(b.isRayquazaClimax && !playerOk){
    // On blackout, send player back to sky island to re-engage
    setTimeout(()=>{
      if(game.map && game.map.name !== 'SKY_ISLAND'){
        game.flags.skyForm = true;
        setMap('SKY_ISLAND', 7, 5, 'up');
        dialogue(["RAYQUAZA still waits.\nApproach when ready."]);
      }
    }, 600);
    return;
  }
  if(b.isErika && playerOk){
    game.flags.erikaBeaten=true;
    game.flags.rainbowBadge=true;
    game.flags.megaUnlocked=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,55);
    game.npcs=game.npcs.filter(n=>n.name!=='ERIKA');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "ERIKA: ...Oh! I lost. Even\nmy MEGA VENUSAUR couldn't\nstop you.",
      "ERIKA: You have earned the\nRAINBOW BADGE. Please,\ntake it.",
      "You received the\nRAINBOW BADGE!",
      "ERIKA: And take this MEGA\nRING. Your VENUSAUR,\nBLASTOISE, or CHARIZARD\ncan now MEGA EVOLVE!",
      "(In battle, choose FIGHT\nto MEGA EVOLVE.)"
    ]);
    return;
  }
  if(b.johtoChamp && playerOk){
    game.flags.johtoChampBeaten=true;
    game.npcs=game.npcs.filter(n=>n.name!=='JT_LANCE');
    const r=15000; game.flags.money=(game.flags.money|0)+r;
    game.battle=null; game.state=State.WORLD;
    dialogue(["LANCE: ...Magnificent. You\nare a CHAMPION of two\nregions now.",
              "You earned P"+r+"!\nJOHTO salutes you."]);
    return;
  }
  if(b.towerBattle && playerOk){
    game.battle=null;
    const t=game.tower;
    if(!t){ game.state=State.WORLD; return; }
    t.round++;
    if(t.round < t.total){
      game.state=State.WORLD;
      dialogue(["Won "+t.round+" / "+t.total+"!\nThe next challenger\nsteps forward..."],()=>startTowerBattle());
    } else {
      const reward=3000 + t.total*700;
      game.flags.money=(game.flags.money|0)+reward;
      const best=Math.max(game.flags.towerBest||0,t.total);
      game.flags.towerBest=best;
      game.tower=null; game.state=State.WORLD;
      dialogue(["CHALLENGE COMPLETE!\nYou swept all "+t.total+" battles!",
                "Prize: P"+reward+"!\nBest streak: "+best+"."]);
    }
    return;
  }
  if(b.rematch && playerOk){
    const r=10000;
    game.flags.money=(game.flags.money|0)+r;
    game.battle=null; game.state=State.WORLD;
    dialogue(["CHAMPION: Unbelievable...\nyou beat me again.",
              "You earned P"+r+"!\nCome back any time."]);
    return;
  }
  if(b.genericTrainer && playerOk){
    if(b.trainerNpc) game.npcs=game.npcs.filter(n=>n.name!==b.trainerNpc);
    if(b.trainerFlag) game.flags[b.trainerFlag]=true;
    const lbl=b.foeLabel||'TRAINER';
    game.battle=null; game.state=State.WORLD;
    dialogue([lbl+": Argh! You're\ntougher than you look!"]);
    return;
  }
  if(b.isBigRival && playerOk){
    game.flags.rivalBigBeaten=true;
    game.flags.levelCap=Math.max(game.flags.levelCap||24,36);   // next stage cap
    game.npcs=game.npcs.filter(n=>n.name!=='MT_RIVAL');
    game.battle=null; game.state=State.WORLD;
    dialogue([
      "RIVAL: ...You beat my whole\nteam? Even my WARTORTLE?!",
      "RIVAL: Tch. You really are\nsomething. I'll train even\nharder — count on it!",
      "RIVAL: The LEVEL CAP just\nrose. Go push your team\nfurther, "+(game.party[0]?game.party[0].name:"trainer")+"!"
    ]);
    return;
  }
  game.battle=null;
  game.state=State.WORLD;
}

export function blackout(){
  if(game.tower){
    const wins=game.tower.round;
    game.tower=null; game.battle=null; healParty();
    game.flags.towerBest=Math.max(game.flags.towerBest||0,wins);
    dialogue(["Your streak ended at\n"+wins+" win"+(wins===1?"":"s")+".",
              "The TOWER healed your\nteam. Challenge again\nwhenever you like!"],()=>{
      setMap('BATTLE_TOWER',5,6,'down'); game.state=State.WORLD;
    });
    return;
  }
  game.battle=null;
  // Losing the E4 gauntlet sends you back to Sidney with your lobby party.
  if(isMidE4Gauntlet()) restoreE4Party();
  healParty();
  const c=game.lastCenter;
  if(c && MAPS[c.map]){
    dialogue(["You blacked out!","...","A NURSE healed your team\nat the POKEMON CENTER.\nTake care out there!"],()=>{
      setMap(c.map,c.x,c.y,'down');
      game.state=State.WORLD;
    });
  } else {
    const h=game.blackoutHome;
    dialogue(["You blacked out!","...","MOM patched up your\nPOKEMON. Be careful\nout there!"],()=>{
      setMap(h.map,h.x,h.y,'down');
      game.state=State.WORLD;
    });
  }
}


/* ====== MIRAGE ISLAND ====== */

export function startHoennE4_Sidney(){
  if(!game.e4Snapshot) snapshotE4Party();   // lock in the lobby party for the gauntlet
  var a=makeMon(262,72),b=makeMon(275,73),c=makeMon(332,74);
  var d=makeMon(342,75),e=makeMon(359,76),f=makeMon(319,78);
  startBattle(a,true,'SIDNEY'); game.battle!.foeTeam=[b,c,d,e,f]; game.battle!.isHoennE4_1=true;
}

export function startHoennE4_Phoebe(){
  var a=makeMon(356,74),b=makeMon(354,75),c=makeMon(302,76);
  var d=makeMon(356,77),e=makeMon(354,78),f=mkMega(94,80);
  startBattle(a,true,'PHOEBE'); game.battle!.foeTeam=[b,c,d,e,f]; game.battle!.isHoennE4_2=true;
}

export function startHoennE4_Glacia(){
  var a=makeMon(364,76),b=makeMon(364,77),c=makeMon(362,78);
  var d=makeMon(362,79),e=makeMon(365,80),f=makeMon(131,82);
  startBattle(a,true,'GLACIA'); game.battle!.foeTeam=[b,c,d,e,f]; game.battle!.isHoennE4_3=true;
}

export function startHoennE4_Drake(){
  var a=makeMon(372,78),b=makeMon(334,80),c=makeMon(330,80);
  var d=makeMon(330,82),e=makeMon(230,82),f=makeMon(373,84);
  startBattle(a,true,'DRAKE'); game.battle!.foeTeam=[b,c,d,e,f]; game.battle!.isHoennE4_4=true;
}

export function startStevenChampBattle(){
  var a=makeMon(227,82),b=makeMon(306,83),c=makeMon(348,84);
  var d=makeMon(346,84),e=makeMon(344,85),f=makeMon(376,88);
  f.mega=true; f.atk=Math.round(f.atk*1.4); f.def=Math.round(f.def*1.35);
  f.spc=Math.round(f.spc*1.3); f.spe=Math.round(f.spe*1.35);
  f.maxHp=Math.round(f.maxHp*1.15); f.hp=f.maxHp;
  startBattle(a,true,'STEVEN'); game.battle!.foeTeam=[b,c,d,e,f]; game.battle!.isStevenChamp=true;
}

/* ---------------------------------------------------------------------------
   11. AUDIO — tiny Web Audio bleeps
--------------------------------------------------------------------------- */

export function renderBattleScene(){
  const b=game.battle!;
  // background
  const g=ctx.createLinearGradient(0,0,0,VIEW_H);
  g.addColorStop(0,'#bfe0f0'); g.addColorStop(1,'#8ec070');
  ctx.fillStyle=g; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  ctx.fillStyle='#7ab060'; ctx.beginPath();
  ctx.ellipse(VIEW_W-40,42,40,12,0,0,7); ctx.fill();
  ctx.beginPath(); ctx.ellipse(46,VIEW_H-46,46,14,0,0,7); ctx.fill();

  if(b.flash>0 && Math.floor(b.flash)%2===0){
    ctx.fillStyle='rgba(255,255,255,.5)'; ctx.fillRect(0,0,VIEW_W,VIEW_H);
  }
  const fs=b.foeShake>0?(Math.random()*4-2):0;
  const ms=b.meShake>0?(Math.random()*4-2):0;

  // foe (top-right)
  drawBattler(b.foe, VIEW_W-78+fs, 16, 48);
  // me (bottom-left, back)
  drawBattler(b.me, 22+ms, VIEW_H-100, 52);

  // foe info box (top-left)
  box(4,6,90,26);
  text(b.foe.name,9,9,'#283040',6);
  text("Lv"+b.foe.level,70,9,'#283040',6);
  hpBar(9,24,76,(b.foeHpShown!=null?b.foeHpShown:b.foe.hp),b.foe.maxHp);

  // me info box (bottom-right)
  box(VIEW_W-100,VIEW_H-66,96,30);
  text(b.me.name,VIEW_W-95,VIEW_H-63,'#283040',6);
  text("Lv"+b.me.level,VIEW_W-32,VIEW_H-63,'#283040',6);
  hpBar(VIEW_W-95,VIEW_H-48,76,(b.meHpShown!=null?b.meHpShown:b.me.hp),b.me.maxHp);
  text(Math.ceil(b.meHpShown!=null?b.meHpShown:b.me.hp)+"/"+b.me.maxHp,VIEW_W-95,VIEW_H-43,'#283040',5);
  // floating damage / heal numbers
  if(b.floats){
    for(const f of b.floats){
      const a=Math.max(0,Math.min(1,f.life/22));
      ctx.globalAlpha=a;
      text(f.txt, f.x, f.y, f.col, f.sz);
      ctx.globalAlpha=1;
    }
  }
}

export function renderBattle(){
  const b=game.battle!;
  if(!b){ renderWorld(); return; }
  renderBattleScene();
  // message box
  box(4,VIEW_H-32,VIEW_W-8,28);
  if(b.msg){
    text(b.msg.text.slice(0,Math.floor(b.msg.char)),10,VIEW_H-26,'#283040',7);
    return;
  }
  if(b.phase!=='menu') return;

  if(b.sub===null){
    // main 4-way menu
    const opts=['FIGHT','BAG','POKEMON','RUN'];
    box(VIEW_W-92,VIEW_H-32,88,28);
    for(let i=0;i<4;i++){
      const cx=VIEW_W-86+(i%2)*44, cy=VIEW_H-26+Math.floor(i/2)*12;
      if(i===b.selIdx) text(">",cx-6,cy,'#283040',7);
      text(opts[i],cx,cy,'#283040',6);
    }
  } else if(b.sub==='fight'){
    const m=b.me.moves;
    box(4,VIEW_H-32,VIEW_W-8,28);
    for(let i=0;i<m.length;i++){
      const cx=10+(i%2)*78, cy=VIEW_H-26+Math.floor(i/2)*12;
      if(i===b.selIdx) text(">",cx-6,cy,'#283040',6);
      text(m[i].name,cx,cy,'#283040',6);
    }
    const sm=m[b.selIdx];
    box(VIEW_W-66,VIEW_H-58,62,24);
    text(sm.type.toUpperCase(),VIEW_W-61,VIEW_H-54,'#283040',5);
    text("PP "+sm.ppNow+"/"+sm.pp,VIEW_W-61,VIEW_H-45,'#283040',5);
  } else if(b.sub==='bag'){
    box(4,VIEW_H-32,VIEW_W-8,28);
    const items=['POKE BALL x'+game.bag.ball,'POTION x'+game.bag.potion,'CANCEL'];
    for(let i=0;i<items.length;i++){
      const cy=VIEW_H-28+i*8;
      if(i===b.selIdx) text(">",10,cy,'#283040',5);
      text(items[i],18,cy,'#283040',5);
    }
  }
}

export function spawnFloat(b,side,amount,heal,crit){
  const x = side==='foe' ? VIEW_W-54 : 46;
  const y = side==='foe' ? 30 : VIEW_H-86;
  b.floats.push({ x, y, vy:-0.45, life:46,
    txt:(heal?'+':'-')+amount, col: heal?'#48d048':(crit?'#ffd23f':'#ff5a5a'),
    sz: crit?9:7 });
}

export function battleFeelTick(b){
  // re-sync (no float) whenever the active battler is swapped out
  if(b._foeRef!==b.foe){ b._foeRef=b.foe; b.foeHpShown=b.foe.hp; b._foeHpLast=b.foe.hp; }
  if(b._meRef !==b.me ){ b._meRef =b.me;  b.meHpShown =b.me.hp;  b._meHpLast =b.me.hp;  }
  // detect HP changes -> spawn a rising number
  if(b.foe.hp!==b._foeHpLast){
    const d=b._foeHpLast-b.foe.hp;
    if(d>0) spawnFloat(b,'foe',d,false, b.flash>3);
    else if(d<0) spawnFloat(b,'foe',-d,true,false);
    b._foeHpLast=b.foe.hp;
  }
  if(b.me.hp!==b._meHpLast){
    const d=b._meHpLast-b.me.hp;
    if(d>0) spawnFloat(b,'me',d,false, b.flash>3);
    else if(d<0) spawnFloat(b,'me',-d,true,false);
    b._meHpLast=b.me.hp;
  }
  // ease the displayed HP toward the real value
  const ease=(s,t)=>{ const n=s+(t-s)*0.22; return Math.abs(n-t)<0.6?t:n; };
  b.foeHpShown=ease(b.foeHpShown, b.foe.hp);
  b.meHpShown =ease(b.meHpShown,  b.me.hp);
  // advance floating numbers
  for(const f of b.floats){ f.y+=f.vy; f.life--; }
  b.floats=b.floats.filter(f=>f.life>0);
}

export function updateBattle(){
  const b=game.battle!;
  if(!b){ game.state=State.WORLD; return; }   // battle ended — never deref null
  battleFeelTick(b);
  // animate message typewriter
  if(b.msg){
    if(b.msg.char<b.msg.text.length){
      b.msg.char+=0.9;
      if(b.msg.char>b.msg.text.length) b.msg.char=b.msg.text.length;
      if(consume('a')||consume('b')) b.msg.char=b.msg.text.length;
    } else {
      if(consume('a')||consume('b')){
        Audio.select();
        const after=b.msg.after; b.msg=null;
        if(b.msgQ.length){ bNext(); }
        else if(after){ after(); if(!b.msg && b.msgQ.length) bNext(); }
      }
    }
    return;
  }
  if(b.foeShake>0) b.foeShake-=1;
  if(b.meShake>0) b.meShake-=1;
  if(b.flash>0) b.flash-=1;
  if(b.phase!=='menu') return;

  if(b.sub===null){
    if(consume('left')){ if(b.selIdx%2===1){b.selIdx--;Audio.select();} }
    if(consume('right')){ if(b.selIdx%2===0){b.selIdx++;Audio.select();} }
    if(consume('up')){ if(b.selIdx>=2){b.selIdx-=2;Audio.select();} }
    if(consume('down')){ if(b.selIdx<2){b.selIdx+=2;Audio.select();} }
    if(consume('a')){
      Audio.confirm();
      if(b.selIdx===0){
        const me=b.me;
        if(game.flags.megaUnlocked && MEGA[me.id] && !me.mega && !b.megaAsked){
          b.megaAsked=true;
          choice("Mega Evolve "+me.name+"?",[
            {label:"YES", fn:()=>{ doMegaEvolve(me); bMsg(me.name+" Mega Evolved into\n"+MEGA[me.id].name+"!",()=>{ b.sub='fight'; b.selIdx=0; }); }},
            {label:"NO",  fn:()=>{ b.sub='fight'; b.selIdx=0; }}
          ], ()=>{ b.sub='fight'; b.selIdx=0; });
        } else { b.sub='fight'; b.selIdx=0; }
      }
      else if(b.selIdx===1){ b.sub='bag'; b.selIdx=0; }
      else if(b.selIdx===2){ game.partyView={idx:0,ret:State.BATTLE}; game.state=State.PARTY; }
      else { tryRun(); }
    }
  } else if(b.sub==='fight'){
    const n=b.me.moves.length;
    if(consume('left')){ if(b.selIdx%2===1){b.selIdx--;Audio.select();} }
    if(consume('right')){ if(b.selIdx%2===0 && b.selIdx+1<n){b.selIdx++;Audio.select();} }
    if(consume('up')){ if(b.selIdx>=2){b.selIdx-=2;Audio.select();} }
    if(consume('down')){ if(b.selIdx<2 && b.selIdx+2<n){b.selIdx+=2;Audio.select();} }
    if(consume('b')){ Audio.cancel(); b.sub=null; b.selIdx=0; }
    if(consume('a')){ Audio.confirm(); const idx=b.selIdx; b.sub=null; b.selIdx=0; playerMove(idx); }
  } else if(b.sub==='bag'){
    if(consume('up')){ b.selIdx=(b.selIdx+2)%3; Audio.select(); }
    if(consume('down')){ b.selIdx=(b.selIdx+1)%3; Audio.select(); }
    if(consume('b')){ Audio.cancel(); b.sub=null; b.selIdx=0; }
    if(consume('a')){
      Audio.confirm();
      const i=b.selIdx; b.sub=null; b.selIdx=0;
      if(i===0) tryCatch();
      else if(i===1) useItemPotion();
    }
  }
}

/* ---------------------------------------------------------------------------
   18. TITLE
--------------------------------------------------------------------------- */
