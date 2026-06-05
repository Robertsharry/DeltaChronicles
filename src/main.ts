// Entry point. Importing ./game pulls in the whole module graph (engine, data,
// cutscenes) and attaches the input / audio listeners via their modules.
import { game, State, loop } from './game';
import { MAPS } from './data/maps';
import { preloadMons } from './engine/renderer';

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
