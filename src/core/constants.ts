// Core rendering constants. Kept DOM-free so pure logic / tests can import them.
export const TILE = 16;
export const SCALE = 3;
export const VIEW_W = 160; // canvas.width  / SCALE  (480 / 3)
export const VIEW_H = 144; // canvas.height / SCALE  (432 / 3)

// Shown on the title screen. Bump on each meaningful release.
export const BUILD_STAMP = 'BUILD 2026-06-05 · delta v20 · hoenn elite four';
