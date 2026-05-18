// File: models/Production.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduction extends Document {
  style: mongoose.Types.ObjectId;
  cuttingDays: number;
  productionDays: number;
  finishingDays: number;
  packagingDays: number;
  cuttingStartDate?: Date;
  cuttingEndDate?: Date;
  productionStartDate?: Date;
  productionEndDate?: Date;
  finishingStartDate?: Date;
  finishingEndDate?: Date;
  packagingStartDate?: Date;
  packagingEndDate?: Date;
  currentStage: 'pending' | 'cutting' | 'production' | 'finishing' | 'packaging' | 'completed';
  progress: number;
  dailyProgress: Array<{
    date: Date;
    stage: string;
    completedUnits: number;
    notes?: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductionSchema: Schema = new Schema(
  {
    style: {
      type: Schema.Types.ObjectId,
      ref: 'Style',
      required: true,
      unique: true,
    },
    cuttingDays: {
      type: Number,
      default: 3,
    },
    productionDays: {
      type: Number,
      default: 25,
    },
    finishingDays: {
      type: Number,
      default: 5,
    },
    packagingDays: {
      type: Number,
      default: 3,
    },
    cuttingStartDate: {
      type: Date,
    },
    cuttingEndDate: {
      type: Date,
    },
    productionStartDate: {
      type: Date,
    },
    productionEndDate: {
      type: Date,
    },
    finishingStartDate: {
      type: Date,
    },
    finishingEndDate: {
      type: Date,
    },
    packagingStartDate: {
      type: Date,
    },
    packagingEndDate: {
      type: Date,
    },
    currentStage: {
      type: String,
      enum: ['pending', 'cutting', 'production', 'finishing', 'packaging', 'completed'],
      default: 'pending',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    dailyProgress: [
      {
        date: {
          type: Date,
          required: true,
        },
        stage: {
          type: String,
          required: true,
        },
        completedUnits: {
          type: Number,
          default: 0,
        },
        notes: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Production: Model<IProduction> = mongoose.models.Production || mongoose.model<IProduction>('Production', ProductionSchema);

export default Production;
