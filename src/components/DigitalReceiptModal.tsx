import React, { useRef } from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Sprout, ArrowLeft } from 'lucide-react';
import { OrderRecord, Language } from '../types';
import { translations } from '../i18n';

interface DigitalReceiptModalProps {
  order: OrderRecord;
  language: Language;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  order,
  language,
  onClose,
}) => {
  const t = translations[language];
  const receiptRef = useRef<HTMLDivElement | null>(null);

  const receiptId = `ACR-${order.orderNumber}`;
  const transactionDate = new Date(order.completedAt || order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text receipt file for simple direct download
    const content = `================================================
AGRICONNECT DIGITAL RECEIPT
From Farm to the Right Market.
================================================
Receipt ID: ${receiptId}
Order ID: #${order.orderNumber}
Date: ${transactionDate}
Status: Transaction Completed (Payment Released)

------------------------------------------------
SELLER (FARMER / FPO)
------------------------------------------------
Name: ${order.farmerName}
Location: ${order.farmerLocation}
Phone: ${order.farmerPhone}

------------------------------------------------
BUYER
------------------------------------------------
Business: ${order.buyerShop} (${order.buyerName})
Type: ${order.buyerType}
Location: ${order.buyerLocation}
Phone: ${order.buyerPhone}

------------------------------------------------
PRODUCE DETAILS
------------------------------------------------
Crop: ${order.cropName}
Grade: ${order.grade}
Quantity: ${order.quantity} ${order.unit}
Price: ₹${order.pricePerUnit}/${order.unit}
Produce Subtotal: ₹${order.produceAmount}

------------------------------------------------
TRANSACTION SUMMARY
------------------------------------------------
Produce Amount: ₹${order.produceAmount}
Transport Cost: ₹${order.transportCost}
Platform Fee: ₹${order.platformFee}
Total Amount: ₹${order.totalAmount}
Payment Status: ${order.paymentStatus}
Payment Reference: ${order.paymentReference} (Demo Protected)

================================================
Verified by AgriConnect Payment Protection
================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AgriConnect_Receipt_${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-stone-200 my-8">
        {/* Modal Top Bar */}
        <div className="bg-stone-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              id="receipt-back-top-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'mr' ? 'मागे जा' : language === 'hi' ? 'वापस' : 'Back'}</span>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-bold text-xs sm:text-sm tracking-wide truncate">Digital Receipt</span>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 hover:bg-stone-800 rounded-xl text-stone-300 hover:text-white transition-colors"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-stone-800 rounded-xl text-stone-300 hover:text-white transition-colors"
              title="Download Receipt"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              id="receipt-close-x-btn"
              onClick={onClose}
              className="p-2 hover:bg-stone-800 rounded-xl text-stone-300 hover:text-white transition-colors ml-0.5"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Printable Receipt Card (Section 50.1 & 50.5) */}
        <div ref={receiptRef} className="p-6 sm:p-8 space-y-6 text-stone-800 bg-white">
          {/* Header */}
          <div className="text-center border-b border-stone-200 pb-4 space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-emerald-900">
              AgriConnect
            </h1>
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
              From Farm to the Right Market.
            </p>
            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-stone-600 font-medium">
              <span>Receipt: <strong className="text-stone-900">{receiptId}</strong></span>
              <span>•</span>
              <span>Order: <strong className="text-stone-900">#{order.orderNumber}</strong></span>
            </div>
            <p className="text-[11px] text-stone-400">{transactionDate}</p>
          </div>

          {/* Seller & Buyer Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border-b border-stone-200 pb-4">
            <div className="space-y-1">
              <span className="font-extrabold text-stone-400 uppercase tracking-wider text-[10px]">
                {t.seller}
              </span>
              <p className="font-bold text-stone-900 text-sm">{order.farmerName}</p>
              <p className="text-stone-600">{order.farmerLocation}</p>
              <p className="text-stone-500">{order.farmerPhone}</p>
            </div>

            <div className="space-y-1">
              <span className="font-extrabold text-stone-400 uppercase tracking-wider text-[10px]">
                {t.buyer}
              </span>
              <p className="font-bold text-stone-900 text-sm">{order.buyerShop}</p>
              <p className="text-stone-600">{order.buyerName} • {order.buyerType}</p>
              <p className="text-stone-500">{order.buyerLocation}</p>
            </div>
          </div>

          {/* Produce Table */}
          <div className="space-y-2 border-b border-stone-200 pb-4">
            <span className="font-extrabold text-stone-400 uppercase tracking-wider text-[10px] block">
              Produce Details
            </span>
            <div className="bg-stone-50 rounded-2xl p-3.5 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-stone-900 text-sm">
                  {order.cropName} (Grade {order.grade})
                </span>
                <span className="font-black text-stone-900 text-sm">
                  ₹{order.produceAmount}
                </span>
              </div>
              <div className="flex justify-between text-stone-500 text-[11px]">
                <span>Quantity: {order.quantity} {order.unit}</span>
                <span>Rate: ₹{order.pricePerUnit}/{order.unit}</span>
              </div>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="space-y-2 border-b border-stone-200 pb-4 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Produce Value:</span>
              <span>₹{order.produceAmount}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Transport Cost:</span>
              <span>₹{order.transportCost}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Platform Fee:</span>
              <span>₹{order.platformFee}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-stone-200 text-sm font-black text-stone-950">
              <span>Total Paid:</span>
              <span className="text-emerald-800 text-base">₹{order.totalAmount}</span>
            </div>
          </div>

          {/* Payment & Security Verification */}
          <div className="bg-emerald-50 rounded-2xl p-3.5 border border-emerald-200 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Payment Status: {order.paymentStatus}</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Ref: {order.paymentReference} • Secured through AgriConnect Protection Escrow
            </p>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-stone-400 text-center italic">
            This digital receipt is generated from verified transaction state in AgriConnect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="bg-stone-50 px-4 sm:px-6 py-4 border-t border-stone-200 space-y-2.5">
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="receipt-download-btn"
              onClick={handleDownload}
              className="py-3 px-3 bg-stone-200 hover:bg-stone-300 active:bg-stone-400 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </button>
            <button
              id="receipt-print-btn"
              onClick={handlePrint}
              className="py-3 px-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>

          <button
            id="receipt-back-bottom-btn"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white font-extrabold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>{language === 'mr' ? '← ऑर्डर्सकडे परत जा' : language === 'hi' ? '← ऑर्डर्स पर वापस जाएं' : '← Back to Orders'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
