import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ setActiveTab, onHelpClick }) => {
  return (
    <header
      id="main-app-header"
      className="fixed top-0 left-0 right-0 w-full z-50 bg-[#ffffff]/95 backdrop-blur-xl border-b border-[#eaedff] shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
    >
      <div className="max-w-md md:max-w-xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          id="brand-logo-container"
          onClick={() => setActiveTab('services')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <img
            id="brand-logo-img"
            alt="HomeCare Pro Logo"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VTRHRO-IIlEB484CZJS-7yMAaHCRCKeEsClVN-9-H5jdGvP7YRfu0BUMBsS7mMZ2LGWbyYBlzTfruf8qf4XFfmyCI4ReNviQwdJwhp7hRwI29CJwAb0wgmRUGuaqZHB7hzVULWj1_u5bI95FzPM1RhAKjjyj4eGLqe8oSe1PRghnJspx02RZeipxOgZ0VnAv3j-UCXCp94cZQOmUJTOGij2kTF8eDEGQ3uMjKMRFkH4d4nfh-9is3yjVwJ"
          />
          <span
            id="brand-title"
            className="font-semibold text-lg text-[#131b2e] tracking-tight group-hover:text-[#004ac6] transition-colors"
          >
            HomeCare Pro
          </span>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            id="btn-help-faq"
            type="button"
            aria-label="Help and FAQ"
            onClick={onHelpClick}
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#434655] hover:text-[#131b2e] hover:bg-[#eaedff] active:scale-95 transition-all"
            title="Help & Safety FAQ"
          >
            <span className="material-symbols-outlined text-[22px]">help_outline</span>
          </button>

          <button
            id="btn-profile-avatar"
            type="button"
            aria-label="Account profile"
            onClick={() => setActiveTab('account')}
            className="w-8 h-8 rounded-full bg-[#004ac6] hover:bg-[#1d4ed8] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all"
            title="My Profile"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
