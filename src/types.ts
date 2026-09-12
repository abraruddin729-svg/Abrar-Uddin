export type ActiveTab = 'services' | 'bookings' | 'support' | 'account';

export type WizardStep = 1 | 2 | 3;

export interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  areaLandmark: string;
  city: string;
  pincode: string;
  gpsDetected?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  emoji: string;
  commonIssues: string[];
  recommendedPro: string;
  defaultTier: string;
}

export interface AIDiagnosisResult {
  category: string;
  priority: 'High Priority' | 'Normal';
  budgetTier: string;
  summary: string;
  matchedIssues: string[];
  recommendedPro: string;
  confidence: number;
  source?: string;
}

export interface ServiceDetails {
  category: string;
  description: string;
  selectedIssues: string[];
  photos: Array<{ id: string; name: string; url: string }>;
  aiDiagnosis?: AIDiagnosisResult | null;
}

export interface BudgetTier {
  id: string;
  range: string;
  label: string;
  description: string;
  isPopular?: boolean;
}

export interface ScheduleDetails {
  budgetTier: string;
  appointmentDay: 'today' | 'tomorrow' | 'saturday' | 'custom';
  customDate?: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
}

export interface ConfirmedBooking {
  id: string;
  createdAt: string;
  contact: ContactInfo;
  service: ServiceDetails;
  schedule: ScheduleDetails;
  status: 'Assigned' | 'En Route' | 'In Progress' | 'Completed';
  otp: string;
  pro: {
    name: string;
    title: string;
    rating: number;
    completedJobs: number;
    phone: string;
    photo: string;
    verified: boolean;
    etaMinutes: number;
  };
  quoteAmount: string;
}
