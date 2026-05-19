'use client';

import type { Invoice } from '@/lib/style-types';
import { FileText, Calendar, DollarSign, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

export function InvoicePanel({ invoice }: { invoice?: Invoice }) {
  if (!invoice) {
    return (
      <div className="text-center py-8 text-slate-500">
        <FileText className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No invoice available</p>
      </div>
    );
  }

  const statusColors = {
    sent: 'bg-blue-100 text-blue-800',
    paid: 'bg-emerald-100 text-emerald-800',
    overdue: 'bg-red-100 text-red-800',
    cancelled: 'bg-slate-100 text-slate-800',
  };

  const statusIcons = {
    sent: Clock,
    paid: CheckCircle2,
    overdue: AlertTriangle,
    cancelled: Clock,
  };

  const StatusIcon = statusIcons[invoice.status];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-slate-500">Invoice No.</span>
          </div>
          <p className="text-lg font-semibold">{invoice.invoiceNo}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-emerald-600" />
            <span className="text-sm text-slate-500">Invoice Date</span>
          </div>
          <p className="text-lg font-semibold">{new Date(invoice.date).toLocaleDateString('en-IN')}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <StatusIcon className="h-4 w-4 text-purple-600" />
            <span className="text-sm text-slate-500">Status</span>
          </div>
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${statusColors[invoice.status]}`}>
            <StatusIcon className="h-3 w-3" />
            {invoice.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Invoice Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Customer</span>
              <span className="font-medium">{invoice.customer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">DC Reference</span>
              <span className="font-medium">{invoice.dcRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SO Reference</span>
              <span className="font-medium">{invoice.soRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Due Date</span>
              <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Amount Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Sub Total</span>
              <span className="font-medium">₹{invoice.amountDetails.subTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GST Amount</span>
              <span className="font-medium">₹{invoice.amountDetails.gstAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2">
              <span className="font-semibold">Grand Total</span>
              <span className="font-bold text-lg text-emerald-700">₹{invoice.amountDetails.grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {invoice.status === 'paid' && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <p className="text-sm text-emerald-900 font-medium">Invoice has been paid successfully</p>
          </div>
        </div>
      )}

      {invoice.status === 'overdue' && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <p className="text-sm text-red-900 font-medium">Invoice is overdue. Payment pending.</p>
          </div>
        </div>
      )}
    </div>
  );
}
