// Entry point. Importing ./game pulls in the whole module graph (engine, data,
// cutscenes) and attaches the input / audio listeners via their modules.
import { game, State, loop, setMap } from './game';
import { MAPS } from './data/maps';
import { preloadMons } from './engine/renderer';

// Dev-only debug handle (stripped from production builds via the import.meta.env.DEV
// guard — esbuild/Rollup tree-shake the whole block). Handy in the console:
//   DC.game, DC.setMap('HOENN_LEAGUE',4,13,'up'), DC.give(150,90), DC.flag('mirageFinale')
if (import.meta.env.DEV) {
  void (async () => {
    const { makeMon } = await import('./data/dex');
    const { saveGame, loadGame } = await import('./engine/save');
    const { startHallOfFame } = await import('./cutscenes/halloffame');
    (window as Window & { DC?: unknown }).DC = {
      game, State, setMap, MAPS, makeMon, saveGame, loadGame, startHallOfFame,
      give: (id: number, lv: number) => { game.party.push(makeMon(id, lv)); },
      flag: (k: string, v = true) => { (game.flags as unknown as Record<string, unknown>)[k] = v; },
    };
  })();
}

function boot(): void {
  // Every POKEMON CENTER gets a PC in the corner.
  for (const mn in MAPS) {
    const m = MAPS[mn];
    if (mn.endsWith('CENTER') && m && m.npcs && !m.npcs.some((n) => n.name === 'PC')) {
      m.npcs.push({
        x: 7,
        y: 1,
        dir: 'down',
        kind: 'clerk',
        name: 'PC',
        talk: () => {
          game.pcView = { side: game.pc.length ? 'box' : 'party', idx: 0, top: 0, msg: '' };
          game.state = State.PC;
        },
      });
    }
  }

  // Preload the starters shown on the title screen, then start the loop.
  preloadMons([252, 255, 258]);
  requestAnimationFrame(loop);
}

boot();
