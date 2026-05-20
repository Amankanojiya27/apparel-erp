'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { BookOpen, CheckCircle, Clock, Target, ChevronRight, ChevronDown } from 'lucide-react';

interface GuideStep {
  what: string;
  how: string;
  when: string;
  why: string;
}

interface WorkflowPhase {
  phase: string;
  description: string;
  steps: GuideStep[];
}

const WORKFLOW_GUIDE: WorkflowPhase[] = [
  {
    phase: 'Phase 1: Master Data Setup',
    description: 'Set up your foundational data before starting operations',
    steps: [
      {
        what: 'Create Buyers',
        how: 'Navigate to Master Data → Buyers → Click "Create Buyer" → Fill in buyer details (name, contact, address)',
        when: 'Before any order processing',
        why: 'Buyer information is required for all orders, quotations, and communications'
      },
      {
        what: 'Define Seasons',
        how: 'Navigate to Master Data → Seasons → Click "Create Season" → Set season name, year, and dates',
        when: 'At the beginning of each planning cycle',
        why: 'Seasons help organize production timelines and track seasonal performance'
      },
      {
        what: 'Register Brands',
        how: 'Navigate to Master Data → Brands → Click "Create Brand" → Enter brand details and specifications',
        when: 'When working with multiple brands',
        why: 'Brand-specific requirements and standards need to be tracked separately'
      }
    ]
  },
  {
    phase: 'Phase 2: Planning & Costing',
    description: 'Plan your product line and determine costs',
    steps: [
      {
        what: 'Create Range Plans',
        how: 'Navigate to Planning → Range Plans → Add styles, colors, and target quantities',
        when: 'Before sample development',
        why: 'Range plans define your product assortment and production targets'
      },
      {
        what: 'Calculate Cost Sheets',
        how: 'Navigate to Planning → Costing → Add material costs, labor costs, overheads',
        when: 'Before sending quotations',
        why: 'Accurate costing ensures profitable pricing and competitive quotes'
      },
      {
        what: 'Send Quotations',
        how: 'Navigate to Planning → Quotations → Create quotation → Link to cost sheet → Send to buyer',
        when: 'After cost sheet approval',
        why: 'Quotations communicate pricing to buyers and secure orders'
      }
    ]
  },
  {
    phase: 'Phase 3: Sample Development',
    description: 'Develop and approve samples before bulk production',
    steps: [
      {
        what: 'Request Samples',
        how: 'Navigate to Samples → Sample Requests → Create request → Specify style, size, quantity',
        when: 'After buyer approval of quotation',
        why: 'Samples prove design feasibility and quality standards'
      },
      {
        what: 'Track Sample Progress',
        how: 'Navigate to Samples → Sample Tracking → Update status at each stage',
        when: 'Throughout sample development',
        why: 'Tracking ensures timely delivery and identifies bottlenecks'
      },
      {
        what: 'Approve Samples',
        how: 'Navigate to Samples → Sample Approvals → Review samples → Approve or request changes',
        when: 'When samples are received',
        why: 'Approval is required before bulk production can begin'
      }
    ]
  },
  {
    phase: 'Phase 4: Order Confirmation',
    description: 'Convert approved samples into production orders',
    steps: [
      {
        what: 'Receive Buyer POs',
        how: 'Navigate to Orders → Buyer POs → Create PO → Enter order details, quantities, delivery dates',
        when: 'After sample approval',
        why: 'Buyer POs are legal commitments for production'
      },
      {
        what: 'Create Work Orders',
        how: 'Navigate to Orders → Work Orders → Create from PO → Assign factory, set delivery schedule',
        when: 'After PO confirmation',
        why: 'Work orders translate buyer requirements into factory instructions'
      },
      {
        what: 'Prepare Tech Packs',
        how: 'Navigate to Orders → Tech Packs → Create tech pack → Add specs, measurements, construction details',
        when: 'Before production starts',
        why: 'Tech packs provide detailed production instructions to factories'
      }
    ]
  },
  {
    phase: 'Phase 5: Material Procurement',
    description: 'Source and procure all required materials',
    steps: [
      {
        what: 'Plan Fabric Requirements',
        how: 'Navigate to Materials → Fabric Requirements → Calculate based on work orders',
        when: 'After work order creation',
        why: 'Accurate fabric planning prevents shortages and excess inventory'
      },
      {
        what: 'Order Fabrics',
        how: 'Navigate to Materials → Fabric POs → Create PO → Send to suppliers',
        when: 'Based on production timeline',
        why: 'Timely fabric ordering ensures production starts on schedule'
      },
      {
        what: 'Approve Lab Dips',
        how: 'Navigate to Materials → Lab Dips → Review color samples → Approve for bulk production',
        when: 'Before fabric dyeing',
        why: 'Lab dip approval ensures color accuracy in final production'
      },
      {
        what: 'Receive Fabric GRNs',
        how: 'Navigate to Materials → Fabric GRNs → Create GRN → Inspect and record received fabric',
        when: 'When fabric arrives',
        why: 'GRNs track inventory and quality of received materials'
      },
      {
        what: 'Manage Trims',
        how: 'Navigate to Materials → Trim Requirements/POs/Approvals → Follow same process as fabric',
        when: 'Parallel to fabric procurement',
        why: 'Trims (buttons, zippers, labels) are essential for final product'
      }
    ]
  },
  {
    phase: 'Phase 6: Production Planning',
    description: 'Plan and monitor production activities',
    steps: [
      {
        what: 'Create Critical Path',
        how: 'Navigate to Production → Critical Path → Define milestones and deadlines',
        when: 'At order confirmation',
        why: 'Critical path ensures all activities are completed on time'
      },
      {
        what: 'Conduct PP Meetings',
        how: 'Navigate to Production → PP Meetings → Schedule meeting → Document decisions and action items',
        when: 'Before production start',
        why: 'PP meetings align all stakeholders on production requirements'
      },
      {
        what: 'Issue Cut Orders',
        how: 'Navigate to Production → Cut Orders → Create cut plan → Send to cutting department',
        when: 'After fabric approval',
        why: 'Cut orders optimize fabric usage and production efficiency'
      },
      {
        what: 'Track Production',
        how: 'Navigate to Production → Production Tracking → Update daily progress',
        when: 'Throughout production cycle',
        why: 'Tracking identifies delays and enables corrective actions'
      }
    ]
  },
  {
    phase: 'Phase 7: Quality Control',
    description: 'Ensure product quality throughout production',
    steps: [
      {
        what: 'Inline QC',
        how: 'Navigate to Quality → Inline QC → Inspect during production → Record defects',
        when: 'During production',
        why: 'Inline QC catches issues early, reducing rework and waste'
      },
      {
        what: 'Midline QC',
        how: 'Navigate to Quality → Midline QC → Inspect at 50% completion',
        when: 'At production midpoint',
        why: 'Midline QC ensures quality standards are maintained'
      },
      {
        what: 'Final Inspection',
        how: 'Navigate to Quality → Final Inspection → Inspect finished goods → Approve or reject',
        when: 'Before packing',
        why: 'Final inspection ensures only quality products are shipped'
      },
      {
        what: 'Testing',
        how: 'Navigate to Quality → Testing → Conduct required tests (fabric, garment)',
        when: 'As per buyer requirements',
        why: 'Testing ensures compliance with quality and safety standards'
      },
      {
        what: 'Compliance',
        how: 'Navigate to Quality → Compliance → Verify regulatory requirements',
        when: 'Throughout production',
        why: 'Compliance ensures legal and ethical standards are met'
      }
    ]
  },
  {
    phase: 'Phase 8: Logistics & Shipping',
    description: 'Pack and ship finished goods',
    steps: [
      {
        what: 'Create Packing Instructions',
        how: 'Navigate to Logistics → Packing → Define packing requirements → Share with packing team',
        when: 'Before final inspection',
        why: 'Proper packing prevents damage and meets buyer requirements'
      },
      {
        what: 'Plan Shipments',
        how: 'Navigate to Logistics → Shipments → Create shipment plan → Coordinate with logistics',
        when: 'After final inspection approval',
        why: 'Shipment planning ensures timely delivery and cost optimization'
      },
      {
        what: 'Prepare Export Documents',
        how: 'Navigate to Logistics → Export Docs → Generate required documents (invoice, packing list, etc.)',
        when: 'Before shipment',
        why: 'Export documents are required for customs clearance'
      },
      {
        what: 'Issue Invoices',
        how: 'Navigate to Logistics → Invoices → Create invoice → Send to buyer',
        when: 'After shipment',
        why: 'Invoices trigger payment from buyers'
      }
    ]
  },
  {
    phase: 'Phase 9: Post-Shipment',
    description: 'Track shipments and manage payments',
    steps: [
      {
        what: 'Track Shipments',
        how: 'Navigate to Finance → Shipment Tracking → Monitor shipment status → Update delivery dates',
        when: 'After shipment departure',
        why: 'Tracking ensures on-time delivery and proactive issue resolution'
      },
      {
        what: 'Collect Feedback',
        how: 'Navigate to Finance → Feedback → Record buyer feedback → Analyze for improvements',
        when: 'After delivery',
        why: 'Feedback drives continuous improvement and customer satisfaction'
      },
      {
        what: 'Manage Payments',
        how: 'Navigate to Finance → Payments → Track payment status → Follow up on overdue payments',
        when: 'According to payment terms',
        why: 'Payment management ensures cash flow and financial health'
      }
    ]
  }
];

export function UserGuidePanel() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const togglePhase = (index: number) => {
    setExpandedPhase(expandedPhase === index ? null : index);
    setExpandedStep(null);
  };

  const toggleStep = (index: number) => {
    setExpandedStep(expandedStep === index ? null : index);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold">ERP Workflow Guide</h2>
              <p className="text-sm text-slate-500">Complete guide to using the Apparel ERP system</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {WORKFLOW_GUIDE.map((phase, phaseIndex) => (
              <div key={phaseIndex} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => togglePhase(phaseIndex)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Target className="h-5 w-5 text-blue-600" />
                    <div className="text-left">
                      <h3 className="font-semibold text-slate-900">{phase.phase}</h3>
                      <p className="text-sm text-slate-500">{phase.description}</p>
                    </div>
                  </div>
                  {expandedPhase === phaseIndex ? (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-slate-400" />
                  )}
                </button>

                {expandedPhase === phaseIndex && (
                  <div className="p-4 space-y-3">
                    {phase.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="border border-slate-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleStep(stepIndex)}
                          className="w-full flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium text-slate-900">{step.what}</span>
                          {expandedStep === stepIndex ? (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                        </button>

                        {expandedStep === stepIndex && (
                          <div className="p-4 space-y-4 bg-slate-50">
                            <div className="flex items-start gap-3">
                              <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-sm text-slate-900 mb-1">What to do</p>
                                <p className="text-sm text-slate-600">{step.what}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <BookOpen className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-sm text-slate-900 mb-1">How to do it</p>
                                <p className="text-sm text-slate-600">{step.how}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-sm text-slate-900 mb-1">When to do it</p>
                                <p className="text-sm text-slate-600">{step.when}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-sm text-slate-900 mb-1">Why to do it</p>
                                <p className="text-sm text-slate-600">{step.why}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
