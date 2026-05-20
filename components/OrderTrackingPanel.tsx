'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { Search, CheckCircle, Clock, AlertCircle, Package, Truck, FileText, Factory, ChevronRight, ChevronDown } from 'lucide-react';

interface OrderStage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'not-started';
  date?: string;
  notes?: string;
}

interface Order {
  id: string;
  buyerPO: string;
  buyer: string;
  style: string;
  quantity: number;
  deliveryDate: string;
  currentStage: string;
  stages: OrderStage[];
}

const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    buyerPO: 'PO-2024-001',
    buyer: 'Zara',
    style: 'Z-1001',
    quantity: 5000,
    deliveryDate: '2024-06-15',
    currentStage: 'production',
    stages: [
      { id: 'po', name: 'Buyer PO Received', status: 'completed', date: '2024-03-01' },
      { id: 'sample', name: 'Sample Approved', status: 'completed', date: '2024-03-15' },
      { id: 'work-order', name: 'Work Order Created', status: 'completed', date: '2024-03-20' },
      { id: 'tech-pack', name: 'Tech Pack Prepared', status: 'completed', date: '2024-03-22' },
      { id: 'fabric', name: 'Fabric Procured', status: 'completed', date: '2024-04-01' },
      { id: 'trim', name: 'Trims Procured', status: 'completed', date: '2024-04-05' },
      { id: 'cutting', name: 'Cutting Completed', status: 'completed', date: '2024-04-10' },
      { id: 'production', name: 'Production in Progress', status: 'in-progress', date: '2024-04-15', notes: '60% complete' },
      { id: 'inline-qc', name: 'Inline QC', status: 'in-progress', notes: 'Ongoing' },
      { id: 'final-qc', name: 'Final Inspection', status: 'pending' },
      { id: 'packing', name: 'Packing', status: 'pending' },
      { id: 'shipment', name: 'Shipment', status: 'pending' },
      { id: 'delivery', name: 'Delivery', status: 'pending' },
    ]
  },
  {
    id: 'ORD-002',
    buyerPO: 'PO-2024-002',
    buyer: 'H&M',
    style: 'H-2005',
    quantity: 3000,
    deliveryDate: '2024-07-20',
    currentStage: 'fabric',
    stages: [
      { id: 'po', name: 'Buyer PO Received', status: 'completed', date: '2024-04-01' },
      { id: 'sample', name: 'Sample Approved', status: 'completed', date: '2024-04-10' },
      { id: 'work-order', name: 'Work Order Created', status: 'completed', date: '2024-04-15' },
      { id: 'tech-pack', name: 'Tech Pack Prepared', status: 'completed', date: '2024-04-18' },
      { id: 'fabric', name: 'Fabric Procured', status: 'in-progress', date: '2024-04-20', notes: 'Awaiting lab dip approval' },
      { id: 'trim', name: 'Trims Procured', status: 'not-started' },
      { id: 'cutting', name: 'Cutting Completed', status: 'not-started' },
      { id: 'production', name: 'Production in Progress', status: 'not-started' },
      { id: 'inline-qc', name: 'Inline QC', status: 'not-started' },
      { id: 'final-qc', name: 'Final Inspection', status: 'not-started' },
      { id: 'packing', name: 'Packing', status: 'not-started' },
      { id: 'shipment', name: 'Shipment', status: 'not-started' },
      { id: 'delivery', name: 'Delivery', status: 'not-started' },
    ]
  },
];

const STAGE_CONFIG = {
  po: { icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  sample: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  'work-order': { icon: FileText, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  'tech-pack': { icon: FileText, color: 'text-cyan-600', bgColor: 'bg-cyan-50' },
  fabric: { icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  trim: { icon: Package, color: 'text-teal-600', bgColor: 'bg-teal-50' },
  cutting: { icon: Factory, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  production: { icon: Factory, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  'inline-qc': { icon: CheckCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  'final-qc': { icon: CheckCircle, color: 'text-lime-600', bgColor: 'bg-lime-50' },
  packing: { icon: Package, color: 'text-rose-600', bgColor: 'bg-rose-50' },
  shipment: { icon: Truck, color: 'text-red-600', bgColor: 'bg-red-50' },
  delivery: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
};

export function OrderTrackingPanel() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(MOCK_ORDERS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());

  const filteredOrders = MOCK_ORDERS.filter(order =>
    order.buyerPO.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStage = (stageId: string) => {
    const newExpanded = new Set(expandedStages);
    if (newExpanded.has(stageId)) {
      newExpanded.delete(stageId);
    } else {
      newExpanded.add(stageId);
    }
    setExpandedStages(newExpanded);
  };

  const getStatusIcon = (status: OrderStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      case 'not-started':
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: OrderStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-orange-50 border-orange-200';
      case 'not-started':
        return 'bg-slate-50 border-slate-200';
    }
  };

  const getProgressPercentage = (stages: OrderStage[]) => {
    const completed = stages.filter(s => s.status === 'completed').length;
    const inProgress = stages.filter(s => s.status === 'in-progress').length;
    return Math.round(((completed + inProgress * 0.5) / stages.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Order Tracking</h2>
          <p className="text-sm text-slate-500">Track complete order lifecycle from PO to delivery</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by PO, buyer, or style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order List */}
            <div className="lg:col-span-1 space-y-3">
              <h3 className="font-semibold text-slate-900 mb-3">Orders</h3>
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedOrder?.id === order.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{order.buyerPO}</p>
                      <p className="text-sm text-slate-500">{order.buyer} - {order.style}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900">{getProgressPercentage(order.stages)}%</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${getProgressPercentage(order.stages)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Delivery: {order.deliveryDate}</p>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="lg:col-span-2">
              {selectedOrder && (
                <div className="space-y-4">
                  {/* Order Header */}
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{selectedOrder.buyerPO}</h3>
                        <p className="text-sm text-slate-500">{selectedOrder.buyer} - {selectedOrder.style}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{getProgressPercentage(selectedOrder.stages)}%</p>
                        <p className="text-sm text-slate-500">Complete</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Quantity</p>
                        <p className="font-semibold text-slate-900">{selectedOrder.quantity.toLocaleString()} pcs</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Delivery Date</p>
                        <p className="font-semibold text-slate-900">{selectedOrder.deliveryDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Current Stage</p>
                        <p className="font-semibold text-slate-900 capitalize">{selectedOrder.currentStage}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Order Journey</h3>
                    <div className="space-y-2">
                      {selectedOrder.stages.map((stage, index) => {
                        const config = STAGE_CONFIG[stage.id as keyof typeof STAGE_CONFIG];
                        const Icon = config?.icon || FileText;
                        const isExpanded = expandedStages.has(stage.id);

                        return (
                          <div key={stage.id} className="relative">
                            {/* Timeline Line */}
                            {index < selectedOrder.stages.length - 1 && (
                              <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-slate-200" />
                            )}

                            <div
                              className={`p-4 rounded-lg border ${getStatusColor(stage.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                              onClick={() => toggleStage(stage.id)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${config?.bgColor}`}>
                                  <Icon className={`h-5 w-5 ${config?.color}`} />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-center">
                                    <p className="font-semibold text-slate-900">{stage.name}</p>
                                    <div className="flex items-center gap-2">
                                      {stage.date && (
                                        <span className="text-xs text-slate-500">{stage.date}</span>
                                      )}
                                      {getStatusIcon(stage.status)}
                                      {isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-slate-400" />
                                      )}
                                    </div>
                                  </div>
                                  {stage.notes && isExpanded && (
                                    <p className="text-sm text-slate-600 mt-2">{stage.notes}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* What's Next */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">What's Next</h4>
                    {(() => {
                      const nextStage = selectedOrder.stages.find(s => s.status === 'pending' || s.status === 'not-started');
                      if (nextStage) {
                        return (
                          <p className="text-sm text-blue-800">
                            Next step: <span className="font-semibold">{nextStage.name}</span>
                          </p>
                        );
                      }
                      return <p className="text-sm text-blue-800">Order is complete!</p>;
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
