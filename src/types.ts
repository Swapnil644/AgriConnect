export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'farmer' | 'retailer' | 'wholesaler' | 'fpo' | 'buyer';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  userId: string;
  role: 'farmer' | 'retailer' | 'wholesaler' | 'fpo';
  shopName?: string;
  location: string;
  token?: string;
}

export interface CropListing {
  id: string;
  crop: string;
  cropMarathi: string;
  cropHindi: string;
  quantity: number;
  initialQuantity: number;
  unit: string;
  photoUrl: string;
  grade: 'A' | 'B' | 'C';
  visualCondition: string;
  visibleDamage: string;
  confidence: 'High' | 'Medium' | 'Low';
  marketReferencePrice: number;
  marketSource: string;
  marketTimestamp: string;
  suggestedPrice: number;
  farmerPrice: number;
  status: 'Ready to Sell' | 'Holding';
  holdReason?: string;
  createdAt: string;
  farmerName: string;
  farmerPhone: string;
  location: string;
  coordinates?: { lat: number; lng: number };
}

export interface Buyer {
  id: string;
  name: string;
  shopName: string;
  buyerType: 'Retailer' | 'Wholesaler' | 'Restaurant' | 'Hotel' | 'Caterer' | 'Institution';
  phone: string;
  location: string;
  distanceKm: number;
  lookingFor: string;
  quantityNeeded: string;
  indicativePrice: number;
  availability: string;
  isRegular?: boolean;
  completedOrdersCount: number;
  cancellationHistory: string;
  paymentHistory: string;
  notes?: string;
  demoLabel: string;
}

export interface BuyRequest {
  id: string;
  orderNumber?: string;
  senderType: 'farmer' | 'buyer';
  cropId: string;
  cropName: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerShop: string;
  buyerType: string;
  buyerPhone: string;
  quantity: number;
  unit: string;
  offeredPrice: number;
  totalAmount: number;
  deliveryPreference: 'Pickup' | 'Direct Delivery' | 'Mandi Hub';
  message: string;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled';
  createdAt: string;
}

export type PaymentStatus =
  | 'Payment Required'
  | 'Payment Processing'
  | 'Payment Secured'
  | 'Order In Progress'
  | 'Delivery Pending'
  | 'Delivered'
  | 'Awaiting Confirmation'
  | 'Payment Released'
  | 'Payment Disputed'
  | 'Payment On Hold'
  | 'Refunded'
  | 'Payment Failed';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'In Transit'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  cropId: string;
  cropName: string;
  grade: string;
  farmerName: string;
  farmerLocation: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerShop: string;
  buyerType: string;
  buyerPhone: string;
  buyerLocation: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  produceAmount: number;
  transportCost: number;
  platformFee: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentReference: string;
  isDemoPayment: boolean;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
  completedAt?: string;
  dispute?: {
    reason: string;
    description: string;
    raisedBy: 'buyer' | 'farmer';
    raisedAt: string;
    resolution?: string;
    resolvedAt?: string;
  };
}

export interface DigitalReceipt {
  receiptId: string;
  orderId: string;
  orderNumber: string;
  transactionDate: string;
  seller: {
    name: string;
    role: string;
    location: string;
    phone: string;
  };
  buyer: {
    name: string;
    shopName: string;
    buyerType: string;
    location: string;
    phone: string;
  };
  produce: {
    crop: string;
    quantity: number;
    unit: string;
    grade: string;
    pricePerUnit: number;
    totalProduceValue: number;
  };
  transaction: {
    produceAmount: number;
    transportCost: number;
    platformFee: number;
    totalAmount: number;
    amountPaid: number;
  };
  payment: {
    status: 'Payment Secured' | 'Payment Released' | 'Refunded' | 'Disputed' | 'Demo Transaction';
    referenceId: string;
    isDemo: boolean;
  };
  receiptStatus: 'Receipt Generated' | 'Payment Secured' | 'Transaction Completed' | 'Refunded' | 'Disputed';
}

export interface MarketReferenceItem {
  price: number;
  source: string;
  date: string;
  isDemo: boolean;
}

export interface AIQualityAnalysis {
  isPhotoClear: boolean;
  crop: string;
  cropMarathi: string;
  cropHindi: string;
  grade: 'A' | 'B' | 'C';
  visualCondition: string;
  visibleDamage: string;
  confidence: 'High' | 'Medium' | 'Low';
  marketReferencePrice: number;
  suggestedStartingPrice: number;
  observations: string;
  disclaimer: string;
}
