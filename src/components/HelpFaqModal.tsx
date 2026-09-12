import React from 'react';

interface HelpFaqModalProps {
  onClose: () => void;
  onGoToSupport: () => void;
}

export const HelpFaqModal: React.FC<HelpFaqModalProps> = ({
  onClose,
  onGoToSupport,
}) => {
  return (
    <div
      id="help-modal-overlay"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        id="help-modal-content"
        className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl border border-[#eaedff] flex flex-col gap-4 max-h-[85vh] overflow-y-auto animate-scaleUp"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#eaedff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004ac6] text-[24px]">
              help_outline
            </span>
            <h2 className="text-base font-bold text-[#131b2e]">
              HomeCare Pro Guide &amp; FAQ
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eaedff] text-[#434655] hover:text-[#131b2e] flex items-center justify-center font-bold text-lg"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3 text-xs text-[#434655]">
          <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-1">
            <strong className="text-[#131b2e] text-[13px]">
              1. How does Stitch AI Talk Assistant work?
            </strong>
            <p className="leading-relaxed">
              Simply tap the mic button or type your problem (e.g. &ldquo;ceiling fan sparking and breaker tripped&rdquo;). Our AI categorizes the fault, checks urgency, and suggests relevant task items automatically.
            </p>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-1">
            <strong className="text-[#131b2e] text-[13px]">
              2. Do I need to pay any upfront fee?
            </strong>
            <p className="leading-relaxed">
              No! HomeCare Pro operates on a zero upfront payment policy. You review the fixed rate quote and pay securely only after the technician finishes the job to your satisfaction.
            </p>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-1">
            <strong className="text-[#131b2e] text-[13px]">
              3. How are technicians verified?
            </strong>
            <p className="leading-relaxed">
              Every contractor undergoes a strict 5-stage background check, police verification, identity check, trade license check, and skill audit.
            </p>
          </div>

          <div className="bg-[#f2f3ff] p-3 rounded-xl flex flex-col gap-1">
            <strong className="text-[#131b2e] text-[13px]">
              4. What is the Security OTP?
            </strong>
            <p className="leading-relaxed">
              When the pro arrives at your door, verify their identity by checking that their app matches the 4-digit arrival OTP shown on your screen.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onGoToSupport();
            }}
            className="flex-1 py-3 bg-[#004ac6] hover:bg-[#1d4ed8] text-white text-xs font-bold rounded-xl text-center shadow-xs transition-all"
          >
            Chat with AI Support
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-3 bg-[#eaedff] text-[#131b2e] text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
