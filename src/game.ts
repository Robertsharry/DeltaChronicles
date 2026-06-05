/* eslint-disable */
import { Audio, Music } from './engine/audio';
import type { GameState, MapDef, Mon } from './types';
import { TILE, VIEW_H, VIEW_W } from './core/constants';
import { MAPS } from './data/maps';
import { preloadMons, renderTitle, renderWorld } from './engine/renderer';
import { choice, dialogue, renderChoice, renderDialogue, updateChoice, updateDialogue } from './engine/dialogue';
import { renderBag, renderFly, renderMenu, renderPC, renderParty, renderPokedex, renderTrainer, teachFly, teachSurf, updateBag, updateFly, updateMenu, updatePC, updateParty, updatePokedex, updateTrainer } from './engine/ui';
import { startRayquazaDescentCutscene } from './cutscenes/rayquaza';
import { startMirageIslandCutscene } from './cutscenes/mirage';
import { makeMon } from './data/dex';
import { healParty, markCaught, markSeen, renderBattle, renderEvolution, startBattle, startRivalBattle, updateBattle, updateEvolution } from './engine/battle';
import { consume, keys } from './engine/input';
import { hasSave, loadGame } from './engine/save';
import { ctx } from './core/canvas';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: game

export const State={ TITLE:'title', WORLD:'world', DIALOGUE:'dialogue',
  CHOICE:'choice', MENU:'menu', PARTY:'party', BATTLE:'battle',
  POKEDEX:'pokedex', BAG:'bag', TRAINER:'trainer', PC:'pc', FLY:'fly',
  EVOLUTION:'evolution', CUTSCENE:'cutscene' } as const;


export const game: GameState = {
  state:State.TITLE,
  lastTs:null,
  map:null as unknown as MapDef, mapName:'PLAYER_HOUSE',
  player:{ x:4,y:3, dir:'down', px:4*TILE, py:3*TILE, moving:false, frame:0, animT:0,
           sx:0,sy:0, tx:0,ty:0, mt:0 },
  follower:{ px:4*TILE, py:4*TILE, dir:'down', bob:0, sx:0,sy:0, tx:0,ty:0, moving:false, mt:0 },
  trail:[],
  cam:{x:0,y:0},
  flags:{ hasStarter:false, rivalBeaten:false, starterId:null, rivalId:null, rivalStage:0,
          gruntBeaten:false, parcel:false, pokedex:false,
          rocketGateOpen:false, rocketSwitch:false, rocketBossBeaten:false,
          brockBeaten:false, boulderBadge:false,
          makerSaved:false, gen2Taken:false,
          levelCap:24, rivalBigBeaten:false, fossil:null,
          money:0, mistyBeaten:false, cascadeBadge:false,
          br_t1:false, br_t2:false, br_t3:false, br_t4:false, br_grunt:false,
          ship_t1:false, ship_t2:false, ship_t3:false, ship_t4:false, ship_t5:false,
          ship_t6:false, ship_t7:false, ship_t8:false, ship_t9:false, ship_t10:false,
          shipRivalBeaten:false, shipStash:false, hmCut:false,
          surgeBeaten:false, thunderBadge:false,
          giovanniBeaten:false, celadon_grunt:false, celadon_grunt2:false,
          erikaBeaten:false, rainbowBadge:false, megaUnlocked:false,
          gym_g1:false, gym_g2:false,
          marowakSeen:false, kogaBeaten:false, soulBadge:false,
          fuc_t1:false, fuc_t2:false,
          sabrinaBeaten:false, marshBadge:false, hmSurf:false, sab_t1:false,
          gotMachamp:false, silphBeaten:false,
          cinnaRivalBeaten:false, blaineBeaten:false, volcanoBadge:false, bla_t1:false,
          viridianBeaten:false, earthBadge:false, vir_g1:false, vir_g2:false,
          leagueBeaten:false, e4_1:false, e4_2:false, e4_3:false, e4_4:false,
          moltresSeen:false, mewtwoBeaten:false, mewtwoSeen:false,
          articunoSeen:false, zapdosSeen:false, mansion_stash:false,
          swm_1:false, swm_2:false, swm_3:false,
          mtm_t1:false, mtm_t2:false, mtm_t3:false,
          // Hoenn storyline
          introSeen:false, metMay:false, mayBeaten:false,
          magmaAdminBeaten:false, groudonDefeated:false,
          wallyGift:false, devonCableGift:false,
          tradeMonTaken:false, steelGymBeaten:false, steelBadge:false,
          steel_app1:false, stevenGift:false,
          mirageGymBeaten:false, mirageBadge:false, tradePass:false,
          mirage_route_t1:false, mirage_app2:false, parkGift:false,
          normanBeaten:false, mistralBadge:false, norman_app1:false,
          mf_t1:false, mf_t2:false, mf_t3:false, mf_t4:false, mf_t5:false,
          skyForm:false, aquaEonBeaten:false, eonChoiceMade:false, eonId:null,
          infiniteCable:false, birchGymBeaten:false, birchBadge:false,
          birch_app1:false,
          auroraGymBeaten:false, auroraBadge:false, aurora_app1:false,
          sr_t1:false, sr_t2:false, sr_t3:false, bigEventStarted:false,
          zenithGymBeaten:false, zenithBadge:false, zenith_app1:false,
          cp_t1:false, cp_t2:false, cp_t3:false, flyGranted:false,
          // Climax Part 1 — Maxie & Groudon
          flewHomePostAstra:false, momCalled:false, dinnerStarted:false, dinnerDone:false,
          leagueCallSeen:false, volcanoTrigger:false,
          mg_t1:false, mg_t2:false, mg_t3:false,
          maxieBeaten:false, groudonPart1:false,
          // Climax Part 2 — Archie & Kyogre
          surfGiven:false, divedOnce:false,
          aqua_t1:false, aqua_t2:false, aqua_t3:false,
          archieBeaten:false, kyogrePart2:false,
          // Climax Part 3 — Sky Island & Rayquaza
          rayquazaCalled:false, skyIslandEntered:false,
          rayquazaCutsceneSeen:false, rayquazaBeaten:false,
          expShare:true, music:true, followMon:true,
          mirageIslandUnlocked:false, mirageIslandEntered:false,
          mirageCutsceneStarted:false,
          mirageGroudonCalmed:false, mirageKyogreCalmed:false, mirageFinale:false,
          hE4_1:false, hE4_2:false, hE4_3:false, hE4_4:false,
          stevenBeaten:false, hoennChampBeaten:false,
          // Flags set at runtime (kept here so GameFlags is fully initialised).
          brawlyBeaten:false, brawly_app1:false, brawly_app2:false,
          mayRematch1:false, rt_hiker1:false, rt_hiker2:false, rt_magma:false,
          ccItem:false, celebiSeen:false, champion:false, girl:false,
          hoohSeen:false, johtoChampBeaten:false, johtoStarter:false,
          jrT1:false, jrT2:false, lugiaSeen:false, noCap:false,
          suicuneSeen:false, vrAce1:false, vrAce2:false, vrItem:false,
          towerBest:0 },
  party:[],
  bag:{ ball:5, potion:3, greatball:0, superpotion:0, masterball:0, rarecandy:0, linkcable:0, tradepass:0 },
  npcs:[],
  dialogue:null,
  choice:null,
  menu:{ idx:0, items:['POKEDEX','POKEMON','BAG','FLY','TRAINER','MUSIC','SAVE','CLOSE'] },
  dex:{ seen:{}, caught:{} },
  dexView:{ top:0, idx:0 },
  bagView:{ idx:0 },
  flyView:{ idx:0 },
  partyView:{ idx:0, ret:State.WORLD },
  pc:[],
  pcView:{ side:'party', idx:0, top:0, msg:'' },
  battle:null,
  step:{ count:0 },
  blackoutHome:{ map:'PLAYER_HOUSE', x:4, y:4 },
  lastCenter:null,   // {map,x,y} of the town tile outside the last Pokemon Center used; set on Center entry
  titleT:0,
  flash:0,
  cutscene:null   // active LegendaryDescentCutscene instance (Part 3)
};


export function setMap(name,tx,ty,dir){
  game.mapName=name;
  game.map=MAPS[name];
  game.npcs=game.map.npcs.filter(n=>!n.present||n.present()).map(n=>Object.assign({},n));
  game.player.x=tx; game.player.y=ty;
  game.player.px=tx*TILE; game.player.py=ty*TILE;
  game.player.moving=false;
  if(dir) game.player.dir=dir;
  resetFollower();
  // preload sprites that could appear soon
  const ids=game.party.map(m=>m.id);
  if(game.map.encounters) for(const e of game.map.encounters) ids.push(e.id);
  if(game.flags.rivalId) ids.push(game.flags.rivalId);
  preloadMons(ids);
  // === Remember the last Pokemon Center for blackout respawn ===
  // Centers are interior maps named PCENTER or *_CENTER. We store the town tile
  // their door leads back to, so a blackout puts the player just outside it.
  if(name==='PCENTER' || /_CENTER$/.test(name)){
    const back=(game.map.warps&&game.map.warps[0])||null;
    if(back) game.lastCenter={ map:back.to, x:back.tx, y:back.ty };
  }
  // === Story cutscene triggers ===
  if(name === 'TOWN' && !game.flags.introSeen && game.party.length === 0){
    triggerIntroCutscene();
  }
  // FLY granted on arrival at the CELESTIAL PATH (first visit, with a party).
  if(name === 'CELESTIAL_PATH' && !game.flags.flyGranted && game.party.length > 0){
    game.flags.flyGranted = true;
    game.state = State.WORLD;
    setTimeout(()=>{
      dialogue([
        "A SKY ELDER waits at the\npath's edge, robes catching\nthe high wind.",
        "SKY ELDER: To climb to ZENITH\nCITY, you must ride the sky\nitself.",
        "SKY ELDER: Let me teach your\nlead POKEMON the secret\nof FLY!"
      ], ()=>teachFly());
    }, 350);
  }
  // Climax Part 1 — Oldale arrival (catches saves already past Astra).
  // Fires whenever you enter OLDALE post-Astra and haven't taken Mom's call yet.
  if(name === 'VIRIDIAN' && game.flags.zenithGymBeaten && !game.flags.momCalled){
    game.state = State.WORLD;
    setTimeout(()=>{
      Audio.heal();
      dialogue([
        "Your POKENAV is ringing...",
        "MOM: Sweetie! I heard about\nthe BADGE \u2014 I'm so proud of\nyou!",
        "MOM: Listen \u2014 your father,\nMAY, BIRCH, and STEVEN are\nall at PETALBURG tonight.\nWe're having dinner.",
        "MOM: Come straight through.\nEveryone's waiting.",
        "MOM: Love you. Hurry.",
        "(MENU \u2192 FLY \u2192 PETALBURG)"
      ], ()=>{ game.flags.momCalled = true; });
    }, 500);
  }
  // Climax Part 2 — Steven gives SURF on first LITTLEROOT entry post-Groudon.
  if(name === 'TOWN' && game.flags.groudonPart1 && !game.flags.surfGiven){
    game.state = State.WORLD;
    setTimeout(()=>{
      Audio.heal();
      dialogue([
        "STEVEN was waiting in front\nof your house when you\nstepped outside.",
        "STEVEN: I'm sorry to push.\nYou just got home.",
        "STEVEN: But ARCHIE has reached\nthe SEAFLOOR CAVERN. He's\ngoing to wake KYOGRE \u2014\nthe twin of GROUDON.",
        "STEVEN: If MAGMA wanted to\nburn the seas dry, AQUA\nwants to drown the land.\nKYOGRE will FLOOD Hoenn.",
        "STEVEN: I can't go where he's\ngoing. But you can.\nTake this.",
        "STEVEN handed you a worn\ndisc. HM03 \u2014 SURF.",
        "You received HM03 SURF!",
        "STEVEN: The southern sea is\nopen now. SURF down past\nLITTLEROOT. Find the dive\nspot. Stop him.",
        "STEVEN: I'll meet you when\nit's done. ...If we both\nmake it.",
        "(Put a WATER POKEMON first,\nthen press OK to teach SURF.)"
      ], ()=>{
        game.flags.hmSurf = true;
        game.flags.surfGiven = true;
        teachSurf();
      });
    }, 500);
  }
  // Climax Part 3 — Steven calls about Rayquaza on first LITTLEROOT entry post-Kyogre.
  if(name === 'TOWN' && game.flags.kyogrePart2 && !game.flags.rayquazaCalled){
    game.state = State.WORLD;
    setTimeout(()=>{
      Audio.heal();
      dialogue([
        "Your POKENAV rings before\nyou even reach the porch.",
        "STEVEN: ...You're home. Good.\nThere's no easy way to say\nthis.",
        "STEVEN: Something is PULLING\non the legendaries. GROUDON.\nKYOGRE. Both stirred again,\nfaintly. Then quiet.",
        "STEVEN: My sensors triangulated\nthe source: SKY PILLAR.\nThe old plateau above the\nclouds. RAYQUAZA's home.",
        "STEVEN: RAYQUAZA balances the\nother two. If he's awake,\nhe felt what you did.",
        "STEVEN: I've sent METAGROSS.\nClimb on. Go meet him.",
        "STEVEN: ...Be respectful.\nHe is older than the\nregion itself.",
        "METAGROSS descended through\nthe storm clouds and bowed\nfor you to mount."
      ], ()=>{
        game.flags.rayquazaCalled = true;
        game.flags.skyForm = true;
        setMap('SKY_ISLAND', 7, 9, 'up');
      });
    }, 500);
  }
  // Climax Part 3 — Sky island arrival -> Rayquaza descent cutscene.
  if(name === 'SKY_ISLAND' && !game.flags.skyIslandEntered){
    game.flags.skyIslandEntered = true;
    game.state = State.WORLD;
    setTimeout(()=>{
      dialogue([
        "METAGROSS set you down on\nthe plateau and lifted off,\nleaving you alone.",
        "The wind dropped. The clouds\nstilled. ...Something was\nlistening."
      ], ()=>{
        setTimeout(()=>startRayquazaDescentCutscene(), 600);
      });
    }, 400);
  }
  // Climax Part 1 — Petalburg dinner cutscene
  if(name === 'PETALBURG_TOWN' && game.flags.momCalled && !game.flags.dinnerDone && !game.flags.dinnerStarted){
    game.state = State.WORLD;
    setTimeout(()=>startDinnerScene(), 400);
  }
  // If player walked south off Mirage Island, fire cutscene instead of warping
  if(name==='ZENITH_CITY' && game.flags.mirageIslandEntered
     && !game.flags.mirageCutsceneStarted
     && !game.flags.mirageFinale){
    game.flags.mirageCutsceneStarted=true;
    // Stay on Mirage Island, don't actually go to Zenith
    game.mapName='MIRAGE_ISLAND';
    game.map=MAPS.MIRAGE_ISLAND;
    game.npcs=MAPS.MIRAGE_ISLAND.npcs.filter(n=>!n.present||n.present()).map(n=>Object.assign({},n));
    game.player.x=7; game.player.y=7;
    game.player.px=7*TILE; game.player.py=7*TILE;
    game.player.dir='down';
    resetFollower();
    game.state=State.WORLD;
    setTimeout(()=>startMirageIslandCutscene(), 300);
    return;
  }
  if(name==='MIRAGE_ISLAND' && !game.flags.mirageIslandEntered){
    game.flags.mirageIslandEntered=true;
    game.state=State.WORLD;
    setTimeout(()=>{
      dialogue([
        "METAGROSS sets you down\non warm black sand.",
        "The island hums. Something\nbeneath the rock breathes.",
        "STEVEN: They're close.\nWalk south."
      ]);
    }, 400);
  }
  // Climax Part 1 — League: Steven's call cutscene (replays on every entry until Groudon falls).
  if(name === 'POKEMON_LEAGUE' && game.flags.dinnerDone && !game.flags.groudonPart1){
    game.state = State.WORLD;
    setTimeout(()=>startLeagueCallScene(), 400);
  }
}

/* ---------------------------------------------------------------------------
   8. DIALOGUE / CHOICE HELPERS
--------------------------------------------------------------------------- */

export function pickStarter(id){
  if(game.flags.hasStarter){ dialogue(["The other POKE BALLS are\nnot yours to take."]); return; }
  const names={252:"TREECKO",255:"TORCHIC",258:"MUDKIP"};
  choice("Take "+names[id]+"?",[
    {label:"YES",fn:()=>{
       const mon=makeMon(id,5);
       game.party.push(mon);
       markCaught(id);
       game.flags.hasStarter=true;
       game.flags.starterId=id;
       // rival counters your pick (Grass < Fire < Water < Grass)
       game.flags.rivalId = id===252?255 : id===255?258 : 252;
       Audio.heal();
       dialogue([
         "You received "+names[id]+"!",
         "PROF. BIRCH: That's a fine\nchoice! Take good care of\nit.",
         "PROF. BIRCH: My daughter\nMAY is waiting for you on\nROUTE 2 (past VIRIDIAN).",
         "PROF. BIRCH: She's a new\ntrainer too — battle her\nto sharpen your skills.\nGood luck!"]);
     }},
    {label:"NO",fn:()=>dialogue(["You put the POKE BALL\nback on the table."])}
  ]);
}

export function triggerIntroCutscene(){
  // Show Birch + Poochyena, then forced battle with borrowed Machoke
  dialogue([
    "POOCHYENA: GRR! GRRR!",
    "PROF. BIRCH bursts out of\nthe tall grass with a\nsnarling POOCHYENA at his\nheels!",
    "PROF. BIRCH: H-HELP! It's\nbeen chasing me halfway\nfrom ROUTE 101!",
    "PROF. BIRCH: I'm too out of\nbreath to fight. Take my\npartner MACHOKE — quick!",
    "You received a borrowed\nMACHOKE!",
    "PROF. BIRCH: Drive it off\nbefore it bites a chunk\nout of me!"
  ], () => {
    const machoke = makeMon(67, 12);
    machoke.borrowed = true;
    game.party.push(machoke);
    Audio.heal();
    const foe = makeMon(261, 5);  // Wild Poochyena
    startBattle(foe, false);
    game.battle!.isBirchIntro = true;
  });
}

export function startDinnerScene(){
  game.flags.dinnerStarted = true;
  game.state = State.DIALOGUE;
  dialogue([
    "You stepped through the door\nof your father's house in\nPETALBURG.",
    "The whole table looks up.\nNORMAN, MAY, BIRCH, STEVEN,\nand MOM \u2014 already seated.",
    "MOM: There you are! Sit down,\nsit down. I made too much\nfood as always.",
    "NORMAN: ...So. Every badge in\nthe region. Including mine.",
    "NORMAN: You did good, kid. I\nmean it. I was wrong to test\nyou the way I did. Proud of\nyou.",
    "MAY: Hey \u2014 don't get a big head\nabout it. I'm one badge\nbehind. ONE. I'm catching up.",
    "MAY: ...but yeah. You earned\nit. You really did.",
    "BIRCH: Hahaha! And to think it\nall started with three\nlittle POKEBALLS in my LAB.",
    "BIRCH: I've never seen a\nTRAINER grow like you. Never.",
    "STEVEN: I have to admit \u2014 when\nI first met you over PETALBURG,\nI thought you might just\nsurvive the sky.",
    "STEVEN: I didn't expect you to\nclimb past me. Past ASTRA.\nPast all of us.",
    "MOM: Eat, eat. The food's\ngetting cold and you've all\ngone soft on me.",
    "* * * * *",
    "(You ate dinner with your\nfamily. Quiet warmth. The\nfirst time in months you've\nbeen still.)",
    "* * * * *",
    "NORMAN: ...You know, kid. The\nworld's been getting strange\nlately. Volcanic activity\nwhere there shouldn't be.",
    "BIRCH: The wild POKEMON are\nrestless. I've been logging\nit. Something's...not right.",
    "STEVEN: That's actually why I\nwanted to see you tonight.",
    "STEVEN: My people at DEVON\nhave been tracking TEAM\nMAGMA \u2014 they've been moving.",
    "STEVEN: I'm heading to the\nPOKEMON LEAGUE next \u2014 it's\nthe one place with the\nsensors to confirm what I\nsuspect.",
    "STEVEN: Meet me there. Bring\nyour best team.",
    "MAY: Be careful out there,\nokay? ...Idiot.",
    "MOM: You go on. I'll keep\ndinner warm in case you\nmake it back tonight.",
    "(MENU \u2192 FLY \u2192 LEAGUE)"
  ], ()=>{
    game.flags.dinnerDone = true;
  });
}


export function startLeagueCallScene(){
  game.state = State.DIALOGUE;
  if(!game.flags.leagueCallSeen){
    game.flags.leagueCallSeen = true;
    dialogue([
      "STEVEN is already at the\nLEAGUE gate when you arrive,\nbrow tight, PokeNav in hand.",
      "STEVEN: It's confirmed. MT.\nCHIMNEY \u2014 the old volcano \u2014\nis active again. Magma.",
      "STEVEN: TEAM MAGMA is up\nthere. MAXIE himself.\nThey're trying to wake\nsomething ancient.",
      "STEVEN: GROUDON. The continent-\nshaper. If they succeed, the\nseas will boil. Hoenn ends.",
      "STEVEN: I can't fly that high\nand fight at the same time.\nBut METAGROSS can carry you.",
      "STEVEN: Will you go?",
      "STEVEN: ...I already know your\nanswer. Climb on.",
      "METAGROSS landed beside you,\neyes burning. The air felt\nheavier.",
      "You rose into the burning\nsky, ash on the wind."
    ], ()=>goVolcanoClimax());
  } else {
    dialogue([
      "STEVEN: Climb back on.\nMAXIE is still up there.",
      "METAGROSS lifted you into\nthe ash-choked sky once\nmore."
    ], ()=>goVolcanoClimax());
  }
}


export function goVolcanoClimax(){
  game.flags.volcanoTrigger = true;
  healParty();
  setMap('MAGMA_VOLCANO', 6, 13, 'up');
  Audio.battleStart();
}


export function startStarterTalk(){
  const sid = (game.flags.starterId || 0) | 0;
  if(!sid || game.party.length === 0){
    dialogue(["You sat down. The room was\nquiet. ...You let yourself\nbe still for a minute."]);
    return;
  }
  const grass = [252,253,254];
  const fire  = [255,256,257];
  const water = [258,259,260];
  const family = grass.includes(sid) ? 'grass'
               : fire.includes(sid)  ? 'fire'
               : water.includes(sid) ? 'water'
               : null;
  let mon: Mon | null | undefined = null;
  if(family){
    const fam = family==='grass'?grass : family==='fire'?fire : water;
    mon = game.party.find(m => m && fam.includes(m.id) && m.hp > 0);
  }
  if(!mon) mon = game.party.find(m => m && m.hp > 0);
  if(!mon){
    dialogue(["You sat down. All your\nPOKEMON are too tired\nto come out right now."]);
    return;
  }
  const nm = mon.name;
  let lines;
  if(family === 'grass'){
    lines = [
      "You sat in the chair.\nThe house was quiet.",
      "You released "+nm+".",
      nm+": ...You're not moving.",
      nm+": That's allowed, I\nguess.",
      nm+" climbed onto the\narmrest, tail twitching,\nand watched you for a\nlong moment.",
      nm+": We've come far. You\nand me. Don't lose your\nhead now.",
      nm+": I won't say it twice,\nso listen good \u2014 you're\na good TRAINER.",
      nm+" turned away, like\nit hadn't said anything\nat all."
    ];
  } else if(family === 'fire'){
    lines = [
      "You sat down. Before you\neven reached for the BALL,\nit cracked open.",
      nm+" bounced into your\nlap, feathers blazing.",
      nm+": TRAINER! Hi! Are we\ngoing? What's next? Are\nthere TRAINERS to fight?",
      "You said you just wanted\nto sit a minute.",
      nm+": ...Oh.",
      nm+": ...Okay.",
      "It snuggled in, suddenly\nstill. The heat from its\nfeathers warmed your hands.",
      nm+": I love you, TRAINER.\nThat's all."
    ];
  } else if(family === 'water'){
    lines = [
      "You sat down. Sent out\n"+nm+".",
      nm+" padded across the\nfloor and stood looking\nup at you.",
      nm+": You're quiet today.",
      "You said yeah.",
      nm+" climbed onto your\nlap and rested its head\nagainst your chest.",
      nm+": I'm here. That's all\nI wanted to say.",
      nm+": ...Take your time.",
      "It didn't move for a long\nwhile. Neither did you."
    ];
  } else {
    // Non-starter fallback — still a bond moment.
    lines = [
      "You sat in the chair.\nReleased "+nm+".",
      nm+" looked at you a long\nmoment, then settled in\nbeside you.",
      "The room stayed quiet.\nNeither of you needed to\nsay anything."
    ];
  }
  dialogue(lines);
}

export function chooseEon(id){
  game.flags.eonChoiceMade=true;
  game.flags.eonId=id;
  game.flags.skyForm=false;
  const msg=giveMon(id, 45);
  markSeen(380); markSeen(381); markCaught(id);
  const nm = id===380 ? "LATIOS" : "LATIAS";
  dialogue([
    nm+" chose you!",
    msg,
    "STEVEN (radio): Incredible. Hold\non \u2014 METAGROSS will set you\ndown in PETALBURG.",
    "You drifted back down to\nPETALBURG TOWN with your new\npartner."
  ], ()=>{
    setMap('PETALBURG_TOWN', 7, 4, 'down');
  });
}

export function giveMon(id,level){
  const m=makeMon(id,level); markCaught(id);
  if(game.party.length<6){ game.party.push(m); return m.name+" joined\nyour party!"; }
  game.pc.push(m); return "Party full \u2014 "+m.name+"\nwas sent to the PC.";
}

export function offerGen2Choice(){
  if(game.party.length>=6){
    dialogue(["POKEMON MAKER: Your party\nis full! Make room and\ncome back for it."]);
    return;
  }
  const opts={152:"CHIKORITA",155:"CYNDAQUIL",158:"TOTODILE"};
  choice("Pick a GEN 2 starter:",
    Object.keys(opts).map(id=>({label:opts[id],fn:()=>{
      const mon=makeMon(+id,5);
      game.party.push(mon); markCaught(+id);
      game.flags.gen2Taken=true; Audio.heal();
      dialogue(["You received "+opts[id]+"!",
        "POKEMON MAKER: A true\nGEN 2 starter — raise it\nwell, trainer!"]);
    }})),
    ()=>dialogue(["POKEMON MAKER: Take your\ntime. I'll keep them safe\nfor you."]));
}

/* ---------------------------------------------------------------------------
   10. BATTLE SYSTEM
--------------------------------------------------------------------------- */

export function tileAt(map,x,y){
  if(y<0||y>=map.grid.length||x<0||x>=map.grid[0].length) return '#';
  return map.grid[y][x];
}

export function solid(ch){ return ch==='#'||ch==='T'||ch==='~'||ch==='H'||ch==='L'||ch==='G'||ch==='M'||ch==='C'||ch==='X'||ch==='v'||ch==='h'||ch==='k'; }

export function isTallGrass(ch){ return ch===','; }


export function npcAt(x,y){ return game.npcs.find(n=>n.x===x&&n.y===y); }


export function tryInteract(){
  const p=game.player;
  let tx=p.x, ty=p.y;
  if(p.dir==='up') ty--; else if(p.dir==='down') ty++;
  else if(p.dir==='left') tx--; else tx++;
  const n=npcAt(tx,ty);
  if(n && n.talk){ Audio.confirm(); if(n.kind!=='ball') n.dir=opposite(p.dir); n.talk(); return true; }
  const fch=tileAt(game.map,tx,ty);
  if(fch==='h'){
    Audio.confirm();
    startStarterTalk();
    return true;
  }
  if(fch==='X'){
    Audio.confirm();
    const cutter=game.party.find(m=>m&&m.cut);
    if(cutter){
      const row=game.map.grid[ty];
      game.map.grid[ty]=row.slice(0,tx)+'.'+row.slice(tx+1);
      Audio.heal();
      dialogue([cutter.name+" used CUT!\nThe small tree was\ncleared away."]);
    } else if(game.flags.hmCut){
      dialogue(["You have HM01 CUT, but no\nPOKEMON has learned it\nyet."]);
    } else {
      dialogue(["A scraggly little tree.\nIt looks like it could\nbe CUT down somehow."]);
    }
    return true;
  }
  const key=tx+':'+ty;
  if(game.map.signs && game.map.signs[key]){ Audio.confirm(); dialogue([game.map.signs[key]]); return true; }
  return false;
}

export function opposite(d){ return d==='up'?'down':d==='down'?'up':d==='left'?'right':'left'; }

/* FOLLOWER ENGINE — HG/SS-style lead Pokemon trailing one tile behind */

export function followerMon(){
  if(!game.flags.followMon) return null;
  const m=game.party[0];
  if(!m || m.hp<=0) return null;
  return m;
}

export function opp(dir){ return dir==='up'?'down':dir==='down'?'up':dir==='left'?'right':'left'; }

export function dirDelta(dir){ return dir==='up'?[0,-1]:dir==='down'?[0,1]:dir==='left'?[-1,0]:[1,0]; }

export function resetFollower(){
  const p=game.player, f=game.follower;
  const d=dirDelta(opp(p.dir)); const bx=p.x+d[0], by=p.y+d[1];
  f.px=bx*TILE; f.py=by*TILE; f.dir=p.dir; f.moving=false; f.mt=0; f.bob=0;
  f.tx=bx; f.ty=by; f.sx=f.px; f.sy=f.py;
  game.trail=[ {x:bx,y:by,dir:p.dir}, {x:p.x,y:p.y,dir:p.dir} ];
}

export function pushTrail(x,y,dir){
  game.trail.push({x:x,y:y,dir:dir});
  if(game.trail.length>8) game.trail.shift();
}

export function stepFollower(){
  if(!followerMon()) return;
  const f=game.follower, t=game.trail;
  if(t.length<2) return;
  const target=t[t.length-2];
  const cx=Math.round(f.px/TILE), cy=Math.round(f.py/TILE);
  if(target.x===cx && target.y===cy) return;
  const ddx=target.x-cx, ddy=target.y-cy;
  if(ddx>0) f.dir='right'; else if(ddx<0) f.dir='left';
  else if(ddy>0) f.dir='down'; else if(ddy<0) f.dir='up';
  f.moving=true; f.sx=f.px; f.sy=f.py; f.tx=target.x; f.ty=target.y; f.mt=0;
}

export function updateFollower(dt){
  const f=game.follower;
  if(!followerMon()){ f.moving=false; return; }
  if(f.moving){
    f.mt+=dt*6.2;
    if(f.mt>=1){ f.mt=0; f.moving=false; f.px=f.tx*TILE; f.py=f.ty*TILE; }
    else { f.px=lerp(f.sx,f.tx*TILE,f.mt); f.py=lerp(f.sy,f.ty*TILE,f.mt); }
    f.bob+=dt*10;
  } else { f.bob=0; }
}


export function updateWorld(dt){
  const p=game.player;
  updateFollower(dt);
  if(consume('menu')){ Audio.select(); game.menu.idx=0; game.state=State.MENU; return; }
  if(consume('a')){ if(tryInteract()) return; }

  if(p.moving){
    p.mt+=dt*6.2;
    if(p.mt>=1){
      p.mt=0; p.moving=false;
      p.px=p.tx*TILE; p.py=p.ty*TILE; p.x=p.tx; p.y=p.ty;
      // Friendship gain on every overworld step (gradual)
      for(const mFr of game.party){ if(mFr) mFr.friendship = Math.min(255, (mFr.friendship|0) + 1); }
      // arrived — warps/exits/grass
      const w=(game.map.warps||[]).find(w=>w.x===p.x&&w.y===p.y);
      const ex=(game.map.exits||[]).find(e=>e.x===p.x&&e.y===p.y);
      if(w){
        // Gated warp: requires a flag (e.g. TRADE PARK needs tradePass).
        if(w.gate && !game.flags[w.gate]){
          var _gm=w.gate==='mirageFinale'
            ?'The HOENN LEAGUE GATE\nis sealed. Complete\nMIRAGE ISLAND first.'
            :'The gate is locked.\nYou need the TRADE PASS\nto enter here.';
          dialogue([_gm]);
          if(p.dir==='up'){ p.y+=1; p.py=p.y*TILE; }
          else if(p.dir==='down'){ p.y-=1; p.py=p.y*TILE; }
          else if(p.dir==='left'){ p.x+=1; p.px=p.x*TILE; }
          else if(p.dir==='right'){ p.x-=1; p.px=p.x*TILE; }
          return;
        }
        Audio.confirm();
        const fromLab=(game.mapName==='LAB' && w.to==='TOWN');
        setMap(w.to,w.tx,w.ty,p.dir);
        if(fromLab && game.flags.hasStarter && !game.flags.rivalBeaten){
          dialogue(["RIVAL: Hey! Wait up!",
                    "RIVAL: Heh — OAK gave you\none too? Let's settle\nthis right here!"],
                   ()=>startRivalBattle());
        }
        return;
      }
      if(ex){
        // gate leaving town until you have a starter
        if(game.mapName==='TOWN' && !game.flags.hasStarter){
          dialogue(["A YOUTH blocks the path.","YOUTH: You can't go up\nthere without a POKEMON!\nSee PROFESSOR OAK first."]);
          p.y=2; p.py=2*TILE; return;
        }
        Audio.confirm();
        setMap(ex.to,ex.tx,ex.ty,p.dir);
        return;
      }
      // === LOS trainer detection ===
      // After arriving at a new tile, check if any LOS-enabled trainer
      // can see the player. If so, fire their talk handler (which starts battle).
      if(game.party.some(m=>m.hp>0)){
        for(const n of (game.map.npcs||[])){
          if(!n.los) continue;
          if(n.losFlag && game.flags[n.losFlag]) continue;
          if(n.present && !n.present()) continue;
          const dx = n.dir==='left' ? -1 : n.dir==='right' ? 1 : 0;
          const dy = n.dir==='up'   ? -1 : n.dir==='down'  ? 1 : 0;
          if(dx===0 && dy===0) continue;
          let spotted = false;
          for(let i=1; i<=n.los; i++){
            const gx = n.x + dx*i, gy = n.y + dy*i;
            const ch = tileAt(game.map, gx, gy);
            if(solid(ch)) break;
            if(p.x === gx && p.y === gy){ spotted = true; break; }
          }
          if(spotted){
            Audio.confirm();
            if(typeof n.talk === 'function') n.talk();
            return;
          }
        }
      }
      const ch=tileAt(game.map,p.x,p.y);
      if((isTallGrass(ch)||ch==='c') && game.map.encounters && game.party.some(m=>m.hp>0)){
        game.step.count++;
        if(game.step.count>=2 && Math.random()<0.18){
          game.step.count=0;
          rollWildEncounter();
          return;
        }
      }
    } else {
      p.px=lerp(p.sx,p.tx*TILE,p.mt);
      p.py=lerp(p.sy,p.ty*TILE,p.mt);
      p.animT+=dt*10;
      p.frame=(Math.floor(p.animT)%2);
    }
    return;
  }

  let dx=0,dy=0,nd=p.dir;
  if(keys.up){ dy=-1; nd='up'; }
  else if(keys.down){ dy=1; nd='down'; }
  else if(keys.left){ dx=-1; nd='left'; }
  else if(keys.right){ dx=1; nd='right'; }

  if(dx||dy){
    p.dir=nd;
    const nx=p.x+dx, ny=p.y+dy;
    const ch=tileAt(game.map,nx,ny);
    const canSurf=game.flags.hmSurf && game.party.some(m=>m&&m.surf);
    const passable=(!solid(ch) && ch!=='D' && ch!=='Y') || ((ch==='~' || ch==='Y') && canSurf);
    if(passable && !npcAt(nx,ny)){
      p.moving=true; p.sx=p.px; p.sy=p.py; p.tx=nx; p.ty=ny; p.mt=0;
      pushTrail(nx,ny,nd); stepFollower();
      Audio.step();
    } else if(ch==='D'){
      // door tile — treat as walkable then warp resolves on arrive (handled via warps)
      p.moving=true; p.sx=p.px; p.sy=p.py; p.tx=nx; p.ty=ny; p.mt=0;
      pushTrail(nx,ny,nd); stepFollower();
    } else { p.frame=0; }
  } else { p.frame=0; p.animT=0; }
}

export function lerp(a,b,t){ return a+(b-a)*t; }


export function rollWildEncounter(){
  const tbl=game.map.encounters!;
  const total=tbl.reduce((s,e)=>s+e.w,0);
  let r=Math.random()*total, pick=tbl[0];
  for(const e of tbl){ if(r<e.w){ pick=e; break; } r-=e.w; }
  const lvl=pick.min+Math.floor(Math.random()*(pick.max-pick.min+1));
  startBattle(makeMon(pick.id,lvl),false);
}

/* ---------------------------------------------------------------------------
   14. RENDER — world
--------------------------------------------------------------------------- */

export function askGender(){
  choice("Are you a BOY\nor a GIRL?",[
    {label:"BOY",  fn:()=>{ game.flags.girl=false; }},
    {label:"GIRL", fn:()=>{ game.flags.girl=true;  }}
  ], ()=>{ game.flags.girl=false; });   // cancel -> default BOY
}

export function updateTitle(dt){
  game.titleT+=dt;
  if(consume('a')||consume('menu')){
    Audio.confirm(); Audio.startMusic();
    setMap('PLAYER_HOUSE',4,4,'down');   // world renders behind the question
    if(hasSave()){
      choice("Welcome back!",[
        {label:"CONTINUE", fn:()=>{ if(!loadGame()) dialogue(["That save couldn't load.\nStarting a new game."],()=>askGender()); }},
        {label:"NEW GAME", fn:()=>askGender()}
      ], ()=>{ if(!loadGame()) askGender(); });   // cancel -> continue if possible
    } else {
      askGender();
    }
  }
}

/* ---------------------------------------------------------------------------
   19. MAIN LOOP
--------------------------------------------------------------------------- */

export function loop(ts){
  if(game.lastTs===null){ game.lastTs=ts; requestAnimationFrame(loop); return; }
  let dt=(ts-game.lastTs)/1000; game.lastTs=ts;
  dt=Math.min(dt,0.1);

  switch(game.state){
    case State.TITLE: updateTitle(dt); break;
    case State.WORLD: updateWorld(dt); break;
    case State.DIALOGUE: updateDialogue(dt); break;
    case State.CHOICE: updateChoice(); break;
    case State.MENU: updateMenu(); break;
    case State.PARTY: updateParty(); break;
    case State.POKEDEX: updatePokedex(); break;
    case State.BAG: updateBag(); break;
    case State.PC: updatePC(); break;
    case State.FLY: updateFly(); break;
    case State.TRAINER: updateTrainer(); break;
    case State.BATTLE: updateBattle(); break;
    case State.EVOLUTION: updateEvolution(dt); break;
    case State.CUTSCENE: if(game.cutscene) game.cutscene.update(dt); break;
  }

  Music.tick(dt);

  ctx.clearRect(0,0,VIEW_W,VIEW_H);
  switch(game.state){
    case State.TITLE: renderTitle(); break;
    case State.WORLD: renderWorld(); break;
    case State.DIALOGUE: renderDialogue(); break;
    case State.CHOICE: renderChoice(); break;
    case State.MENU: renderMenu(); break;
    case State.PARTY: renderParty(); break;
    case State.POKEDEX: renderPokedex(); break;
    case State.BAG: renderBag(); break;
    case State.PC: renderPC(); break;
    case State.FLY: renderFly(); break;
    case State.TRAINER: renderTrainer(); break;
    case State.BATTLE: renderBattle(); break;
    case State.EVOLUTION: renderEvolution(); break;
    case State.CUTSCENE:
      if(game.cutscene){
        // Cutscene renders at native canvas resolution (it expects to drive a 480x... canvas
        // directly). The game ctx is pre-scaled by SCALE, so reset transform, draw, restore.
        ctx.save();
        ctx.setTransform(1,0,0,1,0,0);
        game.cutscene.draw(ctx);
        ctx.restore();
      }
      break;
  }
  requestAnimationFrame(loop);
}

