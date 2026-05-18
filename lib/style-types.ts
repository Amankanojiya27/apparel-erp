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
  item: string;
  category: 'fabric' | 'trim' | 'packing' | 'thread';
  consumptionPerGarment: number;
  unit: string;
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

export interface ManpowerPlan {
  department: string;
  requiredHours: number;
  availableHours: number;
  utilizationPercent: number;
  assignedWorkers: number;
  recommendation: string;
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

export interface StyleExtensions {
  pipeline: PipelineStep[];
  images: SampleImage[];
  approvals: ApprovalRecord[];
  bom: BOMLine[];
  tna: TNAMilestone[];
  preCosting: PreCosting;
  manpower: ManpowerPlan[];
  emails: EmailThread[];
  currentPipelineStep: string;
}

export const PIPELINE_STEP_DEFS = [
  { id: 'inquiry', label: 'Buyer Inquiry', department: 'Buying' },
  { id: 'assignment', label: 'Merchant Assignment', department: 'Merchandising' },
  { id: 'data_entry', label: 'ERP Data Entry', department: 'Merchandising' },
  { id: 'pre_costing', label: 'Pre-Costing', department: 'Merchandising' },
  { id: 'sampling', label: 'Sampling & Pattern', department: 'Sampling' },
  { id: 'buyer_approval', label: 'Buyer Approval', department: 'Buying' },
  { id: 'bom_mrp', label: 'BOM & MRP', department: 'Planning' },
  { id: 'cutting', label: 'Cutting', department: 'Cutting' },
  { id: 'production', label: 'Production', department: 'Sewing' },
  { id: 'finishing', label: 'Finishing', department: 'Finishing' },
  { id: 'packaging', label: 'Packaging', department: 'Packing' },
  { id: 'ex_factory', label: 'Ex-Factory / Delivery', department: 'Shipping' },
] as const;
