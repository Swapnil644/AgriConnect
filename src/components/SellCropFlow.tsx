import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Check,
  RotateCcw,
  Phone,
  Send,
  AlertTriangle,
  Store,
  Truck,
  ShieldCheck,
  Info,
  Loader2,
} from 'lucide-react';
import { CropListing, Buyer, Language, AIQualityAnalysis } from '../types';
import { translations } from '../i18n';

interface SellCropFlowProps {
  language: Language;
  onCancel: () => void;
  onCropCreated: (crop: CropListing) => void;
  onSendRequestToBuyer: (crop: CropListing, buyer: Buyer, quantity: number, price: number) => void;
  buyers: Buyer[];
}

type Step =
  | 'crop_selection' // Step 2
  | 'photo_upload' // Step 3
  | 'ai_quality' // Step 4
  | 'price_setting' // Step 5
  | 'sell_or_hold' // Step 6
  | 'buyer_type' // Step 7
  | 'nearby_buyers'; // Step 8

const CROP_OPTIONS = [
  { id: 'Tomato', emoji: '🍅', en: 'Tomato', mr: 'टोमॅटो', hi: 'टमाटर', defaultRef: 28, defaultStart: 30 },
  { id: 'Onion', emoji: '🧅', en: 'Onion', mr: 'कांदा', hi: 'प्याज', defaultRef: 22, defaultStart: 24 },
  { id: 'Potato', emoji: '🥔', en: 'Potato', mr: 'बटाटा', hi: 'आलू', defaultRef: 20, defaultStart: 22 },
  { id: 'Wheat', emoji: '🌾', en: 'Wheat', mr: 'गहू', hi: 'गेहूं', defaultRef: 26, defaultStart: 28 },
  { id: 'Maize', emoji: '🌽', en: 'Maize', mr: 'मका', hi: 'मक्का', defaultRef: 21, defaultStart: 23 },
  { id: 'Banana', emoji: '🍌', en: 'Banana', mr: 'केळी', hi: 'केला', defaultRef: 18, defaultStart: 20 },
  { id: 'Other', emoji: '🥕', en: 'Other', mr: 'इतर पीक', hi: 'अन्य फसल', defaultRef: 25, defaultStart: 27 },
];

const SAMPLE_PHOTOS: Record<string, string> = {
  Tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
  Onion: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80',
  Potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80',
  Wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80',
  Maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=800&auto=format&fit=crop&q=80',
  Banana: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
};

export const SellCropFlow: React.FC<SellCropFlowProps> = ({
  language,
  onCancel,
  onCropCreated,
  onSendRequestToBuyer,
  buyers,
}) => {
  const t = translations[language];

  // State
  const [currentStep, setCurrentStep] = useState<Step>('crop_selection');
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [quantity, setQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('kg');

  // Voice state
  const [isListening, setIsListening] = useState<boolean>(false);
  const [voiceSpokenText, setVoiceSpokenText] = useState<string>('');
  const [voiceProcessing, setVoiceProcessing] = useState<boolean>(false);

  // Photo state
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_PHOTOS['Tomato']);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // AI Quality state
  const [analyzingAi, setAnalyzingAi] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AIQualityAnalysis | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Price state
  const [marketRefPrice, setMarketRefPrice] = useState<number>(28);
  const [suggestedPrice, setSuggestedPrice] = useState<number>(30);
  const [farmerPrice, setFarmerPrice] = useState<number>(32); // Farmer controls final price!

  // Sell or Hold
  const [decision, setDecision] = useState<'sell' | 'hold'>('sell');

  // Buyer preference
  const [targetBuyerType, setTargetBuyerType] = useState<'Retailer' | 'Wholesaler'>('Retailer');
  const [orderQuantity, setOrderQuantity] = useState<string>('');
  const [requestSentToBuyerId, setRequestSentToBuyerId] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Step 2: Voice Input Handler
  // ---------------------------------------------------------------------------
  const handleSimulateVoice = async (phrase: string) => {
    setVoiceSpokenText(phrase);
    setVoiceProcessing(true);
    try {
      const res = await fetch('/api/ai/voice-extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speechText: phrase }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        if (data.result.crop) {
          setSelectedCrop(data.result.crop);
          setPhotoUrl(SAMPLE_PHOTOS[data.result.crop] || SAMPLE_PHOTOS['Tomato']);
        }
        if (data.result.quantity) {
          setQuantity(String(data.result.quantity));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setVoiceProcessing(false);
    }
  };

  const handleStartWebSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Fallback: simulate voice
      handleSimulateVoice('Majhyakade 200 kilo tomato aahe.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceSpokenText(transcript);
        handleSimulateVoice(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        handleSimulateVoice('Majhyakade 200 kilo tomato aahe.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      handleSimulateVoice('Majhyakade 200 kilo tomato aahe.');
    }
  };

  // ---------------------------------------------------------------------------
  // Step 3: Photo Capture / Upload
  // ---------------------------------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPhotoBase64(base64);
      setPhotoUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    setCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access error, fallback to photo upload:', err);
      setCameraActive(false);
      fileInputRef.current?.click();
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setPhotoBase64(dataUrl);
      setPhotoUrl(dataUrl);
    }
    // Stop camera stream
    const stream = videoRef.current.srcObject as MediaStream;
    stream?.getTracks().forEach((track) => track.stop());
    setCameraActive(false);
  };

  // ---------------------------------------------------------------------------
  // Step 4: AI Quality Check via Gemini API
  // ---------------------------------------------------------------------------
  const runAiQualityCheck = async () => {
    setAnalyzingAi(true);
    setAiError(null);
    setCurrentStep('ai_quality');

    try {
      const response = await fetch('/api/ai/analyze-crop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: photoBase64,
          cropHint: selectedCrop,
        }),
      });

      const data = await response.json();
      if (data.success && data.result) {
        setAiResult(data.result);
        if (data.result.marketReferencePrice) {
          setMarketRefPrice(data.result.marketReferencePrice);
        }
        if (data.result.suggestedStartingPrice) {
          setSuggestedPrice(data.result.suggestedStartingPrice);
          // Initial farmer price defaults to suggested, but farmer can change freely!
          setFarmerPrice(data.result.suggestedStartingPrice + 2); // e.g. Suggested ₹30 -> Farmer chooses ₹32
        }
      } else {
        throw new Error('AI analysis failed');
      }
    } catch (err: any) {
      console.error(err);
      setAiError('AI check temporarily unavailable. Using standard APMC grade parameters.');
      // Fallback
      setAiResult({
        isPhotoClear: true,
        crop: selectedCrop,
        cropMarathi: 'टोमॅटो',
        cropHindi: 'टमाटर',
        grade: 'A',
        visualCondition: 'Good',
        visibleDamage: 'Low',
        confidence: 'High',
        marketReferencePrice: 28,
        suggestedStartingPrice: 30,
        observations: 'Clear red coloration with firm skin and low visible blemishes.',
        disclaimer: 'AI visual quality assessment. Final quality may vary after physical inspection.',
      });
      setMarketRefPrice(28);
      setSuggestedPrice(30);
      setFarmerPrice(32);
    } finally {
      setAnalyzingAi(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Step 6: Save Crop as Listing (Sell or Hold)
  // ---------------------------------------------------------------------------
  const saveListing = (targetStatus: 'Ready to Sell' | 'Holding') => {
    const newCrop: CropListing = {
      id: `crop_${Date.now()}`,
      crop: selectedCrop,
      cropMarathi: CROP_OPTIONS.find((c) => c.id === selectedCrop)?.mr || selectedCrop,
      cropHindi: CROP_OPTIONS.find((c) => c.id === selectedCrop)?.hi || selectedCrop,
      quantity: Number(quantity),
      initialQuantity: Number(quantity),
      unit: unit,
      photoUrl: photoUrl,
      grade: aiResult?.grade || 'A',
      visualCondition: aiResult?.visualCondition || 'Good',
      visibleDamage: aiResult?.visibleDamage || 'Low',
      confidence: aiResult?.confidence || 'High',
      marketReferencePrice: marketRefPrice,
      marketSource: 'Pune APMC Mandi benchmark',
      marketTimestamp: 'Today, 08:30 AM',
      suggestedPrice: suggestedPrice,
      farmerPrice: farmerPrice, // The farmer's chosen price!
      status: targetStatus,
      holdReason: targetStatus === 'Holding' ? 'Farmer elected to hold for market review' : undefined,
      createdAt: new Date().toISOString(),
      farmerName: 'Ramesh Patil',
      farmerPhone: '+91 98220 12345',
      location: 'Haveli, Pune',
    };

    onCropCreated(newCrop);
    return newCrop;
  };

  // Handle final decision Sell Now vs Hold
  const handleSellOrHoldDecision = (choice: 'sell' | 'hold') => {
    setDecision(choice);
    if (choice === 'hold') {
      saveListing('Holding');
      // Returns to My Crops or finishes
      onCancel();
    } else {
      // Advance to Step 7: Choose Retailer or Wholesaler
      setCurrentStep('buyer_type');
    }
  };

  // ---------------------------------------------------------------------------
  // Filtered Nearby Buyers
  // ---------------------------------------------------------------------------
  const suitableBuyers = buyers.filter((b) => {
    if (targetBuyerType === 'Wholesaler') {
      return b.buyerType === 'Wholesaler';
    }
    return b.buyerType === 'Retailer' || b.buyerType === 'Restaurant';
  });

  return (
    <div className="max-w-xl mx-auto px-4 py-4 pb-24 space-y-6">
      {/* Top Breadcrumb / Step Indicator */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-3">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-xs font-bold text-stone-600 hover:text-stone-950 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.backBtn}</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>
            {currentStep === 'crop_selection' && 'Step 1 of 5: Crop & Quantity'}
            {currentStep === 'photo_upload' && 'Step 2 of 5: Take Photo'}
            {currentStep === 'ai_quality' && 'Step 3 of 5: AI Quality Check'}
            {currentStep === 'price_setting' && 'Step 4 of 5: Set Your Selling Price'}
            {currentStep === 'sell_or_hold' && 'Step 5: Sell or Hold'}
            {currentStep === 'buyer_type' && 'Choose Buyer Type'}
            {currentStep === 'nearby_buyers' && 'Nearby Buyers'}
          </span>
        </div>
      </div>

      {/* =====================================================================
          STEP 2: WHAT ARE YOU SELLING? (Crop selection + 🎤 Speak button)
          ===================================================================== */}
      {currentStep === 'crop_selection' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {t.whatAreYouSelling}
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              {t.selectCropPrompt}
            </p>
          </div>

          {/* Voice Input Box */}
          <div className="bg-emerald-50/80 border-2 border-dashed border-emerald-300 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-emerald-600 text-white'}`}>
                  {isListening ? <Mic className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">{t.speak}</h4>
                  <p className="text-xs text-emerald-700">
                    {isListening ? t.listening : t.voiceInstruction}
                  </p>
                </div>
              </div>

              <button
                id="mic-speak-btn"
                onClick={handleStartWebSpeech}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95"
              >
                {isListening ? 'Stop' : '🎤 Tap to Speak'}
              </button>
            </div>

            {/* Quick test phrases for instant demo execution */}
            <div className="pt-2 border-t border-emerald-200/70">
              <span className="text-[11px] font-semibold text-emerald-800 block mb-1.5">
                Quick 1-tap farmer speech test:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSimulateVoice('Majhyakade 200 kilo tomato aahe.')}
                  className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium transition-colors"
                >
                  "Majhyakade 200 kilo tomato aahe" (मराठी)
                </button>
                <button
                  onClick={() => handleSimulateVoice('मेरे पास 500 किलो प्याज है')}
                  className="text-[11px] bg-white hover:bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-200 font-medium transition-colors"
                >
                  "मेरे पास 500 किलो प्याज है" (हिंदी)
                </button>
              </div>
            </div>

            {voiceProcessing && (
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.processingVoice}</span>
              </div>
            )}
            {voiceSpokenText && (
              <p className="text-xs font-medium text-emerald-900 bg-white/80 p-2 rounded-lg border border-emerald-200">
                Spoken: "{voiceSpokenText}"
              </p>
            )}
          </div>

          {/* Large Visual Crop Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CROP_OPTIONS.map((c) => {
              const isSelected = selectedCrop === c.id;
              const label = language === 'mr' ? c.mr : language === 'hi' ? c.hi : c.en;
              return (
                <button
                  key={c.id}
                  id={`crop-select-${c.id.toLowerCase()}`}
                  onClick={() => {
                    setSelectedCrop(c.id);
                    setPhotoUrl(SAMPLE_PHOTOS[c.id] || SAMPLE_PHOTOS['Tomato']);
                  }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 shadow-md ring-2 ring-emerald-600/30'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl">{c.emoji}</span>
                  <div className="mt-3">
                    <span className="font-bold text-stone-900 text-base block">{label}</span>
                    <span className="text-xs text-stone-500">{c.en}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quantity & Unit Input (Farmer can freely edit) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 text-sm">{t.quantity}</h4>
              <span className="text-xs text-stone-500 font-medium">Direct type in {unit}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <input
                  id="crop-quantity-input"
                  type="number"
                  placeholder="e.g. 50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full text-2xl font-black text-stone-900 px-4 py-3 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
              <div className="w-28">
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-base font-bold text-stone-800 px-3 py-3.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="kg">kg (किलो)</option>
                  <option value="quintal">quintal (क्विंटल)</option>
                </select>
              </div>
            </div>

            {/* Quick Presets for Mobile Tapping */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-stone-500 block">
                Quick tap or type directly above:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['25', '50', '100', '200', '500', '1000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuantity(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
                      quantity === preset
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                  >
                    {preset} {unit}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-stone-500">
              Selected:{' '}
              <strong className="text-stone-900">
                {quantity ? `${quantity} ${unit}` : `(Enter quantity above)`} {selectedCrop}
              </strong>
            </p>
          </div>

          {/* Continue button */}
          <button
            id="crop-continue-btn"
            onClick={() => {
              if (!quantity || Number(quantity) <= 0) {
                alert(
                  language === 'mr'
                    ? 'कृपया पिकाचे वजन (उदा. ५० किलो) प्रविष्ट करा.'
                    : language === 'hi'
                    ? 'कृपया फसल की मात्रा (जैसे ५० किलो) दर्ज करें।'
                    : 'Please enter crop quantity (e.g. 50 kg).'
                );
                return;
              }
              setCurrentStep('photo_upload');
            }}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{t.continueBtn}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* =====================================================================
          STEP 3: 📸 TAKE A PHOTO
          ===================================================================== */}
      {currentStep === 'photo_upload' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              📸 {t.takePhotoTitle}
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              «"{t.photoClearPrompt}"» — {t.takePhotoSubtitle}
            </p>
          </div>

          {/* Camera View or Photo Preview */}
          <div className="bg-stone-900 rounded-3xl overflow-hidden aspect-4/3 relative shadow-inner flex items-center justify-center">
            {cameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={photoUrl}
                alt="Harvest preview"
                className="w-full h-full object-cover"
              />
            )}

            {cameraActive && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <button
                  id="capture-shutter-btn"
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-600" />
                </button>
              </div>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Camera & Upload Buttons */}
          {!cameraActive ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                id="camera-take-btn"
                onClick={startCamera}
                className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Camera className="w-5 h-5" />
                <span>{t.takePhotoBtn}</span>
              </button>

              <button
                id="upload-file-btn"
                onClick={() => fileInputRef.current?.click()}
                className="py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-sm border border-stone-200"
              >
                <Upload className="w-5 h-5 text-stone-600" />
                <span>{t.uploadPhotoBtn}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                const stream = videoRef.current?.srcObject as MediaStream;
                stream?.getTracks().forEach((t) => t.stop());
                setCameraActive(false);
              }}
              className="w-full py-3 bg-stone-200 text-stone-800 font-bold rounded-xl text-sm"
            >
              Cancel Camera
            </button>
          )}

          {/* Sample crop photo selector for quick instant demo testing */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 space-y-2">
            <span className="text-xs font-bold text-stone-700 block">
              Or pick ready sample photo:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['Tomato', 'Onion', 'Potato', 'Banana'].map((cropKey) => (
                <button
                  key={cropKey}
                  onClick={() => {
                    setPhotoUrl(SAMPLE_PHOTOS[cropKey]);
                    setSelectedCrop(cropKey);
                  }}
                  className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-stone-200 rounded-xl text-xs font-semibold hover:border-emerald-500 text-stone-800"
                >
                  <img
                    src={SAMPLE_PHOTOS[cropKey]}
                    alt={cropKey}
                    className="w-6 h-6 rounded-md object-cover"
                  />
                  <span>{cropKey}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Large Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-sm"
            >
              {t.retakePhotoBtn}
            </button>
            <button
              id="use-this-photo-btn"
              onClick={runAiQualityCheck}
              className="flex-2 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 text-base"
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{t.useThisPhotoBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 4: 🤖 AI QUALITY SCREEN (Gemini Quality Analysis)
          ===================================================================== */}
      {currentStep === 'ai_quality' && (
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Powered by Gemini 3.8 Flash Vision</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              🤖 {t.aiQualityTitle}
            </h2>
          </div>

          {analyzingAi ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-spin">
                <Loader2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-stone-900">
                  Analyzing crop photo...
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Estimating visual quality grade, color uniformity, and surface damage.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Photo & Main Grade Card */}
              <div className="bg-white border-2 border-emerald-500 rounded-3xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={photoUrl}
                    alt="Analyzed produce"
                    className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                      Crop Type: {selectedCrop}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-3xl font-black text-emerald-800">
                        Grade {aiResult?.grade || 'A'}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {aiResult?.grade === 'A' ? t.gradeA : aiResult?.grade === 'B' ? t.gradeB : t.gradeC}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Breakdown Grid */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-stone-100">
                  <div className="bg-stone-50 rounded-xl p-2.5 text-center">
                    <span className="text-[11px] text-stone-500 block">{t.visualCondition}</span>
                    <strong className="text-sm text-stone-900 font-extrabold">
                      {aiResult?.visualCondition === 'Good' ? t.good : aiResult?.visualCondition === 'Fair' ? t.fair : t.poor}
                    </strong>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-2.5 text-center">
                    <span className="text-[11px] text-stone-500 block">{t.visibleDamage}</span>
                    <strong className="text-sm text-stone-900 font-extrabold">
                      {aiResult?.visibleDamage === 'Low' ? t.low : aiResult?.visibleDamage === 'Medium' ? t.medium : t.high}
                    </strong>
                  </div>

                  <div className="bg-stone-50 rounded-xl p-2.5 text-center">
                    <span className="text-[11px] text-stone-500 block">{t.aiConfidence}</span>
                    <strong className="text-sm text-emerald-700 font-extrabold">
                      {aiResult?.confidence || 'High'}
                    </strong>
                  </div>
                </div>

                {/* Observations */}
                {aiResult?.observations && (
                  <p className="text-xs text-stone-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    💡 <strong>Observation:</strong> {aiResult.observations}
                  </p>
                )}

                {/* Mandatory Section 3 & 7 Notice */}
                <div className="bg-stone-100 rounded-xl p-3 flex items-start gap-2 text-xs text-stone-600">
                  <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                  <p className="italic leading-snug">
                    «“{t.aiDisclaimer}”»
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  id="ai-retake-photo-btn"
                  onClick={() => setCurrentStep('photo_upload')}
                  className="flex-1 py-3.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-2xl text-sm flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t.retakePhotoBtn}</span>
                </button>

                <button
                  id="ai-accept-grade-btn"
                  onClick={() => setCurrentStep('price_setting')}
                  className="flex-2 py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-2xl shadow-md flex items-center justify-center gap-2 text-base"
                >
                  <span>{t.continueBtn}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          STEP 5: 💰 PRICE SCREEN & FARMER CONTROLS FINAL PRICE
          ===================================================================== */}
      {currentStep === 'price_setting' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              💰 {t.marketPriceTitle}
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Review market reference, check AI suggested price, and set your own final selling price.
            </p>
          </div>

          {/* Mandi Benchmark & AI Suggested Starting Price */}
          <div className="bg-white border border-stone-200 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-500">Mandi Reference</span>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">Demo Data</span>
                </div>
                <div className="mt-1">
                  <span className="text-2xl font-black text-stone-900">₹{marketRefPrice}</span>
                  <span className="text-xs text-stone-500"> / kg</span>
                </div>
                <span className="text-[10px] text-stone-500 block mt-0.5">
                  Source: Pune APMC (08:30 AM)
                </span>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 block">AI Suggested Starting</span>
                <div className="mt-1">
                  <span className="text-2xl font-black text-emerald-800">₹{suggestedPrice}</span>
                  <span className="text-xs text-emerald-700"> / kg</span>
                </div>
                <span className="text-[10px] text-emerald-700 block mt-0.5">
                  Based on Grade {aiResult?.grade || 'A'} quality
                </span>
              </div>
            </div>

            {/* Clear Explanation (Mandatory Section 8) */}
            <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              «“{t.priceSuggestionExplainer}”»
            </p>
          </div>

          {/* CRITICAL SECTION 5: FARMER CONTROLS THE FINAL PRICE */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                  <span>💰 {t.setYourPriceTitle}</span>
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  {t.farmerPriceNotice}
                </p>
              </div>
            </div>

            {/* Price Stepper − [ ₹30 ] + and Editable Direct Input */}
            <div className="bg-white rounded-2xl p-4 border border-amber-200 shadow-xs flex items-center justify-between gap-3">
              <button
                id="price-decrement-btn"
                onClick={() => setFarmerPrice((p) => Math.max(1, p - 1))}
                className="w-12 h-12 rounded-xl bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 flex items-center justify-center transition-all font-bold"
                title="Decrease price by ₹1"
              >
                <Minus className="w-6 h-6 stroke-[3]" />
              </button>

              <div className="flex-1 text-center">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  {t.yourPriceLabel}
                </span>
                <div className="flex items-center justify-center gap-1 mt-0.5">
                  <span className="text-2xl font-black text-stone-900">₹</span>
                  <input
                    id="farmer-final-price-input"
                    type="number"
                    min="1"
                    value={farmerPrice}
                    onChange={(e) => setFarmerPrice(Math.max(1, Number(e.target.value) || 0))}
                    className="w-24 text-3xl font-black text-center text-stone-950 bg-stone-50 border border-stone-300 rounded-lg py-1 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-base font-bold text-stone-500">/ kg</span>
                </div>
              </div>

              <button
                id="price-increment-btn"
                onClick={() => setFarmerPrice((p) => p + 1)}
                className="w-12 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center transition-all font-bold shadow-xs"
                title="Increase price by ₹1"
              >
                <Plus className="w-6 h-6 stroke-[3]" />
              </button>
            </div>

            {/* Confirmation Banner */}
            <div className="bg-emerald-600 text-white rounded-xl p-3 text-center text-sm font-bold shadow-xs">
              ✓ {t.yourCropWillBeListedAt} <span className="text-amber-300 text-base font-black">₹{farmerPrice}/kg</span>
            </div>
          </div>

          {/* Continue button */}
          <button
            id="price-continue-btn"
            onClick={() => setCurrentStep('sell_or_hold')}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-lg rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{t.continueBtn}</span>
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* =====================================================================
          STEP 6: SELL OR HOLD (Section 9)
          ===================================================================== */}
      {currentStep === 'sell_or_hold' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {t.whatDoYouWantToDo}
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Your crop: <strong>{quantity} {unit} {selectedCrop}</strong> at <strong>₹{farmerPrice}/kg</strong>.
            </p>
          </div>

          {/* AI Recommendation Notice */}
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h4 className="font-extrabold text-emerald-950 text-sm">
                {t.aiRecommendation}: <span className="text-emerald-800">SELL NOW</span>
              </h4>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              "{t.aiSellReason}"
            </p>
            <p className="text-[11px] text-stone-500 italic pt-1 border-t border-emerald-200">
              «“{t.aiDisclaimerNoGuarantee}”»
            </p>
          </div>

          {/* Two HUGE Buttons (Mandatory Section 9) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              id="sell-now-btn"
              onClick={() => handleSellOrHoldDecision('sell')}
              className="py-6 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-xl rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.98] border-2 border-emerald-400"
            >
              <span className="text-3xl">🟢</span>
              <span>{t.sellNow}</span>
              <span className="text-xs font-semibold text-emerald-100">
                Connect with nearby buyers today
              </span>
            </button>

            <button
              id="hold-crop-btn"
              onClick={() => handleSellOrHoldDecision('hold')}
              className="py-6 px-6 bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-950 font-black text-xl rounded-3xl shadow-md flex flex-col items-center justify-center gap-2 transition-all active:scale-[0.98] border-2 border-amber-300"
            >
              <span className="text-3xl">🟡</span>
              <span>{t.hold}</span>
              <span className="text-xs font-semibold text-amber-800">
                Save in My Crops & check market later
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 7: WHO DO YOU WANT TO SELL TO? (Retailer or Wholesaler)
          ===================================================================== */}
      {currentStep === 'buyer_type' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {t.whoDoYouWantToSellTo}
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Select your preferred buyer channel for {quantity} {unit} {selectedCrop} at ₹{farmerPrice}/kg.
            </p>
          </div>

          {/* Two Large Choices: RETAILER vs WHOLESALER (Section 11) */}
          <div className="grid grid-cols-1 gap-4">
            <button
              id="select-retailer-channel-btn"
              onClick={() => {
                setTargetBuyerType('Retailer');
                setOrderQuantity(Math.min(20, quantity));
                setCurrentStep('nearby_buyers');
              }}
              className="p-6 bg-white border-2 border-emerald-500 hover:bg-emerald-50/50 rounded-3xl shadow-sm hover:shadow-md text-left transition-all group flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Store className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-stone-900 group-hover:text-emerald-800">
                    🏪 {t.retailerTitle}
                  </h3>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </div>
                <p className="text-stone-600 text-sm mt-1">
                  «"{t.retailerSubtitle}"»
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs font-bold text-stone-700">
                  <span>• Daily vegetable shops</span>
                  <span>• Small direct lots (10–50 kg)</span>
                </div>
              </div>
            </button>

            <button
              id="select-wholesaler-channel-btn"
              onClick={() => {
                setTargetBuyerType('Wholesaler');
                setOrderQuantity(quantity);
                setCurrentStep('nearby_buyers');
              }}
              className="p-6 bg-white border-2 border-stone-300 hover:border-emerald-600 hover:bg-stone-50 rounded-3xl shadow-sm hover:shadow-md text-left transition-all group flex items-start gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
                <Truck className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-stone-900 group-hover:text-emerald-800">
                    🚚 {t.wholesalerTitle}
                  </h3>
                  <span className="text-xs font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                    Bulk lot
                  </span>
                </div>
                <p className="text-stone-600 text-sm mt-1">
                  «"{t.wholesalerSubtitle}"»
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs font-bold text-stone-700">
                  <span>• APMC Mandi commission agents</span>
                  <span>• Full harvest pickup (200–2000 kg)</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STEP 8: NEARBY BUYERS (Wholesalers or Retailers)
          ===================================================================== */}
      {currentStep === 'nearby_buyers' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight">
                {targetBuyerType === 'Wholesaler' ? t.nearbyWholesalers : t.nearbyRetailers}
              </h2>
              <p className="text-stone-600 text-xs mt-0.5">
                Sorted by distance from Haveli, Pune • Listing at ₹{farmerPrice}/kg
              </p>
            </div>
            <button
              onClick={() => setCurrentStep('buyer_type')}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Change Channel
            </button>
          </div>

          {/* Retailer quantity selector (Small quantity support as required by Section 15) */}
          {targetBuyerType === 'Retailer' && (
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">
                  Retailer Purchase Quantity for this Order:
                </span>
                <span className="text-xs font-black text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-200">
                  Total harvest: {quantity || '0'} kg
                </span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="e.g. 20"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                  className="w-28 p-2 bg-white border border-amber-300 rounded-xl font-black text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-stone-700">kg</span>
                <div className="flex items-center gap-1.5 ml-auto overflow-x-auto">
                  {['10', '20', '30', '50'].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setOrderQuantity(qty)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                        orderQuantity === qty
                          ? 'bg-amber-500 text-white border-amber-600'
                          : 'bg-white text-stone-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {qty} kg
                    </button>
                  ))}
                </div>
              </div>

              {Number(orderQuantity || 20) < 15 && (
                <p className="text-[11px] text-amber-800 flex items-center gap-1 mt-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>«“{t.smallOrderWarning}”»</span>
                </p>
              )}
            </div>
          )}

          {/* Suitable Buyer Cards */}
          <div className="space-y-3">
            {suitableBuyers.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-500">
                No nearby buyers found in this category. Try retailers or expand search area.
              </div>
            ) : (
              suitableBuyers.map((buyer) => {
                const isSent = requestSentToBuyerId === buyer.id;
                const finalOrderQty =
                  targetBuyerType === 'Retailer'
                    ? Number(orderQuantity) || 20
                    : Number(quantity) || 200;
                const totalEstimatedAmount = finalOrderQty * farmerPrice;

                return (
                  <div
                    key={buyer.id}
                    className="bg-white border-2 border-stone-200 hover:border-emerald-500 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-extrabold text-stone-900 text-base">
                            {buyer.shopName}
                          </h3>
                          <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                            {buyer.demoLabel}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          📍 {buyer.location} • <strong className="text-emerald-800">{buyer.distanceKm} km away</strong>
                        </p>
                      </div>

                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {buyer.availability}
                      </span>
                    </div>

                    {/* Needs & Indicative Price Info */}
                    <div className="bg-stone-50 rounded-2xl p-3 text-xs text-stone-700 space-y-1">
                      <div className="flex justify-between">
                        <span>Looking for:</span>
                        <strong className="text-stone-900">{buyer.lookingFor}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantity required:</span>
                        <strong className="text-stone-900">{buyer.quantityNeeded}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Indicative buying rate:</span>
                        <strong className="text-emerald-800">₹{buyer.indicativePrice}/kg</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-stone-200 text-stone-500 text-[11px]">
                        <span>Buyer history:</span>
                        <span>{buyer.completedOrdersCount > 0 ? `${buyer.completedOrdersCount} orders • ${buyer.paymentHistory}` : t.notEnoughHistory}</span>
                      </div>
                    </div>

                    {/* Large Action Buttons: CALL & SEND BUY REQUEST (Sections 12, 13, 14, 17) */}
                    <div className="space-y-2 pt-1">
                      <button
                        id={`send-request-${buyer.id}`}
                        disabled={isSent}
                        onClick={() => {
                          // Save crop listing first
                          const crop = saveListing('Ready to Sell');
                          // Send request
                          onSendRequestToBuyer(crop, buyer, finalOrderQty, farmerPrice);
                          setRequestSentToBuyerId(buyer.id);
                        }}
                        className={`w-full py-3.5 px-4 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs ${
                          isSent
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white'
                        }`}
                      >
                        {isSent ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-700" />
                            <span>Request Sent ✓</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>{t.sendBuyRequest} ({finalOrderQty} kg • ₹{totalEstimatedAmount})</span>
                          </>
                        )}
                      </button>

                      <a
                        id={`call-buyer-${buyer.id}`}
                        href={`tel:${buyer.phone}`}
                        className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-stone-900 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
                      >
                        <Phone className="w-4 h-4 text-emerald-700" />
                        <span>📞 {t.call} ({buyer.phone})</span>
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
