import React, { useState, useEffect } from 'react';
import {
  Bell,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  X,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { CropPrice, PriceAlert } from '../types';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCrop: CropPrice | null;
  cropPrices: CropPrice[];
  onSaveAlert: (alert: PriceAlert) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  selectedCrop,
  cropPrices,
  onSaveAlert,
}) => {
  const [activeCropId, setActiveCropId] = useState<string>(selectedCrop?.id || cropPrices[0]?.id || '');
  const [targetPrice, setTargetPrice] = useState<number>(selectedCrop?.currentPrice ? Math.round(selectedCrop.currentPrice * 1.05) : 3000);
  const [condition, setCondition] = useState<'above' | 'below'>('above');
  const [successSaved, setSuccessSaved] = useState(false);
  const [pushNotificationEnabled, setPushNotificationEnabled] = useState(true);

  useEffect(() => {
    if (selectedCrop) {
      setActiveCropId(selectedCrop.id);
      setTargetPrice(Math.round(selectedCrop.currentPrice * 1.05));
    }
  }, [selectedCrop]);

  if (!isOpen) return null;

  const currentCrop = cropPrices.find((c) => c.id === activeCropId) || cropPrices[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCrop) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      cropName: currentCrop.name,
      mandiName: currentCrop.mandiName,
      targetPrice: Number(targetPrice),
      condition,
      createdDate: 'Just now',
      triggered: false,
    };

    onSaveAlert(newAlert);
    setSuccessSaved(true);
    setTimeout(() => {
      setSuccessSaved(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 text-xs">
        <div className="flex items-start justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Set Mandi Price Push Alert</h3>
              <p className="text-stone-500">Get notified when rates cross your target</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {successSaved ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-stone-900">Price Alert Activated!</h4>
            <p className="text-stone-500">
              We'll send push notifications as soon as {currentCrop?.name.split(' ')[0]} reaches ₹{targetPrice}/Quintal in {currentCrop?.mandiName}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="my-4 space-y-4">
            {/* Choose Crop */}
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Select Crop</label>
              <select
                value={activeCropId}
                onChange={(e) => {
                  setActiveCropId(e.target.value);
                  const found = cropPrices.find((c) => c.id === e.target.value);
                  if (found) setTargetPrice(Math.round(found.currentPrice * 1.05));
                }}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800 font-medium"
              >
                {cropPrices.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Current: ₹{c.currentPrice} / {c.mandiName})
                  </option>
                ))}
              </select>
            </div>

            {/* Current Price Info */}
            {currentCrop && (
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-stone-500">Current Modal Price</p>
                  <p className="text-lg font-bold font-mono text-stone-900">
                    ₹{currentCrop.currentPrice.toLocaleString()} / Qtl
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-stone-500">Mandi Market</p>
                  <p className="text-xs font-semibold text-stone-800">{currentCrop.mandiName}</p>
                </div>
              </div>
            )}

            {/* Condition & Target Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Trigger Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-stone-800"
                >
                  <option value="above">Price Rises Above (≥)</option>
                  <option value="below">Price Drops Below (≤)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Target Price (₹ / Qtl) *
                </label>
                <input
                  type="number"
                  required
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(Number(e.target.value))}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                />
              </div>
            </div>

            {/* Quick Percentage Presets */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-stone-500 font-semibold">Quick Set:</span>
              {[5, 10, 15].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() =>
                    currentCrop &&
                    setTargetPrice(Math.round(currentCrop.currentPrice * (1 + pct / 100)))
                  }
                  className="px-2 py-1 bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 rounded text-[11px] font-semibold transition-colors"
                >
                  +{pct}% Target
                </button>
              ))}
            </div>

            {/* Push Permission Simulation */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="push-perm"
                checked={pushNotificationEnabled}
                onChange={(e) => setPushNotificationEnabled(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="push-perm" className="font-medium text-stone-700 cursor-pointer">
                Send instant mobile push notification and SMS alert
              </label>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
              >
                Activate Price Alert
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
