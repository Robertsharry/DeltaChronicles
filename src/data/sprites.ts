/* eslint-disable */
// Sprite-art tables. The large base64 art was extracted to src/assets/gen/* and is
// re-bundled as hashed asset URLs via Vite's import.meta.glob (handles dev + build).

const _toUrlByNum = (mods: Record<string, unknown>): Record<number, string> => {
  const out: Record<number, string> = {};
  for (const [p, u] of Object.entries(mods)) {
    const m = p.match(/(\d+)\.[a-z0-9]+$/);
    if (m) out[+m[1]] = u as string;
  }
  return out;
};

const _monMods = import.meta.glob('../assets/gen/mon/*', { eager: true, query: '?url', import: 'default' });
const _megaMods = import.meta.glob('../assets/gen/mega/*', { eager: true, query: '?url', import: 'default' });
const _owMods = import.meta.glob('../assets/gen/ow/*', { eager: true, query: '?url', import: 'default' });

export const CUSTOM_SPRITES: Record<number, string> = _toUrlByNum(_monMods);
export const MEGA_SPR: Record<number, string> = _toUrlByNum(_megaMods);

// OW overworld sprites: id -> [down, up, side] URLs (indices preserved from filenames).
export const OW_RAW: Record<number, string[]> = (() => {
  const out: Record<number, string[]> = {};
  for (const [p, u] of Object.entries(_owMods)) {
    const m = p.match(/(\d+)_(\d+)\.[a-z0-9]+$/);
    if (!m) continue;
    (out[+m[1]] ||= [])[+m[2]] = u as string;
  }
  return out;
})();

export const MEGA = { 3:{name:'M.VENUSAUR'}, 6:{name:'M.CHARIZARD X'}, 9:{name:'M.BLASTOISE'} };
