'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Card, CardContent } from './Card';

interface InquiryEntryProps {
  onSubmit: (data: InquiryData) => void;
  onCancel: () => void;
}

export interface InquiryData {
  // Basic Buyer Info
  inquiryId: string;
  merchantName: string;
  buyerName: string;
  factoryUnit: string;
  season: string;
  brandLabel: string;
  
  // Product Specifications
  styleNumber: string;
  garmentType: string;
  styleDescription: string;
  productCategory: string;
  fabricComposition: string;
  fabricWeight: string;
  sizeRange: string;
  sampleSize: string;
  
  // Commercial & Timeline
  targetQty: string;
  inquiryDate: string;
  targetPrice: string;
  currency: string;
  techPackReceived: string;
  incoTerms: string;
  sampleDeadline: string;
  shipmentMode: string;
  targetShipDate: string;
  portOfLoading: string;
  formStatus: string;
  
  // Attachments & Remarks
  techPackFile?: File;
  styleSketch?: File;
  specialRemarks: string;
}

export function InquiryEntry({ onSubmit, onCancel }: InquiryEntryProps) {
  const [formData, setFormData] = useState({
    // Basic Buyer Info
    inquiryId: 'INQ-2026-00843',
    merchantName: '',
    buyerName: '',
    factoryUnit: '',
    season: '',
    brandLabel: '',
    
    // Product Specifications
    styleNumber: '',
    garmentType: '',
    styleDescription: '',
    productCategory: '',
    fabricComposition: '',
    fabricWeight: '',
    sizeRange: '',
    sampleSize: '',
    
    // Commercial & Timeline
    targetQty: '',
    inquiryDate: '',
    targetPrice: '',
    currency: 'USD',
    techPackReceived: '',
    incoTerms: '',
    sampleDeadline: '',
    shipmentMode: '',
    targetShipDate: '',
    portOfLoading: '',
    formStatus: 'draft',
    
    // Attachments & Remarks
    specialRemarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as InquiryData);
  };

  const field = (label: string, key: keyof typeof formData, type = 'text', required = true) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      />
    </div>
  );

  const selectField = (label: string, key: keyof typeof formData, options: string[], required = true) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData[key]}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const fileField = (label: string, key: string) => (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="file"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setFormData({ ...formData, [key]: file.name });
          }
        }}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-6">
      {/* Section 1: Basic Buyer Info */}
      <div className="border-b pb-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">1. BASIC BUYER INFO</h3>
        <div className="grid grid-cols-2 gap-4">
          {field('Inquiry ID', 'inquiryId', 'text', false)}
          {field('Merchant Name', 'merchantName')}
          {field('Buyer Name', 'buyerName')}
          {field('Factory Unit', 'factoryUnit')}
          {field('Season', 'season')}
          {field('Brand / Label', 'brandLabel')}
        </div>
      </div>

      {/* Section 2: Product Specifications */}
      <div className="border-b pb-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">2. PRODUCT SPECIFICATIONS</h3>
        <div className="grid grid-cols-2 gap-4">
          {field('Style Number', 'styleNumber')}
          {field('Garment Type', 'garmentType')}
          <div className="col-span-2">
            {field('Style Description', 'styleDescription')}
          </div>
          {field('Product Category', 'productCategory')}
          {field('Fabric Composition', 'fabricComposition')}
          {field('Fabric Weight (GSM)', 'fabricWeight', 'number')}
          {field('Size Range', 'sizeRange')}
          {field('Sample Size', 'sampleSize')}
        </div>
      </div>

      {/* Section 3: Commercial & Timeline */}
      <div className="border-b pb-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">3. COMMERCIAL & TIMELINE</h3>
        <div className="grid grid-cols-2 gap-4">
          {field('Target Qty (Pcs)', 'targetQty', 'number')}
          {field('Inquiry Date', 'inquiryDate', 'date')}
          {field('Target Price', 'targetPrice', 'number')}
          {selectField('Currency', 'currency', ['USD', 'EUR', 'GBP', 'INR', 'CNY'])}
          {selectField('Tech Pack Received', 'techPackReceived', ['Yes', 'No', 'Pending'])}
          {selectField('Inco Terms', 'incoTerms', ['FOB', 'CIF', 'EXW', 'DAP', 'DDP'])}
          {field('Sample Deadline', 'sampleDeadline', 'date')}
          {selectField('Shipment Mode', 'shipmentMode', ['Air', 'Sea', 'Road', 'Rail'])}
          {field('Target Ship Date', 'targetShipDate', 'date')}
          {field('Port of Loading', 'portOfLoading')}
          {selectField('Form Status', 'formStatus', ['draft', 'submitted', 'approved', 'rejected'], false)}
        </div>
      </div>

      {/* Section 4: Attachments & Remarks */}
      <div className="border-b pb-6">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">4. ATTACHMENTS & REMARKS</h3>
        <div className="grid grid-cols-2 gap-4">
          {fileField('Tech Pack File', 'techPackFile')}
          {fileField('Style Sketch', 'styleSketch')}
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-700">Special Remarks</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={formData.specialRemarks}
              onChange={(e) => setFormData({ ...formData, specialRemarks: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Proceed to Style Form
        </Button>
      </div>
    </form>
  );
}
