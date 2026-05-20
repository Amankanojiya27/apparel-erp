// File: lib/merchant-types.ts
// Complete Type Definitions for Merchant Department ERP Flow (14 Phases)

// ============================================================================
// PHASE 1: BUYER / BRAND ONBOARDING
// ============================================================================

export interface BuyerMaster {
  buyerId: string;
  buyerCode: string;
  buyerName: string;
  country: string;
  currency: string;
  contactDetails: {
    name: string;
    email: string;
    phone: string;
    designation: string;
  };
  billingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  shippingAddress: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentTerms: string; // '30 days', '60 days', 'LC', 'TT', etc.
  incoterms: string; // 'FOB', 'CIF', 'CNF', etc.
  seasonMapping: SeasonMapping[];
  buyerCategory: 'Domestic' | 'Export' | 'Private Label';
  creditLimit: number;
  documentRequirements: string[];
  specialInstructions?: string;
  status: 'active' | 'inactive' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface SeasonMapping {
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface SeasonMaster {
  seasonId: string;
  seasonName: string; // 'SS24', 'AW24', 'Holiday', etc.
  startDate: string;
  endDate: string;
  buyerId: string;
  buyerName: string;
  collectionName?: string;
  styleRangePlanUrl?: string;
  status: 'active' | 'closed' | 'upcoming';
  createdAt: string;
}

export interface BrandMaster {
  brandId: string;
  brandName: string;
  labelType: 'woven' | 'printed' | 'hang_tag';
  brandGuidelinesUrl?: string;
  approvedVendors: string[]; // vendor IDs
  status: 'active' | 'inactive';
  createdAt: string;
}

// ============================================================================
// PHASE 2: INQUIRY / RANGE PLAN
// ============================================================================

export interface InquiryRangePlan {
  inquiryId: string;
  inquiryNumber: string; // auto-generated
  inquiryDate: string;
  buyerId: string;
  buyerName: string;
  seasonId?: string;
  seasonName?: string;
  styleReferenceNumber: string; // buyer's reference
  styleName: string;
  styleDescription: string;
  productCategory: string; // 'Top', 'Bottom', 'Dress', 'Outerwear', etc.
  subCategory: string; // 'Shirt', 'Trouser', 'Jacket', etc.
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
  fabricComposition: string; // '60% Cotton, 40% Polyester'
  fabricConstruction: string; // 'Woven', 'Knit', 'Denim'
  targetPrice: number;
  targetPriceCurrency: string;
  expectedOrderQuantity: number;
  expectedDeliveryDate: string;
  techPackUrl?: string;
  referenceSampleImageUrl?: string;
  inquiryStatus: 'New' | 'Under Review' | 'Quoted' | 'Closed' | 'Converted';
  assignedMerchantId?: string;
  assignedMerchantName?: string;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 3: COSTING
// ============================================================================

export interface FabricCostItem {
  fabricName: string;
  fabricComposition: string;
  fabricWidth: number;
  consumptionPerPiece: number; // in meters/kg
  fabricRate: number; // per meter/kg
  wastagePercent: number;
  totalFabricCostPerPiece: number;
  fabricSource: 'local' | 'import';
  supplierName?: string;
}

export interface TrimCostItem {
  itemName: string; // 'button', 'zipper', 'thread', 'label', etc.
  quantityPerGarment: number;
  ratePerUnit: number;
  totalCostPerPiece: number;
}

export interface CMTCost {
  cuttingCharges: number;
  stitchingCharges: number;
  finishingCharges: number;
  embroideryPrintCharges?: number;
  washingCharges?: number;
  totalCMT: number;
}

export interface OtherCharges {
  testingCharges: number;
  inspectionCharges: number;
  commissionPercent: number;
  commissionAmount: number;
  bankCharges: number;
  freightCharges: number;
  insurance: number;
  miscellaneous: number;
  totalOtherCharges: number;
}

export interface CostSheetSummary {
  totalRawMaterialCost: number;
  totalCMTCost: number;
  totalOtherCharges: number;
  overheadPercent: number;
  overheadAmount: number;
  profitMarginPercent: number;
  profitMarginAmount: number;
  finalFOBPrice: number;
  buyerTargetPrice: number;
  difference: number; // over/under target
}

export interface CostSheet {
  costSheetId: string;
  costSheetNumber: string; // linked to inquiry
  styleReference: string;
  buyerName: string;
  seasonName?: string;
  costingDate: string;
  currency: string;
  fabricCosts: FabricCostItem[];
  trimCosts: TrimCostItem[];
  cmtCost: CMTCost;
  otherCharges: OtherCharges;
  summary: CostSheetSummary;
  version: string; // 'V1', 'V2', 'V3'
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revised';
  approvedBy?: string;
  approvedDate?: string;
  costingRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  quotationId: string;
  quotationNumber: string;
  costSheetId: string;
  costSheetNumber: string;
  quotedPrice: number;
  currency: string;
  dateSentToBuyer: string;
  buyerFeedback: 'Accepted' | 'Counter' | 'Rejected' | 'Pending';
  counterPrice?: number;
  finalAgreedPrice?: number;
  quotationStatus: 'Pending' | 'Sent' | 'Accepted' | 'Rejected' | 'Negotiating';
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 4: SAMPLE DEVELOPMENT
// ============================================================================

export type SampleType = 
  | 'Proto Sample'
  | 'Fit Sample'
  | 'Salesman Sample (SMS)'
  | 'Photo Shoot Sample'
  | 'Pre-Production Sample (PPS)'
  | 'TOP (Top of Production)'
  | 'Shipment Sample';

export type SampleStage = 
  | 'Cutting'
  | 'Stitching'
  | 'Finishing'
  | 'QC'
  | 'Dispatch';

export type SampleStatus = 
  | 'Pending'
  | 'In Progress'
  | 'Completed'
  | 'Dispatched'
  | 'Received'
  | 'Approved'
  | 'Approved with Comments'
  | 'Rejected';

export interface SampleRequest {
  sampleRequestId: string;
  sampleRequestNumber: string; // auto-generated
  date: string;
  styleReference: string;
  buyerName: string;
  seasonName?: string;
  sampleType: SampleType;
  sampleQuantityRequired: number;
  sizeBreakdown: Array<{ size: string; quantity: number }>;
  colorFabricDetails: string;
  specialInstructions?: string;
  requiredByDate: string;
  sentToDepartment: string;
  priorityLevel: 'Normal' | 'Urgent';
  status: SampleStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SampleTracking {
  sampleTrackingId: string;
  sampleRequestId: string;
  sampleNumber: string;
  stage: SampleStage;
  currentStatus: SampleStatus;
  responsiblePerson: string;
  inHouseDate?: string;
  dispatchDate?: string;
  courierTrackingNumber?: string;
  courierCompanyName?: string;
  buyerReceivedDate?: string;
  updatedAt: string;
}

export interface SampleComment {
  commentId: string;
  commentPointNumber: number;
  commentDate: string;
  buyerComments: string; // fit issue, color issue, construction issue, etc.
  actionRequired: string;
  correctiveActionTaken?: string;
  resubmissionRequired: boolean;
  updatedAt: string;
}

export interface SampleApproval {
  sampleApprovalId: string;
  sampleRequestId: string;
  buyerCommentDate: string;
  comments: SampleComment[];
  approvalStatus: 'Pending' | 'Approved' | 'Approved with Comments' | 'Rejected';
  approvedBy: string; // buyer name/buyer QC
  approvalDate?: string;
  sampleApprovalDocumentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SampleTracker {
  styleReference: string;
  samples: Array<{
    sampleRequestId: string;
    sampleType: SampleType;
    stage: SampleStage;
    status: SampleStatus;
    completionPercent: number;
    deadline: string;
    isOverdue: boolean;
  }>;
  overallCompletionPercent: number;
  pendingSamplesCount: number;
  overdueSamplesCount: number;
}

// ============================================================================
// PHASE 5: ORDER CONFIRMATION (ORDER BOOKING)
// ============================================================================

export interface BuyerPurchaseOrder {
  buyerPOId: string;
  poNumber: string; // buyer's PO number
  poReceivedDate: string;
  buyerId: string;
  buyerName: string;
  seasonId?: string;
  seasonName?: string;
  styleReference: string;
  styleDescription: string;
  poQuantity: number;
  sizeWiseBreakup: Array<{ size: string; quantity: number }>;
  colorWiseBreakup: Array<{ color: string; quantity: number }>;
  countryOfDelivery: string;
  deliveryDate: string; // ex-factory date
  shipmentMode: 'Air' | 'Sea' | 'Road' | 'Courier';
  fobPort?: string;
  destinationPort?: string;
  agreedPricePerPiece: number;
  totalPOValue: number;
  currency: string;
  paymentTerms: string;
  specialBuyerRequirements?: string;
  poDocumentUrl?: string;
  poStatus: 'New' | 'Confirmed' | 'In Production' | 'Shipped' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

export interface InternalWorkOrder {
  workOrderId: string;
  internalOrderNumber: string; // auto-generated, linked to buyer PO
  buyerPOId: string;
  buyerPONumber: string;
  merchantName: string;
  factoryUnit: string;
  styleSummary: string;
  sizeSet: string[]; // ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  colorOptions: string[];
  deliverySchedule: string;
  internalExFactoryDate: string; // with buffer days
  sharedWithDepartments: string[];
  status: 'Created' | 'Shared' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 6: TECH PACK / STYLE SPECIFICATION
// ============================================================================

export interface MeasurementPoint {
  pointOfMeasure: string;
  sizeWiseMeasurements: Array<{ size: string; measurement: number; tolerance: string }>;
  buyerSpec?: number;
  factorySpec?: number;
}

export interface ConstructionDetail {
  stitchingType: string; // SPI - stitches per inch
  seamType: string;
  hemDetails: string;
  placketDetails: string;
  pocketDetails: string;
}

export interface BOMItem {
  fabricDetails: {
    quality: string;
    color: string;
    quantity: number;
  };
  trimsList: Array<{
    item: string; // button, zipper, elastic, cord, label, tag, poly bag
    details: string;
    quantity: number;
  }>;
  artworkPrintDetails?: string;
  embroideryDetails?: string;
}

export interface Colorway {
  colorName: string;
  pantoneCode: string;
  labDipReference: string;
  approvalStatus: 'Approved' | 'Rejected' | 'Pending';
}

export interface TechPack {
  techPackId: string;
  techPackNumber: string;
  styleReference: string;
  versionNumber: string;
  techPackUrl: string;
  measurementSheet: MeasurementPoint[];
  constructionDetails: ConstructionDetail;
  bom: BOMItem;
  colorways: Colorway[];
  techPackApprovalStatus: 'Pending' | 'Approved' | 'Rejected';
  lastUpdatedDate: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 7: RAW MATERIAL PLANNING & PROCUREMENT
// ============================================================================

export interface FabricRequirement {
  fabricRequirementId: string;
  orderId: string;
  fabricName: string;
  fabricQuality: string;
  totalGarmentQuantity: number;
  consumptionPerPiece: number; // in meters/kg
  wastagePercent: number;
  grossFabricRequirement: number;
  alreadyInStock: number;
  netFabricToOrder: number;
  approvedSupplierName: string;
  fabricSource: 'local' | 'import';
  leadTimeDays: number;
  requiredInHouseDate: string;
  fabricPORaised: boolean;
  status: 'Planned' | 'Ordered' | 'Received' | 'Delayed';
  createdAt: string;
  updatedAt: string;
}

export interface FabricPurchaseOrder {
  fabricPOId: string;
  fabricPONumber: string;
  poDate: string;
  supplierName: string;
  supplierCode: string;
  fabricDescription: string;
  fabricQuality: string;
  fabricComposition: string;
  fabricConstruction: string;
  colorDetails: string;
  width: number;
  quantity: number; // meters/kg
  ratePerMeter: number;
  totalValue: number;
  currency: string;
  deliveryAddress: string;
  requiredDeliveryDate: string;
  poTerms: string;
  labDipApprovalReference?: string;
  status: 'Raised' | 'Confirmed' | 'In Transit' | 'Received' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface LabDipApproval {
  labDipId: string;
  labDipNumber: string;
  styleOrderReference: string;
  colorName: string;
  pantoneCode: string;
  supplierName: string;
  submissionDate: string;
  buyerComment?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Resubmit';
  approvedShadeCardUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FabricGRN {
  fabricGRNId: string;
  grnNumber: string;
  poReference: string;
  receivedDate: string;
  supplierName: string;
  fabricReceivedQuantity: number;
  fabricInspectedQuantity: number;
  fourPointSystemResult: string;
  defectsFound: string[];
  acceptedQuantity: number;
  rejectedQuantity: number;
  rejectedReason?: string;
  qcPersonName: string;
  grnStatus: 'Pending' | 'Accepted' | 'Rejected' | 'Partial';
  createdAt: string;
  updatedAt: string;
}

export interface TrimRequirement {
  trimRequirementId: string;
  styleOrderReference: string;
  trimItemName: string;
  description: string;
  requiredQuantity: number;
  bufferPercent: number;
  totalRequiredWithBuffer: number;
  supplierName: string;
  leadTimeDays: number;
  requiredInHouseDate: string;
  status: 'To Order' | 'Ordered' | 'Received' | 'Approved';
  createdAt: string;
  updatedAt: string;
}

export interface TrimPurchaseOrder {
  trimPOId: string;
  trimPONumber: string;
  poDate: string;
  supplierName: string;
  itemWiseDetails: Array<{
    item: string;
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }>;
  totalValue: number;
  currency: string;
  deliveryDate: string;
  status: 'Raised' | 'Confirmed' | 'Received' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface TrimApproval {
  trimApprovalId: string;
  itemName: string;
  submittedToBuyer: boolean;
  submissionDate?: string;
  buyerApprovalStatus: 'Approved' | 'Rejected' | 'With Comments' | 'Pending';
  approvedSampleKeptInRecord?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 8: PRODUCTION PLANNING
// ============================================================================

export interface CPMActivity {
  activityId: string;
  orderNumber: string;
  styleReference: string;
  activityName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  responsibleDepartment: string;
  responsiblePerson: string;
  status: 'Not Started' | 'In Progress' | 'Completed' | 'Delayed';
  delayReason?: string;
  daysDelayed?: number;
  updatedAt: string;
}

export interface CriticalPathManagement {
  cpmId: string;
  orderNumber: string;
  styleReference: string;
  activities: CPMActivity[];
  overallOrderHealth: 'Green' | 'Yellow' | 'Red';
  autoAlertEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PPMeetingActionItem {
  actionItemId: string;
  actionDescription: string;
  owner: string;
  deadline: string;
  status: 'Open' | 'In Progress' | 'Completed';
}

export interface PPMeetingRecord {
  ppMeetingId: string;
  meetingDate: string;
  styleReference: string;
  attendees: string[];
  pointsDiscussed: string[];
  issuesRaised: string[];
  actionItems: PPMeetingActionItem[];
  ppMeetingNotesUrl?: string;
  ppSampleApprovalStatus: 'Pending' | 'Approved' | 'Rejected';
  ppMeetingStatus: 'Done' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

export interface CutOrder {
  cutOrderId: string;
  cutOrderNumber: string;
  internalOrderNumber: string;
  styleReference: string;
  cutQuantity: Array<{
    size: string;
    color: string;
    quantity: number;
  }>;
  cuttingStartDate: string;
  cuttingCompletionDate: string;
  layerPlan: string;
  markerPlan: string;
  fabricConsumptionActual: number;
  fabricConsumptionPlanned: number;
  cuttingDepartmentConfirmation: boolean;
  status: 'Planned' | 'In Progress' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

export interface ProductionDailyUpdate {
  updateId: string;
  date: string;
  cuttingDone: number;
  stitchingDone: number;
  finishingDone: number;
  qcPassed: number;
  qcRejected: number;
  rejectionReason?: string;
  remarks?: string;
  updatedAt: string;
}

export interface ProductionTrackingRecord {
  productionTrackingId: string;
  orderNumber: string;
  styleReference: string;
  totalOrderQuantity: number;
  dailyUpdates: ProductionDailyUpdate[];
  productionEfficiencyPercent: number;
  balanceQuantity: number;
  projectedCompletionDate: string;
  alerts: string[];
  status: 'On Track' | 'Behind Schedule' | 'Completed';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 9: QUALITY CONTROL (QC)
// ============================================================================

export interface InlineQC {
  inlineQCId: string;
  inspectionDate: string;
  styleOrderReference: string;
  lineNumber: string;
  inspectorName: string;
  quantityInspected: number;
  defectsFound: Array<{
    defectType: string;
    quantity: number;
  }>;
  aqlLevel: string;
  passFailStatus: 'Pass' | 'Fail';
  correctiveActionRequired?: string;
  inlineReportUrl?: string;
  createdAt: string;
}

export interface MidlineEndlineInspection {
  inspectionId: string;
  inspectionDate: string;
  styleOrderReference: string;
  lineNumber: string;
  inspectorName: string;
  stage: 'Midline' | 'Endline';
  quantityInspected: number;
  defectsFound: Array<{
    defectType: string;
    quantity: number;
  }>;
  aqlLevel: string;
  buyerQCInvolvement: boolean;
  passFailStatus: 'Pass' | 'Fail';
  correctiveActionRequired?: string;
  reportUrl?: string;
  createdAt: string;
}

export interface MeasurementCheckResult {
  checkedPieces: number;
  passed: number;
  failed: number;
}

export interface VisualCheckResult {
  defectWiseCount: Array<{
    defectType: string;
    major: number;
    minor: number;
    critical: number;
  }>;
}

export interface PackingCheck {
  cartonMarkingCheck: boolean;
  labelCheck: boolean;
  polyBagCheck: boolean;
  assortmentCheck: boolean;
}

export interface FinalInspection {
  finalInspectionId: string;
  fiNumber: string;
  inspectionDate: string;
  styleOrderReference: string;
  orderQuantity: number;
  offeredQuantity: number;
  inspectedQuantity: number;
  aqlLevel: '1.5' | '2.5' | '4.0';
  samplingPlan: 'normal' | 'tightened' | 'reduced';
  measurementCheckResult: MeasurementCheckResult;
  visualCheckResult: VisualCheckResult;
  packingCheck: PackingCheck;
  finalResult: 'Passed' | 'Failed' | 'Conditional Pass';
  inspectorName: string;
  inspectorType: 'internal' | 'third_party';
  thirdPartyAgency?: string; // 'Bureau Veritas', 'SGS', 'Intertek'
  buyerQCName?: string;
  fiReportUrl?: string;
  buyerApproval: boolean;
  reInspectionRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 10: COMPLIANCE & TESTING
// ============================================================================

export type TestType = 
  | 'Fabric Testing'
  | 'Chemical Testing'
  | 'Physical Testing';

export interface TestingRequirement {
  testingRequirementId: string;
  styleOrderReference: string;
  testType: TestType;
  testDetails: string; // GSM, shrinkage, color fastness, pilling, REACH, Oeko-Tex, etc.
  testingLabName: string;
  labType: 'in_house' | 'third_party';
  sampleSubmittedDate: string;
  testReportReceivedDate?: string;
  testReportUrl?: string;
  status: 'Pending' | 'Pass' | 'Fail' | 'Conditional';
  reTestRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceChecklist {
  complianceId: string;
  factoryAuditStatus: string; // 'SMETA', 'BSCI', 'SA8000'
  auditExpiryDate: string;
  certificationStatus: string[]; // 'ISO', 'Oeko-Tex', 'GRS'
  buyerComplianceRequirementChecklist: string[];
  complianceDocumentsUrls: string[];
  status: 'Compliant' | 'Non-Compliant' | 'Pending';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 11: PACKING & SHIPMENT
// ============================================================================

export interface PackingInstruction {
  packingInstructionId: string;
  styleOrderReference: string;
  packingType: 'solid_color' | 'assorted' | 'ratio_pack';
  sizeRatioPerCarton: string;
  piecesPerCarton: number;
  cartonDimensions: {
    length: number;
    width: number;
    height: number;
  };
  netWeightPerCarton: number;
  grossWeightPerCarton: number;
  cartonMarkingDetails: string;
  barcodeUPCCodeDetails?: string;
  polyBagType: 'individual' | 'set_pack';
  hangTagPosition?: string;
  priceTagRequired?: boolean;
  specialPackingRequirement?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackingListItem {
  cartonNumber: string;
  color: string;
  size: string;
  piecesPerCarton: number;
}

export interface PackingList {
  packingListId: string;
  packingListNumber: string; // auto-generated
  poNumber: string;
  styleReference: string;
  packingListItems: PackingListItem[];
  totalCartons: number;
  totalPieces: number;
  totalNetWeight: number;
  totalGrossWeight: number;
  totalCBM: number; // cubic meter
  packingListDocumentUrl?: string;
  generatedAt: string;
}

export interface ShipmentPlanning {
  shipmentPlanningId: string;
  orderNumber: string;
  plannedExFactoryDate: string;
  actualExFactoryDate?: string;
  shipmentMode: 'Sea' | 'Air' | 'Road' | 'Courier';
  portOfLoading: string;
  portOfDestination: string;
  forwarderName: string;
  bookingConfirmationNumber: string;
  containerNumber?: string;
  airwayBillNumber?: string;
  vesselName?: string;
  flightNumber?: string;
  etd: string; // Estimated Time of Departure
  eta: string; // Estimated Time of Arrival
  shipmentQuantity: {
    pieces: number;
    cartons: number;
  };
  shipmentValue: number;
  currency: string;
  status: 'Planned' | 'Booked' | 'In Transit' | 'Delivered';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 12: DOCUMENTATION & INVOICING
// ============================================================================

export interface CommercialInvoice {
  invoiceId: string;
  invoiceNumber: string; // auto-generated
  invoiceDate: string;
  buyerDetails: {
    buyerId: string;
    buyerName: string;
    address: string;
  };
  items: Array<{
    style: string;
    color: string;
    size: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
  }>;
  subTotal: number;
  currency: string;
  paymentTerms: string;
  status: 'Draft' | 'Generated' | 'Sent';
  generatedAt: string;
}

export interface ExportDocuments {
  exportDocumentsId: string;
  shipmentReference: string;
  commercialInvoiceId: string;
  commercialInvoiceUrl?: string;
  packingListId: string;
  packingListUrl?: string;
  certificateOfOriginUrl?: string;
  gspCertificateUrl?: string;
  inspectionCertificateUrl?: string;
  billOfLadingUrl?: string;
  airwayBillUrl?: string;
  shippingBillUrl?: string;
  bankDocuments: Array<{
    documentType: string; // 'LC', 'SWIFT copy'
    url: string;
  }>;
  otherBuyerSpecificDocuments: Array<{
    documentName: string;
    url: string;
  }>;
  status: 'Pending' | 'Complete';
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceToBuyer {
  invoiceId: string;
  invoiceNumber: string;
  invoiceDate: string;
  poReference: string;
  shipmentReference: string;
  itemWiseBilling: Array<{
    item: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  discountDeductions?: number;
  finalPayableAmount: number;
  currency: string;
  dueDate: string;
  paymentReceived: boolean;
  paymentReceivedDate?: string;
  outstandingAmount: number;
  status: 'Sent' | 'Partial Paid' | 'Paid' | 'Overdue';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 13: POST-SHIPMENT
// ============================================================================

export interface ShipmentTracking {
  shipmentTrackingId: string;
  shipmentNumber: string;
  currentStatus: 'In Transit' | 'Customs' | 'Delivered';
  trackingUpdates: Array<{
    date: string;
    status: string;
    location: string;
    remarks?: string;
  }>;
  delayAlerts: string[];
  deliveryConfirmationDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuyerFeedback {
  feedbackId: string;
  complaintNumber: string;
  shipmentReference: string;
  complaintDate: string;
  complaintType: 'quality' | 'short_shipment' | 'wrong_packing' | 'delay' | 'other';
  complaintDescription: string;
  piecesAffected: number;
  buyerClaimAmount: number;
  currency: string;
  internalInvestigation: string;
  rootCause: string;
  correctiveAction: string;
  claimSettlementStatus: 'Accepted' | 'Rejected' | 'Partial';
  creditNoteIssued?: boolean;
  creditNoteNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentFollowUp {
  paymentFollowUpId: string;
  invoiceNumber: string;
  invoiceValue: number;
  currency: string;
  dueDate: string;
  paymentReceivedDate?: string;
  amountReceived: number;
  outstandingAmount: number;
  aging: '0-30 days' | '30-60 days' | '60-90 days' | '90+ days';
  followUpLog: Array<{
    date: string;
    contactMethod: string;
    notes: string;
    nextFollowUpDate?: string;
  }>;
  paymentStatus: 'Pending' | 'Partial' | 'Paid' | 'Overdue';
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// PHASE 14: REPORTS & DASHBOARDS
// ============================================================================

export interface OrderBookSummary {
  totalActiveOrders: number;
  totalOrderValue: number;
  currency: string;
  ordersByStatus: Array<{
    status: string;
    count: number;
    value: number;
  }>;
}

export interface TNACriticalPathStatus {
  onTimeActivities: number;
  delayedActivities: number;
  pendingActivities: number;
  overallHealth: 'Green' | 'Yellow' | 'Red';
}

export interface SampleStatusReport {
  totalSamples: number;
  approvedSamples: number;
  pendingSamples: number;
  rejectedSamples: number;
  approvalRate: number;
}

export interface ProductionStatusReport {
  totalOrders: number;
  onTimeOrders: number;
  delayedOrders: number;
  onTimePercent: number;
  averageEfficiency: number;
}

export interface ShipmentStatusReport {
  totalShipments: number;
  onTimeShipments: number;
  delayedShipments: number;
  onTimePercent: number;
}

export interface PendingApprovalsReport {
  pendingCostingApprovals: number;
  pendingSampleApprovals: number;
  pendingPOApprovals: number;
  totalPending: number;
}

export interface CostingSummaryReport {
  totalCostSheets: number;
  averageMarginPercent: number;
  totalValue: number;
  currency: string;
}

export interface BuyerWiseOrderReport {
  buyerId: string;
  buyerName: string;
  totalOrders: number;
  totalValue: number;
  currency: string;
}

export interface SeasonWisePerformanceReport {
  seasonId: string;
  seasonName: string;
  totalOrders: number;
  totalValue: number;
  onTimeDeliveryPercent: number;
  qualityRejectionRate: number;
}

export interface ManagementDashboard {
  orderBookSummary: OrderBookSummary;
  tnaStatus: TNACriticalPathStatus;
  sampleStatus: SampleStatusReport;
  productionStatus: ProductionStatusReport;
  shipmentStatus: ShipmentStatusReport;
  pendingApprovals: PendingApprovalsReport;
  costingSummary: CostingSummaryReport;
  revenueByBuyer: BuyerWiseOrderReport[];
  seasonPerformance: SeasonWisePerformanceReport[];
  lastUpdated: string;
}

// ============================================================================
// INTERCONNECTION TYPES
// ============================================================================

export interface MerchantERPFlow {
  // Phase 1
  buyerMaster?: BuyerMaster;
  seasonMaster?: SeasonMaster;
  brandMaster?: BrandMaster;
  
  // Phase 2
  inquiryRangePlan?: InquiryRangePlan;
  
  // Phase 3
  costSheet?: CostSheet;
  quotation?: Quotation;
  
  // Phase 4
  sampleRequests: SampleRequest[];
  sampleTracking: SampleTracking[];
  sampleApprovals: SampleApproval[];
  sampleTracker?: SampleTracker;
  
  // Phase 5
  buyerPurchaseOrder?: BuyerPurchaseOrder;
  internalWorkOrder?: InternalWorkOrder;
  
  // Phase 6
  techPack?: TechPack;
  
  // Phase 7
  fabricRequirements: FabricRequirement[];
  fabricPurchaseOrders: FabricPurchaseOrder[];
  labDipApprovals: LabDipApproval[];
  fabricGRNs: FabricGRN[];
  trimRequirements: TrimRequirement[];
  trimPurchaseOrders: TrimPurchaseOrder[];
  trimApprovals: TrimApproval[];
  
  // Phase 8
  criticalPathManagement?: CriticalPathManagement;
  ppMeeting?: PPMeetingRecord;
  cutOrders: CutOrder[];
  productionTracking?: ProductionTrackingRecord;
  
  // Phase 9
  inlineQCs: InlineQC[];
  midlineEndlineInspections: MidlineEndlineInspection[];
  finalInspections: FinalInspection[];
  
  // Phase 10
  testingRequirements: TestingRequirement[];
  complianceChecklist?: ComplianceChecklist;
  
  // Phase 11
  packingInstruction?: PackingInstruction;
  packingList?: PackingList;
  shipmentPlanning?: ShipmentPlanning;
  
  // Phase 12
  exportDocuments?: ExportDocuments;
  invoiceToBuyer?: InvoiceToBuyer;
  
  // Phase 13
  shipmentTracking?: ShipmentTracking;
  buyerFeedbacks: BuyerFeedback[];
  paymentFollowUps: PaymentFollowUp[];
  
  // Metadata
  styleReference: string;
  currentPhase: number; // 1-14
  overallStatus: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  createdAt: string;
  updatedAt: string;
}
