import React, { useState } from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  MessageSquare,
  ShieldCheck,
  Building,
  UserCheck,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  Upload,
} from 'lucide-react';
import { FarmerListing, BuyerLead, BuyerOffer } from '../types';
import { useAuth } from '../context/AuthContext';

interface FarmerDirectMarketViewProps {
  listings: FarmerListing[];
  buyerLeads: BuyerLead[];
  onAddListing: (listing: FarmerListing) => void;
  prefillCropName?: string;
}

export const FarmerDirectMarketView: React.FC<FarmerDirectMarketViewProps> = ({
  listings,
  buyerLeads,
  onAddListing,
  prefillCropName,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'listings' | 'buyer-requests' | 'my-offers'>('listings');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(!!prefillCropName);
  const [selectedListingForContact, setSelectedListingForContact] = useState<FarmerListing | null>(null);
  const [selectedBuyerLeadForContact, setSelectedBuyerLeadForContact] = useState<BuyerLead | null>(null);

  // New Listing Form State
  const [farmerName, setFarmerName] = useState(user?.name || 'Basavaraj M');
  const [farmerPhone, setFarmerPhone] = useState(user?.phone || '+91 98801 23456');
  const [farmLocation, setFarmLocation] = useState(user?.location || 'Davanagere Rural');
  const [state, setState] = useState(user?.state || 'Karnataka');
  const [cropName, setCropName] = useState(prefillCropName || 'Wheat (Sharbati Gold)');

  React.useEffect(() => {
    if (user) {
      setFarmerName(user.name);
      setFarmerPhone(user.phone);
      setFarmLocation(user.location);
      if (user.state) setState(user.state);
    }
  }, [user]);
  const [variety, setVariety] = useState('Sharbati Grade A');
  const [availableQty, setAvailableQty] = useState(150);
  const [unit, setUnit] = useState('Quintals');
  const [expectedPrice, setExpectedPrice] = useState(2900);
  const [harvestDate, setHarvestDate] = useState('Ready for Immediate Dispatch');
  const [grade, setGrade] = useState('Grade A Export');
  const [organicCertified, setOrganicCertified] = useState(false);
  const [description, setDescription] = useState('Sun-dried, thoroughly cleaned golden grain. Zero moisture damage. Available for direct weighbridge inspection.');
  const [listingSuccessToast, setListingSuccessToast] = useState(false);

  // Offer submission state
  const [offerPrice, setOfferPrice] = useState(2850);
  const [offerQty, setOfferQty] = useState(50);
  const [buyerName, setBuyerName] = useState('Agro Mills Direct');
  const [buyerMessage, setBuyerMessage] = useState('We can send our transport truck within 48 hours.');
  const [offerSentSuccess, setOfferSentSuccess] = useState(false);

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    const newListing: FarmerListing = {
      id: `list-${Date.now()}`,
      farmerName,
      farmerPhone,
      farmLocation,
      state,
      cropName,
      variety,
      availableQty: Number(availableQty),
      unit,
      expectedPricePerUnit: Number(expectedPrice),
      harvestDate,
      grade,
      organicCertified,
      description,
      images: [
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
      ],
      status: 'Active',
      viewsCount: 1,
      offers: [],
    };

    onAddListing(newListing);
    setShowCreateModal(false);
    setListingSuccessToast(true);
    setTimeout(() => setListingSuccessToast(false), 4000);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForContact) return;

    const newOffer: BuyerOffer = {
      id: `off-${Date.now()}`,
      buyerName,
      buyerCompany: 'Direct Trader Logistics',
      buyerPhone: '+91 94480 99887',
      offerPrice: Number(offerPrice),
      qty: Number(offerQty),
      timestamp: 'Just now',
      message: buyerMessage,
      status: 'Pending',
    };

    selectedListingForContact.offers.unshift(newOffer);
    setOfferSentSuccess(true);
    setTimeout(() => {
      setOfferSentSuccess(false);
      setSelectedListingForContact(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {listingSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold border border-emerald-700">
          <CheckCircle className="w-5 h-5 text-emerald-400" />
          <span>Your harvest has been listed on the National Direct Buyer Exchange!</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-stone-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-600/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Direct Farmer-to-Buyer Marketplace (Zero Middlemen Fees)
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Sell Your Harvest Directly to Verified Buyers
            </h2>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              Post your crop volume, negotiate directly with institutional mills, food processors, and wholesale merchants at premium spot rates.
            </p>
          </div>

          <button
            id="create-harvest-listing-btn"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm hover:bg-emerald-50 transition-all shadow-lg hover:scale-105 shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-emerald-700" />
            <span>List My Harvest for Sale</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'listings'
                ? 'bg-emerald-700 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Farmer Harvest Listings ({listings.length})
          </button>
          <button
            onClick={() => setActiveTab('buyer-requests')}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${
              activeTab === 'buyer-requests'
                ? 'bg-emerald-700 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Verified Buyer Requests ({buyerLeads.length})
          </button>
        </div>

        <span className="text-xs text-stone-500 hidden sm:block">
          All transactions verified through weighbridge certification
        </span>
      </div>

      {/* 1. Farmer Produce Listings Tab */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Images */}
                <div className="relative h-44 bg-stone-100">
                  <img
                    src={item.images[0]}
                    alt={item.cropName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    {item.availableQty} {item.unit}
                  </div>
                  {item.organicCertified && (
                    <span className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Organic Certified
                    </span>
                  )}
                </div>

                {/* Listing Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.grade}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">
                      {item.offers.length} active offer(s)
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base">{item.cropName}</h3>
                  <p className="text-xs text-stone-600 font-medium">Variety: {item.variety}</p>

                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Location & Harvest Timing */}
                  <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">
                        {item.farmLocation}, {item.state}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-600">
                      <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{item.harvestDate}</span>
                    </div>
                  </div>

                  {/* Expected Price Row */}
                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-stone-500">Expected Price</span>
                      <p className="text-xl font-bold font-mono text-emerald-900">
                        ₹{item.expectedPricePerUnit.toLocaleString()}
                        <span className="text-xs font-normal text-stone-500"> / {item.unit}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-400">Seller</span>
                      <p className="text-xs font-bold text-stone-800">{item.farmerName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 border-t border-stone-100 flex items-center gap-2 mt-2">
                <button
                  id={`contact-farmer-${item.id}`}
                  onClick={() => setSelectedListingForContact(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Offer / Deal</span>
                </button>

                <a
                  href={`tel:${item.farmerPhone}`}
                  className="p-2.5 border border-stone-200 hover:border-emerald-500 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Call Farmer Directly"
                >
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>Call</span>
                </a>

                <button
                  onClick={() => {
                    const text = `Namaste ${item.farmerName} ji! I saw your harvest listing for ${item.cropName} (${item.availableQty} ${item.unit}) on AgriDirect app. I am interested in buying.`;
                    window.open(`https://api.whatsapp.com/send?phone=${item.farmerPhone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="p-2.5 border border-green-200 hover:border-green-500 rounded-xl text-green-800 bg-green-50 hover:bg-green-100 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
                  title="Chat on WhatsApp"
                >
                  <span className="text-sm">💬</span>
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. Verified Buyer Procurement Requests */}
      {activeTab === 'buyer-requests' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {buyerLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs hover:border-emerald-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <Building className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-stone-900 text-sm">{lead.company}</h4>
                        {lead.verifiedBuyer && (
                          <span title="Verified Institutional Procurement Entity">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">Procurement Officer: {lead.name}</p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    ★ {lead.rating} Verified Buyer
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-lg text-xs">
                  <div>
                    <span className="text-stone-500">Crop In Demand:</span>
                    <p className="font-bold text-stone-900 mt-0.5">{lead.cropRequired}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Target Volume:</span>
                    <p className="font-bold text-stone-900 mt-0.5">{lead.quantityNeeded}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Price Budget:</span>
                    <p className="font-bold text-emerald-800 mt-0.5">{lead.targetPriceRange}</p>
                  </div>
                  <div>
                    <span className="text-stone-500">Delivery Region:</span>
                    <p className="font-medium text-stone-700 mt-0.5">{lead.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500">Immediate Bank Guarantee Settlement</span>
                <button
                  id={`connect-buyer-${lead.id}`}
                  onClick={() => setSelectedBuyerLeadForContact(lead)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Supply Proposal</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Harvest Listing */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-bold text-stone-900">List Your Harvest for Sale</h3>
                <p className="text-xs text-stone-500">
                  Connect directly with verified wholesale buyers and food processing mills.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="my-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Crop Name & Type *</label>
                  <input
                    type="text"
                    required
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                    placeholder="e.g. Wheat, Basmati Paddy, Cotton"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Variety / Cultivar</label>
                  <input
                    type="text"
                    value={variety}
                    onChange={(e) => setVariety(e.target.value)}
                    placeholder="e.g. Sharbati Lokwan, Pusa 1121"
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Available Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={availableQty}
                    onChange={(e) => setAvailableQty(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 bg-white"
                  >
                    <option value="Quintals">Quintals (100 kg)</option>
                    <option value="Tons">Tons (1,000 kg)</option>
                    <option value="Bags (50kg)">Bags (50 kg)</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Expected Price (₹ / {unit}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Farmer Name</label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Contact Number</label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Farm Location / Village</label>
                  <input
                    type="text"
                    required
                    value={farmLocation}
                    onChange={(e) => setFarmLocation(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Produce Description & Quality Details
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="organic-cert"
                  checked={organicCertified}
                  onChange={(e) => setOrganicCertified(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="organic-cert" className="font-semibold text-stone-700 cursor-pointer">
                  Certified Organic Produce (Attach certificate during buyer inspection)
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                >
                  Publish Listing to Buyers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Make an Offer to Farmer */}
      {selectedListingForContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Connect with {selectedListingForContact.farmerName}
                </h3>
                <p className="text-xs text-stone-500">{selectedListingForContact.cropName}</p>
              </div>
              <button
                onClick={() => setSelectedListingForContact(null)}
                className="p-1 text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {offerSentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-stone-900">Offer Submitted Successfully!</h4>
                <p className="text-stone-500">
                  The farmer has received your offer notification and will review the pricing.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="my-4 space-y-3">
                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Farmer Expected Price:</span>
                    <span className="font-bold text-stone-900">
                      ₹{selectedListingForContact.expectedPricePerUnit} / {selectedListingForContact.unit}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Available Lot:</span>
                    <span>
                      {selectedListingForContact.availableQty} {selectedListingForContact.unit}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Your Offer Price (₹ / {selectedListingForContact.unit}) *
                    </label>
                    <input
                      type="number"
                      required
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full p-2.5 border border-stone-300 rounded-lg font-mono font-bold text-stone-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Quantity Desired *</label>
                    <input
                      type="number"
                      required
                      value={offerQty}
                      onChange={(e) => setOfferQty(Number(e.target.value))}
                      className="w-full p-2.5 border border-stone-300 rounded-lg font-mono text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Your Name / Mill Entity</label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Message / Logistics Plan</label>
                  <textarea
                    rows={2}
                    value={buyerMessage}
                    onChange={(e) => setBuyerMessage(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
                  />
                </div>

                <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedListingForContact(null)}
                    className="px-4 py-2 font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs"
                  >
                    Submit Purchase Offer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Send Proposal to Buyer Lead */}
      {selectedBuyerLeadForContact && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 text-xs">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Connect with {selectedBuyerLeadForContact.company}
                </h3>
                <p className="text-stone-500">Contact: {selectedBuyerLeadForContact.contactNumber}</p>
              </div>
              <button
                onClick={() => setSelectedBuyerLeadForContact(null)}
                className="p-1 text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-3">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 space-y-1">
                <p className="font-semibold text-emerald-950">
                  Demand: {selectedBuyerLeadForContact.cropRequired}
                </p>
                <p className="text-stone-600">Quantity: {selectedBuyerLeadForContact.quantityNeeded}</p>
                <p className="text-emerald-800 font-bold">
                  Price Target: {selectedBuyerLeadForContact.targetPriceRange}
                </p>
              </div>

              <p className="text-stone-600">
                You can directly dial the verified procurement desk or send your digital harvest certificate via WhatsApp.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <a
                  href={`tel:${selectedBuyerLeadForContact.contactNumber}`}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Buyer Directly</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
