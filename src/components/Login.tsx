import React, { useState } from 'react';
import {
  Sprout,
  Eye,
  EyeOff,
  Lock,
  Phone,
  User,
  MapPin,
  Building,
  Store,
  Factory,
  Users,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { AuthUser, Language } from '../types';

interface LoginProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLoginSuccess: (user: AuthUser) => void;
}

type Mode = 'login' | 'register' | 'forgot';

export const Login: React.FC<LoginProps> = ({
  language,
  onLanguageChange,
  onLoginSuccess,
}) => {
  const [mode, setMode] = useState<Mode>('login');

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'farmer' | 'retailer' | 'wholesaler' | 'fpo'>('farmer');
  const [regLocation, setRegLocation] = useState('Pune, Maharashtra');
  const [regShopName, setRegShopName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Password State
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');
  const [forgotIdent, setForgotIdent] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [demoReceivedOtp, setDemoReceivedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Language dictionary for Login
  const t = {
    en: {
      tagline: 'Direct Farm-to-Buyer Marketplace & Fair Pricing',
      loginTitle: 'Sign In to AgriConnect',
      loginSubtitle: 'Choose your role or enter credentials',
      userIdOrPhone: 'User ID or 10-digit Mobile',
      password: 'Password',
      signInBtn: 'Sign In to Dashboard',
      forgotPassword: 'Forgot Password?',
      newToAgri: 'New to AgriConnect?',
      registerNow: 'Create an Account',
      alreadyHaveAccount: 'Already have an account?',
      quickDemoFill: 'Quick Demo Access (1-Tap):',
      roles: {
        farmer: 'Farmer',
        retailer: 'Retailer',
        wholesaler: 'Wholesaler',
        fpo: 'FPO Co-op',
      },
      registerTitle: 'Create AgriConnect Account',
      fullName: 'Full Name',
      mobileNumber: '10-digit Mobile Number',
      roleSelection: 'Select Your Role',
      location: 'Village / City, District',
      businessName: 'Shop / Company / FPO Name',
      createPassword: 'Create Password',
      confirmPassword: 'Confirm Password',
      createAccountBtn: 'Register & Open Dashboard',
      forgotTitle: 'Reset Your Password',
      sendOtpBtn: 'Send Verification OTP',
      verifyOtpBtn: 'Update Password & Sign In',
      backToLogin: 'Back to Sign In',
    },
    hi: {
      tagline: 'सीधा किसान-व्यापारी बाज़ार और उचित मूल्य',
      loginTitle: 'एग्रीकनेक्ट में लॉगिन करें',
      loginSubtitle: 'अपनी भूमिका चुनें या क्रेडेंशियल दर्ज करें',
      userIdOrPhone: 'यूज़र आईडी या 10 अंकों का मोबाइल',
      password: 'पासवर्ड',
      signInBtn: 'डैशबोर्ड में प्रवेश करें',
      forgotPassword: 'पासवर्ड भूल गए?',
      newToAgri: 'एग्रीकनेक्ट पर नए हैं?',
      registerNow: 'खाता बनाएं',
      alreadyHaveAccount: 'पहले से खाता है?',
      quickDemoFill: 'त्वरित डेमो लॉगिन (1-टैप):',
      roles: {
        farmer: 'किसान',
        retailer: 'रिटेलर',
        wholesaler: 'थोक व्यापारी',
        fpo: 'FPO संगठन',
      },
      registerTitle: 'एग्रीकनेक्ट खाता बनाएं',
      fullName: 'पूरा नाम',
      mobileNumber: '10 अंकों का मोबाइल नंबर',
      roleSelection: 'अपनी भूमिका चुनें',
      location: 'गांव / शहर, जिला',
      businessName: 'दुकान / कंपनी / संस्था का नाम',
      createPassword: 'पासवर्ड बनाएं',
      confirmPassword: 'पासवर्ड पुष्टि करें',
      createAccountBtn: 'रजिस्टर करें और शुरू करें',
      forgotTitle: 'पासवर्ड रीसेट करें',
      sendOtpBtn: 'सत्यापन OTP भेजें',
      verifyOtpBtn: 'नया पासवर्ड सहेजें',
      backToLogin: 'लॉगिन पर वापस जाएं',
    },
    mr: {
      tagline: 'थेट शेतकरी-ग्राहक बाजारपेठ आणि हमी भाव',
      loginTitle: 'एग्रीकनेक्ट मध्ये लॉगिन करा',
      loginSubtitle: 'तुमची भूमिका निवडा किंवा तपशील भरा',
      userIdOrPhone: 'युझर आयडी किंवा 10 अंकी मोबाईल',
      password: 'पासवर्ड',
      signInBtn: 'डॅशबोर्डमध्ये प्रवेश करा',
      forgotPassword: 'पासवर्ड विसरलात?',
      newToAgri: 'एग्रीकनेक्टवर नवीन आहात?',
      registerNow: 'नवीन खाते तयार करा',
      alreadyHaveAccount: 'आधीच खाते आहे?',
      quickDemoFill: 'डेमोसाठी जलद प्रवेश (1-टॅप):',
      roles: {
        farmer: 'शेतकरी',
        retailer: 'किरकोळ विक्रेता',
        wholesaler: 'घाऊक व्यापारी',
        fpo: 'शेतकरी गट (FPO)',
      },
      registerTitle: 'नवीन खाते तयार करा',
      fullName: 'पूर्ण नाव',
      mobileNumber: '10 अंकी मोबाईल नंबर',
      roleSelection: 'तुमची भूमिका निवडा',
      location: 'गाव / शहर, जिल्हा',
      businessName: 'दुकान / कंपनी / FPO चे नाव',
      createPassword: 'पासवर्ड तयार करा',
      confirmPassword: 'पासवर्ड पुन्हा टाका',
      createAccountBtn: 'नोंदणी करा व सुरू करा',
      forgotTitle: 'पासवर्ड रीसेट करा',
      sendOtpBtn: 'पडताळणी OTP पाठवा',
      verifyOtpBtn: 'नवीन पासवर्ड जतन करा',
      backToLogin: 'लॉगिनकडे परत या',
    },
  }[language];

  const quickDemoAccounts = [
    {
      role: 'farmer' as const,
      label: '🌾 ' + t.roles.farmer,
      name: 'Ramesh Patil',
      ident: '9876543210',
      pass: 'password123',
      sub: 'Haveli, Pune',
    },
    {
      role: 'retailer' as const,
      label: '🏪 ' + t.roles.retailer,
      name: 'Ganesh Kadam',
      ident: '9822012345',
      pass: 'password123',
      sub: 'Kothrud, Pune',
    },
    {
      role: 'wholesaler' as const,
      label: '🏭 ' + t.roles.wholesaler,
      name: 'Suresh Mehta',
      ident: '9823098765',
      pass: 'password123',
      sub: 'Market Yard, Pune',
    },
    {
      role: 'fpo' as const,
      label: '🤝 ' + t.roles.fpo,
      name: 'Anand Shinde',
      ident: '9822456789',
      pass: 'password123',
      sub: 'Dindori, Nashik',
    },
  ];

  const handleQuickFill = (acc: typeof quickDemoAccounts[0]) => {
    setIdentifier(acc.ident);
    setPassword(acc.pass);
    setErrorMsg(null);
    setSuccessMsg(`Selected ${acc.label} (${acc.name}). Ready to sign in!`);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setErrorMsg('Please enter both User ID/Mobile Number and Password.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password: password.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Invalid credentials. Please verify and try again.');
        setLoading(false);
        return;
      }

      // Save token & user in localStorage
      if (data.user?.token) {
        localStorage.setItem('agriconnect_token', data.user.token);
        localStorage.setItem('agriconnect_user', JSON.stringify(data.user));
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg('Network error connecting to AgriConnect. Please check connection and try again.');
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const cleanPhone = regPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: regName.trim(),
          phone: cleanPhone,
          role: regRole,
          location: regLocation.trim(),
          shopName: regShopName.trim() || undefined,
          password: regPassword.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      if (data.user?.token) {
        localStorage.setItem('agriconnect_token', data.user.token);
        localStorage.setItem('agriconnect_user', JSON.stringify(data.user));
      }

      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMsg('Network error registering account. Please try again.');
      setLoading(false);
    }
  };

  // Handle Forgot Password - Request OTP
  const handleForgotRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdent.trim()) {
      setErrorMsg('Please enter your mobile number or User ID.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: forgotIdent.trim() }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'User not found. Please verify your mobile number.');
        setLoading(false);
        return;
      }

      setForgotPhone(data.phone);
      setDemoReceivedOtp(data.demoOtp || '123456');
      setForgotOtp(data.demoOtp || '123456'); // Pre-fill for instant test convenience
      setForgotStep('reset');
      setSuccessMsg(data.message || 'OTP sent successfully!');
      setLoading(false);
    } catch (err: any) {
      setErrorMsg('Network error. Please try again.');
      setLoading(false);
    }
  };

  // Handle Forgot Password - Reset
  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotOtp.trim() || !newPassword.trim()) {
      setErrorMsg('Please enter the OTP code and your new password.');
      return;
    }

    if (newPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: forgotPhone,
          otp: forgotOtp.trim(),
          newPassword: newPassword.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.error || 'Password reset failed. Invalid or expired OTP.');
        setLoading(false);
        return;
      }

      // Success! Auto-fill into login form
      setIdentifier(forgotPhone);
      setPassword(newPassword);
      setMode('login');
      setForgotStep('request');
      setSuccessMsg('Password updated successfully! You may now sign in.');
      setLoading(false);
    } catch (err: any) {
      setErrorMsg('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between overflow-x-hidden">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-stone-200 px-4 py-3 shadow-xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-stone-900 tracking-tight leading-none">
                AgriConnect
              </h1>
              <p className="text-[10px] text-emerald-800 font-semibold tracking-wide">
                कृषी-जोडणी • Farmer to Buyer
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs">
            {(['mr', 'hi', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`px-2 py-1 rounded-md font-bold transition-all text-[11px] ${
                  language === lang
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'EN'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-3xl p-5 sm:p-7 shadow-md space-y-5">
          {/* Header Description */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secure Authentication & Fair Trade</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {mode === 'login'
                ? t.loginTitle
                : mode === 'register'
                ? t.registerTitle
                : t.forgotTitle}
            </h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              {mode === 'login'
                ? t.tagline
                : mode === 'register'
                ? 'Register your profile to sell or purchase crops directly.'
                : 'Enter your registered mobile number to receive verification code.'}
            </p>
          </div>

          {/* Error & Success Alerts */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-rose-800 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-emerald-800 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{successMsg}</span>
            </div>
          )}

          {/* ===============================================================
              MODE 1: LOGIN FORM
              =============================================================== */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* 1-Tap Demo Quick Selection */}
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t.quickDemoFill}</span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {quickDemoAccounts.map((acc) => (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => handleQuickFill(acc)}
                      className={`text-left p-2 rounded-xl border text-xs transition-all ${
                        identifier === acc.ident
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                          : 'bg-white border-stone-200 hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <div className="font-black text-xs truncate">{acc.label}</div>
                      <div className="text-[10px] text-stone-500 truncate">{acc.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* User ID / Mobile Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t.userIdOrPhone}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="login-identifier-input"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or farmer123"
                    className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.password}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setForgotIdent(identifier);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-10 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm font-semibold text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying credentials...</span>
                  </>
                ) : (
                  <>
                    <span>{t.signInBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Register Switch */}
              <div className="text-center pt-2 border-t border-stone-100">
                <span className="text-xs text-stone-500">{t.newToAgri} </span>
                <button
                  type="button"
                  id="switch-to-register-btn"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                >
                  {t.registerNow}
                </button>
              </div>
            </form>
          )}

          {/* ===============================================================
              MODE 2: REGISTER FORM
              =============================================================== */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Role Selection Tabs */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {t.roleSelection} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'farmer' as const, label: '🌾 ' + t.roles.farmer, desc: 'Sell farm harvest' },
                    { id: 'retailer' as const, label: '🏪 ' + t.roles.retailer, desc: 'Buy for shop' },
                    { id: 'wholesaler' as const, label: '🏭 ' + t.roles.wholesaler, desc: 'Bulk trading' },
                    { id: 'fpo' as const, label: '🤝 ' + t.roles.fpo, desc: 'Co-op aggregation' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRegRole(r.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all ${
                        regRole === r.id
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950 font-bold'
                          : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <div className="text-xs font-black">{r.label}</div>
                      <div className="text-[10px] text-stone-500">{r.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {t.fullName} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {t.mobileNumber} *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="10-digit mobile (e.g. 9822123456)"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">
                  {t.location}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={regLocation}
                    onChange={(e) => setRegLocation(e.target.value)}
                    placeholder="e.g. Haveli, Pune"
                    className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Shop / Business Name (if buyer / fpo) */}
              {regRole !== 'farmer' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.businessName}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Store className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={regShopName}
                      onChange={(e) => setRegShopName(e.target.value)}
                      placeholder="e.g. Shree Vegetable Traders"
                      className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.createPassword} *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Min 4 characters"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    {t.confirmPassword} *
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  id="show-reg-pass-check"
                  checked={showRegPassword}
                  onChange={(e) => setShowRegPassword(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="show-reg-pass-check" className="text-[11px] text-stone-600 cursor-pointer">
                  Show password
                </label>
              </div>

              {/* Submit Registration */}
              <button
                id="register-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>{t.createAccountBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2 border-t border-stone-100">
                <span className="text-xs text-stone-500">{t.alreadyHaveAccount} </span>
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  {t.backToLogin}
                </button>
              </div>
            </form>
          )}

          {/* ===============================================================
              MODE 3: FORGOT PASSWORD FLOW
              =============================================================== */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 'request' ? (
                <form onSubmit={handleForgotRequestOtp} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-stone-700">
                      {t.userIdOrPhone}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={forgotIdent}
                        onChange={(e) => setForgotIdent(e.target.value)}
                        placeholder="e.g. 9876543210 or farmer123"
                        className="w-full pl-10 pr-3 py-3 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending code...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>{t.sendOtpBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleForgotResetPassword} className="space-y-3.5">
                  {/* Demo OTP notice for friction-free testing */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Verification code for demo testing:</p>
                      <p className="font-mono text-sm font-black text-amber-950 mt-0.5 tracking-wider">
                        {demoReceivedOtp}
                      </p>
                    </div>
                  </div>

                  {/* OTP Code */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      6-digit Verification OTP *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-sm font-mono tracking-widest text-center font-black text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  {/* New Password */}
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 4 chars)"
                        className="w-full pl-3 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-700"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating password...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.verifyOtpBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="text-center pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setForgotStep('request');
                    setErrorMsg(null);
                    setSuccessMsg(null);
                  }}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  ← {t.backToLogin}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-stone-500 border-t border-stone-200 bg-white">
        <p className="font-semibold text-stone-700">AgriConnect • कृषी-जोडणी Direct Marketplace</p>
        <p className="text-[11px] text-stone-400 mt-0.5">
          Empowering Farmers & Verified Direct Buyers Across Maharashtra
        </p>
      </footer>
    </div>
  );
};
