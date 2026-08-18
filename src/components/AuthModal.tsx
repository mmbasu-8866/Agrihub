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
  X,
  Wheat,
  Layers,
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole, RegisterData, UserProfile } from '../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    openLoginModal,
    openRegisterModal,
    closeAuthModal,
    login,
    loginWithOtp,
    quickDemoLogin,
    register,
    savedAccounts,
  } = useAuth();

  const { t } = useLanguage();

  // Tab State
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalMode);
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');

  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('9876543210');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginOtp, setLoginOtp] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Farmer');
  const [regLocation, setRegLocation] = useState('');
  const [regDistrict, setRegDistrict] = useState('');
  const [regState, setRegState] = useState('Madhya Pradesh');
  const [regFarmSize, setRegFarmSize] = useState<number | undefined>(5);
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCrops, setRegCrops] = useState<string[]>(['Wheat', 'Soybean']);

  // Feedback State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync tab with context if opened from distinct triggers
  React.useEffect(() => {
    setActiveTab(authModalMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

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

  const toggleCropSelection = (crop: string) => {
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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 relative">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AgriDirect Official Farmer & Trader Portal</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {activeTab === 'login' ? 'Welcome Back to AgriDirect' : 'Join AgriDirect as Farmer or Trader'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 mt-1 max-w-md">
              {activeTab === 'login'
                ? 'Sign in to track live mandi rates, manage harvest listings, and procure direct inputs.'
                : 'Create your free account with zero broker commission and direct wholesale access.'}
            </p>
          </div>

          {/* Background Accent */}
          <div className="absolute right-0 bottom-0 text-7xl opacity-15 pointer-events-none pr-4 pb-2">
            🌱
          </div>
        </div>

        {/* Tab Switcher (Login vs Register) */}
        <div className="flex border-b border-stone-200 bg-stone-50">
          <button
            id="tab-login-btn"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-black transition-all cursor-pointer border-b-2 ${
              activeTab === 'login'
                ? 'bg-white text-emerald-800 border-emerald-700 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            🔑 Log In to Account
          </button>

          <button
            id="tab-register-btn"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-3 text-center text-xs sm:text-sm font-black transition-all cursor-pointer border-b-2 ${
              activeTab === 'register'
                ? 'bg-white text-emerald-800 border-emerald-700 shadow-2xs'
                : 'text-stone-500 hover:text-stone-800 border-transparent'
            }`}
          >
            ✨ Create New Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-800 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2 text-xs text-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {activeTab === 'login' && (
          <div className="p-6 sm:p-7 space-y-5">
            {/* Login Method Sub-Toggle */}
            <div className="flex items-center gap-2 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  loginMethod === 'password'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('otp');
                  setOtpSent(true);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  loginMethod === 'otp'
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                📲 Mobile OTP Login
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Phone or Email Identifier */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mobile Number or Email
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                  <input
                    id="login-identifier-input"
                    type="text"
                    required
                    placeholder="e.g. 9876543210 or ramesh@gmail.com"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password Mode */}
              {loginMethod === 'password' ? (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setLoginMethod('otp');
                        setOtpSent(true);
                      }}
                      className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer"
                    >
                      Login via OTP instead?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* OTP Mode */
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-700">
                      Enter 6-Digit OTP Code
                    </label>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Demo OTP: 123456
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      id="login-otp-input"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="123456"
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-mono tracking-widest text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-center font-black"
                    />
                  </div>
                </div>
              )}

              {/* Login Button */}
              <button
                id="submit-login-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying Account...</span>
                ) : (
                  <>
                    <span>Log In to AgriDirect</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Logins Section */}
            <div className="pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1-Click Test Accounts:</span>
                </span>
                <span className="text-[10px] text-stone-400">Click to instantly explore</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {savedAccounts.slice(0, 4).map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => quickDemoLogin(acc)}
                    className="p-2.5 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{acc.avatar || '👤'}</span>
                      <div className="truncate">
                        <p className="text-xs font-black text-stone-900 group-hover:text-emerald-800 truncate">
                          {acc.name.split(' ')[0]} ({acc.role.split(' ')[0]})
                        </p>
                        <p className="text-[10px] text-stone-500 truncate">
                          {acc.location.split(',')[0]}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Switcher */}
            <div className="text-center pt-1">
              <p className="text-xs text-stone-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                  className="font-black text-emerald-700 hover:underline cursor-pointer"
                >
                  Create an Account Now →
                </button>
              </p>
            </div>
          </div>
        )}

        {/* 2. REGISTRATION / CREATE ACCOUNT FORM */}
        {activeTab === 'register' && (
          <div className="p-6 sm:p-7 space-y-4 max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Role Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Select Your Profile Role:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { role: 'Farmer' as UserRole, label: 'Farmer / Kisan', emoji: '🌾', desc: 'Grow & Sell Harvest' },
                    { role: 'Wholesale Buyer / Trader' as UserRole, label: 'Buyer / Mill', emoji: '🏢', desc: 'Procure Bulk' },
                    { role: 'Agri-Input Dealer' as UserRole, label: 'Input Dealer', emoji: '🛒', desc: 'Seeds & Fertilizer' },
                    { role: 'Agronomist' as UserRole, label: 'Agri-Doctor', emoji: '🩺', desc: 'Advisory & IPM' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setRegRole(r.role)}
                      className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        regRole === r.role
                          ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 text-emerald-950'
                          : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                      }`}
                    >
                      <span className="text-xl mb-1">{r.emoji}</span>
                      <div>
                        <p className="text-xs font-black leading-tight">{r.label}</p>
                        <p className="text-[10px] text-stone-500 line-clamp-1">{r.desc}</p>
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
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Patel"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
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
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="ramesh@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Create Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 4 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location: State & District/Village */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State *</label>
                  <select
                    value={regState}
                    onChange={(e) => setRegState(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
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
                    District / Tehsil / Village *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanwer, Indore"
                      value={regLocation}
                      onChange={(e) => setRegLocation(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Specific Field: Farmer Land & Crops */}
              {regRole === 'Farmer' ? (
                <div className="space-y-3 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Tractor className="w-4 h-4 text-emerald-700" />
                      <span>Farm Land Holding (Acres)</span>
                    </label>
                    <input
                      type="number"
                      min={0.5}
                      step={0.5}
                      value={regFarmSize}
                      onChange={(e) => setRegFarmSize(Number(e.target.value))}
                      className="w-24 px-2 py-1 bg-white border border-emerald-300 rounded-lg text-xs font-bold font-mono text-center text-emerald-950"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">
                      Main Crops Grown (Select all that apply):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {commonCrops.map((c) => {
                        const isSelected = regCrops.includes(c);
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => toggleCropSelection(c)}
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
                /* Role-Specific Field: Business / Kendra / Clinic Name */
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {regRole === 'Wholesale Buyer / Trader'
                      ? 'Flour Mill / Trading Firm Name'
                      : regRole === 'Agri-Input Dealer'
                      ? 'Krishi Seva Kendra / Shop Name'
                      : 'Institution / Clinic / KVK Name'}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Kisan Samridhi Agro Foods"
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Submit Registration Button */}
              <button
                id="submit-register-btn"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span>Registering Profile...</span>
                ) : (
                  <>
                    <span>Create Account & Start Exploring</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1 border-t border-stone-200">
              <p className="text-xs text-stone-600">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMsg(null);
                  }}
                  className="font-black text-emerald-700 hover:underline cursor-pointer"
                >
                  Log In Here →
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
