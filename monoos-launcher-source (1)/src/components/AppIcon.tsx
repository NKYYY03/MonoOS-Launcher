import React, { useRef } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MessageSquare,
  Compass,
  Camera,
  Calculator,
  Clock,
  CloudSun,
  Disc3,
  Calendar,
  Image as ImageIcon,
  SlidersHorizontal,
  ClipboardList,
  MapPin,
  Mail,
  Play,
  Code2,
  Scale,
  Wind,
  Minus,
} from 'lucide-react';
import { AnimFeel, AppDefinition, AppId, IconStyle } from '../types/launcher';

interface AppIconProps {
  app: AppDefinition;
  iconStyle: IconStyle;
  showLabel?: boolean;
  editMode?: boolean;
  animFeel: AnimFeel;
  badgeCount?: number;
  size?: 'sm' | 'md' | 'lg';
  onLaunch: (appId: AppId) => void;
  onLongPress?: () => void;
  onRemove?: (appId: AppId) => void;
}

export function renderAppGlyph(appId: AppId, className = 'w-6 h-6') {
  switch (appId) {
    case 'phone':
      return <Phone className={className} strokeWidth={1.8} />;
    case 'messages':
      return <MessageSquare className={className} strokeWidth={1.8} />;
    case 'browser':
      return <Compass className={className} strokeWidth={1.8} />;
    case 'camera':
      return <Camera className={className} strokeWidth={1.8} />;
    case 'calculator':
      return <Calculator className={className} strokeWidth={1.8} />;
    case 'clock':
      return <Clock className={className} strokeWidth={1.8} />;
    case 'weather':
      return <CloudSun className={className} strokeWidth={1.8} />;
    case 'music':
      return <Disc3 className={className} strokeWidth={1.8} />;
    case 'calendar':
      return <Calendar className={className} strokeWidth={1.8} />;
    case 'gallery':
      return <ImageIcon className={className} strokeWidth={1.8} />;
    case 'settings':
      return <SlidersHorizontal className={className} strokeWidth={1.8} />;
    case 'files':
      return <ClipboardList className={className} strokeWidth={1.8} />;
    case 'maps':
      return <MapPin className={className} strokeWidth={1.8} />;
    case 'mail':
      return <Mail className={className} strokeWidth={1.8} />;
    case 'youtube':
      return <Play className={className} strokeWidth={1.8} />;
    case 'github':
      return <Code2 className={className} strokeWidth={1.8} />;
    case 'terminal':
      return <Scale className={className} strokeWidth={1.8} />;
    case 'focus':
      return <Wind className={className} strokeWidth={1.8} />;
    default:
      return <Compass className={className} strokeWidth={1.8} />;
  }
}

export const AppIcon: React.FC<AppIconProps> = ({
  app,
  iconStyle,
  showLabel = true,
  editMode = false,
  animFeel,
  badgeCount = 0,
  size = 'md',
  onLaunch,
  onLongPress,
  onRemove,
}) => {
  const pressTimer = useRef<number | null>(null);
  const didLongPress = useRef(false);

  const springTransition =
    animFeel === 'ios-spring'
      ? { type: 'spring' as const, stiffness: 460, damping: 28, mass: 0.85 }
      : { type: 'spring' as const, stiffness: 680, damping: 36, mass: 0.65 };

  const startPress = () => {
    didLongPress.current = false;
    if (!onLongPress) return;
    pressTimer.current = window.setTimeout(() => {
      didLongPress.current = true;
      onLongPress();
    }, 480);
  };

  const cancelPress = () => {
    if (pressTimer.current !== null) {
      window.clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (didLongPress.current) return;
    if (editMode) return;
    onLaunch(app.id);
  };

  const boxDimension =
    size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-[62px] h-[62px]' : 'w-[58px] h-[58px]';
  const glyphDimension = size === 'sm' ? 'w-5 h-5' : 'w-[25px] h-[25px]';

  const isNothing = iconStyle === 'nothing-mono';

  return (
    <div className={`relative flex flex-col items-center select-none ${editMode ? 'animate-jiggle' : ''}`}>
      {editMode && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(app.id);
          }}
          aria-label={`Remove ${app.name}`}
          className="absolute -top-1.5 left-1 z-20 w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 border border-black/10 dark:border-white/15 flex items-center justify-center shadow-md active:scale-90 transition-transform"
        >
          <Minus className="w-3 h-3" strokeWidth={2.8} />
        </button>
      )}

      {!editMode && badgeCount > 0 && (
        <span className="absolute -top-1 right-1 z-20 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D71921] text-white text-[10px] font-semibold font-mono-tabular flex items-center justify-center shadow-sm">
          {badgeCount}
        </span>
      )}

      <motion.button
        type="button"
        aria-label={app.name}
        whileTap={editMode ? undefined : { scale: 0.86 }}
        whileHover={editMode ? undefined : { scale: 1.04 }}
        transition={springTransition}
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
        onPointerCancel={cancelPress}
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress?.();
        }}
        onClick={handleClick}
        className={`${boxDimension} relative rounded-[24%] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D71921] ${
          isNothing
            ? 'bg-zinc-900/90 dark:bg-[#161618]/95 text-zinc-50 border border-white/12 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.45)]'
            : 'bg-white/75 dark:bg-white/12 backdrop-blur-xl text-zinc-900 dark:text-white border border-black/8 dark:border-white/18 shadow-[0_10px_24px_-8px_rgba(0,0,0,0.3)]'
        }`}
      >
        {/* Subtle iOS top specular highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 top-[1px] h-[1px] rounded-full bg-white/35 dark:bg-white/25"
        />

        {/* Icon glyph */}
        {isNothing ? (
          <span className="relative flex items-center justify-center">
            {renderAppGlyph(app.id, glyphDimension)}
            {app.hasRedDotAccent && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1.5 w-1.5 h-1.5 rounded-full bg-[#D71921]"
              />
            )}
          </span>
        ) : (
          <span
            className="w-9 h-9 rounded-[12px] flex items-center justify-center"
            style={{
              backgroundColor: `${app.accentHex}22`,
              color: app.accentHex,
            }}
          >
            {renderAppGlyph(app.id, 'w-[22px] h-[22px]')}
          </span>
        )}
      </motion.button>

      {showLabel && (
        <span className="mt-1.5 max-w-[68px] truncate text-[11px] font-medium tracking-tight text-zinc-900 dark:text-zinc-100 drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
          {app.name}
        </span>
      )}
    </div>
  );
};
