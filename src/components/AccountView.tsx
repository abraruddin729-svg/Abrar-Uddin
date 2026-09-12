import React, { useState } from 'react';
import { ContactInfo } from '../types';

interface AccountViewProps {
  contact: ContactInfo;
  setContact: React.Dispatch<React.SetStateAction<ContactInfo>>;
}

export const AccountView: React.FC<AccountViewProps> = ({ contact, setContact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveAlert, setSaveAlert] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    setSaveAlert('Profile information updated successfully.');
    setTimeout(() => setSaveAlert(null), 3000);
  };

  return (
    <div id="account-view-container" className="px-4 pt-5 pb-28 flex flex-col gap-4 max-w-md mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-[22px] font-bold text-[#131b2e] tracking-tight">
          Account &amp; Safety Profile
        </h1>
        <button
          type="button"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-bold text-[#004ac6] hover:underline"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {saveAlert && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-emerald-600">
            check_circle
          </span>
          <span>{saveAlert}</span>
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-sm flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-full bg-[#004ac6] text-white flex items-center justify-center font-bold text-xl shadow-sm">
          {contact.fullName ? contact.fullName.charAt(0).toUpperCase() : 'R'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-bold text-[#131b2e]">
              {contact.fullName || 'Rahul Sharma'}
            </span>
            <span
              className="material-symbols-outlined text-[#004ac6] text-[18px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <span className="text-xs text-[#434655] block">
            +91 {contact.phone || '98765 43210'}
          </span>
          <span className="text-[11px] text-[#737686] block truncate">
            {contact.email || 'rahul.sharma@example.com'}
          </span>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wide">
          Gold Member
        </span>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-sm flex flex-col gap-3">
          <span className="text-xs font-bold text-[#131b2e]">Edit Contact Details</span>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#434655]">Full Name</label>
            <input
              type="text"
              value={contact.fullName}
              onChange={(e) => setContact((p) => ({ ...p, fullName: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-[#eaedff] text-xs outline-none focus:border-[#004ac6]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#434655]">Phone Number</label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact((p) => ({ ...p, phone: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-[#eaedff] text-xs outline-none focus:border-[#004ac6]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-[#434655]">Email</label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => setContact((p) => ({ ...p, email: e.target.value }))}
              className="h-10 px-3 rounded-lg border border-[#eaedff] text-xs outline-none focus:border-[#004ac6]"
            />
          </div>
          <button
            type="submit"
            className="mt-2 py-2.5 bg-[#004ac6] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#1d4ed8]"
          >
            Save Changes
          </button>
        </form>
      ) : null}

      {/* Trust & Verification Checklist */}
      <div className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-sm flex flex-col gap-2.5">
        <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
          Safety &amp; Protection Status
        </span>
        <div className="flex items-center justify-between text-xs py-1 border-b border-[#eaedff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">
              check_circle
            </span>
            <span>OTP Security Verification</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Active</span>
        </div>
        <div className="flex items-center justify-between text-xs py-1 border-b border-[#eaedff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">
              check_circle
            </span>
            <span>HomeCare ₹50,000 Damage Cover</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Insured</span>
        </div>
        <div className="flex items-center justify-between text-xs py-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">
              check_circle
            </span>
            <span>Zero Upfront Deposit Rule</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold">Guaranteed</span>
        </div>
      </div>

      {/* Saved Addresses */}
      <div className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-sm flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#131b2e] uppercase tracking-wider">
            Saved Addresses
          </span>
          <span className="text-[11px] text-[#004ac6] font-semibold cursor-pointer">
            + Add New
          </span>
        </div>
        <div className="p-3 bg-[#f2f3ff] rounded-xl flex items-start gap-2.5">
          <span className="material-symbols-outlined text-[#004ac6] text-[18px] mt-0.5">
            home
          </span>
          <div className="flex-1 text-xs">
            <strong className="text-[#131b2e] font-semibold">Home (Default)</strong>
            <p className="text-[#434655] mt-0.5">
              {contact.streetAddress || 'Flat 304, Emerald Heights'},{' '}
              {contact.areaLandmark || '12th Main, HAL 2nd Stage'},{' '}
              {contact.city || 'Bengaluru'} - {contact.pincode || '560008'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
