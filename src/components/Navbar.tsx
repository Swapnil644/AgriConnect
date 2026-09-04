import React from 'react';
import { Sprout, RefreshCw, LogOut, ShieldCheck } from 'lucide-react';
import { Language, UserRole, AuthUser } from '../types';
import { translations } from '../i18n';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  onResetDemo: () => void;
  farmerName: string;
  location: string;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  role,
  onRoleChange,
  onResetDemo,
  farmerName,
  location,
  currentUser,
  onLogout,
}) => {
  const t = translations[language];

  const getRoleLabel = (r: UserRole) => {
    switch (r) {
      case 'farmer':
        return '🌾 Farmer';
      case 'retailer':
        return '🏪 Retailer';
      case 'wholesaler':
        return '🏭 Wholesaler';
      case 'fpo':
        return '🤝 FPO';
      case 'buyer':
        return '🛒 Buyer';
      default:
        return r;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Greeting */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs shrink-0">
            <Sprout className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold tracking-tight text-emerald-950 text-base sm:text-lg leading-tight">
                AgriConnect
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200 shrink-0">
                {currentUser ? getRoleLabel(currentUser.role) : getRoleLabel(role)}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 truncate">
              {currentUser ? `${currentUser.name} • ${currentUser.location || location}` : `${farmerName} • ${location}`}
            </p>
          </div>
        </div>

        {/* Controls: Language switch, Demo Reset, Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Selector */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[11px] sm:text-xs">
            <button
              id="lang-mr-btn"
              onClick={() => onLanguageChange('mr')}
              className={`px-1.5 sm:px-2 py-1 rounded-md transition-all font-bold ${
                language === 'mr'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              मराठी
            </button>
            <button
              id="lang-hi-btn"
              onClick={() => onLanguageChange('hi')}
              className={`px-1.5 sm:px-2 py-1 rounded-md transition-all font-bold ${
                language === 'hi'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              हिंदी
            </button>
            <button
              id="lang-en-btn"
              onClick={() => onLanguageChange('en')}
              className={`px-1.5 sm:px-2 py-1 rounded-md transition-all font-bold ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              EN
            </button>
          </div>

          {/* Reset Demo button */}
          <button
            id="reset-demo-btn"
            onClick={onResetDemo}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200 transition-colors cursor-pointer"
            title="Reset demo data"
          >
            <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              id="auth-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1 px-2 py-1.5 text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-stone-200 transition-colors text-xs font-bold cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-500 hover:text-rose-700" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
