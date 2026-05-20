// File: lib/style-types.ts
export type PipelineStepStatus = 'pending' | 'active' | 'completed' | 'blocked';

export interface PipelineStep {
  id: string;
  label: string;
  department: string;
  status: PipelineStepStatus;
  completedAt?: string;
  notes?: string;
}

export interface SampleImage {
  _id: string;
  url: string;
  label: string;
  type: 'proto' | 'fit' | 'production' | 'techpack' | 'other';
  uploadedAt: string;
}

export interface SampleStage {
  stageId: 'proto' | 'fit' | 'pp' | 'size_set' | 'top' | 'approval';
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected' | 'revision';
  deadline: string;
  assignedTo: string;
  submittedDate?: string;
  buyerFeedback?: string;
  revisionCount: number;
  images?: SampleImage[];
}

export interface ApprovalRecord {
  _id: string;
  stage: string;
  type: 'sample' | 'costing' | 'bom' | 'shipment';
  status: 'pending' | 'approved' | 'rejected' | 'revised';
  requestedBy: string;
  reviewedBy?: string;
  comments?: string;
  requestedAt: string;
  reviewedAt?: string;
}

export interface BOMLine {
  itemCode: string;
  itemDescription: string;
  category: 'fabric' | 'trim' | 'packing' | 'thread';
  consumptionPerGarment: number;
  unit: string;
  rate: number;
  amount: number;
  totalRequired: number;
  inStock: number;
  toProcure: number;
}

export interface TNAMilestone {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: 'pending' | 'on_track' | 'delayed' | 'completed';
  owner: string;
}

export interface CostingSheet {
  fabricCost: number;
  trimsAccessories: number;
  cmt: number;
  washingFinishing: number;
  packaging: number;
  overheadPercent: number;
  overheadAmount: number;
  totalCost: number;
  marginPercent: number;
  marginAmount: number;
  suggestedMRP: number;
  currency: string;
}

export interface PreCosting {
  fabricConsumption: number;
  fabricRate: number;
  trimCost: number;
  cmCost: number;
  commercialCost: number;
  wastagePercent: number;
  profitMarginPercent: number;
  targetPrice: number;
  quotedPrice?: number;
  currency: string;
}


export interface DailyProgressUpdate {
  date: string;
  unitsCompleted: number;
  notes?: string;
  updatedBy: string;
}

export interface DepartmentProgress {
  department: 'Sampling' | 'Cutting' | 'Sewing' | 'Finishing' | 'Packaging';
  percentComplete: number;
  targetUnits: number;
  completedUnits: number;
  isBottleneck: boolean;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  dailyUpdates: DailyProgressUpdate[];
}

export type MaterialStatus =
  | 'not_ordered'
  | 'ordered'
  | 'in_transit'
  | 'received'
  | 'qc_passed'
  | 'delayed';

export type PatternStatus = 'not_started' | 'in_development' | 'completed' | 'revision';

export interface MaterialChase {
  fabric: {
    status: MaterialStatus;
    supplier?: string;
    expectedDate?: string;
    receivedQty?: number;
    requiredQty: number;
  };
  pattern: {
    status: PatternStatus;
    assignedTo?: string;
    dueDate?: string;
  };
  readinessPercent: number;
  productionReady: boolean;
  alerts: string[];
}

export interface ResourceConflict {
  department: string;
  competingStyles: Array<{ designNumber: string; styleId: string; utilizationPercent: number }>;
  severity: 'warning' | 'critical';
  message: string;
}

export interface EmailThread {
  _id: string;
  from: string;
  to: string;
  subject: string;
  preview: string;
  linkedStep?: string;
  receivedAt: string;
  synced: boolean;
}

// New ERP Types
export interface Vendor {
  vendorCode: string;
  vendorName: string;
  category: 'fabric_supplier' | 'trim_supplier' | 'logistics' | 'other';
  gstNo: string;
  contactPerson: string;
  phone: string;
  email?: string;
  paymentTerms: string;
  leadTime: number;
  address?: string;
}

export interface PurchaseRequisitionLine {
  itemCode: string;
  description: string;
  qtyRequired: number;
  uom: string;
  preferredVendor: string;
}

export interface PurchaseRequisition {
  prNo: string;
  prDate: string;
  styleReference: string;
  requiredBy: string;
  department: string;
  raisedBy: string;
  lineItems: PurchaseRequisitionLine[];
  status: 'pending' | 'approved' | 'rejected' | 'converted_to_po';
}

export interface PurchaseOrderLine {
  itemCode: string;
  description: string;
  qty: number;
  rate: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
}

export interface PurchaseOrder {
  poNo: string;
  poDate: string;
  vendor: string;
  vendorName: string;
  deliveryDate: string;
  deliveryLocation: string;
  paymentTerms: string;
  prReference: string;
  lineItems: PurchaseOrderLine[];
  status: 'pending' | 'approved' | 'sent' | 'partial_received' | 'completed';
}

export interface GRNLine {
  item: string;
  orderedQty: number;
  receivedQty: number;
  accepted: number;
  rejected: number;
  remarks: string;
}

export interface GoodsReceiptNote {
  grnNo: string;
  grnDate: string;
  poReference: string;
  vendor: string;
  invoiceNo: string;
  vehicleNo: string;
  lineItems: GRNLine[];
  qualityCheckStatus: 'pending' | 'passed' | 'failed' | 'conditional';
  inventoryUpdated: boolean;
}

export interface QCParameter {
  parameter: string;
  standard: string;
  actual: string;
  status: 'pass' | 'fail';
}

export interface FabricSupplier {
  supplierId: string;
  supplierName: string;
  fabricTypes: string[];
  gsmRange: { min: number; max: number };
  widthRange: { min: number; max: number };
  leadTimeDays: number;
  labDipCapability: boolean;
  testingCapability: boolean;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface FabricQuotation {
  quotationId: string;
  styleReference: string;
  fabricType: string;
  gsm: number;
  width: number;
  supplierId: string;
  ratePerMeter: number;
  validUntil: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface LabDipRequest {
  requestId: string;
  styleReference: string;
  fabricType: string;
  targetColor: string;
  supplierId: string;
  requestedDate: string;
  receivedDate?: string;
  testResults?: QCParameter[];
  status: 'requested' | 'received' | 'testing' | 'approved' | 'rejected';
}

export interface QualityInspection {
  grnReference: string;
  parameters: QCParameter[];
  decision: 'accepted' | 'rejected' | 'conditional';
  remarks: string;
  inspectedBy: string;
  inspectedAt: string;
}

export interface SizeBreakdown {
  size: string;
  qty: number;
}

export interface ColorBreakdown {
  color: string;
  qty: number;
}

export interface ProductionOrder {
  workOrderNo: string;
  workOrderDate: string;
  styleCode: string;
  productionUnit: string;
  startDate: string;
  targetCompletion: string;
  sizeBreakdown: SizeBreakdown[];
  colorBreakdown: ColorBreakdown[];
  totalQty: number;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface MaterialIssue {
  issueSlipNo: string;
  date: string;
  fromLocation: string;
  toLocation: string;
  workOrderRef: string;
  items: Array<{ item: string; qtyIssued: number; uom: string }>;
}

export interface WIPUpdate {
  date: string;
  cuttingDone: number;
  stitchingDone: number;
  finishingDone: number;
  packed: number;
  remarks: string;
}

export interface ProductionTracking {
  workOrderRef: string;
  updates: WIPUpdate[];
  status: 'on_track' | 'delayed' | 'completed';
}

export interface FinishedGoodsReceipt {
  fgReceiptNo: string;
  date: string;
  workOrder: string;
  style: string;
  totalQtyReceived: number;
  rejectedShort: number;
  location: string;
  sizeWiseReceipt: SizeBreakdown[];
}

export interface SalesOrderLine {
  style: string;
  size: string;
  color: string;
  qty: number;
  rate: number;
  amount: number;
}

export interface SalesOrder {
  soNo: string;
  soDate: string;
  customer: string;
  deliveryDate: string;
  paymentTerms: string;
  salesperson: string;
  lineItems: SalesOrderLine[];
  subTotal: number;
  gstPercent: number;
  gstAmount: number;
  grandTotal: number;
  status: 'pending' | 'confirmed' | 'partial_shipped' | 'completed';
}

export interface DeliveryChallan {
  dcNo: string;
  date: string;
  soReference: string;
  customer: string;
  shipTo: string;
  transporter: string;
  awbLrNo: string;
  noOfCartons: number;
  packedItems: SalesOrderLine[];
  status: 'pending' | 'shipped' | 'delivered';
}

export interface Invoice {
  invoiceNo: string;
  date: string;
  dcRef: string;
  soRef: string;
  customer: string;
  dueDate: string;
  amountDetails: {
    subTotal: number;
    gstAmount: number;
    grandTotal: number;
  };
  status: 'sent' | 'paid' | 'overdue' | 'cancelled';
}

export interface PaymentReceipt {
  receiptNo: string;
  date: string;
  customer: string;
  invoiceRef: string;
  amountReceived: number;
  mode: 'neft' | 'rtgs' | 'cheque' | 'cash' | 'other';
  bankRef?: string;
  invoiceStatus: 'paid' | 'partial_paid';
}

export interface Attachment {
  id: string;
  name: string;
  type: 'tech_pack' | 'design_sketch' | 'other';
  url: string;
  uploadedAt: string;
}

export interface StyleExtensions {
  pipeline: PipelineStep[];
  images: SampleImage[];
  approvals: ApprovalRecord[];
  bom: BOMLine[];
  tna: TNAMilestone[];
  preCosting: PreCosting;
  costingSheet?: CostingSheet;
  departmentProgress: DepartmentProgress[];
  materialChase: MaterialChase;
  emails: EmailThread[];
  currentPipelineStep: string;
  quantityTier?: 'small' | 'medium' | 'large' | 'bulk';
  quantityPriorityNote?: string;
  sampleWorkflow: SampleStage[];
  styleCode: string;
  styleName: string;
  category: string;
  season: string;
  brand: string;
  designerName: string;
  targetCost: number;
  targetMRP: number;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  attachments: Attachment[];
  vendor?: Vendor;
  purchaseRequisition?: PurchaseRequisition;
  purchaseOrder?: PurchaseOrder;
  goodsReceiptNote?: GoodsReceiptNote;
  qualityInspection?: QualityInspection;
  productionOrder?: ProductionOrder;
  materialIssue?: MaterialIssue;
  productionTracking?: ProductionTracking;
  finishedGoodsReceipt?: FinishedGoodsReceipt;
  salesOrder?: SalesOrder;
  deliveryChallan?: DeliveryChallan;
  invoice?: Invoice;
  paymentReceipt?: PaymentReceipt;
  fabricSupplier?: FabricSupplier;
  fabricQuotation?: FabricQuotation;
  labDipRequest?: LabDipRequest;
  [key: string]: unknown;
}

export const PIPELINE_STEP_DEFS = [
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
] as const;
