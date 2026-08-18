export interface CropPrice {
  id: string;
  name: string;
  category: 'Cereals' | 'Pulses' | 'Vegetables' | 'Oilseeds' | 'Commercial' | 'Spices';
  currentPrice: number; // e.g. $/quintal or ₹/quintal
  unit: string;
  minPrice: number;
  maxPrice: number;
  change24h: number; // percentage (+2.4, -1.2)
  mandiName: string;
  district: string;
  state: string;
  arrivalTons: number;
  grade: 'FAQ (Fair Average Quality)' | 'Grade A' | 'Premium Export' | 'Standard';
  lastUpdated: string;
  historicPrices: { date: string; price: number; arrival: number }[];
  alertActive?: boolean;
  alertThreshold?: number;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: 'Seeds' | 'Fertilizers' | 'Pesticides & Bio' | 'Machinery & Equipment' | 'Irrigation & Tools';
  brand: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice: number;
  wholesalePrice: number;
  minWholesaleQty: number;
  unit: string;
  inStock: boolean;
  image: string;
  badge?: string;
  specs: string[];
  description: string;
  composition?: string;
  certifiedOrganic?: boolean;
}

export interface FarmerListing {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmLocation: string;
  state: string;
  cropName: string;
  variety: string;
  availableQty: number;
  unit: string;
  expectedPricePerUnit: number;
  harvestDate: string;
  grade: string;
  organicCertified: boolean;
  description: string;
  images: string[];
  status: 'Active' | 'Under Offer' | 'Sold';
  viewsCount: number;
  offers: BuyerOffer[];
}

export interface BuyerOffer {
  id: string;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  offerPrice: number;
  qty: number;
  timestamp: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

export interface BuyerLead {
  id: string;
  name: string;
  company: string;
  location: string;
  cropRequired: string;
  quantityNeeded: string;
  targetPriceRange: string;
  verifiedBuyer: boolean;
  rating: number;
  contactNumber: string;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorRole: 'Farmer' | 'Agronomist' | 'Agri-Officer' | 'Equipment Tech';
  authorAvatar: string;
  location: string;
  timestamp: string;
  category: 'Crop Advisory' | 'Pest & Disease' | 'Equipment & Tech' | 'Govt Schemes' | 'Market Trends';
  title: string;
  content: string;
  cropTag?: string;
  likes: number;
  userLiked?: boolean;
  comments: ForumComment[];
  verifiedAnswer?: string;
  imageUrl?: string;
}

export interface ForumComment {
  id: string;
  authorName: string;
  authorRole: string;
  content: string;
  timestamp: string;
  isExpert?: boolean;
}

export interface WeatherData {
  location: string;
  state: string;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number; // km/h
  precipitationProb: number; // %
  soilMoisture: number; // %
  soilTemp: number; // °C
  uvIndex: number;
  sprayAdvisory: {
    status: 'Optimal' | 'Caution' | 'Unfavorable';
    reason: string;
    bestTimeToday: string;
  };
  harvestAdvisory: {
    status: 'Favorable' | 'Delay';
    reason: string;
  };
  forecast: {
    day: string;
    date: string;
    high: number;
    low: number;
    rainProb: number;
    condition: string;
    icon: 'sun' | 'cloud' | 'rain' | 'wind';
  }[];
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
  isWholesale: boolean;
}

export interface PriceAlert {
  id: string;
  cropName: string;
  mandiName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdDate: string;
  triggered: boolean;
}

export interface CropDiagnosis {
  crop: string;
  disease: string;
  confidence: number;
  pathogen: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  symptoms: string[];
  organicRemedies: string[];
  chemicalRemedies: string[];
  prevention: string[];
  recommendedInputs: string[];
  notes: string;
  photoUrl?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'price_alert' | 'disease_warning' | 'buyer_offer' | 'weather' | 'order';
  timestamp: string;
  read: boolean;
  linkTab?: string;
  badge?: string;
}

export type UserRole =
  | 'Farmer'
  | 'Wholesale Buyer / Trader'
  | 'Agri-Input Dealer'
  | 'Agronomist';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  password?: string;
  role: UserRole;
  location: string;
  state: string;
  district?: string;
  farmSizeAcres?: number;
  cropsGrown?: string[];
  businessName?: string;
  gstNumber?: string;
  verified: boolean;
  createdAt: string;
  avatar?: string;
  bio?: string;
}

export interface RegisterData {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  location: string;
  state: string;
  district?: string;
  farmSizeAcres?: number;
  cropsGrown?: string[];
  businessName?: string;
}
