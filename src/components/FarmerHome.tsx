import React from 'react';
import { Sprout, Phone, Users, PackageCheck, Clock, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { CropListing, Buyer, BuyRequest, OrderRecord, Language } from '../types';
import { translations } from '../i18n';

interface FarmerHomeProps {
  language: Language;
  farmerName: string;
  location: string;
  crops: CropListing[];
  buyers: Buyer[];
  requests: BuyRequest[];
  orders: OrderRecord[];
  onStartSell: () => void;
  onNavigateTab: (tab: string) => void;
  onAcceptRequest: (reqId: string) => void;
  onRejectRequest: (reqId: string) => void;
  onSelectOrder: (order: OrderRecord) => void;
  onOpenAi: () => void;
}

export const FarmerHome: React.FC<FarmerHomeProps> = ({
  language,
  farmerName,
  location,
  crops,
  buyers,
  requests,
  orders,
  onStartSell,
  onNavigateTab,
  onAcceptRequest,
  onRejectRequest,
  onSelectOrder,
}) => {
  const t = translations[language];

  const pendingRequests = requests.filter((r) => r.status === 'Pending');
  const activeOrders = orders.filter((o) => o.orderStatus !== 'Completed' && o.orderStatus !== 'Cancelled');
  const regularBuyers = buyers.filter((b) => b.isRegular);

  return (
    <div className="space-y-5 pb-28 max-w-xl mx-auto px-3 sm:px-4 pt-4 w-full box-border">
      {/* 1. Welcoming Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight truncate">
            {t.namaskar}, {farmerName} 👋
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-600 flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span>📍 {location}</span>
            <span className="text-stone-300">•</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              Mandi Open Today
            </span>
          </p>
        </div>
      </div>

      {/* 2. THE LARGEST CARD — 🌾 SELL MY CROP (As required by Section 1 & 28) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white p-5 sm:p-7 shadow-xl border-2 border-emerald-500/30 w-full box-border">
        <div className="relative z-10 flex flex-col items-start gap-2.5 sm:gap-3 w-full">
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-100 border border-emerald-400/30">
            <Sprout className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>AI Quality Check & Right Market</span>
          </div>

          <div className="space-y-1 w-full">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight break-words">
              🌾 {t.sellMyCrop}
            </h2>
            <p className="text-emerald-100 text-xs sm:text-base leading-relaxed max-w-sm">
              {t.sellMyCropSubtitle}
            </p>
          </div>

          <button
            id="hero-sell-my-crop-btn"
            onClick={onStartSell}
            className="mt-2 w-full sm:w-auto px-4 sm:px-8 py-3.5 sm:py-4 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-black text-base sm:text-xl rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] cursor-pointer box-border"
          >
            <span className="truncate">🌾 {t.sellMyCrop}</span>
            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3] shrink-0" />
          </button>
        </div>

        {/* Subtle background decoration */}
        <div className="absolute -right-6 -bottom-8 w-44 h-44 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />
      </div>

      {/* 3. New Buyer Requests (Direct Farmer action when a buyer requests) */}
      {pendingRequests.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>{t.newBuyerRequest} ({pendingRequests.length})</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">Instant notification</span>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white border-2 border-amber-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-3 w-full box-border"
              >
                <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-stone-900 text-base truncate">
                      {req.buyerShop || req.buyerName}
                    </h4>
                    <p className="text-xs text-stone-600 truncate">
                      {req.buyerType} • {req.deliveryPreference}
                    </p>
                  </div>
                  <div className="text-left xs:text-right shrink-0">
                    <span className="inline-block font-extrabold text-emerald-800 text-lg whitespace-nowrap">
                      ₹{req.offeredPrice}/kg
                    </span>
                    <p className="text-xs text-stone-500 font-semibold whitespace-nowrap">
                      Total: ₹{req.totalAmount}
                    </p>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-xl p-2.5 text-xs text-stone-700 border border-stone-200">
                  <p className="font-semibold text-stone-900">
                    Wants: {req.quantity} {req.unit} {req.cropName}
                  </p>
                  {req.message && <p className="italic text-stone-600 mt-0.5 break-words">"{req.message}"</p>}
                </div>

                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => onAcceptRequest(req.id)}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t.accept} (Secure ₹{req.totalAmount})</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${req.buyerPhone}`}
                      className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200 truncate"
                    >
                      <Phone className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                      <span>{t.call}</span>
                    </a>

                    <button
                      onClick={() => onRejectRequest(req.id)}
                      className="py-2.5 px-3 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-bold rounded-xl transition-colors border border-stone-200 cursor-pointer"
                    >
                      {t.reject}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Quick Summary Section: 🧺 My Crops & 👥 My Buyers */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* My Crops Card */}
        <button
          onClick={() => onNavigateTab('my-crops')}
          className="text-left bg-white border border-stone-200 hover:border-emerald-500 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
              <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-full shrink-0">
              {crops.length} Listed
            </span>
          </div>

          <div className="mt-2.5 sm:mt-3">
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{t.myCrops}</h4>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
              {crops[0] ? `${crops[0].crop} — ${crops[0].quantity} kg` : 'No crops active'}
            </p>
          </div>
        </button>

        {/* My Buyers Card */}
        <button
          onClick={() => onNavigateTab('buyers')}
          className="text-left bg-white border border-stone-200 hover:border-emerald-500 rounded-2xl p-3.5 sm:p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between group cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-amber-800 bg-amber-100/60 px-2 py-0.5 rounded-full shrink-0">
              {regularBuyers.length} Regular
            </span>
          </div>

          <div className="mt-2.5 sm:mt-3">
            <h4 className="font-bold text-stone-900 text-xs sm:text-sm">{t.myBuyersTitle}</h4>
            <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
              {regularBuyers[0]?.shopName || 'Add direct contacts'}
            </p>
          </div>
        </button>
      </div>

      {/* 5. 📞 Recent Activity (Simple recent requests/orders with Payment Protection) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs space-y-3 w-full box-border">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-stone-500 shrink-0" />
            <span>Recent Activity & Orders</span>
          </h3>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {activeOrders.length === 0 && (
          <p className="text-xs text-stone-500 py-3 text-center">
            No active orders right now. Tap "SELL MY CROP" above to list today's harvest!
          </p>
        )}

        {activeOrders.slice(0, 2).map((order) => (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="p-3 bg-stone-50 hover:bg-stone-100/80 rounded-xl border border-stone-200 cursor-pointer transition-colors flex flex-col xs:flex-row xs:items-center justify-between gap-2"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-stone-900 text-xs sm:text-sm">
                  {order.cropName} • {order.quantity} {order.unit}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1 shrink-0">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  {order.paymentStatus}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 truncate">
                Buyer: {order.buyerShop} • Order #{order.orderNumber}
              </p>
            </div>

            <div className="text-left xs:text-right shrink-0">
              <span className="font-extrabold text-stone-900 text-xs sm:text-sm">
                ₹{order.totalAmount}
              </span>
              <p className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold">
                {order.orderStatus}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 6. Quick Mandi Reference Note */}
      <div className="p-3.5 rounded-xl bg-stone-100/80 border border-stone-200 flex flex-col xs:flex-row xs:items-center justify-between gap-2">
        <div className="text-xs text-stone-600">
          <p className="font-semibold text-stone-900">Pune Mandi Benchmark Today</p>
          <p className="text-[11px] text-stone-500">Tomato ₹28/kg • Onion ₹22/kg • Potato ₹20/kg</p>
        </div>
        <span className="text-[10px] font-medium text-stone-500 bg-white px-2 py-1 rounded border border-stone-200 shrink-0 self-start xs:self-auto">
          Demo market data
        </span>
      </div>
    </div>
  );
};
