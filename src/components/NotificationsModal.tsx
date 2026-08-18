import React from 'react';
import {
  Bell,
  TrendingUp,
  AlertTriangle,
  ShoppingBag,
  CloudSun,
  CheckCircle,
  X,
} from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onNavigateTab: (tab: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 text-xs">
        <div className="flex items-start justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-base font-bold text-stone-900">Alerts & Notifications Hub</h3>
              <p className="text-stone-500">Live market spikes, disease warnings & buyer bids</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-emerald-700 hover:text-emerald-900 font-semibold text-[11px]"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-stone-700 text-lg font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="my-4 space-y-3">
          {notifications.map((n) => {
            let Icon = Bell;
            let iconBg = 'bg-emerald-100 text-emerald-800';

            if (n.type === 'price_alert') {
              Icon = TrendingUp;
              iconBg = 'bg-emerald-100 text-emerald-700';
            } else if (n.type === 'disease_warning') {
              Icon = AlertTriangle;
              iconBg = 'bg-rose-100 text-rose-700';
            } else if (n.type === 'buyer_offer') {
              Icon = ShoppingBag;
              iconBg = 'bg-amber-100 text-amber-800';
            } else if (n.type === 'weather') {
              Icon = CloudSun;
              iconBg = 'bg-sky-100 text-sky-700';
            }

            return (
              <div
                key={n.id}
                onClick={() => {
                  if (n.linkTab) {
                    onNavigateTab(n.linkTab);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  n.read
                    ? 'bg-stone-50 border-stone-200 text-stone-700'
                    : 'bg-emerald-50/50 border-emerald-300 text-stone-900 shadow-2xs'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-xs truncate">{n.title}</h4>
                    <span className="text-[10px] text-stone-400 shrink-0 font-mono ml-2">
                      {n.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">{n.message}</p>

                  {n.badge && (
                    <span className="inline-block text-[10px] font-bold text-emerald-800 bg-white border border-emerald-200 px-1.5 py-0.2 rounded mt-1">
                      {n.badge}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-stone-200 text-center">
          <p className="text-[11px] text-stone-500">
            Push alerts are refreshed in real-time based on state mandi fluctuations and agronomic sensor readings.
          </p>
        </div>
      </div>
    </div>
  );
};
