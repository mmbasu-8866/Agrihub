import React from 'react';
import {
  TrendingUp,
  Store,
  ShoppingBag,
  Stethoscope,
  CloudSun,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Volume2,
  Mic,
  LogIn,
  UserCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface KisanQuickHubProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAdvisor: () => void;
}

export const KisanQuickHub: React.FC<KisanQuickHubProps> = ({
  activeTab,
  setActiveTab,
  onOpenAdvisor,
}) => {
  const { t, isEasyMode, speak } = useLanguage();
  const { user, isAuthenticated, openLoginModal, openRegisterModal } = useAuth();

  const hubs = [
    {
      id: 'prices',
      title: t('tabPrices'),
      subtitle: t('tabPricesDesc'),
      icon: TrendingUp,
      emoji: '🌾',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950',
      iconColor: 'text-emerald-800 bg-emerald-200/80',
      badge: 'Live',
    },
    {
      id: 'store',
      title: t('tabStore'),
      subtitle: t('tabStoreDesc'),
      icon: Store,
      emoji: '🛒',
      bgColor: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-950',
      iconColor: 'text-amber-800 bg-amber-200/80',
      badge: '40% Off',
    },
    {
      id: 'direct-market',
      title: t('tabDirectMarket'),
      subtitle: t('tabDirectMarketDesc'),
      icon: ShoppingBag,
      emoji: '💰',
      bgColor: 'bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-950',
      iconColor: 'text-teal-800 bg-teal-200/80',
      badge: '0% Broker',
    },
    {
      id: 'doctor',
      title: t('tabDoctor'),
      subtitle: t('tabDoctorDesc'),
      icon: Stethoscope,
      emoji: '🩺',
      bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-950',
      iconColor: 'text-blue-800 bg-blue-200/80',
      badge: 'AI Scan',
    },
    {
      id: 'weather',
      title: t('tabWeather'),
      subtitle: t('tabWeatherDesc'),
      icon: CloudSun,
      emoji: '⛅',
      bgColor: 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-950',
      iconColor: 'text-sky-800 bg-sky-200/80',
    },
    {
      id: 'forum',
      title: t('tabForum'),
      subtitle: t('tabForumDesc'),
      icon: Users,
      emoji: '👥',
      bgColor: 'bg-stone-50 hover:bg-stone-100 border-stone-300 text-stone-950',
      iconColor: 'text-stone-800 bg-stone-200',
    },
  ];

  const handleSpeakWelcome = () => {
    speak(`${t('welcomeTitle')}. ${t('welcomeSubtitle')}`);
  };

  return (
    <div className="mb-6 space-y-3">
      {/* 1. Large Friendly Welcome Banner with Audio & Voice */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-stone-900 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('appName')} • {t('appSubtitle')}</span>
          </div>

          <h2 className={`font-black tracking-tight text-white ${isEasyMode ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'}`}>
            {t('welcomeTitle')}
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            {t('welcomeSubtitle')}
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2">
            <button
              onClick={handleSpeakWelcome}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-950 text-emerald-200 text-xs font-bold border border-emerald-600/40 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>🔊 {t('listenAudio')}</span>
            </button>

            {isAuthenticated && user ? (
              <button
                onClick={() => setActiveTab('account')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 hover:bg-emerald-700 border border-emerald-500/40 text-emerald-100 text-xs font-bold cursor-pointer transition-colors"
                title="View My Account Details"
              >
                <span>{user.avatar || '👤'}</span>
                <span>Active: <strong>{user.name}</strong> ({user.role})</span>
                <span className="text-[10px] text-emerald-300 ml-1">Profile →</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('account')}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3 h-3" />
                  <span>🔑 Log In Page</span>
                </button>
                <button
                  onClick={() => setActiveTab('account')}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 cursor-pointer"
                >
                  <span>✨ Create Free Account</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Big Voice Assistant Button */}
        <button
          onClick={onOpenAdvisor}
          className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-stone-950 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2 shrink-0 transition-transform hover:scale-105 cursor-pointer"
        >
          <Mic className="w-5 h-5 text-stone-900 animate-bounce" />
          <span>🎤 {t('speakToAsk')}</span>
        </button>
      </div>

      {/* 2. Visual Farmer Quick Tiles (Big, High-Contrast & Clear) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {hubs.map((hub) => {
          const Icon = hub.icon;
          const isCurrent = activeTab === hub.id;
          return (
            <button
              key={hub.id}
              onClick={() => setActiveTab(hub.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 relative flex flex-col justify-between cursor-pointer ${
                isCurrent
                  ? 'ring-3 ring-emerald-600 shadow-lg bg-white border-emerald-600'
                  : `${hub.bgColor} shadow-xs hover:shadow-md`
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{hub.emoji}</span>
                  {hub.badge && (
                    <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full shadow-2xs border border-stone-200 text-stone-900">
                      {hub.badge}
                    </span>
                  )}
                </div>

                <h3 className={`font-black leading-tight ${isEasyMode ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
                  {hub.title}
                </h3>
                <p className="text-[11px] opacity-80 mt-1 line-clamp-1 font-medium">
                  {hub.subtitle}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between text-xs font-black text-emerald-800">
                <span>{isCurrent ? '● Active' : 'Open →'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
