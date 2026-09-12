import React from 'react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  bookingsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  bookingsCount = 0,
}) => {
  return (
    <nav
      id="main-bottom-nav"
      className="fixed bottom-0 left-0 right-0 w-full z-50 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#eaedff] shadow-[0_-4px_20px_-2px_rgba(15,23,42,0.06)] pb-safe"
    >
      <div className="max-w-md md:max-w-xl mx-auto flex justify-around items-center h-16 px-4">
        {/* Tab 1: Services */}
        <button
          id="nav-tab-services"
          type="button"
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-13 transition-all relative ${
            activeTab === 'services'
              ? 'text-[#004ac6] font-bold scale-105'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">home_repair_service</span>
          <span className="text-[11px] tracking-tight">Services</span>
          {activeTab === 'services' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] absolute -bottom-0.5"></span>
          )}
        </button>

        {/* Tab 2: Bookings */}
        <button
          id="nav-tab-bookings"
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-13 transition-all relative ${
            activeTab === 'bookings'
              ? 'text-[#004ac6] font-bold scale-105'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          <div className="relative">
            <span className="material-symbols-outlined text-[24px]">calendar_month</span>
            {bookingsCount > 0 && (
              <span
                id="bookings-badge-count"
                className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#004ac6] text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse"
              >
                {bookingsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-tight">Bookings</span>
          {activeTab === 'bookings' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] absolute -bottom-0.5"></span>
          )}
        </button>

        {/* Tab 3: Support */}
        <button
          id="nav-tab-support"
          type="button"
          onClick={() => setActiveTab('support')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-13 transition-all relative ${
            activeTab === 'support'
              ? 'text-[#004ac6] font-bold scale-105'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">chat_bubble_outline</span>
          <span className="text-[11px] tracking-tight">Support</span>
          {activeTab === 'support' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] absolute -bottom-0.5"></span>
          )}
        </button>

        {/* Tab 4: Account */}
        <button
          id="nav-tab-account"
          type="button"
          onClick={() => setActiveTab('account')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-13 transition-all relative ${
            activeTab === 'account'
              ? 'text-[#004ac6] font-bold scale-105'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
          <span className="text-[11px] tracking-tight">Account</span>
          {activeTab === 'account' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] absolute -bottom-0.5"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
