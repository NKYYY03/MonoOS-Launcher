// Lightweight Web Audio synthesizer for Music / Audio Deck & optional subtle tactile clicks
// Zero external MP3 dependencies — works 100% offline.

export interface SynthTrack {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  notes: number[];
  waveform: OscillatorType;
}

export const SYNTH_TRACKS: SynthTrack[] = [
  {
    id: 'trk-1',
    title: 'Glyph 01 · Subharmonic',
    artist: 'MonoOS Audio',
    bpm: 78,
    notes: [220, 261.63, 329.63, 392.0, 329.63, 293.66, 261.63, 196.0],
    waveform: 'sine',
  },
  {
    id: 'trk-2',
    title: 'Alabaster Glass',
    artist: 'Braun Field',
    bpm: 92,
    notes: [293.66, 349.23, 440.0, 523.25, 440.0, 392.0, 349.23, 261.63],
    waveform: 'triangle',
  },
  {
    id: 'trk-3',
    title: 'Night Matrix',
    artist: 'Dot Engine',
    bpm: 104,
    notes: [164.81, 196.0, 246.94, 293.66, 246.94, 220.0, 196.0, 146.83],
    waveform: 'sine',
  },
];

class LauncherSoundEngine {
  private ctx: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private intervalId: number | null = null;
  private stepIndex = 0;
  private isPlaying = false;
  private trackIndex = 0;
  private volume = 0.45;
  private listeners = new Set<() => void>();

  private ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.gainNode = this.ctx.createGain();
      this.gainNode.gain.value = this.volume * 0.25;
      this.gainNode.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private emit() {
    this.listeners.forEach((fn) => fn());
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      trackIndex: this.trackIndex,
      track: SYNTH_TRACKS[this.trackIndex],
      stepIndex: this.stepIndex,
      volume: this.volume,
    };
  }

  public setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume * 0.25, this.ctx.currentTime, 0.04);
    }
    this.emit();
  }

  private playNote(freq: number, waveform: OscillatorType, durationSec: number) {
    if (!this.ctx || !this.gainNode) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const env = this.ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(freq, now);

    env.gain.setValueAtTime(0.001, now);
    env.gain.exponentialRampToValueAtTime(0.45, now + 0.04);
    env.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc.connect(env);
    env.connect(this.gainNode);

    osc.start(now);
    osc.stop(now + durationSec + 0.02);
  }

  public play() {
    this.ensureContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.startLoop();
    this.emit();
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.emit();
  }

  public toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    this.trackIndex = (this.trackIndex + 1) % SYNTH_TRACKS.length;
    this.stepIndex = 0;
    if (this.isPlaying) {
      this.startLoop();
    }
    this.emit();
  }

  public prevTrack() {
    this.trackIndex = (this.trackIndex - 1 + SYNTH_TRACKS.length) % SYNTH_TRACKS.length;
    this.stepIndex = 0;
    if (this.isPlaying) {
      this.startLoop();
    }
    this.emit();
  }

  public selectTrack(idx: number) {
    this.trackIndex = idx % SYNTH_TRACKS.length;
    this.stepIndex = 0;
    if (!this.isPlaying) {
      this.play();
    } else {
      this.startLoop();
    }
    this.emit();
  }

  private startLoop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
    }
    const track = SYNTH_TRACKS[this.trackIndex];
    const stepMs = Math.round((60 / track.bpm) * 500);
    const trigger = () => {
      const freq = track.notes[this.stepIndex % track.notes.length];
      this.playNote(freq, track.waveform, (stepMs / 1000) * 1.4);
      this.stepIndex = (this.stepIndex + 1) % track.notes.length;
      this.emit();
    };
    trigger();
    this.intervalId = window.setInterval(trigger, stepMs);
  }

  public playTactileClick(enabled: boolean) {
    if (!enabled) return;
    try {
      this.ensureContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const env = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.018);
      env.gain.setValueAtTime(0.06, now);
      env.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      osc.connect(env);
      env.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore audio policy errors before gesture
    }
  }
}

export const soundEngine = new LauncherSoundEngine();
