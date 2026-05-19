'use client';

import { LayoutDashboard, Calendar, TrendingUp, Package, BarChart3, MessageSquare, Factory, Sparkles, FileText } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Inquiries', icon: FileText },
  { id: 'styles', label: 'Styles', icon: Package },
  { id: 'sampling', label: 'Sampling', icon: Sparkles },
  { id: 'production', label: 'Production', icon: Factory },
  { id: 'planning', label: 'Planning', icon: TrendingUp },
  { id: 'tna', label: 'TNA Calendar', icon: Calendar },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'workflow', label: 'Workflow', icon: MessageSquare },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-30 h-screen w-64 border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
          <LayoutDashboard className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Apparel ERP</h1>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
        <div className="rounded-lg bg-slate-50 p-4">
          <p className="text-xs font-medium text-slate-500">System Status</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <p className="text-sm text-slate-700">All systems operational</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
