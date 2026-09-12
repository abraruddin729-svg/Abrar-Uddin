import React, { useState, useEffect } from 'react';
import { ConfirmedBooking } from '../types';

interface MatchingModalProps {
  booking: ConfirmedBooking;
  onViewBooking: () => void;
  onClose: () => void;
}

export const MatchingModal: React.FC<MatchingModalProps> = ({
  booking,
  onViewBooking,
}) => {
  const [matchPhase, setMatchPhase] = useState<number>(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setMatchPhase(2), 1200);
    const timer2 = setTimeout(() => setMatchPhase(3), 2600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div
      id="matching-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="matching-modal-card"
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-[#eaedff] flex flex-col items-center text-center animate-scaleUp"
      >
        {/* Animated Radar / Pulsing Indicator */}
        <div className="relative w-20 h-20 flex items-center justify-center my-2">
          <div className="absolute inset-0 rounded-full bg-[#004ac6]/10 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#004ac6]/20 animate-pulse" />
          <div className="w-14 h-14 rounded-full bg-[#004ac6] text-white flex items-center justify-center shadow-lg shadow-[#004ac6]/30 z-10">
            {matchPhase < 3 ? (
              <span className="material-symbols-outlined text-[28px] animate-spin">
                radar
              </span>
            ) : (
              <span className="material-symbols-outlined text-[30px] text-green-300">
                check_circle
              </span>
            )}
          </div>
        </div>

        {matchPhase < 3 ? (
          <>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold tracking-wide uppercase mb-1">
              Stitch AI Matching Engine
            </span>
            <h3 className="text-xl font-bold text-[#131b2e] tracking-tight">
              Matching Top Verified Pro
            </h3>
            <p className="text-xs text-[#434655] mt-1 mb-4">
              Analyzing nearby verified {booking.service.category} technicians in Bengaluru...
            </p>

            <div className="w-full bg-[#f2f3ff] rounded-2xl p-3 flex flex-col gap-2 text-left text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">
                  check_circle
                </span>
                <span className="text-[#131b2e] font-medium">
                  Safety &amp; background verification passed
                </span>
              </div>
              <div className="flex items-center gap-2">
                {matchPhase === 1 ? (
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">
                    check_circle
                  </span>
                )}
                <span className="text-[#131b2e] font-medium">
                  Finding master technicians with 4.8+ ratings
                </span>
              </div>
              <div className="flex items-center gap-2">
                {matchPhase === 2 ? (
                  <span className="material-symbols-outlined text-[16px] text-[#004ac6] animate-spin">
                    progress_activity
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[16px] text-[#737686]">
                    schedule
                  </span>
                )}
                <span className="text-[#131b2e] font-medium">
                  Locking arrival window for{' '}
                  {booking.schedule.timeSlot.toUpperCase()}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold tracking-wide uppercase mb-1">
              Match Confirmed • Guaranteed
            </span>
            <h3 className="text-xl font-bold text-[#131b2e] tracking-tight">
              Technician Assigned!
            </h3>
            <p className="text-xs text-[#434655] mt-0.5 mb-3">
              Booking Ref: <strong className="text-[#004ac6]">{booking.id}</strong>
            </p>

            {/* Assigned Technician Profile Box */}
            <div className="w-full bg-[#faf8ff] border border-[#eaedff] rounded-2xl p-3.5 flex flex-col gap-2 text-left">
              <div className="flex items-center gap-3">
                <img
                  src={booking.pro.photo}
                  alt={booking.pro.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#004ac6]"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-[#131b2e]">
                      {booking.pro.name}
                    </span>
                    <span
                      className="material-symbols-outlined text-[#004ac6] text-[16px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      verified
                    </span>
                  </div>
                  <span className="text-[11px] text-[#004ac6] font-semibold">
                    {booking.pro.title}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#434655]">
                    <span className="text-amber-500 font-bold">★ {booking.pro.rating}</span>
                    <span>•</span>
                    <span>{booking.pro.completedJobs}+ jobs</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#eaedff] flex items-center justify-between text-[11px] text-[#434655]">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#004ac6]">
                    near_me
                  </span>
                  <span>ETA: ~{booking.pro.etaMinutes} mins</span>
                </span>
                <span className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded font-mono font-bold">
                  OTP: {booking.otp}
                </span>
              </div>
            </div>

            <button
              id="btn-view-booking-after-match"
              type="button"
              onClick={onViewBooking}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-[#004ac6] hover:bg-[#1d4ed8] text-white text-[14px] font-bold shadow-md shadow-[#004ac6]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <span>Track Live Booking &amp; Details</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
