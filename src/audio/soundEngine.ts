/**
 * Procedural Web Audio API Sound Synthesizer for Crazy Cattle 3D.
 * 100% code-generated, zero external assets / 404 dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;

  constructor() {
    // Initialized on first user interaction to comply with autoplay policies
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.6;
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.6, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  /**
   * Procedural Sheep Bleat ("Baaa!" / "Meeeh!")
   * Created using dual-formant bandpassed sawtooth wave with pitch vibrato.
   */
  public playBaa(pitch: number = 220) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    const bandpass1 = this.ctx.createBiquadFilter();
    const bandpass2 = this.ctx.createBiquadFilter();
    const bleatGain = this.ctx.createGain();

    // Subtle pitch fluctuation (sheep vocal vibrato)
    lfo.frequency.setValueAtTime(6.5, t);
    lfoGain.gain.setValueAtTime(pitch * 0.04, t);
    lfo.connect(osc.frequency);

    osc.type = 'sawtooth';
    // Starting pitch with natural speech inflection curve
    osc.frequency.setValueAtTime(pitch * 0.95, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.05, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(pitch * 0.85, t + 0.55);

    // Formant filters to mimic mouth cavity
    bandpass1.type = 'bandpass';
    bandpass1.frequency.setValueAtTime(750, t);
    bandpass1.Q.setValueAtTime(3.5, t);

    bandpass2.type = 'bandpass';
    bandpass2.frequency.setValueAtTime(1400, t);
    bandpass2.Q.setValueAtTime(4.0, t);

    // Envelope
    bleatGain.gain.setValueAtTime(0.001, t);
    bleatGain.gain.linearRampToValueAtTime(0.35, t + 0.06);
    bleatGain.gain.exponentialRampToValueAtTime(0.2, t + 0.35);
    bleatGain.gain.linearRampToValueAtTime(0.001, t + 0.55);

    osc.connect(bandpass1);
    osc.connect(bandpass2);
    bandpass1.connect(bleatGain);
    bandpass2.connect(bleatGain);
    bleatGain.connect(this.masterGain);

    lfo.start(t);
    osc.start(t);
    lfo.stop(t + 0.6);
    osc.stop(t + 0.6);
  }

  /**
   * Impact / Headbutt BONK!
   * Heavy punchy impact with fast low-frequency drop and wooden click.
   */
  public playBonk(intensity: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const baseFreq = 220 + Math.min(intensity, 2) * 50;
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.18);

    gain.gain.setValueAtTime(Math.min(0.8, 0.4 * intensity), t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    // Noise layer for impact snap
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(1200, t);
    noiseFilter.Q.setValueAtTime(2.0, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(Math.min(0.5, 0.25 * intensity), t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(t);
    noiseSource.start(t);
    osc.stop(t + 0.25);
    noiseSource.stop(t + 0.06);
  }

  /**
   * Charge / Dash Whoosh sound
   */
  public playCharge() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(480, t + 0.28);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2400, t + 0.25);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.35, t + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  /**
   * Jump / Hop sound
   */
  public playJump() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.16);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  /**
   * Knockout / Falling off arena sound (descending comedic whistle + splat)
   */
  public playKnockout() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.6);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.7);
  }

  /**
   * Power-up pickup chime
   */
  public playPowerup() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.3);
    });
  }

  /**
   * Ring Shrink Warning Pulse
   */
  public playDangerWarning() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.setValueAtTime(180, t + 0.1);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  /**
   * Victory Fanfare
   */
  public playVictoryFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const chords = [
      { freqs: [523.25, 659.25, 783.99], time: 0, dur: 0.2 },       // C
      { freqs: [587.33, 739.99, 880.00], time: 0.22, dur: 0.2 },    // D
      { freqs: [659.25, 830.61, 987.77], time: 0.44, dur: 0.2 },    // E
      { freqs: [783.99, 987.77, 1046.50, 1318.51], time: 0.68, dur: 0.9 }, // High Triumph
    ];

    chords.forEach(({ freqs, time, dur }) => {
      freqs.forEach(freq => {
        const t = this.ctx!.currentTime + time;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
    });
  }
}

export const sounds = new SoundEngine();
