// File: lib/demo-data.ts
/** In-memory demo dataset — used when MongoDB is unavailable */
import type { StyleExtensions, BOMLine, CostingSheet, Vendor, PurchaseRequisition, PurchaseOrder, GoodsReceiptNote, QualityInspection, ProductionOrder, MaterialIssue, ProductionTracking, FinishedGoodsReceipt, SalesOrder, DeliveryChallan, Invoice, PaymentReceipt, Attachment, SampleStage, FabricSupplier, FabricQuotation, LabDipRequest } from './style-types';

const demoBOM: BOMLine[] = [
  { itemCode: 'FAB-CTN-001', itemDescription: 'Cotton Fabric 60"', category: 'fabric', consumptionPerGarment: 1.5, unit: 'Meter', rate: 180, amount: 270, totalRequired: 1500, inStock: 0, toProcure: 1500 },
  { itemCode: 'BTN-PLY-002', itemDescription: 'Polyester Buttons', category: 'trim', consumptionPerGarment: 7, unit: 'Pcs', rate: 2, amount: 14, totalRequired: 7000, inStock: 2000, toProcure: 5000 },
  { itemCode: 'THR-WHT-001', itemDescription: 'White Thread', category: 'thread', consumptionPerGarment: 15, unit: 'Meter', rate: 0.5, amount: 7.5, totalRequired: 15000, inStock: 5000, toProcure: 10000 },
  { itemCode: 'LBL-BRD-001', itemDescription: 'Brand Label', category: 'trim', consumptionPerGarment: 1, unit: 'Pcs', rate: 5, amount: 5, totalRequired: 1000, inStock: 500, toProcure: 500 },
  { itemCode: 'PKG-PLY-001', itemDescription: 'Polybag', category: 'packing', consumptionPerGarment: 1, unit: 'Pcs', rate: 3, amount: 3, totalRequired: 1000, inStock: 0, toProcure: 1000 },
];

const demoCostingSheet: CostingSheet = {
  fabricCost: 270,
  trimsAccessories: 29.5,
  cmt: 80,
  washingFinishing: 25,
  packaging: 10,
  overheadPercent: 5,
  overheadAmount: 20.73,
  totalCost: 435.23,
  marginPercent: 65,
  marginAmount: 283,
  suggestedMRP: 1199,
  currency: '₹',
};

const demoVendor: Vendor = {
  vendorCode: 'VEN-FAB-101',
  vendorName: 'Tirupur Fabrics Pvt Ltd',
  category: 'fabric_supplier',
  gstNo: '33AABCT1234F1Z5',
  contactPerson: 'Mr. Suresh',
  phone: '9876543210',
  email: 'suresh@tirupurfabrics.com',
  paymentTerms: '30 Days Credit',
  leadTime: 15,
  address: 'Tirupur, Tamil Nadu',
};

const demoPR: PurchaseRequisition = {
  prNo: 'PR-2026-00234',
  prDate: '2026-05-18',
  styleReference: 'STY-2026-001',
  requiredBy: '2026-06-05',
  department: 'Merchant',
  raisedBy: 'Amit Kumar',
  lineItems: [
    { itemCode: 'FAB-CTN-001', description: 'Cotton Fabric 60"', qtyRequired: 1500, uom: 'Meters', preferredVendor: 'VEN-FAB-101' },
    { itemCode: 'BTN-PLY-002', description: 'Polyester Buttons', qtyRequired: 7000, uom: 'Pcs', preferredVendor: 'VEN-TRM-055' },
  ],
  status: 'converted_to_po',
};

const demoPO: PurchaseOrder = {
  poNo: 'PO-2026-00567',
  poDate: '2026-05-19',
  vendor: 'VEN-FAB-101',
  vendorName: 'Tirupur Fabrics Pvt Ltd',
  deliveryDate: '2026-06-03',
  deliveryLocation: 'Warehouse-Mumbai',
  paymentTerms: '30 Days from Invoice',
  prReference: 'PR-2026-00234',
  lineItems: [
    { itemCode: 'FAB-CTN-001', description: 'Cotton Fabric 60"', qty: 1500, rate: 180, taxPercent: 5, taxAmount: 13500, total: 283500 },
  ],
  status: 'completed',
};

const demoGRN: GoodsReceiptNote = {
  grnNo: 'GRN-2026-00890',
  grnDate: '2026-06-03',
  poReference: 'PO-2026-00567',
  vendor: 'VEN-FAB-101',
  invoiceNo: 'TF/INV/2026/1234',
  vehicleNo: 'MH-04-AB-1234',
  lineItems: [
    { item: 'Cotton Fabric', orderedQty: 1500, receivedQty: 1520, accepted: 1500, rejected: 20, remarks: 'Shade variation' },
  ],
  qualityCheckStatus: 'passed',
  inventoryUpdated: true,
};

const demoQC: QualityInspection = {
  grnReference: 'GRN-2026-00890',
  parameters: [
    { parameter: 'GSM', standard: '140 ± 5', actual: '142', status: 'pass' },
    { parameter: 'Width', standard: '60"', actual: '59.5"', status: 'pass' },
    { parameter: 'Shrinkage', standard: 'Max 3%', actual: '2.5%', status: 'pass' },
    { parameter: 'Color Fastness', standard: 'Grade 4+', actual: 'Grade 4', status: 'pass' },
    { parameter: 'Shade Match', standard: 'Approved Swatch', actual: 'OK', status: 'pass' },
  ],
  decision: 'accepted',
  remarks: 'All parameters within acceptable limits',
  inspectedBy: 'QC Team',
  inspectedAt: '2026-06-03',
};

const demoProductionOrder: ProductionOrder = {
  workOrderNo: 'WO-2026-00345',
  workOrderDate: '2026-06-04',
  styleCode: 'STY-2026-001',
  productionUnit: 'Unit-A Vapi',
  startDate: '2026-06-05',
  targetCompletion: '2026-06-20',
  sizeBreakdown: [
    { size: 'S', qty: 150 },
    { size: 'M', qty: 300 },
    { size: 'L', qty: 350 },
    { size: 'XL', qty: 150 },
    { size: 'XXL', qty: 50 },
  ],
  colorBreakdown: [
    { color: 'Navy Blue', qty: 400 },
    { color: 'Sky Blue', qty: 350 },
    { color: 'White', qty: 250 },
  ],
  totalQty: 1000,
  status: 'completed',
};

const demoMaterialIssue: MaterialIssue = {
  issueSlipNo: 'ISS-2026-00456',
  date: '2026-06-05',
  fromLocation: 'Warehouse-Mumbai',
  toLocation: 'Unit-A Vapi',
  workOrderRef: 'WO-2026-00345',
  items: [
    { item: 'Cotton Fabric', qtyIssued: 1500, uom: 'Meters' },
    { item: 'Polyester Buttons', qtyIssued: 7000, uom: 'Pcs' },
    { item: 'White Thread', qtyIssued: 15000, uom: 'Mtrs' },
    { item: 'Brand Labels', qtyIssued: 1000, uom: 'Pcs' },
  ],
};

const demoProductionTracking: ProductionTracking = {
  workOrderRef: 'WO-2026-00345',
  updates: [
    { date: '2026-06-05', cuttingDone: 400, stitchingDone: 0, finishingDone: 0, packed: 0, remarks: 'On track' },
    { date: '2026-06-08', cuttingDone: 1000, stitchingDone: 350, finishingDone: 0, packed: 0, remarks: 'On track' },
    { date: '2026-06-12', cuttingDone: 1000, stitchingDone: 750, finishingDone: 200, packed: 0, remarks: 'On track' },
    { date: '2026-06-18', cuttingDone: 1000, stitchingDone: 1000, finishingDone: 950, packed: 800, remarks: 'Minor delay' },
    { date: '2026-06-20', cuttingDone: 1000, stitchingDone: 1000, finishingDone: 1000, packed: 1000, remarks: 'Complete' },
  ],
  status: 'completed',
};

const demoFGReceipt: FinishedGoodsReceipt = {
  fgReceiptNo: 'FGR-2026-00234',
  date: '2026-06-21',
  workOrder: 'WO-2026-00345',
  style: 'STY-2026-001',
  totalQtyReceived: 995,
  rejectedShort: 5,
  location: 'FG Warehouse-Mumbai',
  sizeWiseReceipt: [
    { size: 'S', qty: 148 },
    { size: 'M', qty: 299 },
    { size: 'L', qty: 348 },
    { size: 'XL', qty: 150 },
    { size: 'XXL', qty: 50 },
  ],
};

const demoSalesOrder: SalesOrder = {
  soNo: 'SO-2026-01567',
  soDate: '2026-06-15',
  customer: 'ABC Retail Ltd',
  deliveryDate: '2026-06-25',
  paymentTerms: '45 Days',
  salesperson: 'Priya Singh',
  lineItems: [
    { style: 'STY-2026-001', size: 'M', color: 'Navy', qty: 100, rate: 650, amount: 65000 },
    { style: 'STY-2026-001', size: 'L', color: 'Navy', qty: 150, rate: 650, amount: 97500 },
    { style: 'STY-2026-001', size: 'M', color: 'Sky Blue', qty: 100, rate: 650, amount: 65000 },
  ],
  subTotal: 227500,
  gstPercent: 12,
  gstAmount: 27300,
  grandTotal: 254800,
  status: 'completed',
};

const demoDeliveryChallan: DeliveryChallan = {
  dcNo: 'DC-2026-00789',
  date: '2026-06-24',
  soReference: 'SO-2026-01567',
  customer: 'ABC Retail Ltd',
  shipTo: 'Warehouse-Delhi',
  transporter: 'BlueDart Logistics',
  awbLrNo: 'BD123456789',
  noOfCartons: 8,
  packedItems: [
    { style: 'STY-2026-001', size: 'M', color: 'Navy', qty: 100, rate: 650, amount: 65000 },
    { style: 'STY-2026-001', size: 'L', color: 'Navy', qty: 150, rate: 650, amount: 97500 },
    { style: 'STY-2026-001', size: 'M', color: 'Sky Blue', qty: 100, rate: 650, amount: 65000 },
  ],
  status: 'delivered',
};

const demoInvoice: Invoice = {
  invoiceNo: 'INV-2026-02345',
  date: '2026-06-24',
  dcRef: 'DC-2026-00789',
  soRef: 'SO-2026-01567',
  customer: 'ABC Retail Ltd',
  dueDate: '2026-08-08',
  amountDetails: {
    subTotal: 227500,
    gstAmount: 27300,
    grandTotal: 254800,
  },
  status: 'paid',
};

const demoPaymentReceipt: PaymentReceipt = {
  receiptNo: 'RCT-2026-03456',
  date: '2026-08-05',
  customer: 'ABC Retail Ltd',
  invoiceRef: 'INV-2026-02345',
  amountReceived: 254800,
  mode: 'neft',
  bankRef: 'UTR123456789',
  invoiceStatus: 'paid',
};

const demoAttachments: Attachment[] = [
  { id: 'att-1', name: 'Tech Pack_STY-2026-001.pdf', type: 'tech_pack', url: '/files/tech-pack.pdf', uploadedAt: '2026-05-10' },
  { id: 'att-2', name: 'Design Sketch_STY-2026-001.jpg', type: 'design_sketch', url: '/files/design-sketch.jpg', uploadedAt: '2026-05-10' },
];

const demoFabricSupplier: FabricSupplier = {
  supplierId: 'FAB-SUP-101',
  supplierName: 'Tirupur Fabrics Pvt Ltd',
  fabricTypes: ['Cotton', 'Cotton Blend', 'Polyester', 'Viscose'],
  gsmRange: { min: 100, max: 350 },
  widthRange: { min: 44, max: 72 },
  leadTimeDays: 15,
  labDipCapability: true,
  testingCapability: true,
  contactPerson: 'Mr. Suresh',
  email: 'suresh@tirupurfabrics.com',
  phone: '9876543210',
};

const demoFabricQuotation: FabricQuotation = {
  quotationId: 'QT-2026-00123',
  styleReference: 'STY-2026-001',
  fabricType: 'Cotton Fabric 60"',
  gsm: 140,
  width: 60,
  supplierId: 'FAB-SUP-101',
  ratePerMeter: 180,
  validUntil: '2026-06-30',
  status: 'approved',
};

const demoLabDipRequest: LabDipRequest = {
  requestId: 'LD-2026-00456',
  styleReference: 'STY-2026-001',
  fabricType: 'Cotton Fabric 60"',
  targetColor: 'Navy Blue',
  supplierId: 'FAB-SUP-101',
  requestedDate: '2026-05-15',
  receivedDate: '2026-05-22',
  testResults: [
    { parameter: 'Color Match', standard: 'Approved Swatch', actual: 'Match', status: 'pass' },
    { parameter: 'Color Fastness', standard: 'Grade 4+', actual: 'Grade 4', status: 'pass' },
    { parameter: 'Shade Consistency', standard: 'Uniform', actual: 'Uniform', status: 'pass' },
  ],
  status: 'approved',
};

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// Helper functions to generate dummy data
const generatePipeline = (currentStep: string, status: 'completed' | 'active' | 'pending') => {
  const steps = [
    { id: 'inquiry', label: 'Buyer Inquiry', department: 'Buying' },
    { id: 'assignment', label: 'Merchant Assignment', department: 'Merchandising' },
    { id: 'data_entry', label: 'ERP Data Entry', department: 'Merchandising' },
    { id: 'pre_costing', label: 'Pre-Costing', department: 'Merchandising' },
    { id: 'sampling', label: 'Sampling & Pattern', department: 'Sampling' },
    { id: 'buyer_approval', label: 'Buyer Approval', department: 'Buying' },
    { id: 'bom_mrp', label: 'BOM & MRP', department: 'Planning' },
    { id: 'procurement', label: 'Procurement', department: 'Merchandising' },
    { id: 'cutting', label: 'Cutting', department: 'Cutting' },
    { id: 'production', label: 'Production', department: 'Sewing' },
    { id: 'finishing', label: 'Finishing', department: 'Finishing' },
    { id: 'packaging', label: 'Packaging', department: 'Packing' },
    { id: 'sales', label: 'Sales Order', department: 'Sales' },
    { id: 'dispatch', label: 'Dispatch', department: 'Shipping' },
    { id: 'invoicing', label: 'Invoicing', department: 'Accounts' },
    { id: 'payment', label: 'Payment', department: 'Accounts' },
  ];
  
  const currentIndex = steps.findIndex(s => s.id === currentStep);
  return steps.map((step, index) => ({
    id: step.id,
    label: step.label,
    department: step.department,
    status: index < currentIndex ? 'completed' as const : index === currentIndex ? status : 'pending' as const,
    completedAt: index < currentIndex ? daysFromNow(-20 + index) : undefined,
    notes: index === currentIndex ? 'Currently in progress' : undefined,
  }));
};

const generateApprovals = (styleStatus: string) => {
  if (styleStatus === 'completed') {
    return [
      { _id: 'apr-1', stage: 'Pre-Costing', type: 'costing' as const, status: 'approved' as const, requestedBy: 'Amit Kumar', reviewedBy: 'Head Merchant', comments: 'Costing within target', requestedAt: daysFromNow(-35), reviewedAt: daysFromNow(-32) },
      { _id: 'apr-2', stage: 'BOM Review', type: 'bom' as const, status: 'approved' as const, requestedBy: 'Amit Kumar', reviewedBy: 'Planning Head', comments: 'All materials available', requestedAt: daysFromNow(-30), reviewedAt: daysFromNow(-28) },
      { _id: 'apr-3', stage: 'Sample Approval', type: 'sample' as const, status: 'approved' as const, requestedBy: 'Amit Kumar', reviewedBy: 'Buyer', comments: 'Sample approved for production', requestedAt: daysFromNow(-25), reviewedAt: daysFromNow(-22) },
    ];
  } else if (styleStatus === 'approved') {
    return [
      { _id: 'apr-1', stage: 'Pre-Costing', type: 'costing' as const, status: 'approved' as const, requestedBy: 'Amit Kumar', reviewedBy: 'Head Merchant', comments: 'Costing approved', requestedAt: daysFromNow(-15), reviewedAt: daysFromNow(-12) },
      { _id: 'apr-2', stage: 'Sample Approval', type: 'sample' as const, status: 'pending' as const, requestedBy: 'Amit Kumar', comments: 'Awaiting buyer review', requestedAt: daysFromNow(-5) },
    ];
  } else {
    return [
      { _id: 'apr-1', stage: 'Pre-Costing', type: 'costing' as const, status: 'pending' as const, requestedBy: 'Amit Kumar', comments: 'Initial costing review', requestedAt: daysFromNow(-2) },
    ];
  }
};

const generateTNA = (deliveryDate: string, status: string) => {
  const delivery = new Date(deliveryDate);
  const getStatus = (s: string): 'pending' | 'on_track' | 'delayed' | 'completed' => {
    if (s === 'completed') return 'completed';
    if (s === 'on_track') return 'on_track';
    if (s === 'delayed') return 'delayed';
    return 'pending';
  };
  return [
    { id: 'tna-1', name: 'Tech Pack Finalization', plannedDate: new Date(delivery.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(), status: getStatus(status === 'completed' ? 'completed' : 'on_track'), owner: 'Design Team' },
    { id: 'tna-2', name: 'Sample Development', plannedDate: new Date(delivery.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(), status: getStatus(status === 'completed' ? 'completed' : 'on_track'), owner: 'Sampling Dept' },
    { id: 'tna-3', name: 'Buyer Approval', plannedDate: new Date(delivery.getTime() - 45 * 24 * 60 * 60 * 1000).toISOString(), status: getStatus(status === 'completed' ? 'completed' : 'pending'), owner: 'Merchant' },
    { id: 'tna-4', name: 'BOM Finalization', plannedDate: new Date(delivery.getTime() - 40 * 24 * 60 * 60 * 1000).toISOString(), status: getStatus(status === 'completed' ? 'completed' : 'on_track'), owner: 'Planning' },
    { id: 'tna-5', name: 'Material Procurement', plannedDate: new Date(delivery.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(), status: getStatus(status === 'completed' ? 'completed' : 'delayed'), owner: 'Procurement' },
    { id: 'tna-6', name: 'Production Start', plannedDate: new Date(delivery.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(), status: getStatus(status === 'completed' ? 'completed' : 'pending'), owner: 'Production' },
    { id: 'tna-7', name: 'Quality Check', plannedDate: new Date(delivery.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: getStatus(status === 'completed' ? 'completed' : 'pending'), owner: 'QC Team' },
    { id: 'tna-8', name: 'Final Delivery', plannedDate: deliveryDate, status: getStatus(status === 'completed' ? 'completed' : 'pending'), owner: 'Logistics' },
  ];
};

const generateDepartmentProgress = (status: string, quantity: number) => {
  const baseProgress = status === 'completed' ? 100 : status === 'production' ? 60 : status === 'approved' ? 30 : 10;
  const getStatus = (s: string): 'not_started' | 'in_progress' | 'completed' | 'delayed' => {
    if (s === 'completed') return 'completed';
    if (s === 'in_progress') return 'in_progress';
    if (s === 'delayed') return 'delayed';
    return 'not_started';
  };
  return [
    { department: 'Sampling' as const, percentComplete: Math.min(100, baseProgress + 20), targetUnits: Math.ceil(quantity * 0.1), completedUnits: Math.ceil(quantity * 0.1 * (baseProgress + 20) / 100), isBottleneck: false, status: getStatus('completed'), dailyUpdates: [{ date: daysFromNow(-5), unitsCompleted: 50, notes: 'Sampling completed', updatedBy: 'Sampling Lead' }] },
    { department: 'Cutting' as const, percentComplete: Math.min(100, baseProgress), targetUnits: quantity, completedUnits: Math.ceil(quantity * baseProgress / 100), isBottleneck: false, status: getStatus(baseProgress === 100 ? 'completed' : 'in_progress'), dailyUpdates: [{ date: daysFromNow(-2), unitsCompleted: 200, notes: 'Cutting in progress', updatedBy: 'Cutting Supervisor' }] },
    { department: 'Sewing' as const, percentComplete: Math.min(100, baseProgress - 10), targetUnits: quantity, completedUnits: Math.ceil(quantity * (baseProgress - 10) / 100), isBottleneck: baseProgress < 50, status: getStatus(baseProgress < 50 ? 'delayed' : 'in_progress'), dailyUpdates: [{ date: daysFromNow(-1), unitsCompleted: 150, notes: 'Sewing ongoing', updatedBy: 'Line Supervisor' }] },
    { department: 'Finishing' as const, percentComplete: Math.min(100, baseProgress - 20), targetUnits: quantity, completedUnits: Math.ceil(quantity * (baseProgress - 20) / 100), isBottleneck: false, status: getStatus(baseProgress < 30 ? 'not_started' : 'in_progress'), dailyUpdates: [] },
    { department: 'Packaging' as const, percentComplete: Math.min(100, baseProgress - 30), targetUnits: quantity, completedUnits: Math.ceil(quantity * (baseProgress - 30) / 100), isBottleneck: false, status: getStatus(baseProgress < 20 ? 'not_started' : 'in_progress'), dailyUpdates: [] },
  ];
};

const generateEmails = (buyerEmail: string) => {
  return [
    { _id: 'eml-1', from: buyerEmail, to: 'merchant@factory.com', subject: 'Style Inquiry - New Collection', preview: 'We are interested in developing the following styles for our Spring-Summer collection...', linkedStep: 'inquiry', receivedAt: daysFromNow(-40), synced: true },
    { _id: 'eml-2', from: 'merchant@factory.com', to: buyerEmail, subject: 'Tech Pack Attached - STY-2026-001', preview: 'Please find attached the tech pack for review. Let us know if you have any questions...', linkedStep: 'sampling', receivedAt: daysFromNow(-25), synced: true },
    { _id: 'eml-3', from: buyerEmail, to: 'merchant@factory.com', subject: 'Sample Feedback', preview: 'The sample looks good overall. We have a few minor comments on the fit...', linkedStep: 'buyer_approval', receivedAt: daysFromNow(-15), synced: true },
  ];
};

const generateImages = () => {
  return [
    { _id: 'img-1', url: '/images/sample-front.jpg', label: 'Front View', type: 'proto' as const, uploadedAt: daysFromNow(-30) },
    { _id: 'img-2', url: '/images/sample-back.jpg', label: 'Back View', type: 'proto' as const, uploadedAt: daysFromNow(-30) },
    { _id: 'img-3', url: '/images/tech-pack.pdf', label: 'Tech Pack', type: 'techpack' as const, uploadedAt: daysFromNow(-35) },
  ];
};

const generateSampleWorkflow = (styleStatus: string): SampleStage[] => {
  const baseStages: SampleStage[] = [
    { stageId: 'proto', status: 'pending', deadline: daysFromNow(-40), assignedTo: 'Sampling Team', revisionCount: 0 },
    { stageId: 'fit', status: 'pending', deadline: daysFromNow(-35), assignedTo: 'Sampling Team', revisionCount: 0 },
    { stageId: 'pp', status: 'pending', deadline: daysFromNow(-30), assignedTo: 'Sampling Team', revisionCount: 0 },
    { stageId: 'size_set', status: 'pending', deadline: daysFromNow(-25), assignedTo: 'Sampling Team', revisionCount: 0 },
    { stageId: 'top', status: 'pending', deadline: daysFromNow(-20), assignedTo: 'Sampling Team', revisionCount: 0 },
    { stageId: 'approval', status: 'pending', deadline: daysFromNow(-15), assignedTo: 'Merchant', revisionCount: 0 },
  ];

  if (styleStatus === 'completed') {
    return [
      { stageId: 'proto', status: 'approved', deadline: daysFromNow(-40), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-38), buyerFeedback: 'Good overall', revisionCount: 1 },
      { stageId: 'fit', status: 'approved', deadline: daysFromNow(-35), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-33), buyerFeedback: 'Fit approved', revisionCount: 0 },
      { stageId: 'pp', status: 'approved', deadline: daysFromNow(-30), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-28), buyerFeedback: 'PP sample approved', revisionCount: 0 },
      { stageId: 'size_set', status: 'approved', deadline: daysFromNow(-25), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-23), buyerFeedback: 'Size set approved', revisionCount: 0 },
      { stageId: 'top', status: 'approved', deadline: daysFromNow(-20), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-18), buyerFeedback: 'TOP approved', revisionCount: 0 },
      { stageId: 'approval', status: 'approved', deadline: daysFromNow(-15), assignedTo: 'Merchant', submittedDate: daysFromNow(-12), buyerFeedback: 'Final approval received', revisionCount: 0 },
    ];
  } else if (styleStatus === 'approved' || styleStatus === 'production') {
    return [
      { stageId: 'proto', status: 'approved', deadline: daysFromNow(-25), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-23), buyerFeedback: 'Proto approved', revisionCount: 0 },
      { stageId: 'fit', status: 'approved', deadline: daysFromNow(-20), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-18), buyerFeedback: 'Fit approved', revisionCount: 1 },
      { stageId: 'pp', status: 'approved', deadline: daysFromNow(-15), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-13), buyerFeedback: 'PP approved', revisionCount: 0 },
      { stageId: 'size_set', status: 'in_progress', deadline: daysFromNow(-10), assignedTo: 'Sampling Team', revisionCount: 0 },
      { stageId: 'top', status: 'pending', deadline: daysFromNow(5), assignedTo: 'Sampling Team', revisionCount: 0 },
      { stageId: 'approval', status: 'pending', deadline: daysFromNow(10), assignedTo: 'Merchant', revisionCount: 0 },
    ];
  } else if (styleStatus === 'sampling') {
    return [
      { stageId: 'proto', status: 'approved', deadline: daysFromNow(-15), assignedTo: 'Sampling Team', submittedDate: daysFromNow(-13), buyerFeedback: 'Proto approved', revisionCount: 0 },
      { stageId: 'fit', status: 'in_progress', deadline: daysFromNow(-10), assignedTo: 'Sampling Team', revisionCount: 0 },
      { stageId: 'pp', status: 'pending', deadline: daysFromNow(-5), assignedTo: 'Sampling Team', revisionCount: 0 },
      { stageId: 'size_set', status: 'pending', deadline: daysFromNow(0), assignedTo: 'Sampling Team', revisionCount: 0 },
      { stageId: 'top', status: 'pending', deadline: daysFromNow(5), assignedTo: 'Sampling Team', revisionCount: 0 },
      { stageId: 'approval', status: 'pending', deadline: daysFromNow(10), assignedTo: 'Merchant', revisionCount: 0 },
    ];
  } else {
    return baseStages;
  }
};

export const DEMO_STYLES: (StyleExtensions & { _id: string; designNumber: string; buyerName: string; buyer: { name: string; email?: string }; merchant: { name: string; email?: string }; sampleType: string; status: string; priority: string; sampleDeadline: string; deliveryDate: string; quantity: number; fabricDetails: { type: string; description: string; gsm: number; color: string }; rawMaterials?: { buttonsPerGarment?: number; other?: string }; comments?: Array<{ user: string; text: string; timestamp: string }>; createdAt?: string; updatedAt?: string })[] = [
  {
    _id: 'demo-001',
    designNumber: 'STY-2026-001',
    buyerName: 'ABC Retail Ltd',
    buyer: { name: 'ABC Retail Ltd', email: 'buying@abcretail.com' },
    merchant: { name: 'Amit Kumar', email: 'amit@factory.com' },
    sampleType: 'production',
    fabricDetails: { type: 'Cotton Fabric 60"', description: 'Men\'s Casual Printed Shirt', gsm: 140, color: 'Navy Blue' },
    rawMaterials: { buttonsPerGarment: 7, other: 'Polyester Buttons, White Thread, Brand Label, Polybag' },
    status: 'completed',
    priority: 'high',
    sampleDeadline: daysFromNow(-30),
    deliveryDate: daysFromNow(-2),
    quantity: 1000,
    comments: [
      { user: 'Amit Kumar', text: 'Style approved and production completed. All ERP modules executed successfully.', timestamp: daysFromNow(-5) },
    ],
    createdAt: daysFromNow(-90),
    updatedAt: daysFromNow(-2),
    styleCode: 'STY-2026-001',
    styleName: 'Men\'s Casual Printed Shirt',
    category: 'Apparel > Men > Shirts',
    season: 'Spring-Summer 2026',
    brand: 'XYZ Fashion',
    designerName: 'Rahul Sharma',
    targetCost: 450,
    targetMRP: 1299,
    approvalStatus: 'approved',
    approvedBy: 'Head Merchant',
    approvedDate: '2026-05-15',
    attachments: demoAttachments,
    vendor: demoVendor,
    purchaseRequisition: demoPR,
    purchaseOrder: demoPO,
    goodsReceiptNote: demoGRN,
    qualityInspection: demoQC,
    productionOrder: demoProductionOrder,
    materialIssue: demoMaterialIssue,
    productionTracking: demoProductionTracking,
    finishedGoodsReceipt: demoFGReceipt,
    salesOrder: demoSalesOrder,
    deliveryChallan: demoDeliveryChallan,
    invoice: demoInvoice,
    paymentReceipt: demoPaymentReceipt,
    pipeline: generatePipeline('payment', 'completed'),
    images: generateImages(),
    approvals: generateApprovals('completed'),
    bom: demoBOM,
    tna: generateTNA(daysFromNow(-2), 'completed'),
    preCosting: {
      fabricConsumption: 1.5,
      fabricRate: 180,
      trimCost: 29.5,
      cmCost: 80,
      commercialCost: 25,
      wastagePercent: 5,
      profitMarginPercent: 65,
      targetPrice: 450,
      quotedPrice: 650,
      currency: '₹',
    },
    costingSheet: demoCostingSheet,
    departmentProgress: generateDepartmentProgress('completed', 1000),
    materialChase: {
      fabric: { status: 'qc_passed', supplier: 'VEN-FAB-101', expectedDate: '2026-06-03', receivedQty: 1500, requiredQty: 1500 },
      pattern: { status: 'completed', assignedTo: 'Pattern Team', dueDate: '2026-06-01' },
      readinessPercent: 100,
      productionReady: true,
      alerts: [],
    },
    emails: generateEmails('buying@abcretail.com'),
    currentPipelineStep: 'payment',
    quantityTier: 'medium',
    sampleWorkflow: generateSampleWorkflow('completed'),
    fabricSupplier: demoFabricSupplier,
    fabricQuotation: demoFabricQuotation,
    labDipRequest: demoLabDipRequest,
  },
  {
    _id: 'demo-002',
    designNumber: 'DN-2026-0142',
    buyerName: 'H&M Europe',
    buyer: { name: 'H&M Europe', email: 'buying@hm-demo.com' },
    merchant: { name: 'Rahul Sharma', email: 'rahul@factory.com' },
    sampleType: 'fit',
    fabricDetails: { type: 'Cotton Twill', description: 'Stretch twill for chinos', gsm: 280, color: 'Navy' },
    rawMaterials: { buttonsPerGarment: 1, other: 'YKK zip, main label' },
    status: 'sampling',
    priority: 'medium',
    sampleDeadline: daysFromNow(5),
    deliveryDate: daysFromNow(120),
    quantity: 800,
    comments: [
      { user: 'Rahul Sharma', text: 'Buyer wants fit sample this week. Delivery is Q3 — lower shipment urgency.', timestamp: daysFromNow(-2) },
      { user: 'Cutting Dept', text: 'Pattern under development. Cutting team aligned for next Monday.', timestamp: daysFromNow(-1) },
    ],
    createdAt: daysFromNow(-10),
    updatedAt: daysFromNow(-1),
    styleCode: 'STY-2026-002',
    styleName: 'Men\'s Stretch Chinos',
    category: 'Apparel > Men > Bottoms',
    season: 'Fall-Winter 2026',
    brand: 'H&M',
    designerName: 'Rahul Sharma',
    targetCost: 350,
    targetMRP: 999,
    approvalStatus: 'pending',
    attachments: [],
    pipeline: generatePipeline('sampling', 'active'),
    images: generateImages(),
    approvals: generateApprovals('pending'),
    bom: [],
    tna: generateTNA(daysFromNow(120), 'sampling'),
    preCosting: {
      fabricConsumption: 1.8,
      fabricRate: 150,
      trimCost: 20,
      cmCost: 70,
      commercialCost: 20,
      wastagePercent: 5,
      profitMarginPercent: 60,
      targetPrice: 350,
      currency: '₹',
    },
    departmentProgress: generateDepartmentProgress('sampling', 800),
    materialChase: {
      fabric: { status: 'ordered', supplier: 'VEN-FAB-102', expectedDate: daysFromNow(10), requiredQty: 1440 },
      pattern: { status: 'in_development', assignedTo: 'Pattern Team', dueDate: daysFromNow(3) },
      readinessPercent: 40,
      productionReady: false,
      alerts: ['Fabric ordered, awaiting delivery', 'Pattern development in progress'],
    },
    emails: generateEmails('buying@hm-demo.com'),
    currentPipelineStep: 'sampling',
    sampleWorkflow: generateSampleWorkflow('sampling'),
  },
  {
    _id: 'demo-003',
    designNumber: 'DN-2026-0089',
    buyerName: 'Zara Home',
    buyer: { name: 'Zara Home', email: 'merch@zarahome-demo.com' },
    merchant: { name: 'Priya Mehta', email: 'priya@factory.com' },
    sampleType: 'proto',
    fabricDetails: { type: 'Linen Blend', description: 'Washed linen for shirts', gsm: 160, color: 'Ecru' },
    rawMaterials: { buttonsPerGarment: 7 },
    status: 'production',
    priority: 'urgent',
    sampleDeadline: daysFromNow(-5),
    deliveryDate: daysFromNow(28),
    quantity: 5200,
    comments: [
      { user: 'Priya Mehta', text: 'Delivery next month! Fabric chased — pattern must close in 15 days.', timestamp: daysFromNow(-3) },
      { user: 'Supervisor', text: 'PRIORITY: Shipment beats fit-sample rush on DN-0142. Pull capacity here.', timestamp: daysFromNow(-2) },
    ],
    createdAt: daysFromNow(-25),
    updatedAt: daysFromNow(0),
    styleCode: 'STY-2026-003',
    styleName: 'Linen Blend Shirt',
    category: 'Apparel > Women > Tops',
    season: 'Spring-Summer 2026',
    brand: 'Zara Home',
    designerName: 'Priya Mehta',
    targetCost: 400,
    targetMRP: 1199,
    approvalStatus: 'approved',
    approvedBy: 'Head Merchant',
    approvedDate: daysFromNow(-10),
    attachments: [],
    pipeline: generatePipeline('production', 'active'),
    images: generateImages(),
    approvals: generateApprovals('approved'),
    bom: [],
    tna: generateTNA(daysFromNow(28), 'production'),
    preCosting: {
      fabricConsumption: 1.6,
      fabricRate: 200,
      trimCost: 25,
      cmCost: 85,
      commercialCost: 25,
      wastagePercent: 5,
      profitMarginPercent: 65,
      targetPrice: 400,
      currency: '₹',
    },
    departmentProgress: generateDepartmentProgress('production', 5200),
    materialChase: {
      fabric: { status: 'received', supplier: 'VEN-FAB-103', expectedDate: daysFromNow(-5), receivedQty: 8320, requiredQty: 8320 },
      pattern: { status: 'completed', assignedTo: 'Pattern Team', dueDate: daysFromNow(-10) },
      readinessPercent: 100,
      productionReady: true,
      alerts: [],
    },
    emails: generateEmails('merch@zarahome-demo.com'),
    currentPipelineStep: 'production',
    sampleWorkflow: generateSampleWorkflow('production'),
  },
  {
    _id: 'demo-004',
    designNumber: 'DN-2026-0201',
    buyerName: 'Mango',
    buyer: { name: 'Mango', email: 'tech@mango-demo.com' },
    merchant: { name: 'Amit Kumar', email: 'amit@factory.com' },
    sampleType: 'fit',
    fabricDetails: { type: 'Poly Viscose', description: 'Printed blouse fabric', gsm: 120, color: 'Floral Print' },
    rawMaterials: { buttonsPerGarment: 8, other: 'Shell buttons PG-12' },
    status: 'approved',
    priority: 'high',
    sampleDeadline: daysFromNow(12),
    deliveryDate: daysFromNow(45),
    quantity: 3200,
    comments: [
      { user: 'Amit Kumar', text: 'Fit sample approved. Moving to cutting — reverse plan from 45-day delivery.', timestamp: daysFromNow(-1) },
    ],
    createdAt: daysFromNow(-18),
    updatedAt: daysFromNow(-1),
    styleCode: 'STY-2026-004',
    styleName: 'Printed Blouse',
    category: 'Apparel > Women > Tops',
    season: 'Spring-Summer 2026',
    brand: 'Mango',
    designerName: 'Amit Kumar',
    targetCost: 380,
    targetMRP: 1099,
    approvalStatus: 'approved',
    approvedBy: 'Head Merchant',
    approvedDate: daysFromNow(-2),
    attachments: [],
    pipeline: generatePipeline('bom_mrp', 'active'),
    images: generateImages(),
    approvals: generateApprovals('approved'),
    bom: [],
    tna: generateTNA(daysFromNow(45), 'approved'),
    preCosting: {
      fabricConsumption: 1.4,
      fabricRate: 180,
      trimCost: 30,
      cmCost: 75,
      commercialCost: 22,
      wastagePercent: 5,
      profitMarginPercent: 62,
      targetPrice: 380,
      currency: '₹',
    },
    departmentProgress: generateDepartmentProgress('approved', 3200),
    materialChase: {
      fabric: { status: 'not_ordered', requiredQty: 4480 },
      pattern: { status: 'not_started' },
      readinessPercent: 0,
      productionReady: false,
      alerts: ['Fabric not ordered', 'Pattern not started'],
    },
    emails: generateEmails('tech@mango-demo.com'),
    currentPipelineStep: 'bom_mrp',
    sampleWorkflow: generateSampleWorkflow('approved'),
  },
  {
    _id: 'demo-005',
    designNumber: 'DN-2026-0055',
    buyerName: 'Target USA',
    buyer: { name: 'Target USA', email: 'sourcing@target-demo.com' },
    merchant: { name: 'Rahul Sharma', email: 'rahul@factory.com' },
    sampleType: 'production',
    fabricDetails: { type: 'Fleece', description: 'Brushed fleece hoodie', gsm: 320, color: 'Heather Grey' },
    rawMaterials: { buttonsPerGarment: 0, other: 'Drawcord, kangaroo pocket trim' },
    status: 'pending',
    priority: 'high',
    sampleDeadline: daysFromNow(18),
    deliveryDate: daysFromNow(55),
    quantity: 12000,
    comments: [],
    createdAt: daysFromNow(-3),
    updatedAt: daysFromNow(-3),
    styleCode: 'STY-2026-005',
    styleName: 'Brushed Fleece Hoodie',
    category: 'Apparel > Men > Outerwear',
    season: 'Fall-Winter 2026',
    brand: 'Target',
    designerName: 'Rahul Sharma',
    targetCost: 500,
    targetMRP: 1499,
    approvalStatus: 'pending',
    attachments: [],
    pipeline: generatePipeline('data_entry', 'active'),
    images: generateImages(),
    approvals: generateApprovals('pending'),
    bom: [],
    tna: generateTNA(daysFromNow(55), 'pending'),
    preCosting: {
      fabricConsumption: 2.0,
      fabricRate: 220,
      trimCost: 35,
      cmCost: 95,
      commercialCost: 30,
      wastagePercent: 6,
      profitMarginPercent: 60,
      targetPrice: 500,
      currency: '₹',
    },
    departmentProgress: generateDepartmentProgress('pending', 12000),
    materialChase: {
      fabric: { status: 'not_ordered', requiredQty: 24000 },
      pattern: { status: 'not_started' },
      readinessPercent: 0,
      productionReady: false,
      alerts: ['Fabric not ordered', 'Pattern not started'],
    },
    emails: generateEmails('sourcing@target-demo.com'),
    currentPipelineStep: 'data_entry',
    sampleWorkflow: generateSampleWorkflow('pending'),
  },
  {
    _id: 'demo-006',
    designNumber: 'DN-2026-0118',
    buyerName: 'Uniqlo',
    buyer: { name: 'Uniqlo', email: 'dev@uniqlo-demo.com' },
    merchant: { name: 'Sneha Patel', email: 'sneha@factory.com' },
    sampleType: 'proto',
    fabricDetails: { type: 'Jersey Knit', description: 'Single jersey T-shirt', gsm: 180, color: 'White' },
    rawMaterials: { buttonsPerGarment: 0 },
    status: 'sampling',
    priority: 'medium',
    sampleDeadline: daysFromNow(10),
    deliveryDate: daysFromNow(75),
    quantity: 450,
    comments: [
      { user: 'Sneha Patel', text: 'Small qty — can slot between bulk runs if cutting free.', timestamp: daysFromNow(-2) },
    ],
    createdAt: daysFromNow(-7),
    updatedAt: daysFromNow(-2),
    styleCode: 'STY-2026-006',
    styleName: 'Basic T-Shirt',
    category: 'Apparel > Men > Tops',
    season: 'Spring-Summer 2026',
    brand: 'Uniqlo',
    designerName: 'Sneha Patel',
    targetCost: 150,
    targetMRP: 499,
    approvalStatus: 'pending',
    attachments: [],
    pipeline: generatePipeline('pre_costing', 'active'),
    images: generateImages(),
    approvals: generateApprovals('pending'),
    bom: [],
    tna: generateTNA(daysFromNow(75), 'sampling'),
    preCosting: {
      fabricConsumption: 1.2,
      fabricRate: 80,
      trimCost: 10,
      cmCost: 35,
      commercialCost: 12,
      wastagePercent: 4,
      profitMarginPercent: 55,
      targetPrice: 150,
      currency: '₹',
    },
    departmentProgress: generateDepartmentProgress('sampling', 450),
    materialChase: {
      fabric: { status: 'in_transit', supplier: 'VEN-FAB-104', expectedDate: daysFromNow(5), requiredQty: 540 },
      pattern: { status: 'in_development', assignedTo: 'Pattern Team', dueDate: daysFromNow(3) },
      readinessPercent: 50,
      productionReady: false,
      alerts: ['Fabric in transit', 'Pattern development in progress'],
    },
    emails: generateEmails('dev@uniqlo-demo.com'),
    currentPipelineStep: 'pre_costing',
    sampleWorkflow: generateSampleWorkflow('sampling'),
  },
];

export const DEMO_MERCHANTS = [
  { name: 'Rahul Sharma', styles: 2, buyers: 2 },
  { name: 'Priya Mehta', styles: 2, buyers: 2 },
  { name: 'Amit Kumar', styles: 1, buyers: 1 },
  { name: 'Sneha Patel', styles: 1, buyers: 1 },
];