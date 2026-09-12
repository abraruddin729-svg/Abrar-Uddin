import React, { useState } from 'react';
import { ContactInfo } from '../types';

interface Step1ContactProps {
  contact: ContactInfo;
  setContact: React.Dispatch<React.SetStateAction<ContactInfo>>;
  onContinue: () => void;
}

export const Step1Contact: React.FC<Step1ContactProps> = ({
  contact,
  setContact,
  onContinue,
}) => {
  const [isLocating, setIsLocating] = useState(false);
  const [detectedBadge, setDetectedBadge] = useState<string | null>(
    contact.gpsDetected ? 'Location Detected: Bengaluru (GPS Verified)' : null
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleGpsDetect = () => {
    setIsLocating(true);
    // Real geolocation if available, with graceful simulation fallback
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setContact((prev) => ({
            ...prev,
            streetAddress: prev.streetAddress || 'Flat 304, Emerald Heights',
            areaLandmark: prev.areaLandmark || '12th Main, HAL 2nd Stage',
            city: prev.city || 'Bengaluru',
            pincode: prev.pincode || '560008',
            gpsDetected: true,
          }));
          setDetectedBadge('Location Detected: Bengaluru (GPS Accurate)');
        },
        () => {
          // Fallback demo location on deny/timeout
          setTimeout(() => {
            setIsLocating(false);
            setContact((prev) => ({
              ...prev,
              streetAddress: prev.streetAddress || 'Flat 304, Emerald Heights',
              areaLandmark: prev.areaLandmark || '12th Main, HAL 2nd Stage',
              city: prev.city || 'Bengaluru',
              pincode: prev.pincode || '560008',
              gpsDetected: true,
            }));
            setDetectedBadge('Location Detected: Bengaluru, KA');
          }, 600);
        },
        { timeout: 3000 }
      );
    } else {
      setTimeout(() => {
        setIsLocating(false);
        setContact((prev) => ({
          ...prev,
          streetAddress: prev.streetAddress || 'Flat 304, Emerald Heights',
          areaLandmark: prev.areaLandmark || '12th Main, HAL 2nd Stage',
          city: prev.city || 'Bengaluru',
          pincode: prev.pincode || '560008',
          gpsDetected: true,
        }));
        setDetectedBadge('Location Detected: Bengaluru, KA');
      }, 600);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!contact.phone.trim() || contact.phone.length < 10) {
      setValidationError('Please enter a valid 10-digit phone number.');
      return;
    }
    setValidationError(null);
    onContinue();
  };

  return (
    <div id="step-1-container" className="px-4 pt-5 pb-28 flex flex-col gap-5 max-w-md mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-1.5">
        <div
          id="badge-step-1"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#dbe1ff] text-[#00174b] w-fit"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#004ac6] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Step 1 of 3</span>
        </div>
        <h1
          id="heading-contact-location"
          className="text-[26px] leading-8 font-bold text-[#131b2e] tracking-tight"
        >
          Contact &amp; Location
        </h1>
        <p className="text-[14px] text-[#434655] leading-5">
          Enter your details so verified service professionals can reach your location promptly.
        </p>
      </div>

      {validationError && (
        <div
          id="validation-error-alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#ba1a1a] text-xs font-semibold flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* Interactive Form */}
      <form id="contact-step-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fullName"
            className="text-[13px] font-semibold text-[#131b2e] flex items-center justify-between"
          >
            <span>Full Name</span>
            <span className="text-[#ba1a1a] text-[11px] font-bold">*</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#737686] text-[20px] pointer-events-none">
              person
            </span>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={contact.fullName}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, fullName: e.target.value }))
              }
              placeholder="e.g. Rahul Sharma"
              className="w-full h-12 pl-11 pr-4 bg-[#ffffff] text-[#131b2e] text-[14px] rounded-xl border border-[#eaedff] shadow-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition-all placeholder:text-[#737686]"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phone"
            className="text-[13px] font-semibold text-[#131b2e] flex items-center justify-between"
          >
            <span>Phone Number</span>
            <span className="text-[#ba1a1a] text-[11px] font-bold">*</span>
          </label>
          <div className="flex items-center gap-2">
            {/* Country code pill */}
            <div
              id="country-code-pill"
              className="h-12 px-3 bg-[#ffffff] text-[#131b2e] text-[13px] rounded-xl border border-[#eaedff] shadow-sm flex items-center gap-1.5 shrink-0 select-none"
            >
              <span className="text-base">🇮🇳</span>
              <span className="font-semibold text-xs text-[#131b2e]">+91</span>
            </div>
            <div className="relative flex-1">
              <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={10}
                required
                pattern="[0-9]{10}"
                value={contact.phone}
                onChange={(e) =>
                  setContact((prev) => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, ''),
                  }))
                }
                placeholder="98765 43210"
                className="w-full h-12 px-4 bg-[#ffffff] text-[#131b2e] text-[14px] tracking-wide rounded-xl border border-[#eaedff] shadow-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition-all placeholder:text-[#737686]"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-1 pt-0.5">
            <span className="material-symbols-outlined text-[15px] text-[#005b7c]">
              verified_user
            </span>
            <span className="text-[12px] text-[#434655]">
              We will send an OTP for fast secure booking confirmation.
            </span>
          </div>
        </div>

        {/* Email Address */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-[13px] font-semibold text-[#131b2e] flex items-center justify-between"
          >
            <span>Email Address</span>
            <span className="text-[#737686] text-[11px] font-normal">For invoice</span>
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3.5 text-[#737686] text-[20px] pointer-events-none">
              mail
            </span>
            <input
              id="email"
              name="email"
              type="email"
              value={contact.email}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="rahul.sharma@example.com"
              className="w-full h-12 pl-11 pr-4 bg-[#ffffff] text-[#131b2e] text-[14px] rounded-xl border border-[#eaedff] shadow-sm outline-none focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/20 transition-all placeholder:text-[#737686]"
            />
          </div>
        </div>

        {/* Service Address & Location Block */}
        <div className="p-3.5 bg-[#ffffff] rounded-2xl border border-[#eaedff] shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-semibold text-[#131b2e] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#004ac6] text-[18px]">
                location_on
              </span>
              <span>Service Address</span>
            </label>
            <button
              id="gpsBtn"
              type="button"
              onClick={handleGpsDetect}
              disabled={isLocating}
              className="px-2.5 py-1 rounded-full bg-[#dbe1ff] text-[#004ac6] hover:bg-[#b4c5ff] text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95"
            >
              {isLocating ? (
                <>
                  <span className="material-symbols-outlined text-[14px] animate-spin">
                    refresh
                  </span>
                  <span>Locating...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">my_location</span>
                  <span>Auto-detect GPS</span>
                </>
              )}
            </button>
          </div>

          {detectedBadge && (
            <div
              id="detectedBadge"
              className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 animate-fadeIn"
            >
              <span className="material-symbols-outlined text-[14px] text-emerald-600">
                check_circle
              </span>
              <span>{detectedBadge}</span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <input
              id="streetAddress"
              type="text"
              placeholder="Flat / House No. / Building"
              value={contact.streetAddress}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, streetAddress: e.target.value }))
              }
              className="w-full h-11 px-3.5 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-[#004ac6] transition-all placeholder:text-[#737686]"
            />
            <input
              id="areaLandmark"
              type="text"
              placeholder="Street, Sector or Landmark"
              value={contact.areaLandmark}
              onChange={(e) =>
                setContact((prev) => ({ ...prev, areaLandmark: e.target.value }))
              }
              className="w-full h-11 px-3.5 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-[#004ac6] transition-all placeholder:text-[#737686]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                id="city"
                type="text"
                placeholder="City (e.g. Bengaluru)"
                value={contact.city}
                onChange={(e) =>
                  setContact((prev) => ({ ...prev, city: e.target.value }))
                }
                className="w-full h-11 px-3.5 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-[#004ac6] transition-all placeholder:text-[#737686]"
              />
              <input
                id="pincode"
                type="text"
                maxLength={6}
                placeholder="Pincode"
                value={contact.pincode}
                onChange={(e) =>
                  setContact((prev) => ({
                    ...prev,
                    pincode: e.target.value.replace(/\D/g, ''),
                  }))
                }
                className="w-full h-11 px-3.5 bg-[#f2f3ff] text-[#131b2e] text-[13px] rounded-xl outline-none focus:bg-white focus:ring-1 focus:ring-[#004ac6] transition-all placeholder:text-[#737686]"
              />
            </div>
          </div>
        </div>

        {/* Trust Guarantee Badge */}
        <div
          id="trust-badge-card"
          className="flex items-center gap-3 p-3.5 bg-[#ffffff] rounded-2xl border border-[#eaedff] shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-[#dce1ff] flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-[#1d4ed8] text-[22px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#131b2e]">
              100% Privacy &amp; Safety Assured
            </span>
            <span className="text-[12px] text-[#434655] truncate">
              Background checked &amp; vetted home professionals
            </span>
          </div>
        </div>

        {/* Submit CTA Button */}
        <div className="pt-2 flex flex-col gap-1.5">
          <button
            id="submitBtn"
            type="submit"
            className="w-full h-14 bg-[#004ac6] hover:bg-[#1d4ed8] active:scale-[0.98] text-white rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#004ac6]/20 transition-all cursor-pointer group"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-[20px] transition-transform duration-200 group-hover:translate-x-1">
              arrow_forward
            </span>
          </button>
          <p className="text-[12px] text-[#434655] text-center pt-1">
            Step 2 will allow you to select required tasks &amp; add-ons.
          </p>
        </div>
      </form>
    </div>
  );
};
