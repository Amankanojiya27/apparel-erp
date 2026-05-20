'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { ArrowRight, CheckCircle, Circle, Play, Info, AlertTriangle } from 'lucide-react';

interface WorkflowStep {
  step: number;
  title: string;
  module: string;
  action: string;
  navigation: string;
  inputData: string[];
  output: string;
  nextStep: number | null;
  notes?: string;
}

const ORDER_WORKFLOW: WorkflowStep[] = [
  {
    step: 1,
    title: 'Create Buyer',
    module: 'Master Data',
    action: 'Create new buyer record',
    navigation: 'Sidebar → Master Data → Buyers → Click "Create Buyer"',
    inputData: ['Buyer name', 'Contact person', 'Email', 'Phone', 'Address', 'Payment terms'],
    output: 'Buyer ID created',
    nextStep: 2,
    notes: 'Only needed if buyer doesn\'t exist yet'
  },
  {
    step: 2,
    title: 'Create Season',
    module: 'Master Data',
    action: 'Define season for production',
    navigation: 'Sidebar → Master Data → Seasons → Click "Create Season"',
    inputData: ['Season name (e.g., SS-2024)', 'Start date', 'End date'],
    output: 'Season ID created',
    nextStep: 3,
    notes: 'Required for organizing production timeline'
  },
  {
    step: 3,
    title: 'Receive Buyer PO',
    module: 'Orders',
    action: 'Enter buyer purchase order',
    navigation: 'Sidebar → Orders → Buyer POs → Click "Create Buyer PO"',
    inputData: ['PO number', 'Buyer (select from dropdown)', 'Style number', 'Color', 'Quantity', 'Delivery date', 'Price per unit'],
    output: 'Buyer PO record created',
    nextStep: 4,
    notes: 'This is your starting point - the order comes from buyer'
  },
  {
    step: 4,
    title: 'Create Sample Request',
    module: 'Samples',
    action: 'Request sample for approval',
    navigation: 'Sidebar → Samples → Sample Requests → Click "Create Sample Request"',
    inputData: ['Link to Buyer PO', 'Sample size', 'Sample quantity', 'Required date'],
    output: 'Sample request created',
    nextStep: 5,
    notes: 'Skip if sample already approved'
  },
  {
    step: 5,
    title: 'Track & Approve Sample',
    module: 'Samples',
    action: 'Update sample status and approve',
    navigation: 'Sidebar → Samples → Sample Tracking → Update status → Then go to Sample Approvals → Approve',
    inputData: ['Sample status updates', 'Approval decision'],
    output: 'Sample approved',
    nextStep: 6,
    notes: 'Sample must be approved before production'
  },
  {
    step: 6,
    title: 'Create Work Order',
    module: 'Orders',
    action: 'Convert PO to internal work order',
    navigation: 'Sidebar → Orders → Work Orders → Click "Create Work Order"',
    inputData: ['Select Buyer PO', 'Assign factory', 'Set production start date', 'Set delivery date'],
    output: 'Work order created',
    nextStep: 7,
    notes: 'This tells your factory what to produce'
  },
  {
    step: 7,
    title: 'Create Tech Pack',
    module: 'Orders',
    action: 'Prepare detailed production specs',
    navigation: 'Sidebar → Orders → Tech Packs → Click "Create Tech Pack"',
    inputData: ['Link to Work Order', 'Measurements', 'Construction details', 'Material specifications', 'Size chart'],
    output: 'Tech pack created',
    nextStep: 8,
    notes: 'Tech pack is the blueprint for production'
  },
  {
    step: 8,
    title: 'Calculate Fabric Requirements',
    module: 'Materials',
    action: 'Determine fabric needed',
    navigation: 'Sidebar → Materials → Fabric Requirements → Click "Create Fabric Requirement"',
    inputData: ['Link to Work Order', 'Fabric consumption per piece', 'Total quantity', 'Wastage allowance'],
    output: 'Fabric requirement calculated',
    nextStep: 9,
    notes: 'System calculates total fabric needed'
  },
  {
    step: 9,
    title: 'Create Fabric PO',
    module: 'Materials',
    action: 'Order fabric from supplier',
    navigation: 'Sidebar → Materials → Fabric POs → Click "Create Fabric PO"',
    inputData: ['Select fabric requirement', 'Supplier', 'Price per unit', 'Delivery date'],
    output: 'Fabric PO sent to supplier',
    nextStep: 10,
    notes: 'Order fabric with lead time in mind'
  },
  {
    step: 10,
    title: 'Approve Lab Dips',
    module: 'Materials',
    action: 'Approve fabric color samples',
    navigation: 'Sidebar → Materials → Lab Dips → Review samples → Click "Approve"',
    inputData: ['Lab dip samples', 'Approval decision'],
    output: 'Lab dip approved',
    nextStep: 11,
    notes: 'Required before fabric dyeing'
  },
  {
    step: 11,
    title: 'Receive Fabric GRN',
    module: 'Materials',
    action: 'Record fabric receipt',
    navigation: 'Sidebar → Materials → Fabric GRNs → Click "Create Fabric GRN"',
    inputData: ['Fabric PO reference', 'Quantity received', 'Quality check results'],
    output: 'Fabric added to inventory',
    nextStep: 12,
    notes: 'Verify quantity and quality'
  },
  {
    step: 12,
    title: 'Calculate Trim Requirements',
    module: 'Materials',
    action: 'Determine trims needed',
    navigation: 'Sidebar → Materials → Trim Requirements → Click "Create Trim Requirement"',
    inputData: ['Link to Work Order', 'Trim type (buttons, zippers, etc.)', 'Quantity per piece', 'Total quantity'],
    output: 'Trim requirement calculated',
    nextStep: 13,
    notes: 'Repeat for each trim type'
  },
  {
    step: 13,
    title: 'Create Trim PO',
    module: 'Materials',
    action: 'Order trims from supplier',
    navigation: 'Sidebar → Materials → Trim POs → Click "Create Trim PO"',
    inputData: ['Select trim requirement', 'Supplier', 'Price per unit', 'Delivery date'],
    output: 'Trim PO sent to supplier',
    nextStep: 14,
    notes: 'Order trims with lead time'
  },
  {
    step: 14,
    title: 'Approve Trims',
    module: 'Materials',
    action: 'Approve trim samples',
    navigation: 'Sidebar → Materials → Trim Approvals → Review samples → Click "Approve"',
    inputData: ['Trim samples', 'Approval decision'],
    output: 'Trims approved',
    nextStep: 15,
    notes: 'Required before production'
  },
  {
    step: 15,
    title: 'Create Critical Path',
    module: 'Production',
    action: 'Define production milestones',
    navigation: 'Sidebar → Production → Critical Path → Click "Create CPM"',
    inputData: ['Link to Work Order', 'Milestone dates (cutting, sewing, finishing)', 'Key deadlines'],
    output: 'Critical path established',
    nextStep: 16,
    notes: 'This is your production timeline'
  },
  {
    step: 16,
    title: 'Conduct PP Meeting',
    module: 'Production',
    action: 'Pre-production meeting',
    navigation: 'Sidebar → Production → PP Meetings → Click "Create PP Meeting"',
    inputData: ['Attendees', 'Agenda items', 'Decisions made', 'Action items'],
    output: 'PP meeting documented',
    nextStep: 17,
    notes: 'Align all stakeholders before production'
  },
  {
    step: 17,
    title: 'Issue Cut Order',
    module: 'Production',
    action: 'Send cutting instructions',
    navigation: 'Sidebar → Production → Cut Orders → Click "Create Cut Order"',
    inputData: ['Link to Work Order', 'Cut plan', 'Marker efficiency', 'Fabric allocation'],
    output: 'Cut order issued',
    nextStep: 18,
    notes: 'Cutting department receives instructions'
  },
  {
    step: 18,
    title: 'Start Production Tracking',
    module: 'Production',
    action: 'Monitor daily production',
    navigation: 'Sidebar → Production → Production Tracking → Click "Update Progress"',
    inputData: ['Daily output', 'Cumulative output', 'Issues/delays'],
    output: 'Production progress updated',
    nextStep: 19,
    notes: 'Update daily throughout production'
  },
  {
    step: 19,
    title: 'Inline QC',
    module: 'Quality',
    action: 'Quality check during production',
    navigation: 'Sidebar → Quality → Inline QC → Click "Create Inline QC"',
    inputData: ['Inspection date', 'Quantity checked', 'Defects found', 'Defect types'],
    output: 'Inline QC report created',
    nextStep: 20,
    notes: 'Catch issues early during production'
  },
  {
    step: 20,
    title: 'Midline QC',
    module: 'Quality',
    action: 'Quality check at 50% completion',
    navigation: 'Sidebar → Quality → Midline QC → Click "Create Midline QC"',
    inputData: ['Inspection date', 'Quantity checked', 'Defects found', 'Corrective actions'],
    output: 'Midline QC report created',
    nextStep: 21,
    notes: 'Ensure quality is maintained'
  },
  {
    step: 21,
    title: 'Final Inspection',
    module: 'Quality',
    action: 'Final quality check before packing',
    navigation: 'Sidebar → Quality → Final Inspection → Click "Create Final Inspection"',
    inputData: ['Inspection date', 'Final quantity', 'AQL results', 'Pass/Fail decision'],
    output: 'Final inspection completed',
    nextStep: 22,
    notes: 'Only pass quality goods to packing'
  },
  {
    step: 22,
    title: 'Create Packing Instructions',
    module: 'Logistics',
    action: 'Define packing requirements',
    navigation: 'Sidebar → Logistics → Packing → Click "Create Packing"',
    inputData: ['Packing method', 'Carton dimensions', 'Ratio per carton', 'Labeling requirements'],
    output: 'Packing instructions created',
    nextStep: 23,
    notes: 'Share with packing team'
  },
  {
    step: 23,
    title: 'Plan Shipment',
    module: 'Logistics',
    action: 'Arrange shipment logistics',
    navigation: 'Sidebar → Logistics → Shipments → Click "Create Shipment"',
    inputData: ['Shipping method', 'Carrier', 'ETD', 'ETA', 'Tracking number'],
    output: 'Shipment planned',
    nextStep: 24,
    notes: 'Coordinate with freight forwarder'
  },
  {
    step: 24,
    title: 'Generate Export Documents',
    module: 'Logistics',
    action: 'Create shipping documents',
    navigation: 'Sidebar → Logistics → Export Docs → Click "Create Export Docs"',
    inputData: ['Commercial invoice', 'Packing list', 'Certificate of origin', 'Bill of lading'],
    output: 'Export documents generated',
    nextStep: 25,
    notes: 'Required for customs clearance'
  },
  {
    step: 25,
    title: 'Create Invoice',
    module: 'Logistics',
    action: 'Send invoice to buyer',
    navigation: 'Sidebar → Logistics → Invoices → Click "Create Invoice"',
    inputData: ['Invoice number', 'Amount', 'Payment terms', 'Due date'],
    output: 'Invoice sent to buyer',
    nextStep: 26,
    notes: 'Triggers payment from buyer'
  },
  {
    step: 26,
    title: 'Track Shipment',
    module: 'Finance',
    action: 'Monitor shipment progress',
    navigation: 'Sidebar → Finance → Shipment Tracking → Update status',
    inputData: ['Current location', 'ETA updates', 'Delivery confirmation'],
    output: 'Shipment tracked to delivery',
    nextStep: 27,
    notes: 'Update until delivery confirmed'
  },
  {
    step: 27,
    title: 'Record Payment',
    module: 'Finance',
    action: 'Record payment received',
    navigation: 'Sidebar → Finance → Payments → Click "Create Payment"',
    inputData: ['Payment amount', 'Payment date', 'Payment method', 'Reference number'],
    output: 'Payment recorded',
    nextStep: 28,
    notes: 'Order financially complete'
  },
  {
    step: 28,
    title: 'Collect Feedback',
    module: 'Finance',
    action: 'Get buyer feedback',
    navigation: 'Sidebar → Finance → Feedback → Click "Create Feedback"',
    inputData: ['Buyer satisfaction', 'Issues reported', 'Improvement suggestions'],
    output: 'Feedback recorded',
    nextStep: null,
    notes: 'Order complete - use feedback for improvement'
  }
];

export function OrderWorkflowGuide() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentWorkflow = ORDER_WORKFLOW.find(s => s.step === currentStep);

  const handleCompleteStep = () => {
    setCompletedSteps(new Set([...completedSteps, currentStep]));
    if (currentWorkflow?.nextStep) {
      setCurrentStep(currentWorkflow.nextStep);
    }
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCompletedSteps(new Set());
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Play className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold">Order Workflow Execution Guide</h2>
                <p className="text-sm text-slate-500">Step-by-step guide to complete an order from PO to delivery</p>
              </div>
            </div>
            <Button onClick={handleReset} variant="ghost" size="sm">
              Reset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step Navigation */}
            <div className="lg:col-span-1">
              <h3 className="font-semibold text-slate-900 mb-3">Workflow Steps</h3>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {ORDER_WORKFLOW.map((workflow) => {
                  const isCompleted = completedSteps.has(workflow.step);
                  const isCurrent = workflow.step === currentStep;
                  
                  return (
                    <button
                      key={workflow.step}
                      onClick={() => goToStep(workflow.step)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50'
                          : isCompleted
                          ? 'border-green-500 bg-green-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : isCurrent ? (
                            <Circle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 text-sm">Step {workflow.step}</p>
                          <p className="text-xs text-slate-500 truncate">{workflow.title}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Step Details */}
            <div className="lg:col-span-2">
              {currentWorkflow && (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Play className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-900">
                        Step {currentWorkflow.step}: {currentWorkflow.title}
                      </h3>
                    </div>
                    <p className="text-sm text-blue-800">{currentWorkflow.action}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        Module
                      </h4>
                      <p className="text-sm text-slate-600">{currentWorkflow.module}</p>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-green-600" />
                        Output
                      </h4>
                      <p className="text-sm text-slate-600">{currentWorkflow.output}</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Navigation</h4>
                    <p className="text-sm text-slate-600 font-mono bg-white p-2 rounded border">
                      {currentWorkflow.navigation}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Input Data Required</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {currentWorkflow.inputData.map((data, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                          {data}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {currentWorkflow.notes && (
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        Notes
                      </h4>
                      <p className="text-sm text-amber-800">{currentWorkflow.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {currentWorkflow.nextStep ? (
                      <Button onClick={handleCompleteStep} className="flex-1">
                        Complete Step {currentWorkflow.step} → Go to Step {currentWorkflow.nextStep}
                      </Button>
                    ) : (
                      <div className="flex-1 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="font-semibold text-green-900">Order Complete!</p>
                        <p className="text-sm text-green-700">All 28 steps completed successfully</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
