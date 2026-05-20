// File: lib/merchant-store.ts
// In-memory store for Merchant Department ERP data management

import type {
  BuyerMaster,
  SeasonMaster,
  BrandMaster,
  InquiryRangePlan,
  CostSheet,
  Quotation,
  SampleRequest,
  SampleTracking,
  SampleApproval,
  SampleTracker,
  BuyerPurchaseOrder,
  InternalWorkOrder,
  TechPack,
  FabricRequirement,
  FabricPurchaseOrder,
  LabDipApproval,
  FabricGRN,
  TrimRequirement,
  TrimPurchaseOrder,
  TrimApproval,
  CriticalPathManagement,
  PPMeetingRecord,
  CutOrder,
  ProductionTrackingRecord,
  InlineQC,
  MidlineEndlineInspection,
  FinalInspection,
  TestingRequirement,
  ComplianceChecklist,
  PackingInstruction,
  PackingList,
  ShipmentPlanning,
  ExportDocuments,
  InvoiceToBuyer,
  ShipmentTracking,
  BuyerFeedback,
  PaymentFollowUp,
  ManagementDashboard,
  MerchantERPFlow,
} from './merchant-types';

// ============================================================================
// DATA STORE
// ============================================================================

class MerchantERPStore {
  // Phase 1: Buyer/Brand Onboarding
  private buyers: Map<string, BuyerMaster> = new Map();
  private seasons: Map<string, SeasonMaster> = new Map();
  private brands: Map<string, BrandMaster> = new Map();

  // Phase 2: Inquiry/Range Plan
  private inquiries: Map<string, InquiryRangePlan> = new Map();

  // Phase 3: Costing
  private costSheets: Map<string, CostSheet> = new Map();
  private quotations: Map<string, Quotation> = new Map();

  // Phase 4: Sample Development
  private sampleRequests: Map<string, SampleRequest> = new Map();
  private sampleTracking: Map<string, SampleTracking> = new Map();
  private sampleApprovals: Map<string, SampleApproval> = new Map();
  private sampleTrackers: Map<string, SampleTracker> = new Map();

  // Phase 5: Order Confirmation
  private buyerPOs: Map<string, BuyerPurchaseOrder> = new Map();
  private internalWorkOrders: Map<string, InternalWorkOrder> = new Map();

  // Phase 6: Tech Pack
  private techPacks: Map<string, TechPack> = new Map();

  // Phase 7: Raw Material Planning
  private fabricRequirements: Map<string, FabricRequirement> = new Map();
  private fabricPOs: Map<string, FabricPurchaseOrder> = new Map();
  private labDipApprovals: Map<string, LabDipApproval> = new Map();
  private fabricGRNs: Map<string, FabricGRN> = new Map();
  private trimRequirements: Map<string, TrimRequirement> = new Map();
  private trimPOs: Map<string, TrimPurchaseOrder> = new Map();
  private trimApprovals: Map<string, TrimApproval> = new Map();

  // Phase 8: Production Planning
  private cpmRecords: Map<string, CriticalPathManagement> = new Map();
  private ppMeetings: Map<string, PPMeetingRecord> = new Map();
  private cutOrders: Map<string, CutOrder> = new Map();
  private productionTracking: Map<string, ProductionTrackingRecord> = new Map();

  // Phase 9: Quality Control
  private inlineQCs: Map<string, InlineQC> = new Map();
  private midlineEndlineInspections: Map<string, MidlineEndlineInspection> = new Map();
  private finalInspections: Map<string, FinalInspection> = new Map();

  // Phase 10: Compliance & Testing
  private testingRequirements: Map<string, TestingRequirement> = new Map();
  private complianceChecklists: Map<string, ComplianceChecklist> = new Map();

  // Phase 11: Packing & Shipment
  private packingInstructions: Map<string, PackingInstruction> = new Map();
  private packingLists: Map<string, PackingList> = new Map();
  private shipmentPlannings: Map<string, ShipmentPlanning> = new Map();

  // Phase 12: Documentation & Invoicing
  private exportDocuments: Map<string, ExportDocuments> = new Map();
  private invoices: Map<string, InvoiceToBuyer> = new Map();

  // Phase 13: Post-Shipment
  private shipmentTracking: Map<string, ShipmentTracking> = new Map();
  private buyerFeedbacks: Map<string, BuyerFeedback> = new Map();
  private paymentFollowUps: Map<string, PaymentFollowUp> = new Map();

  // Complete ERP Flows (interconnected by style reference)
  private erpFlows: Map<string, MerchantERPFlow> = new Map();

  // ============================================================================
  // PHASE 1: BUYER/BRAND ONBOARDING
  // ============================================================================

  createBuyer(buyer: Omit<BuyerMaster, 'buyerId' | 'createdAt' | 'updatedAt'>): BuyerMaster {
    const buyerId = `BUY-${Date.now()}`;
    const now = new Date().toISOString();
    const newBuyer: BuyerMaster = {
      ...buyer,
      buyerId,
      createdAt: now,
      updatedAt: now,
    };
    this.buyers.set(buyerId, newBuyer);
    return newBuyer;
  }

  getBuyer(buyerId: string): BuyerMaster | undefined {
    return this.buyers.get(buyerId);
  }

  getAllBuyers(): BuyerMaster[] {
    return Array.from(this.buyers.values());
  }

  updateBuyer(buyerId: string, updates: Partial<BuyerMaster>): BuyerMaster | null {
    const buyer = this.buyers.get(buyerId);
    if (!buyer) return null;
    const updated = { ...buyer, ...updates, updatedAt: new Date().toISOString() };
    this.buyers.set(buyerId, updated);
    return updated;
  }

  deleteBuyer(buyerId: string): boolean {
    return this.buyers.delete(buyerId);
  }

  createSeason(season: Omit<SeasonMaster, 'seasonId' | 'createdAt'>): SeasonMaster {
    const seasonId = `SEA-${Date.now()}`;
    const now = new Date().toISOString();
    const newSeason: SeasonMaster = {
      ...season,
      seasonId,
      createdAt: now,
    };
    this.seasons.set(seasonId, newSeason);
    return newSeason;
  }

  getSeason(seasonId: string): SeasonMaster | undefined {
    return this.seasons.get(seasonId);
  }

  getAllSeasons(): SeasonMaster[] {
    return Array.from(this.seasons.values());
  }

  updateSeason(seasonId: string, updates: Partial<SeasonMaster>): SeasonMaster | null {
    const season = this.seasons.get(seasonId);
    if (!season) return null;
    const updated = { ...season, ...updates };
    this.seasons.set(seasonId, updated);
    return updated;
  }

  createBrand(brand: Omit<BrandMaster, 'brandId' | 'createdAt'>): BrandMaster {
    const brandId = `BRD-${Date.now()}`;
    const now = new Date().toISOString();
    const newBrand: BrandMaster = {
      ...brand,
      brandId,
      createdAt: now,
    };
    this.brands.set(brandId, newBrand);
    return newBrand;
  }

  getBrand(brandId: string): BrandMaster | undefined {
    return this.brands.get(brandId);
  }

  getAllBrands(): BrandMaster[] {
    return Array.from(this.brands.values());
  }

  updateBrand(brandId: string, updates: Partial<BrandMaster>): BrandMaster | null {
    const brand = this.brands.get(brandId);
    if (!brand) return null;
    const updated = { ...brand, ...updates };
    this.brands.set(brandId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 2: INQUIRY/RANGE PLAN
  // ============================================================================

  createInquiry(inquiry: Omit<InquiryRangePlan, 'inquiryId' | 'inquiryNumber' | 'createdAt' | 'updatedAt'>): InquiryRangePlan {
    const inquiryId = `INQ-${Date.now()}`;
    const inquiryNumber = `INQ-${new Date().getFullYear()}-${String(this.inquiries.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newInquiry: InquiryRangePlan = {
      ...inquiry,
      inquiryId,
      inquiryNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.inquiries.set(inquiryId, newInquiry);
    return newInquiry;
  }

  getInquiry(inquiryId: string): InquiryRangePlan | undefined {
    return this.inquiries.get(inquiryId);
  }

  getAllInquiries(): InquiryRangePlan[] {
    return Array.from(this.inquiries.values());
  }

  updateInquiry(inquiryId: string, updates: Partial<InquiryRangePlan>): InquiryRangePlan | null {
    const inquiry = this.inquiries.get(inquiryId);
    if (!inquiry) return null;
    const updated = { ...inquiry, ...updates, updatedAt: new Date().toISOString() };
    this.inquiries.set(inquiryId, updated);
    return updated;
  }

  deleteInquiry(inquiryId: string): boolean {
    return this.inquiries.delete(inquiryId);
  }

  // ============================================================================
  // PHASE 3: COSTING
  // ============================================================================

  createCostSheet(costSheet: Omit<CostSheet, 'costSheetId' | 'costSheetNumber' | 'createdAt' | 'updatedAt'>): CostSheet {
    const costSheetId = `CST-${Date.now()}`;
    const costSheetNumber = `CST-${new Date().getFullYear()}-${String(this.costSheets.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newCostSheet: CostSheet = {
      ...costSheet,
      costSheetId,
      costSheetNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.costSheets.set(costSheetId, newCostSheet);
    return newCostSheet;
  }

  getCostSheet(costSheetId: string): CostSheet | undefined {
    return this.costSheets.get(costSheetId);
  }

  getAllCostSheets(): CostSheet[] {
    return Array.from(this.costSheets.values());
  }

  updateCostSheet(costSheetId: string, updates: Partial<CostSheet>): CostSheet | null {
    const costSheet = this.costSheets.get(costSheetId);
    if (!costSheet) return null;
    const updated = { ...costSheet, ...updates, updatedAt: new Date().toISOString() };
    this.costSheets.set(costSheetId, updated);
    return updated;
  }

  createQuotation(quotation: Omit<Quotation, 'quotationId' | 'quotationNumber' | 'createdAt' | 'updatedAt'>): Quotation {
    const quotationId = `QT-${Date.now()}`;
    const quotationNumber = `QT-${new Date().getFullYear()}-${String(this.quotations.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newQuotation: Quotation = {
      ...quotation,
      quotationId,
      quotationNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.quotations.set(quotationId, newQuotation);
    return newQuotation;
  }

  getQuotation(quotationId: string): Quotation | undefined {
    return this.quotations.get(quotationId);
  }

  getAllQuotations(): Quotation[] {
    return Array.from(this.quotations.values());
  }

  updateQuotation(quotationId: string, updates: Partial<Quotation>): Quotation | null {
    const quotation = this.quotations.get(quotationId);
    if (!quotation) return null;
    const updated = { ...quotation, ...updates, updatedAt: new Date().toISOString() };
    this.quotations.set(quotationId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 4: SAMPLE DEVELOPMENT
  // ============================================================================

  createSampleRequest(sampleRequest: Omit<SampleRequest, 'sampleRequestId' | 'sampleRequestNumber' | 'createdAt' | 'updatedAt'>): SampleRequest {
    const sampleRequestId = `SMP-REQ-${Date.now()}`;
    const sampleRequestNumber = `SMP-${new Date().getFullYear()}-${String(this.sampleRequests.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newRequest: SampleRequest = {
      ...sampleRequest,
      sampleRequestId,
      sampleRequestNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.sampleRequests.set(sampleRequestId, newRequest);
    return newRequest;
  }

  getSampleRequest(sampleRequestId: string): SampleRequest | undefined {
    return this.sampleRequests.get(sampleRequestId);
  }

  getAllSampleRequests(): SampleRequest[] {
    return Array.from(this.sampleRequests.values());
  }

  updateSampleRequest(sampleRequestId: string, updates: Partial<SampleRequest>): SampleRequest | null {
    const request = this.sampleRequests.get(sampleRequestId);
    if (!request) return null;
    const updated = { ...request, ...updates, updatedAt: new Date().toISOString() };
    this.sampleRequests.set(sampleRequestId, updated);
    return updated;
  }

  deleteSampleRequest(sampleRequestId: string): boolean {
    return this.sampleRequests.delete(sampleRequestId);
  }

  createSampleTracking(tracking: Omit<SampleTracking, 'sampleTrackingId' | 'updatedAt'>): SampleTracking {
    const sampleTrackingId = `SMP-TRK-${Date.now()}`;
    const newTracking: SampleTracking = {
      ...tracking,
      sampleTrackingId,
      updatedAt: new Date().toISOString(),
    };
    this.sampleTracking.set(sampleTrackingId, newTracking);
    return newTracking;
  }

  getSampleTracking(sampleTrackingId: string): SampleTracking | undefined {
    return this.sampleTracking.get(sampleTrackingId);
  }

  getAllSampleTracking(): SampleTracking[] {
    return Array.from(this.sampleTracking.values());
  }

  updateSampleTracking(sampleTrackingId: string, updates: Partial<SampleTracking>): SampleTracking | null {
    const tracking = this.sampleTracking.get(sampleTrackingId);
    if (!tracking) return null;
    const updated = { ...tracking, ...updates, updatedAt: new Date().toISOString() };
    this.sampleTracking.set(sampleTrackingId, updated);
    return updated;
  }

  createSampleApproval(approval: Omit<SampleApproval, 'sampleApprovalId' | 'createdAt' | 'updatedAt'>): SampleApproval {
    const sampleApprovalId = `SMP-APR-${Date.now()}`;
    const now = new Date().toISOString();
    const newApproval: SampleApproval = {
      ...approval,
      sampleApprovalId,
      createdAt: now,
      updatedAt: now,
    };
    this.sampleApprovals.set(sampleApprovalId, newApproval);
    return newApproval;
  }

  getSampleApproval(sampleApprovalId: string): SampleApproval | undefined {
    return this.sampleApprovals.get(sampleApprovalId);
  }

  getAllSampleApprovals(): SampleApproval[] {
    return Array.from(this.sampleApprovals.values());
  }

  updateSampleApproval(sampleApprovalId: string, updates: Partial<SampleApproval>): SampleApproval | null {
    const approval = this.sampleApprovals.get(sampleApprovalId);
    if (!approval) return null;
    const updated = { ...approval, ...updates, updatedAt: new Date().toISOString() };
    this.sampleApprovals.set(sampleApprovalId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 5: ORDER CONFIRMATION
  // ============================================================================

  createBuyerPO(po: Omit<BuyerPurchaseOrder, 'buyerPOId' | 'createdAt' | 'updatedAt'>): BuyerPurchaseOrder {
    const buyerPOId = `PO-${Date.now()}`;
    const now = new Date().toISOString();
    const newPO: BuyerPurchaseOrder = {
      ...po,
      buyerPOId,
      createdAt: now,
      updatedAt: now,
    };
    this.buyerPOs.set(buyerPOId, newPO);
    return newPO;
  }

  getBuyerPO(buyerPOId: string): BuyerPurchaseOrder | undefined {
    return this.buyerPOs.get(buyerPOId);
  }

  getAllBuyerPOs(): BuyerPurchaseOrder[] {
    return Array.from(this.buyerPOs.values());
  }

  updateBuyerPO(buyerPOId: string, updates: Partial<BuyerPurchaseOrder>): BuyerPurchaseOrder | null {
    const po = this.buyerPOs.get(buyerPOId);
    if (!po) return null;
    const updated = { ...po, ...updates, updatedAt: new Date().toISOString() };
    this.buyerPOs.set(buyerPOId, updated);
    return updated;
  }

  createInternalWorkOrder(wo: Omit<InternalWorkOrder, 'workOrderId' | 'internalOrderNumber' | 'createdAt' | 'updatedAt'>): InternalWorkOrder {
    const workOrderId = `WO-${Date.now()}`;
    const internalOrderNumber = `IWO-${new Date().getFullYear()}-${String(this.internalWorkOrders.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newWO: InternalWorkOrder = {
      ...wo,
      workOrderId,
      internalOrderNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.internalWorkOrders.set(workOrderId, newWO);
    return newWO;
  }

  getInternalWorkOrder(workOrderId: string): InternalWorkOrder | undefined {
    return this.internalWorkOrders.get(workOrderId);
  }

  getAllInternalWorkOrders(): InternalWorkOrder[] {
    return Array.from(this.internalWorkOrders.values());
  }

  updateInternalWorkOrder(workOrderId: string, updates: Partial<InternalWorkOrder>): InternalWorkOrder | null {
    const wo = this.internalWorkOrders.get(workOrderId);
    if (!wo) return null;
    const updated = { ...wo, ...updates, updatedAt: new Date().toISOString() };
    this.internalWorkOrders.set(workOrderId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 6: TECH PACK
  // ============================================================================

  createTechPack(techPack: Omit<TechPack, 'techPackId' | 'techPackNumber' | 'createdAt' | 'updatedAt'>): TechPack {
    const techPackId = `TP-${Date.now()}`;
    const techPackNumber = `TP-${new Date().getFullYear()}-${String(this.techPacks.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newTechPack: TechPack = {
      ...techPack,
      techPackId,
      techPackNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.techPacks.set(techPackId, newTechPack);
    return newTechPack;
  }

  getTechPack(techPackId: string): TechPack | undefined {
    return this.techPacks.get(techPackId);
  }

  getBuyerFeedback(feedbackId: string): BuyerFeedback | undefined {
    return this.buyerFeedbacks.get(feedbackId);
  }

  getAllBuyerFeedbacks(): BuyerFeedback[] {
    return Array.from(this.buyerFeedbacks.values());
  }

  updateBuyerFeedback(feedbackId: string, updates: Partial<BuyerFeedback>): BuyerFeedback | null {
    const feedback = this.buyerFeedbacks.get(feedbackId);
    if (!feedback) return null;
    const updated = { ...feedback, ...updates, updatedAt: new Date().toISOString() };
    this.buyerFeedbacks.set(feedbackId, updated);
    return updated;
  }

  getAllTechPacks(): TechPack[] {
    return Array.from(this.techPacks.values());
  }

  updateTechPack(techPackId: string, updates: Partial<TechPack>): TechPack | null {
    const techPack = this.techPacks.get(techPackId);
    if (!techPack) return null;
    const updated = { ...techPack, ...updates, updatedAt: new Date().toISOString() };
    this.techPacks.set(techPackId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 7: RAW MATERIAL PLANNING
  // ============================================================================

  createFabricRequirement(requirement: Omit<FabricRequirement, 'fabricRequirementId' | 'createdAt' | 'updatedAt'>): FabricRequirement {
    const fabricRequirementId = `FAB-REQ-${Date.now()}`;
    const now = new Date().toISOString();
    const newRequirement: FabricRequirement = {
      ...requirement,
      fabricRequirementId,
      createdAt: now,
      updatedAt: now,
    };
    this.fabricRequirements.set(fabricRequirementId, newRequirement);
    return newRequirement;
  }

  getFabricRequirement(fabricRequirementId: string): FabricRequirement | undefined {
    return this.fabricRequirements.get(fabricRequirementId);
  }

  getAllFabricRequirements(): FabricRequirement[] {
    return Array.from(this.fabricRequirements.values());
  }

  updateFabricRequirement(fabricRequirementId: string, updates: Partial<FabricRequirement>): FabricRequirement | null {
    const requirement = this.fabricRequirements.get(fabricRequirementId);
    if (!requirement) return null;
    const updated = { ...requirement, ...updates, updatedAt: new Date().toISOString() };
    this.fabricRequirements.set(fabricRequirementId, updated);
    return updated;
  }

  createFabricPO(po: Omit<FabricPurchaseOrder, 'fabricPOId' | 'fabricPONumber' | 'createdAt' | 'updatedAt'>): FabricPurchaseOrder {
    const fabricPOId = `FAB-PO-${Date.now()}`;
    const fabricPONumber = `FPO-${new Date().getFullYear()}-${String(this.fabricPOs.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newPO: FabricPurchaseOrder = {
      ...po,
      fabricPOId,
      fabricPONumber,
      createdAt: now,
      updatedAt: now,
    };
    this.fabricPOs.set(fabricPOId, newPO);
    return newPO;
  }

  getFabricPO(fabricPOId: string): FabricPurchaseOrder | undefined {
    return this.fabricPOs.get(fabricPOId);
  }

  getAllFabricPOs(): FabricPurchaseOrder[] {
    return Array.from(this.fabricPOs.values());
  }

  updateFabricPO(fabricPOId: string, updates: Partial<FabricPurchaseOrder>): FabricPurchaseOrder | null {
    const po = this.fabricPOs.get(fabricPOId);
    if (!po) return null;
    const updated = { ...po, ...updates, updatedAt: new Date().toISOString() };
    this.fabricPOs.set(fabricPOId, updated);
    return updated;
  }

  createLabDipApproval(labDip: Omit<LabDipApproval, 'labDipId' | 'labDipNumber' | 'createdAt' | 'updatedAt'>): LabDipApproval {
    const labDipId = `LD-${Date.now()}`;
    const labDipNumber = `LD-${new Date().getFullYear()}-${String(this.labDipApprovals.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newLabDip: LabDipApproval = {
      ...labDip,
      labDipId,
      labDipNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.labDipApprovals.set(labDipId, newLabDip);
    return newLabDip;
  }

  getLabDipApproval(labDipId: string): LabDipApproval | undefined {
    return this.labDipApprovals.get(labDipId);
  }

  getAllLabDipApprovals(): LabDipApproval[] {
    return Array.from(this.labDipApprovals.values());
  }

  updateLabDipApproval(labDipId: string, updates: Partial<LabDipApproval>): LabDipApproval | null {
    const labDip = this.labDipApprovals.get(labDipId);
    if (!labDip) return null;
    const updated = { ...labDip, ...updates, updatedAt: new Date().toISOString() };
    this.labDipApprovals.set(labDipId, updated);
    return updated;
  }

  createFabricGRN(grn: Omit<FabricGRN, 'fabricGRNId' | 'grnNumber' | 'createdAt' | 'updatedAt'>): FabricGRN {
    const fabricGRNId = `FAB-GRN-${Date.now()}`;
    const grnNumber = `GRN-${new Date().getFullYear()}-${String(this.fabricGRNs.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newGRN: FabricGRN = {
      ...grn,
      fabricGRNId,
      grnNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.fabricGRNs.set(fabricGRNId, newGRN);
    return newGRN;
  }

  getFabricGRN(fabricGRNId: string): FabricGRN | undefined {
    return this.fabricGRNs.get(fabricGRNId);
  }

  getAllFabricGRNs(): FabricGRN[] {
    return Array.from(this.fabricGRNs.values());
  }

  updateFabricGRN(fabricGRNId: string, updates: Partial<FabricGRN>): FabricGRN | null {
    const grn = this.fabricGRNs.get(fabricGRNId);
    if (!grn) return null;
    const updated = { ...grn, ...updates, updatedAt: new Date().toISOString() };
    this.fabricGRNs.set(fabricGRNId, updated);
    return updated;
  }

  createTrimRequirement(requirement: Omit<TrimRequirement, 'trimRequirementId' | 'createdAt' | 'updatedAt'>): TrimRequirement {
    const trimRequirementId = `TRM-REQ-${Date.now()}`;
    const now = new Date().toISOString();
    const newRequirement: TrimRequirement = {
      ...requirement,
      trimRequirementId,
      createdAt: now,
      updatedAt: now,
    };
    this.trimRequirements.set(trimRequirementId, newRequirement);
    return newRequirement;
  }

  getTrimRequirement(trimRequirementId: string): TrimRequirement | undefined {
    return this.trimRequirements.get(trimRequirementId);
  }

  getAllTrimRequirements(): TrimRequirement[] {
    return Array.from(this.trimRequirements.values());
  }

  updateTrimRequirement(trimRequirementId: string, updates: Partial<TrimRequirement>): TrimRequirement | null {
    const requirement = this.trimRequirements.get(trimRequirementId);
    if (!requirement) return null;
    const updated = { ...requirement, ...updates, updatedAt: new Date().toISOString() };
    this.trimRequirements.set(trimRequirementId, updated);
    return updated;
  }

  createTrimPO(po: Omit<TrimPurchaseOrder, 'trimPOId' | 'trimPONumber' | 'createdAt' | 'updatedAt'>): TrimPurchaseOrder {
    const trimPOId = `TRM-PO-${Date.now()}`;
    const trimPONumber = `TPO-${new Date().getFullYear()}-${String(this.trimPOs.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newPO: TrimPurchaseOrder = {
      ...po,
      trimPOId,
      trimPONumber,
      createdAt: now,
      updatedAt: now,
    };
    this.trimPOs.set(trimPOId, newPO);
    return newPO;
  }

  getTrimPO(trimPOId: string): TrimPurchaseOrder | undefined {
    return this.trimPOs.get(trimPOId);
  }

  getAllTrimPOs(): TrimPurchaseOrder[] {
    return Array.from(this.trimPOs.values());
  }

  updateTrimPO(trimPOId: string, updates: Partial<TrimPurchaseOrder>): TrimPurchaseOrder | null {
    const po = this.trimPOs.get(trimPOId);
    if (!po) return null;
    const updated = { ...po, ...updates, updatedAt: new Date().toISOString() };
    this.trimPOs.set(trimPOId, updated);
    return updated;
  }

  createTrimApproval(approval: Omit<TrimApproval, 'trimApprovalId' | 'createdAt' | 'updatedAt'>): TrimApproval {
    const trimApprovalId = `TRM-APR-${Date.now()}`;
    const now = new Date().toISOString();
    const newApproval: TrimApproval = {
      ...approval,
      trimApprovalId,
      createdAt: now,
      updatedAt: now,
    };
    this.trimApprovals.set(trimApprovalId, newApproval);
    return newApproval;
  }

  getTrimApproval(trimApprovalId: string): TrimApproval | undefined {
    return this.trimApprovals.get(trimApprovalId);
  }

  getAllTrimApprovals(): TrimApproval[] {
    return Array.from(this.trimApprovals.values());
  }

  updateTrimApproval(trimApprovalId: string, updates: Partial<TrimApproval>): TrimApproval | null {
    const approval = this.trimApprovals.get(trimApprovalId);
    if (!approval) return null;
    const updated = { ...approval, ...updates, updatedAt: new Date().toISOString() };
    this.trimApprovals.set(trimApprovalId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 8: PRODUCTION PLANNING
  // ============================================================================

  createCPM(cpm: Omit<CriticalPathManagement, 'cpmId' | 'createdAt' | 'updatedAt'>): CriticalPathManagement {
    const cpmId = `CPM-${Date.now()}`;
    const now = new Date().toISOString();
    const newCPM: CriticalPathManagement = {
      ...cpm,
      cpmId,
      createdAt: now,
      updatedAt: now,
    };
    this.cpmRecords.set(cpmId, newCPM);
    return newCPM;
  }

  getCPM(cpmId: string): CriticalPathManagement | undefined {
    return this.cpmRecords.get(cpmId);
  }

  getAllCPMs(): CriticalPathManagement[] {
    return Array.from(this.cpmRecords.values());
  }

  updateCPM(cpmId: string, updates: Partial<CriticalPathManagement>): CriticalPathManagement | null {
    const cpm = this.cpmRecords.get(cpmId);
    if (!cpm) return null;
    const updated = { ...cpm, ...updates, updatedAt: new Date().toISOString() };
    this.cpmRecords.set(cpmId, updated);
    return updated;
  }

  createPPMeeting(meeting: Omit<PPMeetingRecord, 'ppMeetingId' | 'createdAt' | 'updatedAt'>): PPMeetingRecord {
    const ppMeetingId = `PPM-${Date.now()}`;
    const now = new Date().toISOString();
    const newMeeting: PPMeetingRecord = {
      ...meeting,
      ppMeetingId,
      createdAt: now,
      updatedAt: now,
    };
    this.ppMeetings.set(ppMeetingId, newMeeting);
    return newMeeting;
  }

  getPPMeeting(ppMeetingId: string): PPMeetingRecord | undefined {
    return this.ppMeetings.get(ppMeetingId);
  }

  getAllPPMeetings(): PPMeetingRecord[] {
    return Array.from(this.ppMeetings.values());
  }

  updatePPMeeting(ppMeetingId: string, updates: Partial<PPMeetingRecord>): PPMeetingRecord | null {
    const meeting = this.ppMeetings.get(ppMeetingId);
    if (!meeting) return null;
    const updated = { ...meeting, ...updates, updatedAt: new Date().toISOString() };
    this.ppMeetings.set(ppMeetingId, updated);
    return updated;
  }

  createCutOrder(cutOrder: Omit<CutOrder, 'cutOrderId' | 'cutOrderNumber' | 'createdAt' | 'updatedAt'>): CutOrder {
    const cutOrderId = `CO-${Date.now()}`;
    const cutOrderNumber = `CO-${new Date().getFullYear()}-${String(this.cutOrders.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newCutOrder: CutOrder = {
      ...cutOrder,
      cutOrderId,
      cutOrderNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.cutOrders.set(cutOrderId, newCutOrder);
    return newCutOrder;
  }

  getCutOrder(cutOrderId: string): CutOrder | undefined {
    return this.cutOrders.get(cutOrderId);
  }

  getAllCutOrders(): CutOrder[] {
    return Array.from(this.cutOrders.values());
  }

  updateCutOrder(cutOrderId: string, updates: Partial<CutOrder>): CutOrder | null {
    const cutOrder = this.cutOrders.get(cutOrderId);
    if (!cutOrder) return null;
    const updated = { ...cutOrder, ...updates, updatedAt: new Date().toISOString() };
    this.cutOrders.set(cutOrderId, updated);
    return updated;
  }

  createProductionTracking(tracking: Omit<ProductionTrackingRecord, 'productionTrackingId' | 'createdAt' | 'updatedAt'>): ProductionTrackingRecord {
    const productionTrackingId = `PROD-TRK-${Date.now()}`;
    const now = new Date().toISOString();
    const newTracking: ProductionTrackingRecord = {
      ...tracking,
      productionTrackingId,
      createdAt: now,
      updatedAt: now,
    };
    this.productionTracking.set(productionTrackingId, newTracking);
    return newTracking;
  }

  getProductionTracking(productionTrackingId: string): ProductionTrackingRecord | undefined {
    return this.productionTracking.get(productionTrackingId);
  }

  getAllProductionTrackings(): ProductionTrackingRecord[] {
    return Array.from(this.productionTracking.values());
  }

  updateProductionTracking(productionTrackingId: string, updates: Partial<ProductionTrackingRecord>): ProductionTrackingRecord | null {
    const tracking = this.productionTracking.get(productionTrackingId);
    if (!tracking) return null;
    const updated = { ...tracking, ...updates, updatedAt: new Date().toISOString() };
    this.productionTracking.set(productionTrackingId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 9: QUALITY CONTROL
  // ============================================================================

  createInlineQC(qc: Omit<InlineQC, 'inlineQCId' | 'createdAt'>): InlineQC {
    const inlineQCId = `IQC-${Date.now()}`;
    const newQC: InlineQC = {
      ...qc,
      inlineQCId,
      createdAt: new Date().toISOString(),
    };
    this.inlineQCs.set(inlineQCId, newQC);
    return newQC;
  }

  getInlineQC(inlineQCId: string): InlineQC | undefined {
    return this.inlineQCs.get(inlineQCId);
  }

  getAllInlineQCs(): InlineQC[] {
    return Array.from(this.inlineQCs.values());
  }

  updateInlineQC(inlineQCId: string, updates: Partial<InlineQC>): InlineQC | null {
    const qc = this.inlineQCs.get(inlineQCId);
    if (!qc) return null;
    const updated = { ...qc, ...updates };
    this.inlineQCs.set(inlineQCId, updated);
    return updated;
  }

  createMidlineEndlineInspection(inspection: Omit<MidlineEndlineInspection, 'inspectionId' | 'createdAt'>): MidlineEndlineInspection {
    const inspectionId = `MEI-${Date.now()}`;
    const newInspection: MidlineEndlineInspection = {
      ...inspection,
      inspectionId,
      createdAt: new Date().toISOString(),
    };
    this.midlineEndlineInspections.set(inspectionId, newInspection);
    return newInspection;
  }

  getMidlineEndlineInspection(inspectionId: string): MidlineEndlineInspection | undefined {
    return this.midlineEndlineInspections.get(inspectionId);
  }

  getAllMidlineEndlineInspections(): MidlineEndlineInspection[] {
    return Array.from(this.midlineEndlineInspections.values());
  }

  updateMidlineEndlineInspection(inspectionId: string, updates: Partial<MidlineEndlineInspection>): MidlineEndlineInspection | null {
    const inspection = this.midlineEndlineInspections.get(inspectionId);
    if (!inspection) return null;
    const updated = { ...inspection, ...updates };
    this.midlineEndlineInspections.set(inspectionId, updated);
    return updated;
  }

  createFinalInspection(inspection: Omit<FinalInspection, 'finalInspectionId' | 'fiNumber' | 'createdAt' | 'updatedAt'>): FinalInspection {
    const finalInspectionId = `FI-${Date.now()}`;
    const fiNumber = `FI-${new Date().getFullYear()}-${String(this.finalInspections.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newInspection: FinalInspection = {
      ...inspection,
      finalInspectionId,
      fiNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.finalInspections.set(finalInspectionId, newInspection);
    return newInspection;
  }

  getFinalInspection(finalInspectionId: string): FinalInspection | undefined {
    return this.finalInspections.get(finalInspectionId);
  }

  getPackingInstruction(packingInstructionId: string): PackingInstruction | undefined {
    return this.packingInstructions.get(packingInstructionId);
  }

  getAllPackingInstructions(): PackingInstruction[] {
    return Array.from(this.packingInstructions.values());
  }

  updatePackingInstruction(packingInstructionId: string, updates: Partial<PackingInstruction>): PackingInstruction | null {
    const instruction = this.packingInstructions.get(packingInstructionId);
    if (!instruction) return null;
    const updated = { ...instruction, ...updates, updatedAt: new Date().toISOString() };
    this.packingInstructions.set(packingInstructionId, updated);
    return updated;
  }

  getAllFinalInspections(): FinalInspection[] {
    return Array.from(this.finalInspections.values());
  }

  updateFinalInspection(finalInspectionId: string, updates: Partial<FinalInspection>): FinalInspection | null {
    const inspection = this.finalInspections.get(finalInspectionId);
    if (!inspection) return null;
    const updated = { ...inspection, ...updates, updatedAt: new Date().toISOString() };
    this.finalInspections.set(finalInspectionId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 10: COMPLIANCE & TESTING
  // ============================================================================

  createTestingRequirement(requirement: Omit<TestingRequirement, 'testingRequirementId' | 'createdAt' | 'updatedAt'>): TestingRequirement {
    const testingRequirementId = `TEST-${Date.now()}`;
    const now = new Date().toISOString();
    const newRequirement: TestingRequirement = {
      ...requirement,
      testingRequirementId,
      createdAt: now,
      updatedAt: now,
    };
    this.testingRequirements.set(testingRequirementId, newRequirement);
    return newRequirement;
  }

  getTestingRequirement(testingRequirementId: string): TestingRequirement | undefined {
    return this.testingRequirements.get(testingRequirementId);
  }

  getAllTestingRequirements(): TestingRequirement[] {
    return Array.from(this.testingRequirements.values());
  }

  updateTestingRequirement(testingRequirementId: string, updates: Partial<TestingRequirement>): TestingRequirement | null {
    const requirement = this.testingRequirements.get(testingRequirementId);
    if (!requirement) return null;
    const updated = { ...requirement, ...updates, updatedAt: new Date().toISOString() };
    this.testingRequirements.set(testingRequirementId, updated);
    return updated;
  }

  createComplianceChecklist(checklist: Omit<ComplianceChecklist, 'complianceId' | 'createdAt' | 'updatedAt'>): ComplianceChecklist {
    const complianceId = `COMP-${Date.now()}`;
    const now = new Date().toISOString();
    const newChecklist: ComplianceChecklist = {
      ...checklist,
      complianceId,
      createdAt: now,
      updatedAt: now,
    };
    this.complianceChecklists.set(complianceId, newChecklist);
    return newChecklist;
  }

  getComplianceChecklist(complianceId: string): ComplianceChecklist | undefined {
    return this.complianceChecklists.get(complianceId);
  }

  getAllComplianceChecklists(): ComplianceChecklist[] {
    return Array.from(this.complianceChecklists.values());
  }

  updateComplianceChecklist(complianceId: string, updates: Partial<ComplianceChecklist>): ComplianceChecklist | null {
    const checklist = this.complianceChecklists.get(complianceId);
    if (!checklist) return null;
    const updated = { ...checklist, ...updates, updatedAt: new Date().toISOString() };
    this.complianceChecklists.set(complianceId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 11: PACKING & SHIPMENT
  // ============================================================================

  createPackingInstruction(instruction: Omit<PackingInstruction, 'packingInstructionId' | 'createdAt' | 'updatedAt'>): PackingInstruction {
    const packingInstructionId = `PKG-INST-${Date.now()}`;
    const now = new Date().toISOString();
    const newInstruction: PackingInstruction = {
      ...instruction,
      packingInstructionId,
      createdAt: now,
      updatedAt: now,
    };
    this.packingInstructions.set(packingInstructionId, newInstruction);
    return newInstruction;
  }

  createPackingList(packingList: Omit<PackingList, 'packingListId' | 'packingListNumber' | 'generatedAt'>): PackingList {
    const packingListId = `PKG-LST-${Date.now()}`;
    const packingListNumber = `PL-${new Date().getFullYear()}-${String(this.packingLists.size + 1).padStart(4, '0')}`;
    const newPackingList: PackingList = {
      ...packingList,
      packingListId,
      packingListNumber,
      generatedAt: new Date().toISOString(),
    };
    this.packingLists.set(packingListId, newPackingList);
    return newPackingList;
  }

  createShipmentPlanning(planning: Omit<ShipmentPlanning, 'shipmentPlanningId' | 'createdAt' | 'updatedAt'>): ShipmentPlanning {
    const shipmentPlanningId = `SHP-${Date.now()}`;
    const now = new Date().toISOString();
    const newPlanning: ShipmentPlanning = {
      ...planning,
      shipmentPlanningId,
      createdAt: now,
      updatedAt: now,
    };
    this.shipmentPlannings.set(shipmentPlanningId, newPlanning);
    return newPlanning;
  }

  getShipmentPlanning(shipmentPlanningId: string): ShipmentPlanning | undefined {
    return this.shipmentPlannings.get(shipmentPlanningId);
  }

  getAllShipmentPlannings(): ShipmentPlanning[] {
    return Array.from(this.shipmentPlannings.values());
  }

  updateShipmentPlanning(shipmentPlanningId: string, updates: Partial<ShipmentPlanning>): ShipmentPlanning | null {
    const shipment = this.shipmentPlannings.get(shipmentPlanningId);
    if (!shipment) return null;
    const updated = { ...shipment, ...updates, updatedAt: new Date().toISOString() };
    this.shipmentPlannings.set(shipmentPlanningId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 12: DOCUMENTATION & INVOICING
  // ============================================================================

  createExportDocuments(docs: Omit<ExportDocuments, 'exportDocumentsId' | 'createdAt' | 'updatedAt'>): ExportDocuments {
    const exportDocumentsId = `EXP-DOC-${Date.now()}`;
    const now = new Date().toISOString();
    const newDocs: ExportDocuments = {
      ...docs,
      exportDocumentsId,
      createdAt: now,
      updatedAt: now,
    };
    this.exportDocuments.set(exportDocumentsId, newDocs);
    return newDocs;
  }

  getExportDocuments(exportDocumentsId: string): ExportDocuments | undefined {
    return this.exportDocuments.get(exportDocumentsId);
  }

  getAllExportDocuments(): ExportDocuments[] {
    return Array.from(this.exportDocuments.values());
  }

  updateExportDocuments(exportDocumentsId: string, updates: Partial<ExportDocuments>): ExportDocuments | null {
    const docs = this.exportDocuments.get(exportDocumentsId);
    if (!docs) return null;
    const updated = { ...docs, ...updates, updatedAt: new Date().toISOString() };
    this.exportDocuments.set(exportDocumentsId, updated);
    return updated;
  }

  createInvoice(invoice: Omit<InvoiceToBuyer, 'invoiceId' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): InvoiceToBuyer {
    const invoiceId = `INV-${Date.now()}`;
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(this.invoices.size + 1).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const newInvoice: InvoiceToBuyer = {
      ...invoice,
      invoiceId,
      invoiceNumber,
      createdAt: now,
      updatedAt: now,
    };
    this.invoices.set(invoiceId, newInvoice);
    return newInvoice;
  }

  getInvoice(invoiceId: string): InvoiceToBuyer | undefined {
    return this.invoices.get(invoiceId);
  }

  getAllInvoices(): InvoiceToBuyer[] {
    return Array.from(this.invoices.values());
  }

  updateInvoice(invoiceId: string, updates: Partial<InvoiceToBuyer>): InvoiceToBuyer | null {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) return null;
    const updated = { ...invoice, ...updates, updatedAt: new Date().toISOString() };
    this.invoices.set(invoiceId, updated);
    return updated;
  }

  // ============================================================================
  // PHASE 13: POST-SHIPMENT
  // ============================================================================

  createShipmentTracking(tracking: Omit<ShipmentTracking, 'shipmentTrackingId' | 'createdAt' | 'updatedAt'>): ShipmentTracking {
    const shipmentTrackingId = `TRK-${Date.now()}`;
    const now = new Date().toISOString();
    const newTracking: ShipmentTracking = {
      ...tracking,
      shipmentTrackingId,
      createdAt: now,
      updatedAt: now,
    };
    this.shipmentTracking.set(shipmentTrackingId, newTracking);
    return newTracking;
  }

  getShipmentTracking(shipmentTrackingId: string): ShipmentTracking | undefined {
    return this.shipmentTracking.get(shipmentTrackingId);
  }

  getAllShipmentTracking(): ShipmentTracking[] {
    return Array.from(this.shipmentTracking.values());
  }

  updateShipmentTracking(shipmentTrackingId: string, updates: Partial<ShipmentTracking>): ShipmentTracking | null {
    const tracking = this.shipmentTracking.get(shipmentTrackingId);
    if (!tracking) return null;
    const updated = { ...tracking, ...updates, updatedAt: new Date().toISOString() };
    this.shipmentTracking.set(shipmentTrackingId, updated);
    return updated;
  }

  createBuyerFeedback(feedback: Omit<BuyerFeedback, 'feedbackId' | 'createdAt' | 'updatedAt'>): BuyerFeedback {
    const feedbackId = `FDBK-${Date.now()}`;
    const now = new Date().toISOString();
    const newFeedback: BuyerFeedback = {
      ...feedback,
      feedbackId,
      createdAt: now,
      updatedAt: now,
    };
    this.buyerFeedbacks.set(feedbackId, newFeedback);
    return newFeedback;
  }

  createPaymentFollowUp(followUp: Omit<PaymentFollowUp, 'paymentFollowUpId' | 'createdAt' | 'updatedAt'>): PaymentFollowUp {
    const paymentFollowUpId = `PAY-FU-${Date.now()}`;
    const now = new Date().toISOString();
    const newFollowUp: PaymentFollowUp = {
      ...followUp,
      paymentFollowUpId,
      createdAt: now,
      updatedAt: now,
    };
    this.paymentFollowUps.set(paymentFollowUpId, newFollowUp);
    return newFollowUp;
  }

  getPaymentFollowUp(paymentFollowUpId: string): PaymentFollowUp | undefined {
    return this.paymentFollowUps.get(paymentFollowUpId);
  }

  getAllPaymentFollowUps(): PaymentFollowUp[] {
    return Array.from(this.paymentFollowUps.values());
  }

  updatePaymentFollowUp(paymentFollowUpId: string, updates: Partial<PaymentFollowUp>): PaymentFollowUp | null {
    const payment = this.paymentFollowUps.get(paymentFollowUpId);
    if (!payment) return null;
    const updated = { ...payment, ...updates, updatedAt: new Date().toISOString() };
    this.paymentFollowUps.set(paymentFollowUpId, updated);
    return updated;
  }

  // ============================================================================
  // COMPLETE ERP FLOW MANAGEMENT
  // ============================================================================

  createERPFlow(styleReference: string): MerchantERPFlow {
    const now = new Date().toISOString();
    const newFlow: MerchantERPFlow = {
      styleReference,
      currentPhase: 1,
      overallStatus: 'Not Started',
      sampleRequests: [],
      sampleTracking: [],
      sampleApprovals: [],
      fabricRequirements: [],
      fabricPurchaseOrders: [],
      labDipApprovals: [],
      fabricGRNs: [],
      trimRequirements: [],
      trimPurchaseOrders: [],
      trimApprovals: [],
      cutOrders: [],
      inlineQCs: [],
      midlineEndlineInspections: [],
      finalInspections: [],
      testingRequirements: [],
      buyerFeedbacks: [],
      paymentFollowUps: [],
      createdAt: now,
      updatedAt: now,
    };
    this.erpFlows.set(styleReference, newFlow);
    return newFlow;
  }

  getERPFlow(styleReference: string): MerchantERPFlow | undefined {
    return this.erpFlows.get(styleReference);
  }

  getAllERPFlows(): MerchantERPFlow[] {
    return Array.from(this.erpFlows.values());
  }

  updateERPFlow(styleReference: string, updates: Partial<MerchantERPFlow>): MerchantERPFlow | null {
    const flow = this.erpFlows.get(styleReference);
    if (!flow) return null;
    const updated = { ...flow, ...updates, updatedAt: new Date().toISOString() };
    this.erpFlows.set(styleReference, updated);
    return updated;
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  resetAll(): void {
    this.buyers.clear();
    this.seasons.clear();
    this.brands.clear();
    this.inquiries.clear();
    this.costSheets.clear();
    this.quotations.clear();
    this.sampleRequests.clear();
    this.sampleTracking.clear();
    this.sampleApprovals.clear();
    this.sampleTrackers.clear();
    this.buyerPOs.clear();
    this.internalWorkOrders.clear();
    this.techPacks.clear();
    this.fabricRequirements.clear();
    this.fabricPOs.clear();
    this.labDipApprovals.clear();
    this.fabricGRNs.clear();
    this.trimRequirements.clear();
    this.trimPOs.clear();
    this.trimApprovals.clear();
    this.cpmRecords.clear();
    this.ppMeetings.clear();
    this.cutOrders.clear();
    this.productionTracking.clear();
    this.inlineQCs.clear();
    this.midlineEndlineInspections.clear();
    this.finalInspections.clear();
    this.testingRequirements.clear();
    this.complianceChecklists.clear();
    this.packingInstructions.clear();
    this.packingLists.clear();
    this.shipmentPlannings.clear();
    this.exportDocuments.clear();
    this.invoices.clear();
    this.shipmentTracking.clear();
    this.buyerFeedbacks.clear();
    this.paymentFollowUps.clear();
    this.erpFlows.clear();
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const merchantStore = new MerchantERPStore();
