/* eslint-disable */
import type { MapDef } from '../types';
import { Audio } from '../engine/audio';
import { chooseEon, game, giveMon, offerGen2Choice, pickStarter, setMap, triggerIntroCutscene, isMidE4Gauntlet } from '../game';
import { choice, dialogue } from '../engine/dialogue';
import { healParty, markCaught, markSeen, startAquaSkyBattle, startArchieBattle, startAuroraGymBattle, startBattle, startBigRivalBattle, startBirchGymBattle, startBlaineBattle, startBrawlyBattle, startBrockBattle, startCinnaRivalBattle, startErikaBattle, startGiovanniBattle, startHoennE4_Drake, startHoennE4_Glacia, startHoennE4_Phoebe, startHoennE4_Sidney, startJohtoChamp, startKogaBattle, startLeagueRivalBattle, startMakerRescue, startMarowakBattle, startMaxieClimaxBattle, startMayBattle, startMayRematch1, startMewtwoBoss, startMirageGymBattle, startMistyBattle, startNormanBattle, startRematch, startRocketBoss, startSabrinaBattle, startShipRivalBattle, startSilphBattle, startSteelGymBattle, startStevenChampBattle, startSurgeBattle, startTower, startTrainerFight, startViridianBattle, startZenithGymBattle } from '../engine/battle';
import { makeMon, mkMega } from './dex';
import { openCeruleanShop, openViridianShop, teachCut, teachFly, teachSurf } from '../engine/ui';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: maps

export const TOWN=[
 "TTTT,,,,,,,,TTTT",
 "TT............TT",
 "T..HHHH........T",
 "T..HHHH........T",
 "T..HHDH........T",
 "T..............T",
 "T.....F.F.F....T",
 "T.PPPPPP..LLLL.T",
 "T.P.......LLLL.T",
 "T.P.......LLDL.T",
 "T.P............T",
 "T.PPP.X.X.X..~~T",
 "T~~~~~~~~~~~~~~T",
 "TTTTTTTTTTTTTTTT"
];

export const PLAYER_HOUSE=[
 "#########",
 "#__BB___#",
 "#__BB___#",
 "#_______#",
 "#bb___c_#",
 "#_______#",
 "####D####"
];

export const LAB=[
 "#############",
 "#bb___O___bb#",
 "#bb_______bb#",
 "#___________#",
 "#TT_______TT#",
 "#___________#",
 "#___TT______#",
 "#___________#",
 "######D######"
];

export const ROUTE=[
 "TTTTTTT.TTTTTTT",
 "T.,,,,,,,,,,,.T",
 "T.,,,,,,,,,,,.T",
 "T.............T",
 "T...TT....TT..T",
 "T.............T",
 "T.,,,...,,,,..T",
 "T.,,,...,,,,..T",
 "T.,,,.........T",
 "T.............T",
 "T.....TTT.....T",
 "T..,,........FT",
 "T..,,.....FFF.T",
 "T.............T",
 "T......P......T",
 "TTTTTTTPTTTTTTT"
];


export const VIRIDIAN=[
 "TTTTTTTPTTTTTTT",
 "T..GGGG..MMMM.T",
 "T..GGGG..MMMM.T",
 "T..GDGG..MMDM.T",
 "T.............T",
 "T.CCC.......P.T",
 "T.CCC.......P.T",
 "T.CDC.......P.T",
 "T...........P.T",
 "T.PPPPPPPPPPP.T",
 "T.P...S.....P.T",
 "T.P.........P.T",
 "T......P......T",
 "TTTTTTTPTTTTTTT"
];

export const ROUTE2=[
 "TTTTTTT.TTT.TTT",
 "T.,,,,,,,,,,,.T",
 "T.,,,,,,,,,,,.T",
 "T.....T.T.....T",
 "T.,,,,,,,,,,,.T",
 "T.,,,,,,,,,,,.T",
 "T.....T.T.....T",
 "T.,,,,,,,,,,,.T",
 "T.,,,,,,,,,,,.T",
 "T.....T.T.....T",
 "T.,,,,,,,,,,,.T",
 "T.....,,,.....T",
 "T......P......T",
 "TTTTTTTPTTTTTTT"
];

export const PCENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];

export const PMART=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];


export const MAPS: Record<string, MapDef> = {};
MAPS.TOWN={
  name:'TOWN', grid:TOWN, interior:false,
  npcs:[
    // === Intro cutscene NPCs (visible only before player has a starter) ===
    {x:7,y:2,dir:'down',kind:'oak',name:'INTRO_BIRCH',
     present:()=>!game.flags.introSeen && game.party.length === 0,
     talk:()=>triggerIntroCutscene()},
    {x:8,y:2,dir:'left',kind:'rocket',npcMon:261,name:'INTRO_POOCHYENA',
     present:()=>!game.flags.introSeen && game.party.length === 0,
     talk:()=>triggerIntroCutscene()},
    {x:8,y:5,dir:'down',kind:'npc',name:'YOUTH',
     talk:()=>dialogue(["YOUTH: Tall grass up north\nis full of wild POKEMON.","Don't go in without one\nof your own!"])},
  ],
  signs:{ '2:11':"LITTLEROOT TOWN\nA fresh start by the sea." },
  warps:[
    {x:4,y:4,to:'PLAYER_HOUSE',tx:4,ty:5},   // your house door
    {x:12,y:9,to:'LAB',tx:6,ty:7}            // birch's lab door
  ],
  exits:[
    {x:5,y:0,to:'ROUTE',tx:7,ty:14},
    {x:6,y:0,to:'ROUTE',tx:7,ty:14},
    {x:7,y:0,to:'ROUTE',tx:7,ty:14},
    {x:8,y:0,to:'ROUTE',tx:7,ty:14},
    // South sea exit — only reachable by SURF (water tile)
    {x:7,y:12,to:'OCEAN_ROUTE',tx:7,ty:1}
  ],
  encounters:[
    {id:16,min:2,max:4,w:50}, // Pidgey
    {id:19,min:2,max:4,w:50}  // Rattata
  ]
};
MAPS.PLAYER_HOUSE={
  name:'PLAYER_HOUSE', grid:PLAYER_HOUSE, interior:true,
  npcs:[
    {x:5,y:4,dir:'down',kind:'mom',name:'MOM',
     talk:()=>{
       if(game.party.length===0){
         dialogue([
           "MOM: Good morning, dear!",
           "MOM: PROF. BIRCH went out\nto study wild POKEMON\nthis morning. He should\nbe back by now...",
           "MOM: Maybe go check on\nhim? His LAB is right\ndown the path."]);
       } else {
         dialogue(["MOM: You all look tired.\nLet me patch you up!"], ()=>{
           healParty(); Audio.heal();
           dialogue(["MOM: There! All better.\nDo your best out there!"]);
         });
       }
     }}
  ],
  signs:{},
  warps:[ {x:4,y:6,to:'TOWN',tx:4,ty:5} ],
  exits:[], encounters:null
};
MAPS.LAB={
  name:'LAB', grid:LAB, interior:true,
  npcs:[
    {x:6,y:1,dir:'down',kind:'oak',name:'BIRCH',fixed:true,
     talk:()=>{
       if(!game.flags.hasStarter){
         dialogue([
           "PROF. BIRCH: Ah, my favorite\nstarting trainer! Help\nyourself.",
           "On the table are three\nPOKE BALLS. Walk up to\none and press A to take it."]);
       } else if(game.flags.pokedex){
         dialogue([
           "PROF. BIRCH: Filling out the\nPOKEDEX is the work of a\nlifetime — keep at it!",
           "PROF. BIRCH: Once you've\ngot a few badges, you'll\noutgrow this region."]);
       } else {
         dialogue([
           "PROF. BIRCH: My daughter MAY\nis waiting for you on\nROUTE 2 — past OLDALE.",
           "PROF. BIRCH: She's carrying\na POKEDEX for you. Battle\nher first to prove you're\nready for it.",
           "PROF. BIRCH: Then keep\nheading north — your real\njourney starts at the\nfirst GYM in RUSTBORO."]);
       }
     }},
    {x:3,y:2,dir:'down',kind:'ball',name:'BALL_TREECKO',ball:252,
     talk:()=>pickStarter(252)},
    {x:6,y:2,dir:'down',kind:'ball',name:'BALL_TORCHIC',ball:255,
     talk:()=>pickStarter(255)},
    {x:9,y:2,dir:'down',kind:'ball',name:'BALL_MUDKIP',ball:258,
     talk:()=>pickStarter(258)}
  ],
  signs:{},
  warps:[ {x:6,y:8,to:'TOWN',tx:12,ty:10} ],
  exits:[], encounters:null
};
MAPS.ROUTE={
  name:'ROUTE', grid:ROUTE, interior:false,
  npcs:[
    {x:3,y:6,dir:'right',kind:'npc',name:'ROUTE101_HIKER',
     talk:()=>dialogue([
       "HIKER: Beautiful day for\na walk, isn't it?",
       "HIKER: Wild POOCHYENA can\nbe scrappy. Don't lose to\nthem with that fresh\nstarter of yours!"])}
  ],
  signs:{ '8:14':"ROUTE 101\nLITTLEROOT — VIRIDIAN" },
  warps:[],
  exits:[
    {x:7,y:15,to:'TOWN',tx:7,ty:1},
    {x:7,y:0,to:'VIRIDIAN',tx:7,ty:11}
  ],
  encounters:[
    {id:261,min:2,max:5,w:35}, // Poochyena
    {id:263,min:2,max:5,w:35}, // Zigzagoon
    {id:265,min:2,max:4,w:15}, // Wurmple
    {id:16, min:2,max:5,w:10}, // Pidgey (cameo)
    {id:19, min:2,max:5,w:5}   // Rattata (cameo)
  ]
};
MAPS.VIRIDIAN={
  name:'VIRIDIAN', grid:VIRIDIAN, interior:false,
  npcs:[
    {x:4,y:4,dir:'down',kind:'npc',name:'OLDALE_OBSERVER',
     talk:()=>dialogue([
       "BIRDWATCHER: This town's\ngot no GYM, friend.",
       "BIRDWATCHER: First STONE\nBADGE is up north — head\nthrough ROUTE 2 to\nRUSTBORO CITY."])},
    {x:9,y:4,dir:'down',kind:'npc',name:'POKE_MAKER',
     talk:()=>{
       if(game.flags.gen2Taken){
         dialogue(["POKEMON MAKER: Take good\ncare of that rare little\none, would you?"]);
       } else if(game.flags.makerSaved){
         offerGen2Choice();
       } else {
         dialogue([
           "An old POKEMON BREEDER\nis cornered by a TEAM\nMAGMA GRUNT in red gear!",
           "BREEDER: Help! He's after\nmy rare HATCHLING. Please —\ndrive him off!"],
           ()=>startMakerRescue());
       }
     }}
  ],
  signs:{ '6:10':"OLDALE TOWN\nA quiet trader\ncrossroads. The first\nGYM is north in RUSTBORO." },
  warps:[
    {x:11,y:3,to:'PMART',tx:4,ty:4},     // poke mart door
    {x:3,y:7,to:'PCENTER',tx:4,ty:4}     // poke center door
  ],
  exits:[
    {x:7,y:13,to:'ROUTE',tx:5,ty:1},     // south -> Route 1
    {x:7,y:0,to:'ROUTE2',tx:7,ty:12}     // north -> Route 2
  ],
  encounters:null
};
MAPS.PCENTER={
  name:'PCENTER', grid:PCENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){
         dialogue(["NURSE: Welcome! Come back\nonce you have a POKEMON\nto heal."]);
         return;
       }
       dialogue(["NURSE: Welcome to the\nPOKEMON CENTER!",
                 "NURSE: We'll restore your\nPOKEMON to full health.\nOne moment, please..."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: Thank you for\nwaiting! Your POKEMON are\nfully healed.",
                   "NURSE: We hope to see\nyou again!"]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'VIRIDIAN',tx:3,ty:8} ],
  exits:[], encounters:null
};
MAPS.ROUTE2={
  name:'ROUTE2', grid:ROUTE2, interior:false,
  npcs:[
    {x:7,y:9,dir:'down',kind:'rival',name:'MAY_ROUTE2',
     present:()=>game.flags.hasStarter && !game.flags.mayBeaten,
     los:5, losFlag:'mayBeaten',
     talk:()=>{
       dialogue([
         "MAY: Hey, there you are!\nMy dad PROF. BIRCH said\nyou'd come this way.",
         "MAY: I'm MAY. I just\nstarted my journey too!",
         "MAY: Let's see what you\nlearned — battle me!"
       ], () => startMayBattle());
     }},
    {x:11,y:1,dir:'down',kind:'npc',name:'ROUTE2_KID',
     talk:()=>dialogue([
       "KID: Whoa, a real trainer!\nWhere are you headed?",
       "KID: RUSTBORO CITY's just\nup the path. First gym in\nthe region — STONE BADGE\nwaits there!"])}
  ],
  signs:{ '7:13':"ROUTE 2\nSouth: OLDALE TOWN.\nNorth: RUSTBORO CITY.\nMAY trains here." },
  warps:[],
  exits:[
    {x:7,y:13,to:'VIRIDIAN',tx:7,ty:1},
    {x:7,y:0,to:'PEWTER',tx:7,ty:10},
    {x:11,y:0,to:'PEWTER',tx:7,ty:10}
  ],
  encounters:[
    {id:265,min:3,max:6,w:30}, // Wurmple
    {id:263,min:3,max:6,w:30}, // Zigzagoon
    {id:261,min:3,max:5,w:20}, // Poochyena
    {id:270,min:3,max:5,w:15}, // Lotad
    {id:273,min:3,max:5,w:5}   // Seedot
  ]
};

export const ROCKET_HIDEOUT=[
 "TTTTTTTTTTTTTTT",
 "T.....T.T.....T",
 "T.,,,.T.T.,,,.T",
 "T.,,,.T.T.,,,.T",
 "T.,,,.....,,,.T",
 "T.....T.T.....T",
 "T.,,,.T.T.,,,.T",
 "T.,,,.T.T.,,,.T",
 "T.,,,.....,,,.T",
 "T.....T.T.....T",
 "T.,,,.....,,,.T",
 "TTTTTTTPTTTTTTT"
];
MAPS.ROCKET_HIDEOUT={
  name:'ROCKET_HIDEOUT', grid:ROCKET_HIDEOUT, interior:true,
  npcs:[
    {x:7,y:1,dir:'down',kind:'rocket',name:'ROCKET_BOSS',
     present:()=>!game.flags.rocketBossBeaten,
     talk:()=>dialogue([
       "ROCKET BOSS: So a brat\nfound our hideout. Bold.",
       "ROCKET BOSS: You won't\nleave here bragging about\nit. TEAM ROCKET — attack!"],
       ()=>startRocketBoss())},
    {x:7,y:5,dir:'down',kind:'rocket',name:'ROCKET_BARRIER',
     present:()=>!game.flags.rocketSwitch,
     talk:()=>dialogue([
       "A TEAM ROCKET guard holds\nthe inner door shut.",
       "GUARD: This door's locked\nby a control SWITCH.\nYou'll never find it!"])},
    {x:13,y:9,dir:'down',kind:'npc',name:'ROCKET_LEVER',
     talk:()=>{
       if(!game.flags.rocketSwitch){
         dialogue([
           "A heavy control LEVER is\nbolted to the wall here.",
           "You threw the LEVER.",
           "CLU-CLUNK! Something\nunlocked to the north."],
           ()=>{ game.flags.rocketSwitch=true;
                  game.npcs=game.npcs.filter(n=>n.name!=='ROCKET_BARRIER');
                  Audio.heal(); });
       } else {
         dialogue(["The LEVER is already\nthrown. The way north\nis open."]);
       }
     }}
  ],
  signs:{ '7:10':"TEAM ROCKET HIDEOUT\nWild POKEMON roam the\nover-grown halls." },
  warps:[],
  exits:[ {x:7,y:11,to:'ROUTE2',tx:7,ty:1} ],
  encounters:[
    {id:19,min:12,max:17,w:60}, // Rattata
    {id:25,min:12,max:17,w:39}, // Pikachu
    {id:133,min:12,max:17,w:1}  // Eevee — 1% rare (see note: "stther")
  ]
};

export const PEWTER=[
 "TTTTTTTTTTT.TTT",
 "T.....GGG.....T",
 "T.....GGG.....T",
 "T.....GDG.....T",
 "T......P......T",
 "T.....F.F.....T",
 "T.............T",
 "T...H.....H...T",
 "T.............T",
 "T...S.........T",
 "T.............T",
 "TTTTTTTPTTTTTTT"
];

export const PEWTER_GYM=[
 "###########",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.PEWTER={
  name:'PEWTER', grid:PEWTER, interior:false,
  npcs:[
    {x:10,y:6,dir:'down',kind:'oak',name:'DEVON_RESEARCHER',
     present:()=>!game.flags.devonCableGift,
     talk:()=>{
       dialogue([
         "RESEARCHER: Oh! A new\ntrainer. I'm from DEVON\nCORPORATION.",
         "RESEARCHER: We've been\ndeveloping a device that\nsimulates POKEMON trades.",
         "RESEARCHER: It's called a\nLINK CABLE. Try it on a\nMACHOKE, GRAVELER, KADABRA\nor HAUNTER!",
         "RESEARCHER: It also works\non SCYTHER, ONIX, SEADRA,\nand PORYGON.",
         "You received a LINK CABLE!"
       ], () => {
         game.bag.linkcable = (game.bag.linkcable || 0) + 1;
         game.flags.devonCableGift = true;
         Audio.heal();
         dialogue([
           "RESEARCHER: Use it from\nyour BAG. Each cable\ntriggers one evolution.",
           "RESEARCHER: Come back if\nyou ever need more — I\nmake them by hand."
         ]);
       });
     }},
    {x:5,y:8,dir:'down',kind:'rival',name:'WALLY',
     present:()=>!game.flags.wallyGift,
     talk:()=>{
       if(game.party.length >= 6){
         dialogue([
           "WALLY: Hi! I'd give you a\nrare POKEMON but your\nparty is full.",
           "WALLY: Come back when you\nhave room — I'll be here!"]);
         return;
       }
       dialogue([
         "WALLY: H-hi there! I'm\nWALLY. My uncle is PROF.\nBIRCH.",
         "WALLY: I caught my first\nPOKEMON yesterday — a\nRALTS! It was so cool.",
         "WALLY: Dad won't let me\ngo on a real journey yet,\nbut I caught two RALTS\nby mistake!",
         "WALLY: Take one! He's\nrare — a PSYCHIC type.\nHe'll be a great partner.",
         "You received a RALTS!"
       ], () => {
         const ralts = makeMon(280, 10);
         if(game.party.length < 6){
           game.party.push(ralts);
         } else {
           game.pc.push(ralts);
         }
         markCaught(280);
         game.flags.wallyGift = true;
         Audio.heal();
         dialogue([
           "WALLY: Take good care of\nhim! Now go beat ROXANNE\nfor me — I'm rooting for\nyou!"
         ]);
       });
     }},
    {x:9,y:6,dir:'down',kind:'npc',name:'RUSTBORO_TOWNIE',
     talk:()=>dialogue(["TOWNIE: This is RUSTBORO\nCITY — built on stone\nand polished metal.",
       "TOWNIE: The GYM LEADER\nROXANNE specializes in\nROCK-type POKEMON. WATER\nand GRASS work wonders!"])},
    {x:11,y:1,dir:'down',kind:'npc',name:'TUNNEL_GUARD',
     present:()=>!game.flags.brockBeaten,
     talk:()=>dialogue([
       "GUARD: The tunnel north\nleads deeper into the\nregion.",
       "GUARD: But beat ROXANNE\nat the RUSTBORO GYM first.\nThe path ahead is no\nplace for rookies."])}
  ],
  signs:{ '4:9':"RUSTBORO CITY\nA city of stone.\nGYM LEADER: ROXANNE",
          '11:2':"NORTHERN TUNNEL\nStrong wild POKEMON\nlive deeper in." },
  warps:[ {x:7,y:3,to:'PEWTER_GYM',tx:5,ty:7} ],
  exits:[ {x:7,y:11,to:'ROUTE2',tx:11,ty:1},
          {x:11,y:0,to:'RUSTURF_TUNNEL',tx:8,ty:22} ],
  encounters:null
};
/* ============================================================
   RUSTURF TUNNEL — long cave linking Rustboro to Verdanturf.
   Wild encounters + LOS trainers. Magma Grunt story battle.
   ============================================================ */

export const RUSTURF_TUNNEL=[
 "########D########",  //  0  north exit -> VERDANTURF
 "#cccccccccccccccc",  //  1
 "#cccTcccccccTcccc",  //  2
 "#cccccccccccccccc",  //  3
 "#cccccccccccccccc",  //  4
 "#cccTccc##ccTcccc",  //  5
 "#cccccc#cc#cccccc",  //  6
 "#cccccc#cc#cccccc",  //  7
 "#cccccc####cccccc",  //  8
 "#cccccccccccccccc",  //  9
 "#cTccccccccccTccc",  // 10
 "#cccccccccccccccc",  // 11
 "#cccccccccccccccc",  // 12
 "#cccccTcccTcccccc",  // 13
 "#cccccccccccccccc",  // 14
 "#cc##ccccccc##ccc",  // 15
 "#cc##ccccccc##ccc",  // 16
 "#cccccccccccccccc",  // 17
 "#cccccccccccccccc",  // 18
 "#cccccccTcccccccc",  // 19
 "#cccccccccccccccc",  // 20
 "#cccccccccccccccc",  // 21
 "#cccccccccccccccc",  // 22
 "########D########"   // 23  south exit -> RUSTBORO (PEWTER map)
];
MAPS.RUSTURF_TUNNEL={
  name:'RUSTURF_TUNNEL', grid:RUSTURF_TUNNEL, interior:true,
  npcs:[
    // LOS Hiker #1 — facing UP from row 7, watches cols 7 (3 tiles)
    {x:8,y:21,dir:'up',kind:'npc',name:'HIKER_RT1',
     los:4, losFlag:'rt_hiker1',
     talk:()=>{
       if(game.flags.rt_hiker1){
         dialogue(["HIKER: That GRAVELER hit\nme like a truck."]);
         return;
       }
       dialogue([
         "HIKER: Hey! You there!\nA tunnel is no place for\na rookie!",
         "HIKER: Let me show you\nwhat the dark trains!"
       ], ()=>{
         const geo = makeMon(74, 16);
         const mac = makeMon(67, 17);  // Machoke — needs LINK CABLE to evolve further
         startBattle(geo, true, 'HIKER');
         game.battle!.foeTeam = [mac];
         game.battle!.isRusturfHiker1 = true;
       });
     }},
    // LOS Hiker #2 — facing LEFT from col 14, row 12, watches 4 tiles
    {x:14,y:12,dir:'left',kind:'npc',name:'HIKER_RT2',
     los:5, losFlag:'rt_hiker2',
     talk:()=>{
       if(game.flags.rt_hiker2){
         dialogue(["HIKER: My ZUBAT needs\na rest after that."]);
         return;
       }
       dialogue([
         "HIKER: A challenger! These\ntunnels are MY training\nground!",
         "HIKER: Bring it on!"
       ], ()=>{
         const zub = makeMon(41, 15);
         const geo2 = makeMon(74, 18);
         const ony = makeMon(95, 18);   // Onix (NOT trade-evolving; player needs LINK CABLE for player-side Steelix)
         startBattle(zub, true, 'HIKER');
         game.battle!.foeTeam = [geo2, ony];
         game.battle!.isRusturfHiker2 = true;
       });
     }},
    // LOS Magma Grunt — story battle. Watches a long line.
    {x:8,y:4,dir:'down',kind:'rocket',name:'MAGMA_TUNNEL_GRUNT',
     los:6, losFlag:'rt_magma',
     talk:()=>{
       if(game.flags.rt_magma){
         dialogue([
           "MAGMA GRUNT: Tch... go on,\nthen. TEAM MAGMA's plans\nare bigger than YOU."]);
         return;
       }
       dialogue([
         "MAGMA GRUNT: Whoa whoa —\nback off, kid!",
         "MAGMA GRUNT: I just\nlifted some DEVON GOODS\nfrom RUSTBORO. They're\ngonna make us RICH.",
         "MAGMA GRUNT: ...wait, you\nwanna BATTLE? Fine. Don't\ncry when you lose!"
       ], ()=>{
         const pooch = makeMon(261, 17);  // Poochyena
         const slug  = makeMon(218, 18);  // Slugma (stand-in for Numel — fire/ground vibe)
         startBattle(pooch, true, 'MAGMA GRUNT');
         game.battle!.foeTeam = [slug];
         game.battle!.isRusturfMagma = true;
       });
     }}
  ],
  signs:{ '8:22':"RUSTURF TUNNEL\nSouth: RUSTBORO.\nNorth: VERDANTURF." },
  warps:[],
  exits:[
    {x:8,y:0, to:'VERDANTURF', tx:7,ty:11},
    {x:8,y:23,to:'PEWTER',     tx:11,ty:1}
  ],
  encounters:[
    {id:41, min:8, max:14,w:25},  // Zubat   (Gen 1 cave staple)
    {id:74, min:8, max:14,w:25},  // Geodude (Gen 1 Rock)
    {id:185,min:10,max:16,w:15},  // Sudowoodo (Gen 2 Rock)
    {id:299,min:10,max:16,w:15},  // Nosepass  (Gen 3 Rock — Roxanne's signature line)
    {id:95, min:10,max:18,w:10},  // Onix    (Gen 1 Rock — large)
    {id:304,min:8, max:14,w:7},   // Aron    (Gen 3 Steel/Rock — rare)
    {id:213,min:8, max:14,w:3}    // Shuckle (Gen 2 Bug/Rock — very rare)
  ]
};

export const MT_MOON=[
 "#######D#######",
 "#ccccccccccccc#",
 "#cTccTccTccTcc#",
 "#ccccccccccccc#",
 "#cTccTccTccTcc#",
 "#ccccccccccccc#",
 "#cTccTccTccTcc#",
 "#ccccccccccccc#",
 "#cTccTccTccTcc#",
 "#ccccccccccccc#",
 "#ccccccccccccc#",
 "#######D#######"
];
/* ============================================================
   VERDANTURF TOWN — small town at the north end of Rusturf Tunnel.
   Has the second GYM (Brawly, Fighting type).
   ============================================================ */

export const VERDANTURF=[
 "TTTTTTTTTTTTTTT",  //  0
 "T.............T",  //  1
 "T..GGGG.......T",  //  2  GYM upper-left
 "T..GGGG.......T",  //  3
 "T..GDGG.......T",  //  4  gym door (4,4)
 "T.............P",  //  5  east path -> TRADE ROUTE
 "T.........CCC.T",  //  6  PCenter
 "T.........CCC.T",  //  7
 "T.........CDC.T",  //  8  PC door
 "P.............T",  //  9  west path -> MIRAGE_ROUTE
 "T..F....F.....T",  // 10
 "T......P......T",  // 11  tunnel exit to south
 "TTTTTTTPTTTTTTT"   // 12
];

export const VERDANTURF_GYM=[
 "###########",
 "#_________#",
 "#____O____#",   // Brawly position
 "#_________#",
 "#_TT___TT_#",   // sparring mats (T as solid mat blocks)
 "#_________#",
 "#__O___O__#",   // gym trainers
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.VERDANTURF={
  name:'VERDANTURF', grid:VERDANTURF, interior:false,
  npcs:[
    // May rematch — appears after Roxanne, before Brawly
    {x:7,y:9,dir:'down',kind:'rival',name:'MAY_VERDANTURF',
     present:()=>game.flags.brockBeaten && !game.flags.mayRematch1,
     los:4, losFlag:'mayRematch1',
     talk:()=>{
       dialogue([
         "MAY: Hey! You made it\nthrough the tunnel!",
         "MAY: I heard a TEAM\nMAGMA grunt was in there.\nGood thing you handled it.",
         "MAY: I've been training\ntoo. Let's see how far\nyou've come!"
       ], ()=>startMayRematch1());
     }},
    {x:3,y:9,dir:'down',kind:'npc',name:'VERDANTURF_TOWNIE',
     talk:()=>dialogue([
       "TOWNIE: Welcome to\nVERDANTURF TOWN. The air\nhere is clean and fresh.",
       "TOWNIE: GYM LEADER BRAWLY\nis the second test of\nyour journey. He fights\ndirty — FIGHTING-type."])}
  ],
  signs:{ '5:11':"VERDANTURF TOWN\nThe sweet-air town." },
  warps:[
    {x:4,y:4,to:'VERDANTURF_GYM',tx:5,ty:8},
    {x:10,y:8,to:'PCENTER',tx:4,ty:4}
  ],
  exits:[
    {x:7,y:12,to:'RUSTURF_TUNNEL',tx:8,ty:1},
    {x:14,y:5,to:'TRADE_ROUTE',tx:1,ty:7},   // east -> TRADE ROUTE
    {x:0,y:9,to:'MIRAGE_ROUTE',tx:1,ty:7}    // west -> new MIRAGE ROUTE
  ],
  encounters:null
};
MAPS.VERDANTURF_GYM={
  name:'VERDANTURF_GYM', grid:VERDANTURF_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'BRAWLY',fixed:true,
     talk:()=>{
       if(game.flags.brawlyBeaten){
         dialogue(["BRAWLY: Ride the big wave,\nchallenger! You're getting\nstronger every day."]);
       } else {
         dialogue([
           "BRAWLY: Wahaha! Another\nchallenger washes up on\nmy shore!",
           "BRAWLY: I'm BRAWLY,\nVERDANTURF's GYM LEADER.\nFIGHTING-type is my\npassion!",
           "BRAWLY: Show me you can\nride my wave!"
         ], ()=>startBrawlyBattle());
       }
     }},
    // Two gym apprentice LOS trainers — beat them before reaching Brawly
    {x:3,y:6,dir:'right',kind:'npc',name:'GYM_APP1',
     los:4, losFlag:'brawly_app1',
     talk:()=>{
       if(game.flags.brawly_app1){
         dialogue(["APPRENTICE: BRAWLY is\nstraight ahead."]);
         return;
       }
       dialogue([
         "APPRENTICE: Stop right\nthere! Train with me\nfirst!"
       ], ()=>{
         const mac = makeMon(66, 15);
         startBattle(mac, true, 'APPRENTICE');
         game.battle!.isBrawlyApp1 = true;
       });
     }},
    {x:7,y:6,dir:'left',kind:'npc',name:'GYM_APP2',
     los:4, losFlag:'brawly_app2',
     talk:()=>{
       if(game.flags.brawly_app2){
         dialogue(["APPRENTICE: My MANKEY\nstill stings."]);
         return;
       }
       dialogue([
         "APPRENTICE: A new face!\nLet's spar!"
       ], ()=>{
         const man = makeMon(56, 16);
         startBattle(man, true, 'APPRENTICE');
         game.battle!.isBrawlyApp2 = true;
       });
     }}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'VERDANTURF',tx:4,ty:5} ],
  exits:[], encounters:null
};
MAPS.MT_MOON={
  name:'MT_MOON', grid:MT_MOON, interior:true,
  npcs:[
    {x:7,y:1,dir:'down',kind:'rocket',name:'MT_RIVAL',
     present:()=>!game.flags.rivalBigBeaten,
     talk:()=>dialogue([
       "RIVAL: Hah! Fancy meeting\nyou deep in MT. MOON.",
       "RIVAL: I've caught some\nREAL powerhouses since\nPEWTER. Three of them.",
       "RIVAL: My WARTORTLE will\ncrush you. Let's GO!"],
       ()=>startBigRivalBattle())},
    {x:3,y:9,dir:'down',kind:'npc',name:'MT_HIKER',
     present:()=>!game.flags.mtm_t1,
     talk:()=>dialogue(["HIKER: This cave is MY\ntraining ground! Battle!"],
       ()=>startTrainerFight('MT_HIKER','HIKER',[makeMon(74,26),makeMon(95,28)],'mtm_t1'))},
    {x:11,y:5,dir:'down',kind:'npc',name:'MT_LASS',
     present:()=>!game.flags.mtm_t2,
     talk:()=>dialogue(["LASS: Eep! A challenger!\nMy CLEFAIRY won't lose!"],
       ()=>startTrainerFight('MT_LASS','LASS',[makeMon(35,27),makeMon(42,28)],'mtm_t2'))},
    {x:5,y:3,dir:'down',kind:'npc',name:'MT_NERD',
     present:()=>!game.flags.mtm_t3,
     talk:()=>dialogue(["SUPER NERD: My ROCK POKEMON\nare scientifically superior!"],
       ()=>startTrainerFight('MT_NERD','SUPER NERD',[makeMon(109,27),makeMon(75,29)],'mtm_t3'))},
    {x:12,y:2,dir:'down',kind:'npc',name:'MT_FOSSIL',
     talk:()=>{
       if(game.flags.fossil){
         dialogue(["EXPLORER: That "+game.flags.fossil+"\nFOSSIL you took — guard\nit well!"]);
       } else {
         dialogue([
           "EXPLORER: Two fossils are\nwedged in the rock here.",
           "EXPLORER: I can only free\none. Which do you want?"],
           ()=>choice("Take which FOSSIL?",[
             {label:"DOME",  fn:()=>{ game.flags.fossil='DOME';  Audio.heal(); dialogue(["You obtained the\nDOME FOSSIL!"]); }},
             {label:"HELIX", fn:()=>{ game.flags.fossil='HELIX'; Audio.heal(); dialogue(["You obtained the\nHELIX FOSSIL!"]); }}
           ], ()=>dialogue(["EXPLORER: Take your time\ndeciding."])));
       }
     }}
  ],
  signs:{ '7:10':"MT. MOON\nDark and full of wild\nPOKEMON. A RIVAL waits\ndeep inside." },
  warps:[],
  exits:[ {x:7,y:11,to:'PEWTER',tx:11,ty:1},
          {x:7,y:0,to:'CERULEAN',tx:7,ty:10} ],
  encounters:[
    {id:41,min:25,max:30,w:30}, // Zubat
    {id:74,min:25,max:30,w:24}, // Geodude
    {id:42,min:27,max:30,w:15}, // Golbat
    {id:75,min:27,max:30,w:12}, // Graveler
    {id:35,min:25,max:29,w:9},  // Clefairy
    {id:95,min:26,max:30,w:7},  // Onix
    {id:36,min:28,max:30,w:3}   // Clefable
  ]
};

export const CERULEAN=[
 "TTTTTTTPTTTTTTT",
 "T..CCC...GGG..T",
 "T..CCC...GGG..T",
 "T..CDC...GDG..T",
 "T............X.",
 "T...MMM.......T",
 "T...MMM.......T",
 "P...MDM.......T",
 "T.........~~~.T",
 "T.........~~~.T",
 "T..S..........T",
 "TTTTTTTPTTTTTTT"
];
MAPS.CERULEAN={
  name:'CERULEAN', grid:CERULEAN, interior:false,
  npcs:[
    {x:8,y:9,dir:'down',kind:'npc',name:'CER_TOWNIE',
     talk:()=>dialogue(["TOWNIE: CERULEAN CITY —\na beautiful city of\nwater.",
       "TOWNIE: The GYM LEADER\nMISTY uses WATER POKEMON.\nHer GOLDUCK is brutal!"])},
    {x:11,y:8,dir:'down',kind:'rocket',npcMon:145,name:'ZAPDOS',
     present:()=>!game.flags.zapdosSeen,
     talk:()=>{ dialogue([
       "A POWER PLANT looms across\nthe water near the docks.",
       "ZAPDOS, the electric bird,\nguards it — and it sees\nyou! It attacks!"],()=>{
         game.flags.zapdosSeen=true;
         startBattle(makeMon(145,60),false);
       }); }},
    {x:1,y:7,dir:'left',kind:'npc',name:'CELADON_GUARD',
     present:()=>!game.flags.thunderBadge,
     talk:()=>dialogue([
       "GUARD: The road west to\nCELADON CITY is long and\nrough.",
       "GUARD: Come back once\nyou've beaten LT. SURGE\nin VERMILION."])}
  ],
  signs:{ '3:10':"CERULEAN CITY\nA Mysterious, Blue\nAura Surrounds It.\nLEADER: MISTY",
          '1:8':"West path -> CELADON\n(after the THUNDER\nBADGE).",
          '7:10':"Surf the pond to find\nZAPDOS by the POWER\nPLANT. (Need SURF.)" },
  warps:[
    {x:4,y:3,to:'CERULEAN_CENTER',tx:4,ty:4},
    {x:10,y:3,to:'CERULEAN_GYM',tx:5,ty:6},
    {x:5,y:7,to:'CERULEAN_MART',tx:4,ty:4}
  ],
  exits:[ {x:7,y:11,to:'MT_MOON',tx:7,ty:2},
          {x:7,y:0,to:'BRIDGE',tx:7,ty:12},
          {x:14,y:4,to:'ROUTE_VERM',tx:1,ty:4},
          {x:0,y:7,to:'ROUTE_CELADON',tx:13,ty:4} ],
  encounters:null
};

export const CERULEAN_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.CERULEAN_CENTER={
  name:'CERULEAN_CENTER', grid:CERULEAN_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the\nPOKEMON CENTER!",
                 "NURSE: We'll restore your\nPOKEMON. One moment..."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! We hope\nto see you again!"]);
       });
     }}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'CERULEAN',tx:4,ty:4} ], exits:[], encounters:null
};

export const CERULEAN_MART=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.CERULEAN_MART={
  name:'CERULEAN_MART', grid:CERULEAN_MART, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'clerk',name:'CER_CLERK',
     talk:()=>dialogue([
       "CLERK: Welcome to the\nCERULEAN POKE MART!",
       "CLERK: GREAT BALLS and\nSUPER POTIONS, P500 each."],()=>openCeruleanShop())}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'CERULEAN',tx:5,ty:8} ], exits:[], encounters:null
};

export const CERULEAN_GYM=[
 "###########",
 "#_________#",
 "#~~~___~~~#",
 "#_________#",
 "#~~~___~~~#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.CERULEAN_GYM={
  name:'CERULEAN_GYM', grid:CERULEAN_GYM, interior:true,
  npcs:[
    {x:5,y:1,dir:'down',kind:'npc',name:'MISTY',
     present:()=>!game.flags.mistyBeaten,
     talk:()=>dialogue([
       "MISTY: I'm MISTY, the\nCERULEAN GYM LEADER!",
       "MISTY: I train WATER\nPOKEMON. My GOLDUCK will\nsink you. Let's battle!"],
       ()=>startMistyBattle())},
    {x:3,y:6,dir:'down',kind:'npc',name:'CER_GUIDE',
     talk:()=>dialogue([game.flags.mistyBeaten
        ? "GUIDE: You beat MISTY!\nThat CASCADE BADGE looks\ngood on you."
        : "GUIDE: MISTY sends out\nMAGIKARP, then GYARADOS,\nand finishes with her\nace GOLDUCK. Be ready!"])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'CERULEAN',tx:10,ty:4} ], exits:[], encounters:null
};

export const BRIDGE=[
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~...~~P~~~~~~~",
 "~~.D.~~P~~~~~~~",
 "~~...~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~",
 "~~~~~~~P~~~~~~~"
];
MAPS.BRIDGE={
  name:'BRIDGE', grid:BRIDGE, interior:false,
  npcs:[
    {x:7,y:10,dir:'down',kind:'npc',name:'BR_T1',
     present:()=>!game.flags.br_t1,
     talk:()=>dialogue(["BUG CATCHER: You're crossing\nMY bridge? Battle me\nfirst!"],
       ()=>startTrainerFight('BR_T1','BUG CATCHER',[makeMon(12,30),makeMon(15,31)],'br_t1'))},
    {x:7,y:8,dir:'down',kind:'npc',name:'BR_T2',
     present:()=>!game.flags.br_t2,
     talk:()=>dialogue(["LASS: Hee hee! You won't\nget past me so easily!"],
       ()=>startTrainerFight('BR_T2','LASS',[makeMon(44,32),makeMon(70,33)],'br_t2'))},
    {x:7,y:6,dir:'down',kind:'npc',name:'BR_T3',
     present:()=>!game.flags.br_t3,
     talk:()=>dialogue(["JR TRAINER: Halfway across!\nBut you won't beat ME!"],
       ()=>startTrainerFight('BR_T3','JR TRAINER',[makeMon(17,33),makeMon(20,34)],'br_t3'))},
    {x:7,y:4,dir:'down',kind:'npc',name:'BR_T4',
     present:()=>!game.flags.br_t4,
     talk:()=>dialogue(["HIKER: Hrmph! My ROCK\nPOKEMON will end your\ncrossing here!"],
       ()=>startTrainerFight('BR_T4','HIKER',[makeMon(67,34),makeMon(95,35)],'br_t4'))},
    {x:7,y:2,dir:'down',kind:'rocket',name:'BR_GRUNT',
     present:()=>!game.flags.br_grunt,
     talk:()=>dialogue([
       "ROCKET GRUNT: Heh. So you\nbeat the others. TEAM\nROCKET ends your trip\nhere, kid.",
       "ROCKET GRUNT: My DRATINI,\nARBOK, and ace SCYTHER\nwill flatten you!"],
       ()=>startTrainerFight('BR_GRUNT','ROCKET GRUNT',
            [makeMon(147,30),makeMon(24,35),makeMon(123,40)],'br_grunt'))}
  ],
  signs:{ '3:3':"CERULEAN CAVE\nA cold draft pours\nfrom the dark mouth." },
  warps:[ {x:3,y:3,to:'CERULEAN_CAVE',tx:7,ty:8} ],
  exits:[
    {x:7,y:13,to:'CERULEAN',tx:7,ty:1},
    {x:7,y:0,to:'SHIP',tx:7,ty:11}
  ],
  encounters:null
};

export const CERULEAN_CAVE=[
 "###############",
 "#ccccccccccccc#",
 "#ccccccccccccc#",
 "#ccc#######ccc#",
 "#ccc#cccccc#cc#",
 "#ccc#cccccc#cc#",
 "#ccc#######ccc#",
 "#ccccccccccccc#",
 "#ccccccccccccc#",
 "#######D#######"
];
MAPS.CERULEAN_CAVE={
  name:'CERULEAN_CAVE', grid:CERULEAN_CAVE, interior:true,
  npcs:[
    {x:7,y:4,dir:'down',kind:'npc',name:'CC_ITEM',
     talk:()=>{
       if(!game.flags.ccItem){
         dialogue(["A strange capsule rests\non a rock shelf...",
                   "You found a MASTER BALL!"],()=>{
           game.flags.ccItem=true;
           game.bag.masterball=(game.bag.masterball|0)+1; Audio.heal();
         });
       } else { dialogue(["The rock shelf is empty\nnow."]); }
     }}
  ],
  signs:{ '7:8':"CERULEAN CAVE\nVery powerful POKEMON\nlurk deep within." },
  warps:[ {x:7,y:9,to:'BRIDGE',tx:3,ty:4} ],
  exits:[],
  encounters:[
    {id:42, min:55,max:60,w:22}, // Golbat
    {id:64, min:55,max:60,w:16}, // Kadabra
    {id:82, min:56,max:61,w:14}, // Magneton
    {id:101,min:56,max:60,w:12}, // Electrode
    {id:112,min:58,max:63,w:12}, // Rhydon
    {id:85, min:57,max:61,w:10}, // Dodrio
    {id:105,min:57,max:61,w:8},  // Marowak
    {id:47, min:55,max:59,w:6},  // Parasect
    {id:132,min:55,max:60,w:6},  // Ditto
    {id:113,min:55,max:60,w:3}   // Chansey (rare)
  ]
};

export const VICTORY_ROAD=[
 "#############",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "#cc#######cc#",
 "#cc#ccccc#cc#",
 "#cc#ccccc#cc#",
 "#cc#######cc#",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "######D######"
];
MAPS.VICTORY_ROAD={
  name:'VICTORY_ROAD', grid:VICTORY_ROAD, interior:true,
  npcs:[
    {x:3,y:2,dir:'down',kind:'npc',name:'VR_ACE1',
     present:()=>!game.flags.vrAce1,
     talk:()=>dialogue(["COOLTRAINER: Only the\nstrong pass through\nVICTORY ROAD!"],
       ()=>startTrainerFight('VR_ACE1','COOLTRAINER',[makeMon(112,58),makeMon(95,58),makeMon(105,60)],'vrAce1'))},
    {x:9,y:2,dir:'down',kind:'npc',name:'VR_ACE2',
     present:()=>!game.flags.vrAce2,
     talk:()=>dialogue(["ACE TRAINER: A CHAMPION?\nProve it against my\nteam!"],
       ()=>startTrainerFight('VR_ACE2','ACE TRAINER',[makeMon(130,60),makeMon(59,60),makeMon(149,62)],'vrAce2'))},
    {x:6,y:5,dir:'down',kind:'npc',name:'VR_ITEM',
     talk:()=>{
       if(!game.flags.vrItem){
         dialogue(["A hidden cache!","You found 3 RARE CANDY!"],()=>{
           game.flags.vrItem=true;
           game.bag.rarecandy=(game.bag.rarecandy|0)+3; Audio.heal();
         });
       } else { dialogue(["The cache is empty now."]); }
     }}
  ],
  signs:{ '6:8':"VICTORY ROAD\nThe final trial before\nthe LEAGUE." },
  warps:[ {x:6,y:9,to:'VIRIDIAN',tx:7,ty:12} ],
  exits:[],
  encounters:[
    {id:42, min:58,max:63,w:20}, // Golbat
    {id:75, min:58,max:62,w:16}, // Graveler
    {id:67, min:58,max:62,w:14}, // Machoke
    {id:95, min:60,max:64,w:12}, // Onix
    {id:105,min:60,max:64,w:10}, // Marowak
    {id:111,min:59,max:63,w:10}, // Rhyhorn
    {id:28, min:58,max:62,w:10}, // Sandslash
    {id:132,min:58,max:63,w:8}   // Ditto
  ]
};

export const BATTLE_TOWER=[
 "###########",
 "#ccccccccc#",
 "#ccccccccc#",
 "#ccccccccc#",
 "#ccccccccc#",
 "#ccccccccc#",
 "#ccccccccc#",
 "#ccccccccc#",
 "#####D#####"
];
MAPS.BATTLE_TOWER={
  name:'BATTLE_TOWER', grid:BATTLE_TOWER, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'TOWER_CLERK',
     talk:()=>{
       choice("BATTLE TOWER",[
         {label:"TAKE CHALLENGE", fn:()=>startTower()},
         {label:"RECORDS",        fn:()=>dialogue(["Best streak: "+(game.flags.towerBest||0)+" wins."])},
         {label:"LEAVE",          fn:()=>dialogue(["CLERK: Come back strong!"])}
       ], ()=>dialogue(["CLERK: Come back strong!"]));
     }},
    {x:3,y:5,dir:'down',kind:'npc',name:'CHAMP_REMATCH',
     talk:()=>dialogue(["CHAMPION: Back for a\nrematch? My team is\nstronger now!"],
       ()=>startRematch())}
  ],
  signs:{ '5:7':"BATTLE TOWER\nFace endless trainers.\nNo healing between\nbouts!" },
  warps:[ {x:5,y:8,to:'VIRIDIAN',tx:7,ty:12} ],
  exits:[],
  encounters:null
};

export const JOHTO_TOWN=[
 "TTTTTTTTTTTTT",
 "T...........T",
 "T...........T",
 "T...........T",
 "T...........T",
 "T...........T",
 "T...........T",
 "T...........T",
 "T.....D.....T",
 "TTTTTTTTTTTTT"
];
MAPS.JOHTO_TOWN={
  name:'JOHTO_TOWN', grid:JOHTO_TOWN, interior:false,
  npcs:[
    {x:3,y:3,dir:'down',kind:'npc',name:'JT_NURSE',
     talk:()=>{ healParty(); Audio.heal();
       dialogue(["NURSE: Welcome to NEW BARK\nTOWN, gateway to JOHTO!","Your POKEMON are fully\nhealed."]); }},
    {x:9,y:3,dir:'down',kind:'npc',name:'JT_ELM',
     talk:()=>{
       if(game.flags.johtoStarter){ dialogue(["PROF. ELM: Treat that\nJOHTO POKEMON well!"]); return; }
       if(game.party.length>=6){ dialogue(["PROF. ELM: Make room in\nyour party first!"]); return; }
       choice("ELM: Pick a JOHTO starter",[
         {label:"CHIKORITA", fn:()=>{ game.party.push(makeMon(152,15)); game.flags.johtoStarter=true; Audio.heal(); dialogue(["You received CHIKORITA!"]); }},
         {label:"CYNDAQUIL", fn:()=>{ game.party.push(makeMon(155,15)); game.flags.johtoStarter=true; Audio.heal(); dialogue(["You received CYNDAQUIL!"]); }},
         {label:"TOTODILE",  fn:()=>{ game.party.push(makeMon(158,15)); game.flags.johtoStarter=true; Audio.heal(); dialogue(["You received TOTODILE!"]); }}
       ], ()=>dialogue(["PROF. ELM: Come back when\nyou've decided."]));
     }},
    {x:6,y:5,dir:'down',kind:'npc',name:'JT_LANCE',
     present:()=>!game.flags.johtoChampBeaten,
     talk:()=>dialogue(["LANCE: I am the JOHTO\nCHAMPION and master of\nDRAGONS.","Show me the power that\nconquered KANTO!"],()=>startJohtoChamp())}
  ],
  signs:{ '6:7':"NEW BARK TOWN\nThe town where winds of\na new beginning blow." },
  warps:[ {x:6,y:8,to:'JOHTO_ROUTE',tx:6,ty:2} ],
  exits:[],
  encounters:null
};

export const JOHTO_ROUTE=[
 "TTTTTTTTTTTTT",
 "T.....D.....T",
 "T..,,,,,,,..T",
 "T..,,,,,,,..T",
 "T..,,,,,,,..T",
 "T...........T",
 "T..,,,,,,,..T",
 "T..,,,,,,,..T",
 "T..,,,,,,,..T",
 "T...........T",
 "T.....D.....T",
 "TTTTTTTTTTTTT"
];
MAPS.JOHTO_ROUTE={
  name:'JOHTO_ROUTE', grid:JOHTO_ROUTE, interior:false,
  npcs:[
    {x:3,y:5,dir:'down',kind:'npc',name:'JR_T1',
     present:()=>!game.flags.jrT1,
     talk:()=>dialogue(["YOUNGSTER: JOHTO POKEMON\nare tougher than they\nlook!"],
       ()=>startTrainerFight('JR_T1','YOUNGSTER',[makeMon(162,46),makeMon(164,47),makeMon(184,48)],'jrT1'))},
    {x:9,y:5,dir:'down',kind:'npc',name:'JR_T2',
     present:()=>!game.flags.jrT2,
     talk:()=>dialogue(["CAMPER: Let's see how the\nKANTO CHAMP handles\nJOHTO!"],
       ()=>startTrainerFight('JR_T2','CAMPER',[makeMon(181,48),makeMon(195,49),makeMon(229,50)],'jrT2'))}
  ],
  signs:{ '6:5':"ROUTE 29\nNorth: NEW BARK TOWN\nSouth: BELL TOWER" },
  warps:[ {x:6,y:1,to:'JOHTO_TOWN',tx:6,ty:6}, {x:6,y:10,to:'JOHTO_TOWER',tx:6,ty:7} ],
  exits:[],
  encounters:[
    {id:161,min:42,max:46,w:20},{id:163,min:42,max:46,w:16},
    {id:165,min:42,max:46,w:12},{id:167,min:42,max:46,w:12},
    {id:179,min:43,max:47,w:12},{id:187,min:43,max:47,w:10},
    {id:191,min:42,max:46,w:8}, {id:194,min:43,max:47,w:10},
    {id:234,min:46,max:50,w:6}, {id:190,min:44,max:48,w:6}
  ]
};

export const JOHTO_TOWER=[
 "#############",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "#ccccccccccc#",
 "######D######",
 "#############"
];
MAPS.JOHTO_TOWER={
  name:'JOHTO_TOWER', grid:JOHTO_TOWER, interior:true,
  npcs:[
    {x:3,y:3,dir:'down',kind:'rocket',npcMon:250,name:'HO_OH',
     present:()=>!game.flags.hoohSeen,
     talk:()=>dialogue(["Atop BELL TOWER a\nrainbow blaze descends...","HO-OH screams and\nattacks!"],()=>{ game.flags.hoohSeen=true; startBattle(makeMon(250,68),false); })},
    {x:9,y:3,dir:'down',kind:'rocket',npcMon:249,name:'LUGIA',
     present:()=>!game.flags.lugiaSeen,
     talk:()=>dialogue(["A storm howls from the\ntower's depths...","LUGIA rises and\nattacks!"],()=>{ game.flags.lugiaSeen=true; startBattle(makeMon(249,68),false); })},
    {x:3,y:6,dir:'down',kind:'rocket',npcMon:245,name:'SUICUNE',
     present:()=>!game.flags.suicuneSeen,
     talk:()=>dialogue(["A pure north wind blows...","SUICUNE bounds out and\nattacks!"],()=>{ game.flags.suicuneSeen=true; startBattle(makeMon(245,65),false); })},
    {x:9,y:6,dir:'down',kind:'rocket',npcMon:251,name:'CELEBI',
     present:()=>!game.flags.celebiSeen,
     talk:()=>dialogue(["A voice from across time\ngiggles in the shrine...","CELEBI appears!"],()=>{ game.flags.celebiSeen=true; startBattle(makeMon(251,60),false); })}
  ],
  signs:{ '6:7':"BELL TOWER\nLegendary POKEMON of\nJOHTO are said to\nnest here." },
  warps:[ {x:6,y:8,to:'JOHTO_ROUTE',tx:6,ty:9} ],
  exits:[],
  encounters:[
    {id:163,min:45,max:50,w:20},{id:200,min:46,max:50,w:14},
    {id:177,min:46,max:50,w:14},{id:215,min:48,max:52,w:10},
    {id:228,min:47,max:51,w:12},{id:235,min:46,max:50,w:6}
  ]
};

export const SHIP=[
 "###############",
 "#######_#######",
 "#######_#######",
 "###_________###",
 "#_____________#",
 "#_____________#",
 "#_____________#",
 "#_____________#",
 "#_____________#",
 "#_____________#",
 "#____________X#",
 "###_________#_#",
 "#######D#######"
];

export function shipTrainer(name,x,y,label,team,flag){
  return {x:x,y:y,dir:'down',kind:'npc',name:name,
    present:()=>!game.flags[flag],
    talk:()=>dialogue([label+": You there!\nLet's have a battle!"],
      ()=>startTrainerFight(name,label,team,flag))};
}
MAPS.SHIP={
  name:'SHIP', grid:SHIP, interior:true,
  npcs:[
    {x:7,y:1,dir:'down',kind:'clerk',name:'SHIP_CAPTAIN',
     talk:()=>{
       if(!game.flags.hmCut){
         dialogue([
           "CAPTAIN: Oogh... this swell\nis rough... I feel just\nawful...",
           "CAPTAIN: ...Ahh. Your\nPOKEMON's company eased\nmy seasickness. Thank you!",
           "CAPTAIN: Take this. It's\nHM01 — it teaches CUT!",
           "You received HM01 CUT!"],
           ()=>{ game.flags.hmCut=true; teachCut(); });
       } else if(!game.party.some(m=>m&&m.cut)){
         dialogue(["CAPTAIN: Let's get CUT\ntaught to a POKEMON."],()=>teachCut());
       } else {
         dialogue(["CAPTAIN: Face a small tree\nand press A to use CUT\nout in the field!"]);
       }
     }},
    {x:7,y:2,dir:'down',kind:'rocket',name:'SHIP_RIVAL',
     present:()=>!game.flags.shipRivalBeaten,
     talk:()=>dialogue([
       "RIVAL: Ha! You again? The\nCAPTAIN's cabin is behind\nme — and you're NOT\ngetting past.",
       "RIVAL: My BLASTOISE has\nbeen waiting for this.\nLet's GO!"],
       ()=>startShipRivalBattle())},
    {x:13,y:11,dir:'down',kind:'npc',name:'SHIP_STASH',
     talk:()=>{
       if(!game.flags.shipStash){
         dialogue(["A hidden crate behind the\ncut tree!","Inside: P5000! Lucky\nfind!"],
           ()=>{ game.flags.shipStash=true; game.flags.money=(game.flags.money|0)+5000; Audio.heal(); });
       } else {
         dialogue(["The crate is empty now."]);
       }
     }},
    shipTrainer('SHIP_T1',2,4,'SAILOR',[makeMon(116,30),makeMon(118,31)],'ship_t1'),
    shipTrainer('SHIP_T2',12,4,'GENTLEMAN',[makeMon(58,32),makeMon(59,33)],'ship_t2'),
    shipTrainer('SHIP_T3',2,6,'FISHERMAN',[makeMon(118,33),makeMon(119,34)],'ship_t3'),
    shipTrainer('SHIP_T4',12,6,'LASS',[makeMon(35,33),makeMon(36,35)],'ship_t4'),
    shipTrainer('SHIP_T5',2,8,'SAILOR',[makeMon(86,34),makeMon(87,36)],'ship_t5'),
    shipTrainer('SHIP_T6',12,8,'JR TRAINER',[makeMon(17,35),makeMon(18,37)],'ship_t6'),
    shipTrainer('SHIP_T7',5,9,'GENTLEMAN',[makeMon(108,36),makeMon(22,37)],'ship_t7'),
    shipTrainer('SHIP_T8',9,9,'SAILOR',[makeMon(90,37),makeMon(91,39)],'ship_t8'),
    shipTrainer('SHIP_T9',4,10,'FISHERMAN',[makeMon(72,37),makeMon(73,39)],'ship_t9'),
    shipTrainer('SHIP_T10',10,10,'SUPER NERD',[makeMon(81,38),makeMon(82,40)],'ship_t10')
  ],
  signs:{ '7:11':"S.S. ANNE\nTrainers everywhere. A\nRIVAL guards the\nCAPTAIN's cabin." },
  warps:[],
  exits:[ {x:7,y:12,to:'CERULEAN',tx:7,ty:1} ],
  encounters:null
};

export const ROUTE_VERM=[
 "TTTTTTTTTTTTTTT",
 "T....,,,......T",
 "T....,,,......T",
 "T.............T",
 "P.............P",
 "T......,,,....T",
 "T......,,,....T",
 "T.............T",
 "TTTTTTTTTTTTTTT"
];
MAPS.ROUTE_VERM={
  name:'ROUTE_VERM', grid:ROUTE_VERM, interior:false,
  npcs:[],
  signs:{ '7:3':"ROUTE 5\nWest: CERULEAN.\nEast: VERMILION CITY." },
  warps:[],
  exits:[
    {x:0,y:4,to:'CERULEAN',tx:12,ty:4},
    {x:14,y:4,to:'VERMILION',tx:1,ty:7}
  ],
  encounters:[
    {id:16,min:30,max:35,w:28}, // Pidgey
    {id:19,min:30,max:35,w:24}, // Rattata
    {id:21,min:31,max:35,w:18}, // Spearow
    {id:56,min:31,max:36,w:16}, // Mankey
    {id:69,min:31,max:36,w:14}  // Bellsprout
  ]
};

export const VERMILION=[
 "TTTTTTTTTTTTTTT",
 "T..CCC...GGG..T",
 "T..CCC...GGG..T",
 "T..CDC...GDG..T",
 "T.............T",
 "T...MMM.......T",
 "T...MMM.......T",
 "P...MDM.......T",
 "T.............T",
 "T.....S.......T",
 "T.............T",
 "TTTTTTTTTTTTTTT"
];
MAPS.VERMILION={
  name:'VERMILION', grid:VERMILION, interior:false,
  npcs:[
    {x:8,y:8,dir:'down',kind:'npc',name:'VERM_TOWNIE',
     talk:()=>dialogue(["TOWNIE: VERMILION CITY —\nthe port of the sea\nbreeze.",
       "TOWNIE: LT. SURGE, the\nLIGHTNING AMERICAN, runs\nthe GYM. His RAICHU is\nferocious!"])}
  ],
  signs:{ '6:9':"VERMILION CITY\nThe Port of the\nSea Breeze.\nLEADER: LT. SURGE" },
  warps:[
    {x:4,y:3,to:'VERMILION_CENTER',tx:4,ty:4},
    {x:10,y:3,to:'VERMILION_GYM',tx:5,ty:6},
    {x:5,y:7,to:'VERMILION_MART',tx:4,ty:4}
  ],
  exits:[ {x:0,y:7,to:'ROUTE_VERM',tx:13,ty:4} ],
  encounters:null
};

export const VERMILION_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.VERMILION_CENTER={
  name:'VERMILION_CENTER', grid:VERMILION_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the\nPOKEMON CENTER!",
                 "NURSE: We'll restore your\nPOKEMON. One moment..."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! We hope\nto see you again!"]);
       });
     }}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'VERMILION',tx:4,ty:4} ], exits:[], encounters:null
};

export const VERMILION_MART=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.VERMILION_MART={
  name:'VERMILION_MART', grid:VERMILION_MART, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'clerk',name:'VERM_CLERK',
     talk:()=>dialogue([
       "CLERK: Welcome to the\nVERMILION POKE MART!",
       "CLERK: GREAT BALLS and\nSUPER POTIONS, P500 each."],()=>openCeruleanShop())}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'VERMILION',tx:5,ty:8} ], exits:[], encounters:null
};

export const VERMILION_GYM=[
 "###########",
 "#_________#",
 "#_##___##_#",
 "#_________#",
 "#_##___##_#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.VERMILION_GYM={
  name:'VERMILION_GYM', grid:VERMILION_GYM, interior:true,
  npcs:[
    {x:5,y:1,dir:'down',kind:'rocket',name:'SURGE',
     present:()=>!game.flags.surgeBeaten,
     talk:()=>dialogue([
       "LT.SURGE: Ten-hut! I'm\nLT. SURGE, the LIGHTNING\nAMERICAN!",
       "LT.SURGE: My ELECTRIC\nPOKEMON will fry you.\nRAICHU finishes the job!"],
       ()=>startSurgeBattle())},
    {x:3,y:6,dir:'down',kind:'npc',name:'VERM_GUIDE',
     talk:()=>dialogue([game.flags.surgeBeaten
        ? "GUIDE: The THUNDER BADGE\nlooks sharp on you!"
        : "GUIDE: SURGE sends PIKACHU,\nELECTRODE, MAGNETON,\nELECTABUZZ, then his ace\nRAICHU. Bring GROUND types!"])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'VERMILION',tx:10,ty:4} ], exits:[], encounters:null
};

export const ROUTE_CELADON=[
 "TTTTTTTTTTTTTTT",
 "T...,,,,......T",
 "T...,,,,......T",
 "T.............T",
 "P.............P",
 "T......,,,,...T",
 "T......,,,,...T",
 "T.............T",
 "TTTTTTTTTTTTTTT"
];
MAPS.ROUTE_CELADON={
  name:'ROUTE_CELADON', grid:ROUTE_CELADON, interior:false,
  npcs:[],
  signs:{ '7:3':"ROUTE 7\nWest: CELADON CITY.\nEast: CERULEAN.\nStrong wild POKEMON!" },
  warps:[],
  exits:[
    {x:0,y:4,to:'CELADON',tx:13,ty:7},
    {x:14,y:4,to:'CERULEAN',tx:1,ty:7}
  ],
  encounters:[
    {id:147,min:38,max:43,w:40}, // Dratini
    {id:94,min:39,max:44,w:35},  // Gengar
    {id:58,min:38,max:42,w:25}   // Growlithe
  ]
};

export const CELADON=[
 "TTTTTTTTTTTTTTT",
 "T..CCC...GGG..T",
 "T..CCC...GGG..T",
 "T..CDC...GDG..T",
 "T.............T",
 "T...HHH.......T",
 "T...HHH.......T",
 "P...HDH.......P",
 "T.............T",
 "T.....S.......T",
 "T.............T",
 "TTTTTTTPTTTTTTT"
];
MAPS.CELADON={
  name:'CELADON', grid:CELADON, interior:false,
  npcs:[
    {x:8,y:8,dir:'down',kind:'npc',name:'CEL_TOWNIE',
     talk:()=>dialogue(["TOWNIE: CELADON CITY — the\nbig-city of dreams!",
       "TOWNIE: ...but TEAM ROCKET\nhas a HIDEOUT in town.\nThe GYM stays locked\nuntil they're gone."])},
    {x:10,y:4,dir:'down',kind:'npc',name:'CEL_GYM_GUARD',
     present:()=>!game.flags.giovanniBeaten,
     talk:()=>dialogue(["GUARD: The CELADON GYM is\nLOCKED. Clear TEAM\nROCKET's HIDEOUT first."])},
    {x:7,y:10,dir:'down',kind:'rocket',name:'GHOST_MAROWAK',
     present:()=>!game.flags.marowakSeen,
     talk:()=>dialogue([
       "A ghostly MAROWAK blocks\nthe path, eyes blazing\nwith fury!",
       "It will NOT let you pass.\nThere's no choice but to\nfight it..."],
       ()=>startMarowakBattle())}
  ],
  signs:{ '6:9':"CELADON CITY\nThe Big-City of\nDreams. LEADER: ERIKA" },
  warps:[
    {x:4,y:3,to:'CELADON_CENTER',tx:4,ty:4},
    {x:5,y:7,to:'CELADON_ROCKET',tx:7,ty:9},
    {x:10,y:3,to:'CELADON_GYM',tx:5,ty:6}
  ],
  exits:[ {x:14,y:7,to:'ROUTE_CELADON',tx:1,ty:4},
          {x:7,y:11,to:'ROUTE_FUCHSIA',tx:7,ty:1},
          {x:0,y:7,to:'ROUTE_SAFFRON',tx:13,ty:3} ],
  encounters:null
};

export const CELADON_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.CELADON_CENTER={
  name:'CELADON_CENTER', grid:CELADON_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the\nPOKEMON CENTER!",
                 "NURSE: We'll restore your\nPOKEMON. One moment..."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! We hope\nto see you again!"]);
       });
     }}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'CELADON',tx:5,ty:8} ], exits:[], encounters:null
};

export const CELADON_ROCKET=[
 "###############",
 "#######_#######",
 "#######_#######",
 "###_________###",
 "#_____________#",
 "#_____________#",
 "#_____________#",
 "#_____________#",
 "#_____________#",
 "###_________###",
 "#######D#######"
];
MAPS.CELADON_ROCKET={
  name:'CELADON_ROCKET', grid:CELADON_ROCKET, interior:true,
  npcs:[
    {x:7,y:1,dir:'down',kind:'rocket',name:'GIOVANNI',
     present:()=>!game.flags.giovanniBeaten,
     talk:()=>dialogue([
       "GIOVANNI: So. A child has\nbreached TEAM ROCKET's\nHIDEOUT.",
       "GIOVANNI: I am GIOVANNI,\ntheir leader. You will\nregret this. Prepare\nyourself!"],
       ()=>startGiovanniBattle())},
    {x:7,y:2,dir:'down',kind:'rocket',name:'CEL_GRUNT1',
     present:()=>!game.flags.celadon_grunt,
     talk:()=>dialogue(["ROCKET GRUNT: The BOSS is\nbehind me — and you're\nNOT getting through!"],
       ()=>startTrainerFight('CEL_GRUNT1','ROCKET GRUNT',[makeMon(42,40),makeMon(110,42)],'celadon_grunt'))},
    {x:4,y:6,dir:'down',kind:'rocket',name:'CEL_GRUNT2',
     present:()=>!game.flags.celadon_grunt2,
     talk:()=>dialogue(["ROCKET GRUNT: Intruder!\nTEAM ROCKET will stop\nyou here!"],
       ()=>startTrainerFight('CEL_GRUNT2','ROCKET GRUNT',[makeMon(20,40),makeMon(24,42)],'celadon_grunt2'))}
  ],
  signs:{ '7:9':"TEAM ROCKET HIDEOUT\nThe BOSS GIOVANNI waits\nin the back." },
  warps:[],
  exits:[ {x:7,y:10,to:'CELADON',tx:5,ty:8} ],
  encounters:null
};

export const CELADON_GYM=[
 "###########",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.CELADON_GYM={
  name:'CELADON_GYM', grid:CELADON_GYM, interior:true,
  npcs:[
    {x:5,y:1,dir:'down',kind:'npc',name:'ERIKA',
     present:()=>!game.flags.erikaBeaten,
     talk:()=>dialogue([
       "ERIKA: Hello... I am ERIKA\nof CELADON GYM. I teach\nthe art of GRASS POKEMON.",
       "ERIKA: My VENUSAUR hides a\nsecret power. You will\nsee. Let us battle!"],
       ()=>startErikaBattle())},
    {x:3,y:3,dir:'down',kind:'npc',name:'GYM_G1',
     present:()=>!game.flags.gym_g1,
     talk:()=>dialogue(["LASS: I love GRASS POKEMON\njust like ERIKA! Battle!"],
       ()=>startTrainerFight('GYM_G1','LASS',[makeMon(44,42),makeMon(70,44)],'gym_g1'))},
    {x:7,y:3,dir:'down',kind:'npc',name:'GYM_G2',
     present:()=>!game.flags.gym_g2,
     talk:()=>dialogue(["BEAUTY: My GRASS POKEMON\nwill root you in place!"],
       ()=>startTrainerFight('GYM_G2','BEAUTY',[makeMon(114,44),makeMon(71,46)],'gym_g2'))},
    {x:3,y:6,dir:'down',kind:'npc',name:'GYM_GUIDE_C',
     talk:()=>dialogue([game.flags.erikaBeaten
        ? "GUIDE: The RAINBOW BADGE!\nAnd MEGA EVOLUTION too?\nIncredible!"
        : "GUIDE: ERIKA's GRASS team:\nVENUSAUR, MEGANIUM,\nVILEPLUME, VICTREEBEL.\nUse FIRE or FLYING!"])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'CELADON',tx:10,ty:4} ], exits:[], encounters:null
};

export const ROUTE_FUCHSIA=[
 "TTTTTTT.TTTTTTT",
 "T....,,.,,....T",
 "T....,,.,,....T",
 "T.....,.,.....T",
 "T....,,.,,....T",
 "T....,,.,,....T",
 "T.....,.,.....T",
 "T....,,.,,....T",
 "T....,,.,,....T",
 "T.....,.,.....T",
 "T.............T",
 "TTTTTTT.TTTTTTT"
];
MAPS.ROUTE_FUCHSIA={
  name:'ROUTE_FUCHSIA', grid:ROUTE_FUCHSIA, interior:false,
  npcs:[],
  signs:{ '7:10':"ROUTE 13\nNorth: CELADON.\nSouth: FUCHSIA CITY." },
  warps:[],
  exits:[
    {x:7,y:0,to:'CELADON',tx:7,ty:10},
    {x:7,y:11,to:'FUCHSIA',tx:7,ty:1}
  ],
  encounters:[
    {id:109,min:42,max:47,w:30},
    {id:88,min:42,max:47,w:24},
    {id:41,min:42,max:46,w:24},
    {id:48,min:43,max:48,w:22}
  ]
};

export const FUCHSIA=[
 "TTTTTTT.TTTTTTT",
 "T..CCC...GGG..T",
 "T..CCC...GGG..T",
 "T..CDC...GDG..T",
 "T.............T",
 "T.............T",
 "T.............T",
 "T.....S.......T",
 "T~~~..........T",
 "T~~~..........T",
 "T~~~..........T",
 "TT~TTTTTTTTTTTT"
];
MAPS.FUCHSIA={
  name:'FUCHSIA', grid:FUCHSIA, interior:false,
  npcs:[
    {x:8,y:8,dir:'down',kind:'npc',name:'FUC_TOWNIE',
     talk:()=>dialogue(["TOWNIE: FUCHSIA CITY — home\nof the SAFARI ZONE.",
       "TOWNIE: GYM LEADER KOGA is\na POISON NINJA. His MEGA\nGENGAR is terrifying!"])},
    {x:4,y:9,dir:'left',kind:'npc',name:'SURF_MASTER',
     talk:()=>{
       if(!game.flags.hmSurf){ dialogue(["SURF MASTER: The sea calls,\nbut you need HM03 SURF.\nSABRINA in SAFFRON has it."]); return; }
       if(game.party.some(m=>m&&m.surf)){ dialogue(["SURF MASTER: Ride the waves\nsouth-west — CINNABAR\nISLAND awaits!"]); return; }
       dialogue(["SURF MASTER: You hold HM03!\nLet me teach a POKEMON\nto SURF the seas."],()=>teachSurf());
     }}
  ],
  signs:{ '6:7':"FUCHSIA CITY\nThe sea to the SW\nleads to CINNABAR.\nLEADER: KOGA" },
  warps:[
    {x:4,y:3,to:'FUCHSIA_CENTER',tx:4,ty:4},
    {x:10,y:3,to:'FUCHSIA_GYM',tx:5,ty:6}
  ],
  exits:[ {x:7,y:0,to:'ROUTE_FUCHSIA',tx:7,ty:10},
          {x:2,y:11,to:'ROUTE_SURF',tx:7,ty:1} ],
  encounters:null
};

export const FUCHSIA_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.FUCHSIA_CENTER={
  name:'FUCHSIA_CENTER', grid:FUCHSIA_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the\nPOKEMON CENTER!",
                 "NURSE: We'll restore your\nPOKEMON. One moment..."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! We hope\nto see you again!"]);
       });
     }}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'FUCHSIA',tx:4,ty:4} ], exits:[], encounters:null
};

export const FUCHSIA_GYM=[
 "###########",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.FUCHSIA_GYM={
  name:'FUCHSIA_GYM', grid:FUCHSIA_GYM, interior:true,
  npcs:[
    {x:5,y:1,dir:'down',kind:'rocket',name:'KOGA',
     present:()=>!game.flags.kogaBeaten,
     talk:()=>dialogue([
       "KOGA: I am KOGA, master of\nPOISON and the NINJA arts!",
       "KOGA: Six POKEMON — and my\nGENGAR hides a MEGA\nsecret. Prepare to be\npoisoned!"],
       ()=>startKogaBattle())},
    {x:3,y:3,dir:'down',kind:'npc',name:'FUC_T1',
     present:()=>!game.flags.fuc_t1,
     talk:()=>dialogue(["JUGGLER: My POISON POKEMON\nnever miss! Battle!"],
       ()=>startTrainerFight('FUC_T1','JUGGLER',[makeMon(109,44),makeMon(110,46)],'fuc_t1'))},
    {x:7,y:3,dir:'down',kind:'npc',name:'FUC_T2',
     present:()=>!game.flags.fuc_t2,
     talk:()=>dialogue(["TAMER: Sleep, then poison.\nYou won't last long!"],
       ()=>startTrainerFight('FUC_T2','TAMER',[makeMon(48,45),makeMon(49,47)],'fuc_t2'))},
    {x:3,y:6,dir:'down',kind:'npc',name:'FUC_GUIDE',
     talk:()=>dialogue([game.flags.kogaBeaten
        ? "GUIDE: The SOUL BADGE! You\nsurvived MEGA GENGAR!"
        : "GUIDE: KOGA: WEEZING, ARBOK,\nMUK, NIDOKING, VENOMOTH,\nthen MEGA GENGAR. Use\nPSYCHIC or GROUND!"])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'FUCHSIA',tx:10,ty:4} ], exits:[], encounters:null
};

export const ROUTE_SAFFRON=[
 "TTTTTTTTTTTTTTT",
 "T.............T",
 "T...,,,.,,,...T",
 "P.............P",
 "T...,,,.,,,...T",
 "T.............T",
 "TTTTTTTTTTTTTTT"
];
MAPS.ROUTE_SAFFRON={
  name:'ROUTE_SAFFRON', grid:ROUTE_SAFFRON, interior:false,
  npcs:[],
  signs:{ '7:5':"ROUTE 7\nWest: SAFFRON CITY.\nEast: CELADON CITY." },
  warps:[],
  exits:[
    {x:14,y:3,to:'CELADON',tx:1,ty:7},
    {x:0,y:3,to:'SAFFRON',tx:13,ty:10}
  ],
  encounters:[
    {id:63,min:46,max:51,w:26}, // Abra
    {id:96,min:46,max:51,w:26}, // Drowzee
    {id:64,min:48,max:52,w:20}, // Kadabra
    {id:52,min:46,max:50,w:24}  // Meowth
  ]
};

export const SAFFRON=[
 "TTTTTTTTTTTTTTT",
 "T.CC..GG...HH.T",
 "T.CC..GG...HH.T",
 "T.CD..GD...HD.T",
 "T.............T",
 "T..LLLLLLLLL..T",
 "T..LLLLLLLLL..T",
 "T..LLLLDLLLL..T",
 "T.............T",
 "T......S......T",
 "T.............P",
 "TTTTTTTTTTTTTTT"
];
MAPS.SAFFRON={
  name:'SAFFRON', grid:SAFFRON, interior:false,
  npcs:[
    {x:3,y:9,dir:'down',kind:'npc',name:'SAF_TOWNIE',
     talk:()=>dialogue(["TOWNIE: SAFFRON CITY! The\nFIGHTING DOJO gives a gift\nPOKEMON.",
       "TOWNIE: SABRINA's PSYCHIC\nGYM is brutal. And SILPH\nCO. is under ROCKET\ncontrol!"])},
    {x:7,y:8,dir:'down',kind:'rocket',name:'SILPH_GUARD',
     present:()=>!game.flags.sabrinaBeaten,
     talk:()=>dialogue(["ROCKET: SILPH CO. is SEALED!\nDefeat SABRINA at the GYM\nbefore you interfere."])}
  ],
  signs:{ '7:9':"SAFFRON CITY\nDOJO - GYM - SILPH CO.\nLEADER: SABRINA" },
  warps:[
    {x:3,y:3,to:'SAFFRON_CENTER',tx:4,ty:4},
    {x:7,y:3,to:'SABRINA_GYM',tx:5,ty:6},
    {x:12,y:3,to:'FIGHT_DOJO',tx:4,ty:4},
    {x:7,y:7,to:'SILPH_CO',tx:5,ty:6}
  ],
  exits:[ {x:14,y:10,to:'ROUTE_SAFFRON',tx:1,ty:3} ],
  encounters:null
};

export const SAFFRON_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.SAFFRON_CENTER={
  name:'SAFFRON_CENTER', grid:SAFFRON_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the\nPOKEMON CENTER!",
                 "NURSE: We'll restore your\nPOKEMON. One moment..."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! We hope\nto see you again!"]);
       });
     }}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'SAFFRON',tx:3,ty:4} ], exits:[], encounters:null
};

export const SABRINA_GYM=[
 "###########",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.SABRINA_GYM={
  name:'SABRINA_GYM', grid:SABRINA_GYM, interior:true,
  npcs:[
    {x:5,y:1,dir:'down',kind:'npc',name:'SABRINA',
     present:()=>!game.flags.sabrinaBeaten,
     talk:()=>dialogue([
       "SABRINA: I am SABRINA. My\nPSYCHIC power is no mere\nillusion.",
       "SABRINA: My ALAKAZAM hides\na MEGA secret. I have\nseen your defeat. Begin!"],
       ()=>startSabrinaBattle())},
    {x:3,y:3,dir:'down',kind:'npc',name:'SAB_T1',
     present:()=>!game.flags.sab_t1,
     talk:()=>dialogue(["CHANNELER: My mind will\nshatter yours!"],
       ()=>startTrainerFight('SAB_T1','CHANNELER',[makeMon(64,49),makeMon(97,50)],'sab_t1'))},
    {x:3,y:6,dir:'down',kind:'npc',name:'SAB_GUIDE',
     talk:()=>dialogue([game.flags.sabrinaBeaten
        ? "GUIDE: The MARSH BADGE! You\nbeat MEGA ALAKAZAM!"
        : "GUIDE: SABRINA: HYPNO,\nSLOWBRO, then MEGA\nALAKAZAM. Bring BUG or\nDARK... or raw power!"])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'SAFFRON',tx:7,ty:4} ], exits:[], encounters:null
};

export const FIGHT_DOJO=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.FIGHT_DOJO={
  name:'FIGHT_DOJO', grid:FIGHT_DOJO, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'npc',name:'DOJO_MASTER',
     talk:()=>{
       if(game.flags.gotMachamp){ dialogue(["DOJO MASTER: Train body and\nspirit, always, trainer!"]); return; }
       dialogue([
         "DOJO MASTER: You carry the\nfighting spirit, I see it.",
         "DOJO MASTER: Take this — a\nmighty MACHAMP. Wield its\npower with honor!"],()=>{
         game.flags.gotMachamp=true; Audio.heal();
         const msg=giveMon(68,50);
         dialogue(["You received MACHAMP!",msg]);
       });
     }}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'SAFFRON',tx:12,ty:4} ], exits:[], encounters:null
};

export const SILPH_CO=[
 "###########",
 "#_________#",
 "#_________#",
 "#_________#",
 "#_________#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.SILPH_CO={
  name:'SILPH_CO', grid:SILPH_CO, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'rocket',name:'SILPH_GIOVANNI',
     present:()=>!game.flags.silphBeaten,
     talk:()=>dialogue([
       "GIOVANNI: So you found me.\nTEAM ROCKET has seized\nSILPH CO.",
       "GIOVANNI: My KANGASKHAN\nwill MEGA EVOLVE and end\nthis. Attack!"],
       ()=>startSilphBattle())},
    {x:8,y:5,dir:'down',kind:'npc',name:'SILPH_PRES',
     present:()=>game.flags.silphBeaten,
     talk:()=>dialogue(["PRESIDENT: SILPH is free,\nthanks to you! That\nMASTER BALL never misses."])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'SAFFRON',tx:7,ty:8} ], exits:[], encounters:null
};

export const ROUTE_SURF=[
 "TTTTTTT~TTTTTTT",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~...~~~~~T",
 "T~~~~~.D.~~~~~T",
 "T~~~~~...~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "TTTTTTT~TTTTTTT"
];

export function swimmer(name,x,y,label,team,flag){
  return {x:x,y:y,dir:'down',kind:'npc',name:name,
    present:()=>!game.flags[flag],
    talk:()=>dialogue([label+": Hey, swimmer!\nLet's settle this at sea!"],
      ()=>startTrainerFight(name,label,team,flag))};
}
MAPS.ROUTE_SURF={
  name:'ROUTE_SURF', grid:ROUTE_SURF, interior:false,
  npcs:[
    swimmer('SWM_1',4,4,'SWIMMER',[makeMon(72,55),makeMon(73,58)],'swm_1'),
    swimmer('SWM_2',10,7,'SWIMMER',[makeMon(116,56),makeMon(117,59)],'swm_2'),
    swimmer('SWM_3',5,10,'SAILOR',[makeMon(98,56),makeMon(99,59),makeMon(120,58)],'swm_3')
  ],
  signs:{ '7:2':"OPEN SEA\nNorth: FUCHSIA.\nSouth: CINNABAR ISLE.",
          '8:8':"SEAFOAM CAVE\nA freezing cry echoes\nfrom deep inside..." },
  warps:[ {x:7,y:7,to:'SEAFOAM',tx:5,ty:6} ],
  exits:[
    {x:7,y:0,to:'FUCHSIA',tx:2,ty:10},
    {x:7,y:13,to:'CINNABAR',tx:7,ty:1}
  ],
  encounters:[
    {id:72,min:54,max:59,w:30}, // Tentacool
    {id:73,min:56,max:60,w:16}, // Tentacruel
    {id:120,min:54,max:58,w:22},// Staryu
    {id:116,min:54,max:58,w:20},// Horsea
    {id:118,min:54,max:58,w:22},// Goldeen
    {id:90,min:54,max:58,w:18}  // Shellder
  ]
};

export const SEAFOAM=[
 "###########",
 "#ccccccccc#",
 "#ccccccccc#",
 "#cccc.cccc#",
 "#ccccccccc#",
 "#ccccccccc#",
 "#ccccccccc#",
 "#ccccDcccc#",
 "###########"
];
MAPS.SEAFOAM={
  name:'SEAFOAM', grid:SEAFOAM, interior:true,
  npcs:[
    {x:5,y:3,dir:'down',kind:'rocket',npcMon:144,name:'ARTICUNO',
     present:()=>!game.flags.articunoSeen,
     talk:()=>{ dialogue([
       "Deep in SEAFOAM CAVE the\nair turns bitter cold...",
       "ARTICUNO, the freezing\nbird, shrieks and dives\nat you!"],()=>{
         game.flags.articunoSeen=true;
         startBattle(makeMon(144,60),false);
       }); }},
    {x:3,y:5,dir:'down',kind:'rocket',npcMon:146,name:'MOLTRES',
     present:()=>game.flags.leagueBeaten && game.flags.articunoSeen && !game.flags.moltresSeen,
     talk:()=>{ dialogue([
       "The cave roars with sudden\nflame as the ice melts...",
       "MOLTRES, the flame bird,\nblazes out of the depths\nand attacks!"],()=>{
         game.flags.moltresSeen=true;
         startBattle(makeMon(146,70),false);
       }); }},
    {x:7,y:5,dir:'down',kind:'rocket',npcMon:150,name:'MEWTWO_BOSS',
     present:()=>!game.flags.mewtwoBeaten,
     talk:()=>{ dialogue([
       "A cold psychic presence\nfreezes you in place.",
       "MEWTWO: So. The CHAMPION\ncomes. I have evolved\nbeyond your kind.",
       "MEWTWO's first form —\nMEGA MEWTWO X — surges\nwith raw power!"],()=>startMewtwoBoss())}},
    {x:5,y:5,dir:'down',kind:'rocket',npcMon:150,name:'MEWTWO_WILD',
     present:()=>game.flags.mewtwoBeaten && !game.flags.mewtwoSeen,
     talk:()=>{ dialogue([
       "The weary MEWTWO watches\nyou. This is your one\nchance to catch it..."],()=>{
         game.flags.mewtwoSeen=true;
         startBattle(makeMon(150,70),false);
       }); }}
  ],
  signs:{ '5:6':"SEAFOAM ISLANDS\nSomething legendary\nnests deeper in..." },
  warps:[ {x:5,y:7,to:'ROUTE_SURF',tx:8,ty:7} ],
  exits:[],
  encounters:[
    {id:86,min:54,max:58,w:28}, // Seel
    {id:87,min:56,max:60,w:16}, // Dewgong
    {id:90,min:54,max:58,w:22}, // Shellder
    {id:91,min:56,max:60,w:14}, // Cloyster
    {id:42,min:54,max:58,w:20}  // Golbat
  ]
};

export const VIRIDIAN_GYM=[
 "###########",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.VIRIDIAN_GYM={
  name:'VIRIDIAN_GYM', grid:VIRIDIAN_GYM, interior:true,
  npcs:[
    {x:5,y:1,dir:'down',kind:'rocket',name:'GIOVANNI',
     present:()=>!game.flags.viridianBeaten,
     talk:()=>dialogue([
       "GIOVANNI: So you came. I am\nGIOVANNI — GYM LEADER,\nand boss of TEAM ROCKET.",
       "GIOVANNI: Six POKEMON, none\nweaker than level 60. My\nMEGA KANGASKHAN ends all\nchallengers. Come!"],
       ()=>startViridianBattle())},
    {x:3,y:3,dir:'down',kind:'rocket',name:'VIR_G1',
     present:()=>!game.flags.vir_g1,
     talk:()=>dialogue(["ROCKET: For TEAM ROCKET!"],
       ()=>startTrainerFight('VIR_G1','ROCKET',[makeMon(24,60),makeMon(89,62)],'vir_g1'))},
    {x:7,y:3,dir:'down',kind:'rocket',name:'VIR_G2',
     present:()=>!game.flags.vir_g2,
     talk:()=>dialogue(["ROCKET: The boss does not\nlike to be kept waiting!"],
       ()=>startTrainerFight('VIR_G2','ROCKET',[makeMon(105,61),makeMon(112,63)],'vir_g2'))},
    {x:3,y:6,dir:'down',kind:'npc',name:'VIR_GUIDE',
     talk:()=>dialogue([game.flags.viridianBeaten
        ? "GUIDE: The EARTH BADGE!\nAll eight! The LEAGUE is\nyours to challenge!"
        : "GUIDE: GIOVANNI fields\nNIDOKING, NIDOQUEEN,\nDUGTRIO, RHYDON, PERSIAN,\nthen MEGA KANGASKHAN."])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'VIRIDIAN',tx:4,ty:4} ], exits:[], encounters:null
};

export const POKEMON_LEAGUE=[
 "#########",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "####.####",
 "#########"
];
MAPS.POKEMON_LEAGUE={
  name:'POKEMON_LEAGUE', grid:POKEMON_LEAGUE, interior:true,
  npcs:[
    {x:4,y:9,dir:'down',kind:'npc',name:'E4_1',
     present:()=>!game.flags.e4_1,
     talk:()=>dialogue(["LORELEI: I am LORELEI of\nthe ELITE FOUR. My ICE\nwill freeze you solid!"],
       ()=>startTrainerFight('E4_1','LORELEI',[makeMon(87,62),makeMon(91,63),makeMon(124,64),makeMon(131,66)],'e4_1'))},
    {x:4,y:7,dir:'down',kind:'npc',name:'E4_2',
     present:()=>!game.flags.e4_2,
     talk:()=>dialogue(["BRUNO: I am BRUNO! My\nFIGHTING POKEMON will\ngrind you to dust!"],
       ()=>startTrainerFight('E4_2','BRUNO',[makeMon(106,63),makeMon(107,63),makeMon(95,64),makeMon(68,67)],'e4_2'))},
    {x:4,y:5,dir:'down',kind:'npc',name:'E4_3',
     present:()=>!game.flags.e4_3,
     talk:()=>dialogue(["AGATHA: Heh heh... my GHOST\nPOKEMON — and my MEGA\nGENGAR — will haunt your\nnightmares forever!"],
       ()=>startTrainerFight('E4_3','AGATHA',[makeMon(93,64),makeMon(24,65),makeMon(42,65),mkMega(94,68)],'e4_3'))},
    {x:4,y:3,dir:'down',kind:'npc',name:'E4_4',
     present:()=>!game.flags.e4_4,
     talk:()=>dialogue(["LANCE: I am LANCE, master\nof DRAGONS! My MEGA\nCHARIZARD will incinerate\nyou! Witness true power!"],
       ()=>startTrainerFight('E4_4','LANCE',[makeMon(130,65),makeMon(148,66),makeMon(142,66),makeMon(149,68),mkMega(6,70)],'e4_4'))},
    {x:4,y:1,dir:'down',kind:'rival',name:'MAY',
     present:()=>!game.flags.leagueBeaten,
     talk:()=>dialogue([
       "MAY: Hah — I got here\nfirst, and I'm gonna be\nthe CHAMPION!",
       "MAY: My team has grown\nso much since LITTLEROOT.\nLet's see what you've got!"],
       ()=>startLeagueRivalBattle())}
  ],
  signs:{ '4:11':"INDIGO PLATEAU\nPOKEMON LEAGUE\nELITE FOUR ahead." },
  warps:[
    // Beyond the Kanto champion (the top tile, clear once leagueBeaten) lies the
    // HOENN LEAGUE — sealed until the MIRAGE ISLAND finale.
    {x:4,y:1,to:'HOENN_LEAGUE',tx:4,ty:14,gate:'mirageFinale'}
  ],
  exits:[], encounters:null
};


export const HOENN_LEAGUE_GRID=[
 '#########', // 0
 '####.####', // 1  STEVEN (champion dais)
 '####.####', // 2
 '####.####', // 3  DRAKE
 '####.####', // 4
 '####.####', // 5  GLACIA
 '####.####', // 6
 '####.####', // 7  PHOEBE
 '####.####', // 8
 '####.####', // 9  SIDNEY
 '####.####', // 10
 '####.####', // 11 league GUARD (blocks return while mid-gauntlet)
 '##.....##', // 12 antechamber
 '##.....##', // 13 antechamber (NURSE)
 '####.####', // 14 entrance / exit warp
 '#########'  // 15
];
MAPS.HOENN_LEAGUE={
  name:'HOENN_LEAGUE', grid:HOENN_LEAGUE_GRID, interior:true,
  npcs:[
    {x:4,y:9,dir:'down',kind:'rocket',name:'HE4_1',
     present:()=>!game.flags.hE4_1,
     talk:()=>dialogue(['SIDNEY: I like strong\nPOKEMON and strong\ntrainers. I will go\nall out on you!'],
       ()=>startHoennE4_Sidney())},
    {x:4,y:7,dir:'down',kind:'npc',name:'HE4_2',
     present:()=>game.flags.hE4_1 && !game.flags.hE4_2,
     talk:()=>dialogue(['PHOEBE: I trained on MT.\nPYRE. My GHOST POKEMON\nshare a bond you cannot\nbreak!'],
       ()=>startHoennE4_Phoebe())},
    {x:4,y:5,dir:'down',kind:'npc',name:'HE4_3',
     present:()=>game.flags.hE4_2 && !game.flags.hE4_3,
     talk:()=>dialogue(['GLACIA: I came from far\nnorth to find a trainer\nworthy of my ice.\nToday that is you.'],
       ()=>startHoennE4_Glacia())},
    {x:4,y:3,dir:'down',kind:'npc',name:'HE4_4',
     present:()=>game.flags.hE4_3 && !game.flags.hE4_4,
     talk:()=>dialogue(['DRAKE: I have sailed every\nsea and tamed every\nstorm. My DRAGONS are\nborn from that journey.','DRAKE: Show me you are\nworthy of the title!'],
       ()=>startHoennE4_Drake())},
    {x:4,y:1,dir:'down',kind:'oak',name:'STEVEN_CHAMP',
     present:()=>game.flags.hE4_4 && !game.flags.hoennChampBeaten,
     talk:()=>dialogue([
       'STEVEN: I have been\nwaiting for you.\nLonger than you know.',
       'STEVEN: I held this title\nbecause no one better\nhad come along yet.',
       'STEVEN: You calmed GROUDON\nand KYOGRE. RAYQUAZA bowed.\nMIRAGE ISLAND opened\nfor you alone.',
       'STEVEN: Now take mine.',
       'STEVEN: METAGROSS. Let\'s give\nthis everything.'
     ], ()=>startStevenChampBattle())},
    {x:4,y:1,dir:'down',kind:'oak',name:'STEVEN_CHAMP_DONE',
     present:()=>game.flags.hoennChampBeaten,
     talk:()=>dialogue(['STEVEN: HOENN\'s champion.\nI like the sound of that.','STEVEN: The title is yours.\nWear it well.'])},
    // Antechamber NURSE — the last heal/save point before the gauntlet.
    {x:5,y:13,dir:'down',kind:'nurse',name:'LEAGUE_NURSE',
     talk:()=>{
       if(game.flags.hoennChampBeaten){ dialogue(["NURSE: Welcome back,\nCHAMPION! Rest anytime."], ()=>{ healParty(); Audio.heal(); }); return; }
       dialogue([
         "NURSE: Beyond this point\nis the ELITE FOUR — five\nbattles, no breaks.",
         "NURSE: Let me heal your\nteam to full. This is\nyour last chance!"
       ], ()=>{ healParty(); Audio.heal(); dialogue(["NURSE: All set. Walk north\nwhen you're ready. Good luck!"]); });
     }},
    // League GUARD — stands in the corridor and blocks retreat once the gauntlet
    // has begun (no leaving to heal mid-run). Gone before Sidney and after Steven.
    {x:4,y:11,dir:'down',kind:'rocket',name:'LEAGUE_GUARD',
     present:()=>isMidE4Gauntlet(),
     talk:()=>dialogue(["GUARD: No turning back now.\nThe ELITE FOUR must be\nfaced in one run.","GUARD: Fall here and you\nstart again from SIDNEY.\nGive it everything!"])}
  ],
  signs:{ '4:14':"EVER GRANDE CITY\nHOENN POKEMON LEAGUE\nCHAMPION: STEVEN STONE" },
  warps:[ {x:4,y:14,to:'POKEMON_LEAGUE',tx:4,ty:11} ],
  exits:[], encounters:null
};


export const CINNABAR=[
 "TTTTTTT~TTTTTTT",
 "T..CCC...GGG..T",
 "T..CCC...GGG..T",
 "T..CDC...GDG..T",
 "T.............T",
 "T...HHHHH.....T",
 "T...HHHHH.....T",
 "T...HHDHH.....T",
 "T.............T",
 "T......S......T",
 "T.............T",
 "TTTTTTTTTTTTTTT"
];
MAPS.CINNABAR={
  name:'CINNABAR', grid:CINNABAR, interior:false,
  npcs:[
    {x:3,y:9,dir:'down',kind:'npc',name:'CIN_TOWNIE',
     talk:()=>dialogue(["TOWNIE: CINNABAR ISLAND!\nThe POKEMON MANSION holds\ndark secrets.",
       "TOWNIE: GYM LEADER BLAINE\nasks fiery riddles — and\nbattles even hotter!"])},
    {x:5,y:9,dir:'down',kind:'npc',name:'FLY_TUTOR',
     talk:()=>{
       if(game.party.some(m=>m&&m.fly)){ dialogue(["BIRD KEEPER: Soar well!\nMENU -> FLY takes you\nanywhere you've been."]); return; }
       dialogue([
         "BIRD KEEPER: You look like\na traveler. Tired of all\nthat walking?",
         "BIRD KEEPER: I'll teach a\nPOKEMON my SECRET MOVE —\nFLY. Soar across the map\nin an instant!"],
         ()=>teachFly());
     }},
    {x:10,y:4,dir:'down',kind:'rival',name:'MAY',
     present:()=>!game.flags.cinnaRivalBeaten,
     talk:()=>dialogue([
       "MAY: Found you! I've been\ntraining nonstop since\nour last match.",
       "MAY: This is my strongest\nteam yet — show me\neverything you've learned!"],
       ()=>startCinnaRivalBattle())}
  ],
  signs:{ '7:9':"CINNABAR ISLAND\nMANSION - GYM\nLEADER: BLAINE" },
  warps:[
    {x:4,y:3,to:'CINNABAR_CENTER',tx:4,ty:4},
    {x:10,y:3,to:'BLAINE_GYM',tx:5,ty:6},
    {x:6,y:7,to:'POKE_MANSION',tx:5,ty:6}
  ],
  exits:[ {x:7,y:0,to:'ROUTE_SURF',tx:7,ty:12} ],
  encounters:null
};

export const CINNABAR_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "#___D___#",
 "#########"
];
MAPS.CINNABAR_CENTER={
  name:'CINNABAR_CENTER', grid:CINNABAR_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the\nPOKEMON CENTER!",
                 "NURSE: We'll restore your\nPOKEMON. One moment..."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! We hope\nto see you again!"]);
       });
     }}
  ],
  signs:{}, warps:[ {x:4,y:5,to:'CINNABAR',tx:4,ty:4} ], exits:[], encounters:null
};

export const BLAINE_GYM=[
 "###########",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_TT___TT_#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.BLAINE_GYM={
  name:'BLAINE_GYM', grid:BLAINE_GYM, interior:true,
  npcs:[
    {x:5,y:1,dir:'down',kind:'npc',name:'BLAINE',
     present:()=>!game.flags.blaineBeaten,
     talk:()=>dialogue([
       "BLAINE: Hah! I'm BLAINE,\nthe red-hot quizmaster of\nCINNABAR GYM!",
       "BLAINE: Here's my riddle —\ncan you take the HEAT?\nLet's find out!"],
       ()=>startBlaineBattle())},
    {x:3,y:3,dir:'down',kind:'npc',name:'BLA_T1',
     present:()=>!game.flags.bla_t1,
     talk:()=>dialogue(["BURGLAR: My FIRE POKEMON\nwill roast you!"],
       ()=>startTrainerFight('BLA_T1','BURGLAR',[makeMon(77,57),makeMon(126,59)],'bla_t1'))},
    {x:3,y:6,dir:'down',kind:'npc',name:'BLA_GUIDE',
     talk:()=>dialogue([game.flags.blaineBeaten
        ? "GUIDE: The VOLCANO BADGE!\nYou doused BLAINE's fire!"
        : "GUIDE: BLAINE: GROWLITHE,\nRAPIDASH, MAGMAR,\nARCANINE. Bring WATER,\nROCK, or GROUND!"])}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'CINNABAR',tx:10,ty:4} ], exits:[], encounters:null
};

export const POKE_MANSION=[
 "###########",
 "#_________#",
 "#_________#",
 "#_________#",
 "#_________#",
 "#_________#",
 "#_________#",
 "#____D____#",
 "###########"
];
MAPS.POKE_MANSION={
  name:'POKE_MANSION', grid:POKE_MANSION, interior:true,
  npcs:[
    {x:4,y:2,dir:'down',kind:'npc',name:'MANSION_SCI',
     talk:()=>dialogue([
       "Burnt journals litter the\nfloor. One page is still\nreadable...",
       "DIARY: '...the new POKEMON,\nMEWTWO, is far too\npowerful. We must...'",
       "The rest is scorched away."])},
    {x:8,y:3,dir:'down',kind:'ball',name:'MANSION_STASH',
     present:()=>!game.flags.mansion_stash,
     talk:()=>{ game.flags.mansion_stash=true; Audio.heal();
       game.flags.money=(game.flags.money|0)+5000;
       game.bag.greatball=(game.bag.greatball|0)+3;
       dialogue(["A hidden RESEARCH SAFE!",
         "Found 5000 and 3 GREAT\nBALLS inside!"]); }}
  ],
  signs:{}, warps:[ {x:5,y:7,to:'CINNABAR',tx:6,ty:8} ], exits:[], encounters:null
};
MAPS.PEWTER_GYM={
  name:'PEWTER_GYM', grid:PEWTER_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'ROXANNE',fixed:true,
     talk:()=>{
       if(game.flags.brockBeaten){
         dialogue(["ROXANNE: A fine victory.\nKeep training — the next\nGYM tests your fire."]);
       } else {
         dialogue([
           "ROXANNE: Welcome. I am\nROXANNE — RUSTBORO GYM's\nLEADER.",
           "ROXANNE: I teach the\nfundamentals of POKEMON\nbattle. ROCK-types are my\nfoundation.",
           "ROXANNE: Show me what\nyou've learned — give it\nyour best!"],
           ()=>startBrockBattle());
       }
     }},
    {x:3,y:7,dir:'down',kind:'npc',name:'GYM_GUIDE',
     talk:()=>dialogue([
       "GUIDE: ROXANNE uses ROCK-\ntype POKEMON!",
       "GUIDE: WATER and GRASS\nmoves are super effective.\nGood luck!"])}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'PEWTER',tx:7,ty:4} ],
  exits:[],
  encounters:null
};
MAPS.PMART={
  name:'PMART', grid:PMART, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'clerk',name:'CLERK',
     talk:()=>{
       dialogue(["CLERK: Welcome to the\nOLDALE POKE MART!",
                 "CLERK: We carry the basics\nfor new trainers."],()=>openViridianShop());
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'VIRIDIAN',tx:11,ty:4} ],
  exits:[], encounters:null
};

/* ===========================================================================
   NEW CONTENT — TRADE ROUTE, STEELWORKS CITY (STEVEN STONE) & STEEL GYM
=========================================================================== */

export const TRADE_ROUTE=[
 "TTTTTPTTTTTTTTT",  //  0  north path -> STEEL_CITY (x5)
 "T.....P.......T",  //  1
 "T,,,,.P.,,,,,,T",  //  2
 "T,,,,.P.,,,,,,T",  //  3
 "T.....P.......T",  //  4
 "T..F..P..F....T",  //  5
 "T.....P.......T",  //  6
 "P.....P.......T",  //  7  west path -> VERDANTURF (entry x1)
 "T.....P.......T",  //  8
 "T,,,,,P,,,,,,,T",  //  9
 "T,,,,,P,,,,,,,T",  // 10
 "TTTTTTTTTTTTTTT"   // 11
];

export const STEEL_CITY=[
 "TTTTTTTTTTTTTTT",  //  0
 "T.....GGGG....T",  //  1
 "T.....GGGG....T",  //  2
 "T.....GDGG....T",  //  3  gym door (7,3)
 "T.............T",  //  4
 "T..CCC........T",  //  5
 "T..CCC........T",  //  6
 "T..CDC...H....T",  //  7  PC door (4,7) ; Steven near house
 "T.............T",  //  8
 "T......P......T",  //  9  south path -> TRADE ROUTE
 "TTTTTTTPTTTTTTT"   // 10
];

export const STEEL_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "####D####"
];

export const STEEL_GYM=[
 "###########",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#_GG___GG_#",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#____D____#",
 "###########"
];
// ---- New content: MIRAGE ROUTE -> CARROUSEL CITY -> MIRAGE GYM -> TRADE PARK

export const MIRAGE_ROUTE=[
 "TTTTTPTTTTTTTTT",  //  0  north path -> CARROUSEL_CITY (x5)
 "T....P........T",  //  1
 "T,,,.P.,,,,,,,T",  //  2
 "T,,,.P.,,,,,,,T",  //  3
 "T....P........T",  //  4
 "T.F..P....F...T",  //  5
 "T....P........T",  //  6
 "P....P........T",  //  7  west path -> VERDANTURF (entry)
 "T....P........T",  //  8
 "T,,,,P,,,,,,,,T",  //  9
 "T,,,,P,,,,,,,,T",  // 10
 "TTTTTTTTTTTTTTT"   // 11
];

export const CARROUSEL_CITY=[
 "TTTTTTTTTTTTTTT",  //  0
 "T.....GGGG....T",  //  1
 "T.....GGGG....T",  //  2
 "T.....GDGG....T",  //  3  gym door (7,3)
 "P.............T",  //  4  WEST exit -> MISTRAL FOREST
 "T..CCC...KK...T",  //  5  PC (left) ; trade park gate KK (x9-10,y5)
 "T..CCC...KDK..T",  //  6  park gate door (10,6)
 "T..CDC........T",  //  7  PC door (4,7)
 "T.............T",  //  8
 "T......P......T",  //  9  south path -> MIRAGE_ROUTE
 "TTTTTTTPTTTTTTT"   // 10
];

export const CARROUSEL_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "####D####"
];

export const MIRAGE_GYM=[
 "###########",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#_GG___GG_#",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#____D____#",
 "###########"
];

export const TRADE_PARK=[
 "TTTTTTTTTTTTTTT",  //  0
 "T.............T",  //  1
 "T..,,,...,,,..T",  //  2  little grass plots
 "T..,,,...,,,..T",  //  3
 "T.............T",  //  4
 "T.....O.......T",  //  5  trade host
 "T.............T",  //  6
 "T..O.......O..T",  //  7  two trade NPCs
 "T.............T",  //  8
 "T......D......T",  //  9  exit door back to CARROUSEL_CITY (7,9)
 "TTTTTTTTTTTTTTT"   // 10
];
// ===== QUEST 5: MISTRAL FOREST -> NORMAN GYM -> SKY / EON =====

export const MISTRAL_FOREST_1=[
 "TTTTTTTTTTTTTTT",
 "T,,,..TTT..,,,T",
 "T,,,..T....,,,P",  // EAST exit (14,2) <- Carrousel
 "T....TT..TTT..T",
 "T.,,.....,,...T",
 "T.,,.TTT.,,.TTT",
 "T....T.....,,,T",
 "P....T..TT....T",  // WEST exit (0,7) -> F2
 "T.,,,T..,,....T",
 "T.,,,...,,..TTT",
 "TTTTTTTTTTTTTTT"
];

export const MISTRAL_FOREST_2=[
 "TTTTTTTPTTTTTTT",  // NORTH exit (7,0) -> F3
 "T,,..T...T..,,T",
 "T,,..T...T..,,T",
 "T...TT...TT...T",
 "T.,,.....,,...P",  // EAST exit (14,4) -> F1
 "T.,,.TTT.,,...T",
 "T....T.T.....,T",
 "T..TTT.TTT..,,T",
 "T,,.....,...,,T",
 "T,,..,,,.,,...T",
 "TTTTTTTTTTTTTTT"
];

export const MISTRAL_FOREST_3=[
 "TTTTTTTTTTTTTTT",
 "T,,,..TT...,,,T",
 "T,,,.......,,,T",
 "T....TTT.TT...T",
 "P....T.......,T",  // WEST exit (0,4) -> PETALBURG
 "T.,,.T..TTT.,,T",
 "T.,,....T.....T",
 "T....TT.T..,,,T",
 "T,,......,,,..T",
 "T,,...T....,..T",
 "TTTTTTTPTTTTTTT"   // SOUTH exit (7,10) -> F2
];

export const PETALBURG_TOWN=[
 "TTTTTTTTTTTTTTT",
 "T.....GGGG....T",
 "T.....GGGG....T",
 "T.....GDGG....T",  // gym door (7,3)
 "T.............T",
 "T...CCC..HHH..T",  // family house cols 9-11
 "T...CCC..HHH..T",
 "T...CDC..HDH..P",  // PC door (5,7); house door (10,7); EAST exit (14,7)
 "T.............T",
 "T.............T",
 "TTTTTTTPTTTTTTT"
];

export const VERDANT_ROUTE=[
 "TTTTTTTPTTTTTTT",
 "T,,,...,...,,,T",
 "T,,,.TTT...,,,T",
 "T....T.....,,,T",
 "T.,,.T..TTT...T",
 "T.,,....T.....T",
 "T....TT.T..,,,T",
 "T,,,....T..,,,T",
 "T,,,..,,,..,,,T",
 "T.....,,,.....T",
 "TTTTTTTPTTTTTTT"
];

export const BIRCH_TOWN=[
 "TTPTTTTTTTTTTTT",
 "T.....GGGG....P",
 "T.....GGGG....T",
 "T.....GDGG....T",
 "T.............T",
 "T..CCC...LLL..T",
 "T..CCC...LLL..T",
 "T..CDC...LDL..T",
 "T.............T",
 "T.............T",
 "TTTTTTTTTTTTTTT"
];

export const BIRCH_LAB=[
 "#########",
 "#_______#",
 "#_BB___B#",
 "#_______#",
 "#___O___#",
 "#_______#",
 "####D####"
];

export const BIRCH_GYM=[
 "###########",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#_HH___HH_#",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#____D____#",
 "###########"
];

export const BIRCH_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "####D####"
];
// ===== QUEST 7: STORM RIDGE -> AURORA TOWN (Electric gym, final before the big event) =====

export const STORM_RIDGE=[
 "TTTTTTTTTTTTTTT",
 "P....,,,...TTTT",
 "T....,,,......T",
 "T.TTT....TT...T",
 "T....,,,.T....T",
 "T.,,.,,,.T.TT.T",
 "T.,,.....T....T",
 "T....TTT....,,T",
 "T.TT.....TT.,,T",
 "T.......,,....P",
 "TTTTTTTTTTTTTTT"
];

export const AURORA_TOWN=[
 "TTTTTTTTTTTTTTT",
 "P.............T",
 "T....GGGG.....T",
 "T....GGGG.....T",
 "T....GDGG.....T",
 "T.............T",
 "T...CCC.......T",
 "T...CDC.......T",
 "T.............T",
 "T.............P",
 "TTTTTTTTTTTTTTT"
];

export const AURORA_GYM=[
 "###########",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#_HH___HH_#",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#____D____#",
 "###########"
];

export const AURORA_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "####D####"
];
// ===== QUEST 8 (FINAL GYM): CELESTIAL PATH -> ZENITH CITY (FLY granted on arrival) =====

export const CELESTIAL_PATH=[
 "TTTTTTTTTTTTTTT",
 "P....,,,......T",
 "T....,,,...TT.T",
 "T.TTT.....T...T",
 "T....,,,..T.,,T",
 "T.,,.,,,....,,T",
 "T.,,......TT..T",
 "T....TTT.....,T",
 "T.TT......TT.,T",
 "T.......,,....P",
 "TTTTTTTTTTTTTTT"
];

export const ZENITH_CITY=[
 "TTTTTTTTTTTTTTT",
 "P.............T",
 "T....GGGG.....T",
 "T....GGGG.....T",
 "T....GDGG.....T",
 "T.............T",
 "T...CCC.......T",
 "T...CDC.......T",
 "T.............T",
 "T.............T",
 "TTTTTTTTTTTTTTT"
];

export const ZENITH_GYM=[
 "###########",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#_HH___HH_#",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#____D____#",
 "###########"
];

export const ZENITH_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "####D####"
];

export const PETALBURG_CENTER=[
 "#########",
 "#_______#",
 "#_______#",
 "#_______#",
 "#_______#",
 "####D####"
];
// Quiet single-room house in PETALBURG with a sit-and-think chair.
// 'h' = chair (solid, interactable -> startStarterTalk).

export const PETALBURG_HOUSE=[
 "#########",
 "#_BB____#",
 "#_BB____#",
 "#_______#",
 "#______h#",
 "#_______#",
 "####D####"
];

export const NORMAN_GYM=[
 "###########",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#_HH___HH_#",
 "#_________#",
 "#____O____#",
 "#_________#",
 "#____D____#",
 "###########"
];

export const SKY_FIELD=[
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "ssssssDssssssss",
 "sssssssssssssss"
];
// Climax Part 1 — MT. CHIMNEY volcanic summit.
// 'v' = lava (impassable, animated red).
// '#' = basalt rock wall (impassable).
// '.' = ash path (walkable, dark).
// Player arrives at (6,13), MAXIE waits at (6,2), 3 grunts at (6,12)/(6,9)/(6,6).

export const MAGMA_VOLCANO=[
 "vvv#######vvv",
 "vvv#.....#vvv",
 "vvv#.....#vvv",
 "vvv#.....#vvv",
 "vvv##...##vvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv",
 "vvvv#...#vvvv"
];
// Climax Part 2 — Open ocean south of LITTLEROOT, accessed by SURF.
// 'Y' = dive spot (animated swirl, walkable while surfing, warps to UNDERWATER).
// Player enters at (7,1) from the north exit; dive spot at (7,7).

export const OCEAN_ROUTE=[
 "TTTTTTT~TTTTTTT",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~Y~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "T~~~~~~~~~~~~~T",
 "TTTTTTTTTTTTTTT"
];
// Climax Part 2 — Underwater Aqua hideout. Dark bioluminescent cavern.
// 'w' = underwater floor (walkable). 'k' = coral wall (solid).
// Player arrives at (6,12), ARCHIE waits at (6,2), 3 grunts climbing up.

export const UNDERWATER=[
 "kkk#######kkk",
 "kkk#wwwww#kkk",
 "kkk#wwwww#kkk",
 "kkk#wwwww#kkk",
 "kkk##www##kkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk",
 "kkkk#www#kkkk"
];
// Climax Part 3 — Peaceful sky island. Sea of clouds, a small grassy plateau.
// Reuses 's' (sky) tiles around a small '.'-grass-flower core.
// Player arrives at (7,9), walks toward center (7,5) — cutscene fires.

export const SKY_ISLAND=[
 "sssssssssssssss",
 "sssssssssssssss",
 "sssssssssssssss",
 "ssssss...ssssss",
 "ssss.......ssss",
 "ssss...F...ssss",
 "ssss.......ssss",
 "ssss...P...ssss",
 "sssss.....sssss",
 "ssssss...ssssss",
 "sssssssssssssss"
];
MAPS.TRADE_ROUTE={
  name:'TRADE_ROUTE', grid:TRADE_ROUTE, interior:false,
  npcs:[
    {x:8,y:5,dir:'down',kind:'npc',name:'TRADE_NPC',
     talk:()=>{
       if(game.flags.tradeMonTaken){
         dialogue([
           "TRADER: That KADABRA I gave\nyou? With a LINK CABLE it\nbecomes ALAKAZAM.",
           "TRADER: Open your BAG, use\nthe LINK CABLE on KADABRA.\nThat's the trade trick!"]);
         return;
       }
       dialogue([
         "TRADER: Hey, trainer! I run\na little trade stall out\nhere on the route.",
         "TRADER: Tell you what \u2014 I'll\nhand you my KADABRA for\nfree. Consider it a\nwelcome gift.",
         "TRADER: KADABRA only reaches\nits final form, ALAKAZAM,\nthrough a TRADE.",
         "TRADER: Lucky you \u2014 DEVON's\nLINK CABLE simulates one.\nUse it on KADABRA and\nwatch what happens!"
       ], ()=>{
         const msg = giveMon(64, 30);
         game.flags.tradeMonTaken = true;
         markSeen(64);
         if((game.bag.linkcable|0) <= 0){
           game.bag.linkcable = (game.bag.linkcable||0) + 1;
           dialogue([msg, "TRADER: Here \u2014 take a LINK\nCABLE too, on the house.\nNow go make an ALAKAZAM!"]);
         } else {
           dialogue([msg, "TRADER: You've already got a\nLINK CABLE. Use it on that\nKADABRA whenever you like!"]);
         }
       });
     }},
    {x:3,y:8,dir:'right',kind:'npc',name:'TRADE_ROUTE_HIKER',
     talk:()=>dialogue([
       "HIKER: ABRA teleport away\nthe instant you're not\nlooking. Throw fast!",
       "HIKER: The city north of\nhere is built on STEEL.\nThe GYM there is no joke."])}
  ],
  signs:{ '6:7':"ROUTE 9 \u2014 TRADE FLATS\nVERDANTURF <-> the steel\ncity to the north." },
  warps:[],
  exits:[
    {x:0,y:7,to:'VERDANTURF',tx:13,ty:5},
    {x:5,y:0,to:'STEEL_CITY',tx:7,ty:9}
  ],
  encounters:[
    {id:63,min:28,max:32,w:35},
    {id:64,min:30,max:34,w:20},
    {id:96,min:28,max:31,w:25},
    {id:35,min:28,max:31,w:20}
  ]
};
MAPS.STEEL_CITY={
  name:'STEEL_CITY', grid:STEEL_CITY, interior:false,
  npcs:[
    {x:9,y:8,dir:'up',kind:'oak',name:'STEVEN',fixed:true,
     talk:()=>{
       if(game.flags.steelGymBeaten && !game.flags.stevenGift){
         dialogue([
           "STEVEN: I watched your gym\nbattle. Crisp. Decisive.\nYou fight like a champion\nin the making.",
           "STEVEN: I'm STEVEN STONE \u2014 I\ncollect rare stones... and\nrarer trainers.",
           "STEVEN: Take this. It's a\nSKARMORY \u2014 living steel\nwith wings. A worthy\npartner for a champion."],
           ()=>{
             const msg = giveMon(227, 30);
             game.flags.stevenGift = true;
             dialogue([msg, "STEVEN: We'll meet again at\nthe top. I'm counting\non it."]);
           });
       } else if(game.flags.stevenGift){
         dialogue([
           "STEVEN: How's that SKARMORY\ncoming along?",
           "STEVEN: Steel takes time to\nforge. So do champions.\nKeep going."]);
       } else {
         dialogue([
           "STEVEN: Welcome to the\nSTEELWORKS CITY, trainer.",
           "STEVEN: I'm STEVEN STONE. The\nGYM here is led by JASPER \u2014\na STEEL-type purist.",
           "STEVEN: Beat JASPER and come\nfind me. I have something\nfor a trainer with real\nsteel in them."]);
       }
     }},
    {x:11,y:4,dir:'down',kind:'npc',name:'STEEL_TOWNIE',
     talk:()=>dialogue([
       "TOWNIE: STEEL-types laugh off\nmost attacks.",
       "TOWNIE: Bring FIRE, FIGHTING,\nor GROUND moves to JASPER's\nGYM or you'll be there all\nday."])}
  ],
  signs:{ '7:9':"STEELWORKS CITY\nForged in iron. Home of\nGYM LEADER JASPER." },
  warps:[
    {x:7,y:3,to:'STEEL_GYM',tx:5,ty:8},
    {x:4,y:7,to:'STEEL_CENTER',tx:4,ty:4}
  ],
  exits:[ {x:7,y:10,to:'TRADE_ROUTE',tx:5,ty:1} ],
  encounters:null
};
MAPS.STEEL_CENTER={
  name:'STEEL_CENTER', grid:STEEL_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){
         dialogue(["NURSE: Welcome! Come back\nonce you have a POKEMON\nto heal."]);
         return;
       }
       dialogue(["NURSE: Welcome to the\nSTEELWORKS POKEMON CENTER!",
                 "NURSE: Let's get your team\nback to full strength."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! Good luck\nagainst JASPER."]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'STEEL_CITY',tx:4,ty:8} ],
  exits:[], encounters:null
};
MAPS.STEEL_GYM={
  name:'STEEL_GYM', grid:STEEL_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'JASPER',fixed:true,
     talk:()=>{
       if(game.flags.steelGymBeaten){
         dialogue(["JASPER: Your team is tempered\nsteel now. Go test it\nagainst the world."]);
       } else {
         dialogue([
           "JASPER: So you crossed the\ntrade flats to reach me.\nGood.",
           "JASPER: I am JASPER, LEADER\nof the STEELWORKS GYM.\nSTEEL-types are my craft.",
           "JASPER: My team runs Lv 35\nto 45. Come at me with\neverything you've forged!"
         ], ()=>startSteelGymBattle());
       }
     }},
    {x:5,y:6,dir:'down',kind:'npc',name:'STEEL_APP1',
     los:4, losFlag:'steel_app1',
     talk:()=>{
       if(game.flags.steel_app1){
         dialogue(["APPRENTICE: JASPER is just\nahead. Mind the girders."]);
         return;
       }
       dialogue(["APPRENTICE: No one reaches\nJASPER without going\nthrough me first!"],
         ()=>{
           const team=[makeMon(208,36), makeMon(82,37)];
           startTrainerFight('STEEL_APP1','APPRENTICE',team,'steel_app1');
         });
     }}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'STEEL_CITY',tx:7,ty:4} ],
  exits:[], encounters:null
};
// ---- New content maps: MIRAGE ROUTE / CARROUSEL CITY / MIRAGE GYM / TRADE PARK ----
MAPS.MIRAGE_ROUTE={
  name:'MIRAGE_ROUTE', grid:MIRAGE_ROUTE, interior:false,
  npcs:[
    {x:8,y:8,dir:'left',kind:'npc',name:'MIRAGE_APP1',
     los:4, losFlag:'mirage_route_t1',
     talk:()=>{
       if(game.flags.mirage_route_t1){
         dialogue(["BATTLE GIRL: The city ahead\\nholds the GYM and a\\nlocked TRADE PARK."]);
         return;
       }
       dialogue(["BATTLE GIRL: A mirage road,\\na real fight! Defend\\nyourself!"],
         ()=>{
           const team=[makeMon(57,32), makeMon(67,33)];
           startTrainerFight('MIRAGE_APP1','BATTLE GIRL',team,'mirage_route_t1');
         });
     }},
    {x:3,y:5,dir:'down',kind:'npc',name:'MIRAGE_HIKER',
     talk:()=>dialogue([
       "HIKER: This shimmering route\\nleads to CARROUSEL CITY.",
       "HIKER: Word is the GYM there\\nhands winners a TRADE PASS\\n\u2014 the only way into the\\nTRADE PARK."])}
  ],
  signs:{ '6:6':"ROUTE 10 \u2014 MIRAGE FLATS\\nVERDANTURF <-> CARROUSEL\\nCITY to the north." },
  warps:[],
  exits:[
    {x:0,y:7,to:'VERDANTURF',tx:1,ty:9},
    {x:5,y:0,to:'CARROUSEL_CITY',tx:7,ty:9}
  ],
  encounters:[
    {id:35,min:30,max:34,w:25},
    {id:66,min:30,max:33,w:25},
    {id:96,min:31,max:34,w:25},
    {id:58,min:30,max:33,w:25}
  ]
};
MAPS.CARROUSEL_CITY={
  name:'CARROUSEL_CITY', grid:CARROUSEL_CITY, interior:false,
  npcs:[
    // Gate guard — blocks the TRADE PARK door until the TRADE PASS is earned.
    {x:8,y:7,dir:'right',kind:'npc',name:'PARK_GUARD',fixed:true,
     talk:()=>{
       if(game.flags.tradePass){
         dialogue(["GUARD: TRADE PASS confirmed.\\nThe TRADE PARK is open to\\nyou \u2014 step right in!"]);
       } else {
         dialogue([
           "GUARD: Halt. The TRADE PARK\\nis members only.",
           "GUARD: Bring me a TRADE PASS.\\nLEADER NOVA awards one to\\nanybody who beats the GYM.",
           "GUARD: Beat NOVA, then come\\nback. No pass, no entry."]);
       }
     }},
    {x:3,y:4,dir:'down',kind:'npc',name:'CARROUSEL_TOWNIE',
     talk:()=>dialogue([
       "TOWNIE: Welcome to CARROUSEL\\nCITY \u2014 the trading town!",
       "TOWNIE: NOVA runs the GYM with\\nPSYCHIC-type flair. Bring\\nBUG, GHOST, or DARK moves."])}
  ],
  signs:{ '7:9':"CARROUSEL CITY\\nThe trading town. Home of\\nGYM LEADER NOVA." },
  warps:[
    {x:7,y:3,to:'MIRAGE_GYM',tx:5,ty:8},
    {x:4,y:7,to:'CARROUSEL_CENTER',tx:4,ty:4},
    {x:10,y:6,to:'TRADE_PARK',tx:7,ty:8,gate:'tradePass'}
  ],
  exits:[ {x:7,y:10,to:'MIRAGE_ROUTE',tx:5,ty:1}, {x:0,y:4,to:'MISTRAL_FOREST_1',tx:13,ty:2} ],
  encounters:null
};
MAPS.CARROUSEL_CENTER={
  name:'CARROUSEL_CENTER', grid:CARROUSEL_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){
         dialogue(["NURSE: Welcome! Come back\\nonce you have a POKEMON\\nto heal."]);
         return;
       }
       dialogue(["NURSE: Welcome to the\\nCARROUSEL POKEMON CENTER!",
                 "NURSE: Let's heal your team\\nfor the GYM."],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! Good luck\\nagainst NOVA."]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'CARROUSEL_CITY',tx:4,ty:8} ],
  exits:[], encounters:null
};
MAPS.MIRAGE_GYM={
  name:'MIRAGE_GYM', grid:MIRAGE_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'NOVA',fixed:true,
     talk:()=>{
       if(game.flags.mirageGymBeaten){
         dialogue(["NOVA: The TRADE PARK is yours\\nto enjoy. Trade well,\\nchampion."]);
       } else {
         dialogue([
           "NOVA: So the mirage road let\\nyou through. Impressive.",
           "NOVA: I am NOVA, LEADER of the\\nCARROUSEL GYM. My PSYCHIC\\nteam bends the battlefield.",
           "NOVA: My team runs Lv 46 to\\n52. Beat me and the TRADE\\nPARK opens to you!"
         ], ()=>startMirageGymBattle());
       }
     }},
    {x:5,y:6,dir:'down',kind:'npc',name:'MIRAGE_APP2',
     los:4, losFlag:'mirage_app2',
     talk:()=>{
       if(game.flags.mirage_app2){
         dialogue(["APPRENTICE: NOVA is just\\nahead. Mind your thoughts."]);
         return;
       }
       dialogue(["APPRENTICE: None pass to NOVA\\nwithout besting me!"],
         ()=>{
           const team=[makeMon(64,46), makeMon(97,47)];
           startTrainerFight('MIRAGE_APP2','APPRENTICE',team,'mirage_app2');
         });
     }}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'CARROUSEL_CITY',tx:7,ty:4} ],
  exits:[], encounters:null
};
MAPS.TRADE_PARK={
  name:'TRADE_PARK', grid:TRADE_PARK, interior:false,
  npcs:[
    {x:6,y:5,dir:'down',kind:'oak',name:'PARK_HOST',fixed:true,
     talk:()=>{
       if(!game.flags.parkGift){
         dialogue([
           "HOST: Welcome to the TRADE\\nPARK! Your TRADE PASS gets\\nyou in for life.",
           "HOST: Here's a welcome gift \u2014\\na rare PORYGON, a POKEMON\\nborn for trading!"],
           ()=>{
             const msg=giveMon(137,40);
             game.flags.parkGift=true;
             markSeen(137);
             dialogue([msg,"HOST: Chat with the traders\\naround the park \u2014 they love\\nrare finds."]);
           });
       } else {
         dialogue(["HOST: Enjoy the TRADE PARK!\\nThe grass here hides some\\nuncommon visitors."]);
       }
     }},
    {x:3,y:7,dir:'right',kind:'npc',name:'PARK_TRADER1',
     talk:()=>dialogue([
       "TRADER: A traded POKEMON grows\\nfaster \u2014 it earns more EXP\\nthan one you caught.",
       "TRADER: Some POKEMON only\\nevolve by trading. Keep a\\nLINK CABLE handy!"])},
    {x:11,y:7,dir:'left',kind:'npc',name:'PARK_TRADER2',
     talk:()=>dialogue([
       "COLLECTOR: I've traded across\\nfour regions. Every partner\\ntells a story.",
       "COLLECTOR: You earned your way\\nin here. Respect."])}
  ],
  signs:{ '7:9':"TRADE PARK\\nMembers only. Trade, train,\\nand make rare friends." },
  warps:[ {x:7,y:9,to:'CARROUSEL_CITY',tx:10,ty:7} ],
  exits:[],
  encounters:[
    {id:137,min:36,max:40,w:18},
    {id:63,min:36,max:40,w:30},
    {id:132,min:36,max:40,w:22},
    {id:133,min:36,max:40,w:30}
  ]
};
// ===== QUEST 5 MAPS =====
MAPS.MISTRAL_FOREST_1={
  name:'MISTRAL_FOREST_1', grid:MISTRAL_FOREST_1, interior:false,
  npcs:[
    {x:6,y:4,dir:'down',kind:'npc',name:'MF_BUG1',
     los:3, losFlag:'mf_t1',
     talk:()=>{
       if(game.flags.mf_t1){ dialogue(["BUG CATCHER: The forest goes\non a while yet. Keep west."]); return; }
       dialogue(["BUG CATCHER: A wild trainer in\na wild wood! Battle me!"],
         ()=>{ const team=[makeMon(48,32), makeMon(46,33)]; startTrainerFight('MF_BUG1','BUG CATCHER',team,'mf_t1'); });
     }},
    {x:9,y:8,dir:'left',kind:'npc',name:'MF_BUG2',
     los:3, losFlag:'mf_t2',
     talk:()=>{
       if(game.flags.mf_t2){ dialogue(["LASS: Watch for rustling\ngrass \u2014 it's full of bugs!"]); return; }
       dialogue(["LASS: You'll never reach\nPETALBURG past me!"],
         ()=>{ const team=[makeMon(13,33), makeMon(167,34)]; startTrainerFight('MF_BUG2','LASS',team,'mf_t2'); });
     }},
    {x:11,y:3,dir:'down',kind:'npc',name:'MF_SIGN_NPC',
     talk:()=>dialogue(["HIKER: MISTRAL FOREST is easy\nto get lost in. Path runs\nEAST-town, WEST, NORTH,\nthen WEST to PETALBURG."])}
  ],
  signs:{ '2:2':"MISTRAL FOREST\nGreen, deep, and full of\nwild POKEMON." },
  warps:[],
  exits:[
    {x:14,y:2,to:'CARROUSEL_CITY',tx:1,ty:4},
    {x:0,y:7,to:'MISTRAL_FOREST_2',tx:13,ty:4}
  ],
  encounters:[
    {id:10,min:30,max:34,w:22},{id:13,min:30,max:34,w:22},
    {id:43,min:31,max:34,w:18},{id:69,min:31,max:34,w:16},
    {id:167,min:31,max:35,w:12},{id:165,min:31,max:35,w:10}
  ]
};
MAPS.MISTRAL_FOREST_2={
  name:'MISTRAL_FOREST_2', grid:MISTRAL_FOREST_2, interior:false,
  npcs:[
    {x:5,y:5,dir:'right',kind:'npc',name:'MF_BUG3',
     los:3, losFlag:'mf_t3',
     talk:()=>{
       if(game.flags.mf_t3){ dialogue(["CAMPER: The way out is\nNORTH from here."]); return; }
       dialogue(["CAMPER: Lost in the woods?\nFight your way through!"],
         ()=>{ const team=[makeMon(48,34), makeMon(16,34), makeMon(46,35)]; startTrainerFight('MF_BUG3','CAMPER',team,'mf_t3'); });
     }},
    {x:10,y:8,dir:'up',kind:'npc',name:'MF_BUG4',
     los:3, losFlag:'mf_t4',
     talk:()=>{
       if(game.flags.mf_t4){ dialogue(["PICNICKER: So close to\nPETALBURG now!"]); return; }
       dialogue(["PICNICKER: One more battle\nbefore you leave my woods!"],
         ()=>{ const team=[makeMon(191,34), makeMon(69,35), makeMon(43,35)]; startTrainerFight('MF_BUG4','PICNICKER',team,'mf_t4'); });
     }}
  ],
  signs:{},
  warps:[],
  exits:[
    {x:14,y:4,to:'MISTRAL_FOREST_1',tx:1,ty:7},
    {x:7,y:0,to:'MISTRAL_FOREST_3',tx:7,ty:8}
  ],
  encounters:[
    {id:10,min:31,max:35,w:20},{id:13,min:31,max:35,w:20},
    {id:48,min:32,max:35,w:18},{id:46,min:32,max:35,w:16},
    {id:167,min:32,max:36,w:14},{id:165,min:32,max:36,w:12}
  ]
};
MAPS.MISTRAL_FOREST_3={
  name:'MISTRAL_FOREST_3', grid:MISTRAL_FOREST_3, interior:false,
  npcs:[
    {x:8,y:6,dir:'left',kind:'npc',name:'MF_BUG5',
     los:4, losFlag:'mf_t5',
     talk:()=>{
       if(game.flags.mf_t5){ dialogue(["VETERAN: PETALBURG is just\nWEST. The GYM LEADER there\nis tough \u2014 and familiar."]); return; }
       dialogue(["VETERAN: Last guardian of\nthe forest! Show me your\nstrength!"],
         ()=>{ const team=[makeMon(48,36), makeMon(46,36), makeMon(16,37)]; startTrainerFight('MF_BUG5','VETERAN',team,'mf_t5'); });
     }},
    {x:11,y:2,dir:'down',kind:'npc',name:'MF_EXIT_NPC',
     talk:()=>dialogue(["TRAINER: West gate leads to\nPETALBURG TOWN. Heard their\nGYM LEADER is new..."])}
  ],
  signs:{},
  warps:[],
  exits:[
    {x:7,y:10,to:'MISTRAL_FOREST_2',tx:7,ty:1},
    {x:0,y:4,to:'PETALBURG_TOWN',tx:13,ty:7}
  ],
  encounters:[
    {id:10,min:33,max:36,w:18},{id:13,min:33,max:36,w:18},
    {id:48,min:33,max:37,w:18},{id:46,min:33,max:37,w:16},
    {id:191,min:33,max:36,w:14},{id:167,min:33,max:37,w:16}
  ]
};
MAPS.PETALBURG_TOWN={
  name:'PETALBURG_TOWN', grid:PETALBURG_TOWN, interior:false,
  npcs:[
    // STEVEN appears only AFTER Norman is beaten, to start the sky quest.
    {x:9,y:8,dir:'left',kind:'oak',name:'STEVEN_PETAL',fixed:true,
     present:()=>game.flags.normanBeaten && !game.flags.eonChoiceMade,
     talk:()=>{
       if(game.flags.aquaEonBeaten){
         dialogue(["STEVEN: You did it. The skies\nare calm again. Thank you,\nchampion."]);
         return;
       }
       dialogue([
         "STEVEN: That was some battle\nagainst your father.",
         "STEVEN: Something's wrong in\nthe skies above PETALBURG.\nTEAM AQUA is hunting the\nEON POKEMON.",
         "STEVEN: My METAGROSS can carry\nyou up there. Will you help\nme stop them?"
       ], ()=>{
         choice("Fly up with STEVEN?",[
           {label:"YES",fn:()=>{
             dialogue([
               "STEVEN: Climb on. Hold tight \u2014\nMETAGROSS flies fast!",
               "You leapt onto METAGROSS and\nrose into the open sky!"
             ], ()=>{
               game.flags.skyForm=true;
               setMap('SKY_FIELD',7,9,'up');
             });
           }},
           {label:"NOT YET",fn:()=>dialogue(["STEVEN: I'll wait. The EON\nPOKEMON are running out\nof time, though."])}
         ]);
       });
     }},
    {x:3,y:5,dir:'down',kind:'npc',name:'PETAL_TOWNIE',
     talk:()=>dialogue([
       "TOWNIE: Welcome to PETALBURG\nTOWN! Our GYM just got a\nbrand-new LEADER.",
       "TOWNIE: Folks say he moved\nhere to be closer to\nfamily."])}
  ],
  signs:{ '7:9':"PETALBURG TOWN\nA quiet town wrapped in\nforest. GYM LEADER: NORMAN." },
  warps:[
    {x:7,y:3,to:'NORMAN_GYM',tx:5,ty:8},
    {x:5,y:7,to:'PETALBURG_CENTER',tx:4,ty:4},
    {x:10,y:7,to:'PETALBURG_HOUSE',tx:4,ty:5}
  ],
  exits:[ {x:14,y:7,to:'MISTRAL_FOREST_3',tx:1,ty:4}, {x:7,y:10,to:'VERDANT_ROUTE',tx:7,ty:1} ],
  encounters:null
};
MAPS.PETALBURG_CENTER={
  name:'PETALBURG_CENTER', grid:PETALBURG_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the\nPETALBURG POKEMON CENTER!"],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! Good luck\nat the GYM."]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'PETALBURG_TOWN',tx:5,ty:8} ],
  exits:[], encounters:null
};
// Quiet family house. Walk up to the chair, press A, sit with your starter.
MAPS.PETALBURG_HOUSE={
  name:'PETALBURG_HOUSE', grid:PETALBURG_HOUSE, interior:true,
  npcs:[],
  signs:{ '2:1':"The bed is made. Smells\nlike home." },
  warps:[ {x:4,y:6,to:'PETALBURG_TOWN',tx:10,ty:8} ],
  exits:[], encounters:null
};
MAPS.NORMAN_GYM={
  name:'NORMAN_GYM', grid:NORMAN_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'NORMAN',fixed:true,
     talk:()=>{
       if(game.flags.normanBeaten){
         dialogue([
           "NORMAN: I'm proud of you...\nmore than any badge could\nshow. Go help STEVEN.",
           "NORMAN: Your old man will be\nright here, kiddo."]);
       } else {
         dialogue([
           "NORMAN: So. A challenger.\nLet's see what you've...",
           "NORMAN: ...wait. That face.\nThose eyes. ...Is that\nreally you?",
           "NORMAN: We'll talk after. Right\nnow you're a challenger and\nI'm the LEADER. NORMAN of\nthe NORMAL type!",
           "NORMAN: My team runs Lv 52 to\n58. Come at me with all\nyou've got!"
         ], ()=>startNormanBattle());
       }
     }},
    {x:5,y:6,dir:'down',kind:'npc',name:'NORMAN_APP1',
     los:4, losFlag:'norman_app1',
     talk:()=>{
       if(game.flags.norman_app1){ dialogue(["TRAINER: The LEADER is just\nahead. He's... intense\ntoday."]); return; }
       dialogue(["TRAINER: NORMAN trained me\nhimself! Prove you're\nworthy!"],
         ()=>{ const team=[makeMon(128,50), makeMon(53,51)]; startTrainerFight('NORMAN_APP1','TRAINER',team,'norman_app1'); });
     }}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'PETALBURG_TOWN',tx:7,ty:4} ],
  exits:[], encounters:null
};
MAPS.SKY_FIELD={
  name:'SKY_FIELD', grid:SKY_FIELD, interior:false,
  npcs:[
    // Wild sky Pokemon drifting around (visual + flavor)
    {x:2,y:3,dir:'down',kind:'npc',name:'SKY_BIRD1',npcMon:16,
     talk:()=>dialogue(["A wild PIDGEY wheels past on\nthe wind."])},
    {x:12,y:5,dir:'down',kind:'npc',name:'SKY_BIRD2',npcMon:42,
     talk:()=>dialogue(["A GOLBAT flaps through the\nclouds."])},
    {x:3,y:7,dir:'down',kind:'npc',name:'SKY_BIRD3',npcMon:198,
     talk:()=>dialogue(["A MURKROW caws and circles\noverhead."])},
    // Team Aqua grunt blocking the Eon Pokemon near the top-center
    {x:7,y:2,dir:'down',kind:'rocket',name:'AQUA_GRUNT',fixed:true,
     present:()=>!game.flags.aquaEonBeaten,
     talk:()=>{
       dialogue([
         "AQUA GRUNT: Hngh! A kid on a\nMETAGROSS?!",
         "AQUA GRUNT: Doesn't matter. The\nEON POKEMON belong to TEAM\nAQUA now!",
         "AQUA GRUNT: Get 'em off my back\n\u2014 or get sunk!"
       ], ()=>startAquaSkyBattle());
     }},
    // The Eon pair — only appears after the grunt is beaten; talking starts the choice
    {x:7,y:1,dir:'down',kind:'npc',name:'EON_PAIR',npcMon:380,
     present:()=>game.flags.aquaEonBeaten && !game.flags.eonChoiceMade,
     talk:()=>{
       dialogue([
         "The EON POKEMON hover close,\nsafe now.",
         "LATIOS and LATIAS circle you\ngratefully. One of them\nwants to come with you...",
         "STEVEN (radio): They trust you.\nChoose the one to take \u2014\nthe other will guard the\nskies."
       ], ()=>{
         choice("Which EON joins you?",[
           {label:"LATIOS",fn:()=>chooseEon(380)},
           {label:"LATIAS",fn:()=>chooseEon(381)}
         ]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:6,y:9,to:'PETALBURG_TOWN',tx:7,ty:4} ],
  exits:[], encounters:null
};
// ===== BIRCH ROUTE + GYM (Elite 4 lore + infinite LINK CABLE) =====
MAPS.VERDANT_ROUTE={
  name:'VERDANT_ROUTE', grid:VERDANT_ROUTE, interior:false,
  npcs:[
    {x:6,y:3,dir:'down',kind:'npc',name:'BR_T1',
     los:3, losFlag:'br_t1',
     talk:()=>{
       if(game.flags.br_t1){ dialogue(["BLACK BELT: BIRCH TOWN is south.\nThe air down here is thick\nwith ghosts and fighters."]); return; }
       dialogue(["BLACK BELT: This route tests\nthe strong. Face me!"],
         ()=>{ const team=[makeMon(67,48), makeMon(106,49)]; startTrainerFight('BR_T1','BLACK BELT',team,'br_t1'); });
     }},
    {x:9,y:6,dir:'left',kind:'npc',name:'BR_T2',
     los:3, losFlag:'br_t2',
     talk:()=>{
       if(game.flags.br_t2){ dialogue(["HEX MANIAC: The HAUNTER here\nlike you now. How spooky."]); return; }
       dialogue(["HEX MANIAC: Heehee... my ghosts\nwill drag you under!"],
         ()=>{ const team=[makeMon(93,48), makeMon(94,50)]; startTrainerFight('BR_T2','HEX MANIAC',team,'br_t2'); });
     }},
    {x:5,y:8,dir:'up',kind:'npc',name:'BR_T3',
     los:3, losFlag:'br_t3',
     talk:()=>{
       if(game.flags.br_t3){ dialogue(["BUG CATCHER: My SCYTHER came\nfrom this very grass!"]); return; }
       dialogue(["BUG CATCHER: My SCYTHER is\nlightning fast! Try to\nkeep up!"],
         ()=>{ const team=[makeMon(123,49), makeMon(127,50)]; startTrainerFight('BR_T3','BUG CATCHER',team,'br_t3'); });
     }},
    {x:11,y:2,dir:'down',kind:'npc',name:'BR_SIGN_NPC',
     talk:()=>dialogue(["HIKER: Wild HAUNTER, MACHOKE\nand SCYTHER all roam this\ngrass. Rare crew!"])}
  ],
  signs:{ '7:1':"VERDANT ROUTE\nGhosts, fighters and blades\nhide in the tall grass." },
  warps:[],
  exits:[
    {x:7,y:0,to:'PETALBURG_TOWN',tx:7,ty:9},
    {x:7,y:10,to:'BIRCH_TOWN',tx:2,ty:1}
  ],
  encounters:[
    {id:93,min:44,max:48,w:24},   // Haunter
    {id:67,min:44,max:48,w:24},   // Machoke
    {id:123,min:44,max:48,w:22},  // Scyther
    {id:92,min:43,max:46,w:14},   // Gastly (flavor)
    {id:66,min:43,max:46,w:16}    // Machop (flavor)
  ]
};
MAPS.BIRCH_TOWN={
  name:'BIRCH_TOWN', grid:BIRCH_TOWN, interior:false,
  npcs:[
    {x:3,y:8,dir:'down',kind:'npc',name:'BIRCH_TOWNIE',
     talk:()=>dialogue([
       "TOWNIE: PROFESSOR BIRCH set up\nhis lab here, right by the\nGYM. Go say hello!"])}
  ],
  signs:{ '7:1':"BIRCH TOWN\nHome of PROF. BIRCH and the\nfinal GYM before the\nELITE FOUR." },
  warps:[
    {x:7,y:3,to:'BIRCH_GYM',tx:5,ty:8},
    {x:4,y:7,to:'BIRCH_CENTER',tx:4,ty:4},
    {x:10,y:7,to:'BIRCH_LAB',tx:4,ty:5}
  ],
  exits:[ {x:2,y:0,to:'VERDANT_ROUTE',tx:7,ty:9}, {x:14,y:1,to:'STORM_RIDGE',tx:1,ty:1} ],
  encounters:null
};
MAPS.BIRCH_LAB={
  name:'BIRCH_LAB', grid:BIRCH_LAB, interior:true,
  npcs:[
    {x:4,y:4,dir:'down',kind:'oak',name:'BIRCH',fixed:true,
     talk:()=>{
       if(!game.flags.infiniteCable){
         dialogue([
           "PROF. BIRCH: Ah, the trainer\neveryone's talking about!",
           "PROF. BIRCH: You're nearly ready\nfor the ELITE FOUR \u2014 four\nmasters, then the CHAMPION.\nEach one tougher than the\nlast.",
           "PROF. BIRCH: Trade-evolutions can\nturn the tide up there. So\nI made you something special.",
           "PROF. BIRCH: An INFINITE LINK\nCABLE! It never wears out \u2014\nevolve MACHOKE, HAUNTER,\nKADABRA, GRAVELER, as many\ntimes as you like!"
         ], ()=>{
           game.flags.infiniteCable=true;
           if((game.bag.linkcable|0)<1) game.bag.linkcable=1; // ensure it shows even pre-flag-read
           dialogue([
             "You received the\nINFINITE LINK CABLE!",
             "PROF. BIRCH: Now go earn that\nlast badge from our GYM\nLEADER. Then \u2014 the ELITE FOUR\nawait."
           ]);
         });
       } else {
         dialogue([
           "PROF. BIRCH: That CABLE will\nserve you all the way to\nthe CHAMPION. Use it freely!",
           "PROF. BIRCH: The ELITE FOUR\nrespect power AND cleverness.\nBring both."]);
       }
     }},
    {x:7,y:2,dir:'down',kind:'npc',name:'BIRCH_AIDE',
     talk:()=>dialogue(["AIDE: The PROFESSOR's INFINITE\nLINK CABLE is one of a kind.\nDon't lose it... oh wait,\nyou can't!"])}
  ],
  signs:{},
  warps:[ {x:4,y:6,to:'BIRCH_TOWN',tx:10,ty:8} ],
  exits:[], encounters:null
};
MAPS.BIRCH_GYM={
  name:'BIRCH_GYM', grid:BIRCH_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'BIRCH_LEADER',fixed:true,
     talk:()=>{
       if(game.flags.birchGymBeaten){
         dialogue([
           "LEADER ROWAN: One gym left \u2014\nTESLA in AURORA TOWN, east\nover STORM RIDGE. Go prove\nyourself, champion-to-be."]);
       } else {
         dialogue([
           "LEADER ROWAN: So you're BIRCH's\nprodigy. I'm ROWAN. Beat me\nand only one gym will stand\nbetween you and greatness.",
           "LEADER ROWAN: I use no single\ntype \u2014 only my strongest.\nLevels 58 to 64. Show me\nyou're ready!"
         ], ()=>startBirchGymBattle());
       }
     }},
    {x:5,y:6,dir:'down',kind:'npc',name:'BIRCH_APP1',
     los:4, losFlag:'birch_app1',
     talk:()=>{
       if(game.flags.birch_app1){ dialogue(["ACE TRAINER: LEADER ROWAN is\nno joke. Good luck."]); return; }
       dialogue(["ACE TRAINER: Only the worthy\nreach the LEADER. Prove it!"],
         ()=>{ const team=[makeMon(130,56), makeMon(149,57)]; startTrainerFight('BIRCH_APP1','ACE TRAINER',team,'birch_app1'); });
     }}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'BIRCH_TOWN',tx:7,ty:4} ],
  exits:[], encounters:null
};
MAPS.BIRCH_CENTER={
  name:'BIRCH_CENTER', grid:BIRCH_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the BIRCH\nTOWN POKEMON CENTER!"],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! The ELITE\nFOUR are close now."]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'BIRCH_TOWN',tx:4,ty:8} ],
  exits:[], encounters:null
};
// ===== STORM RIDGE + AURORA TOWN (Electric gym) =====
MAPS.STORM_RIDGE={
  name:'STORM_RIDGE', grid:STORM_RIDGE, interior:false,
  npcs:[
    {x:6,y:2,dir:'down',kind:'npc',name:'SR_T1',
     los:3, losFlag:'sr_t1',
     talk:()=>{
       if(game.flags.sr_t1){ dialogue(["HIKER: AURORA TOWN is east.\nThe air up here crackles\nwith static!"]); return; }
       dialogue(["HIKER: This ridge is alive\nwith storms! Face me!"],
         ()=>{ const team=[makeMon(82,58), makeMon(100,58)]; startTrainerFight('SR_T1','HIKER',team,'sr_t1'); });
     }},
    {x:9,y:5,dir:'left',kind:'npc',name:'SR_T2',
     los:3, losFlag:'sr_t2',
     talk:()=>{
       if(game.flags.sr_t2){ dialogue(["BIRD KEEPER: Lightning and\nwings rule this ridge!"]); return; }
       dialogue(["BIRD KEEPER: My fliers ride\nthe storm winds! Battle!"],
         ()=>{ const team=[makeMon(22,58), makeMon(142,60)]; startTrainerFight('SR_T2','BIRD KEEPER',team,'sr_t2'); });
     }},
    {x:5,y:8,dir:'up',kind:'npc',name:'SR_T3',
     los:3, losFlag:'sr_t3',
     talk:()=>{
       if(game.flags.sr_t3){ dialogue(["ACE TRAINER: The AURORA GYM\nLEADER channels the storm\nitself. Be ready."]); return; }
       dialogue(["ACE TRAINER: Only the charged\npass this ridge! Show me\nyour spark!"],
         ()=>{ const team=[makeMon(125,59), makeMon(135,60), makeMon(59,61)]; startTrainerFight('SR_T3','ACE TRAINER',team,'sr_t3'); });
     }},
    {x:11,y:2,dir:'down',kind:'npc',name:'SR_SIGN_NPC',
     talk:()=>dialogue(["RANGER: STORM RIDGE is thick\nwith ELECTRIC and FLYING\nPOKEMON. AURORA TOWN lies\neast."])}
  ],
  signs:{ '1:1':"STORM RIDGE\nThunder rolls across the\ncliffs. AURORA TOWN: east." },
  warps:[],
  exits:[
    {x:0,y:1,to:'BIRCH_TOWN',tx:13,ty:1},
    {x:14,y:9,to:'AURORA_TOWN',tx:1,ty:1}
  ],
  encounters:[
    {id:25,min:54,max:58,w:18},   // Pikachu
    {id:82,min:54,max:58,w:18},   // Magneton
    {id:100,min:54,max:58,w:16},  // Voltorb
    {id:21,min:54,max:58,w:16},   // Spearow
    {id:125,min:55,max:59,w:12},  // Electabuzz
    {id:142,min:55,max:60,w:10}   // Aerodactyl
  ]
};
MAPS.AURORA_TOWN={
  name:'AURORA_TOWN', grid:AURORA_TOWN, interior:false,
  npcs:[
    {x:8,y:6,dir:'down',kind:'npc',name:'AURORA_TOWNIE',
     talk:()=>dialogue([
       "TOWNIE: AURORA TOWN's GYM\nLEADER, TESLA, hasn't lost\nin years.",
       "TOWNIE: Beat her and... well,\nthey say something big is\nstirring beyond town."])}
  ],
  signs:{ '1:1':"AURORA TOWN\nWhere the storm gathers.\nGYM LEADER: TESLA." },
  warps:[
    {x:6,y:4,to:'AURORA_GYM',tx:5,ty:8},
    {x:4,y:7,to:'AURORA_CENTER',tx:4,ty:4}
  ],
  exits:[ {x:0,y:1,to:'STORM_RIDGE',tx:13,ty:9}, {x:14,y:9,to:'CELESTIAL_PATH',tx:1,ty:1} ],
  encounters:null
};
MAPS.AURORA_GYM={
  name:'AURORA_GYM', grid:AURORA_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'TESLA',fixed:true,
     talk:()=>{
       if(game.flags.auroraGymBeaten){
         dialogue([
           "LEADER TESLA: You fight like a\nstorm given form. Whatever\ncomes next \u2014 you're ready\nfor it."]);
       } else {
         dialogue([
           "LEADER TESLA: So you climbed my\nridge. I'm TESLA \u2014 I command\nthe STORM itself.",
           "LEADER TESLA: ELECTRIC and the\nfury of the skies. Levels\n60 to 66. Don't blink!"
         ], ()=>startAuroraGymBattle());
       }
     }},
    {x:5,y:6,dir:'down',kind:'npc',name:'AURORA_APP1',
     los:4, losFlag:'aurora_app1',
     talk:()=>{
       if(game.flags.aurora_app1){ dialogue(["GUITARIST: TESLA's power is\nunreal. Good luck up there."]); return; }
       dialogue(["GUITARIST: You want TESLA? Get\npast my amps first!"],
         ()=>{ const team=[makeMon(135,58), makeMon(125,59)]; startTrainerFight('AURORA_APP1','GUITARIST',team,'aurora_app1'); });
     }}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'AURORA_TOWN',tx:6,ty:5} ],
  exits:[], encounters:null
};
MAPS.AURORA_CENTER={
  name:'AURORA_CENTER', grid:AURORA_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the AURORA\nTOWN POKEMON CENTER!"],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! Stay safe\nout there."]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'AURORA_TOWN',tx:4,ty:8} ],
  exits:[], encounters:null
};
// ===== CELESTIAL PATH + ZENITH CITY (final gym; FLY granted on arrival) =====
MAPS.CELESTIAL_PATH={
  name:'CELESTIAL_PATH', grid:CELESTIAL_PATH, interior:false,
  npcs:[
    // FLY-granting elder near the entrance. The setMap arrival trigger handles
    // the auto-cutscene; this NPC lets the player re-learn FLY or learn it if
    // they had no eligible lead the first time.
    {x:3,y:2,dir:'down',kind:'oak',name:'SKY_ELDER',fixed:true,
     talk:()=>{
       if(game.party.some(m=>m&&m.fly)){
         dialogue(["SKY ELDER: The winds know your\nname now. MENU -> FLY to\nsoar anywhere you've been."]);
       } else {
         dialogue([
           "SKY ELDER: Traveler! Only those\nwho can ride the sky may\nreach ZENITH CITY's heart.",
           "SKY ELDER: Let me grant your\nlead POKEMON the secret of\nFLY."
         ], ()=>teachFly());
       }
     }},
    {x:6,y:5,dir:'down',kind:'npc',name:'CP_T1',
     los:3, losFlag:'cp_t1',
     talk:()=>{
       if(game.flags.cp_t1){ dialogue(["COOLTRAINER: ZENITH CITY is\njust east. The LEADER there\nis on another level."]); return; }
       dialogue(["COOLTRAINER: This is the road\nto the strongest gym. Prove\nyou belong!"],
         ()=>{ const team=[makeMon(149,62), makeMon(248,63)]; startTrainerFight('CP_T1','COOLTRAINER',team,'cp_t1'); });
     }},
    {x:9,y:7,dir:'left',kind:'npc',name:'CP_T2',
     los:3, losFlag:'cp_t2',
     talk:()=>{
       if(game.flags.cp_t2){ dialogue(["DRAGON TAMER: Few make it past\nthe CELESTIAL PATH. You\nmight be one."]); return; }
       dialogue(["DRAGON TAMER: My dragons guard\nthis path! Face them!"],
         ()=>{ const team=[makeMon(148,62), makeMon(149,64)]; startTrainerFight('CP_T2','DRAGON TAMER',team,'cp_t2'); });
     }},
    {x:5,y:8,dir:'up',kind:'npc',name:'CP_T3',
     los:3, losFlag:'cp_t3',
     talk:()=>{
       if(game.flags.cp_t3){ dialogue(["VETERAN: LEADER ASTRA awaits.\nGive her everything."]); return; }
       dialogue(["VETERAN: Last test before the\ncity gate. Don't hold back!"],
         ()=>{ const team=[makeMon(212,63), makeMon(94,64), makeMon(143,65)]; startTrainerFight('CP_T3','VETERAN',team,'cp_t3'); });
     }}
  ],
  signs:{ '1:1':"CELESTIAL PATH\nThe sky road to ZENITH CITY\nand its master." },
  warps:[],
  exits:[
    {x:0,y:1,to:'AURORA_TOWN',tx:13,ty:9},
    {x:14,y:9,to:'ZENITH_CITY',tx:1,ty:1}
  ],
  encounters:[
    {id:142,min:60,max:64,w:16},  // Aerodactyl
    {id:148,min:60,max:64,w:14},  // Dragonair
    {id:82,min:60,max:64,w:16},   // Magneton
    {id:42,min:60,max:64,w:16},   // Golbat
    {id:22,min:60,max:64,w:16},   // Fearow
    {id:149,min:62,max:65,w:8}    // Dragonite (rare)
  ]
};
MAPS.ZENITH_CITY={
  name:'ZENITH_CITY', grid:ZENITH_CITY, interior:false,
  npcs:[
    {x:10,y:5,dir:'down',kind:'oak',name:'METAGROSS_ZENITH',fixed:true,
     present:()=>game.flags.mirageIslandUnlocked && !game.flags.mirageFinale,
     talk:()=>{
       dialogue([
         "METAGROSS floats close,\neyes gleaming silver.",
         "STEVEN: Climb on. MIRAGE\nISLAND won't stay\nvisible long."
       ], ()=>{
         game.flags.skyForm=true;
         setMap('MIRAGE_ISLAND',7,4,'down');
         game.flags.skyForm=false;
       });
     }},
    {x:12,y:5,dir:'down',kind:'oak',name:'ZENITH_RESEARCHER',
     talk:()=>{
       if(game.flags.mirageFinale){
         dialogue(["RESEARCHER: MIRAGE ISLAND\nstays visible now. You\nearned it."]);
       } else if(game.flags.mirageIslandUnlocked){
         dialogue(["RESEARCHER: METAGROSS is\nnorth of the GYM.\nMIRAGE ISLAND awaits."]);
       } else if(game.flags.rayquazaBeaten){
         dialogue([
           "RESEARCHER: Wait — you've\nalready faced RAYQUAZA?\nThen you need to hear this.",
           "RESEARCHER: MIRAGE ISLAND\nappeared on radar right\nafter your battle.",
           "RESEARCHER: METAGROSS is\nwaiting north of the GYM.\nIt'll take you there.",
           "MIRAGE ISLAND unlocked!"
         ], ()=>{ game.flags.mirageIslandUnlocked=true; Audio.heal(); });
       } else {
         dialogue(["RESEARCHER: I track rare\nlegendary sightings.\nNothing unusual yet..."]);
       }
     }},
    {x:8,y:6,dir:'down',kind:'npc',name:'ZENITH_TOWNIE',
     talk:()=>dialogue([
       "TOWNIE: ZENITH CITY sits at the\nregion's peak. Our LEADER,\nASTRA, has never been beaten.",
       "TOWNIE: They say once she falls,\nthe whole region changes\nforever..."])}
  ],
  signs:{ '1:1':"ZENITH CITY\nThe summit of the region.\nGYM LEADER: ASTRA." },
  warps:[
    {x:6,y:4,to:'ZENITH_GYM',tx:5,ty:8},
    {x:5,y:7,to:'ZENITH_CENTER',tx:4,ty:4}
  ],
  exits:[ {x:0,y:1,to:'CELESTIAL_PATH',tx:13,ty:9} ],
  encounters:null
};
MAPS.ZENITH_GYM={
  name:'ZENITH_GYM', grid:ZENITH_GYM, interior:true,
  npcs:[
    {x:5,y:2,dir:'down',kind:'npc',name:'ASTRA',fixed:true,
     talk:()=>{
       if(game.flags.zenithGymBeaten){
         dialogue([
           "LEADER ASTRA: You stand at the\nsummit now. Whatever comes\nnext... the region is lucky\nto have you."]);
       } else {
         dialogue([
           "LEADER ASTRA: So you climbed all\nthe way to me. I'm ASTRA \u2014\nthe final GYM LEADER of\nthe region.",
           "LEADER ASTRA: No one has taken my\nbadge. My team runs Levels\n66 to 72 \u2014 my very best.",
           "LEADER ASTRA: Show me the bond\nyou've built. Begin!"
         ], ()=>startZenithGymBattle());
       }
     }},
    {x:5,y:6,dir:'down',kind:'npc',name:'ZENITH_APP1',
     los:4, losFlag:'zenith_app1',
     talk:()=>{
       if(game.flags.zenith_app1){ dialogue(["ELITE AIDE: LEADER ASTRA is\nbeyond anyone I've seen.\nGood luck."]); return; }
       dialogue(["ELITE AIDE: None reach ASTRA\nwithout passing me first!"],
         ()=>{ const team=[makeMon(376,64), makeMon(248,65)]; startTrainerFight('ZENITH_APP1','ELITE AIDE',team,'zenith_app1'); });
     }}
  ],
  signs:{},
  warps:[ {x:5,y:8,to:'ZENITH_CITY',tx:6,ty:5} ],
  exits:[], encounters:null
};
MAPS.ZENITH_CENTER={
  name:'ZENITH_CENTER', grid:ZENITH_CENTER, interior:true,
  npcs:[
    {x:4,y:1,dir:'down',kind:'nurse',name:'NURSE',
     talk:()=>{
       if(game.party.length===0){ dialogue(["NURSE: Come back with a\nPOKEMON to heal!"]); return; }
       dialogue(["NURSE: Welcome to the ZENITH\nCITY POKEMON CENTER \u2014 the\nhighest in the region!"],()=>{
         healParty(); Audio.heal();
         dialogue(["NURSE: All healed! The summit\nawaits."]);
       });
     }}
  ],
  signs:{},
  warps:[ {x:4,y:5,to:'ZENITH_CITY',tx:5,ty:8} ],
  exits:[], encounters:null
};
// Climax Part 1 — MT. CHIMNEY summit. Locked-flow: no warps out until GROUDON falls.
MAPS.MAGMA_VOLCANO={
  name:'MAGMA_VOLCANO', grid:MAGMA_VOLCANO, interior:false,
  npcs:[
    // MAXIE — boss at the summit. Spotted when player approaches.
    {x:6,y:2,dir:'down',kind:'rocket',name:'MAXIE',fixed:true,
     present:()=>!game.flags.maxieBeaten,
     talk:()=>{
       dialogue([
         "MAXIE: So. The child champion\narrives. I wondered if you\nwould.",
         "MAXIE: Look around. The OLD\nMOUNTAIN has woken. The\nRITUAL is nearly complete.",
         "MAXIE: When GROUDON rises, it\nwill burn the seas dry. The\ncontinent will EXPAND. A new\nworld, made of land.",
         "MAXIE: STEVEN's region of soft\ntrainers and softer leaders\nends tonight.",
         "MAXIE: But first \u2014 I will deal\nwith you. PERSONALLY."
       ], ()=>startMaxieClimaxBattle());
     }},
    // Magma Grunt 3 — closest to summit, hardest.
    {x:6,y:6,dir:'down',kind:'rocket',name:'MG_T3',
     los:5, losFlag:'mg_t3',
     present:()=>!game.flags.mg_t3 && !game.flags.maxieBeaten,
     talk:()=>{
       if(game.flags.mg_t3){ dialogue(["MAGMA GRUNT: ...heh. MAXIE\nwill end you anyway."]); return; }
       dialogue(["MAGMA GRUNT: You shouldn't\nhave climbed this far!"],
         ()=>startTrainerFight('MG_T3','MAGMA GRUNT',
           [makeMon(229,68), makeMon(219,69)], 'mg_t3'));
     }},
    // Magma Grunt 2 — mid-slope.
    {x:6,y:9,dir:'down',kind:'rocket',name:'MG_T2',
     los:5, losFlag:'mg_t2',
     present:()=>!game.flags.mg_t2 && !game.flags.maxieBeaten,
     talk:()=>{
       if(game.flags.mg_t2){ dialogue(["MAGMA GRUNT: ...keep going.\nThe boss is waiting."]); return; }
       dialogue(["MAGMA GRUNT: Turn back, kid \u2014\nthis mountain isn't yours!"],
         ()=>startTrainerFight('MG_T2','MAGMA GRUNT',
           [makeMon(262,66), makeMon(228,67), makeMon(58,68)], 'mg_t2'));
     }},
    // Magma Grunt 1 — first grunt, lowest level.
    {x:6,y:12,dir:'down',kind:'rocket',name:'MG_T1',
     los:5, losFlag:'mg_t1',
     present:()=>!game.flags.mg_t1 && !game.flags.maxieBeaten,
     talk:()=>{
       if(game.flags.mg_t1){ dialogue(["MAGMA GRUNT: Go ahead. You'll\nnever make it to MAXIE."]); return; }
       dialogue(["MAGMA GRUNT: Hey! No one climbs\nthe sacred mountain!"],
         ()=>startTrainerFight('MG_T1','MAGMA GRUNT',
           [makeMon(218,64), makeMon(58,66)], 'mg_t1'));
     }}
  ],
  signs:{ '6:13':"MT. CHIMNEY SUMMIT\nThe earth's heart, exposed.\nLava sings here." },
  warps:[], exits:[], encounters:null
};
// ===== CLIMAX PART 2: OCEAN_ROUTE + UNDERWATER =====
MAPS.OCEAN_ROUTE={
  name:'OCEAN_ROUTE', grid:OCEAN_ROUTE, interior:false,
  npcs:[],
  signs:{ '7:1':"OPEN SEA SOUTH OF LITTLEROOT\nDeep currents below.\nSomething massive stirs." },
  warps:[ {x:7,y:7,to:'UNDERWATER',tx:6,ty:12} ],   // dive spot
  exits:[ {x:7,y:0,to:'TOWN',tx:7,ty:11} ],          // back to LITTLEROOT
  encounters:[
    {id:72,min:30,max:35,w:40},   // Tentacool
    {id:60,min:30,max:35,w:30},   // Poliwag (water)
    {id:129,min:25,max:30,w:30}   // Magikarp
  ]
};
MAPS.UNDERWATER={
  name:'UNDERWATER', grid:UNDERWATER, interior:true,
  npcs:[
    // ARCHIE — boss at the back of the cavern.
    {x:6,y:2,dir:'down',kind:'rocket',name:'ARCHIE',fixed:true,
     present:()=>!game.flags.archieBeaten,
     talk:()=>{
       dialogue([
         "ARCHIE: Hah. The kid who\nbroke MAXIE shows up here\ntoo.",
         "ARCHIE: You're persistent.\nI'll give you that.",
         "ARCHIE: But MAGMA wanted to\nburn the seas. We're going\nto FLOOD the land. Drown\nthe cities. Heal the world.",
         "ARCHIE: KYOGRE will surface,\nand the oceans will TAKE\nback what's theirs.",
         "ARCHIE: I'll deal with you\nmyself \u2014 just like MAXIE\ntried, and failed."
       ], ()=>startArchieBattle());
     }},
    // Aqua Grunt 3 — closest to Archie.
    {x:6,y:6,dir:'down',kind:'rocket',name:'AQ_T3',
     los:5, losFlag:'aqua_t3',
     present:()=>!game.flags.aqua_t3 && !game.flags.archieBeaten,
     talk:()=>{
       if(game.flags.aqua_t3){ dialogue(["AQUA GRUNT: ...go on. ARCHIE\nwill finish you."]); return; }
       dialogue(["AQUA GRUNT: You won't reach\nthe BOSS!"],
         ()=>startTrainerFight('AQ_T3','AQUA GRUNT',
           [makeMon(130,68), makeMon(131,70)], 'aqua_t3'));
     }},
    // Aqua Grunt 2 — mid.
    {x:6,y:9,dir:'down',kind:'rocket',name:'AQ_T2',
     los:5, losFlag:'aqua_t2',
     present:()=>!game.flags.aqua_t2 && !game.flags.archieBeaten,
     talk:()=>{
       if(game.flags.aqua_t2){ dialogue(["AQUA GRUNT: ...keep going.\nThe BOSS waits."]); return; }
       dialogue(["AQUA GRUNT: The sea swallows\nintruders!"],
         ()=>startTrainerFight('AQ_T2','AQUA GRUNT',
           [makeMon(73,66), makeMon(91,68)], 'aqua_t2'));
     }},
    // Aqua Grunt 1 — first.
    {x:6,y:11,dir:'down',kind:'rocket',name:'AQ_T1',
     los:5, losFlag:'aqua_t1',
     present:()=>!game.flags.aqua_t1 && !game.flags.archieBeaten,
     talk:()=>{
       if(game.flags.aqua_t1){ dialogue(["AQUA GRUNT: Go on. You'll\nnever reach ARCHIE."]); return; }
       dialogue(["AQUA GRUNT: A surfacer! How'd\nyou even get DOWN here?!"],
         ()=>startTrainerFight('AQ_T1','AQUA GRUNT',
           [makeMon(72,64), makeMon(8,66)], 'aqua_t1'));
     }}
  ],
  signs:{ '6:12':"SEAFLOOR CAVERN\nThe deep ARCHIE found.\n(Walk south to surface.)" },
  warps:[ {x:6,y:13,to:'OCEAN_ROUTE',tx:7,ty:8} ],   // surface back up
  exits:[], encounters:null
};
// Climax Part 3 — quiet sky island. No grunts, no encounters. Just a place to meet a dragon.
MAPS.SKY_ISLAND={
  name:'SKY_ISLAND', grid:SKY_ISLAND, interior:false,
  npcs:[],
  signs:{ '7:7':"SKY PILLAR PLATEAU\nThe wind tastes like ozone.\nA dragon's resting place." },
  warps:[], exits:[], encounters:null
};


export const MIRAGE_ISLAND_GRID=[
 "TTTTTTTTTTTTTTT",
 "T,,,,.....,,,,T",
 "T,,,,..O..,,,,T",
 "T,,,,.....,,,,T",
 "T.............T",
 "T.............T",
 "T.............T",
 "T.............T",
 "T.............T",
 "TTTTTTTPTTTTTTT"
];
MAPS.MIRAGE_ISLAND={
  name:'MIRAGE_ISLAND', grid:MIRAGE_ISLAND_GRID, interior:false,
  npcs:[
    {x:7,y:2,dir:'down',kind:'oak',name:'STEVEN_MIRAGE',fixed:true,
     talk:()=>{
       if(game.flags.mirageFinale){
         dialogue(["STEVEN: Both of them sleep\nbelow now. Hoenn is whole.",
                   "STEVEN: You gave them peace."]);
       } else {
         dialogue(["STEVEN: Walk to the south\nshore. They'll sense you."]);
       }
     }}
  ],
  signs:{ '7:8':"MIRAGE ISLAND\nAppears only for those\nthe legendaries accept." },
  warps:[],
  exits:[ {x:7,y:9,to:'ZENITH_CITY',tx:6,ty:5} ],
  encounters:[]
};

(MAPS as Record<string, unknown>).TRADE_ROUTE_QUEST_ANCHOR=null;
delete (MAPS as Record<string, unknown>).TRADE_ROUTE_QUEST_ANCHOR;


/* ---------------------------------------------------------------------------
   7. GAME STATE
--------------------------------------------------------------------------- */
