import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, ArrowUpRight, Sparkles, Lock, Moon } from 'lucide-react';
import { APP_CATALOG } from '../data/launcherData';
import { AnimFeel, AppId, IconStyle } from '../types/launcher';
import { AppIcon } from './AppIcon';

interface SpotlightSearchProps {
  iconStyle: IconStyle;
  animFeel: AnimFeel;
  onClose: () => void;
  onLaunchApp: (appId: AppId) => void;
  onToggleTheme: () => void;
  onLockScreen: () => void;
}

function trySafeMath(input: string): string | null {
  const cleaned = input.trim();
  if (!cleaned || !/^[0-9+\-*/().\s]+$/.test(cleaned)) return null;
  if (!/[+\-*/]/.test(cleaned)) return null;
  try {
    const fn = new Function(`"use strict"; return (${cleaned});`);
    const result = fn();
    if (typeof result === 'number' && Number.isFinite(result)) {
      return Number.isInteger(result) ? String(result) : result.toFixed(4).replace(/\.?0+$/, '');
    }
    return null;
  } catch {
    return null;
  }
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  iconStyle,
  animFeel,
  onClose,
  onLaunchApp,
  onToggleTheme,
  onLockScreen,
}) => {
  const [query, setQuery] = useState('');

  const mathResult = useMemo(() => trySafeMath(query), [query]);

  const filteredApps = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return APP_CATALOG.slice(0, 8);
    return APP_CATALOG.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.category.toLowerCase().includes(q) ||
        app.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      onClick={onClose}
      className="absolute inset-0 z-50 bg-black/55 backdrop-blur-2xl p-4 pt-12 flex flex-col"
    >
      <motion.div
        initial={{ y: -20, scale: 0.97, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={{ y: -16, scale: 0.97, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col gap-4 max-h-full"
      >
        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-4 h-12 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/15 shadow-lg">
          <Search className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, math (24*15), or web..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Instant Math Result */}
        {mathResult !== null && (
          <div className="rounded-2xl bg-white/85 dark:bg-zinc-900/85 border border-black/10 dark:border-white/15 px-4 py-3 flex items-center justify-between text-zinc-900 dark:text-zinc-100">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Calculation</span>
            <span className="font-mono-tabular text-2xl font-semibold text-[#D71921]">
              = {mathResult}
            </span>
          </div>
        )}

        {/* Matching Apps */}
        <div className="rounded-[24px] bg-white/85 dark:bg-zinc-900/85 border border-black/10 dark:border-white/15 p-4">
          <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mb-3">
            {query ? 'Matching Apps' : 'Quick Access'}
          </div>
          {filteredApps.length > 0 ? (
            <div className="grid grid-cols-4 gap-y-4 gap-x-2">
              {filteredApps.slice(0, 8).map((app) => (
                <AppIcon
                  key={app.id}
                  app={app}
                  iconStyle={iconStyle}
                  animFeel={animFeel}
                  size="sm"
                  onLaunch={(id) => {
                    onClose();
                    onLaunchApp(id);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-zinc-500">
              No local apps matching &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Quick Actions / Web Search */}
        <div className="rounded-[24px] bg-white/85 dark:bg-zinc-900/85 border border-black/10 dark:border-white/15 divide-y divide-black/6 dark:divide-white/8 overflow-hidden text-zinc-900 dark:text-zinc-100">
          {query.trim() && (
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(query.trim())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-3.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <span>Search Google for &ldquo;{query.trim()}&rdquo;</span>
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              onToggleTheme();
              onClose();
            }}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
          >
            <span className="flex items-center gap-2.5">
              <Moon className="w-4 h-4 text-zinc-500" />
              Switch Light / OLED Dark Theme
            </span>
            <Sparkles className="w-4 h-4 text-zinc-400" />
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onLockScreen();
            }}
            className="w-full flex items-center justify-between px-4 py-3.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
          >
            <span className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-zinc-500" />
              Lock Screen
            </span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
