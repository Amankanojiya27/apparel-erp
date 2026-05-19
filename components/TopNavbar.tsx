'use client';

import { Bell, User, ChevronDown, Settings } from 'lucide-react';

export function TopNavbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-20 h-16 border-b border-slate-200 bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex-1">
          {/* Search or other left-side content can go here */}
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
            <div className="text-left">
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
