import React, { useState } from 'react';
import { ConfirmedBooking } from '../types';

interface BookingsViewProps {
  bookings: ConfirmedBooking[];
  onBookNew: () => void;
  onCancelBooking: (id: string) => void;
}

export const BookingsView: React.FC<BookingsViewProps> = ({
  bookings,
  onBookNew,
  onCancelBooking,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const activeBookings = bookings.filter((b) => b.status !== 'Completed');
  const pastBookings = bookings.filter((b) => b.status === 'Completed');
  const displayed = activeTab === 'active' ? activeBookings : pastBookings;

  const handleCall = (name: string, phone: string) => {
    setActionNotice(`Calling ${name} (${phone})...`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleInvoice = (id: string) => {
    setActionNotice(`Invoice for ${id} generated & sent to email.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div id="bookings-view-container" className="px-4 pt-5 pb-28 flex flex-col gap-4 max-w-md mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-bold text-[#131b2e] tracking-tight">
            My Bookings
          </h1>
          <p className="text-[13px] text-[#434655]">
            Track verified professionals &amp; service history
          </p>
        </div>
        <button
          type="button"
          onClick={onBookNew}
          className="px-3 py-1.5 rounded-full bg-[#004ac6] text-white text-[12px] font-bold shadow-xs hover:bg-[#1d4ed8] active:scale-95 transition-all flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Book Service</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
          <span className="material-symbols-outlined text-[18px] text-emerald-600">
            check_circle
          </span>
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Tabs Filter */}
      <div className="flex bg-[#eaedff] p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'active'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Active ({activeBookings.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
            activeTab === 'completed'
              ? 'bg-white text-[#004ac6] shadow-xs'
              : 'text-[#434655] hover:text-[#131b2e]'
          }`}
        >
          Past / Completed ({pastBookings.length})
        </button>
      </div>

      {/* List */}
      {displayed.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-[#eaedff] text-center flex flex-col items-center gap-3 shadow-xs my-4">
          <div className="w-14 h-14 rounded-full bg-[#eaedff] text-[#004ac6] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">receipt_long</span>
          </div>
          <h3 className="text-base font-bold text-[#131b2e]">No {activeTab} bookings</h3>
          <p className="text-xs text-[#434655] max-w-xs leading-relaxed">
            Need something fixed at home? Choose from our verified electricians, plumbers, painters, and more.
          </p>
          <button
            type="button"
            onClick={onBookNew}
            className="mt-2 px-5 py-2.5 rounded-xl bg-[#004ac6] text-white text-xs font-bold shadow-sm hover:bg-[#1d4ed8] transition-all"
          >
            Start a Booking Request
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
          {displayed.map((booking) => (
            <div
              key={booking.id}
              id={`booking-card-${booking.id}`}
              className="bg-white rounded-2xl p-4 border border-[#eaedff] shadow-sm flex flex-col gap-3 relative overflow-hidden"
            >
              {/* Header: Service name & Status */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-bold text-[#131b2e] capitalize">
                      {booking.service.category} Service
                    </span>
                    <span className="text-[10px] bg-[#dbe1ff] text-[#00174b] font-bold px-2 py-0.5 rounded-full uppercase">
                      {booking.id}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#737686]">
                    Booked on {booking.createdAt} • Arrival window:{' '}
                    <strong className="text-[#131b2e] uppercase font-semibold">
                      {booking.schedule.timeSlot}
                    </strong>
                  </span>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    booking.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-[#004ac6] animate-pulse'
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              {/* Status Progress Track */}
              <div className="w-full bg-[#f2f3ff] p-2.5 rounded-xl flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1 text-[#004ac6] font-bold">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Pro Assigned</span>
                </div>
                <div className="h-0.5 flex-1 mx-2 bg-[#004ac6]" />
                <div className="flex items-center gap-1 text-[#004ac6] font-bold">
                  <span className="material-symbols-outlined text-[16px]">navigation</span>
                  <span>En Route</span>
                </div>
                <div className="h-0.5 flex-1 mx-2 bg-slate-300" />
                <div className="flex items-center gap-1 text-[#737686]">
                  <span className="material-symbols-outlined text-[16px]">task_alt</span>
                  <span>Complete</span>
                </div>
              </div>

              {/* Technician Info */}
              <div className="bg-[#faf8ff] p-3 rounded-xl border border-[#eaedff] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={booking.pro.photo}
                    alt={booking.pro.name}
                    className="w-11 h-11 rounded-full object-cover border border-[#004ac6]"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-[#131b2e]">
                        {booking.pro.name}
                      </span>
                      <span
                        className="material-symbols-outlined text-[#004ac6] text-[14px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                    <span className="text-[11px] text-[#434655] block">
                      {booking.pro.title}
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold">
                      ★ {booking.pro.rating} ({booking.pro.completedJobs}+ jobs)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCall(booking.pro.name, booking.pro.phone)}
                    className="w-8 h-8 rounded-full bg-[#004ac6] text-white flex items-center justify-center hover:bg-[#1d4ed8] active:scale-95 transition-all shadow-xs"
                    title="Call Technician"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </button>
                </div>
              </div>

              {/* Description & Address */}
              <div className="text-xs text-[#434655] flex flex-col gap-1">
                <div>
                  <strong className="text-[#131b2e]">Problem: </strong>
                  <span>{booking.service.description}</span>
                </div>
                {booking.service.selectedIssues.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {booking.service.selectedIssues.map((issue) => (
                      <span
                        key={issue}
                        className="px-2 py-0.5 bg-[#eaedff] text-[#0039b5] rounded-md text-[10px] font-semibold"
                      >
                        {issue}
                      </span>
                    ))}
                  </div>
                )}
                <div className="pt-1 flex items-center justify-between text-[11px] text-[#737686]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">location_on</span>
                    <span>
                      {booking.contact.streetAddress}, {booking.contact.city}
                    </span>
                  </span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                    OTP: {booking.otp}
                  </span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between">
                <span className="text-xs font-bold text-[#004ac6]">
                  Est. Quote: {booking.quoteAmount}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleInvoice(booking.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#434655] hover:text-[#004ac6]"
                  >
                    Invoice
                  </button>
                  {booking.status !== 'Completed' && (
                    <button
                      type="button"
                      onClick={() => onCancelBooking(booking.id)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
