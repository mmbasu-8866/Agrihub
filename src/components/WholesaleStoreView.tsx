import React, { useState } from 'react';
import {
  ShoppingBag,
  Check,
  Star,
  ShieldCheck,
  Zap,
  Filter,
  Plus,
  Minus,
  Sparkles,
  Info,
  Tag,
  Truck,
  Leaf,
  Layers,
} from 'lucide-react';
import { MarketplaceProduct } from '../types';

interface WholesaleStoreViewProps {
  products: MarketplaceProduct[];
  onAddToCart: (product: MarketplaceProduct, quantity: number, isWholesale: boolean) => void;
  searchQuery: string;
}

export const WholesaleStoreView: React.FC<WholesaleStoreViewProps> = ({
  products,
  onAddToCart,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<MarketplaceProduct | null>(null);
  const [selectedQuantities, setSelectedQuantities] = useState<Record<string, number>>({});
  const [wholesaleMode, setWholesaleMode] = useState<Record<string, boolean>>({});
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories = [
    'All',
    'Seeds',
    'Fertilizers',
    'Pesticides & Bio',
    'Machinery & Equipment',
    'Irrigation & Tools',
  ];

  // Filtering
  const filteredProducts = products.filter((prod) => {
    const matchCat = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchOrganic = !organicOnly || prod.certifiedOrganic;
    const matchSearch =
      !searchQuery ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.specs.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchOrganic && matchSearch;
  });

  const getQuantity = (id: string, isWholesale: boolean, minQty: number) => {
    if (selectedQuantities[id]) return selectedQuantities[id];
    return isWholesale ? minQty : 1;
  };

  const setQuantity = (id: string, qty: number) => {
    setSelectedQuantities((prev) => ({ ...prev, [id]: Math.max(1, qty) }));
  };

  const toggleWholesale = (product: MarketplaceProduct) => {
    const current = wholesaleMode[product.id] || false;
    const next = !current;
    setWholesaleMode((prev) => ({ ...prev, [product.id]: next }));
    if (next) {
      setQuantity(product.id, product.minWholesaleQty);
    } else {
      setQuantity(product.id, 1);
    }
  };

  const handleAdd = (product: MarketplaceProduct) => {
    const isWholesale = wholesaleMode[product.id] || false;
    const qty = getQuantity(product.id, isWholesale, product.minWholesaleQty);
    onAddToCart(product, qty, isWholesale);

    setAddedToast(`Added ${qty}x ${product.name} to your cart!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-semibold border border-emerald-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{addedToast}</span>
        </div>
      )}

      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Certified Direct Manufacturer Wholesale Pricing
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Wholesale Agri-Inputs & Advanced Equipment
            </h2>
            <p className="text-stone-300 text-sm mt-1 max-w-2xl">
              Procure certified hybrid seeds, balanced water-soluble fertilizers, organic bio-agents, solar pumps, and agricultural drones with direct farmgate logistics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-emerald-800/60 border border-emerald-600/40 rounded-xl p-3 text-center">
              <p className="text-xs text-emerald-200 font-medium">Bulk Wholesale Tier</p>
              <p className="text-xl font-bold font-mono text-white">Save Up to 40%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Options */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Category Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Checkbox for Organic Only */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer select-none bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100">
            <input
              type="checkbox"
              checked={organicOnly}
              onChange={(e) => setOrganicOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
            />
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>Organic Certified Only</span>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredProducts.map((product) => {
          const isWholesale = wholesaleMode[product.id] || false;
          const currentPrice = isWholesale ? product.wholesalePrice : product.price;
          const currentQty = getQuantity(product.id, isWholesale, product.minWholesaleQty);
          const savings = product.originalPrice - currentPrice;
          const savingsPercent = Math.round((savings / product.originalPrice) * 100);

          return (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-stone-200 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {product.badge && (
                    <span className="absolute top-2.5 left-2.5 bg-emerald-900/90 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider backdrop-blur-xs">
                      {product.badge}
                    </span>
                  )}
                  {product.certifiedOrganic && (
                    <span className="absolute top-2.5 right-2.5 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <Leaf className="w-3 h-3" />
                      Organic
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {product.brand}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                      <span className="text-stone-400 text-[11px]">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setQuickViewProduct(product)}
                    className="font-bold text-stone-900 text-sm leading-snug line-clamp-2 cursor-pointer hover:text-emerald-700 transition-colors"
                  >
                    {product.name}
                  </h3>

                  {/* Key Specifications Chips */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {product.specs.slice(0, 2).map((sp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200/60"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>

                  {/* Wholesale Toggle Switch */}
                  <div className="pt-2">
                    <div className="bg-stone-50 p-2 rounded-lg border border-stone-200/80 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-stone-800">
                          Wholesale Bulk Rate
                        </p>
                        <p className="text-[10px] text-stone-500">
                          Min. {product.minWholesaleQty} units for ₹{product.wholesalePrice.toLocaleString()} ea
                        </p>
                      </div>

                      <button
                        onClick={() => toggleWholesale(product)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors ${
                          isWholesale
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {isWholesale ? 'Active ✓' : 'Apply'}
                      </button>
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold font-mono text-stone-950">
                          ₹{currentPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-stone-400 line-through font-mono">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 font-medium">Per {product.unit}</p>
                    </div>

                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                      Save {savingsPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Controls & Add to Cart */}
              <div className="p-4 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                    <button
                      onClick={() =>
                        setQuantity(
                          product.id,
                          currentQty - (isWholesale ? product.minWholesaleQty : 1)
                        )
                      }
                      className="p-1.5 text-stone-500 hover:text-stone-900"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-bold font-mono text-stone-900 w-8 text-center">
                      {currentQty}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(
                          product.id,
                          currentQty + (isWholesale ? product.minWholesaleQty : 1)
                        )
                      }
                      className="p-1.5 text-stone-500 hover:text-stone-900"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    id={`add-to-cart-${product.id}`}
                    onClick={() => handleAdd(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>

                  <button
                    onClick={() => {
                      const text = `Namaste! I want to order ${currentQty}x ${product.name} (Wholesale: ₹${currentPrice}/${product.unit}) via AgriDirect store. Please confirm delivery.`;
                      window.open(`https://api.whatsapp.com/send?phone=919880123456&text=${encodeURIComponent(text)}`, '_blank');
                    }}
                    className="p-2.5 bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    title="Order on WhatsApp"
                  >
                    <span className="text-sm">💬</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {quickViewProduct.category}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-1">{quickViewProduct.name}</h3>
                <p className="text-xs text-stone-500">Brand: {quickViewProduct.brand}</p>
              </div>
              <button
                onClick={() => setQuickViewProduct(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="my-4 space-y-4">
              <img
                src={quickViewProduct.image}
                alt={quickViewProduct.name}
                className="w-full h-56 object-cover rounded-xl border border-stone-200"
                referrerPolicy="no-referrer"
              />

              <div>
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-1">
                  Product Overview & Dosage
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">{quickViewProduct.description}</p>
              </div>

              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 space-y-2">
                <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Technical Specifications
                </h4>
                <ul className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                  {quickViewProduct.specs.map((sp, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{sp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <div>
                  <p className="text-xs text-emerald-800 font-medium">Wholesale Volume Price</p>
                  <p className="text-lg font-bold font-mono text-emerald-950">
                    ₹{quickViewProduct.wholesalePrice.toLocaleString()}{' '}
                    <span className="text-xs font-normal">/ {quickViewProduct.unit}</span>
                  </p>
                </div>
                <button
                  onClick={() => {
                    handleAdd(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs"
                >
                  Add Wholesale Lot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
