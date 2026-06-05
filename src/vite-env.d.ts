/// <reference types="vite/client" />

// The game initialises the Web Audio API via the legacy webkit-prefixed
// constructor as a fallback; declare it so strict TS is happy in the browser.
interface Window {
  webkitAudioContext?: typeof AudioContext;
}
