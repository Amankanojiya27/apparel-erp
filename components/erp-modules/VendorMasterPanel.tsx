'use client';

import type { Vendor } from '@/lib/style-types';
import { Building2, Phone, Mail, MapPin, CreditCard, Clock } from 'lucide-react';

export function VendorMasterPanel({ vendor }: { vendor?: Vendor }) {
  if (!vendor) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Building2 className="mx-auto h-12 w-12 mb-2 opacity-50" />
        <p>No vendor information available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Vendor Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Vendor Code</span>
              <span className="font-medium">{vendor.vendorCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Vendor Name</span>
              <span className="font-medium">{vendor.vendorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category</span>
              <span className="font-medium capitalize">{vendor.category.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">GST No.</span>
              <span className="font-medium">{vendor.gstNo}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold">Contact Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{vendor.phone}</span>
            </div>
            {vendor.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-slate-600">{vendor.email}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Person</span>
              <span className="font-medium">{vendor.contactPerson}</span>
            </div>
            {vendor.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                <span className="text-slate-600">{vendor.address}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Payment Terms</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Payment Terms</span>
              <span className="font-medium">{vendor.paymentTerms}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lead Time</span>
              <span className="font-medium">{vendor.leadTime} Days</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-amber-600" />
            <h3 className="font-semibold">Delivery Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Standard Lead Time</span>
              <span className="font-medium">{vendor.leadTime} Days</span>
            </div>
            <div className="text-slate-600 text-xs mt-2">
              Vendor typically delivers within {vendor.leadTime} days from order confirmation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
