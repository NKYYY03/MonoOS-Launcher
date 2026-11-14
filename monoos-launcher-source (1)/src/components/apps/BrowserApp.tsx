import React, { useState } from 'react';
import { Globe, Plus, ExternalLink, Trash2 } from 'lucide-react';
import { CustomShortcut } from '../../types/launcher';

interface BrowserAppProps {
  shortcuts: CustomShortcut[];
  onAddShortcut: (name: string, url: string) => void;
  onRemoveShortcut: (id: string) => void;
}

const DEFAULT_LINKS = [
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'YouTube', url: 'https://m.youtube.com' },
  { name: 'Maps', url: 'https://maps.google.com' },
  { name: 'Wikipedia', url: 'https://en.m.wikipedia.org' },
];

export const BrowserApp: React.FC<BrowserAppProps> = ({
  shortcuts,
  onAddShortcut,
  onRemoveShortcut,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [shortcutName, setShortcutName] = useState('');
  const [shortcutUrl, setShortcutUrl] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const [pendingUrl, setPendingUrl] = useState<string | null>(null);

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = urlInput.trim();
    if (!raw) return;
    const isUrl = /^https?:\/\//i.test(raw) || /^[a-z0-9-]+\.[a-z]{2,}/i.test(raw);
    const target = isUrl
      ? /^https?:\/\//i.test(raw)
        ? raw
        : `https://${raw}`
      : `https://www.google.com/search?q=${encodeURIComponent(raw)}`;
    setPendingUrl(target);
  };

  const handleCreateShortcut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shortcutName.trim() || !shortcutUrl.trim()) return;
    const formatted = /^https?:\/\//i.test(shortcutUrl.trim())
      ? shortcutUrl.trim()
      : `https://${shortcutUrl.trim()}`;
    onAddShortcut(shortcutName.trim(), formatted);
    setShortcutName('');
    setShortcutUrl('');
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-5 overflow-y-auto no-scrollbar">
      <form onSubmit={handleGo} className="flex gap-2 mb-5">
        <div className="flex-1 flex items-center gap-2 px-3.5 h-11 rounded-2xl bg-black/5 dark:bg-white/8 border border-black/8 dark:border-white/10">
          <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Search Google or enter URL..."
            className="w-full bg-transparent text-sm focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="px-4 h-11 rounded-2xl bg-[#D71921] text-white text-xs font-semibold active:scale-95 transition-transform"
        >
          Go
        </button>
      </form>

      {pendingUrl && (
        <a
          href={pendingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-between p-3.5 rounded-2xl bg-[#D71921]/10 border border-[#D71921]/30 text-sm font-medium"
        >
          <span className="truncate pr-2">Open {pendingUrl}</span>
          <ExternalLink className="w-4 h-4 text-[#D71921] shrink-0" />
        </a>
      )}

      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-semibold text-zinc-500">Quick Launch</span>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1 text-xs font-medium text-[#D71921]"
        >
          <Plus className="w-3.5 h-3.5" /> Add Bookmark
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleCreateShortcut}
          className="mb-4 p-3 rounded-2xl bg-black/5 dark:bg-white/6 space-y-2"
        >
          <input
            type="text"
            value={shortcutName}
            onChange={(e) => setShortcutName(e.target.value)}
            placeholder="Label (e.g. Spotify)"
            className="w-full h-9 px-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 text-xs focus:outline-none"
          />
          <input
            type="text"
            value={shortcutUrl}
            onChange={(e) => setShortcutUrl(e.target.value)}
            placeholder="URL (e.g. open.spotify.com)"
            className="w-full h-9 px-3 rounded-xl bg-white/80 dark:bg-zinc-900/80 text-xs focus:outline-none"
          />
          <button
            type="submit"
            className="w-full h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold"
          >
            Save Shortcut
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 gap-2.5 mb-5">
        {DEFAULT_LINKS.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-black/4 dark:bg-white/6 hover:bg-black/8 dark:hover:bg-white/10 transition-colors"
          >
            <span className="text-sm font-medium">{item.name}</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        ))}
      </div>

      {shortcuts.length > 0 && (
        <>
          <div className="text-xs font-semibold text-zinc-500 mb-2">Custom Shortcuts</div>
          <div className="space-y-2">
            {shortcuts.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-black/4 dark:bg-white/6"
              >
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-0 pr-2"
                >
                  <div className="text-sm font-medium truncate">{s.name}</div>
                  <div className="text-[11px] text-zinc-500 truncate">{s.url}</div>
                </a>
                <button
                  type="button"
                  onClick={() => onRemoveShortcut(s.id)}
                  aria-label="Delete shortcut"
                  className="p-1.5 text-zinc-400 hover:text-[#D71921]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
