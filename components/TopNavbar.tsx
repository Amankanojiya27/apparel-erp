'use client';

import { Bell, User, ChevronDown, Settings, Menu } from 'lucide-react';

interface TopNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar?: () => void;
}

export function TopNavbar({ isSidebarOpen, onToggleSidebar }: TopNavbarProps) {
  return (
    <header className={`fixed right-0 top-0 z-20 h-16 border-b border-slate-200 bg-white shadow-sm transition-all duration-300 ${isSidebarOpen ? 'left-64' : 'left-16'} md:left-0`}>
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button 
            onClick={onToggleSidebar}
            className="md:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-900">John Merchant</p>
              <p className="text-xs text-slate-500">Senior Merchant</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>

          {/* Settings */}
          <button className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
