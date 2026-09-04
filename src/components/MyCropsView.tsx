import React, { useState } from 'react';
import { PackageCheck, Plus, ArrowRight, Trash2, Edit2, Check, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';
import { CropListing, Language } from '../types';
import { translations } from '../i18n';

interface MyCropsViewProps {
  crops: CropListing[];
  language: Language;
  onStartSellNew: () => void;
  onDeleteCrop: (id: string) => void;
  onUpdateCropPrice: (id: string, newPrice: number) => void;
  onToggleHoldStatus: (id: string) => void;
}

export const MyCropsView: React.FC<MyCropsViewProps> = ({
  crops,
  language,
  onStartSellNew,
  onDeleteCrop,
  onUpdateCropPrice,
  onToggleHoldStatus,
}) => {
  const t = translations[language];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState<number>(0);

  const startEdit = (crop: CropListing) => {
    setEditingId(crop.id);
    setEditPriceVal(crop.farmerPrice);
  };

  const saveEdit = (cropId: string) => {
    onUpdateCropPrice(cropId, editPriceVal);
    setEditingId(null);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <span>🧺 {t.myCrops}</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {crops.length} Listed
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage your harvest listings, set prices, or check held produce.
          </p>
        </div>

        <button
          onClick={onStartSellNew}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Crop</span>
        </button>
      </div>

      {crops.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
            <PackageCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-stone-700">No active crops right now</p>
          <button
            onClick={onStartSellNew}
            className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            🌾 {t.sellMyCrop}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {crops.map((crop) => {
            const isHolding = crop.status === 'Holding';

            return (
              <div
                key={crop.id}
                className={`bg-white rounded-3xl p-5 border-2 shadow-xs transition-all space-y-3 ${
                  isHolding ? 'border-amber-300 bg-amber-50/20' : 'border-stone-200 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <img
                    src={crop.photoUrl}
                    alt={crop.crop}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-lg font-black text-stone-900 truncate">
                        {crop.crop}
                      </h3>
                      <span
                        className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                          isHolding
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {isHolding ? '🟡 Holding' : '🟢 Ready to Sell'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-600 mt-1">
                      <span className="font-bold text-stone-900">
                        {crop.quantity} {crop.unit} available
                      </span>
                      <span>•</span>
                      <span className="font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        Grade {crop.grade}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Display & Inline Editor */}
                <div className="bg-stone-50 rounded-2xl p-3 flex items-center justify-between border border-stone-200">
                  <div>
                    <span className="text-[11px] text-stone-500 font-bold block">
                      {t.yourPriceLabel}:
                    </span>
                    {editingId === crop.id ? (
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="font-black text-stone-900 text-lg">₹</span>
                        <input
                          type="number"
                          min="1"
                          value={editPriceVal}
                          onChange={(e) => setEditPriceVal(Number(e.target.value) || 0)}
                          className="w-20 font-black text-lg text-stone-950 px-2 py-0.5 bg-white border border-emerald-500 rounded-lg focus:outline-hidden"
                        />
                        <span className="text-xs text-stone-500">/kg</span>
                        <button
                          onClick={() => saveEdit(crop.id)}
                          className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 ml-1"
                          title="Save price"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xl font-black text-emerald-800">
                          ₹{crop.farmerPrice}/{crop.unit}
                        </span>
                        <button
                          onClick={() => startEdit(crop)}
                          className="text-stone-400 hover:text-stone-700"
                          title="Edit price"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-right text-[11px] text-stone-500">
                    <span>Mandi Ref: ₹{crop.marketReferencePrice}/kg</span>
                    <span className="block text-emerald-700 font-medium">Suggested: ₹{crop.suggestedPrice}/kg</span>
                  </div>
                </div>

                {/* Section 10 & 29: Holding notice and action */}
                {isHolding ? (
                  <div className="bg-amber-50 rounded-xl p-2.5 text-xs text-amber-900 border border-amber-200 flex items-center justify-between gap-2">
                    <span className="italic">
                      Holding status active. Ready to check market again?
                    </span>
                    <button
                      onClick={() => onToggleHoldStatus(crop.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{t.checkAgain}</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={onStartSellNew}
                      className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-black rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
                    >
                      <span>Find Buyers for {crop.crop}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onToggleHoldStatus(crop.id)}
                        className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors"
                      >
                        🟡 {t.hold}
                      </button>

                      <button
                        onClick={() => onDeleteCrop(crop.id)}
                        className="py-2.5 px-3 bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-bold rounded-xl border border-stone-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
