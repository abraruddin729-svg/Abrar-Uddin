/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ActiveTab,
  WizardStep,
  ContactInfo,
  ServiceDetails,
  ScheduleDetails,
  ConfirmedBooking,
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { StepWizardBar } from './components/StepWizardBar';
import { Step1Contact } from './components/Step1Contact';
import { Step2Service } from './components/Step2Service';
import { Step3Budget } from './components/Step3Budget';
import { MatchingModal } from './components/MatchingModal';
import { BookingsView } from './components/BookingsView';
import { SupportView } from './components/SupportView';
import { AccountView } from './components/AccountView';
import { HelpFaqModal } from './components/HelpFaqModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('services');
  const [currentStep, setCurrentStep] = useState<WizardStep>(2); // Step 2 is showcased in screenshot!
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMatchingModal, setShowMatchingModal] = useState(false);
  const [newBooking, setNewBooking] = useState<ConfirmedBooking | null>(null);

  // Form State initialized to match screenshot data
  const [contact, setContact] = useState<ContactInfo>({
    fullName: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@example.com',
    streetAddress: 'Flat 304, Emerald Heights',
    areaLandmark: '12th Main, HAL 2nd Stage',
    city: 'Bengaluru',
    pincode: '560008',
    gpsDetected: true,
  });

  const [service, setService] = useState<ServiceDetails>({
    category: 'electrician',
    description: 'My kitchen ceiling fan is sparking and the breaker tripped...',
    selectedIssues: ['Switch replacement', 'Power outage', 'Appliance short circuit'],
    photos: [],
    aiDiagnosis: {
      category: 'electrician',
      priority: 'High Priority',
      budgetTier: 'tier-2',
      summary: 'Sparking ceiling fan circuit tripping main breaker',
      matchedIssues: ['Switch replacement', 'Power outage', 'Appliance short circuit'],
      recommendedPro: 'Master Certified Electrician',
      confidence: 98,
    },
  });

  const [schedule, setSchedule] = useState<ScheduleDetails>({
    budgetTier: 'tier-2',
    appointmentDay: 'tomorrow',
    timeSlot: 'afternoon',
  });

  // Confirmed Bookings list
  const [bookings, setBookings] = useState<ConfirmedBooking[]>([
    {
      id: 'HC-7491',
      createdAt: 'Oct 20, 2026',
      contact: {
        fullName: 'Rahul Sharma',
        phone: '9876543210',
        email: 'rahul.sharma@example.com',
        streetAddress: 'Flat 304, Emerald Heights',
        areaLandmark: '12th Main, HAL 2nd Stage',
        city: 'Bengaluru',
        pincode: '560008',
        gpsDetected: true,
      },
      service: {
        category: 'ac-repair',
        description: 'AC deep jet cleaning and gas leak checkup in living room.',
        selectedIssues: ['Gas recharge', 'Deep filter cleaning'],
        photos: [],
      },
      schedule: {
        budgetTier: 'tier-2',
        appointmentDay: 'today',
        timeSlot: 'morning',
      },
      status: 'Completed',
      otp: '3829',
      pro: {
        name: 'Arun Varma',
        title: 'HVAC Certified Technician',
        rating: 4.9,
        completedJobs: 840,
        phone: '+91 98450 11223',
        photo:
          'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        verified: true,
        etaMinutes: 0,
      },
      quoteAmount: '₹1,499 (Paid)',
    },
  ]);

  // Triggered when confirming booking on step 3
  const handleConfirmBooking = () => {
    const bookingId = `HC-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = String(Math.floor(1000 + Math.random() * 9000));

    // Get pro title & quote amount
    const quoteMap: Record<string, string> = {
      'tier-1': '₹500 – ₹1,000',
      'tier-2': '₹1,000 – ₹2,500',
      'tier-3': '₹2,500 – ₹5,000',
      'tier-4': '₹5,000+',
    };

    const createdBooking: ConfirmedBooking = {
      id: bookingId,
      createdAt: 'Just now',
      contact: { ...contact },
      service: { ...service },
      schedule: { ...schedule },
      status: 'Assigned',
      otp: randomOtp,
      pro: {
        name: 'Rajesh Kumar',
        title: service.aiDiagnosis?.recommendedPro || 'Master Certified Electrician',
        rating: 4.9,
        completedJobs: 1240,
        phone: '+91 97421 98820',
        photo:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        verified: true,
        etaMinutes: 35,
      },
      quoteAmount: quoteMap[schedule.budgetTier] || '₹1,000 – ₹2,500',
    };

    setNewBooking(createdBooking);
    setBookings((prev) => [createdBooking, ...prev]);
    setShowMatchingModal(true);
  };

  const handleViewConfirmedBooking = () => {
    setShowMatchingModal(false);
    setActiveTab('bookings');
  };

  const handleCancelBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] font-sans text-[#131b2e] flex flex-col antialiased selection:bg-blue-100">
      {/* Fixed Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onHelpClick={() => setShowHelpModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 bg-[#faf8ff]">
        {activeTab === 'services' && (
          <div className="flex flex-col w-full">
            {/* 3-Step Wizard Bar */}
            <StepWizardBar
              currentStep={currentStep}
              onStepClick={(step) => setCurrentStep(step)}
            />

            {/* Wizard Steps */}
            {currentStep === 1 && (
              <Step1Contact
                contact={contact}
                setContact={setContact}
                onContinue={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <Step2Service
                service={service}
                setService={setService}
                onBack={() => setCurrentStep(1)}
                onContinue={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 3 && (
              <Step3Budget
                service={service}
                schedule={schedule}
                setSchedule={setSchedule}
                onBack={() => setCurrentStep(2)}
                onConfirm={handleConfirmBooking}
              />
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <BookingsView
            bookings={bookings}
            onBookNew={() => {
              setActiveTab('services');
              setCurrentStep(2);
            }}
            onCancelBooking={handleCancelBooking}
          />
        )}

        {activeTab === 'support' && <SupportView />}

        {activeTab === 'account' && (
          <AccountView contact={contact} setContact={setContact} />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingsCount={bookings.filter((b) => b.status !== 'Completed').length}
      />

      {/* Matching Modal */}
      {showMatchingModal && newBooking && (
        <MatchingModal
          booking={newBooking}
          onViewBooking={handleViewConfirmedBooking}
          onClose={() => setShowMatchingModal(false)}
        />
      )}

      {/* Help & FAQ Modal */}
      {showHelpModal && (
        <HelpFaqModal
          onClose={() => setShowHelpModal(false)}
          onGoToSupport={() => {
            setShowHelpModal(false);
            setActiveTab('support');
          }}
        />
      )}
    </div>
  );
}
