import React, { useState } from 'react';
import { Building2, Users, Layers, ArrowRight, Check, Truck, Phone } from 'lucide-react';
import { CropListing, Buyer, Language } from '../types';
import { translations } from '../i18n';

interface FpoViewProps {
  language: Language;
  onAggregateBatch: (cropName: string, lots: Array<{ farmerName: string; quantity: number }>) => void;
  buyers: Buyer[];
}

export const FpoView: React.FC<FpoViewProps> = ({
  language,
  onAggregateBatch,
  buyers,
}) => {
  const t = translations[language];

  const [aggregated, setAggregated] = useState<boolean>(false);
  const [selectedCrop, setSelectedCrop] = useState<string>('Onion');

  // Example farmer lots from member farmers (Section 30)
  const [memberLots, setMemberLots] = useState([
    { farmerName: 'Ramesh Patil (Haveli)', quantity: 300, checked: true },
    { farmerName: 'Dnyaneshwar Shinde (Manchar)', quantity: 400, checked: true },
    { farmerName: 'Babanrao Kadam (Dindori)', quantity: 500, checked: true },
  ]);

  const totalAggregatedWeight = memberLots
    .filter((l) => l.checked)
    .reduce((sum, l) => sum + l.quantity, 0);

  const wholesalers = buyers.filter((b) => b.buyerType === 'Wholesaler');

  const handleAggregate = () => {
    onAggregateBatch(selectedCrop, memberLots.filter((l) => l.checked));
    setAggregated(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          🏢 FPO / Aggregator Portal
        </span>
        <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
          Sahyadri Farmer Producer Co.
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Aggregate member farmers' crops into bulk commercial lots for wholesalers.
        </p>
      </div>

      {/* Aggregation Engine (Section 30) */}
      <div className="bg-white border-2 border-emerald-500 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-stone-900 text-base">
              Farmer Produce Aggregation
            </h3>
          </div>
          <span className="text-xs font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md">
            Produce: {selectedCrop}
          </span>
        </div>

        {/* Member Farmer Lots */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-stone-700 block">
            Member Lots to Aggregate:
          </span>
          {memberLots.map((lot, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={lot.checked}
                  onChange={(e) => {
                    const next = [...memberLots];
                    next[idx].checked = e.target.checked;
                    setMemberLots(next);
                  }}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-semibold text-stone-900">{lot.farmerName}</span>
              </div>
              <span className="font-black text-stone-900">{lot.quantity} kg</span>
            </div>
          ))}
        </div>

        {/* Total Aggregated Summary */}
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-800 font-bold block">
              Total Aggregated Lot:
            </span>
            <span className="text-2xl font-black text-emerald-950">
              {totalAggregatedWeight.toLocaleString()} kg ({selectedCrop})
            </span>
          </div>

          <button
            onClick={handleAggregate}
            className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all"
          >
            {aggregated ? '✓ Lot Aggregated' : 'Aggregate & List Lot'}
          </button>
        </div>

        {aggregated && (
          <div className="p-3 bg-emerald-100/60 rounded-xl text-xs text-emerald-900 font-semibold text-center border border-emerald-300">
            ✓ Successfully created 1,200 kg aggregated {selectedCrop} lot for wholesale buyers!
          </div>
        )}
      </div>

      {/* Wholesale Buyers matching bulk lot */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-stone-900 text-base">
          Target Bulk Wholesalers ({wholesalers.length})
        </h3>

        {wholesalers.map((w) => (
          <div
            key={w.id}
            className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3 text-xs"
          >
            <div>
              <h4 className="font-bold text-stone-900 text-sm">{w.shopName}</h4>
              <p className="text-stone-500">
                Needs: {w.quantityNeeded} • Indicative ₹{w.indicativePrice}/kg
              </p>
            </div>

            <a
              href={`tel:${w.phone}`}
              className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call ({w.phone})</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
