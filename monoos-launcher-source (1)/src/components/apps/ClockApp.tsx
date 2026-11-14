import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

interface ClockAppProps {
  now: Date;
  timerSecondsLeft: number | null;
  timerRunning: boolean;
  onStartTimer: (seconds: number) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
}

function formatSec(totalSec: number) {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export const ClockApp: React.FC<ClockAppProps> = ({
  now,
  timerSecondsLeft,
  timerRunning,
  onStartTimer,
  onToggleTimer,
  onResetTimer,
}) => {
  const [tab, setTab] = useState<'timer' | 'world' | 'stopwatch'>('timer');
  const [swMs, setSwMs] = useState(0);
  const [swRunning, setSwRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    if (!swRunning) return;
    const start = Date.now() - swMs;
    const id = window.setInterval(() => {
      setSwMs(Date.now() - start);
    }, 45);
    return () => window.clearInterval(id);
  }, [swRunning]);

  const formatSw = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    const centis = Math.floor((ms % 1000) / 10);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centis
      .toString()
      .padStart(2, '0')}`;
  };

  const cities = [
    { name: 'Local Time', tz: undefined },
    { name: 'London', tz: 'Europe/London' },
    { name: 'Tokyo', tz: 'Asia/Tokyo' },
    { name: 'New York', tz: 'America/New_York' },
  ];

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-4">
      <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/8 self-center mb-5">
        {(['timer', 'stopwatch', 'world'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              tab === t
                ? 'bg-white dark:bg-zinc-800 shadow-sm text-zinc-900 dark:text-white'
                : 'text-zinc-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'timer' && (
        <div className="flex-1 flex flex-col items-center justify-between py-4">
          <div className="text-center">
            <div className="text-xs text-zinc-500">Focus Countdown · Synced to Capsule</div>
            <div className="font-dot text-6xl font-mono-tabular mt-4">
              {formatSec(timerSecondsLeft ?? 1500)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: '5m', sec: 300 },
              { label: '15m', sec: 900 },
              { label: '25m', sec: 1500 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => onStartTimer(p.sec)}
                className="px-4 py-2 rounded-xl bg-black/5 dark:bg-white/8 hover:bg-black/10 dark:hover:bg-white/14 text-xs font-mono-tabular font-medium"
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onResetTimer}
              aria-label="Reset timer"
              className="w-12 h-12 rounded-full bg-black/8 dark:bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (timerSecondsLeft === null) onStartTimer(1500);
                else onToggleTimer();
              }}
              aria-label={timerRunning ? 'Pause timer' : 'Start timer'}
              className="w-16 h-16 rounded-full bg-[#D71921] text-white flex items-center justify-center shadow-lg shadow-[#D71921]/25 active:scale-90 transition-transform"
            >
              {timerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
          </div>
        </div>
      )}

      {tab === 'stopwatch' && (
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="text-center py-6">
            <div className="font-dot text-5xl font-mono-tabular">{formatSw(swMs)}</div>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 my-2">
            {laps.map((lap, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-black/4 dark:bg-white/6 text-xs font-mono-tabular"
              >
                <span className="text-zinc-500">Lap {laps.length - i}</span>
                <span>{formatSw(lap)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                if (swRunning) {
                  setLaps((prev) => [swMs, ...prev]);
                } else {
                  setSwMs(0);
                  setLaps([]);
                }
              }}
              className="w-12 h-12 rounded-full bg-black/8 dark:bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
              aria-label={swRunning ? 'Record lap' : 'Reset stopwatch'}
            >
              {swRunning ? <Flag className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={() => setSwRunning((v) => !v)}
              className="w-16 h-16 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center active:scale-90 transition-transform"
              aria-label={swRunning ? 'Stop' : 'Start'}
            >
              {swRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
          </div>
        </div>
      )}

      {tab === 'world' && (
        <div className="space-y-2.5 overflow-y-auto no-scrollbar">
          {cities.map((c) => {
            const t = now.toLocaleTimeString([], {
              timeZone: c.tz,
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            });
            return (
              <div
                key={c.name}
                className="flex items-center justify-between p-4 rounded-2xl bg-black/4 dark:bg-white/6"
              >
                <span className="text-sm font-semibold">{c.name}</span>
                <span className="font-dot text-2xl font-mono-tabular">{t}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
