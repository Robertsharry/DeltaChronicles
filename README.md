# Pokémon: The Delta Chronicles

A browser-based, tile RPG built on an HTML5 Canvas — overworld engine, turn-based
battles (multi-mon foe teams, Mega Evolution, the Gen-1 type chart, physical/special
split, EXP share), ~25 maps, a full 8-gym + Elite Four story arc, legendary climaxes
(Groudon / Kyogre / Rayquaza), and a Mirage Island cinematic finale.

Originally a single ~3 MB HTML file; now a maintainable **Vite + TypeScript** project.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → self-contained dist/
npm run preview    # serve the production build
npm test           # Vitest (battle-engine tests)
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

Controls: **Arrow keys / WASD** move · **Z** = A (confirm) · **X** = B (cancel) ·
**Enter** = START / menu. On-screen GBA buttons work for touch.

## Project structure

```
index.html              # GBA-shell page; loads src/main.ts as a module
public/sprites/         # the 5 cinematic sprites (rayquaza/groudon/kyogre/brendan/steven), as PNGs
src/
  main.ts               # entry point + boot (PC injection, preload, start loop)
  game.ts               # State enum, the game state object, setMap, world movement, main loop
  types.ts              # GameState, GameFlags (all flags), Mon, Move, MapDef, NPC, Battle, …
  assets/gen/           # ~1000 sprite PNGs extracted from base64 (mon/, mega/, ow/, actor/, …)
  core/
    constants.ts        # TILE / SCALE / VIEW_W / VIEW_H
    canvas.ts           # shared canvas + 2D context (headless stub for tests)
  data/
    dex.ts              # DEX, type chart + typeMult, moves, makeMon, mkMega, dmg, stat math
    maps.ts             # all map grids + MAPS, with NPC interaction closures
    sprites.ts          # sprite-art tables built from src/assets/gen via import.meta.glob
  engine/
    renderer.ts         # tile/world drawing, sprite loading, box/text/hpBar, title
    battle.ts           # battle loop, all battle starters, endBattle dispatcher, evolution
    dialogue.ts         # dialogue + choice queue and rendering
    input.ts            # keyboard + touch/pointer input
    audio.ts            # Web Audio chiptune system (procedural bleeps)
    save.ts             # saveGame / loadGame (localStorage key: hoenn_save_v1)
    ui.ts               # menu / bag / pokédex / party / PC / fly / shops / HM teaching
  cutscenes/
    mirage.ts           # Mirage Island Canvas cinematic
    rayquaza.ts         # Rayquaza "Legendary Descent" cutscene
legacy/                 # the original single-file game, kept for reference
```

> Modules beyond the original spec: `data/sprites.ts` (isolates the large base64
> art so `renderer.ts` stays readable), `engine/ui.ts` (menu/bag/party/etc. screens),
> and `cutscenes/rayquaza.ts` (the Sky Pillar descent, a sibling of the Mirage cinematic).

## Save compatibility

The localStorage key (`hoenn_save_v1`) and every story flag name are unchanged, so
existing saves load as-is. New flags fall back to their defaults via `Object.assign`.

## Notes on the migration

- **100% of gameplay/content is preserved.** The engine code was sliced from the
  original verbatim; only module wiring and types were added.
- **Sprites are no longer inline base64.** The 5 Mirage-cinematic sprites live in
  `public/sprites/*.png` (referenced by URL); the rest of the sprite art (~1000 PNGs:
  Pokémon, overworld, mega, actors, title, …) was extracted to `src/assets/gen/` and is
  re-bundled as hashed, lazily-loaded asset URLs via `import.meta.glob`. This cut the JS
  bundle from ~1.93 MB to ~310 KB (gzip ~1.27 MB → ~92 KB).
- **TypeScript is "pragmatic strict":** full `strict` mode incl. `strictNullChecks` is
  on; `noImplicitAny` is relaxed for the ported engine internals. The game-state surface
  (`GameState`, `GameFlags`, `Mon`, `MapDef`, …) is fully typed in `src/types.ts`.
- The GBA shell (on-screen D-pad / A-B / START) is preserved from the source file.

## Tests

`src/engine/battle.test.ts` covers:
- `makeMon()` stat ranges (vs. the Gen-1 `statCalc` formula) + `mkMega` / `recalc`
- `typeMult()` single- and dual-type multipliers (incl. immunities)
- `endBattle()` sets the correct flag for **each** of the 49 named battles
