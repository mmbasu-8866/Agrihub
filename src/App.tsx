import React, { useState } from 'react';
import {
  Navbar,
  KisanQuickHub,
  MandiPricesView,
  WholesaleStoreView,
  FarmerDirectMarketView,
  CropDoctorAIView,
  WeatherAdvisoryView,
  CommunityForumView,
  CartDrawer,
  PriceAlertModal,
  NotificationsModal,
  AgriAssistantDrawer,
  AuthModal,
  LoginPageView,
} from './components';
import {
  INITIAL_CROP_PRICES,
  INITIAL_PRODUCTS,
  INITIAL_FARMER_LISTINGS,
  INITIAL_BUYER_LEADS,
  INITIAL_WEATHER_DATA,
  INITIAL_FORUM_POSTS,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import {
  CropPrice,
  MarketplaceProduct,
  FarmerListing,
  BuyerLead,
  WeatherData,
  ForumPost,
  AppNotification,
  CartItem,
  PriceAlert,
} from './types';
import { Sparkles, Bot, PhoneCall, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function App() {
  // Navigation & Search State (Canonical keys: 'prices', 'store', 'direct-market', 'doctor', 'weather', 'forum')
  const [activeTab, setActiveTab] = useState<string>('prices');
  const [searchQuery, setSearchFilter] = useState<string>('');

  // Domain Data State
  const [cropPrices, setCropPrices] = useState<CropPrice[]>(INITIAL_CROP_PRICES);
  const [products, setProducts] = useState<MarketplaceProduct[]>(INITIAL_PRODUCTS);
  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>(INITIAL_FARMER_LISTINGS);
  const [buyerLeads, setBuyerLeads] = useState<BuyerLead[]>(INITIAL_BUYER_LEADS);
  const [weatherData, setWeatherData] = useState<WeatherData>(INITIAL_WEATHER_DATA);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>(INITIAL_FORUM_POSTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals & Drawers State
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [selectedCropForAlert, setSelectedCropForAlert] = useState<CropPrice | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [prefillListingCrop, setPrefillListingCrop] = useState<string | undefined>(undefined);

  // Cart Handlers
  const handleAddToCart = (
    product: MarketplaceProduct,
    quantity: number,
    isWholesale: boolean
  ) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, isWholesale }
            : item
        );
      }
      return [...prev, { product, quantity, isWholesale }];
    });
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Price Alert Trigger
  const handleOpenPriceAlert = (crop: CropPrice) => {
    setSelectedCropForAlert(crop);
    setIsAlertModalOpen(true);
  };

  const handleSavePriceAlert = (alert: PriceAlert) => {
    const newNotification: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Price Alert Configured: ${alert.cropName}`,
      message: `Monitoring ${alert.mandiName} APMC. Alert will trigger when price is ${
        alert.condition === 'above' ? '≥' : '≤'
      } ₹${alert.targetPrice}/Qtl.`,
      timestamp: 'Just now',
      type: 'price_alert',
      read: false,
      badge: 'Active Alert',
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Farmer Listing creation from Mandi
  const handleInitiateDirectSale = (crop: CropPrice) => {
    setPrefillListingCrop(crop.name);
    setActiveTab('direct-market');
  };

  const handleAddFarmerListing = (listing: FarmerListing) => {
    setFarmerListings((prev) => [listing, ...prev]);
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `Harvest Listed: ${listing.cropName}`,
      message: `Your harvest (${listing.availableQty} ${listing.unit}) is now live for buyers across India.`,
      timestamp: 'Just now',
      type: 'buyer_offer',
      read: false,
      badge: 'New Listing',
      linkTab: 'direct-market',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Forum Handlers
  const handleAddForumPost = (post: ForumPost) => {
    setForumPosts((prev) => [post, ...prev]);
  };

  const handleLikeForumPost = (postId: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.userLiked;
          return {
            ...p,
            userLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleAddForumComment = (postId: string, commentText: string) => {
    setForumPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            authorName: 'Basavaraj M',
            authorRole: 'Farmer' as const,
            content: commentText,
            timestamp: 'Just now',
          };
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const totalCartCount = (cartItems || []).reduce((acc, item) => acc + (item.quantity || 0), 0);

  // Tab routing alias helper
  const isPricesTab = activeTab === 'prices' || activeTab === 'mandi-prices';
  const isStoreTab = activeTab === 'store' || activeTab === 'wholesale-store';
  const isDirectMarketTab = activeTab === 'direct-market' || activeTab === 'farmer-market';
  const isDoctorTab = activeTab === 'doctor' || activeTab === 'crop-doctor';
  const isWeatherTab = activeTab === 'weather';
  const isForumTab = activeTab === 'forum' || activeTab === 'community-forum';
  const isAccountTab = activeTab === 'account' || activeTab === 'login' || activeTab === 'register' || activeTab === 'profile';

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenPriceAlert={() => {
          setSelectedCropForAlert(cropPrices[0] || null);
          setIsAlertModalOpen(true);
        }}
        onOpenAssistant={() => setIsAiAssistantOpen(true)}
        cropPrices={cropPrices}
        searchQuery={searchQuery}
        setSearchQuery={setSearchFilter}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        {/* Simple Kisan Quick Action Hub */}
        <KisanQuickHub
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenAdvisor={() => setIsAiAssistantOpen(true)}
        />

        {/* View Content */}
        {isPricesTab && (
          <MandiPricesView
            cropPrices={cropPrices}
            onOpenPriceAlert={handleOpenPriceAlert}
            onInitiateDirectSale={handleInitiateDirectSale}
            searchQuery={searchQuery}
          />
        )}

        {isStoreTab && (
          <WholesaleStoreView
            products={products}
            onAddToCart={handleAddToCart}
            searchQuery={searchQuery}
          />
        )}

        {isDirectMarketTab && (
          <FarmerDirectMarketView
            listings={farmerListings}
            buyerLeads={buyerLeads}
            onAddListing={handleAddFarmerListing}
            prefillCropName={prefillListingCrop}
          />
        )}

        {isDoctorTab && (
          <CropDoctorAIView
            products={products}
            onAddToCart={handleAddToCart}
          />
        )}

        {isWeatherTab && (
          <WeatherAdvisoryView weather={weatherData} />
        )}

        {isForumTab && (
          <CommunityForumView
            posts={forumPosts}
            onAddPost={handleAddForumPost}
            onLikePost={handleLikeForumPost}
            onAddComment={handleAddForumComment}
          />
        )}

        {isAccountTab && (
          <LoginPageView onNavigateTab={setActiveTab} />
        )}
      </main>

      {/* Floating AI Krishi Assistant Trigger Button */}
      <button
        id="floating-ai-assistant-btn"
        onClick={() => setIsAiAssistantOpen(true)}
        className="fixed bottom-6 left-6 z-40 bg-gradient-to-r from-emerald-800 to-stone-900 text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 border border-emerald-500/40 group cursor-pointer"
        title="Open AI Krishi Advisor"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-emerald-300 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </div>
        <span className="hidden sm:inline font-bold text-xs">AI Krishi Doctor & Advisor</span>
      </button>

      {/* Cart Side-Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        selectedCrop={selectedCropForAlert}
        cropPrices={cropPrices}
        onSaveAlert={handleSavePriceAlert}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        onNavigateTab={(tab) => {
          if (tab === 'farmer-market' || tab === 'direct-market') setActiveTab('direct-market');
          else if (tab === 'wholesale-store' || tab === 'store') setActiveTab('store');
          else if (tab === 'crop-doctor' || tab === 'doctor') setActiveTab('doctor');
          else if (tab === 'weather') setActiveTab('weather');
          else if (tab === 'community-forum' || tab === 'forum') setActiveTab('forum');
          else setActiveTab('prices');
        }}
      />

      {/* AI Krishi Assistant Drawer */}
      <AgriAssistantDrawer
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      {/* Global Authentication Modal (Login / Create Account) */}
      <AuthModal />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs py-8 border-t border-stone-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold text-sm">AgriDirect Kisan Hub</span>
            <span>• Direct Farm-to-Buyer Exchange & Integrated Agronomy</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              APMC & e-NAM Synchronized
            </span>
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-4 h-4 text-emerald-500" />
              Direct Buyer Settlement
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
