import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { SYNTH_TRACKS } from '../../utils/soundEngine';

interface MusicAppProps {
  isPlaying: boolean;
  trackIndex: number;
  stepIndex: number;
  volume: number;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectTrack: (idx: number) => void;
  onSetVolume: (v: number) => void;
}

export const MusicApp: React.FC<MusicAppProps> = ({
  isPlaying,
  trackIndex,
  stepIndex,
  volume,
  onToggle,
  onNext,
  onPrev,
  onSelectTrack,
  onSetVolume,
}) => {
  const track = SYNTH_TRACKS[trackIndex];

  return (
    <div className="flex flex-col h-full justify-between px-5 pt-2 pb-5">
      {/* Turntable / Dot Matrix Disc */}
      <div className="flex flex-col items-center pt-2">
        <div
          className={`relative w-44 h-44 rounded-full bg-zinc-950 border border-white/15 shadow-2xl flex items-center justify-center ${
            isPlaying ? 'animate-spin' : ''
          }`}
          style={{ animationDuration: '8s' }}
        >
          <div className="w-32 h-32 rounded-full border border-dashed border-white/25 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-[#D71921]" />
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <h3 className="text-lg font-semibold tracking-tight">{track.title}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            {track.artist} · {track.bpm} BPM
          </p>
        </div>

        {/* Live Generative Waveform */}
        <div className="flex items-end gap-1.5 h-8 mt-4">
          {track.notes.map((n, i) => {
            const active = isPlaying && stepIndex === i;
            const height = 25 + ((n % 120) / 120) * 75;
            return (
              <div
                key={i}
                className={`w-2 rounded-full transition-all duration-150 ${
                  active ? 'bg-[#D71921]' : 'bg-zinc-400/40 dark:bg-white/20'
                }`}
                style={{ height: `${isPlaying ? (active ? 100 : height * 0.75) : 30}%` }}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous track"
            className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/8 flex items-center justify-center active:scale-90 transition-transform"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={onToggle}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next track"
            className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/8 flex items-center justify-center active:scale-90 transition-transform"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 px-2">
          <Volume2 className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => onSetVolume(Number(e.target.value))}
            aria-label="Synth volume"
            className="w-full accent-[#D71921] cursor-pointer"
          />
        </div>

        {/* Track Selector */}
        <div className="space-y-1">
          {SYNTH_TRACKS.map((t, idx) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTrack(idx)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors ${
                idx === trackIndex
                  ? 'bg-black/8 dark:bg-white/12 font-semibold'
                  : 'text-zinc-500 hover:bg-black/4 dark:hover:bg-white/6'
              }`}
            >
              <span>{t.title}</span>
              <span className="font-mono-tabular">{t.bpm} BPM</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
