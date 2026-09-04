import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  FileText,
  Truck,
  RotateCcw,
  ArrowRight,
  Info,
} from 'lucide-react';
import { OrderRecord, UserRole, Language } from '../types';
import { translations } from '../i18n';

interface OrdersViewProps {
  orders: OrderRecord[];
  role: UserRole;
  language: Language;
  onPayOrder: (orderId: string) => void;
  onDeliverOrder: (orderId: string) => void;
  onConfirmDelivery: (orderId: string) => void;
  onRaiseDispute: (orderId: string, reason: string, description: string) => void;
  onResolveDispute: (orderId: string, outcome: 'release_farmer' | 'refund_buyer') => void;
  onViewReceipt: (order: OrderRecord) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  role,
  language,
  onPayOrder,
  onDeliverOrder,
  onConfirmDelivery,
  onRaiseDispute,
  onResolveDispute,
  onViewReceipt,
}) => {
  const t = translations[language];

  const [selectedDisputeOrderId, setSelectedDisputeOrderId] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('Quality / Quantity Mismatch');
  const [disputeNotes, setDisputeNotes] = useState<string>('');

  const handleDisputeSubmit = (orderId: string) => {
    onRaiseDispute(orderId, disputeReason, disputeNotes);
    setSelectedDisputeOrderId(null);
    setDisputeNotes('');
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-4 pb-28 space-y-5 w-full box-border">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2 flex-wrap">
            <span>📋 {t.orders}</span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              {orders.length} Active & Completed
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5 truncate">
            AgriConnect Payment Protection & Digital Receipts
          </p>
        </div>
      </div>

      {/* Payment Protection Explainer Banner (Section 49.8 & 52) */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-xs text-emerald-950">
          <p className="font-extrabold text-sm">
            {role === 'farmer' ? '🌾 Farmer Protection' : '🛒 Buyer Protection'}
          </p>
          <p className="text-emerald-800 leading-snug mt-0.5">
            {role === 'farmer'
              ? '“Buyer commits and secures payment before fulfillment. Payment released immediately upon confirmed delivery.”'
              : '“Your payment is protected until agreed delivery is fulfilled and verified.”'}
          </p>
          <span className="inline-block text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200 mt-1">
            Demo / Simulated Payment Provider
          </span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-8 text-center text-stone-500 text-xs">
          No orders yet. Accept a buyer request or send a crop listing to start!
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isSecured = order.paymentStatus === 'Payment Secured';
            const isReleased = order.paymentStatus === 'Payment Released' || order.orderStatus === 'Completed';
            const isOnHold = order.paymentStatus === 'Payment On Hold' || order.paymentStatus === 'Payment Disputed';
            const isRequired = order.paymentStatus === 'Payment Required';
            const isDelivered = order.orderStatus === 'Delivered' || order.paymentStatus === 'Awaiting Confirmation';

            return (
              <div
                key={order.id}
                className="bg-white border-2 border-stone-200 hover:border-emerald-500 rounded-3xl p-5 shadow-xs transition-all space-y-4"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-stone-900 text-base">
                        Order #{order.orderNumber}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500">
                      Seller: <strong>{order.farmerName}</strong> • Buyer: <strong>{order.buyerShop}</strong>
                    </p>
                  </div>

                  {/* Payment Protection Status Badge */}
                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${
                        isReleased
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : isSecured
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : isOnHold
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{order.paymentStatus}</span>
                    </span>
                  </div>
                </div>

                {/* Produce & Price Details */}
                <div className="bg-stone-50 rounded-2xl p-3.5 text-xs text-stone-700 space-y-1.5 border border-stone-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-900 text-sm">
                      {order.cropName} • {order.quantity} {order.unit}
                    </span>
                    <span className="font-black text-stone-900 text-base">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-[11px]">
                    <span>Rate: ₹{order.pricePerUnit}/{order.unit}</span>
                    <span>Grade: {order.grade}</span>
                    <span>Ref: {order.paymentReference}</span>
                  </div>
                </div>

                {/* Dispute details if On Hold (Section 49.4) */}
                {isOnHold && order.dispute && (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3.5 space-y-2 text-xs text-amber-950">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Payment On Hold: {order.dispute.reason}</span>
                    </div>
                    <p className="text-stone-700 italic">
                      «"{t.disputeExplain}"»
                    </p>
                    {order.dispute.description && (
                      <p className="text-[11px] text-stone-600 bg-white/70 p-2 rounded-lg">
                        Details: {order.dispute.description}
                      </p>
                    )}

                    {/* Admin Resolution Controls */}
                    <div className="pt-2 border-t border-amber-200 flex gap-2">
                      <button
                        onClick={() => onResolveDispute(order.id, 'release_farmer')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs"
                      >
                        Release to Farmer
                      </button>
                      <button
                        onClick={() => onResolveDispute(order.id, 'refund_buyer')}
                        className="flex-1 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold rounded-xl text-xs"
                      >
                        Refund Buyer
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Action Buttons Based on Lifecycle */}
                <div className="space-y-2 pt-1">
                  {/* Step A: Buyer proceeds to secure payment */}
                  {isRequired && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-emerald-950">
                        <p className="font-bold">Payment Protection Required</p>
                        <p className="text-stone-600 text-[11px]">
                          Secure ₹{order.totalAmount} before farmer dispatches produce.
                        </p>
                      </div>
                      <button
                        id={`proceed-pay-${order.id}`}
                        onClick={() => onPayOrder(order.id)}
                        className="w-full sm:w-auto py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t.proceedToPayment} (₹{order.totalAmount})</span>
                      </button>
                    </div>
                  )}

                  {/* Step B: Farmer marks delivered once payment secured */}
                  {isSecured && !isDelivered && (
                    <div className="space-y-2">
                      {role === 'farmer' ? (
                        <button
                          id={`mark-delivered-${order.id}`}
                          onClick={() => onDeliverOrder(order.id)}
                          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                          <Truck className="w-4 h-4" />
                          <span>{t.markDelivered}</span>
                        </button>
                      ) : (
                        <div className="w-full py-2.5 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold text-center">
                          ✓ Payment Secured. Awaiting Farmer Delivery.
                        </div>
                      )}

                      <a
                        href={`tel:${role === 'farmer' ? order.buyerPhone : order.farmerPhone}`}
                        className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-stone-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-stone-600" />
                        <span>📞 {t.call} ({role === 'farmer' ? order.buyerPhone : order.farmerPhone})</span>
                      </a>
                    </div>
                  )}

                  {/* Step C: Buyer confirms delivery -> releases payment to farmer */}
                  {isDelivered && !isReleased && !isOnHold && (
                    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-900">
                          Produce Delivered to Buyer Hub
                        </span>
                        <span className="text-amber-700 font-semibold text-[11px]">
                          Awaiting Buyer Release
                        </span>
                      </div>

                      <div className="space-y-2">
                        <button
                          id={`confirm-delivery-${order.id}`}
                          onClick={() => onConfirmDelivery(order.id)}
                          className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.confirmDelivery}</span>
                        </button>

                        <button
                          onClick={() => setSelectedDisputeOrderId(order.id)}
                          className="w-full py-2 px-3 bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 font-semibold rounded-xl text-xs transition-colors"
                        >
                          {t.raiseDispute}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step D: Completed order -> View Digital Receipt (Section 50) */}
                  {isReleased && (
                    <div className="space-y-2">
                      <div className="w-full py-2.5 px-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-bold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Payment Released ✓ ₹{order.totalAmount} to Farmer</span>
                      </div>

                      <button
                        id={`view-receipt-btn-${order.id}`}
                        onClick={() => onViewReceipt(order)}
                        className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs"
                      >
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>{t.viewReceipt}</span>
                      </button>
                    </div>
                  )}

                  {/* Dispute Dialog */}
                  {selectedDisputeOrderId === order.id && (
                    <div className="bg-stone-100 border border-stone-300 rounded-2xl p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-stone-900">
                          {t.raiseDispute}
                        </h4>
                        <button
                          onClick={() => setSelectedDisputeOrderId(null)}
                          className="text-stone-500 font-bold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">
                          Dispute Reason
                        </label>
                        <select
                          value={disputeReason}
                          onChange={(e) => setDisputeReason(e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                        >
                          <option value="Quantity Mismatch">Quantity Mismatch (e.g. less than agreed)</option>
                          <option value="Quality / Grade Dispute">Quality / Grade Dispute (Soft / Damaged)</option>
                          <option value="Produce Not Delivered">Produce Not Delivered</option>
                          <option value="Late Delivery Issue">Late Delivery Issue</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-stone-700 block mb-1">
                          Details & Observations
                        </label>
                        <textarea
                          rows={2}
                          placeholder="Describe the issue transparently..."
                          value={disputeNotes}
                          onChange={(e) => setDisputeNotes(e.target.value)}
                          className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                        />
                      </div>

                      <button
                        onClick={() => handleDisputeSubmit(order.id)}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs"
                      >
                        Put Payment On Hold & Submit
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
