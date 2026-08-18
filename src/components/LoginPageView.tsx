import React, { useState } from 'react';
import {
  ShieldCheck,
  User,
  Phone,
  Lock,
  Mail,
  MapPin,
  Building2,
  Tractor,
  Store,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  KeyRound,
  Eye,
  EyeOff,
  Wheat,
  Languages,
  LogOut,
  Edit2,
  Check,
  Compass,
  TrendingUp,
  ShoppingBag,
  HeartHandshake,
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole, RegisterData, UserProfile } from '../types';

interface LoginPageViewProps {
  onNavigateTab: (tab: string) => void;
}

export const LoginPageView: React.FC<LoginPageViewProps> = ({ onNavigateTab }) => {
  const {
    user,
    isAuthenticated,
    login,
    loginWithOtp,
    quickDemoLogin,
    register,
    logout,
    updateProfile,
    savedAccounts,
  } = useAuth();

  const { language, setLanguage, languages, t } = useLanguage();

  // Mode: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Login Form Fields
  const [loginIdentifier, setLoginIdentifier] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginOtp, setLoginOtp] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form Fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Farmer');
  const [regLocation, setRegLocation] = useState('');
  const [regDistrict, setRegDistrict] = useState('');
  const [regState, setRegState] = useState('Madhya Pradesh');
  const [regFarmSize, setRegFarmSize] = useState<number>(10);
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCrops, setRegCrops] = useState<string[]>(['Wheat', 'Soybean', 'Mustard']);

  // Edit Profile Mode inside Logged-in Dashboard
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editFarmSize, setEditFarmSize] = useState<number>(user?.farmSizeAcres || 5);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone);
      setEditLocation(user.location);
      setEditFarmSize(user.farmSizeAcres || 5);
    }
  }, [user]);

  const indianStates = [
    'Madhya Pradesh',
    'Haryana',
    'Punjab',
    'Gujarat',
    'Maharashtra',
    'Rajasthan',
    'Uttar Pradesh',
    'Karnataka',
    'Telangana',
    'Tamil Nadu',
    'Andhra Pradesh',
    'Bihar',
  ];

  const commonCrops = [
    'Wheat',
    'Paddy / Rice',
    'Soybean',
    'Cotton',
    'Mustard',
    'Gram (Chana)',
    'Onion',
    'Potato',
    'Tomato',
    'Maize',
    'Sugarcane',
    'Turmeric',
  ];

  const toggleCrop = (crop: string) => {
    setRegCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop]
    );
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      let res;
      if (loginMethod === 'otp') {
        res = await loginWithOtp(loginIdentifier, loginOtp);
      } else {
        res = await login(loginIdentifier, loginPassword);
      }

      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!regName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!regPhone.trim() || regPhone.replace(/[^0-9]/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const data: RegisterData = {
        name: regName,
        phone: regPhone,
        email: regEmail || undefined,
        password: regPassword,
        role: regRole,
        location: regLocation || `${regDistrict || 'Central'}, ${regState}`,
        district: regDistrict,
        state: regState,
        farmSizeAcres: regRole === 'Farmer' ? Number(regFarmSize) || 0 : undefined,
        cropsGrown: regRole === 'Farmer' ? regCrops : undefined,
        businessName: regRole !== 'Farmer' ? regBusinessName : undefined,
      };

      const res = await register(data);
      if (!res.success) {
        setErrorMsg(res.message);
      } else {
        setSuccessMsg(res.message);
      }
    } catch (err: any) {
      setErrorMsg('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      location: editLocation,
      farmSizeAcres: Number(editFarmSize) || 0,
    });
    setIsEditingProfile(false);
    setSuccessMsg('Profile details updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* 1. Page Header & Features Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-800/80 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600/40 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>AgriDirect Official Farmer & Buyer Account Portal</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {isAuthenticated && user
                ? `Namaste, ${user.name}!`
                : authMode === 'login'
                ? 'Log In to Your AgriDirect Account'
                : 'Create Your Free Farmer / Trader Account'}
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {isAuthenticated && user
                ? `You are signed in as a verified ${user.role} (${user.location}, ${user.state}). You have complete direct access to live mandi rates, zero-broker harvest sales, and wholesale farm inputs.`
                : 'Sign in to access real-time APMC price alerts, post harvested crops with 0% broker fee, purchase factory-direct fertilizers, and consult AI Crop Doctors 24x7.'}
            </p>

            {/* Quick Explore Button */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('prices')}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Compass className="w-4 h-4 text-stone-900" />
                <span>Explore Live Mandi Rates & Hub →</span>
              </button>

              <button
                onClick={() => onNavigateTab('doctor')}
                className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-600/50 cursor-pointer"
              >
                <Stethoscope className="w-4 h-4 text-emerald-300" />
                <span>AI Crop Doctor Scan</span>
              </button>
            </div>
          </div>

          {/* Key Value Cards */}
          <div className="grid grid-cols-2 gap-2.5 shrink-0 w-full md:w-auto">
            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
              <div className="text-xl">🌾</div>
              <p className="text-xs font-black text-white mt-1">0% Commission</p>
              <p className="text-[10px] text-emerald-200">Direct mill buyer rates</p>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
              <div className="text-xl">📊</div>
              <p className="text-xs font-black text-white mt-1">Live Mandi Rates</p>
              <p className="text-[10px] text-emerald-200">APMC & e-NAM sync</p>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
              <div className="text-xl">🩺</div>
              <p className="text-xs font-black text-white mt-1">AI Crop Doctor</p>
              <p className="text-[10px] text-emerald-200">Instant leaf scan diagnosis</p>
            </div>

            <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
              <div className="text-xl">🚚</div>
              <p className="text-xs font-black text-white mt-1">Wholesale Store</p>
              <p className="text-[10px] text-emerald-200">Direct factory inputs</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Body: Logged-in Dashboard OR Auth Form */}
      {isAuthenticated && user ? (
        /* LOGGED IN ACCOUNT DASHBOARD */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {/* Active Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-emerald-50/80 rounded-2xl border border-emerald-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center text-3xl shadow-xs border border-emerald-600">
                {user.avatar || '👨‍🌾'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-stone-900">{user.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-700 text-white shadow-2xs">
                    {user.role}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-200 text-emerald-950">
                    KYC Verified ✓
                  </span>
                </div>
                <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{user.location}, {user.state}</span>
                  <span className="text-stone-400">•</span>
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>+91 {user.phone}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                <span>{isEditingProfile ? 'Close Edit' : 'Edit Profile'}</span>
              </button>

              <button
                onClick={logout}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Edit Form or Details View */}
          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="p-5 bg-stone-50 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5">
                <Edit2 className="w-4 h-4 text-emerald-700" />
                <span>Update Profile Details</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Location / Village</label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              {user.role === 'Farmer' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Farm Land Holding (Acres)</label>
                  <input
                    type="number"
                    value={editFarmSize}
                    onChange={(e) => setEditFarmSize(Number(e.target.value))}
                    className="w-36 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-stone-200 text-stone-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Holdings & Crops */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Agricultural Holdings</span>
                </span>
                <p className="text-sm font-black text-stone-900">
                  {user.role === 'Farmer' ? `${user.farmSizeAcres || 0} Acres Cultivated Land` : user.businessName || 'Agri Operations'}
                </p>
                {user.cropsGrown && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {user.cropsGrown.map((c, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-stone-200 rounded-md text-[10px] font-bold text-stone-800">
                        🌾 {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card 2: Quick Navigation Actions */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Explore Direct Services</span>
                </span>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => onNavigateTab('direct-market')}
                    className="w-full text-left font-bold text-emerald-800 hover:text-emerald-950 flex items-center justify-between p-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer"
                  >
                    <span>🌾 Post Harvest for Direct Sale</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('store')}
                    className="w-full text-left font-bold text-emerald-800 hover:text-emerald-950 flex items-center justify-between p-1.5 rounded-lg hover:bg-emerald-50 cursor-pointer"
                  >
                    <span>🛒 Buy Wholesale Seeds & Fertilizer</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Switch Account */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Switch Test Profile ({savedAccounts.length})</span>
                </span>
                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {savedAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      onClick={() => quickDemoLogin(acc)}
                      className={`w-full p-1.5 rounded-lg text-left text-xs flex items-center justify-between cursor-pointer ${
                        acc.id === user.id ? 'bg-emerald-100 font-black text-emerald-950' : 'hover:bg-stone-200 text-stone-700'
                      }`}
                    >
                      <span className="truncate">{acc.avatar} {acc.name.split(' ')[0]} ({acc.role.split(' ')[0]})</span>
                      {acc.id === user.id && <span className="text-emerald-700">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* AUTHENTICATION CONTAINER (LOGIN & REGISTER) */
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Top Switcher Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50">
            <button
              id="login-page-tab-login"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-4 text-center text-sm font-black transition-all cursor-pointer border-b-2 ${
                authMode === 'login'
                  ? 'bg-white text-emerald-900 border-emerald-700 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 border-transparent'
              }`}
            >
              🔑 1. Log In to Existing Account
            </button>

            <button
              id="login-page-tab-register"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-4 text-center text-sm font-black transition-all cursor-pointer border-b-2 ${
                authMode === 'register'
                  ? 'bg-white text-emerald-900 border-emerald-700 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 border-transparent'
              }`}
            >
              ✨ 2. Create New Account (Kisan / Trader / Dealer)
            </button>
          </div>

          {/* Feedback alerts */}
          {errorMsg && (
            <div className="mx-6 sm:mx-8 mt-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mx-6 sm:mx-8 mt-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-900 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. LOGIN MODE */}
          {authMode === 'login' && (
            <div className="p-6 sm:p-8 space-y-6">
              {/* Method Toggle: Password vs OTP */}
              <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-2xl max-w-sm">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    loginMethod === 'password'
                      ? 'bg-white text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Password Login
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('otp')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    loginMethod === 'otp'
                      ? 'bg-white text-stone-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  📲 Mobile OTP (Fast)
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      id="login-page-identifier"
                      type="text"
                      required
                      placeholder="e.g. 9876543210 or ramesh@gmail.com"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                {loginMethod === 'password' ? (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setLoginMethod('otp')}
                        className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Use OTP instead?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        id="login-page-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter password (default: password123)"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-stone-400 hover:text-stone-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-stone-700">
                        Enter 6-Digit OTP Code
                      </label>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                        Demo OTP: 123456
                      </span>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        id="login-page-otp"
                        type="text"
                        maxLength={6}
                        required
                        placeholder="123456"
                        value={loginOtp}
                        onChange={(e) => setLoginOtp(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono tracking-widest text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-center font-black"
                      />
                    </div>
                  </div>
                )}

                <button
                  id="login-page-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Verifying Account...</span>
                  ) : (
                    <>
                      <span>Log In & Explore Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* 1-Click Demo Profiles */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>Or Select 1-Click Instant Demo Account:</span>
                  </span>
                  <span className="text-[11px] text-stone-400 hidden sm:inline">No password typing needed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {savedAccounts.slice(0, 4).map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => quickDemoLogin(acc)}
                      className="p-3 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{acc.avatar || '👤'}</span>
                        <div className="truncate">
                          <p className="text-xs font-black text-stone-900 group-hover:text-emerald-900 truncate">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {acc.role} • {acc.location.split(',')[0]}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Registration Prompt */}
              <div className="pt-2 text-center">
                <p className="text-xs text-stone-600">
                  New to AgriDirect?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="font-black text-emerald-700 hover:underline cursor-pointer"
                  >
                    Click here to Create Account →
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* 2. REGISTRATION MODE */}
          {authMode === 'register' && (
            <div className="p-6 sm:p-8 space-y-5">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Role Picker */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-2">
                    Select Your Role / Category:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { role: 'Farmer' as UserRole, label: 'Farmer / Cultivator', emoji: '🌾', desc: 'Grow & Sell Harvest' },
                      { role: 'Wholesale Buyer / Trader' as UserRole, label: 'Wholesale Buyer / Mill', emoji: '🏢', desc: 'Procure Bulk Crops' },
                      { role: 'Agri-Input Dealer' as UserRole, label: 'Input / Kendra Dealer', emoji: '🛒', desc: 'Seeds, Fertilizer, Tools' },
                      { role: 'Agronomist' as UserRole, label: 'Agronomist / Doctor', emoji: '🩺', desc: 'Crop Diagnostics & IPM' },
                    ].map((r) => (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setRegRole(r.role)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          regRole === r.role
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 text-emerald-950'
                            : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-2xl mb-1">{r.emoji}</span>
                        <div>
                          <p className="text-xs font-black leading-tight">{r.label}</p>
                          <p className="text-[10px] text-stone-500">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Patel"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        placeholder="ramesh@example.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Create Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        required
                        placeholder="Minimum 4 characters"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                    <select
                      value={regState}
                      onChange={(e) => setRegState(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                    >
                      {indianStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      District / Village / Mandi Area *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sanwer Village, Indore"
                        value={regLocation}
                        onChange={(e) => setRegLocation(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Specific Section */}
                {regRole === 'Farmer' ? (
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                        <Tractor className="w-4 h-4 text-emerald-700" />
                        <span>Farm Land Holding (in Acres)</span>
                      </label>
                      <input
                        type="number"
                        min={0.5}
                        step={0.5}
                        value={regFarmSize}
                        onChange={(e) => setRegFarmSize(Number(e.target.value))}
                        className="w-28 px-3 py-1 bg-white border border-emerald-300 rounded-xl text-xs font-bold font-mono text-center text-emerald-950"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-emerald-950 mb-1.5">
                        Main Crops Grown (Select all that apply):
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {commonCrops.map((c) => {
                          const isSelected = regCrops.includes(c);
                          return (
                            <button
                              key={c}
                              type="button"
                              onClick={() => toggleCrop(c)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-700 text-white shadow-2xs'
                                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                              }`}
                            >
                              {isSelected ? '✓ ' : '+ '}
                              {c}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {regRole === 'Wholesale Buyer / Trader'
                        ? 'Flour Mill / Processing Plant / Business Name'
                        : regRole === 'Agri-Input Dealer'
                        ? 'Krishi Seva Kendra / Fertilizer Shop Name'
                        : 'Institution / KVK Name'}
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        placeholder="e.g. Kisan Samridhi Agro Foods"
                        value={regBusinessName}
                        onChange={(e) => setRegBusinessName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                <button
                  id="register-page-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Creating Account...</span>
                  ) : (
                    <>
                      <span>Register Account & Start Exploring</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center">
                <p className="text-xs text-stone-600">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="font-black text-emerald-700 hover:underline cursor-pointer"
                  >
                    Log In with Mobile Number →
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
