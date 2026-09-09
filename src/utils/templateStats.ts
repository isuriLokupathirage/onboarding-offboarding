import type { FormTemplate } from '../types';

export function enabledFieldCount(template: FormTemplate): number {
  return template.sections.reduce(
    (sum, s) => sum + s.fields.filter((f) => f.state !== 'hidden').length,
    0,
  );
}

export function documentCount(template: FormTemplate): number {
  return template.documents.length;
}

export function canEditDirectly(template: FormTemplate): boolean {
  return template.usedByTransitions === 0;
}

export function canDelete(template: FormTemplate): boolean {
  return template.usedByTransitions === 0;
}
