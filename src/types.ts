// ---------------------------------------------------------------------------
// Shared types for Delta Chronicles.
//
// These describe the runtime shapes the (faithfully ported) engine builds. The
// game-state surface — GameState and GameFlags especially — is fully typed here;
// engine internals stay pragmatic (see tsconfig "noImplicitAny": false).
// ---------------------------------------------------------------------------

/** Finite-state-machine state names (mirror of the runtime `State` object in game.ts). */
export type GameStateName =
  | 'title' | 'world' | 'dialogue' | 'choice' | 'menu' | 'party' | 'battle'
  | 'pokedex' | 'bag' | 'trainer' | 'pc' | 'fly' | 'evolution' | 'cutscene'
  | 'halloffame';

// ---- Pokémon ----------------------------------------------------------------
export interface MonBase { hp: number; atk: number; def: number; spc: number; spe: number; }

export interface Move {
  key: string; name: string; type: string;
  power: number; acc: number; pp: number; ppNow: number;
}

export interface Mon {
  id: number; name: string; t1: string; t2: string | null; level: number;
  base: MonBase; moves: Move[];
  xp: number; xpNext: number; friendship: number;
  // Filled in by recalc() (initialised in makeMon before the first recalc):
  maxHp: number; hp: number; atk: number; def: number; spc: number; spe: number;
  // Runtime-only flags/handles set during play:
  mega?: boolean;
  borrowed?: boolean;
  megaImg?: HTMLImageElement;
  cut?: boolean;
  surf?: boolean;
  fly?: boolean;
}

// ---- Maps -------------------------------------------------------------------
export interface Warp { x: number; y: number; to: string; tx: number; ty: number; gate?: string; }
export interface Encounter { id: number; min: number; max: number; w: number; }

/** An NPC as authored in maps.ts (data + interaction closures). Runtime copies
 *  (made by setMap via Object.assign) may carry extra fields, hence the index. */
export interface NPC {
  x: number; y: number; dir: string; kind: string; name: string;
  fixed?: boolean;
  ball?: number;
  npcMon?: number;
  present?: () => boolean;
  talk?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MapDef {
  name: string;
  grid: string[];
  npcs: NPC[];
  // Optional: not every authored map sets every field.
  interior?: boolean;
  signs?: Record<string, string>;
  warps?: Warp[];
  exits?: Warp[];
  encounters?: Encounter[] | null;
}

// ---- Battle -----------------------------------------------------------------
export interface BattleMsg {
  text: string; char: number; t: number; done: boolean; after: (() => void) | null;
}

export interface Float {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/** The active battle. Named battles set marker booleans on this object
 *  (b.isBrawly, b.isStevenChamp, …) which endBattle() dispatches on; those
 *  dynamic markers are covered by the index signature. */
export interface Battle {
  // Core fields are all set by startBattle() before the battle runs.
  foe: Mon;
  me: Mon;
  isTrainer: boolean;
  foeLabel: string | null;
  msg: BattleMsg | null;
  msgQ: Array<{ text: string; after: (() => void) | null }>;
  phase: string;
  sub: string | null;
  selIdx: number;
  foeShake: number; meShake: number; flash: number;
  over: boolean;
  result: string | null;
  introT: number;
  foeHpShown: number; meHpShown: number;
  _foeHpLast: number; _meHpLast: number;
  _foeRef: Mon; _meRef: Mon;
  floats: Float[];
  // Optional / set only for some battles:
  foeTeam?: Mon[];
  noCatch?: boolean; noCatchMsg?: string;
  trainerFlag?: string | null;
  trainerNpc?: string | null;
  // Named-battle markers (b.isBrawly, b.isStevenChamp, …) dispatched by endBattle:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

// ---- Misc runtime sub-objects ----------------------------------------------
export interface Player {
  x: number; y: number; dir: string;
  px: number; py: number; moving: boolean; frame: number; animT: number;
  sx: number; sy: number; tx: number; ty: number; mt: number;
}
export interface Follower {
  px: number; py: number; dir: string; bob: number;
  sx: number; sy: number; tx: number; ty: number; moving: boolean; mt: number;
}
export interface TrailPoint { x: number; y: number; dir: string; }
export interface Cam { x: number; y: number; }
export interface Bag {
  ball: number; potion: number; greatball: number; superpotion: number;
  masterball: number; rarecandy: number; linkcable: number; tradepass: number;
  [key: string]: number;
}
export interface DexState { seen: Record<number, number>; caught: Record<number, number>; }
export interface Menu { idx: number; items: string[]; }
export interface DexView { top: number; idx: number; }
export interface BagView { idx: number; }
export interface PartyView {
  idx: number;
  ret: GameStateName;
  // Set when the party screen is opened to use an item or swap members:
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useItem?: any;
  swap?: number | null;
}
export interface PcView { side: string; idx: number; top: number; msg: string; }
export interface FlyView { idx: number; }
export interface DialogueState {
  lines: string[]; i: number; char: number; t: number; onDone: (() => void) | null;
}
export interface ChoiceOption { label: string; fn: () => void; }
export interface ChoiceState {
  prompt: string; options: ChoiceOption[]; idx: number; onCancel: (() => void) | null;
}
export interface Step { count: number; }
export interface Place { map: string; x: number; y: number; }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Tower { round: number; [key: string]: any; }

/** A self-contained canvas cutscene driven by the main loop. */
export interface CutsceneController {
  update: (dt: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}

// ---- Story flags ------------------------------------------------------------
/** Every persisted story/progression flag. Booleans unless noted. */
export interface GameFlags {
  aquaEonBeaten: boolean;
  aqua_t1: boolean;
  aqua_t2: boolean;
  aqua_t3: boolean;
  archieBeaten: boolean;
  articunoSeen: boolean;
  auroraBadge: boolean;
  auroraGymBeaten: boolean;
  aurora_app1: boolean;
  bigEventStarted: boolean;
  birchBadge: boolean;
  birchGymBeaten: boolean;
  birch_app1: boolean;
  bla_t1: boolean;
  blaineBeaten: boolean;
  boulderBadge: boolean;
  br_grunt: boolean;
  br_t1: boolean;
  br_t2: boolean;
  br_t3: boolean;
  br_t4: boolean;
  brawlyBeaten: boolean;
  brawly_app1: boolean;
  brawly_app2: boolean;
  brockBeaten: boolean;
  cascadeBadge: boolean;
  ccItem: boolean;
  celadon_grunt: boolean;
  celadon_grunt2: boolean;
  celebiSeen: boolean;
  champion: boolean;
  cinnaRivalBeaten: boolean;
  cp_t1: boolean;
  cp_t2: boolean;
  cp_t3: boolean;
  devonCableGift: boolean;
  dinnerDone: boolean;
  dinnerStarted: boolean;
  divedOnce: boolean;
  e4_1: boolean;
  e4_2: boolean;
  e4_3: boolean;
  e4_4: boolean;
  earthBadge: boolean;
  eonChoiceMade: boolean;
  eonId: number | null;
  erikaBeaten: boolean;
  expShare: boolean;
  flewHomePostAstra: boolean;
  flyGranted: boolean;
  followMon: boolean;
  fossil: string | null;
  fuc_t1: boolean;
  fuc_t2: boolean;
  gen2Taken: boolean;
  giovanniBeaten: boolean;
  girl: boolean;
  gotMachamp: boolean;
  groudonDefeated: boolean;
  groudonPart1: boolean;
  gruntBeaten: boolean;
  gym_g1: boolean;
  gym_g2: boolean;
  hE4_1: boolean;
  hE4_2: boolean;
  hE4_3: boolean;
  hE4_4: boolean;
  hasStarter: boolean;
  hmCut: boolean;
  hmSurf: boolean;
  hoennChampBeaten: boolean;
  hoohSeen: boolean;
  infiniteCable: boolean;
  introSeen: boolean;
  johtoChampBeaten: boolean;
  johtoStarter: boolean;
  jrT1: boolean;
  jrT2: boolean;
  kogaBeaten: boolean;
  kyogrePart2: boolean;
  leagueBeaten: boolean;
  leagueCallSeen: boolean;
  levelCap: number;
  lugiaSeen: boolean;
  magmaAdminBeaten: boolean;
  makerSaved: boolean;
  mansion_stash: boolean;
  marowakSeen: boolean;
  marshBadge: boolean;
  maxieBeaten: boolean;
  mayBeaten: boolean;
  mayRematch1: boolean;
  megaUnlocked: boolean;
  metMay: boolean;
  mewtwoBeaten: boolean;
  mewtwoSeen: boolean;
  mf_t1: boolean;
  mf_t2: boolean;
  mf_t3: boolean;
  mf_t4: boolean;
  mf_t5: boolean;
  mg_t1: boolean;
  mg_t2: boolean;
  mg_t3: boolean;
  mirageBadge: boolean;
  mirageCutsceneStarted: boolean;
  mirageFinale: boolean;
  mirageGroudonCalmed: boolean;
  mirageGymBeaten: boolean;
  mirageIslandEntered: boolean;
  mirageIslandUnlocked: boolean;
  mirageKyogreCalmed: boolean;
  mirage_app2: boolean;
  mirage_route_t1: boolean;
  mistralBadge: boolean;
  mistyBeaten: boolean;
  moltresSeen: boolean;
  momCalled: boolean;
  money: number;
  mtm_t1: boolean;
  mtm_t2: boolean;
  mtm_t3: boolean;
  music: boolean;
  noCap: boolean;
  normanBeaten: boolean;
  norman_app1: boolean;
  parcel: boolean;
  parkGift: boolean;
  pokedex: boolean;
  rainbowBadge: boolean;
  rayquazaBeaten: boolean;
  rayquazaCalled: boolean;
  rayquazaCutsceneSeen: boolean;
  rivalBeaten: boolean;
  rivalBigBeaten: boolean;
  rivalId: number | null;
  rivalStage: number;
  rocketBossBeaten: boolean;
  rocketGateOpen: boolean;
  rocketSwitch: boolean;
  rt_hiker1: boolean;
  rt_hiker2: boolean;
  rt_magma: boolean;
  sab_t1: boolean;
  sabrinaBeaten: boolean;
  shipRivalBeaten: boolean;
  shipStash: boolean;
  ship_t1: boolean;
  ship_t10: boolean;
  ship_t2: boolean;
  ship_t3: boolean;
  ship_t4: boolean;
  ship_t5: boolean;
  ship_t6: boolean;
  ship_t7: boolean;
  ship_t8: boolean;
  ship_t9: boolean;
  silphBeaten: boolean;
  skyForm: boolean;
  skyIslandEntered: boolean;
  soulBadge: boolean;
  sr_t1: boolean;
  sr_t2: boolean;
  sr_t3: boolean;
  starterId: number | null;
  steelBadge: boolean;
  steelGymBeaten: boolean;
  steel_app1: boolean;
  stevenBeaten: boolean;
  stevenGift: boolean;
  suicuneSeen: boolean;
  surfGiven: boolean;
  surgeBeaten: boolean;
  swm_1: boolean;
  swm_2: boolean;
  swm_3: boolean;
  thunderBadge: boolean;
  towerBest: number;
  tradeMonTaken: boolean;
  tradePass: boolean;
  vir_g1: boolean;
  vir_g2: boolean;
  viridianBeaten: boolean;
  volcanoBadge: boolean;
  volcanoTrigger: boolean;
  vrAce1: boolean;
  vrAce2: boolean;
  vrItem: boolean;
  wallyGift: boolean;
  zapdosSeen: boolean;
  zenithBadge: boolean;
  zenithGymBeaten: boolean;
  zenith_app1: boolean;
}

// ---- Top-level game state ---------------------------------------------------
export interface GameState {
  state: GameStateName;
  lastTs: number | null;
  // Set by setMap() before any world/battle rendering; treated as always-present
  // during play (only null for the brief boot window before the first setMap).
  map: MapDef;
  mapName: string;
  player: Player;
  follower: Follower;
  trail: TrailPoint[];
  cam: Cam;
  flags: GameFlags;
  party: Mon[];
  bag: Bag;
  npcs: NPC[];
  dialogue: DialogueState | null;
  choice: ChoiceState | null;
  menu: Menu;
  dex: DexState;
  dexView: DexView;
  bagView: BagView;
  partyView: PartyView;
  pc: Mon[];
  pcView: PcView;
  battle: Battle | null;
  step: Step;
  blackoutHome: Place;
  lastCenter: Place | null;
  titleT: number;
  flash: number;
  cutscene: CutsceneController | null;
  flyView: FlyView;
  // Lobby snapshot of the party taken on entering the Hoenn E4 gauntlet, so a
  // mid-gauntlet reload restarts from Sidney with the party you walked in with.
  e4Snapshot: Mon[] | null;
  // Runtime-added (absent in the initial literal):
  tower?: Tower | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evolution?: any;
}
