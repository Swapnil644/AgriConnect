import React, { useState } from 'react';
import { Sprout, Phone, Send, MapPin, Search, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { CropListing, Language } from '../types';
import { translations } from '../i18n';

interface BuyerHomeViewProps {
  crops: CropListing[];
  language: Language;
  onSendBuyRequestFromBuyer: (
    crop: CropListing,
    quantity: number,
    offeredPrice: number,
    deliveryPref: 'Pickup' | 'Direct Delivery' | 'Mandi Hub',
    message: string
  ) => void;
  onNavigateTab: (tab: string) => void;
}

export const BuyerHomeView: React.FC<BuyerHomeViewProps> = ({
  crops,
  language,
  onSendBuyRequestFromBuyer,
  onNavigateTab,
}) => {
  const t = translations[language];

  const [selectedCropName, setSelectedCropName] = useState<string>('Tomato');
  const [requestedQty, setRequestedQty] = useState<string>('');
  const [requiredDate, setRequiredDate] = useState<string>('Today Evening');
  const [deliveryPref, setDeliveryPref] = useState<'Pickup' | 'Direct Delivery' | 'Mandi Hub'>('Pickup');
  const [buyerMessage, setBuyerMessage] = useState<string>('Need fresh harvest for retail store counter.');
  const [sentRequestCropId, setSentRequestCropId] = useState<string | null>(null);

  const availableCrops = crops.filter((c) => c.status === 'Ready to Sell' && c.quantity > 0);
  const filteredCrops = selectedCropName === 'All'
    ? availableCrops
    : availableCrops.filter((c) => c.crop.toLowerCase() === selectedCropName.toLowerCase());

  const numericRequestedQty = parseFloat(requestedQty) || 0;

  const handleSendRequest = (crop: CropListing) => {
    const qty = parseFloat(requestedQty);
    if (!qty || qty <= 0) {
      alert(
        language === 'mr'
          ? 'कृपया आवश्यक वजन (उदा. २० किलो) प्रविष्ट करा.'
          : 'Please enter required quantity (e.g. 20 kg).'
      );
      return;
    }
    onSendBuyRequestFromBuyer(
      crop,
      qty,
      crop.farmerPrice,
      deliveryPref,
      buyerMessage
    );
    setSentRequestCropId(crop.id);
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 pb-28 space-y-5 w-full box-border">
      {/* Buyer Header */}
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 truncate inline-block">
            Buyer Dashboard • Direct Mandi Access
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight mt-1 truncate">
            🛒 {language === 'mr' ? 'पीक शोधा आणि खरेदी करा' : 'Find Farm Harvest'}
          </h1>
        </div>
      </div>

      {/* Primary Actions: 🛒 FIND CROP & 📋 MY ORDERS */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <button
          className="p-3.5 sm:p-4 bg-emerald-600 text-white rounded-2xl text-left shadow-md flex flex-col justify-between"
        >
          <span className="text-xl sm:text-2xl">🛒</span>
          <div className="mt-2 min-w-0">
            <span className="font-extrabold text-xs sm:text-sm block truncate">Find Crops</span>
            <span className="text-[11px] sm:text-xs text-emerald-100 block truncate">Direct from local farmers</span>
          </div>
        </button>

        <button
          onClick={() => onNavigateTab('orders')}
          className="p-3.5 sm:p-4 bg-white border border-stone-200 hover:border-emerald-500 text-stone-900 rounded-2xl text-left shadow-xs transition-colors flex flex-col justify-between cursor-pointer"
        >
          <span className="text-xl sm:text-2xl">📋</span>
          <div className="mt-2 min-w-0">
            <span className="font-extrabold text-xs sm:text-sm block truncate">My Orders & Receipts</span>
            <span className="text-[11px] sm:text-xs text-stone-500 block truncate">Secured Payments</span>
          </div>
        </button>
      </div>

      {/* Filter by Crop */}
      <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-sm">Select Produce Needed:</h3>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {['All', 'Tomato', 'Onion', 'Potato', 'Wheat', 'Banana'].map((cropName) => (
            <button
              key={cropName}
              onClick={() => setSelectedCropName(cropName)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors ${
                selectedCropName === cropName
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {cropName}
            </button>
          ))}
        </div>

        {/* Quantity & Delivery preference */}
        <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-stone-700 block">
                  Quantity Needed (kg)
                </label>
                <span className="text-[11px] text-stone-500">Type directly</span>
              </div>
              <input
                type="number"
                placeholder="e.g. 20"
                value={requestedQty}
                onChange={(e) => setRequestedQty(e.target.value)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-black text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Delivery Preference
              </label>
              <select
                value={deliveryPref}
                onChange={(e) => setDeliveryPref(e.target.value as any)}
                className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl font-semibold text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Pickup">Pickup at Farm</option>
                <option value="Direct Delivery">Direct Delivery to Shop</option>
                <option value="Mandi Hub">Mandi Hub Meetup</option>
              </select>
            </div>
          </div>

          {/* Quick tap presets */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-semibold text-stone-500 shrink-0">Quick tap:</span>
            {['10', '20', '50', '100', '200', '500'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setRequestedQty(preset)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors shrink-0 ${
                  requestedQty === preset
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                }`}
              >
                {preset} kg
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Available Farmers Listings (Section 19) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-stone-900 text-base">
            Verified Farm Listings ({filteredCrops.length})
          </h3>
          <span className="text-xs text-stone-500">Live backend records</span>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-500">
            No listings currently available for this crop. Check back soon.
          </div>
        ) : (
          filteredCrops.map((crop) => {
            const isSent = sentRequestCropId === crop.id;
            const subtotal = numericRequestedQty > 0 ? numericRequestedQty * crop.farmerPrice : 0;

            return (
              <div
                key={crop.id}
                className="bg-white border-2 border-stone-200 hover:border-emerald-500 rounded-3xl p-5 shadow-xs transition-all space-y-3"
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={crop.photoUrl}
                    alt={crop.crop}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-black text-stone-900 text-base">
                        {crop.farmerName}
                      </h4>
                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Grade {crop.grade}
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{crop.location}</span>
                    </p>

                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span className="font-semibold text-stone-700">
                        Available: <strong>{crop.quantity} {crop.unit}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price and total: Grid preventing overlapping on 320px-430px */}
                <div className="bg-stone-50 rounded-2xl p-3 grid grid-cols-2 gap-2 text-xs border border-stone-200">
                  <div className="min-w-0">
                    <span className="text-stone-500 block truncate">Farmer Price:</span>
                    <p className="font-black text-emerald-800 text-base sm:text-lg truncate">
                      ₹{crop.farmerPrice} / {crop.unit}
                    </p>
                  </div>

                  <div className="text-right min-w-0">
                    <span className="text-stone-500 block truncate">
                      {numericRequestedQty > 0 ? `For ${numericRequestedQty} kg:` : 'Enter quantity:'}
                    </span>
                    <p className="font-black text-stone-900 text-base sm:text-lg truncate">
                      {numericRequestedQty > 0 ? `Total: ₹${subtotal}` : '—'}
                    </p>
                  </div>
                </div>

                {/* Actions: Large touch-friendly single column (Sections 19 & 20) */}
                <div className="space-y-2 pt-1">
                  <button
                    disabled={isSent}
                    onClick={() => handleSendRequest(crop)}
                    className={`w-full py-3.5 px-4 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                      isSent
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'
                    }`}
                  >
                    {isSent ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-700" />
                        <span>Request Sent to Farmer ✓</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          Send Buy Request {numericRequestedQty > 0 ? `(${numericRequestedQty} kg • ₹${subtotal})` : ''}
                        </span>
                      </>
                    )}
                  </button>

                  <a
                    href={`tel:${crop.farmerPhone}`}
                    className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                  >
                    <Phone className="w-4 h-4 text-emerald-700" />
                    <span>📞 Call Farmer ({crop.farmerPhone})</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
