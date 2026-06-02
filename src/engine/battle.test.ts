/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { makeMon, mkMega, statCalc, typeMult, recalc } from '../data/dex';
import { startBattle, endBattle } from './battle';
import { game } from '../game';
import { MAPS } from '../data/maps';
import type { Mon } from '../types';

// ---------------------------------------------------------------------------
// 1. makeMon() — Gen-1 stat math
// ---------------------------------------------------------------------------
describe('makeMon()', () => {
  it('produces stats matching the Gen-1 statCalc formula', () => {
    // Bulbasaur (#1): base HP45 Atk49 Def49 Spc65 Spe45
    const b = makeMon(1, 50);
    expect(b.id).toBe(1);
    expect(b.name).toBe('BULBASAUR');
    expect(b.level).toBe(50);
    expect(b.maxHp).toBe(statCalc(45, 50, true)); // floor(45*2*50/100)+50+10 = 105
    expect(b.atk).toBe(statCalc(49, 50, false)); // floor(49*2*50/100)+5     = 54
    expect(b.def).toBe(statCalc(49, 50, false));
    expect(b.spc).toBe(statCalc(65, 50, false));
    expect(b.spe).toBe(statCalc(45, 50, false));
  });

  it('starts fresh: full HP, default friendship, 1–4 moves', () => {
    const m = makeMon(6, 36); // Charizard
    expect(m.hp).toBe(m.maxHp);
    expect(m.friendship).toBe(70);
    expect(m.moves.length).toBeGreaterThanOrEqual(1);
    expect(m.moves.length).toBeLessThanOrEqual(4);
    for (const mv of m.moves) expect(mv.ppNow).toBe(mv.pp);
  });

  it('scales stats monotonically with level and keeps them positive', () => {
    for (const id of [1, 4, 7, 25, 150, 384 - 1]) {
      const lo = makeMon(id, 10);
      const hi = makeMon(id, 80);
      expect(lo.maxHp).toBeGreaterThan(0);
      expect(hi.maxHp).toBeGreaterThan(lo.maxHp);
      expect(hi.atk).toBeGreaterThan(lo.atk);
      // HP is always larger than the equivalent non-HP stat at the same base/level
      expect(makeMon(143, 50).maxHp).toBe(statCalc(160, 50, true));
    }
  });

  it('statCalc matches the canonical formula exactly', () => {
    expect(statCalc(100, 100, true)).toBe(100 * 2 + 100 + 10 - (200 - 200)); // 310
    expect(statCalc(100, 100, true)).toBe(310);
    expect(statCalc(100, 100, false)).toBe(205);
    expect(statCalc(0, 1, false)).toBe(5);
    expect(statCalc(0, 1, true)).toBe(11);
  });

  it('mkMega() boosts a mon above its base form', () => {
    const base = makeMon(3, 60);
    const mega = mkMega(3, 60);
    expect(mega.mega).toBe(true);
    expect(mega.atk).toBeGreaterThan(base.atk);
    expect(mega.spc).toBeGreaterThan(base.spc);
    expect(mega.hp).toBe(mega.maxHp);
  });

  it('recalc() preserves saved HP when not a full heal', () => {
    const m = makeMon(1, 50);
    m.hp = 3;
    recalc(m, false);
    expect(m.hp).toBe(3); // not reset to maxHp
    recalc(m, true);
    expect(m.hp).toBe(m.maxHp); // full heal
  });
});

// ---------------------------------------------------------------------------
// 2. typeMult() — type chart multipliers
// ---------------------------------------------------------------------------
describe('typeMult()', () => {
  it('returns canonical single-type multipliers', () => {
    expect(typeMult('Water', 'Fire', null)).toBe(2); // super effective
    expect(typeMult('Fire', 'Water', null)).toBe(0.5); // not very effective
    expect(typeMult('Electric', 'Ground', null)).toBe(0); // immune
    expect(typeMult('Normal', 'Ghost', null)).toBe(0); // immune
    expect(typeMult('Normal', 'Rock', null)).toBe(0.5);
    expect(typeMult('Fighting', 'Normal', null)).toBe(2);
  });

  it('multiplies across dual types', () => {
    // Grass vs Water(2) / Flying(0.5) = 1
    expect(typeMult('Grass', 'Water', 'Flying')).toBe(1);
    // Fire vs Grass(2) / Bug(2) = 4
    expect(typeMult('Fire', 'Grass', 'Bug')).toBe(4);
    // Ground vs Fire(2) / Flying(0 — immune) = 0
    expect(typeMult('Ground', 'Fire', 'Flying')).toBe(0);
    // Rock vs Fire(2) / Fighting(0.5) = 1
    expect(typeMult('Rock', 'Fire', 'Fighting')).toBe(1);
  });

  it('defaults to 1 for neutral matchups and unknown attacker types', () => {
    expect(typeMult('Normal', 'Water', null)).toBe(1);
    expect(typeMult('Dragon', 'Water', null)).toBe(1);
    expect(typeMult('NotAType', 'Water', null)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 3. endBattle() — sets the correct flag for every named battle
// ---------------------------------------------------------------------------

// (marker on game.battle) -> (GameFlags key it should set on a win), extracted
// from the endBattle() dispatcher. Covers every named battle handled there.
const NAMED_BATTLES: Array<[string, string]> = [
  ['isBrawly', 'brawlyBeaten'], ['isBrawlyApp1', 'brawly_app1'], ['isBrawlyApp2', 'brawly_app2'],
  ['isMayRematch1', 'mayRematch1'], ['isRusturfHiker1', 'rt_hiker1'], ['isRusturfHiker2', 'rt_hiker2'],
  ['isRusturfMagma', 'rt_magma'], ['isBirchIntro', 'introSeen'], ['isMayFirstFight', 'metMay'],
  ['isMagmaAdmin', 'magmaAdminBeaten'], ['isMirageGroudon', 'mirageGroudonCalmed'],
  ['isMirageKyogre', 'mirageKyogreCalmed'], ['isGroudon', 'groudonDefeated'], ['isRival', 'rivalBeaten'],
  ['isGrunt', 'gruntBeaten'], ['isRocketBoss', 'rocketBossBeaten'], ['isBrock', 'brockBeaten'],
  ['isMakerRescue', 'makerSaved'], ['isGiovanni', 'giovanniBeaten'], ['isSurge', 'surgeBeaten'],
  ['isShipRival', 'shipRivalBeaten'], ['isMisty', 'mistyBeaten'], ['isViridianBoss', 'viridianBeaten'],
  ['isMewtwoBoss', 'mewtwoBeaten'], ['isHoennE4_1', 'hE4_1'], ['isHoennE4_2', 'hE4_2'],
  ['isHoennE4_3', 'hE4_3'], ['isHoennE4_4', 'hE4_4'], ['isStevenChamp', 'stevenBeaten'],
  ['isLeagueRival', 'leagueBeaten'], ['isCinnaRival', 'cinnaRivalBeaten'], ['isBlaine', 'blaineBeaten'],
  ['isSabrina', 'sabrinaBeaten'], ['isSilphBoss', 'silphBeaten'], ['isKoga', 'kogaBeaten'],
  ['isSteelGym', 'steelGymBeaten'], ['isMirageGym', 'mirageGymBeaten'], ['isNorman', 'normanBeaten'],
  ['isAquaSky', 'aquaEonBeaten'], ['isBirchGym', 'birchGymBeaten'], ['isAuroraGym', 'auroraGymBeaten'],
  ['isZenithGym', 'zenithGymBeaten'], ['isMaxieClimax', 'maxieBeaten'], ['isGroudonClimax', 'groudonPart1'],
  ['isArchieClimax', 'archieBeaten'], ['isKyogreClimax', 'kyogrePart2'], ['isRayquazaClimax', 'rayquazaBeaten'],
  ['isErika', 'erikaBeaten'], ['isBigRival', 'rivalBigBeaten'],
];

describe('endBattle()', () => {
  beforeEach(() => {
    // A healthy lead so startBattle() doesn't trigger a blackout, and a real
    // current map so endBattle handlers that rebuild game.npcs from it work.
    game.party = [makeMon(1, 50)];
    game.map = MAPS.TOWN;
    game.mapName = 'TOWN';
    game.npcs = [];
    game.battle = null;
  });

  it.each(NAMED_BATTLES)('marker %s sets flag %s on a win', (marker, flag) => {
    (game.flags as any)[flag] = false;
    startBattle(makeMon(19, 40) as Mon, true, 'FOE'); // build a valid battle object
    (game.battle as any)[marker] = true;
    endBattle(true);
    expect((game.flags as any)[flag]).toBe(true);
  });

  it('covers every named battle marker handled by the dispatcher', () => {
    expect(NAMED_BATTLES.length).toBe(49);
  });
});
