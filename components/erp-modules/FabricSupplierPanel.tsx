'use client';

import type { FabricSupplier, FabricQuotation, LabDipRequest } from '@/lib/style-types';
import { Building2, Mail, Phone, Clock, CheckCircle, XCircle, AlertCircle, FlaskConical, FileText, DollarSign } from 'lucide-react';

export function FabricSupplierPanel({ 
  fabricSupplier, 
  fabricQuotation, 
  labDipRequest 
}: { 
  fabricSupplier?: FabricSupplier; 
  fabricQuotation?: FabricQuotation; 
  labDipRequest?: LabDipRequest;
}) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { color: 'text-emerald-600', bgColor: 'bg-emerald-100', icon: CheckCircle };
      case 'rejected':
        return { color: 'text-red-600', bgColor: 'bg-red-100', icon: XCircle };
      case 'testing':
        return { color: 'text-blue-600', bgColor: 'bg-blue-100', icon: FlaskConical };
      default:
        return { color: 'text-amber-600', bgColor: 'bg-amber-100', icon: AlertCircle };
    }
  };

  return (
    <div className="space-y-6">
      {fabricSupplier && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">Fabric Supplier Master</h3>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Supplier Name</p>
                <p className="font-medium text-slate-900">{fabricSupplier.supplierName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Supplier ID</p>
                <p className="font-medium text-slate-900">{fabricSupplier.supplierId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Contact Person</p>
                <p className="font-medium text-slate-900">{fabricSupplier.contactPerson}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Lead Time</p>
                <p className="font-medium text-slate-900 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {fabricSupplier.leadTimeDays} days
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="font-medium text-slate-900 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  {fabricSupplier.email}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Phone</p>
                <p className="font-medium text-slate-900 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {fabricSupplier.phone}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">GSM Range</p>
                <p className="font-medium text-slate-900">{fabricSupplier.gsmRange.min} - {fabricSupplier.gsmRange.max} GSM</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Width Range</p>
                <p className="font-medium text-slate-900">{fabricSupplier.widthRange.min}" - {fabricSupplier.widthRange.max}"</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500 mb-2">Fabric Types</p>
              <div className="flex flex-wrap gap-2">
                {fabricSupplier.fabricTypes.map((type) => (
                  <span key={type} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                    {type}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
              <div className={`flex items-center gap-2 rounded-lg p-3 ${fabricSupplier.labDipCapability ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <FlaskConical className={`h-4 w-4 ${fabricSupplier.labDipCapability ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-medium text-slate-900">Lab Dip Capability</p>
                  <p className="text-xs text-slate-600">{fabricSupplier.labDipCapability ? 'Available' : 'Not Available'}</p>
                </div>
              </div>
              <div className={`flex items-center gap-2 rounded-lg p-3 ${fabricSupplier.testingCapability ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                <FileText className={`h-4 w-4 ${fabricSupplier.testingCapability ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-medium text-slate-900">Testing Capability</p>
                  <p className="text-xs text-slate-600">{fabricSupplier.testingCapability ? 'Available' : 'Not Available'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {fabricQuotation && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">Fabric Quotation</h3>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Quotation ID</p>
                <p className="font-medium text-slate-900">{fabricQuotation.quotationId}</p>
              </div>
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusConfig(fabricQuotation.status).bgColor} ${getStatusConfig(fabricQuotation.status).color}`}>
                {(() => {
                  const StatusIcon = getStatusConfig(fabricQuotation.status).icon;
                  return <StatusIcon className="h-3 w-3" />;
                })()}
                {fabricQuotation.status}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">Style Reference</p>
                <p className="font-medium">{fabricQuotation.styleReference}</p>
              </div>
              <div>
                <p className="text-slate-500">Fabric Type</p>
                <p className="font-medium">{fabricQuotation.fabricType}</p>
              </div>
              <div>
                <p className="text-slate-500">GSM</p>
                <p className="font-medium">{fabricQuotation.gsm}</p>
              </div>
              <div>
                <p className="text-slate-500">Width</p>
                <p className="font-medium">{fabricQuotation.width}"</p>
              </div>
              <div>
                <p className="text-slate-500">Rate per Meter</p>
                <p className="font-medium text-lg text-green-700">₹{fabricQuotation.ratePerMeter.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-slate-500">Valid Until</p>
                <p className="font-medium">{new Date(fabricQuotation.validUntil).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {labDipRequest && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold">Lab Dip Request</h3>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Request ID</p>
                <p className="font-medium text-slate-900">{labDipRequest.requestId}</p>
              </div>
              <div className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${getStatusConfig(labDipRequest.status).bgColor} ${getStatusConfig(labDipRequest.status).color}`}>
                {(() => {
                  const StatusIcon = getStatusConfig(labDipRequest.status).icon;
                  return <StatusIcon className="h-3 w-3" />;
                })()}
                {labDipRequest.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <p className="text-slate-500">Style Reference</p>
                <p className="font-medium">{labDipRequest.styleReference}</p>
              </div>
              <div>
                <p className="text-slate-500">Fabric Type</p>
                <p className="font-medium">{labDipRequest.fabricType}</p>
              </div>
              <div>
                <p className="text-slate-500">Target Color</p>
                <p className="font-medium">{labDipRequest.targetColor}</p>
              </div>
              <div>
                <p className="text-slate-500">Requested Date</p>
                <p className="font-medium">{new Date(labDipRequest.requestedDate).toLocaleDateString()}</p>
              </div>
              {labDipRequest.receivedDate && (
                <div>
                  <p className="text-slate-500">Received Date</p>
                  <p className="font-medium">{new Date(labDipRequest.receivedDate).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {labDipRequest.testResults && labDipRequest.testResults.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-900 mb-3">Test Results</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs uppercase text-slate-500">
                        <th className="pb-2 pr-4">Parameter</th>
                        <th className="pb-2 pr-4">Standard</th>
                        <th className="pb-2 pr-4">Actual</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labDipRequest.testResults.map((result, index) => (
                        <tr key={index} className="border-b border-slate-100">
                          <td className="py-2 pr-4 font-medium">{result.parameter}</td>
                          <td className="py-2 pr-4 text-slate-600">{result.standard}</td>
                          <td className="py-2 pr-4 text-slate-600">{result.actual}</td>
                          <td className="py-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              result.status === 'pass' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {result.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!fabricSupplier && !fabricQuotation && !labDipRequest && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <p className="text-sm text-slate-600">No fabric supplier information available</p>
        </div>
      )}
    </div>
  );
}
