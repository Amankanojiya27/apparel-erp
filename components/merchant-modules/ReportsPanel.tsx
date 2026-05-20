// File: components/merchant-modules/ReportsPanel.tsx
// Phase 14: Reports & Dashboards - Display Component

'use client';

import { Card, CardHeader, CardContent } from '@/components/Card';
import { BarChart3, TrendingUp, Package, DollarSign, Clock, CheckCircle } from 'lucide-react';

export function ReportsPanel() {
  // This is a dashboard/summary panel that displays aggregated data
  // It doesn't need full CRUD as it's a read-only reporting interface
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Reports & Dashboards</h2>
          <p className="text-sm text-slate-500">Overview of ERP metrics and analytics</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Orders</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Value</p>
                  <p className="text-2xl font-bold">$0</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">On-Time Delivery</p>
                  <p className="text-2xl font-bold">0%</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Completed</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Order Book Summary
              </h3>
              <p className="text-sm text-slate-500">
                This dashboard provides an overview of order status, production progress, and financial metrics.
                Data is aggregated from all ERP modules to give a comprehensive view of the business.
              </p>
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>Note:</strong> This is a placeholder for the full reporting dashboard.
                  Implement advanced analytics with charts, filters, and data visualization components
                  to provide real-time insights into the apparel manufacturing workflow.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500" />
                  Sample approval rate
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Production on-time delivery
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-500" />
                  Quality pass rate
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-500" />
                  Payment collection rate
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  Customer complaint rate
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
