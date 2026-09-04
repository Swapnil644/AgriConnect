import React, { useState } from 'react';
import { Users, Phone, Plus, MapPin, Store, Check, X } from 'lucide-react';
import { Buyer, Language } from '../types';
import { translations } from '../i18n';

interface MyBuyersViewProps {
  buyers: Buyer[];
  language: Language;
  onAddBuyer: (buyer: Partial<Buyer>) => void;
}

export const MyBuyersView: React.FC<MyBuyersViewProps> = ({
  buyers,
  language,
  onAddBuyer,
}) => {
  const t = translations[language];
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [name, setName] = useState<string>('');
  const [shopName, setShopName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [buyerType, setBuyerType] = useState<string>('Retailer');
  const [lookingFor, setLookingFor] = useState<string>('Tomato');
  const [quantityNeeded, setQuantityNeeded] = useState<string>('15–25 kg');

  const regularBuyers = buyers.filter((b) => b.isRegular || true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    onAddBuyer({
      name,
      shopName: shopName || name,
      phone,
      location: location || 'Nearby Pune Market',
      buyerType: buyerType as any,
      lookingFor,
      quantityNeeded,
      isRegular: true,
      indicativePrice: 32,
      availability: 'Regular customer',
    });

    // Reset & close
    setName('');
    setShopName('');
    setPhone('');
    setLocation('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>👥 {t.myBuyersTitle}</span>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {regularBuyers.length} Contacts
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Quickly call your regular buyers and repeat customers.
          </p>
        </div>

        <button
          id="add-buyer-modal-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addBuyerBtn}</span>
        </button>
      </div>

      {/* Buyer Cards List */}
      <div className="space-y-3">
        {regularBuyers.map((buyer) => (
          <div
            key={buyer.id}
            className="bg-white border-2 border-stone-200 hover:border-emerald-500 rounded-3xl p-5 shadow-xs transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-stone-900 text-base truncate">
                    {buyer.shopName || buyer.name}
                  </h3>
                  {buyer.isRegular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 shrink-0">
                      {t.regularCustomer}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-600 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span>{buyer.location} ({buyer.distanceKm} km away)</span>
                </p>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 shrink-0">
                {buyer.buyerType}
              </span>
            </div>

            {/* Buying preferences */}
            <div className="bg-stone-50 rounded-2xl p-3 text-xs text-stone-700 space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">{t.usuallyBuys}:</span>
                <strong className="text-stone-900">{buyer.lookingFor}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">{t.typicalQuantity}:</span>
                <strong className="text-stone-900">{buyer.quantityNeeded}</strong>
              </div>
              {buyer.notes && (
                <p className="text-[11px] text-stone-500 italic pt-1 border-t border-stone-200">
                  Note: {buyer.notes}
                </p>
              )}
            </div>

            {/* Real phone calling link (Section 17) */}
            <div className="flex items-center gap-2 pt-1">
              <a
                id={`call-regular-buyer-${buyer.id}`}
                href={`tel:${buyer.phone}`}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>📞 {t.callBuyer} ({buyer.phone})</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Add Buyer Modal (Section 16) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-lg font-black text-stone-900">
                {t.addBuyerBtn}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t.buyerName} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ganesh Kadam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm font-semibold p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t.shopName}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ganesh Vegetable Store"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full text-sm font-semibold p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  {t.mobileNumber} * (Real calling link)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98234 56789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm font-semibold p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {t.buyerType}
                  </label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="w-full text-sm font-semibold p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Retailer">Retailer (किरकोळ)</option>
                    <option value="Wholesaler">Wholesaler (थोक)</option>
                    <option value="Restaurant">Restaurant (हॉटेल)</option>
                    <option value="Caterer">Caterer (केटरर)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {t.location}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kothrud, Pune"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full text-sm font-semibold p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {t.usuallyBuys}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Tomato, Onion"
                    value={lookingFor}
                    onChange={(e) => setLookingFor(e.target.value)}
                    className="w-full text-sm font-semibold p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {t.typicalQuantity}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20 kg"
                    value={quantityNeeded}
                    onChange={(e) => setQuantityNeeded(e.target.value)}
                    className="w-full text-sm font-semibold p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save to My Buyers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
