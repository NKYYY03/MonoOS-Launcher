import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flashlight, Camera, LockOpen, X } from 'lucide-react';
import { AppId, NotificationItem } from '../types/launcher';
import { WeatherState } from '../hooks/useDeviceTelemetry';

interface LockScreenProps {
  now: Date;
  weather: WeatherState;
  notifications: NotificationItem[];
  flashlightOn: boolean;
  onUnlock: () => void;
  onDismissNotification: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenFromNotification: (appId: AppId, notifId: string) => void;
  onToggleFlashlight: () => void;
  onOpenCamera: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  now,
  weather,
  notifications,
  flashlightOn,
  onUnlock,
  onDismissNotification,
  onClearAllNotifications,
  onOpenFromNotification,
  onToggleFlashlight,
  onOpenCamera,
}) => {
  const timeStr = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateStr = now.toLocaleDateString([], {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0.9 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      drag="y"
      dragConstraints={{ top: -220, bottom: 0 }}
      dragElastic={0.18}
      onDragEnd={(_, info) => {
        if (info.offset.y < -90 || info.velocity.y < -400) {
          onUnlock();
        }
      }}
      className="absolute inset-0 z-50 bg-zinc-950/88 backdrop-blur-2xl text-white flex flex-col justify-between px-5 pt-14 pb-6 select-none"
    >
      {/* Top Clock & Weather */}
      <div className="text-center">
        <div className="text-xs font-medium text-zinc-400">
          {dateStr} · {weather.tempC}° {weather.condition}
        </div>
        <div className="font-dot text-[74px] leading-none tracking-wider font-mono-tabular mt-2">
          {timeStr}
        </div>
      </div>

      {/* Notification Stack */}
      <div className="flex-1 my-6 overflow-y-auto no-scrollbar space-y-2.5">
        <div className="flex items-center justify-between px-1 mb-1">
          <span className="text-[11px] font-medium text-zinc-400">
            Notifications ({notifications.length})
          </span>
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAllNotifications}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 80 }}
              className="rounded-2xl bg-white/10 border border-white/12 p-3.5 backdrop-blur-xl flex items-start justify-between gap-3"
            >
              <button
                type="button"
                onClick={() => onOpenFromNotification(notif.appId, notif.id)}
                className="text-left flex-1 min-w-0"
              >
                <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                  <span className="font-semibold text-zinc-200">{notif.appName}</span>
                  <span>·</span>
                  <span>{notif.timeLabel}</span>
                </div>
                <div className="mt-0.5 text-sm font-semibold truncate">{notif.title}</div>
                <div className="text-xs text-zinc-300 line-clamp-2 mt-0.5">{notif.body}</div>
              </button>
              <button
                type="button"
                onClick={() => onDismissNotification(notif.id)}
                aria-label="Dismiss notification"
                className="p-1 text-zinc-400 hover:text-white shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {notifications.length === 0 && (
          <div className="py-10 text-center text-xs text-zinc-500">
            No pending notifications
          </div>
        )}
      </div>

      {/* Bottom Shortcuts & Swipe Up Bar */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={onToggleFlashlight}
            aria-label="Toggle Flashlight"
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              flashlightOn ? 'bg-amber-400 text-zinc-950' : 'bg-white/12 text-white'
            }`}
          >
            <Flashlight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onUnlock}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/16 text-xs font-medium transition-colors"
          >
            <LockOpen className="w-3.5 h-3.5" />
            <span>Swipe or Tap to Unlock</span>
          </button>

          <button
            type="button"
            onClick={onOpenCamera}
            aria-label="Open Camera"
            className="w-12 h-12 rounded-full bg-white/12 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-auto w-28 h-1 rounded-full bg-white/45" />
      </div>
    </motion.div>
  );
};
