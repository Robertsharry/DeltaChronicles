# Changes

## delta v20 — Hoenn Elite Four gauntlet (2026-06-05)

**Fix (crash):** Added the 17 DEX species the Hoenn E4 / Champion teams require —
Sableye, Sharpedo, Flygon, Cacturne, Altaria, Crawdaunt, Claydol, Cradily, Armaldo,
Banette, Dusclops, Absol, Glalie, Sealeo, Walrein, Shelgon, Salamence. They were
missing from `DEX`, so `makeMon()` read `DEX[undefined]` and threw the moment you
talked to Sidney — the whole gauntlet was unreachable/broken.

**Hoenn League gauntlet** (`HOENN_LEAGUE`): Sidney → Phoebe → Glacia → Drake →
Champion **Steven Stone**, fought as one linear run (each leader blocks the corridor
until beaten).

- **Gated entry** beyond the Kanto champion, sealed until the Mirage Island finale
  (`mirageFinale`). Fixed the entry/exit warps (previously on unreachable wall tiles).
- **Antechamber Nurse** heals/saves before the run; a **league Guard** blocks retreat
  once the gauntlet begins — no healing mid-run (items still work).
- **Lobby snapshot:** losing the gauntlet or reloading mid-run restarts from Sidney
  with the exact party you walked in with (`e4Snapshot`, persisted in the save).
- **Steven taunt** when his team drops to half.
- **Hall of Fame:** a sprite ceremony — each party member shown with name/level — then
  a champion screen and warp home. `hoennChampBeaten` is persisted immediately.

**Housekeeping:** Extracted the title `BUILD_STAMP` to a constant and bumped it to
delta v20. Added Vitest coverage for the new species, E4 team builders, the lobby
snapshot, and the champion flow.
