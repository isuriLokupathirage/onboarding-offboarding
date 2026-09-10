import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTemplates } from '../../store/TemplatesContext';
import { defaultSections } from '../../data/templates';
import { enabledFieldCount } from '../../utils/templateStats';
import { FormWizard } from './FormWizard';
import type { FormTemplate } from '../../types';

function blankDraft(): FormTemplate {
  return {
    id: '',
    code: '',
    name: '',
    description: '',
    employmentTypes: [],
    status: 'Active',
    usedByTransitions: 0,
    createdAt: '',
    updatedAt: '',
    sections: defaultSections(),
    documents: [],
  };
}

export function NewFormPage() {
  const { createTemplate } = useTemplates();
  const navigate = useNavigate();
  const [draft, setDraft] = useState<FormTemplate>(blankDraft);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleSave() {
    if (!draft.name.trim() || draft.employmentTypes.length === 0) {
      setValidationError('Form Name and at least one Employment Type are required.');
      return;
    }
    if (enabledFieldCount(draft) < 1) {
      setValidationError('At least one field must be enabled before the form can be saved.');
      return;
    }
    const tpl = createTemplate({
      name: draft.name.trim(),
      description: draft.description.trim(),
      employmentTypes: draft.employmentTypes,
      sections: draft.sections,
      documents: draft.documents,
    });
    navigate(`/form-templates/${tpl.id}`);
  }

  return (
    <div className="mx-auto max-w-[1100px] px-8 py-7">
      <button
        onClick={() => navigate('/form-templates')}
        className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={13} /> Back to Form Templates
      </button>

      <h1 className="mb-5 text-xl font-semibold text-ink">New Form</h1>

      <FormWizard
        draft={draft}
        onDraftChange={(updater) => setDraft((d) => updater(d))}
        onSave={handleSave}
        saveLabel="Create Form"
        validationError={validationError}
      />
    </div>
  );
}
