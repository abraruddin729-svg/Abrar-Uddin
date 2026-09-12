import React, { useState, useRef } from 'react';
import { ServiceDetails, AIDiagnosisResult } from '../types';
import { SERVICE_CATEGORIES, SAMPLE_AUDIO_PROMPTS } from '../data/services';

interface Step2ServiceProps {
  service: ServiceDetails;
  setService: React.Dispatch<React.SetStateAction<ServiceDetails>>;
  onBack: () => void;
  onContinue: () => void;
}

export const Step2Service: React.FC<Step2ServiceProps> = ({
  service,
  setService,
  onBack,
  onContinue,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCategoryObj =
    SERVICE_CATEGORIES.find((c) => c.id === service.category) ||
    SERVICE_CATEGORIES[0];

  // Helper to trigger AI analysis
  const runAiAnalysis = async (textToAnalyze: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: textToAnalyze }),
      });
      if (response.ok) {
        const data: AIDiagnosisResult = await response.json();
        setService((prev) => ({
          ...prev,
          category: data.category || prev.category,
          aiDiagnosis: data,
          description: textToAnalyze,
          selectedIssues: Array.from(
            new Set([...prev.selectedIssues, ...(data.matchedIssues || [])])
          ),
        }));
      }
    } catch (err) {
      console.warn('AI categorization request failed, using local match:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle voice recognition
  const handleToggleVoice = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // Check if webkitSpeechRecognition or SpeechRecognition exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        setIsListening(true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          setService((prev) => ({ ...prev, description: transcript }));
          runAiAnalysis(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          // Fallback to sample prompt
          const sample = SAMPLE_AUDIO_PROMPTS[sampleIndex % SAMPLE_AUDIO_PROMPTS.length];
          setSampleIndex((prev) => prev + 1);
          setService((prev) => ({ ...prev, description: sample.text }));
          runAiAnalysis(sample.text);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('Speech recognition start failed, using audio simulation:', e);
      }
    }

    // Simulated speech transcription fallback
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const sample = SAMPLE_AUDIO_PROMPTS[sampleIndex % SAMPLE_AUDIO_PROMPTS.length];
      setSampleIndex((prev) => prev + 1);
      setService((prev) => ({ ...prev, description: sample.text }));
      runAiAnalysis(sample.text);
    }, 1800);
  };

  // Switch category
  const handleSelectCategory = (categoryId: string) => {
    const matched = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
    setService((prev) => ({
      ...prev,
      category: categoryId,
      // Retain or refresh issues
      selectedIssues: [],
      aiDiagnosis: prev.aiDiagnosis
        ? {
            ...prev.aiDiagnosis,
            category: categoryId,
            recommendedPro: matched?.recommendedPro || prev.aiDiagnosis.recommendedPro,
          }
        : null,
    }));
  };

  // Toggle quick issue pill
  const handleToggleIssue = (issue: string) => {
    setService((prev) => {
      const isSelected = prev.selectedIssues.includes(issue);
      const newIssues = isSelected
        ? prev.selectedIssues.filter((i) => i !== issue)
        : [...prev.selectedIssues, issue];

      // Update description text cleanly
      let newDesc = prev.description;
      if (!isSelected) {
        if (!newDesc.trim()) {
          newDesc = issue;
        } else if (!newDesc.toLowerCase().includes(issue.toLowerCase())) {
          newDesc = `${newDesc.trim()}, ${issue}`;
        }
      }

      return {
        ...prev,
        selectedIssues: newIssues,
        description: newDesc,
      };
    });
  };

  // Handle Photo upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPhotos = Array.from(files as FileList).map((file: File, idx: number) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      url: URL.createObjectURL(file),
    }));

    setService((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const handleRemovePhoto = (id: string) => {
    setService((prev) => ({
      ...prev,
      photos: prev.photos.filter((p) => p.id !== id),
    }));
  };

  const handleNext = () => {
    if (!service.description.trim()) {
      setValidationError('Please describe the problem or select an issue below.');
      return;
    }
    setValidationError(null);
    onContinue();
  };

  return (
    <div id="step-2-container" className="px-4 pt-5 pb-32 flex flex-col gap-5 max-w-md mx-auto w-full">
      {/* Header Title & Subtitle */}
      <div className="flex flex-col gap-1.5">
        <div
          id="badge-step-2"
          className="self-start px-2.5 py-0.5 rounded-full bg-[#dbe1ff] text-[#00174b] text-[11px] font-bold tracking-wide uppercase"
        >
          STEP 2 OF 3
        </div>
        <h1
          id="heading-service-needed"
          className="text-[26px] leading-8 font-bold text-[#131b2e] tracking-tight"
        >
          What service do you need?
        </h1>
        <p className="text-[14px] text-[#434655] leading-5">
          Select a home service category and explain what needs fixing.
        </p>
      </div>

      {validationError && (
        <div
          id="service-error-alert"
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-[#ba1a1a] text-xs font-semibold flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">error</span>
          <span>{validationError}</span>
        </div>
      )}

      {/* AI Talk Assistant Card (Stitch AI) */}
      <div
        id="ai-talk-assistant-card"
        className="bg-gradient-to-br from-[#2563eb] to-[#004ac6] text-white rounded-2xl p-4 shadow-md flex flex-col gap-3 relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white ${
                isListening ? 'animate-pulse ring-2 ring-white' : ''
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isListening ? 'graphic_eq' : 'mic'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-white tracking-tight">
                  AI Talk Assistant
                </span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] uppercase tracking-wider text-white font-bold">
                  STITCH AI
                </span>
              </div>
              <span className="text-[12px] text-white/80 block">
                Describe out loud or type below
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full text-white">
            <span
              className={`w-2 h-2 rounded-full ${
                isListening ? 'bg-amber-300 animate-ping' : 'bg-green-300 animate-pulse'
              }`}
            />
            <span className="text-[11px] font-semibold">
              {isListening ? 'Listening...' : isAnalyzing ? 'Analyzing...' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Live Audio or Diagnostic Speech Banner */}
        <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 flex flex-col gap-2 border border-white/10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-white/90">
              <span className="material-symbols-outlined text-[18px] animate-pulse text-[#c4e7ff]">
                graphic_eq
              </span>
              <span className="text-[13px] italic font-medium leading-tight line-clamp-2">
                &ldquo;
                {service.description ||
                  'My kitchen ceiling fan is sparking and the breaker tripped...'}
                &rdquo;
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-yellow-300 text-[16px]">
                auto_awesome
              </span>
              <span className="text-[12px] text-yellow-200 font-bold">
                {service.aiDiagnosis
                  ? `AI Detected: ${activeCategoryObj.name} • ${service.aiDiagnosis.priority}`
                  : 'AI Detected: Electrician • High Priority'}
              </span>
            </div>
            <button
              id="btn-auto-apply-ai"
              type="button"
              onClick={() => {
                if (service.aiDiagnosis) {
                  handleSelectCategory(service.aiDiagnosis.category);
                } else {
                  handleSelectCategory('electrician');
                  setService((prev) => ({
                    ...prev,
                    description:
                      'My kitchen ceiling fan is sparking and the breaker tripped...',
                    selectedIssues: ['Switch replacement', 'Power outage', 'Appliance short circuit'],
                  }));
                }
              }}
              className="px-2.5 py-1 rounded-full bg-white text-[#004ac6] text-[11px] font-bold shadow-sm hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Auto-Applied</span>
            </button>
          </div>
        </div>

        {/* Footer controls: Auto-categorize label + Tap to Speak button */}
        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-white/80">
            Auto-categorizes service &amp; pre-fills details
          </span>
          <button
            id="btn-tap-to-speak"
            type="button"
            onClick={handleToggleVoice}
            className={`px-3.5 py-1.5 rounded-full font-semibold text-[13px] flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
              isListening
                ? 'bg-amber-400 text-slate-900 ring-2 ring-white animate-pulse'
                : 'bg-white text-[#004ac6] hover:bg-[#f2f3ff]'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[17px] ${
                isListening ? 'animate-spin' : 'animate-bounce'
              }`}
            >
              mic
            </span>
            <span>{isListening ? 'Listening...' : 'Tap to Speak'}</span>
          </button>
        </div>
      </div>

      {/* Service Grid (2 Columns) */}
      <div id="service-grid" className="grid grid-cols-2 gap-2.5">
        {SERVICE_CATEGORIES.map((cat) => {
          const isSelected = service.category === cat.id;
          return (
            <button
              key={cat.id}
              id={`service-card-${cat.id}`}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`service-card relative flex flex-col items-start p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer group ${
                isSelected
                  ? 'bg-[#dce1ff]/50 border-2 border-[#004ac6] shadow-md -translate-y-0.5'
                  : 'bg-[#ffffff] border border-[#eaedff] shadow-sm hover:shadow hover:border-[#b4c5ff]'
              }`}
            >
              {/* Checkbox badge */}
              <div
                className={`selection-indicator absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-[#004ac6] text-white shadow-sm'
                    : 'bg-[#eaedff] text-transparent opacity-0 group-hover:opacity-60'
                }`}
              >
                <span className="material-symbols-outlined text-[14px] font-bold text-white">
                  check
                </span>
              </div>

              {/* Emoji Icon Container */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2.5 shadow-xs transition-colors ${
                  isSelected ? 'bg-[#ffffff]' : 'bg-[#f2f3ff]'
                }`}
              >
                {cat.emoji}
              </div>

              <span className="text-[16px] font-bold text-[#131b2e] leading-tight">
                {cat.name}
              </span>
              <span
                className={`text-[12px] font-medium leading-tight mt-0.5 ${
                  isSelected ? 'text-[#004ac6]' : 'text-[#434655]'
                }`}
              >
                {cat.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Service Details Card */}
      <div
        id="problem-details-card"
        className="bg-[#ffffff] rounded-2xl p-4 border border-[#eaedff] shadow-sm flex flex-col gap-3.5"
      >
        <div className="flex items-center justify-between">
          <label
            htmlFor="problem-description"
            className="text-[14px] font-bold text-[#131b2e] flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[#004ac6] text-[20px]">
              edit_note
            </span>
            <span>Describe the problem</span>
          </label>
          <span className="text-[11px] font-semibold text-[#737686] uppercase tracking-wider">
            Required
          </span>
        </div>

        {/* Text Area */}
        <div className="relative">
          <textarea
            id="problem-description"
            rows={4}
            value={service.description}
            onChange={(e) =>
              setService((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder={`Describe the issue in detail (e.g., Short circuit in master bedroom switchboard, power tripping frequently)...`}
            className="w-full bg-[#f2f3ff] text-[#131b2e] text-[14px] rounded-xl p-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-[#004ac6] transition-all resize-none placeholder:text-[#737686] leading-relaxed"
          />
        </div>

        {/* Quick Issue Tag Pills */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-[#434655] font-semibold">
            Quick select common issues:
          </span>
          <div id="issue-tags" className="flex flex-wrap gap-1.5">
            {activeCategoryObj.commonIssues.map((issue) => {
              const isSelected = service.selectedIssues.includes(issue);
              return (
                <button
                  key={issue}
                  type="button"
                  onClick={() => handleToggleIssue(issue)}
                  className={`issue-pill px-3 py-1.5 rounded-full text-[12px] font-medium transition-all active:scale-95 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#004ac6] text-white shadow-sm'
                      : 'bg-[#eaedff] text-[#131b2e] hover:bg-[#dce1ff]'
                  }`}
                >
                  <span>{isSelected ? '✓' : '+'}</span>
                  <span>{issue}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo & Video Upload Attachment Area */}
        <div className="pt-1">
          <input
            id="media-upload"
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="media-upload"
            className="w-full py-3 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] border border-dashed border-[#c3c6d7] flex items-center justify-between cursor-pointer transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#004ac6] group-hover:bg-[#004ac6] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold text-[#131b2e]">
                  Add photos or short video
                </span>
                <span className="text-[11px] text-[#737686]">
                  Helps technicians quote accurately
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#737686] group-hover:text-[#131b2e] transition-colors">
              attach_file
            </span>
          </label>

          {/* Preview Thumbnails Container */}
          {service.photos.length > 0 && (
            <div id="media-preview-container" className="flex flex-wrap gap-2 mt-2.5">
              {service.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#eaedff] text-[#131b2e] text-[12px] font-medium shadow-xs"
                >
                  <span className="material-symbols-outlined text-[14px] text-[#004ac6]">
                    check_circle
                  </span>
                  <span>Photo {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="ml-1 text-[#737686] hover:text-[#ba1a1a]"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trust & Safety Banner */}
      <div
        id="trust-safety-banner"
        className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#e2e7ff]/70 border border-[#b4c5ff]/40"
      >
        <span
          className="material-symbols-outlined text-[#004ac6] text-[24px] shrink-0"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified_user
        </span>
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-[#131b2e]">
            Verified Professionals Only
          </span>
          <span className="text-[12px] text-[#434655] leading-tight">
            All contractors are background checked, insured, and certified.
          </span>
        </div>
      </div>

      {/* Bottom Action Bar (Fixed above bottom navigation) */}
      <div
        id="bottom-action-bar-step-2"
        className="fixed bottom-16 left-0 w-full z-40 bg-[#ffffff]/95 backdrop-blur-md border-t border-[#eaedff] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3"
      >
        <div className="max-w-md mx-auto flex items-center gap-3">
          {/* Back Button */}
          <button
            id="btn-step-2-back"
            type="button"
            onClick={onBack}
            className="w-1/3 py-3.5 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] active:scale-[0.98] text-[#131b2e] text-[15px] font-semibold flex items-center justify-center gap-1 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back</span>
          </button>
          {/* Continue Button */}
          <button
            id="btn-step-2-continue"
            type="button"
            onClick={handleNext}
            className="w-2/3 py-3.5 px-6 rounded-xl bg-[#004ac6] hover:bg-[#1d4ed8] active:scale-[0.98] text-white text-[15px] font-semibold shadow-md shadow-[#004ac6]/25 flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Continue</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
