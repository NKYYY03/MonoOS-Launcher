import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Copy, Check } from 'lucide-react';
import { WALLPAPERS } from '../../data/launcherData';
import { CalendarEventItem, CapturedPhoto } from '../../types/launcher';

/* ---------- Calendar App ---------- */
interface CalendarAppProps {
  events: CalendarEventItem[];
  onAddEvent: (title: string, time: string, dayOffset: number) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarApp: React.FC<CalendarAppProps> = ({
  events,
  onAddEvent,
  onDeleteEvent,
}) => {
  const [selectedOffset, setSelectedOffset] = useState(0);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      offset: i,
      dow: d.toLocaleDateString([], { weekday: 'short' }).slice(0, 1),
      num: d.getDate(),
    };
  });

  const dayEvents = events.filter((e) => e.dayOffset === selectedOffset);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddEvent(title.trim(), time, selectedOffset);
    setTitle('');
  };

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-4">
      <div className="grid grid-cols-7 gap-1 mb-5">
        {days.map((d) => (
          <button
            key={d.offset}
            type="button"
            onClick={() => setSelectedOffset(d.offset)}
            className={`py-2 rounded-2xl flex flex-col items-center gap-1 transition-colors ${
              selectedOffset === d.offset
                ? 'bg-[#D71921] text-white'
                : 'bg-black/4 dark:bg-white/6'
            }`}
          >
            <span className="text-[10px] opacity-75">{d.dow}</span>
            <span className="font-mono-tabular text-sm font-semibold">{d.num}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleCreate} className="flex gap-2 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New event..."
          className="flex-1 h-10 px-3 rounded-xl bg-black/5 dark:bg-white/8 text-sm focus:outline-none"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="h-10 px-2 rounded-xl bg-black/5 dark:bg-white/8 font-mono-tabular text-xs focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Add event"
          className="w-10 h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center"
        >
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
        {dayEvents.length === 0 ? (
          <div className="py-10 text-center text-xs text-zinc-500">
            Clear schedule for this day
          </div>
        ) : (
          dayEvents.map((ev) => (
            <div
              key={ev.id}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-black/4 dark:bg-white/6"
            >
              <div>
                <div className="font-mono-tabular text-xs text-[#D71921] font-medium">
                  {ev.time}
                </div>
                <div className="text-sm font-semibold mt-0.5">{ev.title}</div>
              </div>
              <button
                type="button"
                onClick={() => onDeleteEvent(ev.id)}
                aria-label="Delete event"
                className="p-1.5 text-zinc-400 hover:text-[#D71921]"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

/* ---------- Photos Gallery App ---------- */
interface GalleryAppProps {
  photos: CapturedPhoto[];
  onDeletePhoto: (id: string) => void;
  onSetWallpaper: (wpId: string) => void;
}

export const GalleryApp: React.FC<GalleryAppProps> = ({
  photos,
  onDeletePhoto,
  onSetWallpaper,
}) => {
  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-5 overflow-y-auto no-scrollbar space-y-5">
      <div>
        <div className="text-xs font-semibold text-zinc-500 mb-2">
          Camera Captures ({photos.length})
        </div>
        {photos.length === 0 ? (
          <div className="rounded-2xl bg-black/4 dark:bg-white/6 p-6 text-center text-xs text-zinc-500">
            Photos taken in Camera appear here
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {photos.map((p) => (
              <div key={p.id} className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-900">
                <img src={p.dataUrl} alt="Captured" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white">
                  <span className="text-[10px] font-mono-tabular">{p.capturedAt}</span>
                  <button
                    type="button"
                    onClick={() => onDeletePhoto(p.id)}
                    aria-label="Delete photo"
                    className="p-1 hover:text-[#D71921]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-xs font-semibold text-zinc-500 mb-2">Studio Wallpapers</div>
        <div className="grid grid-cols-3 gap-2">
          {WALLPAPERS.filter((w) => w.imageSrc).map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => onSetWallpaper(w.id)}
              className="relative rounded-2xl overflow-hidden aspect-[9/16] group"
            >
              <img
                src={w.imageSrc}
                alt={w.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 p-1.5 bg-black/60 text-[10px] text-white truncate">
                Use
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------- Clipboard / Scratchpad App ---------- */
export const FilesClipboardApp: React.FC = () => {
  const [text, setText] = useState(() => localStorage.getItem('monoos_clip') || '');
  const [copied, setCopied] = useState(false);

  const handleChange = (val: string) => {
    setText(val);
    localStorage.setItem('monoos_clip', val);
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-zinc-500">Persistent Scratchpad · {text.length} chars</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/6 dark:bg-white/10 text-xs font-medium"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Paste links, snippets, or quick thoughts here. Automatically saved offline..."
        className="flex-1 w-full p-4 rounded-2xl bg-black/4 dark:bg-white/6 border border-black/6 dark:border-white/10 text-sm leading-relaxed resize-none focus:outline-none focus:border-[#D71921]"
      />
    </div>
  );
};

/* ---------- Unit Converter App ---------- */
export const UnitConverterApp: React.FC = () => {
  const [val, setVal] = useState('10');
  const [mode, setMode] = useState<'km-mi' | 'c-f' | 'kg-lb'>('km-mi');
  const num = parseFloat(val) || 0;

  const converted =
    mode === 'km-mi'
      ? `${(num * 0.621371).toFixed(2)} mi`
      : mode === 'c-f'
      ? `${((num * 9) / 5 + 32).toFixed(1)} °F`
      : `${(num * 2.20462).toFixed(2)} lb`;

  const inputUnit = mode === 'km-mi' ? 'km' : mode === 'c-f' ? '°C' : 'kg';

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-5 space-y-5">
      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/5 dark:bg-white/8">
        {[
          { id: 'km-mi' as const, label: 'km → mi' },
          { id: 'c-f' as const, label: '°C → °F' },
          { id: 'kg-lb' as const, label: 'kg → lb' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`py-2 rounded-lg text-xs font-medium ${
              mode === m.id
                ? 'bg-white dark:bg-zinc-800 shadow-sm'
                : 'text-zinc-500'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl bg-black/4 dark:bg-white/6 p-5 space-y-4">
        <div>
          <label className="text-xs text-zinc-500">Input ({inputUnit})</label>
          <input
            type="number"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            className="w-full mt-1 bg-transparent font-mono-tabular text-4xl font-semibold focus:outline-none"
          />
        </div>
        <div className="h-px bg-black/8 dark:bg-white/10" />
        <div>
          <div className="text-xs text-zinc-500">Result</div>
          <div className="font-dot text-4xl font-mono-tabular text-[#D71921] mt-1">
            {converted}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- Breathe Focus App ---------- */
export const BreatheApp: React.FC = () => {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [sec, setSec] = useState(4);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setSec((prev) => {
        if (prev > 1) return prev - 1;
        setPhase((p) => {
          if (p === 'Inhale') {
            setSec(7);
            return 'Hold';
          }
          if (p === 'Hold') {
            setSec(8);
            return 'Exhale';
          }
          setSec(4);
          return 'Inhale';
        });
        return 4;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="flex flex-col h-full items-center justify-between px-6 py-8">
      <div className="text-center">
        <div className="text-xs text-zinc-500">4-7-8 Cadence</div>
        <h3 className="font-dot text-2xl mt-1">{active ? phase : 'Ready'}</h3>
      </div>

      <div className="relative flex items-center justify-center w-48 h-48">
        <div
          className="absolute inset-0 rounded-full border-2 border-[#D71921]/40 transition-transform duration-1000 ease-in-out"
          style={{
            transform: active
              ? phase === 'Inhale' || phase === 'Hold'
                ? 'scale(1.15)'
                : 'scale(0.75)'
              : 'scale(0.9)',
          }}
        />
        <div className="font-dot text-5xl font-mono-tabular">{active ? sec : '—'}</div>
      </div>

      <button
        type="button"
        onClick={() => {
          if (!active) {
            setPhase('Inhale');
            setSec(4);
          }
          setActive((v) => !v);
        }}
        className="w-full h-12 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold active:scale-[0.98] transition-transform"
      >
        {active ? 'Stop Session' : 'Start Breathing'}
      </button>
    </div>
  );
};
