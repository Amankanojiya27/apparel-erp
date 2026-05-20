// File: app/page.tsx
'use client';

import { useState } from 'react';
import { Sidebar, type TabId } from '@/components/Sidebar';
import { TopNavbar } from '@/components/TopNavbar';
// Merchant ERP Modules
import { BuyerMasterPanel } from '@/components/merchant-modules/BuyerMasterPanel';
import { SeasonMasterPanel } from '@/components/merchant-modules/SeasonMasterPanel';
import { BrandMasterPanel } from '@/components/merchant-modules/BrandMasterPanel';
import { InquiryRangePlanPanel } from '@/components/merchant-modules/InquiryRangePlanPanel';
import { CostSheetPanel } from '@/components/merchant-modules/CostSheetPanel';
import { QuotationPanel } from '@/components/merchant-modules/QuotationPanel';
import { SampleRequestPanel } from '@/components/merchant-modules/SampleRequestPanel';
import { SampleTrackingPanel } from '@/components/merchant-modules/SampleTrackingPanel';
import { SampleApprovalPanel } from '@/components/merchant-modules/SampleApprovalPanel';
import { BuyerPurchaseOrderPanel } from '@/components/merchant-modules/BuyerPurchaseOrderPanel';
import { InternalWorkOrderPanel } from '@/components/merchant-modules/InternalWorkOrderPanel';
import { TechPackPanel } from '@/components/merchant-modules/TechPackPanel';
import { FabricRequirementPanel } from '@/components/merchant-modules/FabricRequirementPanel';
import { FabricPurchaseOrderPanel } from '@/components/merchant-modules/FabricPurchaseOrderPanel';
import { LabDipApprovalPanel } from '@/components/merchant-modules/LabDipApprovalPanel';
import { FabricGRNPanel } from '@/components/merchant-modules/FabricGRNPanel';
import { TrimRequirementPanel } from '@/components/merchant-modules/TrimRequirementPanel';
import { TrimPurchaseOrderPanel } from '@/components/merchant-modules/TrimPurchaseOrderPanel';
import { TrimApprovalPanel } from '@/components/merchant-modules/TrimApprovalPanel';
import { CPMPanel } from '@/components/merchant-modules/CPMPanel';
import { PPMeetingPanel } from '@/components/merchant-modules/PPMeetingPanel';
import { CutOrderPanel } from '@/components/merchant-modules/CutOrderPanel';
import { ProductionTrackingPanel } from '@/components/merchant-modules/ProductionTrackingPanel';
import { InlineQCPanel } from '@/components/merchant-modules/InlineQCPanel';
import { MidlineQCPanel } from '@/components/merchant-modules/MidlineQCPanel';
import { FinalInspectionPanel } from '@/components/merchant-modules/FinalInspectionPanel';
import { TestingPanel } from '@/components/merchant-modules/TestingPanel';
import { CompliancePanel } from '@/components/merchant-modules/CompliancePanel';
import { PackingPanel } from '@/components/merchant-modules/PackingPanel';
import { ShipmentPanel } from '@/components/merchant-modules/ShipmentPanel';
import { ExportDocsPanel } from '@/components/merchant-modules/ExportDocsPanel';
import { InvoicesPanel } from '@/components/merchant-modules/InvoicesPanel';
import { ShipmentTrackingPanel } from '@/components/merchant-modules/ShipmentTrackingPanel';
import { FeedbackPanel } from '@/components/merchant-modules/FeedbackPanel';
import { PaymentsPanel } from '@/components/merchant-modules/PaymentsPanel';
import { ReportsPanel } from '@/components/merchant-modules/ReportsPanel';
import { UserGuidePanel } from '@/components/UserGuidePanel';
import { OrderTrackingPanel } from '@/components/OrderTrackingPanel';
import { OrderWorkflowGuide } from '@/components/OrderWorkflowGuide';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>('buyers');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} isOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <TopNavbar isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <main className={`mt-16 p-4 md:p-6 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64 ml-0' : 'md:ml-16 ml-0'}`}>
        {/* User Guide */}
        {activeTab === 'user-guide' && <UserGuidePanel />}

        {/* Order Tracking */}
        {activeTab === 'order-tracking' && <OrderTrackingPanel />}

        {/* Workflow Guide */}
        {activeTab === 'workflow-step' && <OrderWorkflowGuide />}

        {/* Master Data */}
        {activeTab === 'buyers' && <BuyerMasterPanel />}
        {activeTab === 'seasons' && <SeasonMasterPanel />}
        {activeTab === 'brands' && <BrandMasterPanel />}

        {/* Planning */}
        {activeTab === 'range-plans' && <InquiryRangePlanPanel />}
        {activeTab === 'costing' && <CostSheetPanel />}
        {activeTab === 'quotations' && <QuotationPanel />}

        {/* Samples */}
        {activeTab === 'sample-requests' && <SampleRequestPanel />}
        {activeTab === 'sample-tracking' && <SampleTrackingPanel />}
        {activeTab === 'sample-approvals' && <SampleApprovalPanel />}

        {/* Orders */}
        {activeTab === 'buyer-pos' && <BuyerPurchaseOrderPanel />}
        {activeTab === 'work-orders' && <InternalWorkOrderPanel />}
        {activeTab === 'tech-packs' && <TechPackPanel />}

        {/* Materials */}
        {activeTab === 'fabric-requirements' && <FabricRequirementPanel />}
        {activeTab === 'fabric-pos' && <FabricPurchaseOrderPanel />}
        {activeTab === 'lab-dips' && <LabDipApprovalPanel />}
        {activeTab === 'fabric-grns' && <FabricGRNPanel />}
        {activeTab === 'trim-requirements' && <TrimRequirementPanel />}
        {activeTab === 'trim-pos' && <TrimPurchaseOrderPanel />}
        {activeTab === 'trim-approvals' && <TrimApprovalPanel />}

        {/* Production */}
        {activeTab === 'cpm' && <CPMPanel />}
        {activeTab === 'pp-meetings' && <PPMeetingPanel />}
        {activeTab === 'cut-orders' && <CutOrderPanel />}
        {activeTab === 'production-tracking' && <ProductionTrackingPanel />}

        {/* Quality */}
        {activeTab === 'inline-qc' && <InlineQCPanel />}
        {activeTab === 'midline-qc' && <MidlineQCPanel />}
        {activeTab === 'final-inspection' && <FinalInspectionPanel />}
        {activeTab === 'testing' && <TestingPanel />}
        {activeTab === 'compliance' && <CompliancePanel />}

        {/* Logistics */}
        {activeTab === 'packing' && <PackingPanel />}
        {activeTab === 'shipments' && <ShipmentPanel />}
        {activeTab === 'export-docs' && <ExportDocsPanel />}
        {activeTab === 'invoices' && <InvoicesPanel />}

        {/* Finance */}
        {activeTab === 'shipment-tracking' && <ShipmentTrackingPanel />}
        {activeTab === 'feedback' && <FeedbackPanel />}
        {activeTab === 'payments' && <PaymentsPanel />}

        {/* Reports */}
        {activeTab === 'reports' && <ReportsPanel />}
      </main>
    </div>
  );
}

