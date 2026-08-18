import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, RegisterData } from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-farmer-1',
    name: 'Ramesh Kumar Patel',
    phone: '9876543210',
    email: 'ramesh.kisan@gmail.com',
    password: 'password123',
    role: 'Farmer',
    location: 'Sanwer Village, Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    farmSizeAcres: 12,
    cropsGrown: ['Wheat (Sharbati)', 'Soybean (JS 9560)', 'Gram / Chana'],
    verified: true,
    createdAt: '2025-11-12',
    avatar: '👨‍🌾',
    bio: 'Progressive organic and grain farmer in Indore. Practicing micro-irrigation and crop rotation.',
  },
  {
    id: 'user-buyer-2',
    name: 'Vikram Singhania',
    phone: '9822334455',
    email: 'vikram.grainmills@gmail.com',
    password: 'password123',
    role: 'Wholesale Buyer / Trader',
    businessName: 'Singhania Agro Foods & Flour Mills',
    location: 'GT Road Grain Complex, Karnal',
    district: 'Karnal',
    state: 'Haryana',
    gstNumber: '06AAACS1234F1Z8',
    verified: true,
    createdAt: '2025-08-15',
    avatar: '🏢',
    bio: 'Direct bulk processor & miller. Procuring 200+ quintals of Grade A Wheat and Paddy weekly.',
  },
  {
    id: 'user-dealer-3',
    name: 'Anand Sharma',
    phone: '9811223344',
    email: 'anand.krishi@gmail.com',
    password: 'password123',
    role: 'Agri-Input Dealer',
    businessName: 'Kisan Samridhi Krishi Seva Kendra',
    location: 'Mandi Gate No. 2, Kota',
    district: 'Kota',
    state: 'Rajasthan',
    gstNumber: '08AAACS9876F1Z2',
    verified: true,
    createdAt: '2026-01-10',
    avatar: '🛒',
    bio: 'Authorized distributor of certified hybrid seeds, IFFCO bio-fertilizers, and drip tools.',
  },
  {
    id: 'user-agronomist-4',
    name: 'Dr. Sunita Deshmukh',
    phone: '9844556677',
    email: 'dr.sunita.agro@gmail.com',
    password: 'password123',
    role: 'Agronomist',
    businessName: 'Krishi Vigyan Kendra (KVK)',
    location: 'Shivaji Nagar, Pune',
    district: 'Pune',
    state: 'Maharashtra',
    verified: true,
    createdAt: '2025-04-20',
    avatar: '🩺',
    bio: 'Senior plant pathologist & soil health consultant. 14+ years advising farmers on IPM.',
  },
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  login: (identifier: string, passwordOrOtp: string) => Promise<{ success: boolean; message: string }>;
  loginWithOtp: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>;
  quickDemoLogin: (user: UserProfile) => void;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  savedAccounts: UserProfile[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'agridirect_registered_users_v1';
const CURRENT_USER_KEY = 'agridirect_current_active_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedAccounts, setSavedAccounts] = useState<UserProfile[]>(() => {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load users from localStorage', e);
    }
    return DEMO_USERS;
  });

  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load current user from localStorage', e);
    }
    // Start with default Farmer login for great immediate experience or null
    return DEMO_USERS[0];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(savedAccounts));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [savedAccounts]);

  // Sync current user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save current user to localStorage', e);
    }
  }, [user]);

  const openLoginModal = () => {
    setAuthModalMode('login');
    setIsAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthModalMode('register');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (
    identifier: string,
    passwordOrOtp: string
  ): Promise<{ success: boolean; message: string }> => {
    const trimmedId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/[^0-9]/g, '');

    const found = savedAccounts.find((u) => {
      const matchPhone = cleanPhone && u.phone.replace(/[^0-9]/g, '').includes(cleanPhone);
      const matchEmail = u.email && u.email.toLowerCase() === trimmedId;
      const matchName = u.name.toLowerCase() === trimmedId;
      return matchPhone || matchEmail || matchName;
    });

    if (!found) {
      return {
        success: false,
        message: 'Account not found. Please verify your phone number/email or create a new account.',
      };
    }

    if (found.password && found.password !== passwordOrOtp && passwordOrOtp !== '123456' && passwordOrOtp !== '1234') {
      return {
        success: false,
        message: 'Incorrect password. (Tip: Use default "password123" or OTP "123456")',
      };
    }

    setUser(found);
    setIsAuthModalOpen(false);
    return {
      success: true,
      message: `Welcome back, ${found.name}! You are logged in as ${found.role}.`,
    };
  };

  const loginWithOtp = async (
    phone: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const found = savedAccounts.find((u) => u.phone.replace(/[^0-9]/g, '').includes(cleanPhone));

    if (!found) {
      return {
        success: false,
        message: 'No account linked to this mobile number. Please click "Create Account" below.',
      };
    }

    if (otp !== '123456' && otp !== '1234' && otp !== '9999') {
      return {
        success: false,
        message: 'Invalid OTP. Please enter valid 6-digit verification code (Demo OTP: 123456).',
      };
    }

    setUser(found);
    setIsAuthModalOpen(false);
    return {
      success: true,
      message: `Welcome back, ${found.name}! Phone verification successful.`,
    };
  };

  const quickDemoLogin = (demoUser: UserProfile) => {
    setUser(demoUser);
    setIsAuthModalOpen(false);
  };

  const register = async (data: RegisterData): Promise<{ success: boolean; message: string }> => {
    const cleanPhone = data.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Please enter a valid 10-digit mobile number.' };
    }

    const existing = savedAccounts.find(
      (u) => u.phone.replace(/[^0-9]/g, '') === cleanPhone || (data.email && u.email === data.email)
    );

    if (existing) {
      return {
        success: false,
        message: 'An account with this phone number or email already exists. Please log in.',
      };
    }

    const roleAvatarMap: Record<string, string> = {
      Farmer: '👨‍🌾',
      'Wholesale Buyer / Trader': '🏢',
      'Agri-Input Dealer': '🛒',
      Agronomist: '🩺',
    };

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      phone: cleanPhone,
      email: data.email?.trim() || undefined,
      password: data.password || 'password123',
      role: data.role,
      location: data.location || 'Rural Agrarian Belt',
      district: data.district || '',
      state: data.state || 'Madhya Pradesh',
      farmSizeAcres: data.farmSizeAcres,
      cropsGrown: data.cropsGrown || ['Wheat', 'Paddy'],
      businessName: data.businessName,
      verified: true,
      createdAt: new Date().toISOString().split('T')[0],
      avatar: roleAvatarMap[data.role] || '🌱',
      bio: `Registered ${data.role} from ${data.location}, ${data.state}.`,
    };

    const updatedAccounts = [newUser, ...savedAccounts];
    setSavedAccounts(updatedAccounts);
    setUser(newUser);
    setIsAuthModalOpen(false);

    return {
      success: true,
      message: `Account created successfully! Welcome to AgriDirect, ${newUser.name}.`,
    };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updated };
    setUser(updatedUser);
    setSavedAccounts((prev) =>
      prev.map((acc) => (acc.id === user.id ? updatedUser : acc))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        openLoginModal,
        openRegisterModal,
        closeAuthModal,
        login,
        loginWithOtp,
        quickDemoLogin,
        register,
        logout,
        updateProfile,
        savedAccounts,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
