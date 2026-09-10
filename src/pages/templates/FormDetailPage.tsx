import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Info, Pencil } from 'lucide-react';
import { useTemplates } from '../../store/TemplatesContext';
import { usePermission } from '../../store/PermissionContext';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';
import { FieldsTab } from './FieldsTab';
import { DocumentsTab } from './DocumentsTab';
import { PreviewModal } from './PreviewModal';
import { FormWizard } from './FormWizard';
import { canDelete, enabledFieldCount } from '../../utils/templateStats';
import type { FormTemplate } from '../../types';

export function FormDetailPage({ startInEdit }: { startInEdit?: boolean }) {
  const { id } = useParams<{ id: string }>();
  const { getTemplate, saveTemplate, setStatus, deleteTemplate } = useTemplates();
  const { canManageTemplates } = usePermission();
  const navigate = useNavigate();

  const original = id ? getTemplate(id) : undefined;
  const [draft, setDraft] = useState<FormTemplate | null>(original ?? null);
  const [tab, setTab] = useState<'details' | 'documents'>('details');
  const [editing, setEditing] = useState(!!startInEdit);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [savedNotice, setSavedNotice] = useState<{ mode: 'updated' | 'cloned'; code: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(original ?? null);
    setEditing(!!startInEdit);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!original || !draft) {
    return (
      <div className="mx-auto max-w-2xl px-8 py-16 text-center">
        <p className="text-sm text-muted">This form template doesn't exist or was deleted.</p>
        <Button className="mt-4" onClick={() => navigate('/form-templates')}>Back to Form Templates</Button>
      </div>
    );
  }

  const usedByOthers = original.usedByTransitions > 0;

  function startEdit() {
    setDraft(original ? { ...original, sections: original.sections.map((s) => ({ ...s, fields: s.fields.map((f) => ({ ...f })) })), documents: original.documents.map((d) => ({ ...d })) } : null);
    setEditing(true);
    setValidationError(null);
  }

  function cancelEdit() {
    setDraft(original);
    setEditing(false);
    setValidationError(null);
  }

  function handleSave() {
    if (!draft) return;
    if (!draft.name.trim() || draft.employmentTypes.length === 0) {
      setValidationError('Form Name and at least one Employment Type are required.');
      return;
    }
    if (enabledFieldCount(draft) < 1) {
      setValidationError('At least one field must be enabled before the form can be saved.');
      return;
    }
    const result = saveTemplate(draft);
    setEditing(false);
    setValidationError(null);
    if (result.mode === 'cloned') {
      setSavedNotice({ mode: 'cloned', code: result.template.code });
      navigate(`/form-templates/${result.template.id}`);
    } else {
      setSavedNotice({ mode: 'updated', code: result.template.code });
      navigate(`/form-templates/${result.template.id}`);
    }
  }

  const current = editing ? draft : original;

  return (
    <div className="mx-auto max-w-[1100px] px-8 py-7">
      <button
        onClick={() => navigate('/form-templates')}
        className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
      >
        <ArrowLeft size={13} /> Back to Form Templates
      </button>

      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-ink">{current.name}</h1>
            <Badge tone={current.status === 'Active' ? 'green' : 'gray'} dot>{current.status}</Badge>
          </div>
          <p className="mt-1 font-mono text-xs text-subtle">
            {current.code} · {current.employmentTypes.join(', ')}
            {usedByOthers && ` · Used by ${current.usedByTransitions} transition(s)`}
          </p>
          {current.description && (
            <p className="mt-1 max-w-xl text-xs text-muted">{current.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!editing && (
            <Button variant="outline" size="sm" icon={<Eye size={14} />} onClick={() => setPreviewOpen(true)}>
              Preview
            </Button>
          )}
          {editing ? (
            <Button variant="ghost" size="sm" onClick={cancelEdit}>Cancel</Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                icon={<Pencil size={14} />}
                disabled={!canManageTemplates}
                title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
                onClick={startEdit}
              >
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!canManageTemplates}
                title={!canManageTemplates ? 'Requires obo.template.manage permission' : undefined}
                onClick={() => setStatus(original.id, original.status === 'Active' ? 'Inactive' : 'Active')}
              >
                {original.status === 'Active' ? 'Deactivate' : 'Reactivate'}
              </Button>
              <Button
                variant="danger"
                size="sm"
                disabled={!canManageTemplates || !canDelete(original)}
                title={
                  !canManageTemplates
                    ? 'Requires obo.template.manage permission'
                    : !canDelete(original)
                      ? `Used by ${original.usedByTransitions} transition(s) — cannot be deleted`
                      : undefined
                }
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>

      {editing && usedByOthers && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning-bg px-4 py-3 text-sm text-warning">
          <Info size={16} className="mt-0.5 shrink-0" />
          <p>
            This form is used by {original.usedByTransitions} existing transition(s), so it can't be modified
            directly. Saving your changes will create a <strong>new form template with a new code</strong> —
            the original ({original.code}) stays unchanged and remains attached to its existing transitions.
          </p>
        </div>
      )}

      {savedNotice && !editing && (
        <div className="mb-5 flex items-center justify-between gap-2.5 rounded-xl border border-success/30 bg-success-bg px-4 py-3 text-sm text-success">
          <span>
            {savedNotice.mode === 'cloned'
              ? `Saved as a new form template — ${savedNotice.code}.`
              : `Changes saved to ${savedNotice.code}.`}
          </span>
          <button onClick={() => setSavedNotice(null)} className="text-xs font-medium underline">Dismiss</button>
        </div>
      )}

      {editing ? (
        <FormWizard
          draft={draft}
          onDraftChange={(updater) => setDraft((d) => (d ? updater(d) : d))}
          onSave={handleSave}
          saveLabel="Save"
          showCode
          validationError={validationError}
        />
      ) : (
        <>
          <div className="mb-5 flex items-center gap-1 rounded-lg border border-border bg-white p-1 w-fit">
            {(
              [
                { id: 'details' as const, label: 'Candidate Details' },
                { id: 'documents' as const, label: 'Required Documents' },
              ]
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                  tab === t.id ? 'bg-primary text-primary-dark' : 'text-ink-soft hover:bg-black/5'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'details' ? (
            <FieldsTab sections={current.sections} readOnly onChange={() => {}} />
          ) : (
            <DocumentsTab documents={current.documents} readOnly onChange={() => {}} />
          )}
        </>
      )}

      {previewOpen && <PreviewModal template={current} onClose={() => setPreviewOpen(false)} />}

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete form template?"
        description={`"${original.name}" (${original.code}) will be permanently removed. This cannot be undone.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteTemplate(original.id);
                navigate('/form-templates');
              }}
            >
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
}
