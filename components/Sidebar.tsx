'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Calendar, TrendingUp, Package, FileText, Menu, Factory, Sparkles, MessageSquare, ChevronDown, ChevronRight, X, BookOpen, Truck } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: any;
  children?: { id: string; label: string }[];
}

const TABS: TabItem[] = [
  // User Guide
  {
    id: 'user-guide',
    label: 'User Guide',
    icon: BookOpen,
    children: [
      { id: 'user-guide', label: 'Workflow Guide' },
    ]
  },
  // Order Tracking
  {
    id: 'order-tracking',
    label: 'Order Tracking',
    icon: Truck,
    children: [
      { id: 'order-tracking', label: 'Track Orders' },
      { id: 'workflow-step', label: 'Workflow Step' },
    ]
  },
  // Master Data (Phase 1)
  {
    id: 'buyers',
    label: 'Master Data',
    icon: BarChart3,
    children: [
      { id: 'buyers', label: 'Buyers' },
      { id: 'seasons', label: 'Seasons' },
      { id: 'brands', label: 'Brands' },
    ]
  },
  // Planning (Phases 2-3)
  {
    id: 'range-plans',
    label: 'Planning',
    icon: TrendingUp,
    children: [
      { id: 'range-plans', label: 'Range Plans' },
      { id: 'costing', label: 'Costing' },
      { id: 'quotations', label: 'Quotations' },
    ]
  },
  // Samples (Phase 4)
  {
    id: 'sample-requests',
    label: 'Samples',
    icon: Sparkles,
    children: [
      { id: 'sample-requests', label: 'Sample Requests' },
      { id: 'sample-tracking', label: 'Sample Tracking' },
      { id: 'sample-approvals', label: 'Sample Approvals' },
    ]
  },
  // Orders (Phases 5-6)
  {
    id: 'buyer-pos',
    label: 'Orders',
    icon: FileText,
    children: [
      { id: 'buyer-pos', label: 'Buyer POs' },
      { id: 'work-orders', label: 'Work Orders' },
      { id: 'tech-packs', label: 'Tech Packs' },
    ]
  },
  // Materials (Phase 7)
  {
    id: 'fabric-requirements',
    label: 'Materials',
    icon: Package,
    children: [
      { id: 'fabric-requirements', label: 'Fabric Requirements' },
      { id: 'fabric-pos', label: 'Fabric POs' },
      { id: 'lab-dips', label: 'Lab Dips' },
      { id: 'fabric-grns', label: 'Fabric GRNs' },
      { id: 'trim-requirements', label: 'Trim Requirements' },
      { id: 'trim-pos', label: 'Trim POs' },
      { id: 'trim-approvals', label: 'Trim Approvals' },
    ]
  },
  // Production (Phase 8)
  {
    id: 'cpm',
    label: 'Production',
    icon: Factory,
    children: [
      { id: 'cpm', label: 'Critical Path' },
      { id: 'pp-meetings', label: 'PP Meetings' },
      { id: 'cut-orders', label: 'Cut Orders' },
      { id: 'production-tracking', label: 'Production Tracking' },
    ]
  },
  // Quality (Phases 9-10)
  {
    id: 'inline-qc',
    label: 'Quality',
    icon: Factory,
    children: [
      { id: 'inline-qc', label: 'Inline QC' },
      { id: 'midline-qc', label: 'Midline QC' },
      { id: 'final-inspection', label: 'Final Inspection' },
      { id: 'testing', label: 'Testing' },
      { id: 'compliance', label: 'Compliance' },
    ]
  },
  // Logistics (Phases 11-12)
  {
    id: 'packing',
    label: 'Logistics',
    icon: Package,
    children: [
      { id: 'packing', label: 'Packing' },
      { id: 'shipments', label: 'Shipments' },
      { id: 'export-docs', label: 'Export Docs' },
      { id: 'invoices', label: 'Invoices' },
    ]
  },
  // Finance (Phase 13)
  {
    id: 'shipment-tracking',
    label: 'Finance',
    icon: TrendingUp,
    children: [
      { id: 'shipment-tracking', label: 'Shipment Tracking' },
      { id: 'feedback', label: 'Feedback' },
      { id: 'payments', label: 'Payments' },
    ]
  },
  // Reports (Phase 14)
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    children: [
      { id: 'reports', label: 'Reports' },
    ]
  },
];

export type TabId = string;

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export function Sidebar({ activeTab, onTabChange, isOpen, onToggleSidebar }: SidebarProps) {
  const [expandedTabs, setExpandedTabs] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleTab = (tabId: string) => {
    const newExpanded = new Set<string>();
    // Only keep the newly toggled tab open
    if (!expandedTabs.has(tabId)) {
      newExpanded.add(tabId);
    }
    setExpandedTabs(newExpanded);
  };

  const findParentTab = (childId: string): string | null => {
    for (const tab of TABS) {
      if (tab.id === childId) return tab.id;
      if (tab.children?.some(child => child.id === childId)) return tab.id;
    }
    return null;
  };

  const isParentActive = (tabId: string): boolean => {
    const parent = findParentTab(activeTab);
    return parent === tabId;
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    // Close sidebar on mobile after selecting a tab
    if (isMobile) {
      onToggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onToggleSidebar}
        />
      )}

      <aside className={`fixed left-0 top-0 z-30 h-screen flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${isMobile
          ? isOpen ? 'w-72' : 'w-0 overflow-hidden'
          : isOpen ? 'w-64' : 'w-16'
        }`}>
        <div
          className={`flex h-16 items-center border-b border-slate-200 flex-shrink-0 ${isOpen ? 'justify-between px-4' : 'justify-center'
            }`}
        >
          {isOpen && (
            <div className="flex items-center gap-3 overflow-hidden">
              <h1 className="truncate text-lg font-bold text-slate-900">
                Apparel ERP
              </h1>
            </div>
          )}

          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 flex-shrink-0"
          >
            {isMobile && isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto overflow-x-hidden">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isExpanded = expandedTabs.has(tab.id);
            const isActive = isParentActive(tab.id);

            return (
              <div key={tab.id}>
                <button
                  onClick={() => {
                    if (tab.children) {
                      toggleTab(tab.id);
                    } else {
                      handleTabClick(tab.id);
                    }
                  }}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isOpen ? 'px-4' : 'justify-center px-0'} ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  title={tab.label}
                >
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {isOpen && tab.label}
                  {isOpen && tab.children && (
                    <ChevronDown className={`ml-auto h-4 w-4 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </button>

                {isOpen && tab.children && isExpanded && (
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    {tab.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleTabClick(child.id)}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${activeTab === child.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                          }`}
                      >
                        <ChevronRight className="h-3 w-3 flex-shrink-0" />
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}