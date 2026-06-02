// Vitest (jsdom) setup.
//
// jsdom does not implement the canvas 2D context. We override getContext to
// return null *before* any engine module loads, so src/core/canvas.ts falls back
// to its headless no-op stub context instead of throwing / logging noise.
HTMLCanvasElement.prototype.getContext =
  (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// The engine looks up <canvas id="game"> at module-load time. Provide one.
if (typeof document !== 'undefined' && !document.getElementById('game')) {
  const c = document.createElement('canvas');
  c.id = 'game';
  c.width = 480;
  c.height = 432;
  document.body.appendChild(c);
}
