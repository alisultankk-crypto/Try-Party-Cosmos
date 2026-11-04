/**
 * Procedural Space Cyber Dubstep Audio Engine.
 * 100% Web Audio API - Zero external MP3 / 404 dependencies.
 * Features:
 * - 140 BPM heavy half-time dubstep drum beat
 * - Iconic Wobble Bass (resonant lowpass filter LFO modulation with wub-wub rhythms)
 * - Sub-bass chest thump (45Hz sine)
 * - Cyber synth chord stabs and riser sweeps
 * - Punchy modern game SFX (laser zap, coin chime, bass drop)
 */

import { MagicEffectType } from '../types/game';

class SpaceDubstepEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmIntervalId: number | null = null;
  private step: number = 0;

  constructor() {}

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(muted ? 0 : 0.22, this.ctx.currentTime, 0.05);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // ==========================================
  // 🔊 PROCEDURAL DUBSTEP BGM (140 BPM)
  // ==========================================

  public isBgmRunning(): boolean {
    return this.bgmPlaying;
  }

  public toggleBGM(): boolean {
    this.initCtx();
    if (this.bgmPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  public startBGM() {
    if (this.bgmPlaying) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.bgmPlaying = true;
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = this.isMuted ? 0 : 0.22;
    this.bgmGain.connect(this.masterGain);

    this.step = 0;
    // 140 BPM = 2.333 beats per second. 16th note = 60 / (140 * 4) = ~107.14 ms
    const stepTimeMs = 107;

    // Bass notes progression in F minor (F1 = 43.65Hz, G#1 = 51.91Hz, D#1 = 38.89Hz, C#1 = 34.65Hz)
    const bassRootNotes = [43.65, 43.65, 51.91, 38.89];

    const tick = () => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGain) return;
      const now = this.ctx.currentTime;
      const stepInBar = this.step % 16;
      const barIndex = Math.floor(this.step / 16) % bassRootNotes.length;
      const currentRoot = bassRootNotes[barIndex];
      this.step++;

      // 1. KICK (Dubstep half-time: heavy on step 0 and occasional syncopation on step 10)
      if (stepInBar === 0 || stepInBar === 10) {
        this.playDubstepKick(now);
      }

      // 2. SNARE (Dubstep half-time: loud snap on beat 3 -> step 8)
      if (stepInBar === 8) {
        this.playDubstepSnare(now);
      }

      // 3. HI-HAT (Fast cyber off-beat ticks on 2, 4, 6, 10, 12, 14)
      if (stepInBar % 2 === 1) {
        this.playCyberHat(now, stepInBar % 4 === 1 ? 0.08 : 0.04);
      }

      // 4. WOBBLE BASS (The iconic Wub-Wub!)
      // Different wobble speeds depending on position in bar
      if (stepInBar % 4 === 0) {
        // Quarter note wub
        const wobbleSpeed = stepInBar === 12 ? 14 : stepInBar === 8 ? 8 : 4;
        this.playWobbleBass(now, currentRoot, wobbleSpeed, 0.38);
      }

      // 5. CYBER CHORD STABS (on step 2, 6, 14)
      if (stepInBar === 2 || stepInBar === 6 || stepInBar === 14) {
        this.playCyberSynthStab(now, currentRoot * 4);
      }
    };

    this.bgmIntervalId = window.setInterval(tick, stepTimeMs);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  // --- Dubstep Instruments Synthesis ---

  private playDubstepKick(t: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.12);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + 0.24);
  }

  private playDubstepSnare(t: number) {
    if (!this.ctx || !this.bgmGain) return;

    // Snare tonal body
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(220, t);
    bodyOsc.frequency.exponentialRampToValueAtTime(120, t + 0.08);

    bodyGain.gain.setValueAtTime(0.35, t);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.bgmGain);
    bodyOsc.start(t);
    bodyOsc.stop(t + 0.16);

    // Snare white noise snap
    const bufferSize = 4000;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.45;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.bgmGain);

    noiseSource.start(t);
    noiseSource.stop(t + 0.26);
  }

  private playCyberHat(t: number, vol = 0.06) {
    if (!this.ctx || !this.bgmGain) return;

    const bufferSize = 800;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.2;

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(6500, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(vol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.bgmGain);

    noiseSource.start(t);
    noiseSource.stop(t + 0.05);
  }

  private playWobbleBass(t: number, rootFreq: number, lfoHz: number, duration: number) {
    if (!this.ctx || !this.bgmGain) return;

    // Dual detuned oscillators for fatness
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    osc1.frequency.setValueAtTime(rootFreq, t);
    osc2.frequency.setValueAtTime(rootFreq * 1.008, t); // Detuned

    // Resonant Lowpass Filter with high Q
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.setValueAtTime(10, t);
    filter.frequency.setValueAtTime(120, t);

    // LFO to sweep filter cutoff frequency (creates the "wub-wub-wub")
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(lfoHz, t);
    lfoGain.gain.setValueAtTime(1600, t); // Filter sweep depth
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Sub-bass layer (sine wave 45-60Hz)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(rootFreq, t);
    subGain.gain.setValueAtTime(0.3, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.25, t);
    mainGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(mainGain);
    mainGain.connect(this.bgmGain);

    subOsc.connect(subGain);
    subGain.connect(this.bgmGain);

    lfo.start(t);
    osc1.start(t);
    osc2.start(t);
    subOsc.start(t);

    lfo.stop(t + duration + 0.05);
    osc1.stop(t + duration + 0.05);
    osc2.stop(t + duration + 0.05);
    subOsc.stop(t + duration + 0.05);
  }

  private playCyberSynthStab(t: number, freq: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, t);
    filter.Q.setValueAtTime(4, t);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // ==========================================
  // 🎮 DUBSTEP SOUND EFFECTS
  // ==========================================

  public playTileTap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const pitch = 320 + Math.random() * 180;
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(pitch * 2.2, t + 0.05);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playTileEliminate() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    // Heavy bass drop + sparkling riser
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(160, t);
    sub.frequency.exponentialRampToValueAtTime(40, t + 0.3);

    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);

    sub.connect(filter);
    filter.connect(subGain);
    subGain.connect(this.masterGain);

    sub.start(t);
    sub.stop(t + 0.36);

    // Chime sweep
    [659.25, 880, 1174.66, 1760].forEach((freq, idx) => {
      const stepT = t + idx * 0.04;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, stepT);
      gain.gain.setValueAtTime(0.2, stepT);
      gain.gain.exponentialRampToValueAtTime(0.001, stepT + 0.18);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(stepT);
      osc.stop(stepT + 0.2);
    });
  }

  public playMagicBurst(effectType: MagicEffectType = 'arcane') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Cyber Dubstep Laser Riser
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(1400, t + 0.22);

    filter.type = 'lowpass';
    filter.Q.setValueAtTime(8, t);
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.linearRampToValueAtTime(3000, t + 0.22);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.3);
  }

  public playGemDrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1760];
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.22);
    });
  }

  public playBoosterUse() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(1100, t + 0.2);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  public playPoroSqueak() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(1800, t + 0.08);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  // 🐱 Space Cat Cute Meow
  public playCatMeow() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(680, t + 0.32);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.28, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  // 🐷 Space Piglet Bouncy Oink
  public playPigletOink() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    // Double grunt oink
    [0, 0.12].forEach((offset) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, t + offset);
      osc.frequency.linearRampToValueAtTime(220, t + offset + 0.08);

      gain.gain.setValueAtTime(0.24, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t + offset);
      osc.stop(t + offset + 0.1);
    });
  }

  // 🪙 Golden Coin Clink & Chime
  public playCoinClink() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    [1960, 2620].forEach((f, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + idx * 0.05);

      gain.gain.setValueAtTime(0.25, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.28);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.3);
    });
  }

  // ⚡ Arcane Hextech Crystal Resonance Surge
  public playHextechSurge() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.5];
    notes.forEach((freq, idx) => {
      const noteTime = t + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.25, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(noteTime);
      osc.stop(noteTime + 0.42);
    });
  }

  public playLevelWin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // Dubstep celebratory fanfare
    const freqs = [392, 523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((f, idx) => {
      const t = this.ctx!.currentTime + idx * 0.08;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0.28, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.45);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.55);
  }

  // Compatibility aliases
  public playSheepBleat() {
    this.playPoroSqueak();
  }
  public playFunnyBoing() {
    this.playTileTap();
  }
  public playMagicEffect(type: MagicEffectType = 'arcane', _combo?: number) {
    this.playMagicBurst(type);
  }
  public playVictory() {
    this.playLevelWin();
  }
  public playDefeat() {
    this.playGameOver();
  }
  public playSlotWarning() {
    this.playTileTap();
  }
  public playBooster() {
    this.playBoosterUse();
  }
  public playTileElimination(_count?: number) {
    this.playTileEliminate();
  }
}

export const puzzleSounds = new SpaceDubstepEngine();
