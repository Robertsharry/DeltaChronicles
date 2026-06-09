/* eslint-disable */
// HALL OF FAME — shown after defeating Champion Steven Stone. Each party member
// is presented one-by-one (sprite / name / level), then a champion screen, then
// the player is warped home. hoennChampBeaten is persisted immediately so the
// title survives even if the ceremony is interrupted.
import { game, State, setMap } from '../game';
import { ctx } from '../core/canvas';
import { VIEW_W, VIEW_H } from '../core/constants';
import { box, text, drawMon } from '../engine/renderer';
import { consume } from '../engine/input';
import { Audio } from '../engine/audio';
import { saveGame } from '../engine/save';

let _idx = 0; // 0..party.length-1 = a member; party.length = champion screen
let _t = 0;

export function startHallOfFame() {
  _idx = 0;
  _t = 0;
  game.flags.stevenBeaten = true;
  game.flags.hoennChampBeaten = true;
  game.e4Snapshot = null; // gauntlet complete — drop the lobby snapshot
  game.battle = null;
  game.state = State.HALLOFFAME;
  Audio.heal();
  saveGame(); // persist champion status right away
}

export function updateHallOfFame(dt: number) {
  _t += dt;
  if (consume('a') || consume('menu') || consume('b')) {
    Audio.confirm();
    _idx++;
    const party = game.party.filter(Boolean);
    if (_idx > party.length) {
      const h = game.blackoutHome;
      setMap(h.map, h.x, h.y, 'down');
      game.state = State.WORLD;
      saveGame();
    }
  }
}

export function renderHallOfFame() {
  const party = game.party.filter(Boolean);
  // starry backdrop
  ctx.fillStyle = '#0b1030';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  for (let i = 0; i < 44; i++) {
    const x = (i * 53 + 7) % VIEW_W;
    const y = (i * 29 + (Math.floor(_t * 6) % 3)) % VIEW_H;
    ctx.fillStyle = i % 4 === 0 ? '#ffe89a' : '#9fb6ff';
    ctx.fillRect(x, y, 1, 1);
  }
  text('HALL OF FAME', 42, 6, '#ffe89a', 8);

  if (_idx < party.length) {
    const m = party[_idx];
    const bob = Math.sin(_t * 3) * 2;
    drawMon(m.id, VIEW_W / 2 - 24, 22 + bob, 48);
    box(8, VIEW_H - 46, VIEW_W - 16, 40);
    text(m.name, 14, VIEW_H - 40, '#283040', 8);
    text('Lv ' + m.level + '   HP ' + m.maxHp, 14, VIEW_H - 28, '#283040', 7);
    text(_idx + 1 + ' / ' + party.length + '   (A)', 14, VIEW_H - 16, '#5a6a86', 6);
  } else {
    text("POKEMON: THE DELTA", 16, 36, '#ffffff', 8);
    text('CHRONICLES', 44, 48, '#ffffff', 8);
    box(8, VIEW_H - 52, VIEW_W - 16, 46);
    text("You are HOENN's", 14, VIEW_H - 46, '#283040', 7);
    text('CHAMPION!', 14, VIEW_H - 35, '#283040', 8);
    text('Press A to continue', 14, VIEW_H - 17, '#5a6a86', 6);
  }
}
