import { useState } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { MultiSelect } from '../../components/ui/MultiSelect';
import { FieldsTab } from './FieldsTab';
import { DocumentsTab } from './DocumentsTab';
import { FormPreview, DocumentsPreview } from './PreviewModal';
import { EMPLOYMENT_TYPES } from '../../types';
import type { FormTemplate } from '../../types';

const STEP_LABELS = ['Details', 'Candidate Details', 'Required Documents', 'Preview & Save'];

export function FormWizard({
  draft,
  onDraftChange,
  onSave,
  saveLabel,
  showCode,
  validationError,
}: {
  draft: FormTemplate;
  onDraftChange: (updater: (d: FormTemplate) => FormTemplate) => void;
  onSave: () => void;
  saveLabel: string;
  showCode?: boolean;
  validationError?: string | null;
}) {
  const [step, setStep] = useState(1);
  const [civilStatus, setCivilStatus] = useState<'Single' | 'Married'>('Single');
  const [previewTab, setPreviewTab] = useState<'form' | 'documents'>('form');

  const step1Valid = draft.name.trim().length > 0 && draft.employmentTypes.length > 0;

  function goNext() {
    setStep((s) => Math.min(4, s + 1));
  }
  function goPrev() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border-soft px-6 py-4">
        <Stepper steps={STEP_LABELS} current={step} onStepClick={(s) => (s === 1 || step1Valid) && setStep(s)} />
      </div>

      <div className="px-6 py-6">
        {step === 1 && (
          <div className="mx-auto max-w-md space-y-4">
            {showCode && (
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-soft">Form Code</label>
                <input
                  disabled
                  value={draft.code}
                  className="w-full rounded-lg border border-border bg-black/[0.03] px-3 py-2 text-sm text-subtle outline-none"
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Form Name *</label>
              <input
                autoFocus
                value={draft.name}
                onChange={(e) => onDraftChange((d) => ({ ...d, name: e.target.value }))}
                placeholder="e.g. Regional Sales Onboarding"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Description</label>
              <textarea
                rows={3}
                value={draft.description}
                onChange={(e) => onDraftChange((d) => ({ ...d, description: e.target.value }))}
                placeholder="What's this form for?"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-ink-soft">Employment Type * (select one or more)</label>
              <MultiSelect
                options={[...EMPLOYMENT_TYPES]}
                selected={draft.employmentTypes}
                onChange={(next) => onDraftChange((d) => ({ ...d, employmentTypes: next as typeof d.employmentTypes }))}
                placeholder="Select employment types"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <FieldsTab
            sections={draft.sections}
            readOnly={false}
            onChange={(sections) => onDraftChange((d) => ({ ...d, sections }))}
          />
        )}

        {step === 3 && (
          <DocumentsTab
            documents={draft.documents}
            readOnly={false}
            onChange={(documents) => onDraftChange((d) => ({ ...d, documents }))}
          />
        )}

        {step === 4 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { id: 'form' as const, label: 'Employee Data Form' },
                  { id: 'documents' as const, label: 'Required Documents' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setPreviewTab(t.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      previewTab === t.id ? 'bg-primary text-primary-dark' : 'bg-black/5 text-ink-soft hover:bg-black/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs text-ink-soft">
                Preview as
                <select
                  value={civilStatus}
                  onChange={(e) => setCivilStatus(e.target.value as 'Single' | 'Married')}
                  className="rounded-md border border-border px-2 py-1 text-xs outline-none"
                >
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </label>
            </div>

            {previewTab === 'form' ? (
              <FormPreview template={draft} civilStatus={civilStatus} />
            ) : (
              <DocumentsPreview template={draft} />
            )}

            {validationError && (
              <div className="mx-auto mt-4 flex max-w-2xl items-center gap-2 rounded-xl border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
                <AlertCircle size={16} className="shrink-0" />
                {validationError}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border-soft px-6 py-4">
        <Button variant="ghost" size="sm" icon={<ChevronLeft size={14} />} disabled={step === 1} onClick={goPrev}>
          Previous
        </Button>
        {step < 4 ? (
          <Button
            size="sm"
            icon={<ChevronRight size={14} />}
            disabled={step === 1 && !step1Valid}
            onClick={goNext}
          >
            Next
          </Button>
        ) : (
          <Button size="sm" icon={<Save size={14} />} onClick={onSave}>
            {saveLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
