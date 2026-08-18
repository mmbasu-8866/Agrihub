import React, { useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Thermometer,
  ShieldCheck,
  Calendar,
  Sparkles,
  MapPin,
  Volume2,
} from 'lucide-react';
import { WeatherData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WeatherAdvisoryViewProps {
  weather: WeatherData;
}

export const WeatherAdvisoryView: React.FC<WeatherAdvisoryViewProps> = ({ weather }) => {
  const { language, t, isEasyMode, speak } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState<string>('Indore Mandi Region, MP');

  const handleSpeakWeather = () => {
    if (language === 'en') {
      const text = `Today's weather: Temperature is ${weather.temp} degrees Celsius, humidity is ${weather.humidity} percent, wind speed is ${weather.windSpeed} kilometers per hour, with ${weather.precipitationProb} percent rain probability. Spray Advisory: ${weather.sprayAdvisory.reason}. Optimal spray window: ${weather.sprayAdvisory.bestTimeToday}.`;
      speak(text);
    } else {
      const text = `आज का मौसम: तापमान ${weather.temp} डिग्री सेल्सियस है। हवा की गति ${weather.windSpeed} किलोमीटर प्रति घंटा है। बारिश की संभावना केवल ${weather.precipitationProb} प्रतिशत है। स्प्रे सलाह: ${weather.sprayAdvisory.reason}. सबसे अच्छा स्प्रे समय: ${weather.sprayAdvisory.bestTimeToday}`;
      speak(text);
    }
  };

  const regions = [
    'Indore Mandi Region, MP',
    'Karnal Grain Belt, Haryana',
    'Rajkot Cotton Basin, Gujarat',
    'Nashik Agro Zone, Maharashtra',
    'Kolar Vegetable Hub, Karnataka',
    'Nizamabad Spices Hub, Telangana',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-sky-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-950/60 text-teal-300 text-xs font-semibold mb-2 border border-teal-600/40">
              <CloudSun className="w-3.5 h-3.5 text-teal-300" />
              Hyperlocal Agricultural Weather & Spray Radar
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Weather Monitoring & Agro-Advisory
            </h2>
            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
              Real-time soil moisture indices, wind speeds, rainfall risks, and AI-calculated foliar spraying windows to protect input investments.
            </p>
          </div>

          {/* Region Selector & Audio */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeakWeather}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer border border-emerald-400/40"
              title="Listen to Weather Advisory"
            >
              <Volume2 className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>🔊 {t('listenAudio')}</span>
            </button>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/20">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
              >
                {regions.map((r) => (
                  <option key={r} value={r} className="text-stone-900">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Temperature</span>
            <Thermometer className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900">{weather.temp}°C</p>
          <p className="text-[11px] text-stone-500">Feels like {weather.feelsLike}°C</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900">{weather.humidity}%</p>
          <p className="text-[11px] text-stone-500">Relative Canopy RH</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Wind Speed</span>
            <Wind className="w-4 h-4 text-teal-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900">{weather.windSpeed} km/h</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Gentle Breeze</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Rain Risk</span>
            <CloudRain className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900">{weather.precipitationProb}%</p>
          <p className="text-[11px] text-stone-500">Low Shower Risk</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Soil Moisture</span>
            <Droplets className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900">{weather.soilMoisture}%</p>
          <p className="text-[11px] text-emerald-600 font-semibold">Optimal Range</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-medium">Soil Temp</span>
            <Sun className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-stone-900">{weather.soilTemp}°C</p>
          <p className="text-[11px] text-stone-500">Root Zone Heat</p>
        </div>
      </div>

      {/* Dual Agro-Advisories: Spray Window & Harvesting Window */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Pesticide & Fertilizer Spray Window */}
        <div className="bg-emerald-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-emerald-100">
                Pesticide & Foliar Spray Advisory
              </h3>
            </div>
            <span className="px-3 py-1 bg-emerald-500 text-stone-950 font-bold text-xs rounded-full uppercase">
              {weather.sprayAdvisory.status} Condition
            </span>
          </div>

          <p className="text-xs text-emerald-100/90 leading-relaxed">
            {weather.sprayAdvisory.reason}
          </p>

          <div className="bg-emerald-950/70 rounded-xl p-3 border border-emerald-700/50 flex items-center gap-2.5 text-xs text-emerald-200">
            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Recommended Spraying Windows Today:</p>
              <p className="text-emerald-300 font-mono mt-0.5">{weather.sprayAdvisory.bestTimeToday}</p>
            </div>
          </div>
        </div>

        {/* 2. Harvesting & Field Operation Window */}
        <div className="bg-stone-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-stone-100">
                Harvesting & Thrashing Suitability
              </h3>
            </div>
            <span className="px-3 py-1 bg-amber-400 text-stone-950 font-bold text-xs rounded-full uppercase">
              {weather.harvestAdvisory.status}
            </span>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            {weather.harvestAdvisory.reason}
          </p>

          <div className="bg-stone-950/80 rounded-xl p-3 border border-stone-700 flex items-center gap-2.5 text-xs text-stone-300">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white">Dry Solar Window:</p>
              <p className="text-stone-300 mt-0.5">
                Low morning dew allows for immediate combine harvesting and direct open-air grain moisture reduction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Agricultural Forecast */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>7-Day Farm Weather & Precipitation Forecast</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
          {weather.forecast.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-center space-y-1.5 transition-all ${
                idx === 0
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 hover:border-emerald-300'
              }`}
            >
              <p className="text-xs font-bold text-stone-800">{item.day}</p>
              <p className="text-[10px] text-stone-500">{item.date}</p>

              <div className="py-1">
                {item.icon === 'sun' && <Sun className="w-6 h-6 text-amber-500 mx-auto" />}
                {item.icon === 'cloud' && <CloudSun className="w-6 h-6 text-stone-500 mx-auto" />}
                {item.icon === 'rain' && <CloudRain className="w-6 h-6 text-blue-500 mx-auto" />}
                {item.icon === 'wind' && <Wind className="w-6 h-6 text-teal-500 mx-auto" />}
              </div>

              <p className="text-[11px] font-medium text-stone-700 truncate">{item.condition}</p>

              <div className="text-xs font-mono font-bold text-stone-900">
                {item.high}° / <span className="text-stone-400 font-normal">{item.low}°</span>
              </div>

              <div className="text-[10px] font-semibold text-blue-600 bg-blue-50 py-0.5 rounded">
                🌧 {item.rainProb}% rain
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
