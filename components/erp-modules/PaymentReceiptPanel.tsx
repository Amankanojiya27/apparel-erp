'use client';

import type { PaymentReceipt } from '@/lib/style-types';
import { DollarSign, Calendar, CheckCircle2, CreditCard } from 'lucide-react';

export function PaymentReceiptPanel({ paymentReceipt }: { paymentReceipt?: PaymentReceipt }) {
  if (!paymentReceipt) {
    return (
      <div className="text-center py-8 text-slate-500">
        <DollarSign className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No payment receipt available</p>
      </div>
    );
  }

  const modeIcons = {
    neft: CreditCard,
    rtgs: CreditCard,
    cheque: CreditCard,
    cash: DollarSign,
    other: CreditCard,
  };

  const ModeIcon = modeIcons[paymentReceipt.mode];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">Receipt No.</span>
          </div>
          <p className="text-lg font-semibold">{paymentReceipt.receiptNo}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">Receipt Date</span>
          </div>
          <p className="text-lg font-semibold">{new Date(paymentReceipt.date).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ModeIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">Payment Mode</span>
          </div>
          <p className="text-lg font-semibold uppercase">{paymentReceipt.mode}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Payment Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span className="font-medium">{paymentReceipt.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Invoice Reference</span>
              <span className="font-medium">{paymentReceipt.invoiceRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Mode</span>
              <span className="font-medium uppercase">{paymentReceipt.mode}</span>
            </div>
            {paymentReceipt.bankRef && (
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Reference</span>
                <span className="font-medium">{paymentReceipt.bankRef}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Amount Received</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Received</span>
              <span className="font-bold text-2xl text-emerald-700">₹{paymentReceipt.amountReceived.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-emerald-300 pt-2">
              <span className="text-slate-600">Invoice Status</span>
              <span className={`font-semibold ${paymentReceipt.invoiceStatus === 'paid' ? 'text-emerald-700' : 'text-amber-700'}`}>
                {paymentReceipt.invoiceStatus.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {paymentReceipt.invoiceStatus === 'paid' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm text-emerald-900 font-medium">
              Payment received successfully. Invoice has been marked as paid.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
