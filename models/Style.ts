// File: models/Style.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

const PipelineStepSchema = new Schema(
  {
    id: String,
    label: String,
    department: String,
    status: { type: String, enum: ['pending', 'active', 'completed', 'blocked'] },
    completedAt: Date,
    notes: String,
  },
  { _id: false }
);

const ImageSchema = new Schema(
  {
    url: String,
    label: String,
    type: { type: String, enum: ['proto', 'fit', 'production', 'techpack', 'other'] },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ApprovalSchema = new Schema(
  {
    stage: String,
    type: { type: String, enum: ['sample', 'costing', 'bom', 'shipment'] },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'revised'] },
    requestedBy: String,
    reviewedBy: String,
    comments: String,
    requestedAt: Date,
    reviewedAt: Date,
  },
  { _id: true }
);

const BOMSchema = new Schema(
  {
    item: String,
    category: { type: String, enum: ['fabric', 'trim', 'packing', 'thread'] },
    consumptionPerGarment: Number,
    unit: String,
    totalRequired: Number,
    inStock: Number,
    toProcure: Number,
  },
  { _id: false }
);

const TNASchema = new Schema(
  {
    id: String,
    name: String,
    plannedDate: Date,
    actualDate: Date,
    status: { type: String, enum: ['pending', 'on_track', 'delayed', 'completed'] },
    owner: String,
  },
  { _id: false }
);

const PreCostingSchema = new Schema(
  {
    fabricConsumption: Number,
    fabricRate: Number,
    trimCost: Number,
    cmCost: Number,
    commercialCost: Number,
    wastagePercent: Number,
    profitMarginPercent: Number,
    targetPrice: Number,
    quotedPrice: Number,
    currency: { type: String, default: 'USD' },
  },
  { _id: false }
);

const ManpowerSchema = new Schema(
  {
    department: String,
    requiredHours: Number,
    availableHours: Number,
    utilizationPercent: Number,
    assignedWorkers: Number,
    recommendation: String,
  },
  { _id: false }
);

const EmailSchema = new Schema(
  {
    from: String,
    to: String,
    subject: String,
    preview: String,
    linkedStep: String,
    receivedAt: Date,
    synced: Boolean,
  },
  { _id: true }
);

export interface IStyle extends Document {
  designNumber: string;
  buyerName: string;
  buyer: mongoose.Types.ObjectId;
  merchant: mongoose.Types.ObjectId;
  sampleType: 'proto' | 'fit' | 'production' | 'other';
  fabricDetails: {
    type: string;
    description: string;
    gsm: number;
    color: string;
  };
  rawMaterials: {
    buttonsPerGarment?: number;
    other?: string;
  };
  status: 'pending' | 'sampling' | 'approved' | 'production' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deliveryDate: Date;
  sampleDeadline: Date;
  quantity: number;
  currentPipelineStep?: string;
  pipeline?: Array<{
    id: string;
    label: string;
    department: string;
    status: string;
    completedAt?: Date;
    notes?: string;
  }>;
  images?: Array<{
    _id?: mongoose.Types.ObjectId;
    url: string;
    label: string;
    type: string;
    uploadedAt?: Date;
  }>;
  approvals?: Array<Record<string, unknown>>;
  bom?: Array<Record<string, unknown>>;
  tna?: Array<Record<string, unknown>>;
  preCosting?: Record<string, unknown>;
  manpower?: Array<Record<string, unknown>>;
  emails?: Array<Record<string, unknown>>;
  comments: Array<{
    user: string;
    text: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const StyleSchema: Schema = new Schema(
  {
    designNumber: { type: String, required: true, unique: true },
    buyerName: { type: String, required: true },
    buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    merchant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sampleType: {
      type: String,
      enum: ['proto', 'fit', 'production', 'other'],
      required: true,
    },
    fabricDetails: {
      type: { type: String, required: true },
      description: { type: String, required: true },
      gsm: { type: Number, required: true },
      color: { type: String, required: true },
    },
    rawMaterials: {
      buttonsPerGarment: Number,
      other: String,
    },
    status: {
      type: String,
      enum: ['pending', 'sampling', 'approved', 'production', 'completed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    deliveryDate: { type: Date, required: true },
    sampleDeadline: { type: Date, required: true },
    quantity: { type: Number, required: true, default: 0 },
    currentPipelineStep: String,
    pipeline: [PipelineStepSchema],
    images: [ImageSchema],
    approvals: [ApprovalSchema],
    bom: [BOMSchema],
    tna: [TNASchema],
    preCosting: PreCostingSchema,
    manpower: [ManpowerSchema],
    emails: [EmailSchema],
    comments: [
      {
        user: { type: String, required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

StyleSchema.index({ deliveryDate: 1, sampleDeadline: 1 });
StyleSchema.index({ status: 1 });
StyleSchema.index({ priority: 1 });

const Style: Model<IStyle> = mongoose.models.Style || mongoose.model<IStyle>('Style', StyleSchema);

export default Style;
