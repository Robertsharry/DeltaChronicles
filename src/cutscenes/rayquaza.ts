/* eslint-disable */
import { State, game } from '../game';
import { canvas } from '../core/canvas';
import { dialogue } from '../engine/dialogue';
import { makeMon } from '../data/dex';
import { startBattle } from '../engine/battle';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: rayquaza
import rayCutUrl from '../assets/gen/rayquaza_cut.webp';

export const RAYQUAZA_CUT_URL = rayCutUrl;

export const _rayCutImg = new Image(); _rayCutImg.src = RAYQUAZA_CUT_URL;

// Drop-in cinematic class. Pasted from Sean's prototype, lightly adapted to render
// at native canvas resolution (since the game ctx is pre-scaled by SCALE).

export class LegendaryDescentCutscene {
  // This cutscene sets ~20 fields dynamically in its constructor/methods; an
  // index signature keeps the faithfully-ported class loose without per-field decls.
  [key: string]: any;
  constructor(canvas, sprite, opts: any = {}) {
    this.canvas = canvas;
    this.sprite = sprite;
    this.onComplete = opts.onComplete || null;
    this.dialog = opts.dialog || 'A legendary Pokemon descended!';
    this.beats = Object.assign({
      establish:1.5, approach:1.5, descent:1.5, roar:0.5, hover:2.5
    }, opts.beats || {});
    this.totalDuration = this.beats.establish + this.beats.approach + this.beats.descent + this.beats.roar + this.beats.hover;
    this.intensity = (opts.intensity == null) ? 1.0 : opts.intensity;
    this.t = 0; this.complete = false; this.completeFired = false;
    this.clouds = []; this.particles = []; this.trauma = 0;
    this.flashAlpha = 0; this.nextFlashAt = 0;
    this.rayX = 0; this.rayY = -100; this.rayScale = 0.4; this.rayRot = 0; this.rayAlpha = 0;
  }
  start() {
    this.t = 0; this.complete = false; this.completeFired = false;
    this.trauma = 0; this.particles = [];
    this.flashAlpha = 0; this.nextFlashAt = this.beats.establish + 1.0;
    this.rayAlpha = 0; this.clouds = [];
    const w = this.canvas.width, h = this.canvas.height;
    for (let i = 0; i < 14; i++) {
      this.clouds.push({
        x: Math.random() * w, y: Math.random() * h * 0.7,
        r: 20 + Math.random() * 50, speed: 5 + Math.random() * 12,
        layer: Math.random() < 0.5 ? 0 : 1,
      });
    }
  }
  isComplete() { return this.complete; }
  skipToRoar() { this.t = this.beats.establish + this.beats.approach + this.beats.descent; }
  update(dt) {
    dt = Math.min(dt, 1 / 30);
    this.t += dt;
    const w = this.canvas.width, h = this.canvas.height;
    for (const c of this.clouds) {
      c.x -= c.speed * dt * (c.layer === 0 ? 0.5 : 1.4);
      if (c.x < -c.r * 2) { c.x = w + c.r; c.y = Math.random() * h * 0.7; }
    }
    this.trauma = Math.max(0, this.trauma - dt * 1.6);
    this.flashAlpha = Math.max(0, this.flashAlpha - dt * 3.5);
    if (this.t > this.beats.establish + 1.0 &&
        this.t < this.beats.establish + this.beats.approach + this.beats.descent &&
        this.t > this.nextFlashAt) {
      this.flashAlpha = 0.7 * this.intensity;
      this.nextFlashAt = this.t + 0.5 + Math.random() * 0.5;
      this.trauma = Math.min(1, this.trauma + 0.25 * this.intensity);
    }
    const tEstablish = this.beats.establish;
    const tApproach  = tEstablish + this.beats.approach;
    const tDescent   = tApproach + this.beats.descent;
    const tRoar      = tDescent + this.beats.roar;
    if (this.t < tEstablish) { this.rayAlpha = 0; }
    else if (this.t < tDescent) {
      const local = this.t - tEstablish;
      const dur = this.beats.approach + this.beats.descent;
      const p = local / dur;
      const eased = p * p * (3 - 2 * p);
      this.rayX = w / 2 + Math.sin(local * 4.5) * 110 * (1 - eased * 0.6);
      this.rayY = -80 + eased * (h * 0.5 + 80);
      this.rayScale = 0.4 + eased * 1.6;
      this.rayAlpha = Math.min(1, p * 4);
      this.rayRot = Math.cos(local * 4.5) * 0.25 * (1 - eased * 0.5);
      if (Math.random() < 0.6) {
        const ox = (Math.random() - 0.5) * 40, oy = (Math.random() - 0.5) * 40;
        this.particles.push({
          x: this.rayX + ox, y: this.rayY + oy,
          vx: -40 - Math.random() * 60, vy: -10 - Math.random() * 20,
          life: 0.4 + Math.random() * 0.3, maxLife: 0.7,
          size: 1 + Math.random() * 2,
        });
      }
    } else if (this.t < tRoar) {
      this.rayX = w / 2; this.rayY = h * 0.45;
      this.rayScale = 2.0; this.rayRot = 0; this.rayAlpha = 1;
      if (this.flashAlpha < 0.85) this.flashAlpha = 1.0 * this.intensity;
      if (this.trauma < 0.85) this.trauma = Math.min(1, 0.95 * this.intensity);
    } else if (this.t < tRoar + this.beats.hover) {
      const ht = this.t - tRoar;
      this.rayX = w / 2 + Math.sin(ht * 1.8) * 12;
      this.rayY = h * 0.45 + Math.cos(ht * 1.8) * 6;
      this.rayScale = 2.0;
      this.rayRot = Math.sin(ht * 1.8) * 0.06;
      this.rayAlpha = 1;
    }
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
    if (this.t >= this.totalDuration && !this.completeFired) {
      this.complete = true; this.completeFired = true;
      if (this.onComplete) this.onComplete();
    }
  }
  draw(c2) {
    const w = this.canvas.width, h = this.canvas.height;
    c2.save();
    if (this.trauma > 0) {
      const shake = this.trauma * this.trauma * 9;
      c2.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }
    const stormFactor = Math.min(1, this.t / 4);
    const grad = c2.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0,
      'rgb(' + Math.round(30 + 40 * (1 - stormFactor)) + ',' +
              Math.round(40 + 70 * (1 - stormFactor)) + ',' +
              Math.round(110 - 40 * stormFactor) + ')');
    grad.addColorStop(1,
      'rgb(' + Math.round(90 + 70 * (1 - stormFactor)) + ',' +
              Math.round(130 + 50 * (1 - stormFactor)) + ',' +
              Math.round(180 - 60 * stormFactor) + ')');
    c2.fillStyle = grad; c2.fillRect(0, 0, w, h);
    c2.fillStyle = 'rgba(255,255,255,' + (0.45 - stormFactor * 0.25) + ')';
    for (const cl of this.clouds) { if (cl.layer === 0) this._cloud(c2, cl.x, cl.y, cl.r); }
    c2.fillStyle = 'rgba(18,18,36,0.92)';
    c2.beginPath();
    c2.moveTo(0, h); c2.lineTo(0, h - 40);
    c2.lineTo(w * 0.15, h - 70); c2.lineTo(w * 0.28, h - 50);
    c2.lineTo(w * 0.42, h - 100); c2.lineTo(w * 0.5,  h - 130);
    c2.lineTo(w * 0.58, h - 95);  c2.lineTo(w * 0.72, h - 75);
    c2.lineTo(w * 0.85, h - 55);  c2.lineTo(w, h - 40);
    c2.lineTo(w, h); c2.closePath(); c2.fill();
    c2.fillStyle = 'rgba(220,220,240,' + (0.55 - stormFactor * 0.25) + ')';
    for (const cl of this.clouds) { if (cl.layer === 1) this._cloud(c2, cl.x, cl.y, cl.r); }
    for (const p of this.particles) {
      const a = p.life / p.maxLife;
      c2.fillStyle = 'rgba(255,255,255,' + (a * 0.75) + ')';
      c2.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size * 0.6);
    }
    if (this.flashAlpha > 0.4 && this.t < this.beats.establish + this.beats.approach + this.beats.descent) {
      this._bolt(c2, w / 2 + (Math.random() - 0.5) * w * 0.5, h);
    }
    if (this.rayAlpha > 0 && this.sprite && this.sprite.complete && this.sprite.naturalWidth) {
      c2.save();
      c2.globalAlpha = this.rayAlpha;
      c2.translate(this.rayX, this.rayY);
      c2.rotate(this.rayRot);
      c2.scale(this.rayScale, this.rayScale);
      const tH = this.t - (this.beats.establish + this.beats.approach + this.beats.descent + this.beats.roar);
      if (tH > 0) { c2.scale(1, 1 + Math.sin(tH * 6) * 0.04); }
      const sw = this.sprite.width, sh = this.sprite.height;
      c2.drawImage(this.sprite, -sw / 2, -sh / 2);
      c2.restore();
    }
    const vg = c2.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, h * 0.85);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    c2.fillStyle = vg; c2.fillRect(0, 0, w, h);
    if (this.flashAlpha > 0) {
      c2.fillStyle = 'rgba(255,255,255,' + this.flashAlpha + ')';
      c2.fillRect(0, 0, w, h);
    }
    c2.restore();
    const tHoverStart = this.beats.establish + this.beats.approach + this.beats.descent + this.beats.roar;
    if (this.t > tHoverStart + 0.25) { this._dialog(c2, this.dialog); }
  }
  _cloud(c2, cx, cy, r) {
    c2.beginPath();
    c2.arc(cx, cy, r, 0, Math.PI * 2);
    c2.arc(cx + r * 0.6, cy + r * 0.1, r * 0.7, 0, Math.PI * 2);
    c2.arc(cx - r * 0.5, cy + r * 0.15, r * 0.6, 0, Math.PI * 2);
    c2.fill();
  }
  _bolt(c2, x, height) {
    c2.strokeStyle = 'rgba(255,255,255,0.95)';
    c2.lineWidth = 2;
    c2.shadowColor = 'rgba(180,200,255,0.9)';
    c2.shadowBlur = 8;
    c2.beginPath();
    let cx = x, cy = 0;
    c2.moveTo(cx, cy);
    while (cy < height * 0.7) {
      cx += (Math.random() - 0.5) * 36;
      cy += 14 + Math.random() * 16;
      c2.lineTo(cx, cy);
    }
    c2.stroke();
    c2.shadowBlur = 0;
  }
  _dialog(c2, t) {
    const w = this.canvas.width, h = this.canvas.height;
    const boxH = 56, margin = 12;
    c2.fillStyle = 'rgba(0,0,0,0.88)';
    c2.fillRect(margin, h - boxH - margin, w - margin * 2, boxH);
    c2.strokeStyle = '#ffffff'; c2.lineWidth = 2;
    c2.strokeRect(margin, h - boxH - margin, w - margin * 2, boxH);
    c2.fillStyle = '#ffffff';
    c2.font = 'bold 13px "Courier New", monospace';
    c2.textBaseline = 'middle';
    c2.fillText(t, margin + 16, h - boxH / 2 - margin);
  }
}


export function startRayquazaDescentCutscene(){
  game.state = State.CUTSCENE;
  game.flags.rayquazaCutsceneSeen = true;
  const cut = new LegendaryDescentCutscene(canvas, _rayCutImg, {
    dialog: 'RAYQUAZA descended!',
    onComplete: () => {
      game.cutscene = null;
      game.state = State.DIALOGUE;
      dialogue([
        "RAYQUAZA's eyes lock onto\nyou. The sky pillar shakes.",
        "RAYQUAZA: ...You. The one\nwho calmed the twins.",
        "RAYQUAZA: I will not fight\nfor a TRAINER I cannot\nrespect. Show me you are\nworthy."
      ], () => {
        game.flags.skyForm = false;  // dismount Metagross for the battle
        startRayquazaClimaxFight();
      });
    }
  });
  game.cutscene = cut;
  cut.start();
}


export function startRayquazaClimaxFight(){
  const ray = makeMon(384, 80);
  // Boss buff — Air Lock supremacy. Brutal but not unfair.
  ray.atk = Math.round(ray.atk * 1.15);
  ray.spc = Math.round(ray.spc * 1.15);
  ray.spe = Math.round(ray.spe * 1.10);
  ray.hp  = ray.maxHp = Math.round(ray.maxHp * 1.30);
  startBattle(ray, false);
  game.battle!.label = 'RAYQUAZA';
  game.battle!.isRayquazaClimax = true;
  game.battle!.noCatch = true;
  game.battle!.noCatchMsg = "RAYQUAZA chose to come\nto you. A BALL would be\nan insult.";
}

// Quiet bond moment with your starter. Branches by starter family (Grass/Fire/Water).
