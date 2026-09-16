// Types and limits shared by the Angular app (src/) and the Worker API (worker/).

export const ENQUIRY_STATUSES = ['new', 'read', 'archived'] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_LIMITS = {
  name: { min: 1, max: 100 },
  email: { min: 3, max: 254 },
  subject: { min: 1, max: 150 },
  message: { min: 10, max: 5000 },
} as const;

export type EnquiryField = keyof typeof ENQUIRY_LIMITS;

export interface EnquiryInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Enquiry extends EnquiryInput {
  id: number;
  status: EnquiryStatus;
  created_at: string;
}

export interface EnquiryPage {
  items: Enquiry[];
  page: number;
  pageSize: number;
  total: number;
  counts: Record<EnquiryStatus, number>;
}

export interface ApiError {
  error: string;
  details?: Partial<Record<string, string>>;
}
