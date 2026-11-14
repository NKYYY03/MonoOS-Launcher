import React from 'react';
import { LocateFixed, Wind, Droplets } from 'lucide-react';
import { WeatherState } from '../../hooks/useDeviceTelemetry';

interface WeatherAppProps {
  weather: WeatherState;
  onRequestLocalWeather: () => void;
  onSelectCity: (lat: number, lon: number, name: string) => void;
}

const CITY_PRESETS = [
  { name: 'San Francisco', lat: 37.7749, lon: -122.4194 },
  { name: 'London', lat: 51.5072, lon: -0.1276 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
];

export const WeatherApp: React.FC<WeatherAppProps> = ({
  weather,
  onRequestLocalWeather,
  onSelectCity,
}) => {
  const maxTemp = Math.max(...weather.hourly.map((h) => h.tempC), 1);
  const minTemp = Math.min(...weather.hourly.map((h) => h.tempC), 0);
  const spread = Math.max(1, maxTemp - minTemp);

  return (
    <div className="flex flex-col h-full justify-between px-4 pt-2 pb-4 overflow-y-auto no-scrollbar">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500">{weather.source === 'gps' ? 'GPS Location' : 'Forecast'}</div>
            <h3 className="text-lg font-semibold">{weather.city}</h3>
          </div>
          <button
            type="button"
            onClick={onRequestLocalWeather}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/6 dark:bg-white/10 text-xs font-medium active:scale-95 transition-transform"
          >
            <LocateFixed className="w-3.5 h-3.5 text-[#D71921]" />
            <span>{weather.loading ? 'Locating...' : 'Use GPS'}</span>
          </button>
        </div>

        {/* Hero Temp */}
        <div className="my-6 flex items-end justify-between">
          <div className="font-dot text-[68px] leading-none font-mono-tabular">
            {weather.tempC}°
          </div>
          <div className="text-right pb-1">
            <div className="text-sm font-semibold">{weather.condition}</div>
            <div className="text-xs text-zinc-500 font-mono-tabular mt-0.5">
              H: {weather.highC}° · L: {weather.lowC}°
            </div>
          </div>
        </div>

        {/* Hourly Bars */}
        <div className="rounded-2xl bg-black/4 dark:bg-white/6 p-4 mb-4">
          <div className="text-[11px] font-medium text-zinc-500 mb-3">Hourly Outlook</div>
          <div className="grid grid-cols-6 gap-2 items-end h-24">
            {weather.hourly.map((h) => {
              const barPct = 28 + ((h.tempC - minTemp) / spread) * 65;
              return (
                <div key={h.hour} className="flex flex-col items-center justify-end h-full gap-1.5">
                  <span className="font-mono-tabular text-[11px] font-medium">{h.tempC}°</span>
                  <div className="w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 h-12 flex items-end overflow-hidden">
                    <div
                      className="w-full rounded-full bg-[#D71921]"
                      style={{ height: `${barPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-zinc-500">{h.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl bg-black/4 dark:bg-white/6 p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Wind className="w-3.5 h-3.5" /> Wind
            </div>
            <div className="font-mono-tabular text-lg font-semibold mt-1">
              {weather.windKmh} km/h
            </div>
          </div>
          <div className="rounded-2xl bg-black/4 dark:bg-white/6 p-3.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Droplets className="w-3.5 h-3.5" /> Humidity
            </div>
            <div className="font-mono-tabular text-lg font-semibold mt-1">
              {weather.humidity}%
            </div>
          </div>
        </div>
      </div>

      {/* City Switcher */}
      <div>
        <div className="text-[11px] text-zinc-500 mb-2">Quick Cities</div>
        <div className="flex flex-wrap gap-1.5">
          {CITY_PRESETS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelectCity(c.lat, c.lon, c.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                weather.city === c.name
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-black/5 dark:bg-white/8 text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
