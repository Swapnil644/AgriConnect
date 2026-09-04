import React from 'react';
import { Home, Sprout, Users, PackageCheck, Bot, FileText } from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../i18n';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAi: () => void;
  language: Language;
  role: UserRole;
  pendingRequestsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenAi,
  language,
  role,
  pendingRequestsCount = 0,
}) => {
  const t = translations[language];

  if (role === 'buyer' || role === 'retailer' || role === 'wholesaler') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-3 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-3 items-center">
          <button
            id="buyer-tab-find"
            onClick={() => onSelectTab('find-crops')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-center transition-colors min-w-0 ${
              currentTab === 'find-crops' ? 'text-emerald-700 font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
            }`}
          >
            <Sprout className="w-5 h-5 shrink-0" />
            <span className="text-[11px] truncate w-full">🛒 Find Crop</span>
          </button>

          <button
            id="buyer-tab-orders"
            onClick={() => onSelectTab('orders')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-center transition-colors relative min-w-0 ${
              currentTab === 'orders' ? 'text-emerald-700 font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
            }`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            <span className="text-[11px] truncate w-full">📋 Orders</span>
            {pendingRequestsCount > 0 && (
              <span className="absolute top-0 right-3 sm:right-6 w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping" />
            )}
          </button>

          <button
            id="buyer-ask-ai"
            onClick={onOpenAi}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-center text-emerald-800 hover:text-emerald-950 transition-colors min-w-0"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold truncate w-full">Ask AI</span>
          </button>
        </div>
      </nav>
    );
  }

  if (role === 'fpo') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-3 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-3 items-center">
          <button
            id="fpo-tab-lots"
            onClick={() => onSelectTab('fpo')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-center transition-colors min-w-0 ${
              currentTab === 'fpo' ? 'text-emerald-700 font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
            }`}
          >
            <PackageCheck className="w-5 h-5 shrink-0" />
            <span className="text-[11px] truncate w-full">🏢 Mandi Lots</span>
          </button>

          <button
            id="fpo-tab-orders"
            onClick={() => onSelectTab('orders')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-center transition-colors relative min-w-0 ${
              currentTab === 'orders' ? 'text-emerald-700 font-black' : 'text-stone-500 hover:text-stone-900 font-semibold'
            }`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            <span className="text-[11px] truncate w-full">📋 Orders</span>
          </button>

          <button
            id="fpo-ask-ai"
            onClick={onOpenAi}
            className="flex flex-col items-center justify-center gap-0.5 py-1 px-1 rounded-xl text-center text-emerald-800 hover:text-emerald-950 transition-colors min-w-0"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold truncate w-full">FPO AI</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Floating Ask AI button - compact and positioned cleanly above the bottom nav without covering content */}
      <div className="fixed bottom-18 sm:bottom-20 right-3 sm:right-6 z-30 pointer-events-auto">
        <button
          id="floating-ask-ai-btn"
          onClick={onOpenAi}
          className="flex items-center gap-1.5 sm:gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all border border-emerald-400/40 text-xs sm:text-sm cursor-pointer"
        >
          <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-200 shrink-0" />
          <span className="whitespace-nowrap">{t.askAi}</span>
        </button>
      </div>

      {/* Main 5-Item Farmer Bottom Bar - 5-column grid ensuring zero overflow & even alignment */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-1 sm:px-3 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-5 items-center w-full">
          {/* Home */}
          <button
            id="nav-home-btn"
            onClick={() => onSelectTab('home')}
            className={`flex flex-col items-center justify-center py-1 px-0.5 text-center transition-colors min-w-0 cursor-pointer ${
              currentTab === 'home' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] truncate w-full leading-tight mt-0.5">{t.home}</span>
          </button>

          {/* Sell (Prominent primary action) */}
          <button
            id="nav-sell-btn"
            onClick={() => onSelectTab('sell')}
            className={`flex flex-col items-center justify-center py-1 px-0.5 text-center transition-colors min-w-0 cursor-pointer ${
              currentTab === 'sell' ? 'text-emerald-700 font-bold' : 'text-emerald-800 hover:text-emerald-950'
            }`}
          >
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] sm:text-[11px] truncate w-full font-bold leading-tight mt-0.5">{t.sell}</span>
          </button>

          {/* Buyers */}
          <button
            id="nav-buyers-btn"
            onClick={() => onSelectTab('buyers')}
            className={`flex flex-col items-center justify-center py-1 px-0.5 text-center transition-colors min-w-0 cursor-pointer ${
              currentTab === 'buyers' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] truncate w-full leading-tight mt-0.5">{t.buyers}</span>
          </button>

          {/* My Crops */}
          <button
            id="nav-crops-btn"
            onClick={() => onSelectTab('my-crops')}
            className={`flex flex-col items-center justify-center py-1 px-0.5 text-center transition-colors min-w-0 cursor-pointer ${
              currentTab === 'my-crops' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <PackageCheck className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] truncate w-full leading-tight mt-0.5">{t.myCrops}</span>
          </button>

          {/* Orders & Receipts */}
          <button
            id="nav-orders-btn"
            onClick={() => onSelectTab('orders')}
            className={`flex flex-col items-center justify-center py-1 px-0.5 text-center transition-colors relative min-w-0 cursor-pointer ${
              currentTab === 'orders' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileText className="w-5 h-5 shrink-0" />
            <span className="text-[10px] sm:text-[11px] truncate w-full leading-tight mt-0.5">{t.orders}</span>
            {pendingRequestsCount > 0 && (
              <span className="absolute top-0 right-1 sm:right-2 w-3.5 h-3.5 bg-amber-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold">
                {pendingRequestsCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
