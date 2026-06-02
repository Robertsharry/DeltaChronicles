// The shared game canvas + 2D context.
//
// In the browser this resolves to <canvas id="game"> and its real 2D context.
// In a headless environment (Vitest/jsdom, where getContext returns null) we
// fall back to a no-op stub context so the whole module graph can load and the
// pure game logic can be unit-tested without a real canvas.
import { SCALE } from './constants';

function makeStubContext(el: HTMLCanvasElement): CanvasRenderingContext2D {
  const noop = () => {};
  const stub = new Proxy(
    {} as Record<string | symbol, unknown>,
    {
      get(target, prop) {
        if (prop in target) return target[prop];
        if (prop === 'canvas') return el;
        if (prop === 'measureText') return () => ({ width: 0 });
        if (
          prop === 'createLinearGradient' ||
          prop === 'createRadialGradient' ||
          prop === 'createPattern'
        ) {
          return () => ({ addColorStop: noop });
        }
        if (prop === 'getImageData') return () => ({ data: new Uint8ClampedArray() });
        return noop;
      },
      set(target, prop, value) {
        target[prop] = value;
        return true;
      },
    },
  );
  return stub as unknown as CanvasRenderingContext2D;
}

function resolveCanvas(): HTMLCanvasElement {
  if (typeof document !== 'undefined') {
    const found = document.getElementById('game') as HTMLCanvasElement | null;
    if (found) return found;
    return document.createElement('canvas');
  }
  // Non-DOM (e.g. SSR): a minimal stand-in.
  return { width: 480, height: 432 } as unknown as HTMLCanvasElement;
}

export const canvas = resolveCanvas();
export const ctx: CanvasRenderingContext2D =
  canvas.getContext?.('2d') ?? makeStubContext(canvas);

ctx.imageSmoothingEnabled = false;
ctx.scale(SCALE, SCALE);
