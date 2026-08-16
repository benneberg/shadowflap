
export class SoundManager {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playFlap() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playScore() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  playHit() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.5);
  }

  private bgMusicNode: GainNode | null = null;
  private bgMusicOscs: OscillatorNode[] = [];

  startBackgroundMusic() {
    this.init();
    if (!this.ctx || this.bgMusicNode) return;

    this.bgMusicNode = this.ctx.createGain();
    this.bgMusicNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.bgMusicNode.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 2);
    this.bgMusicNode.connect(this.ctx.destination);

    // Create a dark ambient drone
    const frequencies = [60, 62, 65, 67]; // Low dark notes
    frequencies.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (i * 0.05);
      lfoGain.gain.value = 2;
      
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      
      const filter = this.ctx!.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 200 + (i * 50);
      filter.Q.value = 5;

      osc.connect(filter);
      filter.connect(this.bgMusicNode!);
      
      osc.start();
      lfo.start();
      this.bgMusicOscs.push(osc, lfo);
    });
  }

  stopBackgroundMusic() {
    if (this.bgMusicNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.bgMusicNode.gain.cancelScheduledValues(now);
      this.bgMusicNode.gain.setValueAtTime(this.bgMusicNode.gain.value, now);
      this.bgMusicNode.gain.linearRampToValueAtTime(0, now + 1);
      
      setTimeout(() => {
        this.bgMusicOscs.forEach(o => {
          try { o.stop(); } catch (e) {}
        });
        this.bgMusicOscs = [];
        this.bgMusicNode = null;
      }, 1100);
    }
  }
}

export const sounds = new SoundManager();
