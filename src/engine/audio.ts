/* eslint-disable */
import { State, game } from '../game';
// AUTO-SLICED from legacy/delta-chronicles-v20.html — module: audio

// Dynamic Web Audio singleton; typed loosely (its fields are reassigned across
// null/AudioContext/Timeout). Consumers only call its methods.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Audio: any = {
  ctx:null,
  init(){ if(!this.ctx){ try{ this.ctx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } },
  beep(freq,dur,type,vol){
    if(!this.ctx) return;
    const o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type||'square'; o.frequency.value=freq;
    g.gain.value=vol||0.05;
    o.connect(g); g.connect(this.ctx.destination);
    const t=this.ctx.currentTime;
    g.gain.setValueAtTime(vol||0.05,t);
    g.gain.exponentialRampToValueAtTime(0.0001,t+dur);
    o.start(t); o.stop(t+dur);
  },
  step(){ this.beep(180,0.05,'square',0.02); },
  select(){ this.beep(660,0.06,'square',0.04); },
  confirm(){ this.beep(880,0.08,'square',0.05); },
  cancel(){ this.beep(220,0.08,'square',0.04); },
  hit(eff){ this.beep(eff>1?320:eff<1?160:240,0.12,'sawtooth',0.05); },
  heal(){ this.beep(523,0.1,'sine',0.05); setTimeout(()=>this.beep(784,0.12,'sine',0.05),90); },
  battleStart(){ this.beep(440,0.08,'square',0.05); setTimeout(()=>this.beep(330,0.08,'square',0.05),90); setTimeout(()=>this.beep(550,0.12,'square',0.05),180); },
  musicOn:true, _mt:null, _mi:0,
  _song:[392,330,392,494,440,392,330,294,330,392,494,587,523,494,392,330],
  _note(){
    if(!this.ctx||!this.musicOn) return;
    const f=this._song[this._mi % this._song.length]; this._mi++;
    try{
      const o=this.ctx.createOscillator(), g=this.ctx.createGain();
      o.type='triangle'; o.frequency.value=f;
      const t=this.ctx.currentTime, v=0.020;
      g.gain.setValueAtTime(0.0001,t);
      g.gain.linearRampToValueAtTime(v,t+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,t+0.34);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t); o.stop(t+0.36);
    }catch(e){}
  },
  startMusic(){ this.init(); if(!this.ctx) return; if(this._mt) return;
    this.musicOn=true; this._mt=setInterval(()=>this._note(),360); },
  stopMusic(){ this.musicOn=false; if(this._mt){ clearInterval(this._mt); this._mt=null; } },
  toggleMusic(){ if(this._mt) this.stopMusic(); else this.startMusic(); }
};


export const MUSIC={ /* tracks removed — sprites embedded instead */ };
/* === BACKGROUND MUSIC ===
   Title=Opening, Pallet Town=Pallet theme, every other map=Cinnabar theme,
   wild battle / trainer battle = their themes. Toggle in BAG (MUSIC ON/OFF). */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Music: any = {
  els:{}, cur:null, allowed:false, VOL:0.34,
  el(k){
    if(!this.els[k]){ const a=new window.Audio(); a.src=MUSIC[k]; a.loop=true; a.volume=0; a.preload='auto'; this.els[k]=a; }
    return this.els[k];
  },
  want(){
    if(!game.flags.music) return null;
    if(game.state===State.TITLE) return 'open';
    if(game.battle) return game.battle.isTrainer ? 'trainer' : 'wild';
    return game.mapName==='TOWN' ? 'pallet' : 'city';
  },
  tick(dt){
    const desired=this.want();
    if(desired!==this.cur) this.cur=desired;
    for(const k in MUSIC){
      const a=this.els[k]; if(!a && k!==this.cur) continue;
      const el=this.el(k);
      const tgt=(k===this.cur && this.allowed && game.flags.music) ? this.VOL : 0;
      const v=el.volume + (tgt-el.volume)*Math.min(1, dt*4);
      el.volume=Math.max(0,Math.min(this.VOL, v));
      if(tgt>0 && el.paused){ const p=el.play(); if(p&&p.catch) p.catch(()=>{}); }
      else if(tgt===0 && !el.paused && el.volume<0.01){ el.pause(); el.currentTime=el.currentTime; }
    }
  }
};

export function _unlockMusic(){
  if(Audio && Audio.ctx && Audio.ctx.state==='suspended'){ try{ Audio.ctx.resume(); }catch(e){} }
  Music.allowed=true;
  // Must kick off playback *inside* the user gesture or mobile blocks it.
  // Prime every track (play->let tick manage volume); only the wanted one stays audible.
  for(const key in MUSIC){
    try{
      const el=Music.el(key);
      const pr=el.play();
      if(pr && pr.catch) pr.catch(()=>{});
    }catch(e){}
  }
}
window.addEventListener('pointerdown',_unlockMusic);
window.addEventListener('keydown',_unlockMusic);
window.addEventListener('touchstart',_unlockMusic,{passive:true});

/* ---------------------------------------------------------------------------
   12. INPUT
--------------------------------------------------------------------------- */
