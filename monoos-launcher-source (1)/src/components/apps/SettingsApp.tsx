import React from 'react';
import { Download, RotateCcw, Plus, Check } from 'lucide-react';
import { WALLPAPERS } from '../../data/launcherData';
import { AnimFeel, IconStyle, LauncherConfig, ThemeMode, WidgetType } from '../../types/launcher';

interface SettingsAppProps {
  config: LauncherConfig;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onUpdateConfig: (patch: Partial<LauncherConfig>) => void;
  onAddWidget: (type: WidgetType) => void;
  onInstallPWA: () => void;
  onResetLayout: () => void;
}

const WIDGET_OPTIONS: { type: WidgetType; label: string; size: '2x2' | '4x2' }[] = [
  { type: 'clock-weather', label: 'Dot Clock & Weather', size: '4x2' },
  { type: 'media-capsule', label: 'Audio Capsule', size: '2x2' },
  { type: 'activity-ring', label: 'Activity Ring', size: '2x2' },
  { type: 'quick-notes', label: 'Quick Notes', size: '4x2' },
  { type: 'system-vitals', label: 'Power & Links', size: '4x2' },
];

export const SettingsApp: React.FC<SettingsAppProps> = ({
  config,
  isInstallable,
  isInstalled,
  isIOS,
  onUpdateConfig,
  onAddWidget,
  onInstallPWA,
  onResetLayout,
}) => {
  const isNativeApk = typeof window !== 'undefined' && !!window.AndroidBridge;

  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-6 overflow-y-auto no-scrollbar space-y-5">
      {isNativeApk && (
        <div className="rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-4">
          <div className="text-xs font-semibold">Native Android Launcher</div>
          <p className="text-[11px] opacity-75 mt-1 leading-relaxed">
            Set MonoOS as your default Home app in Android System Settings.
          </p>
          <button
            type="button"
            onClick={() => window.AndroidBridge?.openHomeSettings()}
            className="mt-3 w-full h-10 rounded-xl bg-[#D71921] text-white text-xs font-semibold"
          >
            Set Default Home App
          </button>
        </div>
      )}

      {/* Install to Phone Banner */}
      {!isInstalled && !isNativeApk && (
        <div className="rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 p-4">
          <div className="text-xs font-semibold">Run Fullscreen on Your Phone</div>
          <p className="text-[11px] opacity-75 mt-1 leading-relaxed">
            {isInstallable
              ? 'Install MonoOS directly to your Android home screen for standalone gesture launch.'
              : isIOS
              ? 'Tap Share in Safari → Add to Home Screen to launch fullscreen.'
              : 'Open Chrome menu (⋮) → Add to Home screen / Install app on your Android phone.'}
          </p>
          {isInstallable && (
            <button
              type="button"
              onClick={onInstallPWA}
              className="mt-3 w-full h-10 rounded-xl bg-[#D71921] text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install Launcher App</span>
            </button>
          )}
        </div>
      )}

      {/* Download Full Project ZIP (with Android APK project) */}
      {!isNativeApk && (
        <a
          href="./monoos-launcher-source.zip"
          download="monoos-launcher-source.zip"
          className="w-full h-11 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Download className="w-4 h-4" />
          <span>Download Source ZIP (GitHub + APK)</span>
        </a>
      )}

      {/* Theme & Icon Pack */}
      <section className="space-y-2.5">
        <h4 className="text-xs font-semibold text-zinc-500">Appearance</h4>
        <div className="grid grid-cols-2 gap-2">
          {(['dark', 'light'] as ThemeMode[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onUpdateConfig({ theme: t })}
              className={`h-11 rounded-xl text-xs font-semibold capitalize border transition-colors ${
                config.theme === t
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 border-transparent'
                  : 'bg-black/4 dark:bg-white/6 border-black/6 dark:border-white/10'
              }`}
            >
              {t === 'dark' ? 'OLED Dark' : 'Alabaster Light'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'nothing-mono', label: 'Nothing Mono' },
              { id: 'ios-glass', label: 'iOS Frosted' },
            ] as { id: IconStyle; label: string }[]
          ).map((pack) => (
            <button
              key={pack.id}
              type="button"
              onClick={() => onUpdateConfig({ iconStyle: pack.id })}
              className={`h-11 rounded-xl text-xs font-semibold border transition-colors ${
                config.iconStyle === pack.id
                  ? 'border-[#D71921] bg-[#D71921]/10 text-[#D71921]'
                  : 'bg-black/4 dark:bg-white/6 border-black/6 dark:border-white/10'
              }`}
            >
              {pack.label}
            </button>
          ))}
        </div>
      </section>

      {/* Wallpapers */}
      <section className="space-y-2.5">
        <h4 className="text-xs font-semibold text-zinc-500">Wallpaper</h4>
        <div className="grid grid-cols-3 gap-2">
          {WALLPAPERS.map((wp) => {
            const active = config.wallpaperId === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() =>
                  onUpdateConfig({
                    wallpaperId: wp.id,
                    theme: wp.recommendedTheme,
                  })
                }
                className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                  active ? 'border-[#D71921] scale-[0.98]' : 'border-transparent'
                }`}
              >
                {wp.imageSrc ? (
                  <img
                    src={wp.imageSrc}
                    alt={wp.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${wp.cssClass}`} />
                )}
                <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent text-left">
                  <div className="text-[10px] font-medium text-white truncate">{wp.name}</div>
                </div>
                {active && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#D71921] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Physics & Grid */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-500">Motion & Grid</h4>
        <div className="rounded-2xl bg-black/4 dark:bg-white/6 divide-y divide-black/6 dark:divide-white/8">
          <div className="flex items-center justify-between px-3.5 py-3">
            <span className="text-xs font-medium">Animation Physics</span>
            <div className="flex gap-1">
              {(
                [
                  { id: 'ios-spring', label: 'iOS Spring' },
                  { id: 'snappy', label: 'Snappy' },
                ] as { id: AnimFeel; label: string }[]
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onUpdateConfig({ animFeel: m.id })}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                    config.animFeel === m.id
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'text-zinc-500'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onUpdateConfig({ showLabels: !config.showLabels })}
            className="w-full flex items-center justify-between px-3.5 py-3 text-left"
          >
            <span className="text-xs font-medium">Show App Labels</span>
            <span className="text-xs font-mono-tabular text-[#D71921]">
              {config.showLabels ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateConfig({ soundFeedback: !config.soundFeedback })}
            className="w-full flex items-center justify-between px-3.5 py-3 text-left"
          >
            <span className="text-xs font-medium">Tactile Audio Click</span>
            <span className="text-xs font-mono-tabular text-[#D71921]">
              {config.soundFeedback ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      </section>

      {/* Add Widget */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold text-zinc-500">Add Home Widget</h4>
        <div className="space-y-1.5">
          {WIDGET_OPTIONS.map((w) => (
            <button
              key={w.type}
              type="button"
              onClick={() => onAddWidget(w.type)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-black/4 dark:bg-white/6 hover:bg-black/8 dark:hover:bg-white/10 transition-colors text-left"
            >
              <div>
                <div className="text-xs font-medium">{w.label}</div>
                <div className="text-[10px] text-zinc-500 font-mono-tabular">{w.size}</div>
              </div>
              <Plus className="w-4 h-4 text-[#D71921]" />
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onResetLayout}
        className="w-full h-11 rounded-xl border border-black/10 dark:border-white/15 text-xs font-semibold flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-300"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset Default Layout</span>
      </button>
    </div>
  );
};
