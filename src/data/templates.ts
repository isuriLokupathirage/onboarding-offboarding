import { FIELD_CATALOG } from './fieldCatalog';
import type { DocumentFieldDef, FormSectionConfig, FormTemplate } from '../types';

export function defaultSections(): FormSectionConfig[] {
  return FIELD_CATALOG.map((section) => ({
    sectionId: section.id,
    enabled: section.fields.some((f) => f.locked) ? true : false,
    fields: section.fields.map((f) => ({
      fieldId: f.id,
      state: f.locked ? 'required' : 'hidden',
    })),
  }));
}

let seq = 100;
export function nextCode(tenant: string, existingCodes: string[]): string {
  seq += 1;
  let n = seq;
  let code = `FRM-${tenant}-${String(n).padStart(3, '0')}`;
  while (existingCodes.includes(code)) {
    n += 1;
    code = `FRM-${tenant}-${String(n).padStart(3, '0')}`;
  }
  return code;
}

function docs(list: Array<Partial<DocumentFieldDef> & { name: string; type: DocumentFieldDef['type'] }>): DocumentFieldDef[] {
  return list.map((d, i) => ({
    id: d.id ?? `doc-${i}-${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: d.name,
    type: d.type,
    requirement: d.requirement ?? 'required',
    multiple: d.multiple ?? false,
    order: i,
  }));
}

function fullOnboardingSections(): FormSectionConfig[] {
  const s = defaultSections();
  const set = (sectionId: string, enabled: boolean, states: Record<string, 'hidden' | 'optional' | 'required'>) => {
    const sec = s.find((x) => x.sectionId === sectionId)!;
    sec.enabled = enabled;
    sec.fields = sec.fields.map((f) => ({ fieldId: f.fieldId, state: states[f.fieldId] ?? f.state }));
  };
  set('personal', true, {
    dob: 'required',
    gender: 'optional',
    nationality: 'required',
    maritalStatus: 'required',
    tin: 'optional',
  });
  set('contact', true, {
    permanentAddress: 'required',
    temporaryAddress: 'optional',
    homeNumber: 'optional',
  });
  set('emergency', true, {
    contactName: 'required',
    contactNumber: 'required',
    relationship: 'required',
  });
  set('bank', true, {
    accountName: 'required',
    accountTypeCurrency: 'required',
    bankName: 'required',
    branchName: 'required',
    accountNumber: 'required',
    branchNumber: 'optional',
  });
  set('preferences', true, {
    tshirtSize: 'optional',
    mealPreference: 'optional',
    liquorConsumption: 'hidden',
  });
  set('insurance', true, {
    parentFatherName: 'optional',
    parentFatherDob: 'optional',
    parentMotherName: 'optional',
    parentMotherDob: 'optional',
    spouseName: 'optional',
    spouseDob: 'optional',
    children: 'optional',
  });
  return s;
}

function leanContractSections(): FormSectionConfig[] {
  const s = defaultSections();
  const set = (sectionId: string, enabled: boolean, states: Record<string, 'hidden' | 'optional' | 'required'>) => {
    const sec = s.find((x) => x.sectionId === sectionId)!;
    sec.enabled = enabled;
    sec.fields = sec.fields.map((f) => ({ fieldId: f.fieldId, state: states[f.fieldId] ?? f.state }));
  };
  set('personal', true, { dob: 'required', maritalStatus: 'hidden' });
  set('contact', true, { permanentAddress: 'required' });
  set('emergency', true, { contactName: 'required', contactNumber: 'required', relationship: 'required' });
  set('bank', false, {});
  set('preferences', false, {});
  set('insurance', false, {});
  return s;
}

export const SEED_TEMPLATES: FormTemplate[] = [
  {
    id: 'tpl-1',
    code: 'FRM-ACX-001',
    name: 'Standard Onboarding Form',
    employmentType: 'Full-Time',
    status: 'Active',
    usedByTransitions: 3,
    createdAt: '2026-06-02',
    updatedAt: '2026-08-14',
    sections: fullOnboardingSections(),
    documents: docs([
      { name: 'NIC Front', type: 'National ID', requirement: 'required' },
      { name: 'NIC Back', type: 'National ID', requirement: 'required' },
      { name: 'Passport Copy', type: 'Passport', requirement: 'optional' },
      { name: 'Birth Certificate', type: 'Other', requirement: 'optional' },
      { name: 'Educational Certificates', type: 'Educational Certificate', requirement: 'required', multiple: true },
      { name: 'Professional Certifications', type: 'Professional Certification', requirement: 'optional', multiple: true },
      { name: 'Previous Employment Service Letters', type: 'Employment Letter', requirement: 'required', multiple: true },
      { name: 'Police Clearance Report', type: 'Police Report', requirement: 'required' },
      { name: 'Passport Size Photograph', type: 'Photograph', requirement: 'required' },
    ]),
  },
  {
    id: 'tpl-2',
    code: 'FRM-ACX-002',
    name: 'Fixed-Term Contractor Onboarding',
    employmentType: 'Contract',
    status: 'Active',
    usedByTransitions: 0,
    createdAt: '2026-07-10',
    updatedAt: '2026-07-22',
    sections: leanContractSections(),
    documents: docs([
      { name: 'NIC Front', type: 'National ID', requirement: 'required' },
      { name: 'NIC Back', type: 'National ID', requirement: 'required' },
      { name: 'Signed Contract', type: 'Other', requirement: 'required' },
    ]),
  },
  {
    id: 'tpl-3',
    code: 'FRM-ACX-003',
    name: 'Intern Onboarding',
    employmentType: 'Internship',
    status: 'Active',
    usedByTransitions: 1,
    createdAt: '2026-05-18',
    updatedAt: '2026-05-30',
    sections: leanContractSections(),
    documents: docs([
      { name: 'NIC Front', type: 'National ID', requirement: 'required' },
      { name: 'Educational Certificates', type: 'Educational Certificate', requirement: 'required', multiple: true },
      { name: 'Passport Size Photograph', type: 'Photograph', requirement: 'optional' },
    ]),
  },
  {
    id: 'tpl-4',
    code: 'FRM-ACX-004',
    name: 'Legacy Part-Time Onboarding',
    employmentType: 'Part-Time',
    status: 'Inactive',
    usedByTransitions: 2,
    createdAt: '2025-11-04',
    updatedAt: '2026-01-09',
    sections: leanContractSections(),
    documents: docs([{ name: 'NIC Front', type: 'National ID', requirement: 'required' }]),
  },
];
