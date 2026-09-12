import React, { useState } from 'react';
import { ScheduleDetails, ServiceDetails } from '../types';
import { BUDGET_TIERS, SERVICE_CATEGORIES } from '../data/services';

interface Step3BudgetProps {
  service: ServiceDetails;
  schedule: ScheduleDetails;
  setSchedule: React.Dispatch<React.SetStateAction<ScheduleDetails>>;
  onBack: () => void;
  onConfirm: () => void;
}

export const Step3Budget: React.FC<Step3BudgetProps> = ({
  service,
  schedule,
  setSchedule,
  onBack,
  onConfirm,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const activeCategory =
    SERVICE_CATEGORIES.find((c) => c.id === service.category) ||
    SERVICE_CATEGORIES[0];

  const detectedNeed =
    service.description.trim() ||
    (service.selectedIssues.length > 0
      ? service.selectedIssues.join(', ')
      : 'Sparking switchboard & breaker trip');

  const recommendedPro =
    service.aiDiagnosis?.recommendedPro || activeCategory.recommendedPro;

  const isUrgent =
    schedule.appointmentDay === 'today' ||
    service.aiDiagnosis?.priority === 'High Priority';

  return (
    <div id="step-3-container" className="px-4 pt-5 pb-32 flex flex-col gap-5 max-w-md mx-auto w-full">
      {/* Section Title & Meta */}
      <div className="flex flex-col gap-1.5">
        <div
          id="badge-step-3"
          className="inline-flex items-center gap-1.5 bg-[#dce1ff] text-[#0039b5] px-2.5 py-1 rounded-full w-fit"
        >
          <span
            className="material-symbols-outlined text-[14px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified
          </span>
          <span className="text-[11px] font-bold tracking-wide">
            Step 3 of 3 • Final Step
          </span>
        </div>
        <h1
          id="heading-budget-schedule"
          className="text-[26px] leading-8 font-bold text-[#131b2e] tracking-tight"
        >
          Budget &amp; Preferred Schedule
        </h1>
        <p className="text-[14px] text-[#434655] leading-5">
          Select an estimated budget tier and your preferred appointment time.
        </p>
      </div>

      {/* Budget Range Options */}
      <div id="budget-group" className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-[12px] font-bold text-[#434655] uppercase tracking-wider">
            Estimated Budget Scope
          </span>
          <span className="text-[12px] text-[#737686]">No upfront fee</span>
        </div>

        {BUDGET_TIERS.map((tier) => {
          const isSelected = schedule.budgetTier === tier.id;
          return (
            <label
              key={tier.id}
              id={`budget-tier-card-${tier.id}`}
              onClick={() =>
                setSchedule((prev) => ({ ...prev, budgetTier: tier.id }))
              }
              className={`budget-card relative flex items-start gap-3.5 p-3.5 rounded-2xl cursor-pointer transition-all duration-150 ${
                isSelected
                  ? 'bg-[#dbe1ff]/30 shadow-md ring-2 ring-[#004ac6] border-transparent'
                  : 'bg-[#ffffff] border border-[#eaedff] shadow-sm hover:bg-[#f2f3ff]'
              }`}
            >
              <input
                type="radio"
                name="budget_tier"
                value={tier.id}
                checked={isSelected}
                onChange={() => {}}
                className="sr-only"
              />

              {/* Radio Disc */}
              <div
                className={`radio-disc mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isSelected ? 'bg-[#004ac6]' : 'bg-[#dae2fd]'
                }`}
              >
                <div
                  className={`inner-dot w-2 h-2 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`text-[17px] font-bold tracking-tight ${
                      isSelected ? 'text-[#004ac6]' : 'text-[#131b2e]'
                    }`}
                  >
                    {tier.range}
                  </span>
                  {tier.isPopular && (
                    <span className="inline-flex items-center gap-1 bg-[#004ac6] text-white px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase font-bold shadow-xs">
                      <span className="material-symbols-outlined text-[12px]">
                        local_fire_department
                      </span>
                      <span>Most Popular</span>
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#434655] mt-1 leading-snug">
                  {tier.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>

      {/* Preferred Date & Time Section */}
      <div id="preferred-schedule-section" className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
            calendar_clock
          </span>
          <h2 className="text-[18px] font-bold text-[#131b2e]">
            Preferred Date &amp; Time
          </h2>
        </div>

        {/* Date Pills (Horizontal Scroll) */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-semibold text-[#434655]">
            Appointment Day
          </span>
          <div
            id="date-selector"
            className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1"
          >
            {/* Today */}
            <button
              id="date-chip-today"
              type="button"
              onClick={() =>
                setSchedule((prev) => ({ ...prev, appointmentDay: 'today' }))
              }
              className={`date-chip shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all shadow-xs ${
                schedule.appointmentDay === 'today'
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#ffffff] border border-[#eaedff] text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              Today (Urgent)
            </button>

            {/* Tomorrow */}
            <button
              id="date-chip-tomorrow"
              type="button"
              onClick={() =>
                setSchedule((prev) => ({ ...prev, appointmentDay: 'tomorrow' }))
              }
              className={`date-chip shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1.5 transition-all shadow-xs ${
                schedule.appointmentDay === 'tomorrow'
                  ? 'bg-[#004ac6] text-white shadow-sm'
                  : 'bg-[#ffffff] border border-[#eaedff] text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-amber-300">
                stars
              </span>
              <span>Tomorrow, Oct 25 (Recommended)</span>
            </button>

            {/* Saturday */}
            <button
              id="date-chip-saturday"
              type="button"
              onClick={() =>
                setSchedule((prev) => ({ ...prev, appointmentDay: 'saturday' }))
              }
              className={`date-chip shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all shadow-xs ${
                schedule.appointmentDay === 'saturday'
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#ffffff] border border-[#eaedff] text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              Saturday, Oct 26
            </button>

            {/* Choose Date */}
            <button
              id="date-chip-custom"
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`date-chip shrink-0 px-3.5 py-2 rounded-full text-[13px] font-semibold flex items-center gap-1 transition-all shadow-xs ${
                schedule.appointmentDay === 'custom'
                  ? 'bg-[#004ac6] text-white'
                  : 'bg-[#ffffff] border border-[#eaedff] text-[#131b2e] hover:bg-[#eaedff]'
              }`}
            >
              <span>{schedule.customDate || 'Choose Date'}</span>
              <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
            </button>
          </div>

          {showDatePicker && (
            <div className="p-3 bg-white rounded-xl border border-[#eaedff] shadow-sm flex items-center gap-2 mt-1">
              <input
                type="date"
                id="custom-date-input"
                className="text-xs p-2 border border-slate-200 rounded-lg outline-none flex-1"
                onChange={(e) => {
                  setSchedule((prev) => ({
                    ...prev,
                    appointmentDay: 'custom',
                    customDate: e.target.value,
                  }));
                  setShowDatePicker(false);
                }}
              />
            </div>
          )}
        </div>

        {/* Time Slot Selector */}
        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-[12px] font-semibold text-[#434655]">
            Convenient Arrival Window
          </span>
          <div id="slot-selector" className="grid grid-cols-1 gap-2">
            {/* Morning */}
            <button
              id="slot-chip-morning"
              type="button"
              onClick={() =>
                setSchedule((prev) => ({ ...prev, timeSlot: 'morning' }))
              }
              className={`slot-chip flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left ${
                schedule.timeSlot === 'morning'
                  ? 'bg-[#dce1ff] text-[#0039b5] shadow-sm ring-2 ring-[#004ac6]'
                  : 'bg-[#ffffff] border border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    schedule.timeSlot === 'morning' ? 'text-[#004ac6]' : 'text-[#737686]'
                  }`}
                >
                  wb_twilight
                </span>
                <span
                  className={`text-[14px] ${
                    schedule.timeSlot === 'morning' ? 'font-bold text-[#004ac6]' : 'font-semibold'
                  }`}
                >
                  Morning
                </span>
              </div>
              <span
                className={`text-[12px] ${
                  schedule.timeSlot === 'morning' ? 'font-bold text-[#004ac6]' : 'text-[#434655]'
                }`}
              >
                9 AM - 12 PM
              </span>
            </button>

            {/* Afternoon (Default) */}
            <button
              id="slot-chip-afternoon"
              type="button"
              onClick={() =>
                setSchedule((prev) => ({ ...prev, timeSlot: 'afternoon' }))
              }
              className={`slot-chip flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left ${
                schedule.timeSlot === 'afternoon'
                  ? 'bg-[#dce1ff] text-[#0039b5] shadow-sm ring-2 ring-[#004ac6]'
                  : 'bg-[#ffffff] border border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    schedule.timeSlot === 'afternoon' ? 'text-[#004ac6]' : 'text-[#737686]'
                  }`}
                >
                  light_mode
                </span>
                <span
                  className={`text-[14px] ${
                    schedule.timeSlot === 'afternoon' ? 'font-bold text-[#004ac6]' : 'font-semibold'
                  }`}
                >
                  Afternoon
                </span>
              </div>
              <span
                className={`text-[12px] ${
                  schedule.timeSlot === 'afternoon' ? 'font-bold text-[#004ac6]' : 'text-[#434655]'
                }`}
              >
                12 PM - 4 PM
              </span>
            </button>

            {/* Evening */}
            <button
              id="slot-chip-evening"
              type="button"
              onClick={() =>
                setSchedule((prev) => ({ ...prev, timeSlot: 'evening' }))
              }
              className={`slot-chip flex items-center justify-between px-3.5 py-3 rounded-xl transition-all text-left ${
                schedule.timeSlot === 'evening'
                  ? 'bg-[#dce1ff] text-[#0039b5] shadow-sm ring-2 ring-[#004ac6]'
                  : 'bg-[#ffffff] border border-[#eaedff] text-[#131b2e] hover:bg-[#f2f3ff]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    schedule.timeSlot === 'evening' ? 'text-[#004ac6]' : 'text-[#737686]'
                  }`}
                >
                  bedtime
                </span>
                <span
                  className={`text-[14px] ${
                    schedule.timeSlot === 'evening' ? 'font-bold text-[#004ac6]' : 'font-semibold'
                  }`}
                >
                  Evening
                </span>
              </div>
              <span
                className={`text-[12px] ${
                  schedule.timeSlot === 'evening' ? 'font-bold text-[#004ac6]' : 'text-[#434655]'
                }`}
              >
                4 PM - 8 PM
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* AI Match Score Card */}
      <div
        id="ai-match-card"
        className="flex flex-col gap-2.5 p-4 rounded-2xl bg-[#ffffff] border border-[#b4c5ff] shadow-sm ring-2 ring-[#004ac6]/15"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1 text-[#004ac6] font-bold text-[14px]">
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            <span>AI Match Score: 98%</span>
          </div>
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              isUrgent ? 'bg-amber-100 text-amber-800' : 'bg-[#dce1ff] text-[#0039b5]'
            }`}
          >
            {isUrgent ? 'High Priority' : 'Verified Pro Match'}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#dae2fd] h-2 rounded-full overflow-hidden">
          <div className="bg-[#004ac6] h-full rounded-full w-[98%] transition-all duration-500" />
        </div>

        {/* Detected Details */}
        <div className="flex flex-col gap-1.5 pt-1 text-[12px]">
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[16px] mt-0.5 shrink-0">
              check_circle
            </span>
            <span className="text-[#131b2e] leading-snug">
              <strong className="font-semibold">Detected Need:</strong>{' '}
              {detectedNeed}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[16px] mt-0.5 shrink-0">
              verified_user
            </span>
            <span className="text-[#131b2e] leading-snug">
              <strong className="font-semibold">Recommended Pro:</strong>{' '}
              {recommendedPro}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 text-[#434655] text-[11px] border-t border-[#eaedff]">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#005b7c]">timer</span>
            <span>Est. Arrival &lt; 45 mins</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-[#005b7c]">
              receipt_long
            </span>
            <span>Instant Quote Guarantee</span>
          </span>
        </div>
      </div>

      {/* Trust & Price Protection Card */}
      <div
        id="price-protection-card"
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#e2e7ff]/70 border border-[#eaedff] shadow-xs"
      >
        <div className="w-10 h-10 rounded-full bg-[#ffffff] text-[#005b7c] flex items-center justify-center shrink-0 shadow-xs">
          <span className="material-symbols-outlined text-[22px]">shield_with_heart</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-[#131b2e]">
            HomeCare Price Protection
          </span>
          <span className="text-[12px] text-[#434655] leading-snug">
            Fixed transparent quotes • Pay only after work completion
          </span>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div
        id="bottom-action-bar-step-3"
        className="fixed bottom-16 left-0 w-full z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#eaedff] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3"
      >
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Back Button */}
          <button
            id="btn-step-3-back"
            type="button"
            onClick={onBack}
            className="w-1/3 py-3.5 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-[0.98] text-[#131b2e] text-[15px] font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back</span>
          </button>
          {/* Confirm & Match CTA */}
          <button
            id="btn-step-3-confirm"
            type="button"
            onClick={onConfirm}
            className="w-2/3 py-3.5 px-4 rounded-xl bg-[#004ac6] hover:bg-[#1d4ed8] active:scale-[0.98] text-white text-[13px] sm:text-[14px] font-bold shadow-md shadow-[#004ac6]/25 flex items-center justify-center gap-1.5 transition-all text-center leading-tight"
          >
            <span>Confirm &amp; Match Professionals (AI Guaranteed)</span>
            <span className="material-symbols-outlined text-[18px] shrink-0">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
