import React, { useEffect, useState } from 'react';
import {
  Lock,
  SlidersHorizontal,
  Search,
  LayoutGrid,
  Download,
  BellPlus,
  Maximize2,
  Minimize2,
  Smartphone,
} from 'lucide-react';
import {
  DEFAULT_CONFIG,
  INITIAL_EVENTS,
  INITIAL_NOTES,
  INITIAL_NOTIFICATIONS,
  WALLPAPERS,
} from './data/launcherData';
import {
  AppId,
  CalendarEventItem,
  CapturedPhoto,
  CustomShortcut,
  DeviceQuickState,
  LauncherConfig,
  NoteItem,
  NotificationItem,
  WidgetType,
} from './types/launcher';
import { useDeviceTelemetry } from './hooks/useDeviceTelemetry';
import { usePWAInstall } from './hooks/usePWAInstall';
import { soundEngine } from './utils/soundEngine';
import { PhoneViewport } from './components/PhoneViewport';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [config, setConfig] = useState<LauncherConfig>(() =>
    loadStored('monoos_config_v1', DEFAULT_CONFIG)
  );
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    loadStored('monoos_notes_v1', INITIAL_NOTES)
  );
  const [events, setEvents] = useState<CalendarEventItem[]>(() =>
    loadStored('monoos_events_v1', INITIAL_EVENTS)
  );
  const [photos, setPhotos] = useState<CapturedPhoto[]>(() =>
    loadStored('monoos_photos_v1', [])
  );
  const [shortcuts, setShortcuts] = useState<CustomShortcut[]>(() =>
    loadStored('monoos_shortcuts_v1', [])
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [stepsCount, setStepsCount] = useState<number>(() =>
    loadStored('monoos_steps_v1', 5420)
  );

  const [quickState, setQuickState] = useState<DeviceQuickState>({
    wifi: true,
    bluetooth: true,
    cellular: true,
    focusMode: false,
    flashlight: false,
    rotationLock: false,
    brightness: 100,
    volume: 45,
  });

  const [isLocked, setIsLocked] = useState(false);
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeAppId, setActiveAppId] = useState<AppId | null>(null);
  const [desktopFullscreen, setDesktopFullscreen] = useState(false);

  // Synced live timer (visible in Dynamic Capsule)
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  // Music engine sync
  const [musicState, setMusicState] = useState(() => soundEngine.getState());
  useEffect(() => {
    return soundEngine.subscribe(() => {
      setMusicState(soundEngine.getState());
    });
  }, []);

  // Android hardware back gesture listener (inside native APK)
  useEffect(() => {
    const onBack = () => {
      if (isLocked) return;
      if (showControlCenter) {
        setShowControlCenter(false);
      } else if (showSpotlight) {
        setShowSpotlight(false);
      } else if (showDrawer) {
        setShowDrawer(false);
      } else if (activeAppId) {
        setActiveAppId(null);
      }
    };
    window.addEventListener('monoos-back', onBack);
    return () => window.removeEventListener('monoos-back', onBack);
  }, [isLocked, showControlCenter, showSpotlight, showDrawer, activeAppId]);

  // Telemetry & PWA
  const {
    now,
    batteryLevel,
    isCharging,
    isOnline,
    weather,
    fetchWeatherForCoords,
    requestLocalWeather,
  } = useDeviceTelemetry();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  // Persist user customizations locally
  useEffect(() => {
    localStorage.setItem('monoos_config_v1', JSON.stringify(config));
    document.documentElement.classList.toggle('dark', config.theme === 'dark');
  }, [config]);

  useEffect(() => {
    localStorage.setItem('monoos_notes_v1', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('monoos_events_v1', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('monoos_photos_v1', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('monoos_shortcuts_v1', JSON.stringify(shortcuts));
  }, [shortcuts]);

  useEffect(() => {
    localStorage.setItem('monoos_steps_v1', JSON.stringify(stepsCount));
  }, [stepsCount]);

  // Countdown timer tick
  useEffect(() => {
    if (!timerRunning || timerSecondsLeft === null) return;
    if (timerSecondsLeft <= 0) {
      setTimerRunning(false);
      setTimerSecondsLeft(null);
      setNotifications((prev) => [
        {
          id: `n-${Date.now()}`,
          appId: 'clock',
          appName: 'Clock',
          title: 'Focus Timer Complete',
          body: 'Your countdown session has finished.',
          timeLabel: 'Now',
          unread: true,
        },
        ...prev,
      ]);
      return;
    }
    const id = window.setTimeout(() => {
      setTimerSecondsLeft((s) => (s !== null ? s - 1 : null));
    }, 1000);
    return () => window.clearTimeout(id);
  }, [timerRunning, timerSecondsLeft]);

  const updateConfig = (patch: Partial<LauncherConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  };

  const handleLaunchApp = (appId: AppId) => {
    soundEngine.playTactileClick(config.soundFeedback);
    setShowControlCenter(false);
    setShowSpotlight(false);
    setShowDrawer(false);
    setActiveAppId(appId);
  };

  const handleCloseApp = () => {
    soundEngine.playTactileClick(config.soundFeedback);
    setActiveAppId(null);
  };

  const handleRemoveHomeApp = (appId: AppId) => {
    setConfig((prev) => ({
      ...prev,
      homePages: prev.homePages.map((pg) => pg.filter((id) => id !== appId)),
    }));
  };

  const handleTogglePinToHome = (appId: AppId) => {
    setConfig((prev) => {
      const exists = prev.homePages.some((pg) => pg.includes(appId));
      if (exists) {
        return {
          ...prev,
          homePages: prev.homePages.map((pg) => pg.filter((id) => id !== appId)),
        };
      }
      const nextPages = [...prev.homePages];
      const targetIdx = nextPages[0].length < 8 ? 0 : 1;
      nextPages[targetIdx] = [...nextPages[targetIdx], appId];
      return { ...prev, homePages: nextPages };
    });
  };

  const handleAddWidget = (type: WidgetType) => {
    const size = type === 'media-capsule' || type === 'activity-ring' ? '2x2' : '4x2';
    setConfig((prev) => ({
      ...prev,
      widgets: [
        ...prev.widgets,
        { id: `w-${Date.now()}`, type, page: 0, size },
      ],
    }));
  };

  const handleRemoveWidget = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      widgets: prev.widgets.filter((w) => w.id !== id),
    }));
  };

  const handleToggleQuickState = (
    key: keyof Pick<
      DeviceQuickState,
      'wifi' | 'bluetooth' | 'cellular' | 'focusMode' | 'flashlight' | 'rotationLock'
    >
  ) => {
    soundEngine.playTactileClick(config.soundFeedback);
    setQuickState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const triggerSampleNotification = () => {
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        appId: 'messages',
        appName: 'Notes & SMS',
        title: 'Launcher Ready',
        body: 'Pull down or tap Lock Screen to test interactive notifications.',
        timeLabel: 'Now',
        unread: true,
      },
      ...prev,
    ]);
    setIsLocked(true);
  };

  const phoneElement = (
    <PhoneViewport
      config={config}
      now={now}
      batteryLevel={batteryLevel}
      isCharging={isCharging}
      isOnline={isOnline}
      weather={weather}
      quickState={quickState}
      notifications={notifications}
      notes={notes}
      events={events}
      photos={photos}
      shortcuts={shortcuts}
      stepsCount={stepsCount}
      musicState={musicState}
      timerSecondsLeft={timerSecondsLeft}
      timerRunning={timerRunning}
      isLocked={isLocked}
      showControlCenter={showControlCenter}
      showSpotlight={showSpotlight}
      showDrawer={showDrawer}
      activeAppId={activeAppId}
      isInstallable={isInstallable}
      isInstalled={isInstalled}
      isIOS={isIOS}
      onSetLocked={setIsLocked}
      onSetControlCenter={setShowControlCenter}
      onSetSpotlight={setShowSpotlight}
      onSetDrawer={setShowDrawer}
      onLaunchApp={handleLaunchApp}
      onCloseApp={handleCloseApp}
      onUpdateConfig={updateConfig}
      onRemoveHomeApp={handleRemoveHomeApp}
      onTogglePinToHome={handleTogglePinToHome}
      onAddWidget={handleAddWidget}
      onRemoveWidget={handleRemoveWidget}
      onToggleQuickState={handleToggleQuickState}
      onSetBrightness={(v) => setQuickState((p) => ({ ...p, brightness: v }))}
      onSetVolume={(v) => {
        setQuickState((p) => ({ ...p, volume: v }));
        soundEngine.setVolume(v / 100);
      }}
      onDismissNotification={(id) =>
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }
      onClearNotifications={() => setNotifications([])}
      onAddNote={(text) =>
        setNotes((prev) => [
          { id: `note-${Date.now()}`, text, done: false, createdAt: 'Now' },
          ...prev,
        ])
      }
      onToggleNote={(id) =>
        setNotes((prev) =>
          prev.map((n) => (n.id === id ? { ...n, done: !n.done } : n))
        )
      }
      onDeleteNote={(id) => setNotes((prev) => prev.filter((n) => n.id !== id))}
      onAddEvent={(title, time, dayOffset) =>
        setEvents((prev) => [...prev, { id: `ev-${Date.now()}`, title, time, dayOffset }])
      }
      onDeleteEvent={(id) => setEvents((prev) => prev.filter((e) => e.id !== id))}
      onCapturePhoto={(pic) => setPhotos((prev) => [pic, ...prev])}
      onDeletePhoto={(id) => setPhotos((prev) => prev.filter((p) => p.id !== id))}
      onAddShortcut={(name, url) =>
        setShortcuts((prev) => [...prev, { id: `sc-${Date.now()}`, name, url }])
      }
      onRemoveShortcut={(id) =>
        setShortcuts((prev) => prev.filter((s) => s.id !== id))
      }
      onIncrementSteps={() => setStepsCount((s) => s + 250)}
      onToggleMusic={() => soundEngine.toggle()}
      onNextTrack={() => soundEngine.nextTrack()}
      onPrevTrack={() => soundEngine.prevTrack()}
      onSelectTrack={(idx) => soundEngine.selectTrack(idx)}
      onSetMusicVolume={(v) => soundEngine.setVolume(v)}
      onStartTimer={(sec) => {
        setTimerSecondsLeft(sec);
        setTimerRunning(true);
      }}
      onToggleTimer={() => setTimerRunning((v) => !v)}
      onResetTimer={() => {
        setTimerRunning(false);
        setTimerSecondsLeft(null);
      }}
      onRequestLocalWeather={requestLocalWeather}
      onSelectCityWeather={(lat, lon, city) =>
        fetchWeatherForCoords(lat, lon, city, 'default')
      }
      onInstallPWA={install}
      onResetLayout={() => setConfig(DEFAULT_CONFIG)}
    />
  );

  // If user is on mobile (< 1024px) or launched as installed PWA or toggled desktopFullscreen:
  // Render 100% edge-to-edge phone launcher!
  if (isInstalled || desktopFullscreen) {
    return (
      <main className="relative w-screen h-dvh overflow-hidden bg-zinc-950">
        {phoneElement}
        {desktopFullscreen && (
          <button
            type="button"
            onClick={() => setDesktopFullscreen(false)}
            className="hidden lg:flex fixed top-4 right-4 z-50 items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900/85 text-white border border-white/15 text-xs font-medium backdrop-blur-md hover:bg-zinc-800"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Fullscreen</span>
          </button>
        )}
      </main>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-zinc-100 dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Mobile / Tablet: Pure edge-to-edge launcher */}
      <main className="lg:hidden w-screen h-dvh overflow-hidden">{phoneElement}</main>

      {/* Desktop Studio: Full-viewport interactive phone + live companion controls */}
      <div className="hidden lg:grid max-w-6xl mx-auto min-h-dvh grid-cols-[1fr_380px] gap-12 items-center px-8 py-6">
        {/* Left/Center: Interactive Device Frame */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-[382px] h-[796px] max-h-[88dvh] rounded-[48px] p-2.5 bg-zinc-800 dark:bg-zinc-900 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.65)] ring-1 ring-black/15 dark:ring-white/15">
            <div className="w-full h-full rounded-[39px] overflow-hidden relative bg-black">
              {phoneElement}
            </div>
          </div>
        </div>

        {/* Right: Minimalist Launcher Customizer & Android Phone Guide */}
        <aside className="space-y-7">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <span>Android Home Replacement</span>
              <span aria-hidden="true">·</span>
              <span>iOS Spring Physics</span>
            </div>
            <h1 className="font-dot text-4xl tracking-tight mt-2 text-zinc-900 dark:text-white">
              MonoOS Launcher
            </h1>
            <p className="mt-2.5 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Lightweight Nothing-inspired monochrome restraint paired with fluid iOS spring
              transitions, Dynamic Capsule, Control Center, and live widgets.
            </p>
          </div>

          {/* Quick System Actions */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-zinc-500">Test System Gestures</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowControlCenter((v) => !v)}
                className="h-11 px-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:border-[#D71921] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D71921]" />
                <span>Control Center</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSpotlight((v) => !v)}
                className="h-11 px-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:border-[#D71921] transition-colors"
              >
                <Search className="w-4 h-4 text-[#D71921]" />
                <span>Spotlight</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDrawer((v) => !v)}
                className="h-11 px-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:border-[#D71921] transition-colors"
              >
                <LayoutGrid className="w-4 h-4 text-[#D71921]" />
                <span>App Library</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLocked((v) => !v)}
                className="h-11 px-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/10 text-xs font-medium flex items-center gap-2 hover:border-[#D71921] transition-colors"
              >
                <Lock className="w-4 h-4 text-[#D71921]" />
                <span>Lock Screen</span>
              </button>
            </div>
          </div>

          {/* Instant Style Switcher */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-zinc-500">Theme & Icon Pack</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() =>
                  updateConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' })
                }
                className="h-10 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold"
              >
                {config.theme === 'dark' ? 'Switch to Light' : 'Switch to OLED Dark'}
              </button>
              <button
                type="button"
                onClick={() =>
                  updateConfig({
                    iconStyle:
                      config.iconStyle === 'nothing-mono' ? 'ios-glass' : 'nothing-mono',
                  })
                }
                className="h-10 rounded-xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/12 text-xs font-semibold"
              >
                {config.iconStyle === 'nothing-mono' ? 'Style: Nothing Mono' : 'Style: iOS Glass'}
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() =>
                    updateConfig({ wallpaperId: wp.id, theme: wp.recommendedTheme })
                  }
                  title={wp.name}
                  className={`w-11 h-14 rounded-xl overflow-hidden border-2 transition-transform ${
                    config.wallpaperId === wp.id
                      ? 'border-[#D71921] scale-105'
                      : 'border-transparent opacity-75 hover:opacity-100'
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
                </button>
              ))}
            </div>
          </div>

          {/* Phone Installation & Fullscreen */}
          <div className="pt-2 border-t border-black/8 dark:border-white/10 space-y-2.5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerSampleNotification}
                className="flex-1 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/10 text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <BellPlus className="w-3.5 h-3.5" />
                <span>Test Notification</span>
              </button>
              <button
                type="button"
                onClick={() => setDesktopFullscreen(true)}
                className="flex-1 h-10 rounded-xl bg-white dark:bg-zinc-900 border border-black/8 dark:border-white/10 text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Fullscreen View</span>
              </button>
            </div>

            <a
              href="./monoos-launcher-source.zip"
              download="monoos-launcher-source.zip"
              className="w-full h-11 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              <span>Download Project ZIP (GitHub + APK)</span>
            </a>

            {isInstallable ? (
              <button
                type="button"
                onClick={install}
                className="w-full h-11 rounded-xl bg-[#D71921] text-white text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Install MonoOS App</span>
              </button>
            ) : (
              <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-black/6 dark:border-white/10 text-xs text-zinc-600 dark:text-zinc-400">
                <Smartphone className="w-4 h-4 text-[#D71921] shrink-0 mt-0.5" />
                <span>
                  Open this URL on your Android phone in Chrome and choose{' '}
                  <strong className="text-zinc-900 dark:text-zinc-200">Add to Home screen</strong>{' '}
                  to run MonoOS fullscreen without browser bars.
                </span>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
