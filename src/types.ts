export type FieldState = 'hidden' | 'optional' | 'required';

export interface FieldDef {
  id: string;
  label: string;
  locked?: boolean;
  lockedReason?: string;
  hasOtherOption?: boolean;
  fixedOptions?: string[];
  helper?: string;
  kind?: 'text' | 'date' | 'select' | 'textarea';
}

export interface SectionDef {
  id: string;
  name: string;
  description?: string;
  fields: FieldDef[];
  conditional?: 'insurance';
}

export interface FormFieldConfig {
  fieldId: string;
  state: FieldState;
}

export interface FormSectionConfig {
  sectionId: string;
  enabled: boolean;
  fields: FormFieldConfig[];
}

export const DOCUMENT_TYPES = [
  'National ID',
  'Passport',
  'Educational Certificate',
  'Professional Certification',
  'Employment Letter',
  'Police Report',
  'Photograph',
  'Other',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export interface DocumentFieldDef {
  id: string;
  name: string;
  type: DocumentType;
  requirement: 'optional' | 'required';
  multiple: boolean;
  order: number;
}

export const EMPLOYMENT_TYPES = ['Full-Time', 'Part-Time', 'Contract', 'Internship'] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number];

export interface FormTemplate {
  id: string;
  code: string;
  name: string;
  description: string;
  employmentTypes: EmploymentType[];
  status: 'Active' | 'Inactive';
  usedByTransitions: number;
  createdAt: string;
  updatedAt: string;
  clonedFrom?: string;
  sections: FormSectionConfig[];
  documents: DocumentFieldDef[];
}

export const ACCEPTED_DOCUMENT_FORMATS = ['PDF', 'PNG', 'JPG', 'JPEG', 'DOCX'];
export const DOCUMENT_SIZE_LIMIT_MB = 25;

export type Permission = 'manager' | 'readonly';

export type TransitionKind = 'Onboarding' | 'Offboarding';

export interface TemplateTask {
  id: string;
  name: string;
  phase: string;
  assigneeRole: string;
  dueOffsetDays: number;
}

export interface TransitionTemplate {
  id: string;
  name: string;
  kind: TransitionKind;
  company: string;
  employmentType: EmploymentType;
  status: 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  tasks: TemplateTask[];
}

export interface LibraryTask {
  id: string;
  name: string;
  phase: string;
  assigneeRole: string;
  description: string;
}
