import { useMemo, useRef, useState } from 'react';
import { X, Plus, Trash2, UploadCloud, Save } from 'lucide-react';
import { FIELD_CATALOG } from '../../data/fieldCatalog';
import { PortalField } from '../../components/portal/PortalField';
import { Button } from '../../components/ui/Button';
import {
  ACCEPTED_DOCUMENT_FORMATS,
  DOCUMENT_SIZE_LIMIT_MB,
} from '../../types';
import type { FormTemplate } from '../../types';

const LIMIT_BYTES = DOCUMENT_SIZE_LIMIT_MB * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function extOf(name: string) {
  return name.split('.').pop()?.toUpperCase() ?? '';
}

interface EmergencyEntry {
  id: string;
  contactName: string;
  contactNumber: string;
  relationship: string;
}

interface ChildEntry {
  id: string;
  name: string;
  dob: string;
}

export function PreviewModal({ template, onClose }: { template: FormTemplate; onClose: () => void }) {
  const [tab, setTab] = useState<'form' | 'documents'>('form');
  const [civilStatus, setCivilStatus] = useState<'Single' | 'Married'>('Single');

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/50">
      <div className="mx-auto my-4 flex w-full max-w-4xl flex-1 flex-col overflow-hidden rounded-2xl bg-page shadow-2xl">
        <div className="flex items-center justify-between border-b border-border bg-white px-5 py-3">
          <div>
            <p className="text-xs text-subtle">Candidate Preview</p>
            <p className="text-sm font-semibold text-ink">{template.name}</p>
          </div>
          <div className="flex items-center gap-3">
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
            <button onClick={onClose} className="rounded-md p-1.5 hover:bg-black/5">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-2 border-b border-border bg-white px-5 py-3">
          {[
            { id: 'form' as const, label: 'Employee Data Form' },
            { id: 'documents' as const, label: 'Required Documents' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                tab === t.id ? 'bg-primary text-white' : 'bg-black/5 text-ink-soft hover:bg-black/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          {tab === 'form' ? (
            <FormPreview template={template} civilStatus={civilStatus} />
          ) : (
            <DocumentsPreview template={template} />
          )}
        </div>
      </div>
    </div>
  );
}

function FormPreview({ template, civilStatus }: { template: FormTemplate; civilStatus: 'Single' | 'Married' }) {
  const [contacts, setContacts] = useState<EmergencyEntry[]>([]);
  const [draft, setDraft] = useState({ contactName: '', contactNumber: '', relationship: '' });
  const [children, setChildren] = useState<ChildEntry[]>([]);

  const enabledSections = FIELD_CATALOG.map((sectionDef) => {
    const config = template.sections.find((s) => s.sectionId === sectionDef.id);
    return { sectionDef, config };
  }).filter((s) => s.config?.enabled);

  function fieldState(sectionId: string, fieldId: string) {
    const sec = template.sections.find((s) => s.sectionId === sectionId);
    return sec?.fields.find((f) => f.fieldId === fieldId)?.state ?? 'hidden';
  }

  function addContact() {
    if (!draft.contactNumber && !draft.contactName) return;
    setContacts((c) => [...c, { id: `c-${Date.now()}`, ...draft }]);
    setDraft({ contactName: '', contactNumber: '', relationship: '' });
  }

  function addChild() {
    setChildren((c) => [...c, { id: `ch-${Date.now()}`, name: '', dob: '' }]);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink">Let's Get To Know You Better</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Welcome to the team! We're so excited to have you on board. To make your onboarding as smooth as
          possible, let's get your profile set up together.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
        {enabledSections.map(({ sectionDef }) => {
          if (sectionDef.conditional === 'insurance') {
            const groupFields =
              civilStatus === 'Single'
                ? sectionDef.fields.filter((f) => f.id.startsWith('parent'))
                : sectionDef.fields.filter((f) => f.id.startsWith('spouse'));
            const childrenState = fieldState('insurance', 'children');
            return (
              <div key={sectionDef.id}>
                <h2 className="mb-3 text-sm font-semibold text-ink">
                  Insurance Details — {civilStatus === 'Single' ? 'Parents' : 'Spouse & Children'}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {groupFields.map((f) => (
                    <PortalField key={f.id} field={f} state={fieldState('insurance', f.id)} />
                  ))}
                </div>
                {civilStatus === 'Married' && childrenState !== 'hidden' && (
                  <div className="mt-4 rounded-xl border border-border-soft p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">
                        Children
                        {childrenState === 'required' && <span className="ml-0.5 text-danger">*</span>}
                      </p>
                      <Button size="sm" variant="outline" icon={<Plus size={13} />} onClick={addChild}>
                        Add Child
                      </Button>
                    </div>
                    {children.length === 0 ? (
                      <p className="text-xs text-subtle">No children added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {children.map((c) => (
                          <div key={c.id} className="flex items-center gap-2 rounded-lg border border-border-soft px-3 py-2">
                            <span className="flex-1 text-sm text-ink-soft">Child entry — {c.id.slice(-4)}</span>
                            <button
                              onClick={() => setChildren((list) => list.filter((x) => x.id !== c.id))}
                              className="rounded-md border border-danger/40 px-2 py-1 text-xs font-medium text-danger hover:bg-danger-bg"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          }

          if (sectionDef.id === 'emergency') {
            return (
              <div key={sectionDef.id}>
                <h2 className="mb-3 text-sm font-semibold text-ink">Emergency Contact</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {sectionDef.fields.map((f) => {
                    const state = fieldState('emergency', f.id);
                    if (state === 'hidden') return null;
                    const key = f.id as keyof typeof draft;
                    return (
                      <div key={f.id}>
                        <label className="mb-1.5 block text-sm font-medium text-ink">
                          {f.label}
                          {state === 'required' && <span className="ml-0.5 text-danger">*</span>}
                        </label>
                        <input
                          value={draft[key]}
                          onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                          placeholder={f.label}
                          className="w-full rounded-lg border border-border bg-black/[0.02] px-3 py-2 text-sm outline-none focus:border-primary focus:bg-white"
                        />
                      </div>
                    );
                  })}
                </div>
                <Button size="sm" variant="outline" icon={<Plus size={13} />} className="mt-3" onClick={addContact}>
                  Add Contact
                </Button>
                {contacts.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {contacts.map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-border-soft px-3 py-2 text-sm">
                        <span className="font-medium text-ink">{c.contactNumber || c.contactName || 'Contact'}</span>
                        <span className="text-ink-soft">{c.relationship}</span>
                        <button
                          onClick={() => setContacts((list) => list.filter((x) => x.id !== c.id))}
                          className="rounded-md border border-danger/40 px-2 py-1 text-xs font-medium text-danger hover:bg-danger-bg"
                        >
                          Delete Contact
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <div key={sectionDef.id}>
              <h2 className="mb-3 text-sm font-semibold text-ink">{sectionDef.name}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {sectionDef.fields.map((f) => (
                  <PortalField
                    key={f.id}
                    field={f}
                    state={fieldState(sectionDef.id, f.id)}
                    span2={f.kind === 'textarea'}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {enabledSections.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">
            No sections are enabled yet — turn on at least one section in the Fields tab.
          </p>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button icon={<Save size={15} />} disabled>Save Details</Button>
      </div>
    </div>
  );
}

function DocumentsPreview({ template }: { template: FormTemplate }) {
  const [files, setFiles] = useState<Record<string, File[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const sorted = useMemo(() => [...template.documents].sort((a, b) => a.order - b.order), [template.documents]);

  function totalBytes(docId: string) {
    return (files[docId] ?? []).reduce((sum, f) => sum + f.size, 0);
  }

  function handleFiles(docId: string, incoming: FileList | null, multiple: boolean) {
    if (!incoming || incoming.length === 0) return;
    const incomingArr = Array.from(incoming);
    setErrors((e) => ({ ...e, [docId]: '' }));

    const badFormat = incomingArr.find((f) => !ACCEPTED_DOCUMENT_FORMATS.includes(extOf(f.name)));
    if (badFormat) {
      setErrors((e) => ({
        ...e,
        [docId]: `"${badFormat.name}" isn't an accepted format. Accepted: ${ACCEPTED_DOCUMENT_FORMATS.join(', ')}.`,
      }));
      return;
    }

    const existing = files[docId] ?? [];
    const existingTotal = existing.reduce((sum, f) => sum + f.size, 0);
    const incomingTotal = incomingArr.reduce((sum, f) => sum + f.size, 0);

    if (existingTotal + incomingTotal > LIMIT_BYTES) {
      setErrors((e) => ({
        ...e,
        [docId]: `That would exceed the ${DOCUMENT_SIZE_LIMIT_MB} MB combined limit for this field. Existing files were kept.`,
      }));
      return;
    }

    setFiles((f) => ({
      ...f,
      [docId]: multiple ? [...existing, ...incomingArr] : incomingArr.slice(0, 1),
    }));
  }

  function removeFile(docId: string, name: string) {
    setFiles((f) => ({ ...f, [docId]: (f[docId] ?? []).filter((file) => file.name !== name) }));
    setErrors((e) => ({ ...e, [docId]: '' }));
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink">Upload Your Documents</h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          To get your contract finalized, we just need a few digital copies of your documents. You can snap a
          clear photo with your phone or upload PDFs.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
        {sorted.length === 0 && (
          <p className="py-10 text-center text-sm text-muted">No documents are required for this form.</p>
        )}
        {sorted.map((doc) => {
          const used = totalBytes(doc.id);
          const list = files[doc.id] ?? [];
          return (
            <div key={doc.id} className="border-b border-border-soft pb-5 last:border-b-0 last:pb-0">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-ink">
                  {doc.name}
                  {doc.requirement === 'required' && <span className="ml-0.5 text-danger">*</span>}
                </label>
                <span className="text-xs text-subtle">
                  {formatBytes(used)} / {DOCUMENT_SIZE_LIMIT_MB} MB
                </span>
              </div>

              <input
                ref={(el) => {
                  inputRefs.current[doc.id] = el;
                }}
                type="file"
                multiple={doc.multiple}
                accept=".pdf,.png,.jpg,.jpeg,.docx"
                className="hidden"
                onChange={(e) => {
                  handleFiles(doc.id, e.target.files, doc.multiple);
                  e.target.value = '';
                }}
              />

              {doc.multiple ? (
                <button
                  onClick={() => inputRefs.current[doc.id]?.click()}
                  className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-black/[0.02] py-6 text-xs text-subtle hover:border-primary hover:text-primary"
                >
                  <UploadCloud size={20} />
                  Click to select files
                </button>
              ) : (
                <button
                  onClick={() => inputRefs.current[doc.id]?.click()}
                  className="flex items-center gap-2 rounded-lg border border-border bg-black/[0.02] px-3 py-2 text-sm text-ink-soft hover:border-primary"
                >
                  <span className="rounded-md bg-white px-2 py-1 text-xs font-medium shadow-sm">Choose File</span>
                  {list[0]?.name ?? 'No file chosen'}
                </button>
              )}

              {errors[doc.id] && <p className="mt-1.5 text-xs text-danger">{errors[doc.id]}</p>}

              {list.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {list.map((f) => (
                    <div key={f.name} className="flex items-center justify-between rounded-lg bg-black/[0.03] px-3 py-1.5 text-xs">
                      <span className="truncate text-ink-soft">{f.name} · {formatBytes(f.size)}</span>
                      <button onClick={() => removeFile(doc.id, f.name)} className="text-danger hover:text-danger">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-end">
        <Button icon={<Save size={15} />} disabled>Submit Documents</Button>
      </div>
    </div>
  );
}
