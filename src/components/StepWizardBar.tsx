import React from 'react';
import { WizardStep } from '../types';

interface StepWizardBarProps {
  currentStep: WizardStep;
  onStepClick: (step: WizardStep) => void;
}

export const StepWizardBar: React.FC<StepWizardBarProps> = ({ currentStep, onStepClick }) => {
  return (
    <div
      id="step-wizard-bar"
      className="w-full bg-[#ffffff] shadow-sm px-4 py-3.5 border-b border-[#eaedff]"
    >
      <div className="relative flex items-center justify-between max-w-md mx-auto">
        {/* Background Connecting Tracks */}
        <div className="absolute left-6 right-6 top-3.5 h-[2px] -translate-y-1/2 bg-[#dae2fd] z-0" />
        <div
          className="absolute left-6 top-3.5 h-[2px] -translate-y-1/2 bg-[#004ac6] z-0 transition-all duration-300"
          style={{
            width:
              currentStep === 1
                ? '0%'
                : currentStep === 2
                ? '50%'
                : 'calc(100% - 48px)',
          }}
        />

        {/* Step 1: Contact Info */}
        <button
          id="wizard-step-1-btn"
          type="button"
          onClick={() => onStepClick(1)}
          className="relative z-10 flex flex-col items-center group cursor-pointer text-left focus:outline-none"
        >
          {currentStep > 1 ? (
            <div className="w-7 h-7 rounded-full bg-[#004ac6] flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#004ac6] text-white text-[13px] font-bold flex items-center justify-center shadow-md shadow-[#004ac6]/25 ring-2 ring-[#dbe1ff]">
              1
            </div>
          )}
          <span
            className={`mt-1 text-[11px] font-semibold text-center transition-colors ${
              currentStep === 1 ? 'text-[#004ac6]' : 'text-[#131b2e]'
            }`}
          >
            Contact Info
          </span>
          <span
            className={`text-[10px] tracking-wider uppercase font-bold ${
              currentStep > 1
                ? 'text-[#004ac6]'
                : currentStep === 1
                ? 'text-[#004ac6]'
                : 'text-[#737686]'
            }`}
          >
            {currentStep > 1 ? 'Completed' : 'Step 1'}
          </span>
        </button>

        {/* Step 2: Service Needed */}
        <button
          id="wizard-step-2-btn"
          type="button"
          onClick={() => currentStep >= 2 && onStepClick(2)}
          disabled={currentStep < 2}
          className={`relative z-10 flex flex-col items-center group text-left focus:outline-none ${
            currentStep < 2 ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {currentStep > 2 ? (
            <div className="w-7 h-7 rounded-full bg-[#004ac6] flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
              <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>
            </div>
          ) : currentStep === 2 ? (
            <div className="w-7 h-7 rounded-full bg-[#ffffff] ring-2 ring-[#004ac6] flex items-center justify-center shadow-sm">
              <div className="w-5 h-5 rounded-full bg-[#004ac6] flex items-center justify-center">
                <span className="text-[11px] text-white font-bold">2</span>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#434655] font-bold text-[12px]">
              2
            </div>
          )}
          <span
            className={`mt-1 text-[11px] text-center transition-colors ${
              currentStep === 2 ? 'text-[#004ac6] font-bold' : 'text-[#737686]'
            }`}
          >
            Service Needed
          </span>
          <span
            className={`text-[10px] tracking-wider uppercase font-bold ${
              currentStep > 2
                ? 'text-[#737686]'
                : currentStep === 2
                ? 'text-[#004ac6]'
                : 'text-[#737686]'
            }`}
          >
            {currentStep > 2 ? 'Completed' : 'Step 2'}
          </span>
        </button>

        {/* Step 3: Budget Range */}
        <button
          id="wizard-step-3-btn"
          type="button"
          onClick={() => currentStep >= 3 && onStepClick(3)}
          disabled={currentStep < 3}
          className={`relative z-10 flex flex-col items-center group text-left focus:outline-none ${
            currentStep < 3 ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          {currentStep === 3 ? (
            <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md ring-4 ring-[#dbe1ff]">
              <span className="text-[12px] font-bold">3</span>
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#434655] font-bold text-[12px]">
              3
            </div>
          )}
          <span
            className={`mt-1 text-[11px] text-center transition-colors ${
              currentStep === 3 ? 'text-[#004ac6] font-bold' : 'text-[#737686]'
            }`}
          >
            Budget Range
          </span>
          <span
            className={`text-[10px] tracking-wider uppercase ${
              currentStep === 3 ? 'text-[#004ac6] font-bold' : 'text-[#737686]'
            }`}
          >
            Step 3
          </span>
        </button>
      </div>
    </div>
  );
};
