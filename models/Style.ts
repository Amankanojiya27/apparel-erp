// File: models/Style.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

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
    designNumber: {
      type: String,
      required: true,
      unique: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    merchant: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sampleType: {
      type: String,
      enum: ['proto', 'fit', 'production', 'other'],
      required: true,
    },
    fabricDetails: {
      type: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      gsm: {
        type: Number,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
    },
    rawMaterials: {
      buttonsPerGarment: {
        type: Number,
      },
      other: {
        type: String,
      },
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
    deliveryDate: {
      type: Date,
      required: true,
    },
    sampleDeadline: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: [
      {
        user: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
StyleSchema.index({ deliveryDate: 1, sampleDeadline: 1 });
StyleSchema.index({ status: 1 });
StyleSchema.index({ priority: 1 });

const Style: Model<IStyle> = mongoose.models.Style || mongoose.model<IStyle>('Style', StyleSchema);

export default Style;
