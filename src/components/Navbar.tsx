import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Stethoscope,
  CloudSun,
  Users,
  Store,
  Bell,
  Search,
  Sparkles,
  PhoneCall,
  Menu,
  X,
  Languages,
  Mic,
  Volume2,
  Eye,
  ChevronDown,
  User,
  LogIn,
  UserCheck,
  Tractor,
} from 'lucide-react';
import { CropPrice, AppNotification } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { UserProfileModal } from './UserProfileModal';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart?: () => void;
  openCart?: () => void;
  notifications?: AppNotification[];
  notificationsCount?: number;
  onOpenNotifications?: () => void;
  openNotifications?: () => void;
  onOpenPriceAlert?: () => void;
  openPriceAlertModal?: () => void;
  onOpenAssistant?: () => void;
  openAiAdvisor?: () => void;
  cropPrices?: CropPrice[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount = 0,
  onOpenCart,
  openCart,
  notifications = [],
  notificationsCount,
  onOpenNotifications,
  openNotifications,
  onOpenPriceAlert,
  openPriceAlertModal,
  onOpenAssistant,
  openAiAdvisor,
  cropPrices = [],
  searchQuery = '',
  setSearchQuery = (_query: string) => {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { language, setLanguage, languages, t, isEasyMode, setIsEasyMode, speak } = useLanguage();
  const { user, isAuthenticated, openLoginModal, openRegisterModal } = useAuth();

  const safeNotifications = notifications || [];
  const safeCropPrices = cropPrices || [];

  const unreadCount =
    typeof notificationsCount === 'number'
      ? notificationsCount
      : safeNotifications.filter((n) => !n?.read).length;

  const handleCartClick = onOpenCart || openCart || (() => {});
  const handleNotifClick = onOpenNotifications || openNotifications || (() => {});
  const handleAdvisorClick = onOpenAssistant || openAiAdvisor || (() => {});

  const navItems = [
    { id: 'prices', label: t('tabPrices'), icon: TrendingUp, desc: t('tabPricesDesc') },
    { id: 'store', label: t('tabStore'), icon: Store, desc: t('tabStoreDesc') },
    { id: 'direct-market', label: t('tabDirectMarket'), icon: ShoppingBag, desc: t('tabDirectMarketDesc') },
    { id: 'doctor', label: t('tabDoctor'), icon: Stethoscope, desc: t('tabDoctorDesc') },
    { id: 'weather', label: t('tabWeather'), icon: CloudSun, desc: t('tabWeatherDesc') },
    { id: 'forum', label: t('tabForum'), icon: Users, desc: t('tabForumDesc') },
    {
      id: 'account',
      label: user ? `${user.name.split(' ')[0]} (${user.role.split(' ')[0]})` : 'Login / Register',
      icon: user ? UserCheck : LogIn,
      desc: user ? 'Profile & Holdings' : 'Kisan & Trader Login',
    },
  ];

  const handleReadTicker = () => {
    if (safeCropPrices.length > 0) {
      if (language === 'en') {
        const text = safeCropPrices
          .slice(0, 4)
          .map((c) => `${c.name}: ₹${c.currentPrice} per quintal`)
          .join(', ');
        speak(`Today's live mandi prices: ${text}`);
      } else {
        const text = safeCropPrices
          .slice(0, 4)
          .map((c) => `${c.name}: ₹${c.currentPrice} प्रति क्विंटल`)
          .join(', ');
        speak(`आज के मुख्य मंडी भाव: ${text}`);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* 1. Top Ticker & Language Bar */}
      <div className="bg-emerald-950 text-white text-xs px-3 sm:px-6 py-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-medium">
          <button
            onClick={handleReadTicker}
            className="flex items-center gap-1 text-emerald-300 hover:text-emerald-100 font-bold shrink-0 bg-emerald-900/60 px-2 py-0.5 rounded-full"
            title="Audio Mandi Rates"
          >
            <Volume2 className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>{t('liveMandiRates')}:</span>
          </button>
          
          <div className="flex items-center gap-4 text-emerald-100 whitespace-nowrap text-[11px] sm:text-xs">
            {safeCropPrices.slice(0, 5).map((crop) => (
              <span
                key={crop.id}
                onClick={() => setActiveTab('prices')}
                className="cursor-pointer hover:text-white"
              >
                {crop.name.split(' ')[0]}:{' '}
                <strong className="text-white font-mono">₹{crop.currentPrice}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Language Switcher & Kisan Helpline */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <button
              id="language-selector-btn"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs border border-emerald-600/50 cursor-pointer transition-colors"
              title="Change App Language"
            >
              <Languages className="w-3.5 h-3.5 text-emerald-300" />
              <span>Language: {languages.find((l) => l.code === language)?.nativeLabel || 'English'}</span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-2xl border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 text-stone-900">
                <div className="px-3 py-1 text-[10px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-100 mb-1">
                  Select Language
                </div>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between font-semibold transition-colors cursor-pointer ${
                      language === l.code
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{l.flag} {l.label} ({l.nativeLabel})</span>
                    {language === l.code && <span className="text-emerald-700 font-bold">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-emerald-200 text-[11px] pl-2 border-l border-emerald-800">
            <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('helpline')}: <strong className="text-white">1800-180-1551</strong></span>
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div
            id="brand-logo-button"
            onClick={() => setActiveTab('prices')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-2xl shadow-sm group-hover:scale-105 transition-transform">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
                  {t('appName')}
                </span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                  {t('appSubtitle')}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden md:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              id="global-search-input"
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            {/* Easy Mode Toggle Button */}
            <button
              onClick={() => setIsEasyMode((prev) => !prev)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                isEasyMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
              }`}
              title="Toggle Large Icon & Big Font Farmer Mode"
            >
              <Eye className="w-4 h-4 text-amber-700" />
              <span>{isEasyMode ? t('easyMode') : t('standardMode')}</span>
            </button>

            {/* Voice Query / AI Advisor */}
            <button
              id="open-ai-advisor-btn"
              onClick={handleAdvisorClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Mic className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span className="hidden sm:inline">{t('askAi')}</span>
            </button>

            {/* Notifications */}
            <button
              id="open-notifications-btn"
              onClick={handleNotifClick}
              className="p-2 text-stone-700 hover:text-emerald-700 hover:bg-stone-100 rounded-xl transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              id="open-cart-btn"
              onClick={handleCartClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">{t('cart')}</span>
              {cartCount > 0 && (
                <span className="bg-emerald-500 text-stone-950 font-black px-1.5 py-0.2 rounded-full text-[10px]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Button */}
            {isAuthenticated && user ? (
              <button
                id="user-profile-nav-btn"
                onClick={() => setActiveTab('account')}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs transition-all cursor-pointer shadow-2xs"
                title="View & Manage Profile"
              >
                <span className="text-base sm:text-lg">{user.avatar || '👤'}</span>
                <div className="text-left hidden lg:block">
                  <p className="text-emerald-950 font-black leading-tight text-xs truncate max-w-[100px]">
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-[9px] text-emerald-700 font-bold uppercase">{user.role.split(' ')[0]}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-emerald-700 hidden sm:block" />
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  id="nav-login-btn"
                  onClick={() => setActiveTab('account')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black transition-colors cursor-pointer shadow-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => setActiveTab('account')}
                  className="hidden xl:flex items-center gap-1 px-2.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-stone-200"
                >
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-800 hover:bg-stone-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-stone-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (With Large High-Contrast Tabs) */}
      <div className="border-t border-stone-200 bg-stone-50/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  id={`nav-tab-${item.id}`}
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md'
                      : 'bg-white text-stone-800 hover:bg-stone-100 border border-stone-200/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 p-4 space-y-3 shadow-lg">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-900"
            />
          </div>

          <div className="flex items-center justify-between p-2 bg-amber-50 rounded-xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900">👓 {t('easyMode')}</span>
            <button
              onClick={() => setIsEasyMode(!isEasyMode)}
              className="px-3 py-1 bg-amber-200 text-amber-950 font-bold rounded-lg text-xs"
            >
              {isEasyMode ? 'चालू (ON)' : 'बंद (OFF)'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold text-left transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-stone-50 text-stone-800 border border-stone-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                  <div>
                    <p>{item.label}</p>
                    <p className={`text-[10px] font-normal ${isActive ? 'text-emerald-100' : 'text-stone-500'}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* User Profile Details & Account Switcher Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </header>
  );
};
