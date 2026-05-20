'use client';

import { LayoutDashboard, Calendar, TrendingUp, Package, BarChart3, MessageSquare, Factory, Sparkles, FileText, Menu } from 'lucide-react';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inquiries', label: 'Inquiries', icon: FileText },
  { id: 'styles', label: 'Styles', icon: Package },
  { id: 'sampling', label: 'Sampling', icon: Sparkles },
  { id: 'production', label: 'Production', icon: Factory },
  { id: 'planning', label: 'Planning', icon: TrendingUp },
  { id: 'tna', label: 'TNA Calendar', icon: Calendar },
  { id: 'workflow', label: 'Workflow', icon: MessageSquare },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export function Sidebar({ activeTab, onTabChange, isOpen, onToggleSidebar }: SidebarProps) {
  return (
    <aside className={`fixed left-0 top-0 z-30 h-screen border-r border-slate-200 bg-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
      <div
        className={`flex h-16 items-center border-b border-slate-200 ${isOpen ? 'justify-between px-4' : 'justify-center'
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
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${isOpen ? 'px-4' : 'justify-center px-0'} ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              title={tab.label}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {isOpen && tab.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}