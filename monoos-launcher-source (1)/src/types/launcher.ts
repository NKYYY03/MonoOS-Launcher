export type AppId =
  | 'phone'
  | 'messages'
  | 'browser'
  | 'camera'
  | 'calculator'
  | 'clock'
  | 'weather'
  | 'music'
  | 'calendar'
  | 'gallery'
  | 'settings'
  | 'files'
  | 'maps'
  | 'mail'
  | 'youtube'
  | 'github'
  | 'terminal'
  | 'focus';

export type AppCategory = 'Communication' | 'Utilities' | 'Media' | 'System' | 'Web';

export interface AppDefinition {
  id: AppId;
  name: string;
  category: AppCategory;
  accentHex: string;
  hasRedDotAccent?: boolean;
  externalUrl?: string;
  isBuiltIn: boolean;
  description: string;
}

export interface CustomShortcut {
  id: string;
  name: string;
  url: string;
}

export type WidgetType =
  | 'clock-weather'
  | 'media-capsule'
  | 'activity-ring'
  | 'quick-notes'
  | 'system-vitals';

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  page: number;
  size: '2x2' | '4x2';
}

export type ThemeMode = 'dark' | 'light';
export type IconStyle = 'nothing-mono' | 'ios-glass';
export type AnimFeel = 'ios-spring' | 'snappy';

export interface WallpaperOption {
  id: string;
  name: string;
  subtitle: string;
  imageSrc?: string;
  cssClass?: string;
  recommendedTheme: ThemeMode;
}

export interface NotificationItem {
  id: string;
  appId: AppId;
  appName: string;
  title: string;
  body: string;
  timeLabel: string;
  unread: boolean;
}

export interface NoteItem {
  id: string;
  text: string;
  done: boolean;
  createdAt: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  time: string;
  dayOffset: number;
}

export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  capturedAt: string;
}

export interface LauncherConfig {
  theme: ThemeMode;
  iconStyle: IconStyle;
  wallpaperId: string;
  gridColumns: 4 | 5;
  showLabels: boolean;
  animFeel: AnimFeel;
  soundFeedback: boolean;
  dockAppIds: AppId[];
  homePages: AppId[][];
  widgets: WidgetInstance[];
}

export interface DeviceQuickState {
  wifi: boolean;
  bluetooth: boolean;
  cellular: boolean;
  focusMode: boolean;
  flashlight: boolean;
  rotationLock: boolean;
  brightness: number; // 35 - 100
  volume: number; // 0 - 100
}

export interface NativeAndroidApp {
  packageName: string;
  label: string;
}

declare global {
  interface Window {
    AndroidBridge?: {
      getInstalledApps: () => string;
      launchApp: (packageName: string) => boolean;
      openHomeSettings: () => void;
    };
  }
}

