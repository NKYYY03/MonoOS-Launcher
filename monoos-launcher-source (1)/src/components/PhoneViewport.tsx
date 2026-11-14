import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Search,
  ChevronUp,
  Plus,
  Check,
  ExternalLink,
  X,
  LayoutGrid,
} from 'lucide-react';
import { APP_MAP, WALLPAPERS } from '../data/launcherData';
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
} from '../types/launcher';
import { WeatherState } from '../hooks/useDeviceTelemetry';
import { StatusBar } from './StatusBar';
import { AppIcon } from './AppIcon';
import { WidgetCard } from './Widgets';
import { ControlCenter } from './ControlCenter';
import { SpotlightSearch } from './SpotlightSearch';
import { AppDrawer } from './AppDrawer';
import { LockScreen } from './LockScreen';
import { PhoneApp } from './apps/PhoneApp';
import { MessagesNotesApp } from './apps/MessagesNotesApp';
import { CalculatorApp } from './apps/CalculatorApp';
import { ClockApp } from './apps/ClockApp';
import { WeatherApp } from './apps/WeatherApp';
import { MusicApp } from './apps/MusicApp';
import { CameraApp } from './apps/CameraApp';
import { BrowserApp } from './apps/BrowserApp';
import { SettingsApp } from './apps/SettingsApp';
import {
  BreatheApp,
  CalendarApp,
  FilesClipboardApp,
  GalleryApp,
  UnitConverterApp,
} from './apps/UtilityApps';

interface PhoneViewportProps {
  config: LauncherConfig;
  now: Date;
  batteryLevel: number;
  isCharging: boolean;
  isOnline: boolean;
  weather: WeatherState;
  quickState: DeviceQuickState;
  notifications: NotificationItem[];
  notes: NoteItem[];
  events: CalendarEventItem[];
  photos: CapturedPhoto[];
  shortcuts: CustomShortcut[];
  stepsCount: number;
  musicState: {
    isPlaying: boolean;
    trackIndex: number;
    stepIndex: number;
    volume: number;
    track: { title: string; artist: string };
  };
  timerSecondsLeft: number | null;
  timerRunning: boolean;
  isLocked: boolean;
  showControlCenter: boolean;
  showSpotlight: boolean;
  showDrawer: boolean;
  activeAppId: AppId | null;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onSetLocked: (v: boolean) => void;
  onSetControlCenter: (v: boolean) => void;
  onSetSpotlight: (v: boolean) => void;
  onSetDrawer: (v: boolean) => void;
  onLaunchApp: (appId: AppId) => void;
  onCloseApp: () => void;
  onUpdateConfig: (patch: Partial<LauncherConfig>) => void;
  onRemoveHomeApp: (appId: AppId) => void;
  onTogglePinToHome: (appId: AppId) => void;
  onAddWidget: (type: WidgetType) => void;
  onRemoveWidget: (id: string) => void;
  onToggleQuickState: (
    key: keyof Pick<
      DeviceQuickState,
      'wifi' | 'bluetooth' | 'cellular' | 'focusMode' | 'flashlight' | 'rotationLock'
    >
  ) => void;
  onSetBrightness: (v: number) => void;
  onSetVolume: (v: number) => void;
  onDismissNotification: (id: string) => void;
  onClearNotifications: () => void;
  onAddNote: (text: string) => void;
  onToggleNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onAddEvent: (title: string, time: string, dayOffset: number) => void;
  onDeleteEvent: (id: string) => void;
  onCapturePhoto: (photo: CapturedPhoto) => void;
  onDeletePhoto: (id: string) => void;
  onAddShortcut: (name: string, url: string) => void;
  onRemoveShortcut: (id: string) => void;
  onIncrementSteps: () => void;
  onToggleMusic: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  onSelectTrack: (idx: number) => void;
  onSetMusicVolume: (v: number) => void;
  onStartTimer: (sec: number) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onRequestLocalWeather: () => void;
  onSelectCityWeather: (lat: number, lon: number, name: string) => void;
  onInstallPWA: () => void;
  onResetLayout: () => void;
}

export const PhoneViewport: React.FC<PhoneViewportProps> = ({
  config,
  now,
  batteryLevel,
  isCharging,
  isOnline,
  weather,
  quickState,
  notifications,
  notes,
  events,
  photos,
  shortcuts,
  stepsCount,
  musicState,
  timerSecondsLeft,
  timerRunning,
  isLocked,
  showControlCenter,
  showSpotlight,
  showDrawer,
  activeAppId,
  isInstallable,
  isInstalled,
  isIOS,
  onSetLocked,
  onSetControlCenter,
  onSetSpotlight,
  onSetDrawer,
  onLaunchApp,
  onCloseApp,
  onUpdateConfig,
  onRemoveHomeApp,
  onTogglePinToHome,
  onAddWidget,
  onRemoveWidget,
  onToggleQuickState,
  onSetBrightness,
  onSetVolume,
  onDismissNotification,
  onClearNotifications,
  onAddNote,
  onToggleNote,
  onDeleteNote,
  onAddEvent,
  onDeleteEvent,
  onCapturePhoto,
  onDeletePhoto,
  onAddShortcut,
  onRemoveShortcut,
  onIncrementSteps,
  onToggleMusic,
  onNextTrack,
  onPrevTrack,
  onSelectTrack,
  onSetMusicVolume,
  onStartTimer,
  onToggleTimer,
  onResetTimer,
  onRequestLocalWeather,
  onSelectCityWeather,
  onInstallPWA,
  onResetLayout,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const wallpaper = useMemo(
    () => WALLPAPERS.find((w) => w.id === config.wallpaperId) ?? WALLPAPERS[0],
    [config.wallpaperId]
  );

  const homeAppIdsSet = useMemo(() => {
    const s = new Set<AppId>();
    config.homePages.forEach((pg) => pg.forEach((id) => s.add(id)));
    return s;
  }, [config.homePages]);

  const springPhysics =
    config.animFeel === 'ios-spring'
      ? { type: 'spring' as const, stiffness: 360, damping: 31, mass: 0.88 }
      : { type: 'spring' as const, stiffness: 560, damping: 38, mass: 0.68 };

  const activeApp = activeAppId ? APP_MAP[activeAppId] : null;
  const unreadCount = notifications.filter((n) => n.unread).length;

  const renderAppContent = (appId: AppId) => {
    const def = APP_MAP[appId];
    if (def && !def.isBuiltIn && def.externalUrl) {
      return (
        <div className="flex flex-col h-full items-center justify-center px-6 text-center space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-black/5 dark:bg-white/10 flex items-center justify-center">
            <ExternalLink className="w-7 h-7 text-[#D71921]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">{def.name}</h3>
            <p className="text-xs text-zinc-500 mt-1">{def.description}</p>
          </div>
          <a
            href={def.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[240px] h-12 rounded-2xl bg-[#D71921] text-white text-sm font-semibold flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            <span>Open {def.name}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      );
    }

    switch (appId) {
      case 'phone':
        return <PhoneApp />;
      case 'messages':
        return (
          <MessagesNotesApp
            notes={notes}
            onAddNote={onAddNote}
            onToggleNote={onToggleNote}
            onDeleteNote={onDeleteNote}
          />
        );
      case 'calculator':
        return <CalculatorApp />;
      case 'clock':
        return (
          <ClockApp
            now={now}
            timerSecondsLeft={timerSecondsLeft}
            timerRunning={timerRunning}
            onStartTimer={onStartTimer}
            onToggleTimer={onToggleTimer}
            onResetTimer={onResetTimer}
          />
        );
      case 'weather':
        return (
          <WeatherApp
            weather={weather}
            onRequestLocalWeather={onRequestLocalWeather}
            onSelectCity={onSelectCityWeather}
          />
        );
      case 'music':
        return (
          <MusicApp
            isPlaying={musicState.isPlaying}
            trackIndex={musicState.trackIndex}
            stepIndex={musicState.stepIndex}
            volume={musicState.volume}
            onToggle={onToggleMusic}
            onNext={onNextTrack}
            onPrev={onPrevTrack}
            onSelectTrack={onSelectTrack}
            onSetVolume={onSetMusicVolume}
          />
        );
      case 'camera':
        return (
          <CameraApp
            onCapturePhoto={onCapturePhoto}
            onOpenGallery={() => onLaunchApp('gallery')}
            recentPhoto={photos[0]}
          />
        );
      case 'browser':
        return (
          <BrowserApp
            shortcuts={shortcuts}
            onAddShortcut={onAddShortcut}
            onRemoveShortcut={onRemoveShortcut}
          />
        );
      case 'settings':
        return (
          <SettingsApp
            config={config}
            isInstallable={isInstallable}
            isInstalled={isInstalled}
            isIOS={isIOS}
            onUpdateConfig={onUpdateConfig}
            onAddWidget={(type) => {
              onAddWidget(type);
              onCloseApp();
            }}
            onInstallPWA={onInstallPWA}
            onResetLayout={onResetLayout}
          />
        );
      case 'calendar':
        return (
          <CalendarApp
            events={events}
            onAddEvent={onAddEvent}
            onDeleteEvent={onDeleteEvent}
          />
        );
      case 'gallery':
        return (
          <GalleryApp
            photos={photos}
            onDeletePhoto={onDeletePhoto}
            onSetWallpaper={(wpId) => {
              onUpdateConfig({ wallpaperId: wpId });
              onCloseApp();
            }}
          />
        );
      case 'files':
        return <FilesClipboardApp />;
      case 'terminal':
        return <UnitConverterApp />;
      case 'focus':
        return <BreatheApp />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`${
        config.theme === 'dark' ? 'dark' : ''
      } relative w-full h-full overflow-hidden select-none bg-zinc-950`}
    >
      {/* Wallpaper Layer with subtle parallax on page swipe */}
      <div className="absolute inset-0 overflow-hidden">
        {wallpaper.imageSrc ? (
          <motion.img
            src={wallpaper.imageSrc}
            alt={wallpaper.name}
            referrerPolicy="no-referrer"
            animate={{
              scale: activeAppId ? 1.08 : 1.03,
              x: currentPage === 0 ? 0 : -14,
            }}
            transition={springPhysics}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${wallpaper.cssClass}`} />
        )}
        {/* Measured scrim for daylight/OLED icon label legibility */}
        <div
          className={`absolute inset-0 transition-colors duration-300 ${
            config.theme === 'dark'
              ? 'bg-gradient-to-b from-black/25 via-transparent to-black/45'
              : 'bg-gradient-to-b from-white/15 via-transparent to-black/15'
          }`}
        />
      </div>

      {/* Main Home Canvas (scales subtly when an app is open like iOS) */}
      <motion.div
        animate={{
          scale: activeAppId ? 0.92 : 1,
          opacity: activeAppId ? 0.45 : 1,
          borderRadius: activeAppId ? 32 : 0,
        }}
        transition={springPhysics}
        className="relative z-10 flex flex-col w-full h-full"
      >
        {/* Top Status Bar & Dynamic Capsule */}
        <StatusBar
          now={now}
          batteryLevel={batteryLevel}
          isCharging={isCharging}
          isOnline={isOnline}
          quickState={quickState}
          musicPlaying={musicState.isPlaying}
          musicTitle={musicState.track.title}
          timerSecondsLeft={timerSecondsLeft}
          onOpenNotifications={() => onSetLocked(true)}
          onOpenControlCenter={() => onSetControlCenter(true)}
          onLaunchApp={onLaunchApp}
        />

        {/* Edit Mode Action Bar */}
        <AnimatePresence>
          {editMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-4 mt-1 px-3 py-1.5 rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-black/10 dark:border-white/15 flex items-center justify-between text-xs font-medium text-zinc-900 dark:text-white"
            >
              <button
                type="button"
                onClick={() => onAddWidget('quick-notes')}
                className="flex items-center gap-1 text-[#D71921] font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Widget
              </button>
              <span className="text-[11px] text-zinc-500">Editing Home</span>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex items-center gap-1 font-semibold"
              >
                <Check className="w-3.5 h-3.5" /> Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Paged Swipeable Home Screen */}
        <div className="flex-1 overflow-hidden relative">
          <motion.div
            className="flex h-full w-full"
            animate={{ x: `${-currentPage * 100}%` }}
            transition={springPhysics}
            drag="x"
            dragConstraints={{ left: -320, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -55 || info.velocity.x < -300) {
                setCurrentPage((p) => Math.min(config.homePages.length - 1, p + 1));
              } else if (info.offset.x > 55 || info.velocity.x > 300) {
                setCurrentPage((p) => Math.max(0, p - 1));
              }
            }}
          >
            {config.homePages.map((pageApps, pageIdx) => {
              const pageWidgets = config.widgets.filter((w) => w.page === pageIdx);
              return (
                <div
                  key={pageIdx}
                  className="w-full h-full shrink-0 px-4 pt-3 pb-2 overflow-y-auto no-scrollbar"
                >
                  {/* Widgets Grid (4 cols) */}
                  {pageWidgets.length > 0 && (
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {pageWidgets.map((w) => (
                        <WidgetCard
                          key={w.id}
                          widget={w}
                          now={now}
                          weather={weather}
                          batteryLevel={batteryLevel}
                          isCharging={isCharging}
                          musicPlaying={musicState.isPlaying}
                          musicTitle={musicState.track.title}
                          musicArtist={musicState.track.artist}
                          notes={notes}
                          stepsCount={stepsCount}
                          theme={config.theme}
                          quickState={quickState}
                          editMode={editMode}
                          onRemoveWidget={onRemoveWidget}
                          onLaunchApp={onLaunchApp}
                          onToggleMusic={onToggleMusic}
                          onNextTrack={onNextTrack}
                          onToggleNote={onToggleNote}
                          onIncrementSteps={onIncrementSteps}
                          onToggleQuickState={(key) => onToggleQuickState(key)}
                          onToggleTheme={() =>
                            onUpdateConfig({
                              theme: config.theme === 'dark' ? 'light' : 'dark',
                            })
                          }
                        />
                      ))}
                    </div>
                  )}

                  {/* App Grid */}
                  <div
                    className={`grid ${
                      config.gridColumns === 5 ? 'grid-cols-5' : 'grid-cols-4'
                    } gap-y-5 gap-x-2`}
                  >
                    {pageApps.map((appId) => {
                      const app = APP_MAP[appId];
                      if (!app) return null;
                      return (
                        <AppIcon
                          key={app.id}
                          app={app}
                          iconStyle={config.iconStyle}
                          showLabel={config.showLabels}
                          editMode={editMode}
                          animFeel={config.animFeel}
                          badgeCount={app.id === 'messages' ? unreadCount : 0}
                          onLaunch={onLaunchApp}
                          onLongPress={() => setEditMode(true)}
                          onRemove={onRemoveHomeApp}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Page Indicator + Spotlight Search Pill + App Library Trigger */}
        <div className="px-4 pb-2 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onSetSpotlight(true)}
            aria-label="Open Spotlight Search"
            className="flex-1 h-8 rounded-full bg-white/65 dark:bg-zinc-900/65 backdrop-blur-xl border border-black/8 dark:border-white/12 px-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 active:scale-96 transition-transform"
          >
            <Search className="w-3 h-3 opacity-70" />
            <span>Search</span>
          </button>

          {/* Page Dots */}
          <div className="flex items-center gap-1.5 px-2">
            {config.homePages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPage(idx)}
                aria-label={`Page ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  currentPage === idx
                    ? 'w-4 bg-[#D71921]'
                    : 'w-1.5 bg-zinc-400/60 dark:bg-white/35'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onSetDrawer(true)}
            aria-label="Open App Library"
            className="h-8 px-3 rounded-full bg-white/65 dark:bg-zinc-900/65 backdrop-blur-xl border border-black/8 dark:border-white/12 flex items-center gap-1 text-[11px] font-medium text-zinc-800 dark:text-zinc-200 active:scale-96 transition-transform"
          >
            <LayoutGrid className="w-3 h-3 opacity-70" />
            <span>Apps</span>
          </button>
        </div>

        {/* Frosted Glass Dock */}
        <div className="mx-3.5 mb-2 p-3 rounded-[28px] bg-white/65 dark:bg-zinc-900/65 backdrop-blur-2xl border border-black/8 dark:border-white/14 shadow-[0_14px_34px_-10px_rgba(0,0,0,0.4)]">
          <div className="grid grid-cols-4 gap-2">
            {config.dockAppIds.map((appId) => {
              const app = APP_MAP[appId];
              if (!app) return null;
              return (
                <AppIcon
                  key={app.id}
                  app={app}
                  iconStyle={config.iconStyle}
                  showLabel={false}
                  editMode={editMode}
                  animFeel={config.animFeel}
                  onLaunch={onLaunchApp}
                  onLongPress={() => setEditMode(true)}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Home Gesture Bar -> tap or swipe up opens App Drawer */}
        <button
          type="button"
          onClick={() => (editMode ? setEditMode(false) : onSetDrawer(true))}
          aria-label="Open App Drawer"
          className="mx-auto pb-2 pt-0.5 px-12 flex flex-col items-center group"
        >
          <ChevronUp className="w-3 h-3 text-zinc-500/70 dark:text-white/40 -mb-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-28 h-1 rounded-full bg-zinc-800/45 dark:bg-white/45" />
        </button>
      </motion.div>

      {/* Active App Window (iOS Spring Launch & Dismiss) */}
      <AnimatePresence>
        {activeApp && (
          <motion.div
            key={activeApp.id}
            initial={{ scale: 0.78, opacity: 0, borderRadius: 44 }}
            animate={{ scale: 1, opacity: 1, borderRadius: 0 }}
            exit={{ scale: 0.82, opacity: 0, borderRadius: 40 }}
            transition={springPhysics}
            className="absolute inset-0 z-35 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col overflow-hidden"
          >
            <StatusBar
              now={now}
              batteryLevel={batteryLevel}
              isCharging={isCharging}
              isOnline={isOnline}
              quickState={quickState}
              musicPlaying={musicState.isPlaying}
              musicTitle={musicState.track.title}
              timerSecondsLeft={timerSecondsLeft}
              onOpenNotifications={() => onSetLocked(true)}
              onOpenControlCenter={() => onSetControlCenter(true)}
              onLaunchApp={onLaunchApp}
            />

            {/* App Header */}
            <div className="flex items-center justify-between px-5 py-2.5 border-b border-black/6 dark:border-white/8">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D71921]" />
                <h2 className="font-dot text-base tracking-wider uppercase">{activeApp.name}</h2>
              </div>
              <button
                type="button"
                onClick={onCloseApp}
                aria-label="Close app"
                className="w-8 h-8 rounded-full bg-black/6 dark:bg-white/10 flex items-center justify-center hover:bg-black/12 dark:hover:bg-white/16 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* App Body */}
            <div className="flex-1 overflow-hidden">{renderAppContent(activeApp.id)}</div>

            {/* Bottom Home Bar inside App */}
            <motion.button
              type="button"
              onClick={onCloseApp}
              aria-label="Swipe or tap to return home"
              className="w-full py-2.5 flex items-center justify-center shrink-0"
            >
              <span className="w-28 h-1 rounded-full bg-zinc-400 dark:bg-white/35" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <AppDrawer
            iconStyle={config.iconStyle}
            animFeel={config.animFeel}
            homeAppIds={homeAppIdsSet}
            onClose={() => onSetDrawer(false)}
            onLaunchApp={onLaunchApp}
            onTogglePinToHome={onTogglePinToHome}
          />
        )}
      </AnimatePresence>

      {/* Spotlight Search */}
      <AnimatePresence>
        {showSpotlight && (
          <SpotlightSearch
            iconStyle={config.iconStyle}
            animFeel={config.animFeel}
            onClose={() => onSetSpotlight(false)}
            onLaunchApp={onLaunchApp}
            onToggleTheme={() =>
              onUpdateConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' })
            }
            onLockScreen={() => onSetLocked(true)}
          />
        )}
      </AnimatePresence>

      {/* Control Center */}
      <AnimatePresence>
        {showControlCenter && (
          <ControlCenter
            quickState={quickState}
            theme={config.theme}
            musicPlaying={musicState.isPlaying}
            musicTitle={musicState.track.title}
            musicArtist={musicState.track.artist}
            onClose={() => onSetControlCenter(false)}
            onToggleState={onToggleQuickState}
            onSetBrightness={onSetBrightness}
            onSetVolume={onSetVolume}
            onToggleTheme={() =>
              onUpdateConfig({ theme: config.theme === 'dark' ? 'light' : 'dark' })
            }
            onToggleMusic={onToggleMusic}
            onNextTrack={onNextTrack}
            onPrevTrack={onPrevTrack}
            onLaunchApp={onLaunchApp}
          />
        )}
      </AnimatePresence>

      {/* Lock Screen & Notification Shade */}
      <AnimatePresence>
        {isLocked && (
          <LockScreen
            now={now}
            weather={weather}
            notifications={notifications}
            flashlightOn={quickState.flashlight}
            onUnlock={() => onSetLocked(false)}
            onDismissNotification={onDismissNotification}
            onClearAllNotifications={onClearNotifications}
            onOpenFromNotification={(appId, notifId) => {
              onDismissNotification(notifId);
              onSetLocked(false);
              onLaunchApp(appId);
            }}
            onToggleFlashlight={() => onToggleQuickState('flashlight')}
            onOpenCamera={() => {
              onSetLocked(false);
              onLaunchApp('camera');
            }}
          />
        )}
      </AnimatePresence>

      {/* Flashlight Screen Illumination Overlay (useful on phones!) */}
      <AnimatePresence>
        {quickState.flashlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.16 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-50 bg-amber-100"
          />
        )}
      </AnimatePresence>

      {/* Hardware Display Brightness Simulation Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-50 bg-black transition-opacity duration-150"
        style={{ opacity: Math.max(0, (100 - quickState.brightness) / 130) }}
      />
    </div>
  );
};
