/* eslint-disable */
import type { Mon, Move } from '../types';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: dex

export const DEX: Array<[string, string, string | null, number, number, number, number, number]> = [
 ["Bulbasaur","Grass","Poison",45,49,49,65,45],
 ["Ivysaur","Grass","Poison",60,62,63,80,60],
 ["Venusaur","Grass","Poison",80,82,83,100,80],
 ["Charmander","Fire",null,39,52,43,50,65],
 ["Charmeleon","Fire",null,58,64,58,65,80],
 ["Charizard","Fire","Flying",78,84,78,85,100],
 ["Squirtle","Water",null,44,48,65,50,43],
 ["Wartortle","Water",null,59,63,80,65,58],
 ["Blastoise","Water",null,79,83,100,85,78],
 ["Caterpie","Bug",null,45,30,35,20,45],
 ["Metapod","Bug",null,50,20,55,25,30],
 ["Butterfree","Bug","Flying",60,45,50,80,70],
 ["Weedle","Bug","Poison",40,35,30,20,50],
 ["Kakuna","Bug","Poison",45,25,50,25,35],
 ["Beedrill","Bug","Poison",65,80,40,45,75],
 ["Pidgey","Normal","Flying",40,45,40,35,56],
 ["Pidgeotto","Normal","Flying",63,60,55,50,71],
 ["Pidgeot","Normal","Flying",83,80,75,70,91],
 ["Rattata","Normal",null,30,56,35,25,72],
 ["Raticate","Normal",null,55,81,60,50,97],
 ["Spearow","Normal","Flying",40,60,30,31,70],
 ["Fearow","Normal","Flying",65,90,65,61,100],
 ["Ekans","Poison",null,35,60,44,40,55],
 ["Arbok","Poison",null,60,85,69,65,80],
 ["Pikachu","Electric",null,35,55,30,50,90],
 ["Raichu","Electric",null,60,90,55,90,100],
 ["Sandshrew","Ground",null,50,75,85,30,40],
 ["Sandslash","Ground",null,75,100,110,55,65],
 ["Nidoran F","Poison",null,55,47,52,40,41],
 ["Nidorina","Poison",null,70,62,67,55,56],
 ["Nidoqueen","Poison","Ground",90,82,87,75,76],
 ["Nidoran M","Poison",null,46,57,40,40,50],
 ["Nidorino","Poison",null,61,72,57,55,65],
 ["Nidoking","Poison","Ground",81,92,77,85,85],
 ["Clefairy","Normal",null,70,45,48,60,35],
 ["Clefable","Normal",null,95,70,73,85,60],
 ["Vulpix","Fire",null,38,41,40,65,65],
 ["Ninetales","Fire",null,73,76,75,100,100],
 ["Jigglypuff","Normal",null,115,45,20,25,20],
 ["Wigglytuff","Normal",null,140,70,45,50,45],
 ["Zubat","Poison","Flying",40,45,35,40,55],
 ["Golbat","Poison","Flying",75,80,70,75,90],
 ["Oddish","Grass","Poison",45,50,55,75,30],
 ["Gloom","Grass","Poison",60,65,70,85,40],
 ["Vileplume","Grass","Poison",75,80,85,100,50],
 ["Paras","Bug","Grass",35,70,55,55,25],
 ["Parasect","Bug","Grass",60,95,80,60,30],
 ["Venonat","Bug","Poison",60,55,50,40,45],
 ["Venomoth","Bug","Poison",70,65,60,90,90],
 ["Diglett","Ground",null,10,55,25,45,95],
 ["Dugtrio","Ground",null,35,80,50,70,120],
 ["Meowth","Normal",null,40,45,35,40,90],
 ["Persian","Normal",null,65,70,60,65,115],
 ["Psyduck","Water",null,50,52,48,65,55],
 ["Golduck","Water",null,80,82,78,95,85],
 ["Mankey","Fighting",null,40,80,35,35,70],
 ["Primeape","Fighting",null,65,105,60,60,95],
 ["Growlithe","Fire",null,55,70,45,50,60],
 ["Arcanine","Fire",null,90,110,80,80,95],
 ["Poliwag","Water",null,40,50,40,40,90],
 ["Poliwhirl","Water",null,65,65,65,50,90],
 ["Poliwrath","Water","Fighting",90,85,95,70,70],
 ["Abra","Psychic",null,25,20,15,105,90],
 ["Kadabra","Psychic",null,40,35,30,120,105],
 ["Alakazam","Psychic",null,55,50,45,135,120],
 ["Machop","Fighting",null,70,80,50,35,35],
 ["Machoke","Fighting",null,80,100,70,50,45],
 ["Machamp","Fighting",null,90,130,80,65,55],
 ["Bellsprout","Grass","Poison",50,75,35,70,40],
 ["Weepinbell","Grass","Poison",65,90,50,85,55],
 ["Victreebel","Grass","Poison",80,105,65,100,70],
 ["Tentacool","Water","Poison",40,40,35,100,70],
 ["Tentacruel","Water","Poison",80,70,65,120,100],
 ["Geodude","Rock","Ground",40,80,100,30,20],
 ["Graveler","Rock","Ground",55,95,115,45,35],
 ["Golem","Rock","Ground",80,110,130,55,45],
 ["Ponyta","Fire",null,50,85,55,65,90],
 ["Rapidash","Fire",null,65,100,70,80,105],
 ["Slowpoke","Water","Psychic",90,65,65,40,15],
 ["Slowbro","Water","Psychic",95,75,110,80,30],
 ["Magnemite","Electric",null,25,35,70,95,45],
 ["Magneton","Electric",null,50,60,95,120,70],
 ["Farfetch'd","Normal","Flying",52,65,55,58,60],
 ["Doduo","Normal","Flying",35,85,45,35,75],
 ["Dodrio","Normal","Flying",60,110,70,60,100],
 ["Seel","Water",null,65,45,55,70,45],
 ["Dewgong","Water","Ice",90,70,80,95,70],
 ["Grimer","Poison",null,80,80,50,40,25],
 ["Muk","Poison",null,105,105,75,65,50],
 ["Shellder","Water",null,30,65,100,45,40],
 ["Cloyster","Water","Ice",50,95,180,85,70],
 ["Gastly","Ghost","Poison",30,35,30,100,80],
 ["Haunter","Ghost","Poison",45,50,45,115,95],
 ["Gengar","Ghost","Poison",60,65,60,130,110],
 ["Onix","Rock","Ground",35,45,160,30,70],
 ["Drowzee","Psychic",null,60,48,45,90,42],
 ["Hypno","Psychic",null,85,73,70,115,67],
 ["Krabby","Water",null,30,105,90,25,50],
 ["Kingler","Water",null,55,130,115,50,75],
 ["Voltorb","Electric",null,40,30,50,55,100],
 ["Electrode","Electric",null,60,50,70,80,140],
 ["Exeggcute","Grass","Psychic",60,40,80,60,40],
 ["Exeggutor","Grass","Psychic",95,95,85,125,55],
 ["Cubone","Ground",null,50,50,95,40,35],
 ["Marowak","Ground",null,60,80,110,50,45],
 ["Hitmonlee","Fighting",null,50,120,53,35,87],
 ["Hitmonchan","Fighting",null,50,105,79,35,76],
 ["Lickitung","Normal",null,90,55,75,60,30],
 ["Koffing","Poison",null,40,65,95,60,35],
 ["Weezing","Poison",null,65,90,120,85,60],
 ["Rhyhorn","Ground","Rock",80,85,95,30,25],
 ["Rhydon","Ground","Rock",105,130,120,45,40],
 ["Chansey","Normal",null,250,5,5,105,50],
 ["Tangela","Grass",null,65,55,115,100,60],
 ["Kangaskhan","Normal",null,105,95,80,40,90],
 ["Horsea","Water",null,30,40,70,70,60],
 ["Seadra","Water",null,55,65,95,95,85],
 ["Goldeen","Water",null,45,67,60,50,63],
 ["Seaking","Water",null,80,92,65,80,68],
 ["Staryu","Water",null,30,45,55,70,85],
 ["Starmie","Water","Psychic",60,75,85,100,115],
 ["Mr. Mime","Psychic",null,40,45,65,100,90],
 ["Scyther","Bug","Flying",70,110,80,55,105],
 ["Jynx","Ice","Psychic",65,50,35,95,95],
 ["Electabuzz","Electric",null,65,83,57,85,105],
 ["Magmar","Fire",null,65,95,57,85,93],
 ["Pinsir","Bug",null,65,125,100,55,85],
 ["Tauros","Normal",null,75,100,95,70,110],
 ["Magikarp","Water",null,20,10,55,20,80],
 ["Gyarados","Water","Flying",95,125,79,100,81],
 ["Lapras","Water","Ice",130,85,80,95,60],
 ["Ditto","Normal",null,48,48,48,48,48],
 ["Eevee","Normal",null,55,55,50,65,55],
 ["Vaporeon","Water",null,130,65,60,110,65],
 ["Jolteon","Electric",null,65,65,60,110,130],
 ["Flareon","Fire",null,65,130,60,110,65],
 ["Porygon","Normal",null,65,60,70,75,40],
 ["Omanyte","Rock","Water",35,40,100,90,35],
 ["Omastar","Rock","Water",70,60,125,115,55],
 ["Kabuto","Rock","Water",30,80,90,45,55],
 ["Kabutops","Rock","Water",60,115,105,70,80],
 ["Aerodactyl","Rock","Flying",80,105,65,60,130],
 ["Snorlax","Normal",null,160,110,65,65,30],
 ["Articuno","Ice","Flying",90,85,100,125,85],
 ["Zapdos","Electric","Flying",90,90,85,125,100],
 ["Moltres","Fire","Flying",90,100,90,125,90],
 ["Dratini","Dragon",null,41,64,45,50,50],
 ["Dragonair","Dragon",null,61,84,65,70,70],
 ["Dragonite","Dragon","Flying",91,134,95,100,80],
 ["Mewtwo","Psychic",null,106,110,90,154,130],
 ["Mew","Psychic",null,100,100,100,100,100],
 ["Chikorita","Grass",null,45,49,65,49,45],
 ["Bayleef","Grass",null,60,62,80,63,60],
 ["Meganium","Grass",null,80,82,100,83,80],
 ["Cyndaquil","Fire",null,39,52,43,60,65],
 ["Quilava","Fire",null,58,64,58,80,80],
 ["Typhlosion","Fire",null,78,84,78,109,100],
 ["Totodile","Water",null,50,65,64,44,43],
 ["Croconaw","Water",null,65,80,80,59,58],
 ["Feraligatr","Water",null,85,105,100,79,78],
 ["Sentret","Normal",null,35,46,34,35,20],
 ["Furret","Normal",null,85,76,64,45,90],
 ["Hoothoot","Normal","Flying",60,30,30,36,50],
 ["Noctowl","Normal","Flying",100,50,50,86,70],
 ["Ledyba","Bug","Flying",40,20,30,38,55],
 ["Ledian","Bug","Flying",55,35,50,75,85],
 ["Spinarak","Bug","Poison",40,60,40,40,30],
 ["Ariados","Bug","Poison",70,90,70,60,40],
 ["Crobat","Poison","Flying",85,90,80,75,130],
 ["Chinchou","Water","Electric",75,38,38,56,67],
 ["Lanturn","Water","Electric",125,58,58,76,67],
 ["Pichu","Electric",null,20,40,15,35,60],
 ["Cleffa","Normal",null,50,25,28,40,15],
 ["Igglybuff","Normal",null,90,30,15,40,15],
 ["Togepi","Normal",null,35,20,65,50,20],
 ["Togetic","Normal","Flying",55,40,85,80,40],
 ["Natu","Psychic","Flying",40,50,45,70,70],
 ["Xatu","Psychic","Flying",65,75,70,95,95],
 ["Mareep","Electric",null,55,40,40,50,35],
 ["Flaaffy","Electric",null,70,55,55,65,45],
 ["Ampharos","Electric",null,90,75,85,90,55],
 ["Bellossom","Grass",null,75,80,95,90,50],
 ["Marill","Water",null,70,20,50,30,40],
 ["Azumarill","Water",null,100,50,80,60,50],
 ["Sudowoodo","Rock",null,70,100,115,40,30],
 ["Politoed","Water",null,90,75,75,90,70],
 ["Hoppip","Grass","Flying",35,35,40,45,50],
 ["Skiploom","Grass","Flying",55,45,50,55,80],
 ["Jumpluff","Grass","Flying",75,55,70,85,110],
 ["Aipom","Normal",null,55,70,55,45,85],
 ["Sunkern","Grass",null,30,30,30,30,30],
 ["Sunflora","Grass",null,75,75,55,95,30],
 ["Yanma","Bug","Flying",65,65,45,75,95],
 ["Wooper","Water","Ground",55,45,45,25,15],
 ["Quagsire","Water","Ground",95,85,85,65,35],
 ["Espeon","Psychic",null,65,65,60,110,110],
 ["Umbreon","Dark",null,95,65,110,90,65],
 ["Murkrow","Dark","Flying",60,85,42,85,91],
 ["Slowking","Water","Psychic",95,75,80,100,30],
 ["Misdreavus","Ghost",null,60,60,60,85,85],
 ["Unown","Psychic",null,48,72,48,72,48],
 ["Wobbuffet","Psychic",null,190,33,58,58,33],
 ["Girafarig","Normal","Psychic",70,80,65,90,85],
 ["Pineco","Bug",null,50,65,90,35,15],
 ["Forretress","Bug","Steel",75,90,140,60,40],
 ["Dunsparce","Normal",null,100,70,70,65,45],
 ["Gligar","Ground","Flying",65,75,105,45,85],
 ["Steelix","Steel","Ground",75,85,200,55,30],
 ["Snubbull","Normal",null,60,80,50,40,30],
 ["Granbull","Normal",null,90,120,75,60,45],
 ["Qwilfish","Water","Poison",65,95,75,55,85],
 ["Scizor","Bug","Steel",70,130,100,65,65],
 ["Shuckle","Bug","Rock",20,10,230,10,5],
 ["Heracross","Bug","Fighting",80,125,75,40,85],
 ["Sneasel","Dark","Ice",55,95,55,45,115],
 ["Teddiursa","Normal",null,60,80,50,50,40],
 ["Ursaring","Normal",null,90,130,75,75,55],
 ["Slugma","Fire",null,40,40,40,70,20],
 ["Magcargo","Fire","Rock",50,50,120,80,30],
 ["Swinub","Ice","Ground",50,50,40,30,50],
 ["Piloswine","Ice","Ground",100,100,80,60,50],
 ["Corsola","Water","Rock",55,55,85,65,35],
 ["Remoraid","Water",null,35,65,35,65,65],
 ["Octillery","Water",null,75,105,75,85,45],
 ["Delibird","Ice","Flying",45,55,45,65,75],
 ["Mantine","Water","Flying",65,40,70,80,70],
 ["Skarmory","Steel","Flying",65,80,140,40,70],
 ["Houndour","Dark","Fire",45,60,30,70,65],
 ["Houndoom","Dark","Fire",75,90,50,90,95],
 ["Kingdra","Water","Dragon",75,95,95,95,85],
 ["Phanpy","Ground",null,90,60,60,40,40],
 ["Donphan","Ground",null,90,120,120,60,50],
 ["Porygon2","Normal",null,85,80,90,95,60],
 ["Stantler","Normal",null,73,95,62,85,85],
 ["Smeargle","Normal",null,55,20,35,45,75],
 ["Tyrogue","Fighting",null,35,35,35,35,35],
 ["Hitmontop","Fighting",null,50,95,95,40,70],
 ["Smoochum","Ice","Psychic",45,30,15,85,65],
 ["Elekid","Electric",null,45,63,37,65,95],
 ["Magby","Fire",null,45,75,37,70,83],
 ["Miltank","Normal",null,95,80,105,50,100],
 ["Blissey","Normal",null,255,10,10,75,55],
 ["Raikou","Electric",null,90,85,75,115,115],
 ["Entei","Fire",null,115,115,85,90,100],
 ["Suicune","Water",null,100,75,115,115,85],
 ["Larvitar","Rock","Ground",50,64,50,45,41],
 ["Pupitar","Rock","Ground",70,84,70,65,51],
 ["Tyranitar","Rock","Dark",100,134,110,95,61],
 ["Lugia","Psychic","Flying",106,90,130,130,110],
 ["Ho-Oh","Fire","Flying",106,130,90,130,90],
 ["Celebi","Psychic","Grass",100,100,100,100,100],
 // === GEN 3 / HOENN ===
 ["Treecko","Grass",null,40,45,35,65,70],            // 252
 ["Grovyle","Grass",null,50,65,45,85,95],            // 253
 ["Sceptile","Grass","Ghost",70,85,65,105,120],      // 254
 ["Torchic","Fire",null,45,60,40,70,45],             // 255
 ["Combusken","Fire","Fighting",60,85,60,85,55],     // 256
 ["Blaziken","Fire","Dark",80,120,70,110,80],        // 257
 ["Mudkip","Water",null,50,70,50,50,40],             // 258
 ["Marshtomp","Water","Ground",70,85,70,60,50],      // 259
 ["Swampert","Water","Fighting",100,110,90,85,60],     // 260
 ["Poochyena","Normal",null,35,55,35,30,35],         // 261
 ["Mightyena","Normal",null,70,90,70,60,70],         // 262
 ["Zigzagoon","Normal",null,38,30,41,41,60],         // 263
 ["Linoone","Normal",null,78,70,61,61,100],          // 264
 ["Wurmple","Bug",null,45,45,35,30,20],              // 265
 ["Silcoon","Bug",null,50,35,55,30,15],              // 266
 ["Beautifly","Bug","Flying",60,70,50,100,65],       // 267
 ["Cascoon","Bug",null,50,35,55,30,15],              // 268
 ["Dustox","Bug","Poison",60,50,70,90,65],           // 269
 ["Lotad","Water","Grass",40,30,30,40,30],           // 270
 ["Lombre","Water","Grass",60,50,50,60,50],          // 271
 ["Ludicolo","Water","Grass",80,70,70,100,70],       // 272
 ["Seedot","Grass",null,40,40,50,30,30],             // 273
 ["Nuzleaf","Grass","Dark",70,70,40,60,60],          // 274
 ["Shiftry","Grass","Dark",90,100,60,90,80]          // 275
];
// Sparse legendary additions (sprites already embedded via CUSTOM_SPRITES)
DEX[279] = ["Ralts","Psychic",null,28,25,25,45,40];        // National Dex #280
DEX[280] = ["Kirlia","Psychic",null,38,35,35,65,50];       // National Dex #281
DEX[281] = ["Gardevoir","Psychic",null,68,65,65,125,80];   // National Dex #282
DEX[298] = ["Nosepass","Rock",null,30,45,135,45,30];       // National Dex #299 (Gen 3 Rock)
DEX[303] = ["Aron","Steel","Rock",50,70,100,40,30];        // National Dex #304
DEX[304] = ["Lairon","Steel","Rock",60,90,140,50,40];      // National Dex #305
DEX[305] = ["Aggron","Steel","Rock",70,110,180,60,50];     // National Dex #306
DEX[381] = ["Kyogre","Water",null,100,100,90,150,90];     // National Dex #382
DEX[382] = ["Groudon","Ground",null,100,150,140,100,90];  // National Dex #383
DEX[383] = ["Rayquaza","Dragon","Flying",105,150,90,150,95]; // National Dex #384
// Beldum line (Steel/Psychic) + Eon twins — added for the SKY / EON quest.
DEX[373] = ["Beldum","Steel","Psychic",40,55,80,35,30];     // National Dex #374
DEX[374] = ["Metang","Steel","Psychic",60,75,100,60,50];    // National Dex #375
DEX[375] = ["Metagross","Steel","Psychic",80,135,130,95,70];// National Dex #376
DEX[379] = ["Latios","Dragon","Psychic",80,90,80,130,110];  // National Dex #380
DEX[380] = ["Latias","Dragon","Psychic",80,80,90,110,110];  // National Dex #381
// Hoenn ELITE FOUR + CHAMPION species — needed by the HOENN_LEAGUE gauntlet.
// Without these rows makeMon() reads DEX[undefined] and throws, crashing the E4.
// [name, type1, type2|null, HP, Atk, Def, Spc(=SpA), Spe]
DEX[301] = ["Sableye","Dark","Ghost",50,75,75,65,50];        // #302 (Phoebe)
DEX[318] = ["Sharpedo","Water","Dark",70,120,40,95,95];      // #319 (Sidney)
DEX[329] = ["Flygon","Ground","Dragon",80,100,80,80,100];    // #330 (Drake)
DEX[331] = ["Cacturne","Grass","Dark",70,115,60,115,55];     // #332 (Sidney)
DEX[333] = ["Altaria","Dragon","Flying",75,70,90,70,80];     // #334 (Drake)
DEX[341] = ["Crawdaunt","Water","Dark",63,120,85,90,55];     // #342 (Sidney)
DEX[343] = ["Claydol","Ground","Psychic",60,70,105,70,75];   // #344 (Steven)
DEX[345] = ["Cradily","Rock","Grass",86,81,97,81,43];        // #346 (Steven)
DEX[347] = ["Armaldo","Rock","Bug",75,125,100,70,45];        // #348 (Steven)
DEX[353] = ["Banette","Ghost",null,64,115,65,83,65];         // #354 (Phoebe)
DEX[355] = ["Dusclops","Ghost",null,40,70,130,60,25];        // #356 (Phoebe)
DEX[358] = ["Absol","Dark",null,65,130,60,75,75];            // #359 (Sidney)
DEX[361] = ["Glalie","Ice",null,80,80,80,80,80];             // #362 (Glacia)
DEX[363] = ["Sealeo","Ice","Water",90,60,70,75,45];          // #364 (Glacia)
DEX[364] = ["Walrein","Ice","Water",110,80,90,95,65];        // #365 (Glacia)
DEX[371] = ["Shelgon","Dragon",null,65,95,100,60,50];        // #372 (Drake)
DEX[372] = ["Salamence","Dragon","Flying",95,135,80,110,100];// #373 (Drake)


/* ---------------------------------------------------------------------------
   2. TYPE CHART (Gen-1, 15 types). chart[atk][def] = multiplier; default 1.
--------------------------------------------------------------------------- */

export const TYPES=["Normal","Fire","Water","Grass","Electric","Ice","Fighting",
 "Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon"];

export const CHART={
 Normal:{Rock:.5,Ghost:0},
 Fire:{Fire:.5,Water:.5,Grass:2,Ice:2,Bug:2,Rock:.5,Dragon:.5},
 Water:{Fire:2,Water:.5,Grass:.5,Ground:2,Rock:2,Dragon:.5},
 Grass:{Fire:.5,Water:2,Grass:.5,Poison:.5,Ground:2,Flying:.5,Bug:.5,Rock:2,Dragon:.5},
 Electric:{Water:2,Grass:.5,Electric:.5,Ground:0,Flying:2,Dragon:.5},
 Ice:{Water:.5,Grass:2,Ice:.5,Ground:2,Flying:2,Dragon:2},
 Fighting:{Normal:2,Ice:2,Poison:.5,Flying:.5,Psychic:.5,Bug:.5,Rock:2,Ghost:0},
 Poison:{Grass:2,Poison:.5,Ground:.5,Bug:2,Rock:.5,Ghost:.5},
 Ground:{Fire:2,Grass:.5,Electric:2,Poison:2,Flying:0,Bug:.5,Rock:2},
 Flying:{Grass:2,Electric:.5,Fighting:2,Bug:2,Rock:.5},
 Psychic:{Fighting:2,Poison:2,Psychic:.5},
 Bug:{Fire:.5,Grass:2,Fighting:.5,Poison:2,Flying:.5,Psychic:2,Ghost:.5},
 Rock:{Fire:2,Ice:2,Fighting:.5,Ground:.5,Flying:2,Bug:2},
 Ghost:{Normal:0,Psychic:2,Ghost:2},
 Dragon:{Dragon:2}
};

export function typeMult(atkType, d1, d2){
  const t=CHART[atkType]||{};
  let m=(t[d1]===undefined?1:t[d1]);
  if(d2){ m*=(t[d2]===undefined?1:t[d2]); }
  return m;
}

/* ---------------------------------------------------------------------------
   3. MOVES — compact pool. Each species gets Tackle + up to 3 STAB moves
   synthesized from its types (keeps data tight, battle logic robust).
--------------------------------------------------------------------------- */

export const MOVES={
  Tackle:{name:"TACKLE",type:"Normal",power:40,pp:35,acc:95},
  Scratch:{name:"SCRATCH",type:"Normal",power:40,pp:35,acc:100},
  QuickAttack:{name:"QUICK ATK",type:"Normal",power:40,pp:30,acc:100},
  Ember:{name:"EMBER",type:"Fire",power:40,pp:25,acc:100},
  Flamethrower:{name:"FLAMETHROWER",type:"Fire",power:90,pp:15,acc:100},
  WaterGun:{name:"WATER GUN",type:"Water",power:40,pp:25,acc:100},
  Surf:{name:"SURF",type:"Water",power:90,pp:15,acc:100},
  VineWhip:{name:"VINE WHIP",type:"Grass",power:45,pp:25,acc:100},
  RazorLeaf:{name:"RAZOR LEAF",type:"Grass",power:55,pp:25,acc:95},
  ThunderShock:{name:"THUNDERSHOCK",type:"Electric",power:40,pp:30,acc:100},
  Thunderbolt:{name:"THUNDERBOLT",type:"Electric",power:90,pp:15,acc:100},
  IceBeam:{name:"ICE BEAM",type:"Ice",power:90,pp:10,acc:100},
  Powder:{name:"POWDER SNOW",type:"Ice",power:40,pp:25,acc:100},
  KarateChop:{name:"KARATE CHOP",type:"Fighting",power:50,pp:25,acc:100},
  LowKick:{name:"LOW KICK",type:"Fighting",power:50,pp:20,acc:90},
  Sludge:{name:"SLUDGE",type:"Poison",power:65,pp:20,acc:100},
  PoisonSting:{name:"POISON STING",type:"Poison",power:35,pp:35,acc:100},
  Magnitude:{name:"MAGNITUDE",type:"Ground",power:70,pp:30,acc:100},
  Dig:{name:"DIG",type:"Ground",power:60,pp:10,acc:100},
  Gust:{name:"GUST",type:"Flying",power:40,pp:35,acc:100},
  WingAttack:{name:"WING ATTACK",type:"Flying",power:60,pp:35,acc:100},
  Confusion:{name:"CONFUSION",type:"Psychic",power:50,pp:25,acc:100},
  Psychic:{name:"PSYCHIC",type:"Psychic",power:90,pp:10,acc:100},
  BugBite:{name:"BUG BITE",type:"Bug",power:60,pp:20,acc:100},
  StringShot:{name:"STRING SHOT",type:"Bug",power:30,pp:40,acc:95},
  RockThrow:{name:"ROCK THROW",type:"Rock",power:50,pp:15,acc:90},
  RockSlide:{name:"ROCK SLIDE",type:"Rock",power:75,pp:10,acc:90},
  Lick:{name:"LICK",type:"Ghost",power:30,pp:30,acc:100},
  ShadowPunch:{name:"SHADOW HIT",type:"Ghost",power:60,pp:20,acc:100},
  DragonRage:{name:"DRAGON RAGE",type:"Dragon",power:50,pp:10,acc:100},
  Twister:{name:"TWISTER",type:"Dragon",power:40,pp:20,acc:100},
  // --- Regional-form special moves (Sceptile Ghost / Blaziken Dark / Swampert Fighting) ---
  NightShade:{name:"NIGHT SHADE",type:"Ghost",power:70,pp:15,acc:100},
  Hex:{name:"HEX",type:"Ghost",power:85,pp:10,acc:100},
  PhantomForce:{name:"PHANTOM FORCE",type:"Ghost",power:100,pp:10,acc:100},
  Bite:{name:"BITE",type:"Dark",power:60,pp:25,acc:100},
  NightSlash:{name:"NIGHT SLASH",type:"Dark",power:70,pp:15,acc:100},
  Crunch:{name:"CRUNCH",type:"Dark",power:80,pp:15,acc:100},
  DarkPulse:{name:"DARK PULSE",type:"Dark",power:80,pp:15,acc:100},
  FoulPlay:{name:"FOUL PLAY",type:"Dark",power:95,pp:10,acc:100},
  BrickBreak:{name:"BRICK BREAK",type:"Fighting",power:75,pp:15,acc:100},
  DynamicPunch:{name:"DYNAMIC PUNCH",type:"Fighting",power:100,pp:5,acc:80},
  CloseCombat:{name:"CLOSE COMBAT",type:"Fighting",power:120,pp:5,acc:100}
};

export const ULT_DEFS={
  HyperBeam:{name:"HYPER BEAM",type:"Normal",power:150,pp:5,acc:90},
  FireBlast:{name:"FIRE BLAST",type:"Fire",power:120,pp:5,acc:85},
  SolarBeam:{name:"SOLAR BEAM",type:"Grass",power:120,pp:5,acc:100},
  HydroPump:{name:"HYDRO PUMP",type:"Water",power:120,pp:5,acc:80},
  Thunder:{name:"THUNDER",type:"Electric",power:120,pp:5,acc:75},
  Blizzard:{name:"BLIZZARD",type:"Ice",power:120,pp:5,acc:75},
  CrossChop:{name:"CROSS CHOP",type:"Fighting",power:120,pp:5,acc:80},
  SludgeBomb:{name:"SLUDGE BOMB",type:"Poison",power:110,pp:10,acc:100},
  Earthquake:{name:"EARTHQUAKE",type:"Ground",power:110,pp:10,acc:100},
  SkyAttack:{name:"SKY ATTACK",type:"Flying",power:120,pp:5,acc:90},
  Psystrike:{name:"PSYSTRIKE",type:"Psychic",power:120,pp:5,acc:100},
  Megahorn:{name:"MEGAHORN",type:"Bug",power:120,pp:5,acc:85},
  StoneEdge:{name:"STONE EDGE",type:"Rock",power:110,pp:5,acc:80},
  ShadowBall:{name:"SHADOW BALL",type:"Ghost",power:110,pp:10,acc:100},
  Outrage:{name:"OUTRAGE",type:"Dragon",power:120,pp:10,acc:100}
};
for(const k in ULT_DEFS) MOVES[k]=ULT_DEFS[k];

export const ULT_BY_TYPE={
  Normal:"HyperBeam", Fire:"FireBlast", Water:"HydroPump", Grass:"SolarBeam",
  Electric:"Thunder", Ice:"Blizzard", Fighting:"CrossChop", Poison:"SludgeBomb",
  Ground:"Earthquake", Flying:"SkyAttack", Psychic:"Psystrike", Bug:"Megahorn",
  Rock:"StoneEdge", Ghost:"ShadowBall", Dragon:"Outrage"
};

export const SIGNATURE={
  3:"SolarBeam", 6:"FireBlast", 9:"HydroPump",
  25:"Thunder", 26:"Thunder",
  94:"ShadowBall", 130:"HydroPump", 131:"Blizzard",
  143:"HyperBeam", 149:"Outrage", 150:"Psystrike",
  154:"SolarBeam", 157:"FireBlast", 160:"HydroPump"
};

export const STAB_MOVES={
  Normal:["QuickAttack","Tackle"],
  Fire:["Ember","Flamethrower"],
  Water:["WaterGun","Surf"],
  Grass:["VineWhip","RazorLeaf"],
  Electric:["ThunderShock","Thunderbolt"],
  Ice:["Powder","IceBeam"],
  Fighting:["KarateChop","LowKick"],
  Poison:["PoisonSting","Sludge"],
  Ground:["Dig","Magnitude"],
  Flying:["Gust","WingAttack"],
  Psychic:["Confusion","Psychic"],
  Bug:["BugBite","StringShot"],
  Rock:["RockThrow","RockSlide"],
  Ghost:["Lick","ShadowPunch"],
  Dragon:["DragonRage","Twister"]
};

export function learnList(id){
  const d=DEX[id-1], d1=d[1], d2=d[2];
  const L=[{lv:1,key:"Tackle"}];
  const s1=STAB_MOVES[d1]||[], s2=(d2&&STAB_MOVES[d2])||[];
  if(s1[0]) L.push({lv:1, key:s1[0]});
  if(s2[0]) L.push({lv:12,key:s2[0]});
  if(s1[1]) L.push({lv:24,key:s1[1]});
  if(s2[1]) L.push({lv:36,key:s2[1]});
  const ult = SIGNATURE[id] || ULT_BY_TYPE[d1] || ULT_BY_TYPE[d2 as string] || "HyperBeam";
  L.push({lv:60,key:ult});
  // --- Regional-form special movesets (secondary-type, lv 60-100) ---
  const REGIONAL={
    254:[ {lv:60,key:"NightShade"}, {lv:70,key:"Hex"}, {lv:80,key:"ShadowBall"}, {lv:90,key:"PhantomForce"}, {lv:100,key:"ShadowBall"} ], // Sceptile -> Ghost
    257:[ {lv:60,key:"Bite"}, {lv:70,key:"NightSlash"}, {lv:80,key:"Crunch"}, {lv:90,key:"DarkPulse"}, {lv:100,key:"FoulPlay"} ],          // Blaziken -> Dark
    260:[ {lv:60,key:"KarateChop"}, {lv:70,key:"BrickBreak"}, {lv:80,key:"CrossChop"}, {lv:90,key:"DynamicPunch"}, {lv:100,key:"CloseCombat"} ] // Swampert -> Fighting
  };
  if(REGIONAL[id]) for(const e of REGIONAL[id]) L.push(e);
  return L;
}

export function movesForLevel(id,level){
  const keys: string[]=[];
  for(const e of learnList(id)){ if(e.lv<=level && !keys.includes(e.key)) keys.push(e.key); }
  return makeMoveObjs(keys.slice(-4));
}

export function makeMoveObjs(keys: string[]): Move[] {
  return keys.map(k=>{ const m=MOVES[k]; return {key:k,name:m.name,type:m.type,power:m.power,acc:m.acc,pp:m.pp,ppNow:m.pp}; });
}

export function buildMoves(d1,d2){
  const pool=["Tackle"];
  for(const t of [d1,d2]){ if(t && STAB_MOVES[t]) for(const m of STAB_MOVES[t]) if(!pool.includes(m)) pool.push(m); }
  return makeMoveObjs(pool.slice(0,4));
}
// Rival's moveset scales with how many times you've fought it.
//   stage 0  (first fight)  -> ZERO same-type moves: plain Normal filler only
//   stage 1  (1st rematch)  -> Tackle + one (weaker) STAB move
//   stage 2+ (later fights) -> full type kit (same as a normal mon)

export function buildRivalMoves(d1,d2,stage){
  if(stage<=0) return makeMoveObjs(["Tackle","Scratch","QuickAttack"]);
  const stab: string[]=[];
  for(const t of [d1,d2]){ if(t && STAB_MOVES[t]) for(const m of STAB_MOVES[t]) if(!stab.includes(m)) stab.push(m); }
  if(stage===1) return makeMoveObjs(["Tackle", stab[0]].filter(Boolean));
  return buildMoves(d1,d2);
}

/* ---------------------------------------------------------------------------
   4. MON FACTORY + STAT MATH (Gen-1 style)
--------------------------------------------------------------------------- */

export function statCalc(base,level,isHP){
  if(isHP) return Math.floor(((base+0)*2*level)/100)+level+10;
  return Math.floor(((base+0)*2*level)/100)+5;
}

export function makeMon(id: number, level: number): Mon {
  const d=DEX[id-1];
  const mon: Mon = {
    id, name:d[0].toUpperCase(), t1:d[1], t2:d[2], level,
    base:{hp:d[3],atk:d[4],def:d[5],spc:d[6],spe:d[7]},
    moves:movesForLevel(id,level),
    xp:0, xpNext:level*level*level,
    friendship:70,   // canon default; raises via steps/wins/heals
    // Stats below are recomputed immediately by recalc(); seeded for the type.
    maxHp:0, hp:0, atk:0, def:0, spc:0, spe:0
  };
  recalc(mon, true);
  return mon;
}

export function recalc(mon: Mon, full?: boolean){
  mon.maxHp=statCalc(mon.base.hp,mon.level,true);
  mon.atk=statCalc(mon.base.atk,mon.level,false);
  mon.def=statCalc(mon.base.def,mon.level,false);
  mon.spc=statCalc(mon.base.spc,mon.level,false);
  mon.spe=statCalc(mon.base.spe,mon.level,false);
  if(full || (mon.hp as number | undefined)===undefined) mon.hp=mon.maxHp;
  if(mon.hp>mon.maxHp) mon.hp=mon.maxHp;
}

export function dmg(att,def,move){
  if(Math.random()*100 > move.acc) return {miss:true,dealt:0,eff:1,crit:false};
  const eff=typeMult(move.type,def.t1,def.t2);
  if(eff===0) return {miss:false,dealt:0,eff:0,crit:false};
  const stab=(move.type===att.t1||move.type===att.t2)?1.5:1;
  const crit=Math.random()<(att.base.spe/512)+0.0625;
  const A=att.atk, D=def.def;
  let base=Math.floor(Math.floor(Math.floor(2*att.level/5+2)*move.power*A/D)/50)+2;
  base=Math.floor(base*stab*eff*(crit?2:1));
  const rand=(Math.floor(Math.random()*39)+217)/255;
  let val=Math.max(1,Math.floor(base*rand));
  if(eff===0) val=0;
  return {miss:false,dealt:val,eff,crit};
}

export function mkMega(id: number, lv: number): Mon {
  const m=makeMon(id,lv); m.mega=true;
  m.atk=Math.round(m.atk*1.35); m.def=Math.round(m.def*1.3);
  m.spc=Math.round(m.spc*1.35); m.spe=Math.round(m.spe*1.3);
  m.hp=m.maxHp; return m;
}
