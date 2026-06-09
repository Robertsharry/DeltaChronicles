/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import { DEX, makeMon } from '../data/dex';
import {
  startHoennE4_Sidney, startHoennE4_Phoebe, startHoennE4_Glacia,
  startHoennE4_Drake, startStevenChampBattle,
} from './battle';
import { game, isMidE4Gauntlet, snapshotE4Party, restoreE4Party } from '../game';
import { startHallOfFame } from '../cutscenes/halloffame';
import { MAPS } from '../data/maps';
import type { Mon } from '../types';

// National-dex IDs that were missing and crashed the E4.
const FIXED_SPECIES: Array<[number, string]> = [
  [302, 'SABLEYE'], [319, 'SHARPEDO'], [330, 'FLYGON'], [332, 'CACTURNE'],
  [334, 'ALTARIA'], [342, 'CRAWDAUNT'], [344, 'CLAYDOL'], [346, 'CRADILY'],
  [348, 'ARMALDO'], [354, 'BANETTE'], [356, 'DUSCLOPS'], [359, 'ABSOL'],
  [362, 'GLALIE'], [364, 'SEALEO'], [365, 'WALREIN'], [372, 'SHELGON'],
  [373, 'SALAMENCE'],
];

describe('E4 species (crash fix)', () => {
  it.each(FIXED_SPECIES)('DEX has #%i (%s) and makeMon builds it', (id, name) => {
    expect(DEX[id - 1]).toBeDefined();
    const m = makeMon(id, 75);
    expect(m.name).toBe(name);
    expect(m.maxHp).toBeGreaterThan(0);
    expect(m.atk).toBeGreaterThan(0);
    expect(m.moves.length).toBeGreaterThanOrEqual(1);
  });
});

describe('E4 + Champion team builders', () => {
  beforeEach(() => {
    game.party = [makeMon(1, 80)]; // healthy lead so startBattle doesn't blackout
    game.npcs = [];
    game.battle = null;
    game.e4Snapshot = null;
  });

  const cases: Array<[string, () => void, string, [number, number]]> = [
    ['Sidney', startHoennE4_Sidney, 'isHoennE4_1', [72, 78]],
    ['Phoebe', startHoennE4_Phoebe, 'isHoennE4_2', [74, 80]],
    ['Glacia', startHoennE4_Glacia, 'isHoennE4_3', [76, 82]],
    ['Drake', startHoennE4_Drake, 'isHoennE4_4', [78, 84]],
    ['Steven', startStevenChampBattle, 'isStevenChamp', [82, 88]],
  ];

  it.each(cases)('%s builds a valid 6-mon battle', (_name, start, marker, [lo, hi]) => {
    expect(() => start()).not.toThrow();
    const b = game.battle as any;
    expect(b).toBeTruthy();
    expect(b[marker]).toBe(true);
    expect(b.foeTeam.length).toBe(5); // + the lead = 6 total
    const levels = [b.foe.level, ...b.foeTeam.map((m: Mon) => m.level)];
    for (const lv of levels) {
      expect(lv).toBeGreaterThanOrEqual(lo);
      expect(lv).toBeLessThanOrEqual(hi);
    }
  });
});

describe('lobby snapshot + gauntlet state', () => {
  beforeEach(() => {
    game.party = [makeMon(1, 50), makeMon(4, 50)];
    game.e4Snapshot = null;
    game.flags.hE4_1 = game.flags.hE4_2 = game.flags.hE4_3 = game.flags.hE4_4 = false;
    game.flags.hoennChampBeaten = false;
  });

  it('is not mid-gauntlet before entering', () => {
    expect(isMidE4Gauntlet()).toBe(false);
  });

  it('snapshot captures the party and marks the run as in-progress', () => {
    snapshotE4Party();
    expect(isMidE4Gauntlet()).toBe(true);
    expect(game.e4Snapshot).toHaveLength(2);
    // mutating the live party must not touch the snapshot (deep copy)
    game.party[0].hp = 1;
    game.party[0].level = 99;
    expect(game.e4Snapshot![0].hp).toBe(game.e4Snapshot![0].maxHp);
    expect(game.e4Snapshot![0].level).toBe(50);
  });

  it('restore resets progress to Sidney with the lobby party', () => {
    snapshotE4Party();
    game.flags.hE4_1 = true; // beat Sidney
    game.flags.hE4_2 = true; // beat Phoebe
    game.party[0].level = 99; // levelled up mid-run
    restoreE4Party();
    expect(game.flags.hE4_1).toBe(false);
    expect(game.flags.hE4_2).toBe(false);
    expect(game.party[0].level).toBe(50); // back to lobby snapshot
    expect(game.e4Snapshot).toBeNull();
    expect(isMidE4Gauntlet()).toBe(false);
  });
});

describe('champion flow', () => {
  it('startHallOfFame sets the champion flag and clears the snapshot', () => {
    game.party = [makeMon(1, 80)];
    snapshotE4Party();
    game.flags.hoennChampBeaten = false;
    startHallOfFame();
    expect(game.flags.hoennChampBeaten).toBe(true);
    expect(game.flags.stevenBeaten).toBe(true);
    expect(game.e4Snapshot).toBeNull();
    expect(game.state).toBe('halloffame');
  });
});

describe('map gating', () => {
  it('the Hoenn league entry warp is sealed behind the Mirage finale', () => {
    const w = MAPS.POKEMON_LEAGUE.warps!.find((w) => w.to === 'HOENN_LEAGUE');
    expect(w).toBeTruthy();
    expect(w!.gate).toBe('mirageFinale');
  });

  it('the league guard only blocks while mid-gauntlet', () => {
    const guard = MAPS.HOENN_LEAGUE.npcs.find((n) => n.name === 'LEAGUE_GUARD');
    expect(guard).toBeTruthy();
    game.flags.hE4_1 = game.flags.hE4_2 = game.flags.hE4_3 = game.flags.hE4_4 = false;
    game.flags.hoennChampBeaten = false;
    game.e4Snapshot = null;
    expect(guard!.present!()).toBe(false); // before the run
    game.flags.hE4_1 = true;
    expect(guard!.present!()).toBe(true); // mid-run
    game.flags.hoennChampBeaten = true;
    expect(guard!.present!()).toBe(false); // champion — gone
  });
});
