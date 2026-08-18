import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Tractor,
  Building2,
  ShieldCheck,
  LogOut,
  X,
  Edit2,
  Check,
  RefreshCw,
  Users,
  Wheat,
  Plus,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuthModal?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenAuthModal,
}) => {
  const { user, logout, updateProfile, savedAccounts, quickDemoLogin, openRegisterModal } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [editLocation, setEditLocation] = useState(user?.location || '');
  const [editFarmSize, setEditFarmSize] = useState<number>(user?.farmSizeAcres || 5);

  React.useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone);
      setEditLocation(user.location);
      setEditFarmSize(user.farmSizeAcres || 5);
      setIsEditing(false);
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      location: editLocation,
      farmSizeAcres: Number(editFarmSize) || 0,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-600/60 flex items-center justify-center text-2xl shadow-xs">
              {user.avatar || '👨‍🌾'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">{user.name}</h3>
                <span className="text-[10px] font-black bg-emerald-700 text-emerald-100 px-2 py-0.5 rounded-full border border-emerald-500/40">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-emerald-200 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{user.location}, {user.state}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-emerald-200 hover:text-white rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Account Overview Cards */}
          {!isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase">Mobile No.</span>
                  <p className="font-mono font-bold text-stone-900 mt-0.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span>+91 {user.phone}</span>
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200">
                  <span className="text-[10px] text-stone-500 font-bold uppercase">Account Status</span>
                  <p className="font-bold text-emerald-800 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>KYC Verified ✓</span>
                  </p>
                </div>
              </div>

              {/* Farmer Specific Land & Crops */}
              {user.role === 'Farmer' && (
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950 flex items-center gap-1">
                      <Tractor className="w-4 h-4 text-emerald-700" />
                      <span>Farm Land Holding:</span>
                    </span>
                    <span className="font-black font-mono text-emerald-900 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300">
                      {user.farmSizeAcres || 0} Acres
                    </span>
                  </div>

                  {user.cropsGrown && user.cropsGrown.length > 0 && (
                    <div>
                      <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                        Cultivated Crops:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {user.cropsGrown.map((c, i) => (
                          <span
                            key={i}
                            className="bg-white text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-300"
                          >
                            🌾 {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Business Specific Details */}
              {user.businessName && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs">
                  <span className="text-[10px] text-stone-500 font-bold uppercase">Registered Business</span>
                  <p className="font-bold text-stone-900 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>{user.businessName}</span>
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Edit Profile Details</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Editing Mode */
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Location / Village</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                />
              </div>

              {user.role === 'Farmer' && (
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Farm Land Holding (Acres)</label>
                  <input
                    type="number"
                    value={editFarmSize}
                    onChange={(e) => setEditFarmSize(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>
              )}

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="py-2.5 px-4 bg-stone-100 text-stone-700 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Switch Saved Accounts section */}
          <div className="pt-3 border-t border-stone-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>Switch Account ({savedAccounts.length} Saved)</span>
              </span>
              <button
                onClick={() => {
                  onClose();
                  openRegisterModal();
                }}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Account</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {savedAccounts.map((acc) => {
                const isActive = acc.id === user.id;
                return (
                  <button
                    key={acc.id}
                    onClick={() => {
                      quickDemoLogin(acc);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                        : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{acc.avatar || '👤'}</span>
                      <div>
                        <p className="text-xs font-black leading-tight">{acc.name}</p>
                        <p className="text-[10px] text-stone-500">{acc.role} • {acc.location.split(',')[0]}</p>
                      </div>
                    </div>

                    {isActive ? (
                      <span className="text-xs text-emerald-700 font-bold">Active ●</span>
                    ) : (
                      <span className="text-xs text-stone-400 font-semibold">Switch →</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
