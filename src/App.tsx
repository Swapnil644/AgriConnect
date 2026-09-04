import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FarmerHome } from './components/FarmerHome';
import { SellCropFlow } from './components/SellCropFlow';
import { MyCropsView } from './components/MyCropsView';
import { MyBuyersView } from './components/MyBuyersView';
import { OrdersView } from './components/OrdersView';
import { BuyerHomeView } from './components/BuyerHomeView';
import { FpoView } from './components/FpoView';
import { AskAiDrawer } from './components/AskAiDrawer';
import { DigitalReceiptModal } from './components/DigitalReceiptModal';
import { Login } from './components/Login';
import { CropListing, Buyer, BuyRequest, OrderRecord, DigitalReceipt, Language, UserRole, AuthUser } from './types';
import { translations } from './i18n';

export default function App() {
  const [language, setLanguage] = useState<Language>('mr');
  const [role, setRole] = useState<UserRole>('farmer');
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [showAiDrawer, setShowAiDrawer] = useState<boolean>(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<OrderRecord | null>(null);

  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Core Application Data State (Real backend-synced state)
  const [crops, setCrops] = useState<CropListing[]>([]);
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [receipts, setReceipts] = useState<DigitalReceipt[]>([]);
  const [farmerInfo, setFarmerInfo] = useState({
    name: 'Ramesh Patil',
    phone: '+91 98220 12345',
    location: 'Haveli, Pune',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const applyUserRole = (user: AuthUser) => {
    if (user.role === 'farmer') {
      setRole('farmer');
      setCurrentTab('home');
      if (user.name) {
        setFarmerInfo((prev) => ({
          ...prev,
          name: user.name,
          phone: user.phone || prev.phone,
          location: user.location || prev.location,
        }));
      }
    } else if (user.role === 'retailer' || user.role === 'wholesaler') {
      setRole('buyer');
      setCurrentTab('find-crops');
    } else if (user.role === 'fpo') {
      setRole('fpo');
      setCurrentTab('fpo');
    }
  };

  const handleLoginSuccess = (user: AuthUser, token: string) => {
    localStorage.setItem('agriconnect_token', token);
    localStorage.setItem('agriconnect_user', JSON.stringify(user));
    setAuthUser(user);
    applyUserRole(user);
    loadData();
    showToast(`Welcome, ${user.name}!`);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('agriconnect_token');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    localStorage.removeItem('agriconnect_token');
    localStorage.removeItem('agriconnect_user');
    setAuthUser(null);
    showToast('Logged out successfully.');
  };

  // Fetch initial state from backend
  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/initial-data');
      const data = await res.json();
      if (data) {
        setCrops(data.crops || []);
        setBuyers(data.buyers || []);
        setRequests(data.requests || []);
        setOrders(data.orders || []);
        setReceipts(data.receipts || []);
        if (data.farmer) {
          setFarmerInfo(data.farmer);
        }
      }
    } catch (e) {
      console.error('Failed to load initial data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUserStr = localStorage.getItem('agriconnect_user');
        const token = localStorage.getItem('agriconnect_token');
        if (savedUserStr && token) {
          const user = JSON.parse(savedUserStr);
          setAuthUser(user);
          applyUserRole(user);
          await loadData();
          fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((data) => {
              if (!data.success) {
                localStorage.removeItem('agriconnect_token');
                localStorage.removeItem('agriconnect_user');
                setAuthUser(null);
              }
            })
            .catch(() => {});
        }
      } catch (e) {
        console.error('Session check error:', e);
      } finally {
        setAuthChecking(false);
      }
    };

    checkSession();
  }, []);

  // Reset Demo State
  const handleResetDemo = async () => {
    try {
      const res = await fetch('/api/reset-demo', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadData();
        showToast('Demo state reset successfully.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------------------------------------------------------------------
  // Action Handlers
  // ---------------------------------------------------------------------------

  // 1. New Crop created in Sell My Crop flow
  const handleCropCreated = async (newCrop: CropListing) => {
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrop),
      });
      const data = await res.json();
      if (data.success && data.crop) {
        setCrops((prev) => [data.crop, ...prev.filter((c) => c.id !== data.crop.id)]);
      } else {
        setCrops((prev) => [newCrop, ...prev]);
      }
    } catch {
      setCrops((prev) => [newCrop, ...prev]);
    }
    showToast(language === 'mr' ? 'पीक यशस्वीपणे जोडले गेले!' : 'Crop listed successfully!');
  };

  // 2. Farmer sends request to a nearby buyer
  const handleSendRequestToBuyer = async (
    crop: CropListing,
    buyer: Buyer,
    quantity: number,
    price: number
  ) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropId: crop.id,
          cropName: crop.crop,
          buyerId: buyer.id,
          buyerName: buyer.name,
          buyerShop: buyer.shopName,
          buyerType: buyer.buyerType,
          buyerPhone: buyer.phone,
          farmerName: farmerInfo.name,
          farmerPhone: farmerInfo.phone,
          quantity,
          unit: crop.unit,
          offeredPrice: price,
          deliveryPreference: buyer.buyerType === 'Wholesaler' ? 'Direct Delivery' : 'Pickup',
          message: `Farmer offer for ${quantity} ${crop.unit} ${crop.crop} at ₹${price}/${crop.unit}.`,
          senderType: 'farmer',
        }),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) => [data.request, ...prev]);
        showToast(`Request sent to ${buyer.shopName}!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 3. Buyer sends buy request to a farmer
  const handleSendBuyRequestFromBuyer = async (
    crop: CropListing,
    quantity: number,
    offeredPrice: number,
    deliveryPref: 'Pickup' | 'Direct Delivery' | 'Mandi Hub',
    message: string
  ) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropId: crop.id,
          cropName: crop.crop,
          buyerId: 'b_retail_1',
          buyerName: 'Ganesh Kadam',
          buyerShop: 'Ganesh Vegetable Store',
          buyerType: 'Retailer',
          buyerPhone: '+91 98234 56789',
          farmerName: crop.farmerName,
          farmerPhone: crop.farmerPhone,
          quantity,
          unit: crop.unit,
          offeredPrice,
          deliveryPreference: deliveryPref,
          message,
          senderType: 'buyer',
        }),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) => [data.request, ...prev]);
        showToast('Purchase request sent to farmer!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Farmer accepts buyer request -> creates real order record & updates available crop quantity
  const handleAcceptRequest = async (reqId: string) => {
    try {
      const res = await fetch(`/api/requests/${reqId}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: 'Accepted' } : r)));
        if (data.order) {
          setOrders((prev) => [data.order, ...prev]);
        }
        if (data.updatedCrop) {
          setCrops((prev) => prev.map((c) => (c.id === data.updatedCrop.id ? data.updatedCrop : c)));
        }
        showToast('Request accepted! Order created with Payment Protection.');
        setCurrentTab('orders');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Farmer rejects buyer request
  const handleRejectRequest = async (reqId: string) => {
    try {
      const res = await fetch(`/api/requests/${reqId}/respond`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: 'Rejected' } : r)));
        showToast('Request rejected.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 6. Buyer pays order -> Payment Secured
  const handlePayOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        showToast('Payment Secured ✓ AgriConnect is protecting this transaction.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 7. Farmer delivers order -> Awaiting Confirmation
  const handleDeliverOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/deliver`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        showToast('Marked as Delivered. Awaiting buyer release.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 8. Buyer confirms delivery -> Payment Released to farmer -> Digital Receipt generated
  const handleConfirmDelivery = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/confirm-delivery`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        if (data.receipt) {
          setReceipts((prev) => [data.receipt, ...prev]);
          setSelectedReceiptOrder(data.order);
        }
        showToast('Delivery confirmed! Payment released to farmer. Digital receipt generated.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 9. Raise dispute on protected payment
  const handleRaiseDispute = async (orderId: string, reason: string, description: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, description, raisedBy: role === 'farmer' ? 'farmer' : 'buyer' }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        showToast('Issue recorded. Protected payment placed on hold.');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 10. Resolve dispute
  const handleResolveDispute = async (orderId: string, outcome: 'release_farmer' | 'refund_buyer') => {
    try {
      const res = await fetch(`/api/orders/${orderId}/resolve-dispute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolutionOutcome: outcome }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        showToast(`Dispute resolved: ${outcome === 'release_farmer' ? 'Released to farmer' : 'Refunded to buyer'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 11. Add regular buyer
  const handleAddRegularBuyer = async (newBuyerData: Partial<Buyer>) => {
    try {
      const res = await fetch('/api/buyers/regular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBuyerData),
      });
      const data = await res.json();
      if (data.success && data.buyer) {
        setBuyers((prev) => [data.buyer, ...prev]);
        showToast('Buyer saved to My Buyers!');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 12. Update crop price
  const handleUpdateCropPrice = async (cropId: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/crops/${cropId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerPrice: newPrice }),
      });
      const data = await res.json();
      if (data.success && data.crop) {
        setCrops((prev) => prev.map((c) => (c.id === cropId ? data.crop : c)));
        showToast(`Price updated to ₹${newPrice}/kg!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 13. Toggle hold status
  const handleToggleHold = async (cropId: string) => {
    const target = crops.find((c) => c.id === cropId);
    if (!target) return;
    const newStatus = target.status === 'Holding' ? 'Ready to Sell' : 'Holding';
    try {
      const res = await fetch(`/api/crops/${cropId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success && data.crop) {
        setCrops((prev) => prev.map((c) => (c.id === cropId ? data.crop : c)));
        showToast(`Status updated to ${newStatus}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 14. Delete crop
  const handleDeleteCrop = async (cropId: string) => {
    try {
      await fetch(`/api/crops/${cropId}`, { method: 'DELETE' });
      setCrops((prev) => prev.filter((c) => c.id !== cropId));
      showToast('Crop listing removed.');
    } catch (e) {
      console.error(e);
    }
  };

  // 15. FPO aggregation
  const handleAggregateBatch = async (cropName: string, lots: Array<{ farmerName: string; quantity: number }>) => {
    try {
      const res = await fetch('/api/fpo/aggregate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cropName, lots }),
      });
      const data = await res.json();
      if (data.success && data.aggregatedCrop) {
        setCrops((prev) => [data.aggregatedCrop, ...prev]);
        showToast(`Created aggregated ${cropName} lot for bulk buyers!`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 16. AI Proposed Action confirmation
  const handleConfirmAiAction = (action: any) => {
    if (action.actionType === 'SEND_BUY_REQUEST') {
      const targetCrop = crops.find((c) => c.crop.toLowerCase() === (action.crop || '').toLowerCase()) || crops[0];
      const targetBuyer = buyers.find((b) => b.id === action.buyerId) || buyers[0];
      if (targetCrop && targetBuyer) {
        handleSendRequestToBuyer(targetCrop, targetBuyer, action.quantity || 20, action.price || targetCrop.farmerPrice);
        setShowAiDrawer(false);
      }
    }
  };

  const pendingRequestsCount = requests.filter((r) => r.status === 'Pending').length;

  if (authChecking) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone-600 font-bold tracking-tight">Loading AgriConnect...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center p-3 sm:p-6 w-full overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
        {notification && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-xl border border-stone-700">
            {notification}
          </div>
        )}
        <Login
          language={language}
          onLanguageChange={setLanguage}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] w-full overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-xl border border-stone-700 animate-in fade-in slide-in-from-top duration-200">
          {notification}
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        role={role}
        onRoleChange={(r) => {
          setRole(r);
          setCurrentTab(r === 'buyer' || r === 'retailer' || r === 'wholesaler' ? 'find-crops' : r === 'fpo' ? 'fpo' : 'home');
        }}
        onResetDemo={handleResetDemo}
        farmerName={farmerInfo.name}
        location={farmerInfo.location}
        currentUser={authUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto min-w-0 overflow-x-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-stone-500 font-semibold">
            Loading AgriConnect data...
          </div>
        ) : (
          <>
            {/* FARMER VIEW */}
            {role === 'farmer' && (
              <>
                {currentTab === 'home' && (
                  <FarmerHome
                    language={language}
                    farmerName={farmerInfo.name}
                    location={farmerInfo.location}
                    crops={crops}
                    buyers={buyers}
                    requests={requests}
                    orders={orders}
                    onStartSell={() => setCurrentTab('sell')}
                    onNavigateTab={setCurrentTab}
                    onAcceptRequest={handleAcceptRequest}
                    onRejectRequest={handleRejectRequest}
                    onSelectOrder={(order) => {
                      setCurrentTab('orders');
                    }}
                    onOpenAi={() => setShowAiDrawer(true)}
                  />
                )}

                {currentTab === 'sell' && (
                  <SellCropFlow
                    language={language}
                    onCancel={() => setCurrentTab('home')}
                    onCropCreated={(newCrop) => {
                      handleCropCreated(newCrop);
                    }}
                    onSendRequestToBuyer={(crop, buyer, qty, price) => {
                      handleSendRequestToBuyer(crop, buyer, qty, price);
                      setCurrentTab('orders');
                    }}
                    buyers={buyers}
                  />
                )}

                {currentTab === 'my-crops' && (
                  <MyCropsView
                    crops={crops}
                    language={language}
                    onStartSellNew={() => setCurrentTab('sell')}
                    onDeleteCrop={handleDeleteCrop}
                    onUpdateCropPrice={handleUpdateCropPrice}
                    onToggleHoldStatus={handleToggleHold}
                  />
                )}

                {currentTab === 'buyers' && (
                  <MyBuyersView
                    buyers={buyers}
                    language={language}
                    onAddBuyer={handleAddRegularBuyer}
                  />
                )}

                {currentTab === 'orders' && (
                  <OrdersView
                    orders={orders}
                    role={role}
                    language={language}
                    onPayOrder={handlePayOrder}
                    onDeliverOrder={handleDeliverOrder}
                    onConfirmDelivery={handleConfirmDelivery}
                    onRaiseDispute={handleRaiseDispute}
                    onResolveDispute={handleResolveDispute}
                    onViewReceipt={(ord) => setSelectedReceiptOrder(ord)}
                  />
                )}
              </>
            )}

            {/* BUYER / RETAILER / WHOLESALER VIEW */}
            {(role === 'buyer' || role === 'retailer' || role === 'wholesaler') && (
              <>
                {currentTab === 'find-crops' && (
                  <BuyerHomeView
                    crops={crops}
                    language={language}
                    onSendBuyRequestFromBuyer={handleSendBuyRequestFromBuyer}
                    onNavigateTab={setCurrentTab}
                  />
                )}

                {currentTab === 'orders' && (
                  <OrdersView
                    orders={orders}
                    role={role}
                    language={language}
                    onPayOrder={handlePayOrder}
                    onDeliverOrder={handleDeliverOrder}
                    onConfirmDelivery={handleConfirmDelivery}
                    onRaiseDispute={handleRaiseDispute}
                    onResolveDispute={handleResolveDispute}
                    onViewReceipt={(ord) => setSelectedReceiptOrder(ord)}
                  />
                )}
              </>
            )}

            {/* FPO AGGREGATOR VIEW */}
            {role === 'fpo' && (
              <FpoView
                language={language}
                onAggregateBatch={handleAggregateBatch}
                buyers={buyers}
              />
            )}
          </>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAi={() => setShowAiDrawer(true)}
        language={language}
        role={role}
        pendingRequestsCount={pendingRequestsCount}
      />

      {/* Ask AgriConnect AI Assistant Drawer */}
      <AskAiDrawer
        isOpen={showAiDrawer}
        onClose={() => setShowAiDrawer(false)}
        language={language}
        onConfirmProposedAction={handleConfirmAiAction}
        farmerContext={{
          farmerName: farmerInfo.name,
          cropsCount: crops.length,
          activeCrop: crops[0]?.crop || 'Tomato',
          activeCropPrice: crops[0]?.farmerPrice || 32,
          regularBuyers: buyers.filter((b) => b.isRegular).map((b) => b.shopName),
        }}
      />

      {/* Digital Receipt Modal (Section 50) */}
      {selectedReceiptOrder && (
        <DigitalReceiptModal
          order={selectedReceiptOrder}
          language={language}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}
    </div>
  );
}
