import React from 'react';
import { motion } from 'motion/react';
import {
  Play,
  Pause,
  SkipForward,
  Check,
  Minus,
  Wifi,
  Bluetooth,
  Sun,
  Moon,
  ArrowUpRight,
} from 'lucide-react';
import {
  AppId,
  DeviceQuickState,
  NoteItem,
  ThemeMode,
  WidgetInstance,
} from '../types/launcher';
import { WeatherState } from '../hooks/useDeviceTelemetry';

interface WidgetsProps {
  widget: WidgetInstance;
  now: Date;
  weather: WeatherState;
  batteryLevel: number;
  isCharging: boolean;
  musicPlaying: boolean;
  musicTitle: string;
  musicArtist: string;
  notes: NoteItem[];
  stepsCount: number;
  theme: ThemeMode;
  quickState: DeviceQuickState;
  editMode: boolean;
  onRemoveWidget: (id: string) => void;
  onLaunchApp: (appId: AppId) => void;
  onToggleMusic: () => void;
  onNextTrack: () => void;
  onToggleNote: (noteId: string) => void;
  onIncrementSteps: () => void;
  onToggleQuickState: (key: 'wifi' | 'bluetooth') => void;
  onToggleTheme: () => void;
}

export const WidgetCard: React.FC<WidgetsProps> = ({
  widget,
  now,
  weather,
  batteryLevel,
  isCharging,
  musicPlaying,
  musicTitle,
  musicArtist,
  notes,
  stepsCount,
  theme,
  quickState,
  editMode,
  onRemoveWidget,
  onLaunchApp,
  onToggleMusic,
  onNextTrack,
  onToggleNote,
  onIncrementSteps,
  onToggleQuickState,
  onToggleTheme,
}) => {
  const timeFormatted = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const dateFormatted = now.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const colSpan = widget.size === '4x2' ? 'col-span-4' : 'col-span-2';
  const surfaceClass =
    'relative rounded-[24px] p-4 bg-white/75 dark:bg-zinc-900/75 backdrop-blur-2xl border border-black/8 dark:border-white/12 text-zinc-900 dark:text-zinc-100 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.3)] overflow-hidden select-none';

  const RemoveButton = editMode ? (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onRemoveWidget(widget.id);
      }}
      aria-label="Remove widget"
      className="absolute top-2.5 left-2.5 z-20 w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-white flex items-center justify-center shadow active:scale-90 transition-transform"
    >
      <Minus className="w-3.5 h-3.5" strokeWidth={2.6} />
    </button>
  ) : null;

  if (widget.type === 'clock-weather') {
    return (
      <motion.div
        layout
        whileTap={editMode ? undefined : { scale: 0.98 }}
        className={`${colSpan} ${surfaceClass} ${editMode ? 'animate-jiggle' : ''} flex items-center justify-between min-h-[128px]`}
      >
        {RemoveButton}
        <button
          type="button"
          onClick={() => !editMode && onLaunchApp('clock')}
          className="text-left focus:outline-none"
        >
          <div className="font-dot text-[42px] leading-none tracking-wider font-mono-tabular">
            {timeFormatted}
          </div>
          <div className="mt-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {dateFormatted}
          </div>
        </button>

        <button
          type="button"
          onClick={() => !editMode && onLaunchApp('weather')}
          className="text-right flex flex-col items-end focus:outline-none"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D71921]" />
            <span className="font-mono-tabular text-2xl font-semibold tracking-tight">
              {weather.tempC}°
            </span>
          </div>
          <span className="mt-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
            {weather.condition}
          </span>
          <span className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400">
            {weather.city} · H:{weather.highC}° L:{weather.lowC}°
          </span>
        </button>
      </motion.div>
    );
  }

  if (widget.type === 'media-capsule') {
    return (
      <motion.div
        layout
        className={`${colSpan} ${surfaceClass} ${editMode ? 'animate-jiggle' : ''} flex flex-col justify-between min-h-[138px]`}
      >
        {RemoveButton}
        <button
          type="button"
          onClick={() => !editMode && onLaunchApp('music')}
          className="flex items-start justify-between w-full text-left focus:outline-none"
        >
          <div className="min-w-0 pr-2">
            <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 truncate">
              {musicPlaying ? 'Playing' : 'Audio Deck'}
            </div>
            <div className="mt-0.5 text-xs font-semibold truncate">{musicTitle}</div>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
              {musicArtist}
            </div>
          </div>
          <div
            className={`w-7 h-7 rounded-full border border-black/15 dark:border-white/20 flex items-center justify-center shrink-0 ${
              musicPlaying ? 'animate-spin' : ''
            }`}
            style={{ animationDuration: '4s' }}
          >
            <div className="w-2 h-2 rounded-full bg-[#D71921]" />
          </div>
        </button>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMusic();
            }}
            aria-label={musicPlaying ? 'Pause audio' : 'Play audio'}
            className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center active:scale-90 transition-transform"
          >
            {musicPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onNextTrack();
            }}
            aria-label="Next track"
            className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  if (widget.type === 'activity-ring') {
    const goal = 8000;
    const pct = Math.min(1, stepsCount / goal);
    const r = 24;
    const circ = 2 * Math.PI * r;
    const dashOffset = circ * (1 - pct);

    return (
      <motion.div
        layout
        whileTap={editMode ? undefined : { scale: 0.97 }}
        onClick={() => !editMode && onIncrementSteps()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !editMode) {
            e.preventDefault();
            onIncrementSteps();
          }
        }}
        className={`${colSpan} ${surfaceClass} ${editMode ? 'animate-jiggle' : ''} flex flex-col justify-between min-h-[138px] cursor-pointer`}
      >
        {RemoveButton}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            Daily Steps
          </span>
          <span className="text-[10px] font-mono-tabular text-zinc-500 dark:text-zinc-400">
            {Math.round(pct * 100)}%
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 my-1">
          <svg className="w-14 h-14 -rotate-90 shrink-0" viewBox="0 0 60 60">
            <circle
              cx="30"
              cy="30"
              r={r}
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.12"
              strokeWidth="5"
            />
            <circle
              cx="30"
              cy="30"
              r={r}
              fill="none"
              stroke="#D71921"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={dashOffset}
              className="transition-all duration-300"
            />
          </svg>
          <div className="text-right">
            <div className="font-mono-tabular text-xl font-semibold leading-none">
              {stepsCount.toLocaleString()}
            </div>
            <div className="mt-1 text-[10px] text-zinc-500 dark:text-zinc-400">
              Tap +250 · Goal 8k
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (widget.type === 'quick-notes') {
    const visibleNotes = notes.slice(0, 3);
    return (
      <motion.div
        layout
        className={`${colSpan} ${surfaceClass} ${editMode ? 'animate-jiggle' : ''} min-h-[138px] flex flex-col justify-between`}
      >
        {RemoveButton}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold tracking-tight">Quick Notes</span>
          <button
            type="button"
            onClick={() => !editMode && onLaunchApp('messages')}
            className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-0.5"
          >
            Open <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-1.5">
          {visibleNotes.map((note) => (
            <button
              key={note.id}
              type="button"
              onClick={() => !editMode && onToggleNote(note.id)}
              className="w-full flex items-center gap-2.5 text-left py-0.5 group"
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  note.done
                    ? 'bg-[#D71921] border-[#D71921] text-white'
                    : 'border-zinc-400 dark:border-zinc-600'
                }`}
              >
                {note.done && <Check className="w-2.5 h-2.5" strokeWidth={3} />}
              </span>
              <span
                className={`text-xs truncate ${
                  note.done
                    ? 'line-through text-zinc-400 dark:text-zinc-500'
                    : 'text-zinc-800 dark:text-zinc-200'
                }`}
              >
                {note.text}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  // system-vitals
  return (
    <motion.div
      layout
      className={`${colSpan} ${surfaceClass} ${editMode ? 'animate-jiggle' : ''} min-h-[124px] flex flex-col justify-between`}
    >
      {RemoveButton}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Power & Links</div>
          <div className="font-mono-tabular text-lg font-semibold">
            {batteryLevel}% {isCharging ? '· Charging' : ''}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => !editMode && onToggleQuickState('wifi')}
            aria-label="Toggle Wi-Fi"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              quickState.wifi
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-black/5 dark:bg-white/10 text-zinc-500'
            }`}
          >
            <Wifi className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => !editMode && onToggleQuickState('bluetooth')}
            aria-label="Toggle Bluetooth"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${
              quickState.bluetooth
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-black/5 dark:bg-white/10 text-zinc-500'
            }`}
          >
            <Bluetooth className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => !editMode && onToggleTheme()}
            aria-label="Toggle Theme"
            className="w-10 h-10 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mt-3 h-1.5 w-full rounded-full bg-black/8 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-[#D71921] transition-all duration-300"
          style={{ width: `${batteryLevel}%` }}
        />
      </div>
    </motion.div>
  );
};
