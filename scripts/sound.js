export class SoundManager {
  constructor() {
    this._actx = null;
    this.muted = false;
  }

  _getCtx() {
    if (!this._actx) {
      this._actx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this._actx.state === "suspended") this._actx.resume();
    return this._actx;
  }

  _seq(notes, type = "square", vol = 0.12) {
    if (this.muted) return;
    try {
      const ctx = this._getCtx();
      let t = ctx.currentTime + 0.01;
      for (const [freq, dur] of notes) {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t);
        osc.stop(t + dur + 0.01);
        t += dur;
      }
    } catch (_) {}
  }

  jump()    { this._seq([[330, 0.04], [440, 0.04], [523, 0.10]]); }
  coin()    { this._seq([[659, 0.06], [988, 0.22]]); }
  stomp()   { this._seq([[110, 0.04], [80,  0.10]], "sawtooth", 0.20); }
  powerUp() { this._seq([[262, 0.08], [330, 0.08], [392, 0.08], [523, 0.08], [659, 0.18]]); }
  shrink()  { this._seq([[523, 0.07], [440, 0.07], [370, 0.07], [262, 0.14]]); }
  die()     { this._seq([[440, 0.10], [370, 0.10], [311, 0.10], [262, 0.10], [220, 0.10], [185, 0.10], [155, 0.22]], "sawtooth", 0.18); }
}
