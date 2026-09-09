import type { SectionDef } from '../types';

const EMP_MGMT_REASON = 'This field is mandatory in Employee Management and cannot be changed.';

export const FIELD_CATALOG: SectionDef[] = [
  {
    id: 'personal',
    name: 'Personal Details',
    fields: [
      { id: 'firstName', label: 'First Name', locked: true, lockedReason: EMP_MGMT_REASON },
      { id: 'lastName', label: 'Last Name', locked: true, lockedReason: EMP_MGMT_REASON },
      {
        id: 'nicPassport',
        label: 'NIC/Passport Number',
        locked: true,
        lockedReason: EMP_MGMT_REASON,
      },
      { id: 'dob', label: 'Date of Birth', kind: 'date' },
      { id: 'gender', label: 'Gender', fixedOptions: ['Male', 'Female', 'Other'], hasOtherOption: true, kind: 'select' },
      { id: 'nationality', label: 'Nationality' },
      {
        id: 'maritalStatus',
        label: 'Marital Status (Civil Status)',
        fixedOptions: ['Single', 'Married'],
        kind: 'select',
      },
      { id: 'tin', label: 'Tax ID (TIN)' },
    ],
  },
  {
    id: 'contact',
    name: 'Contact Details',
    fields: [
      { id: 'permanentAddress', label: 'Permanent Address', kind: 'textarea' },
      { id: 'temporaryAddress', label: 'Temporary Address', kind: 'textarea' },
      { id: 'homeNumber', label: 'Home Number' },
      {
        id: 'personalMobile',
        label: 'Personal Mobile Number',
        locked: true,
        lockedReason: EMP_MGMT_REASON,
      },
      {
        id: 'personalEmail',
        label: 'Personal Email',
        locked: true,
        lockedReason: EMP_MGMT_REASON,
      },
    ],
  },
  {
    id: 'emergency',
    name: 'Emergency Contacts',
    description: 'Repeating group — candidates can add or remove entries.',
    fields: [
      { id: 'contactName', label: 'Contact Name' },
      { id: 'contactNumber', label: 'Contact Number' },
      { id: 'relationship', label: 'Relationship' },
    ],
  },
  {
    id: 'bank',
    name: 'Bank Details',
    fields: [
      { id: 'accountName', label: 'Name of the Account' },
      { id: 'accountTypeCurrency', label: 'Account Type & Currency', fixedOptions: ['Savings - LKR', 'Current - LKR', 'Savings - USD', 'Current - USD'], kind: 'select' },
      { id: 'bankName', label: 'Bank Name' },
      { id: 'branchName', label: 'Branch Name' },
      { id: 'accountNumber', label: 'Account Number' },
      { id: 'branchNumber', label: 'Branch Number' },
    ],
  },
  {
    id: 'preferences',
    name: 'Preferences',
    fields: [
      {
        id: 'tshirtSize',
        label: 'T-Shirt Size',
        hasOtherOption: true,
        fixedOptions: [
          'Extra Small (XS)',
          'Small (S)',
          'Medium (M)',
          'Large (L)',
          'Extra Large (XL)',
          'Double Extra Large (XXL)',
          'Other',
        ],
        kind: 'select',
      },
      {
        id: 'mealPreference',
        label: 'Meal Preference',
        hasOtherOption: true,
        fixedOptions: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Halal', 'Other'],
        kind: 'select',
      },
      {
        id: 'liquorConsumption',
        label: 'Liquor Consumption',
        fixedOptions: ['Yes', 'No'],
        kind: 'select',
      },
    ],
  },
  {
    id: 'insurance',
    name: 'Insurance Details',
    description:
      'Conditional on Marital (Civil) Status — Parents group shows for Single, Spouse & Children group shows for Married.',
    conditional: 'insurance',
    fields: [
      { id: 'parentFatherName', label: "Father's Full Name" },
      { id: 'parentFatherDob', label: "Father's Date of Birth", kind: 'date' },
      { id: 'parentMotherName', label: "Mother's Full Name" },
      { id: 'parentMotherDob', label: "Mother's Date of Birth", kind: 'date' },
      { id: 'spouseName', label: "Spouse's Full Name" },
      { id: 'spouseDob', label: "Spouse's Date of Birth", kind: 'date' },
      {
        id: 'children',
        label: 'Children (repeating group — Full Name & Date of Birth)',
        helper: 'Candidate can add or remove child entries.',
      },
    ],
  },
];

export function findField(fieldId: string) {
  for (const section of FIELD_CATALOG) {
    const field = section.fields.find((f) => f.id === fieldId);
    if (field) return field;
  }
  return undefined;
}

export function findSection(sectionId: string) {
  return FIELD_CATALOG.find((s) => s.id === sectionId);
}
