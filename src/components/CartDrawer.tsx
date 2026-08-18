import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  Truck,
  CheckCircle,
  CreditCard,
  Building,
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [deliveryType, setDeliveryType] = useState<'farmgate' | 'mandi_hub'>('farmgate');
  const [farmerAddress, setFarmerAddress] = useState('Survey No. 42, Green Valley Farm, Post Malur');
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.isWholesale ? item.product.wholesalePrice : item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const regularTotal = cartItems.reduce((acc, item) => {
    return acc + item.product.originalPrice * item.quantity;
  }, 0);

  const totalSavings = regularTotal - subtotal;
  const deliveryFee = subtotal > 15000 || deliveryType === 'mandi_hub' ? 0 : 450;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      onClearCart();
      setIsOrdered(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Cart Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-base">Wholesale Input Cart</h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Cart Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {isOrdered ? (
            <div className="py-16 text-center space-y-3">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="text-xl font-bold text-stone-900">Order Confirmed!</h4>
              <p className="text-stone-600">
                Invoice generated with wholesale GST credit. Manufacturer dispatch scheduled for your farm gate delivery.
              </p>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-900 font-mono font-bold text-sm">
                Order ID: #AGRI-{Math.floor(100000 + Math.random() * 900000)}
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="py-16 text-center text-stone-400 space-y-2">
              <ShoppingBag className="w-12 h-12 mx-auto text-stone-300" />
              <p className="font-semibold text-stone-600 text-sm">Your Wholesale Cart is Empty</p>
              <p className="text-xs max-w-xs mx-auto">
                Explore certified seeds, NPK fertilizers, and farming machinery with wholesale discounts.
              </p>
            </div>
          ) : (
            <>
              {/* Item list */}
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const currentPrice = item.isWholesale
                    ? item.product.wholesalePrice
                    : item.product.price;
                  return (
                    <div
                      key={item.product.id}
                      className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                        referrerPolicy="no-referrer"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-stone-900 text-xs truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 font-mono">
                          ₹{currentPrice.toLocaleString()} / {item.product.unit}
                          {item.isWholesale && (
                            <span className="text-emerald-700 font-bold ml-1.5 font-sans">
                              (Wholesale Rate)
                            </span>
                          )}
                        </p>

                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center border border-stone-300 rounded bg-white">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.quantity - 1)
                              }
                              className="px-1.5 py-0.5 text-stone-500 hover:text-stone-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold font-mono text-stone-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.quantity + 1)
                              }
                              className="px-1.5 py-0.5 text-stone-500 hover:text-stone-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold font-mono text-stone-900 text-sm">
                          ₹{(currentPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Logistics */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Delivery Logistics</span>
                </h4>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryType('farmgate')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      deliveryType === 'farmgate'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <p className="text-xs">Direct Farm Gate</p>
                    <p className="text-[10px] text-stone-500">Delivered by Agro-Truck</p>
                  </button>

                  <button
                    onClick={() => setDeliveryType('mandi_hub')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      deliveryType === 'mandi_hub'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-700'
                    }`}
                  >
                    <p className="text-xs">Nearby Mandi APMC Hub</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">Free Pickup</p>
                  </button>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                    Delivery Address / Village & Mandi Landmark
                  </label>
                  <input
                    type="text"
                    value={farmerAddress}
                    onChange={(e) => setFarmerAddress(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-800"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cart Footer */}
        {cartItems.length > 0 && !isOrdered && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3 text-xs">
            <div className="space-y-1.5 text-stone-600">
              <div className="flex justify-between">
                <span>Wholesale Subtotal:</span>
                <span className="font-mono font-semibold text-stone-900">
                  ₹{subtotal.toLocaleString()}
                </span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Total Wholesale Bulk Savings:</span>
                  <span className="font-mono">-₹{totalSavings.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Logistics / Transport Fee:</span>
                <span className="font-mono">
                  {deliveryFee === 0 ? (
                    <strong className="text-emerald-700">FREE</strong>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-1 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-900 text-base">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              id="confirm-checkout-btn"
              onClick={handleCheckout}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Confirm Order (Pay on Delivery / Kisan Credit)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
