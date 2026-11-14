import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Wifi, WifiOff, Disc3, Timer, Flashlight, Moon } from 'lucide-react';
import { AppId, DeviceQuickState } from '../types/launcher';

interface StatusBarProps {
  now: Date;
  batteryLevel: number;
  isCharging: boolean;
  isOnline: boolean;
  quickState: DeviceQuickState;
  musicPlaying: boolean;
  musicTitle: string;
  timerSecondsLeft: number | null;
  onOpenNotifications: () => void;
  onOpenControlCenter: () => void;
  onLaunchApp: (appId: AppId) => void;
}

function formatTimerPill(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  now,
  batteryLevel,
  isCharging,
  isOnline,
  quickState,
  musicPlaying,
  musicTitle,
  timerSecondsLeft,
  onOpenNotifications,
  onOpenControlCenter,
  onLaunchApp,
}) => {
  const timeStr = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const hasLiveCapsule =
    musicPlaying || timerSecondsLeft !== null || quickState.flashlight || quickState.focusMode;

  const handleCapsuleTap = () => {
    if (timerSecondsLeft !== null) {
      onLaunchApp('clock');
    } else if (musicPlaying) {
      onLaunchApp('music');
    } else {
      onOpenControlCenter();
    }
  };

  return (
    <header className="relative z-30 flex items-center justify-between px-5 pt-2.5 pb-1.5 select-none text-zinc-900 dark:text-zinc-100">
      {/* Left: Time -> tap opens Lock/Notification Shade */}
      <button
        type="button"
        onClick={onOpenNotifications}
        aria-label="Open notifications and lock screen"
        className="min-w-[48px] text-left font-mono-tabular text-[13px] font-semibold tracking-tight hover:opacity-75 transition-opacity"
      >
        {timeStr}
      </button>

      {/* Center: Dynamic Capsule (iOS Dynamic Island meets Nothing Dot Pill) */}
      <motion.button
        type="button"
        layout
        onClick={handleCapsuleTap}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
        className={`h-[26px] rounded-full bg-zinc-950 text-white border border-white/10 shadow-lg flex items-center justify-center overflow-hidden transition-colors ${
          hasLiveCapsule ? 'px-3 gap-2 max-w-[195px]' : 'w-[86px]'
        }`}
        aria-label="Live activity capsule"
      >
        <AnimatePresence mode="wait">
          {timerSecondsLeft !== null ? (
            <motion.span
              key="timer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1.5 text-[11px] font-mono-tabular whitespace-nowrap"
            >
              <Timer className="w-3 h-3 text-[#D71921]" />
              <span>{formatTimerPill(timerSecondsLeft)}</span>
            </motion.span>
          ) : musicPlaying ? (
            <motion.span
              key="music"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap truncate"
            >
              <Disc3 className="w-3 h-3 text-[#D71921] animate-spin" style={{ animationDuration: '3s' }} />
              <span className="truncate max-w-[120px]">{musicTitle}</span>
            </motion.span>
          ) : quickState.flashlight ? (
            <motion.span
              key="torch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap"
            >
              <Flashlight className="w-3 h-3 text-amber-400" />
              <span>Torch On</span>
            </motion.span>
          ) : quickState.focusMode ? (
            <motion.span
              key="focus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1.5 text-[11px] font-medium whitespace-nowrap"
            >
              <Moon className="w-3 h-3 text-indigo-400" />
              <span>Focus</span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full px-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 ring-1 ring-white/10" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Right: Signal, Wi-Fi, Battery -> tap opens Control Center */}
      <button
        type="button"
        onClick={onOpenControlCenter}
        aria-label="Open Control Center"
        className="flex items-center gap-1.5 min-w-[64px] justify-end hover:opacity-75 transition-opacity"
      >
        {isOnline && quickState.wifi ? (
          <Wifi className="w-3.5 h-3.5" strokeWidth={2.2} />
        ) : (
          <WifiOff className="w-3.5 h-3.5 opacity-55" strokeWidth={2.2} />
        )}
        <div className="flex items-center gap-1">
          <span className="font-mono-tabular text-[11px] font-medium">{batteryLevel}%</span>
          <div className="relative w-5 h-2.5 rounded-[3px] border border-current p-[1.5px] flex items-center">
            <div
              className={`h-full rounded-[1px] transition-all ${
                isCharging
                  ? 'bg-emerald-500'
                  : batteryLevel <= 20
                  ? 'bg-[#D71921]'
                  : 'bg-current'
              }`}
              style={{ width: `${Math.max(12, batteryLevel)}%` }}
            />
          </div>
        </div>
      </button>
    </header>
  );
};
