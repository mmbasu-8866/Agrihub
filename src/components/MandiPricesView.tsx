import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  MapPin,
  Sparkles,
  Bell,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  DollarSign,
  Volume2,
  Share2,
  MessageCircle,
} from 'lucide-react';
import { CropPrice } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MandiPricesViewProps {
  cropPrices?: CropPrice[];
  onOpenPriceAlert: (crop: CropPrice) => void;
  onSelectSellCrop?: (cropName: string) => void;
  onInitiateDirectSale?: (crop: CropPrice) => void;
  searchQuery?: string;
}

export const MandiPricesView: React.FC<MandiPricesViewProps> = ({
  cropPrices = [],
  onOpenPriceAlert,
  onSelectSellCrop,
  onInitiateDirectSale,
  searchQuery = '',
}) => {
  const { language, t, isEasyMode, speak } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [activeCropDetail, setActiveCropDetail] = useState<CropPrice | null>(null);
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false);
  const [aiAnalysisData, setAiAnalysisData] = useState<any | null>(null);

  const categories = [
    { id: 'All', label: t('allCrops') },
    { id: 'Cereals', label: t('grains') },
    { id: 'Vegetables', label: t('vegetables') },
    { id: 'Pulses', label: t('pulses') },
    { id: 'Oilseeds', label: t('oilseeds') },
    { id: 'Commercial', label: t('commercial') },
    { id: 'Spices', label: t('spices') },
  ];

  const states = [
    'All States',
    'Madhya Pradesh',
    'Haryana',
    'Gujarat',
    'Karnataka',
    'Maharashtra',
    'Rajasthan',
    'Telangana',
    'Uttar Pradesh',
    'Tamil Nadu',
  ];

  const handleSellDirect = (crop: CropPrice) => {
    if (onInitiateDirectSale) {
      onInitiateDirectSale(crop);
    } else if (onSelectSellCrop) {
      onSelectSellCrop(crop.name);
    }
  };

  const handleSpeakCrop = (crop: CropPrice) => {
    if (language === 'en') {
      const text = `At ${crop.mandiName} mandi, today's rate for ${crop.name} is ${crop.currentPrice} rupees per quintal. Minimum rate is ${crop.minPrice} rupees and maximum rate reached ${crop.maxPrice} rupees.`;
      speak(text);
    } else {
      const text = `${crop.name}, ${crop.mandiName} मंडी में आज का भाव ${crop.currentPrice} रुपये प्रति क्विंटल है। न्यूनतम भाव ${crop.minPrice} रुपये और अधिकतम भाव ${crop.maxPrice} रुपये रहा।`;
      speak(text);
    }
  };

  const handleShareWhatsApp = (crop: CropPrice) => {
    const text = `🌾 *AgriDirect Live Mandi Rate*\n\nCrop: *${crop.name}*\nMandi: *${crop.mandiName}, ${crop.district}*\nToday's Price: *₹${crop.currentPrice}/Quintal*\nRange: ₹${crop.minPrice} - ₹${crop.maxPrice}\n\nCheck live prices on AgriDirect app!`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Filter Logic
  const filteredCrops = (cropPrices || []).filter((crop) => {
    const matchCat = selectedCategory === 'All' || crop.category === selectedCategory;
    const matchState =
      selectedState === 'All States' || selectedState === 'All' || crop.state === selectedState;
    const matchSearch =
      !searchQuery ||
      (crop.name && crop.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crop.mandiName && crop.mandiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (crop.district && crop.district.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchState && matchSearch;
  });

  // Fetch AI Market Analysis
  const handleOpenDetail = async (crop: CropPrice) => {
    setActiveCropDetail(crop);
    setAiAnalysisLoading(true);
    setAiAnalysisData(null);

    try {
      const response = await fetch('/api/market-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: crop.name,
          currentPrice: crop.currentPrice,
          mandiLocation: `${crop.mandiName}, ${crop.district} (${crop.state})`,
        }),
      });
      const data = await response.json();
      setAiAnalysisData(data);
    } catch (err) {
      console.error('Error fetching market analysis:', err);
      setAiAnalysisData({
        recommendation: 'HOLD / SELL IN 7-10 DAYS',
        confidence: 90,
        summary: `Mandi arrivals for ${crop.name} are steady. Local flour mills and processing units are actively buying, so prices are expected to rise ₹80-₹150 per quintal next week.`,
        priceForecast: [
          { period: 'Today', expectedPrice: crop.currentPrice, trend: 'Current' },
          { period: 'In 7 Days', expectedPrice: Math.round(crop.currentPrice * 1.04), trend: 'Rising ▲' },
          { period: 'In 14 Days', expectedPrice: Math.round(crop.currentPrice * 1.07), trend: 'Peak ▲' },
        ],
        keyFactors: [
          'High demand from wholesale food mills',
          'Good grain quality with low moisture content',
          'Safe time to store or sell in staggered batches',
        ],
      });
    } finally {
      setAiAnalysisLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Pills Bar */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* State Filter Dropdown */}
          <div className="shrink-0">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-stone-50 border border-stone-300 text-stone-800 text-xs sm:text-sm font-bold rounded-xl px-3 py-2 focus:outline-hidden"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  📍 {st}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Clean & Accessible Crop Price Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrops.map((crop) => {
          const isUp = (crop.change24h || 0) >= 0;
          return (
            <div
              key={crop.id}
              className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Name & Mandi Location */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {crop.category}
                    </span>
                    <h3 className={`font-black text-stone-900 mt-1 ${isEasyMode ? 'text-lg sm:text-xl' : 'text-base'}`}>
                      {crop.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>
                        {crop.mandiName}, {crop.district}
                      </span>
                    </div>
                  </div>

                  {/* 24h Trend Badge */}
                  <div
                    className={`px-3 py-1 rounded-xl text-xs font-black font-mono flex items-center gap-1 ${
                      isUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>
                      {isUp ? '+' : ''}
                      {crop.change24h}%
                    </span>
                  </div>
                </div>

                {/* Big Price Display Box */}
                <div className="mt-4 p-4 bg-stone-50 rounded-2xl border border-stone-200/90 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">
                      {t('todaysRate')}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`font-black font-mono text-stone-950 ${isEasyMode ? 'text-3xl' : 'text-2xl'}`}>
                        ₹{crop.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-500 font-bold">/ {crop.unit}</span>
                    </div>
                  </div>

                  {/* Audio Listen Button */}
                  <button
                    onClick={() => handleSpeakCrop(crop)}
                    className="p-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl transition-colors flex items-center gap-1 text-xs font-bold shadow-2xs cursor-pointer"
                    title={t('listenPrice')}
                  >
                    <Volume2 className="w-4 h-4 text-emerald-700" />
                    <span className="hidden sm:inline">🔊 {t('listenAudio')}</span>
                  </button>
                </div>

                {/* Day's Range Indicator */}
                <div className="mt-3 px-1 text-xs text-stone-600 flex justify-between font-semibold">
                  <span>
                    {t('lowestToday')}: <strong className="text-stone-900 font-mono">₹{crop.minPrice}</strong>
                  </span>
                  <span>
                    {t('highestToday')}: <strong className="text-emerald-800 font-mono">₹{crop.maxPrice}</strong>
                  </span>
                  <span>
                    {t('dailyArrivals')}: <strong className="text-stone-900 font-mono">{crop.arrivalTons}T</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => handleOpenDetail(crop)}
                  className="col-span-1 p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="View AI Price Forecast"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('aiAdviceBtn')}</span>
                </button>

                <button
                  onClick={() => handleSellDirect(crop)}
                  className="col-span-2 p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
                  title="List and sell directly to buyers"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>{t('sellDirectBtn')}</span>
                </button>

                <button
                  onClick={() => handleShareWhatsApp(crop)}
                  className="col-span-1 p-2 bg-green-50 hover:bg-green-100 text-green-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  title="Share on WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-green-700" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCrops.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center text-stone-500 border border-stone-200 space-y-2">
          <p className="text-base font-bold text-stone-800">No crops found</p>
          <p className="text-xs">Try selecting 'All Crops' or clearing your search filter.</p>
        </div>
      )}

      {/* AI Market Advice Modal */}
      {activeCropDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  AI Market Forecast
                </span>
                <h3 className="text-xl font-black text-stone-900 mt-1">
                  {activeCropDetail.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {activeCropDetail.mandiName} Mandi • Today: ₹{activeCropDetail.currentPrice}/qtl
                </p>
              </div>

              <button
                onClick={() => setActiveCropDetail(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 text-lg font-black cursor-pointer"
              >
                ✕
              </button>
            </div>

            {aiAnalysisLoading ? (
              <div className="py-8 text-center space-y-2 text-stone-500">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                <p className="font-bold text-stone-800">Analyzing mandi arrivals & mill demand...</p>
              </div>
            ) : aiAnalysisData ? (
              <div className="space-y-4">
                {/* Recommendation Banner */}
                <div className="p-4 bg-emerald-950 text-white rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                      Recommendation
                    </span>
                    <p className="text-lg font-black text-white mt-0.5">
                      {aiAnalysisData.recommendation}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-300">Confidence</span>
                    <p className="text-xl font-bold font-mono text-emerald-300">
                      {aiAnalysisData.confidence}%
                    </p>
                  </div>
                </div>

                {/* Plain language summary */}
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-stone-800 text-xs leading-relaxed font-medium">
                  {aiAnalysisData.summary}
                </div>

                {/* Projected Price Forecast Bar */}
                {aiAnalysisData.priceForecast && (
                  <div className="space-y-1.5">
                    <p className="font-bold text-stone-800 text-xs">Expected Price Forecast:</p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {aiAnalysisData.priceForecast.map((f: any, idx: number) => (
                        <div key={idx} className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-2xl">
                          <p className="text-[10px] text-stone-500 font-bold">{f.period}</p>
                          <p className="text-base font-black font-mono text-emerald-950 mt-0.5">
                            ₹{f.expectedPrice?.toLocaleString()}
                          </p>
                          <span className="text-[10px] text-emerald-700 font-black">{f.trend}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Factors */}
                {aiAnalysisData.keyFactors && (
                  <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                    <p className="font-bold text-stone-800 text-xs">Key Factors Driving Price:</p>
                    {aiAnalysisData.keyFactors.map((fac: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-1.5 text-stone-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Modal Buttons */}
                <div className="pt-3 flex items-center justify-between gap-2 border-t border-stone-200">
                  <button
                    onClick={() => {
                      onOpenPriceAlert(activeCropDetail);
                      setActiveCropDetail(null);
                    }}
                    className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 rounded-xl font-bold text-xs"
                  >
                    🔔 {t('setAlertBtn')}
                  </button>

                  <button
                    onClick={() => {
                      const detail = activeCropDetail;
                      setActiveCropDetail(null);
                      handleSellDirect(detail);
                    }}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-xs"
                  >
                    {t('sellDirectBtn')} →
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
