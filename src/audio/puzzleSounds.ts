/**
 * 8-Bit Retro Chiptune & Arcade Sound Engine.
 * 100% Procedural Web Audio API with Pulse/Square waves, fast arpeggios,
 * triangle bass, noise bursts, and classic retro gamer SFX.
 */

import { MagicEffectType, TileType } from '../types/game';

const CAT_MEOWS: Record<TileType, { start: number; peak: number; end: number; duration: number; formant: number }> = {
  yasuo: { start: 420, peak: 760, end: 510, duration: 0.24, formant: 1050 },
  ahri: { start: 520, peak: 920, end: 620, duration: 0.3, formant: 1320 },
  jinx: { start: 610, peak: 1080, end: 680, duration: 0.2, formant: 1480 },
  teemo: { start: 330, peak: 590, end: 390, duration: 0.34, formant: 920 },
  garen: { start: 370, peak: 680, end: 420, duration: 0.28, formant: 980 },
  zed: { start: 290, peak: 510, end: 340, duration: 0.31, formant: 820 },
  blitzcrank: { start: 480, peak: 820, end: 560, duration: 0.18, formant: 1180 },
  vi: { start: 540, peak: 970, end: 590, duration: 0.26, formant: 1390 },
  ashe: { start: 450, peak: 830, end: 500, duration: 0.36, formant: 1240 },
  darius: { start: 310, peak: 560, end: 360, duration: 0.22, formant: 860 },
  asol: { start: 250, peak: 470, end: 300, duration: 0.4, formant: 740 },
  lux: { start: 570, peak: 1020, end: 640, duration: 0.33, formant: 1450 },
  heimer: { start: 390, peak: 720, end: 450, duration: 0.21, formant: 1080 },
  katarina: { start: 500, peak: 900, end: 570, duration: 0.27, formant: 1280 },
};

class CosmicAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgmPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private bgmIntervalId: number | null = null;
  private bgmStep: number = 0;

  constructor() {}

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.isMuted ? 0 : 0.55;
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
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.55, this.ctx.currentTime, 0.05);
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setTargetAtTime(muted ? 0 : 0.16, this.ctx.currentTime, 0.05);
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
  // 🕹️ 8-BIT RETRO CHIPTUNE SOUND EFFECTS
  // ==========================================

  /**
   * 8-битный короткий 'пип' при нажатии на карточку
   */
  public playTileTap() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const pitches = [523.25, 587.33, 659.25, 783.99]; // C5, D5, E5, G5
    const pitch = pitches[Math.floor(Math.random() * pitches.length)];

    osc.type = 'square'; // Classic NES pulse wave
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.setValueAtTime(pitch * 1.5, t + 0.03); // Quick chiptune jump

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playCatMeow(type: TileType) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const profile = CAT_MEOWS[type];
    const now = this.ctx.currentTime;
    const voice = this.ctx.createOscillator();
    const formant = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    voice.type = 'sawtooth';
    voice.frequency.setValueAtTime(profile.start, now);
    voice.frequency.linearRampToValueAtTime(profile.peak, now + profile.duration * 0.32);
    voice.frequency.exponentialRampToValueAtTime(profile.end, now + profile.duration);
    formant.type = 'bandpass';
    formant.frequency.setValueAtTime(profile.formant, now);
    formant.Q.setValueAtTime(1.6, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, now + profile.duration);

    voice.connect(formant);
    formant.connect(gain);
    gain.connect(this.masterGain);
    voice.start(now);
    voice.stop(now + profile.duration + 0.01);
  }

  /**
   * 8-битный пружинистый прыжок / забавный звук
   */
  public playFunnyBoing() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.18);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.23);
  }

  /**
   * 8-битный классический звук монетки при сборе 3 карт (Coin pickup)
   */
  public playTileEliminate() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    // B5 (987.77 Hz) to E6 (1318.51 Hz) - legendary NES coin interval
    osc.frequency.setValueAtTime(987.77, t);
    osc.frequency.setValueAtTime(1318.51, t + 0.08);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.setValueAtTime(0.3, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.38);
  }

  /**
   * 8-битный звук нахождения драгоценного камня (Rare Item Chime)
   */
  public playGemDrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5 to G6 arpeggio
    notes.forEach((freq, idx) => {
      const t = this.ctx!.currentTime + idx * 0.06;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  /**
   * 8-битный звук супер-заклинания при трипле
   */
  public playMagicBurst(effectType: MagicEffectType = 'arcane') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;

    switch (effectType) {
      case 'fire': {
        // 8-bit explosion noise + square sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.25);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.3);
        break;
      }
      case 'frost': {
        // High sparkling square chiptune
        [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, i) => {
          const stepT = t + i * 0.04;
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, stepT);
          gain.gain.setValueAtTime(0.18, stepT);
          gain.gain.exponentialRampToValueAtTime(0.001, stepT + 0.1);
          osc.connect(gain);
          gain.connect(this.masterGain!);
          osc.start(stepT);
          osc.stop(stepT + 0.12);
        });
        break;
      }
      case 'void': {
        // Mysterious 8-bit laser pulse
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.2);
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.24);
        break;
      }
      default: {
        // Classic 8-bit power zap
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.linearRampToValueAtTime(880, t + 0.08);
        osc.frequency.linearRampToValueAtTime(1320, t + 0.16);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.24);
        break;
      }
    }
  }

  /**
   * Использование бустера (8-bit 1-up powerup)
   */
  public playBoosterUse() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    // E5, G5, E6, C6, D6, G6
    const freqs = [659.25, 783.99, 1318.51, 1046.5, 1174.66, 1567.98];
    freqs.forEach((freq, i) => {
      const t = this.ctx!.currentTime + i * 0.05;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + 0.1);
    });
  }

  /**
   * 8-битный звук поражения (Descent jingle)
   */
  public playGameOver() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [
      { f: 493.88, d: 0.14 }, // B4
      { f: 466.16, d: 0.14 }, // Bb4
      { f: 440.0, d: 0.14 },  // A4
      { f: 392.0, d: 0.4 },   // G4
    ];

    let timeAcc = 0;
    notes.forEach(({ f, d }) => {
      const t = this.ctx!.currentTime + timeAcc;
      timeAcc += d;

      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(f, t);

      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + d);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(t + d + 0.02);
    });
  }

  /**
   * 8-битный фанфар победы (8-Bit Victory Fanfare)
   */
  // Compatibility aliases
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
    this.playFunnyBoing();
  }

  public playBooster() {
    this.playBoosterUse();
  }

  public playTileElimination(_count?: number) {
    this.playTileEliminate();
  }

  public playLevelWin() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    const notes = [
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.1 },  // C5
      { f: 523.25, d: 0.25 }, // C5
      { f: 415.3, d: 0.25 },  // Ab4
      { f: 466.16, d: 0.25 }, // Bb4
      { f: 523.25, d: 0.18 }, // C5
      { f: 0, d: 0.05 },      // rest
      { f: 466.16, d: 0.12 }, // Bb4
      { f: 523.25, d: 0.6 },  // C5
    ];

    let timeAcc = 0;
    notes.forEach(({ f, d }) => {
      if (f > 0) {
        const t = this.ctx!.currentTime + timeAcc;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + d);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(t);
        osc.stop(t + d + 0.02);
      }
      timeAcc += d;
    });
  }

  // ==========================================
  // 🎶 НАСТОЯЩАЯ 8-БИТНАЯ ЧИПТЮН МЕЛОДИЯ
  // ==========================================

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

  public isBgmRunning(): boolean {
    return this.bgmPlaying;
  }

  /**
   * Настоящая зажигательная 8-битная чиптюн музыка (NES/GameBoy Chiptune)
   * Использует 2 пульс-генератора (Square), треугольный бас (Triangle) и 8-битный нойз ритм!
   */
  public startBGM() {
    if (this.bgmPlaying || !this.ctx || !this.masterGain) return;
    this.bgmPlaying = true;
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = this.isMuted ? 0 : 0.16;
    this.bgmGain.connect(this.masterGain);

    // Задорная ретро-мелодия в стиле Mega Man / Super Mario / DuckTales
    // 32-шаговая циклическая тема
    const leadNotes = [
      659.25, 659.25, 0,      659.25, 0,      523.25, 659.25, 0,
      783.99, 0,      0,      0,      392.0,  0,      0,      0,
      523.25, 0,      0,      392.0,  0,      0,      329.63, 0,
      440.0,  0,      493.88, 0,      466.16, 440.0,  0,      0,
      392.0,  659.25, 783.99, 880.0,  0,      698.46, 783.99, 0,
      659.25, 0,      523.25, 587.33, 493.88, 0,      0,      0,
      523.25, 0,      0,      392.0,  0,      0,      329.63, 0,
      440.0,  0,      493.88, 0,      466.16, 440.0,  0,      0,
    ];

    // Аккордовые арпеджио (каждый аккорд быстро перебирается: тоника, терция, квинта, октава)
    const arpeggioChords = [
      [261.63, 329.63, 392.0, 523.25], // C major
      [261.63, 329.63, 392.0, 523.25],
      [220.0, 261.63, 329.63, 440.0],  // A minor
      [174.61, 220.0, 261.63, 349.23], // F major
      [196.0, 246.94, 293.66, 392.0],  // G major
      [196.0, 246.94, 293.66, 392.0],
      [220.0, 261.63, 329.63, 440.0],  // A minor
      [196.0, 246.94, 293.66, 392.0],  // G major
    ];

    // Ретро треугольный бас
    const bassNotes = [
      130.81, 130.81, 130.81, 130.81, 110.0, 110.0, 110.0, 110.0,
      87.31,  87.31,  87.31,  87.31,  98.0,  98.0,  98.0,  98.0,
      130.81, 130.81, 130.81, 130.81, 110.0, 110.0, 110.0, 110.0,
      87.31,  87.31,  98.0,   98.0,   130.81, 130.81, 130.81, 130.81,
    ];

    this.bgmStep = 0;
    const stepMs = 145; // ~150 BPM energetic 8-bit tempo

    const tick = () => {
      if (!this.bgmPlaying || !this.ctx || !this.bgmGain) return;

      const now = this.ctx.currentTime;
      const step = this.bgmStep;
      this.bgmStep = (this.bgmStep + 1) % leadNotes.length;

      // 1. Канал Лид-Мелодии: Square wave
      const freq = leadNotes[step];
      if (freq > 0) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();

        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(freq, now);

        leadGain.gain.setValueAtTime(0.08, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        leadOsc.connect(leadGain);
        leadGain.connect(this.bgmGain);

        leadOsc.start(now);
        leadOsc.stop(now + 0.13);
      }

      // 2. Канал 8-битного скоростного Арпеджио (каждые 8 шагов меняется аккорд)
      const chordIdx = Math.floor(step / 8) % arpeggioChords.length;
      const chord = arpeggioChords[chordIdx];
      // Внутри шага воспроизводим 4 быстрые микро-ноты по 35мс: классический chiptune arpeggio!
      const arpNoteFreq = chord[step % 4];
      if (arpNoteFreq) {
        const arpOsc = this.ctx.createOscillator();
        const arpGain = this.ctx.createGain();

        arpOsc.type = 'square';
        arpOsc.frequency.setValueAtTime(arpNoteFreq * 1.5, now);

        arpGain.gain.setValueAtTime(0.04, now);
        arpGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        arpOsc.connect(arpGain);
        arpGain.connect(this.bgmGain);

        arpOsc.start(now);
        arpOsc.stop(now + 0.09);
      }

      // 3. Канал Баса: NES Triangle wave
      const bassIdx = step % bassNotes.length;
      const bassFreq = bassNotes[bassIdx];
      if (step % 2 === 0) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'triangle';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.12, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        bassOsc.connect(bassGain);
        bassGain.connect(this.bgmGain);

        bassOsc.start(now);
        bassOsc.stop(now + 0.24);
      }

      // 4. Канал 8-битных барабанов: Белый шум через фильтр
      // Бочка на каждый 4-й шаг, малый барабан на шаги 2, 6, 10...
      if (step % 4 === 0) {
        // Ретро Кик (быстрый питч-даун синуса)
        const kickOsc = this.ctx.createOscillator();
        const kickGain = this.ctx.createGain();
        kickOsc.type = 'triangle';
        kickOsc.frequency.setValueAtTime(140, now);
        kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.08);
        kickGain.gain.setValueAtTime(0.2, now);
        kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
        kickOsc.connect(kickGain);
        kickGain.connect(this.bgmGain);
        kickOsc.start(now);
        kickOsc.stop(now + 0.1);
      } else if (step % 4 === 2) {
        // Ретро нойз снейр (короткий шум)
        const bufferSize = 300;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.12;

        const noise = this.ctx.createBufferSource();
        noise.buffer = noiseBuffer;

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1200, now);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.15, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.bgmGain);

        noise.start(now);
      }
    };

    this.bgmIntervalId = window.setInterval(tick, stepMs);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }
}

export const puzzleSounds = new CosmicAudioEngine();
