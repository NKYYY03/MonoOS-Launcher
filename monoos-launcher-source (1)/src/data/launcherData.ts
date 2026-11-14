import {
  AppDefinition,
  CalendarEventItem,
  LauncherConfig,
  NoteItem,
  NotificationItem,
  WallpaperOption,
} from '../types/launcher';

import obsidianFlowImg from '../assets/images/wallpaper_obsidian_flow_1794653529258.jpg';
import alabasterPrismImg from '../assets/images/wallpaper_alabaster_prism_1794653531075.jpg';
import redMonolithImg from '../assets/images/wallpaper_red_monolith_1794653531594.jpg';

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'obsidian-flow',
    name: 'Obsidian Flow',
    subtitle: 'Matte glass waves · Crimson edge',
    imageSrc: obsidianFlowImg,
    recommendedTheme: 'dark',
  },
  {
    id: 'red-monolith',
    name: 'Monolith Dot',
    subtitle: 'Perforated aluminum · Horizon line',
    imageSrc: redMonolithImg,
    recommendedTheme: 'dark',
  },
  {
    id: 'alabaster-prism',
    name: 'Alabaster Prism',
    subtitle: 'Ceramic ridges · Frosted light',
    imageSrc: alabasterPrismImg,
    recommendedTheme: 'light',
  },
  {
    id: 'pure-dot-dark',
    name: 'Zero Matrix Dark',
    subtitle: 'Pure OLED canvas · 14px dot grid',
    cssClass: 'bg-dot-matrix-dark',
    recommendedTheme: 'dark',
  },
  {
    id: 'pure-dot-light',
    name: 'Zero Matrix Light',
    subtitle: 'Paper alabaster · 14px dot grid',
    cssClass: 'bg-dot-matrix-light',
    recommendedTheme: 'light',
  },
];

export const APP_CATALOG: AppDefinition[] = [
  {
    id: 'phone',
    name: 'Phone',
    category: 'Communication',
    accentHex: '#22C55E',
    hasRedDotAccent: true,
    isBuiltIn: true,
    description: 'Keypad dialer & quick contacts',
  },
  {
    id: 'messages',
    name: 'Notes & SMS',
    category: 'Communication',
    accentHex: '#3B82F6',
    isBuiltIn: true,
    description: 'Scratchpad notes & SMS launcher',
  },
  {
    id: 'browser',
    name: 'Web',
    category: 'Web',
    accentHex: '#0EA5E9',
    isBuiltIn: true,
    description: 'Lightweight search & Android web shortcuts',
  },
  {
    id: 'camera',
    name: 'Camera',
    category: 'Media',
    accentHex: '#D71921',
    hasRedDotAccent: true,
    isBuiltIn: true,
    description: 'Instant viewfinder & monochrome shutter',
  },
  {
    id: 'clock',
    name: 'Clock',
    category: 'Utilities',
    accentHex: '#F97316',
    hasRedDotAccent: true,
    isBuiltIn: true,
    description: 'World clock, Pomodoro timer & stopwatch',
  },
  {
    id: 'weather',
    name: 'Weather',
    category: 'Utilities',
    accentHex: '#38BDF8',
    isBuiltIn: true,
    description: 'Live local temperature & hourly outlook',
  },
  {
    id: 'calculator',
    name: 'Calc',
    category: 'Utilities',
    accentHex: '#F59E0B',
    isBuiltIn: true,
    description: 'Precision tactile calculator',
  },
  {
    id: 'music',
    name: 'Audio',
    category: 'Media',
    accentHex: '#D71921',
    hasRedDotAccent: true,
    isBuiltIn: true,
    description: 'Generative ambient synthesizer deck',
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'Utilities',
    accentHex: '#EF4444',
    isBuiltIn: true,
    description: 'Minimalist agenda & schedule planner',
  },
  {
    id: 'gallery',
    name: 'Photos',
    category: 'Media',
    accentHex: '#A855F7',
    isBuiltIn: true,
    description: 'Captured snapshots & wallpaper vault',
  },
  {
    id: 'files',
    name: 'Clipboard',
    category: 'Utilities',
    accentHex: '#64748B',
    isBuiltIn: true,
    description: 'Pinned snippets & unit converter',
  },
  {
    id: 'settings',
    name: 'MonoOS',
    category: 'System',
    accentHex: '#D71921',
    hasRedDotAccent: true,
    isBuiltIn: true,
    description: 'Launcher appearance, grid & PWA setup',
  },
  {
    id: 'terminal',
    name: 'Units',
    category: 'Utilities',
    accentHex: '#10B981',
    isBuiltIn: true,
    description: 'Instant currency, length & time converter',
  },
  {
    id: 'focus',
    name: 'Breathe',
    category: 'Utilities',
    accentHex: '#EC4899',
    isBuiltIn: true,
    description: 'Guided 4-7-8 calm breathing cadence',
  },
  {
    id: 'maps',
    name: 'Maps',
    category: 'Web',
    accentHex: '#22C55E',
    externalUrl: 'https://maps.google.com',
    isBuiltIn: false,
    description: 'Launch Google Maps navigation',
  },
  {
    id: 'mail',
    name: 'Mail',
    category: 'Communication',
    accentHex: '#EF4444',
    externalUrl: 'https://mail.google.com',
    isBuiltIn: false,
    description: 'Open Gmail inbox',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'Media',
    accentHex: '#FF0000',
    externalUrl: 'https://m.youtube.com',
    isBuiltIn: false,
    description: 'Launch mobile YouTube',
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'Web',
    accentHex: '#71717A',
    externalUrl: 'https://github.com',
    isBuiltIn: false,
    description: 'Open GitHub repositories',
  },
];

export const APP_MAP: Record<string, AppDefinition> = Object.fromEntries(
  APP_CATALOG.map((app) => [app.id, app])
);

export const DEFAULT_CONFIG: LauncherConfig = {
  theme: 'dark',
  iconStyle: 'nothing-mono',
  wallpaperId: 'obsidian-flow',
  gridColumns: 4,
  showLabels: true,
  animFeel: 'ios-spring',
  soundFeedback: false,
  dockAppIds: ['phone', 'messages', 'browser', 'camera'],
  homePages: [
    ['weather', 'clock', 'music', 'calculator', 'calendar', 'gallery', 'focus', 'settings'],
    ['maps', 'mail', 'youtube', 'github', 'files', 'terminal'],
  ],
  widgets: [
    { id: 'w-clock', type: 'clock-weather', page: 0, size: '4x2' },
    { id: 'w-media', type: 'media-capsule', page: 0, size: '2x2' },
    { id: 'w-ring', type: 'activity-ring', page: 0, size: '2x2' },
    { id: 'w-notes', type: 'quick-notes', page: 1, size: '4x2' },
    { id: 'w-vitals', type: 'system-vitals', page: 1, size: '4x2' },
  ],
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    appId: 'calendar',
    appName: 'Calendar',
    title: 'Design Review · Studio',
    body: 'Starts in 25 minutes · Bring prototype frames',
    timeLabel: '9m ago',
    unread: true,
  },
  {
    id: 'n-2',
    appId: 'messages',
    appName: 'Notes & SMS',
    title: 'Pinned Reminder',
    body: 'Tap to inspect your quick notes or send a message',
    timeLabel: '24m ago',
    unread: true,
  },
  {
    id: 'n-3',
    appId: 'weather',
    appName: 'Weather',
    title: 'Clear Sky Forecast',
    body: 'Tap Weather to fetch live conditions for your current location',
    timeLabel: '1h ago',
    unread: false,
  },
];

export const INITIAL_NOTES: NoteItem[] = [
  { id: 'note-1', text: 'Install MonoOS to Android Home Screen', done: false, createdAt: 'Today' },
  { id: 'note-2', text: 'Try long-press on icons for Edit Mode', done: false, createdAt: 'Today' },
  { id: 'note-3', text: 'Swipe down from top-right for Control Center', done: true, createdAt: 'Today' },
];

export const INITIAL_EVENTS: CalendarEventItem[] = [
  { id: 'ev-1', title: 'Morning Run · 5km', time: '07:30', dayOffset: 0 },
  { id: 'ev-2', title: 'Industrial Design Sync', time: '11:00', dayOffset: 0 },
  { id: 'ev-3', title: 'Deep Work Block', time: '14:30', dayOffset: 1 },
];
