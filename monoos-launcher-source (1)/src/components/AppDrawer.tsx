import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, Plus, Check, X, ExternalLink } from 'lucide-react';
import { APP_CATALOG } from '../data/launcherData';
import { AnimFeel, AppCategory, AppId, IconStyle, NativeAndroidApp } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface AppDrawerProps {
  iconStyle: IconStyle;
  animFeel: AnimFeel;
  homeAppIds: Set<AppId>;
  onClose: () => void;
  onLaunchApp: (appId: AppId) => void;
  onTogglePinToHome: (appId: AppId) => void;
}

const CATEGORIES: ('All' | AppCategory)[] = [
  'All',
  'Communication',
  'Utilities',
  'Media',
  'Web',
  'System',
];

export const AppDrawer: React.FC<AppDrawerProps> = ({
  iconStyle,
  animFeel,
  homeAppIds,
  onClose,
  onLaunchApp,
  onTogglePinToHome,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'All' | AppCategory>('All');
  const [pinMode, setPinMode] = useState(false);

  const nativeApps = useMemo<NativeAndroidApp[]>(() => {
    if (!window.AndroidBridge?.getInstalledApps) return [];
    try {
      const parsed = JSON.parse(window.AndroidBridge.getInstalledApps()) as NativeAndroidApp[];
      const q = query.trim().toLowerCase();
      return parsed
        .filter((a) => !q || a.label.toLowerCase().includes(q))
        .sort((a, b) => a.label.localeCompare(b.label));
    } catch {
      return [];
    }
  }, [query]);

  const apps = useMemo(() => {
    const q = query.trim().toLowerCase();
    return APP_CATALOG.filter((app) => {
      const catMatch = category === 'All' || app.category === category;
      const queryMatch =
        !q ||
        app.name.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q);
      return catMatch && queryMatch;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, category]);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 360, damping: 34, mass: 0.9 }}
      className="absolute inset-0 z-40 bg-zinc-100/92 dark:bg-zinc-950/92 backdrop-blur-2xl text-zinc-900 dark:text-zinc-100 flex flex-col pt-10 pb-5 px-4"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-dot text-lg tracking-wider">APP LIBRARY</h2>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {apps.length + nativeApps.length} modules
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPinMode((v) => !v)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
              pinMode
                ? 'bg-[#D71921] text-white'
                : 'bg-black/6 dark:bg-white/10 text-zinc-700 dark:text-zinc-200'
            }`}
          >
            {pinMode ? 'Done' : 'Pin to Home'}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close App Library"
            className="w-9 h-9 rounded-full bg-black/6 dark:bg-white/10 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 h-10 rounded-xl bg-black/5 dark:bg-white/8 border border-black/6 dark:border-white/10 mb-3">
        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter installed apps..."
          className="w-full bg-transparent text-sm focus:outline-none placeholder:text-zinc-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors ${
              category === cat
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                : 'bg-black/5 dark:bg-white/8 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* App Grid */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-2 pb-6">
        <div className="grid grid-cols-4 gap-y-5 gap-x-2">
          {apps.map((app) => {
            const isPinned = homeAppIds.has(app.id);
            return (
              <div key={app.id} className="relative flex flex-col items-center">
                <AppIcon
                  app={app}
                  iconStyle={iconStyle}
                  animFeel={animFeel}
                  onLaunch={(id) => {
                    if (pinMode) {
                      onTogglePinToHome(id);
                    } else {
                      onClose();
                      onLaunchApp(id);
                    }
                  }}
                />
                {pinMode && (
                  <button
                    type="button"
                    onClick={() => onTogglePinToHome(app.id)}
                    aria-label={isPinned ? `Unpin ${app.name}` : `Pin ${app.name}`}
                    className={`absolute -top-1 right-1.5 w-5 h-5 rounded-full flex items-center justify-center shadow ${
                      isPinned
                        ? 'bg-emerald-500 text-white'
                        : 'bg-zinc-800 text-white border border-white/20'
                    }`}
                  >
                    {isPinned ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {nativeApps.length > 0 && (
          <div className="mt-6 pt-4 border-t border-black/8 dark:border-white/10">
            <div className="text-[11px] font-semibold text-zinc-500 mb-3">
              Device Android Apps ({nativeApps.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {nativeApps.map((na) => (
                <button
                  key={na.packageName}
                  type="button"
                  onClick={() => window.AndroidBridge?.launchApp(na.packageName)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-2xl bg-black/5 dark:bg-white/6 hover:bg-black/10 dark:hover:bg-white/10 text-left transition-colors"
                >
                  <span className="text-xs font-medium truncate pr-2">{na.label}</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Gesture Handle */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Return to Home Screen"
        className="mx-auto pt-2 pb-1 px-10"
      >
        <div className="w-28 h-1 rounded-full bg-zinc-400/50 dark:bg-white/30" />
      </button>
    </motion.div>
  );
};
