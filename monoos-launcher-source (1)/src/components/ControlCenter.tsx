import React from 'react';
import { motion } from 'motion/react';
import {
  Wifi,
  Bluetooth,
  Signal,
  Moon,
  Sun,
  Flashlight,
  Lock,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Calculator,
  Camera,
  Timer,
  SlidersHorizontal,
  Volume2,
  X,
} from 'lucide-react';
import { AppId, DeviceQuickState, ThemeMode } from '../types/launcher';

interface ControlCenterProps {
  quickState: DeviceQuickState;
  theme: ThemeMode;
  musicPlaying: boolean;
  musicTitle: string;
  musicArtist: string;
  onClose: () => void;
  onToggleState: (key: keyof Pick<DeviceQuickState, 'wifi' | 'bluetooth' | 'cellular' | 'focusMode' | 'flashlight' | 'rotationLock'>) => void;
  onSetBrightness: (val: number) => void;
  onSetVolume: (val: number) => void;
  onToggleTheme: () => void;
  onToggleMusic: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onLaunchApp: (appId: AppId) => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  quickState,
  theme,
  musicPlaying,
  musicTitle,
  musicArtist,
  onClose,
  onToggleState,
  onSetBrightness,
  onSetVolume,
  onToggleTheme,
  onToggleMusic,
  onNextTrack,
  onPrevTrack,
  onLaunchApp,
}) => {
  const tileBase =
    'rounded-[24px] bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl border border-black/8 dark:border-white/12 p-3.5 text-zinc-900 dark:text-zinc-100';

  const circleBtn = (active: boolean) =>
    `w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${
      active
        ? 'bg-[#D71921] text-white shadow-md shadow-[#D71921]/25'
        : 'bg-black/8 dark:bg-white/10 text-zinc-700 dark:text-zinc-200'
    }`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/45 backdrop-blur-xl flex flex-col justify-between p-4 pt-12 pb-6"
    >
      <motion.div
        initial={{ y: -36, scale: 0.96, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: -28, scale: 0.96, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="space-y-3"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-1 text-white">
          <span className="font-dot text-sm tracking-wider">CONTROL CENTER</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Control Center"
            className="w-8 h-8 rounded-full bg-white/12 flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Row: Connectivity + Audio Deck */}
        <div className="grid grid-cols-2 gap-3">
          {/* Connectivity 2x2 */}
          <div className={`${tileBase} grid grid-cols-2 gap-2.5 place-items-center`}>
            <button
              type="button"
              onClick={() => onToggleState('cellular')}
              aria-label="Cellular"
              className={circleBtn(quickState.cellular)}
            >
              <Signal className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleState('wifi')}
              aria-label="Wi-Fi"
              className={circleBtn(quickState.wifi)}
            >
              <Wifi className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleState('bluetooth')}
              aria-label="Bluetooth"
              className={circleBtn(quickState.bluetooth)}
            >
              <Bluetooth className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onToggleState('focusMode')}
              aria-label="Focus Mode"
              className={circleBtn(quickState.focusMode)}
            >
              <Moon className="w-5 h-5" />
            </button>
          </div>

          {/* Media Player */}
          <div className={`${tileBase} flex flex-col justify-between`}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onLaunchApp('music');
              }}
              className="text-left"
            >
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                {musicPlaying ? 'Now Playing' : 'Paused'}
              </div>
              <div className="mt-1 text-sm font-semibold truncate">{musicTitle}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                {musicArtist}
              </div>
            </button>
            <div className="flex items-center justify-between pt-3">
              <button
                type="button"
                onClick={onPrevTrack}
                aria-label="Previous track"
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-transform"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onToggleMusic}
                aria-label={musicPlaying ? 'Pause' : 'Play'}
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
                onClick={onNextTrack}
                aria-label="Next track"
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 active:scale-90 transition-transform"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Middle Row: Sliders & Toggles */}
        <div className="grid grid-cols-2 gap-3">
          {/* Quick Toggles */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className={`${tileBase} flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform`}
            >
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span className="text-[11px] font-medium">
                {theme === 'dark' ? 'Dark' : 'Light'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onToggleState('rotationLock')}
              className={`${tileBase} flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform ${
                quickState.rotationLock ? 'ring-1 ring-[#D71921]' : ''
              }`}
            >
              <Lock className="w-5 h-5" />
              <span className="text-[11px] font-medium">Orient</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleState('flashlight')}
              className={`${tileBase} col-span-2 flex items-center justify-center gap-2 py-3 active:scale-95 transition-transform ${
                quickState.flashlight ? 'bg-amber-400/90 text-zinc-950' : ''
              }`}
            >
              <Flashlight className="w-4 h-4" />
              <span className="text-xs font-semibold">
                {quickState.flashlight ? 'Torch Active' : 'Flashlight'}
              </span>
            </button>
          </div>

          {/* Brightness & Volume Bars */}
          <div className={`${tileBase} flex flex-col justify-between gap-3`}>
            <div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1.5">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5" /> Display
                </span>
                <span className="font-mono-tabular">{quickState.brightness}%</span>
              </div>
              <input
                type="range"
                min={35}
                max={100}
                value={quickState.brightness}
                onChange={(e) => onSetBrightness(Number(e.target.value))}
                aria-label="Screen brightness"
                className="w-full accent-[#D71921] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 mb-1.5">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> Audio
                </span>
                <span className="font-mono-tabular">{quickState.volume}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={quickState.volume}
                onChange={(e) => onSetVolume(Number(e.target.value))}
                aria-label="Audio volume"
                className="w-full accent-[#D71921] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Bottom Quick Launchers */}
        <div className="grid grid-cols-4 gap-3 pt-1">
          {[
            { id: 'calculator' as AppId, label: 'Calc', icon: <Calculator className="w-5 h-5" /> },
            { id: 'clock' as AppId, label: 'Timer', icon: <Timer className="w-5 h-5" /> },
            { id: 'camera' as AppId, label: 'Camera', icon: <Camera className="w-5 h-5" /> },
            { id: 'settings' as AppId, label: 'MonoOS', icon: <SlidersHorizontal className="w-5 h-5" /> },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onClose();
                onLaunchApp(item.id);
              }}
              className={`${tileBase} flex flex-col items-center justify-center gap-1.5 py-3 active:scale-92 transition-transform`}
            >
              {item.icon}
              <span className="text-[11px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bottom dismiss indicator */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss Control Center"
        className="mx-auto py-2 px-8"
      >
        <div className="w-28 h-1 rounded-full bg-white/40" />
      </button>
    </motion.div>
  );
};
