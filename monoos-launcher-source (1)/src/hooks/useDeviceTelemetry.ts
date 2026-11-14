import { useEffect, useState } from 'react';

export interface WeatherState {
  tempC: number;
  condition: string;
  city: string;
  highC: number;
  lowC: number;
  windKmh: number;
  humidity: number;
  hourly: { hour: string; tempC: number }[];
  loading: boolean;
  source: 'gps' | 'default';
}

const DEFAULT_WEATHER: WeatherState = {
  tempC: 21,
  condition: 'Clear Sky',
  city: 'San Francisco',
  highC: 24,
  lowC: 15,
  windKmh: 12,
  humidity: 54,
  hourly: [
    { hour: 'Now', tempC: 21 },
    { hour: '+1h', tempC: 22 },
    { hour: '+2h', tempC: 23 },
    { hour: '+3h', tempC: 24 },
    { hour: '+4h', tempC: 22 },
    { hour: '+5h', tempC: 19 },
  ],
  loading: false,
  source: 'default',
};

function decodeWmoCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Mist';
  if (code <= 57) return 'Light Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Showers';
  return 'Storm';
}

export function useDeviceTelemetry() {
  const [now, setNow] = useState(() => new Date());
  const [batteryLevel, setBatteryLevel] = useState<number>(88);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [weather, setWeather] = useState<WeatherState>(DEFAULT_WEATHER);

  // Live clock
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Online status
  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // Real Battery Status API (supported on Android Chrome)
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    const nav = navigator as unknown as {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        addEventListener: (ev: string, cb: () => void) => void;
        removeEventListener: (ev: string, cb: () => void) => void;
      }>;
    };

    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        const update = () => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);
        };
        update();
        battery.addEventListener('levelchange', update);
        battery.addEventListener('chargingchange', update);
        cleanup = () => {
          battery.removeEventListener('levelchange', update);
          battery.removeEventListener('chargingchange', update);
        };
      }).catch(() => {});
    }

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const fetchWeatherForCoords = async (lat: number, lon: number, cityLabel: string, source: 'gps' | 'default') => {
    setWeather((prev) => ({ ...prev, loading: true }));
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather fetch failed');
      const data = await res.json();
      const currentHourIdx = new Date().getHours();
      const hourlyTemps: number[] = data.hourly?.temperature_2m ?? [];
      const hourly = Array.from({ length: 6 }, (_, i) => {
        const idx = Math.min(currentHourIdx + i, hourlyTemps.length - 1);
        const hr = (currentHourIdx + i) % 24;
        return {
          hour: i === 0 ? 'Now' : `${hr.toString().padStart(2, '0')}:00`,
          tempC: Math.round(hourlyTemps[idx] ?? data.current.temperature_2m),
        };
      });

      setWeather({
        tempC: Math.round(data.current.temperature_2m),
        condition: decodeWmoCode(data.current.weather_code),
        city: cityLabel,
        highC: Math.round(data.daily?.temperature_2m_max?.[0] ?? data.current.temperature_2m + 3),
        lowC: Math.round(data.daily?.temperature_2m_min?.[0] ?? data.current.temperature_2m - 4),
        windKmh: Math.round(data.current.wind_speed_10m ?? 10),
        humidity: Math.round(data.current.relative_humidity_2m ?? 50),
        hourly,
        loading: false,
        source,
      });
    } catch {
      setWeather((prev) => ({ ...prev, loading: false }));
    }
  };

  const requestLocalWeather = () => {
    if (!('geolocation' in navigator)) {
      fetchWeatherForCoords(37.7749, -122.4194, 'San Francisco', 'default');
      return;
    }
    setWeather((prev) => ({ ...prev, loading: true }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchWeatherForCoords(pos.coords.latitude, pos.coords.longitude, 'Local GPS', 'gps');
      },
      () => {
        fetchWeatherForCoords(37.7749, -122.4194, 'San Francisco', 'default');
      },
      { timeout: 6000 }
    );
  };

  return {
    now,
    batteryLevel,
    isCharging,
    isOnline,
    weather,
    fetchWeatherForCoords,
    requestLocalWeather,
  };
}
